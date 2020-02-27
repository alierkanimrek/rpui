import {GHTMLControl, GDataObject, GHTMLInputEvent, ValidityMessages} from "../glider/glider"
import {GetText} from "../i18n/gettext"
import {Port, Connection, ResponseHandler, ErrorHandler} from "../components/connection"
import {RpStack} from "../components/msg"
import {SendButton} from "../widgets/elements/sendbutton"

const name = "invite"







let View = `
any
    DIV class=tile is-child box
        P gid=title class=title is-size-6
        DIV class=field
            P class=control has-icons-left has-icons-right 
                LABEL gid=email class=is-left
            P class=control has-icons-left has-icons-right
                INPUT gid=emailInput class=input type=email name=email required=true gdelay=500
                SPAN class=icon is-small is-left
                    i class=fas fa-envelope
                SPAN class=icon is-small is-right
                    i class=fas fa-ban gid=emailStatus
            P class=control has-icons-left 
                LABEL gid=emailMsg class=is-left has-text-danger is-size-6 has-text-weight-light
        DIV gid=btnContainer
`




const classSpinnerSpin = "fas fa-spinner fa-spin"
const classSpinner = "fas fa-spinner"
const classOk = "fas fa-check"
const classBan = "fas fa-ban"






export class Invite extends GHTMLControl {




	bindingStore:InviteData
    _: Function
    sendButton: SendButton
    emailInput:HTMLInputElement
    email_validityMessages:ValidityMessages



    constructor(rootId:string) {
        super({view:View, bindTo:name, root:rootId})
        let trns = this.store("trns").t.translations(name)
        this._ = trns.get_()
        trns.updateStatics(this)
        
        this.email_validityMessages = this.store("trns").getValidityMessages(name, "email")
        
        this.sendButton = new SendButton({
            rootId: this.e.btnContainer.id,
            clickCall: this.update.bind(this),
            buttonLabel: this._("submitBtn"),
            sendingMsg: this._("submitMsg"),
            successMsg: this._("submitReady"),
            errorMsg: this._("submitError"),
            classx: "button is-block is-info is-fullwidth is-medium"
        })

    }





    input(event:GHTMLInputEvent):void{
        /*
            Form input controls
        */
        let emailCheckResult = (status:boolean)=>{
            if(status){
                if(this.emailInput.validity.valid){
                    this.emailInput.setCustomValidity(this._("email_customError"))
                }
                this.e.emailStatus.className = classBan
            }
            else{
                this.e.emailStatus.className = classOk
            }
            this.e.emailMsg.innerText = this.emailInput.validationMessage
        }
        
        if(this.emailInput.validity.valid){
            this.e.emailStatus.className = classSpinnerSpin
            this.bindingStore.checkEmail(emailCheckResult)
        }
        else{
            emailCheckResult(true)
        }
    }




    update(e:Event){

        let saved = (status:boolean, msg?:string)=>{
            if(status){
                this.sendButton.success()
            }
            else{
                this.sendButton.error()
            }
        }

        this.bindingStore.send(saved.bind(this))
    }
}








export class InviteData extends GDataObject {




    email: string = ""
    


    send(cb:Function):void{

        let response:ResponseHandler = (stack:RpStack) => {
            cb(stack.dataVar("result"))    
        }

        let error:ErrorHandler = (msg:string) => {
            cb(false, msg)    
        }

        let conn = new Connection({
            port:Port.invite, 
            name:name, 
            responseHandler:response,
            errorHandler:error})

        conn.run({ObjectData: {"email": this.email}})
    }



    checkEmail(getStatus:Function):void{
        
        let response:ResponseHandler = (stack:RpStack) => {
            getStatus(stack.dataVar("result"))    
        }

        let conn = new Connection({
            port:Port.ucheck, 
            name:name, 
            responseHandler:response})
        conn.run({ObjectData: {"type":"email", "data":this.email}})
    }

}
