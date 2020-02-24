import {GHTMLControl, GDataObject, GHTMLInputEvent, ValidityMessages} from "../glider/glider"
import {GetText} from "../i18n/gettext"
import {Port, Connection, ResponseHandler, ErrorHandler} from "../components/connection"
import {RpStack} from "../components/msg"
import {SearchInput} from "../widgets/elements/searchinput"
import {SendButton} from "../widgets/elements/sendbutton"

const name = "ugroup"








let View = `
any
    DIV class=tile is-child
        P gid=title class=title is-size-6
        DIV class=columns is-multiline
            DIV gid=searchContainer class=column style=min-width:45%;
            DIV gid=optsContainer class=column style=min-width:45%;
                DIV class=columns is-mobile is-1
                    DIV class=column
                        LABEL gid=uname class=title is-size-5 is-capitalized
                    DIV class=column
                        DIV class=field
                            LABEL class=checkbox
                                INPUT gid=adminChkBox name=admin type=checkbox 
                                SPAN gid=adminChkBoxLabel
                    DIV class=column
                        DIV class=field
                            LABEL class=checkbox
                                INPUT gid=modChkBox name=moderator type=checkbox 
                                SPAN gid=modChkBoxLabel
                    DIV class=column
                        DIV class=field
                            LABEL class=checkbox
                                INPUT gid=tstChkBox name=tester type=checkbox 
                                SPAN gid=tstChkBoxLabel
        DIV gid=btnContainer
`








export class UGroup extends GHTMLControl {




	bindingStore:UGroupData
    _: Function
    search1: SearchInput
    sendButton: SendButton



    constructor(rootId:string) {
        super({view:View, bindTo:name, root:rootId})
        let emap = []
        let trns = this.store("trns").t.translations(name)
        this._ = trns.get_()
        trns.updateStatics(this)

        this.search1 = new SearchInput({
            rootId: this.e.searchContainer.id,
            label: this._("search1Label")
        })
        emap.push([this.search1, "selected", this.search1Selected])
        emap.push([this.search1, "input", this.search1Input])

        this.linkEvents(emap)

        this.sendButton = new SendButton({
            rootId: this.e.btnContainer.id,
            clickCall: this.update.bind(this),
            buttonLabel: this._("sendBtnLabel"),
            sendingMsg: this._("sending"),
            successMsg: this._("updateSuccess"),
            errorMsg: this._("updateError"),
            classx: "button is-block is-info is-fullwidth is-medium"
        })

    }




    search1Input(value:string){
        this.search1.clear()
        let loaded = (unamelist:Array<string>) =>{
            this.search1.upData(unamelist)
        }
        if(value && value.length > 2){
            this.bindingStore.searchUser(value, loaded.bind(this), "all")
        }
    }    





    search1Selected(uname:string){
        //this.bindingStore.addUserList(value)
        //
        let loaded = () =>{
            this.e.uname.textContent = uname
        }

        this.bindingStore.getUserGroup(uname, loaded.bind(this))
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

        this.bindingStore.save(saved.bind(this))
    }


}








export class UGroupData extends GDataObject {




    admin: boolean = false
    moderator: boolean = false
    tester: boolean = false
    uname: string = ""




    searchUser(term:string, cb:Function, mode:string):void{

        let response:ResponseHandler = (stack:RpStack) => {
            if(stack.dataVar("namelist")){
                cb(stack.dataVar("namelist"))
            }
        }

        let error:ErrorHandler = (msg:string) => {
            console.log(msg)    
        }

        let conn = new Connection({
            port:Port.srcusr, 
            name:name, 
            responseHandler:response,
            errorHandler:error})

        conn.run({ObjectData: {"term": term, "mode": mode}})
    }




    getUserGroup(uname:string, cb:Function):void{

        this.admin = false
        this.moderator = false
        this.tester = false
        this.uname = ""

        let response:ResponseHandler = (stack:RpStack) => {
            if(stack.dataVar("result")){
                this.uname = uname
                if(stack.dataVar("groups").indexOf("ad") > -1){    
                    this.admin = true
                }
                if(stack.dataVar("groups").indexOf("md") > -1){    
                    this.moderator = true
                }
                if(stack.dataVar("groups").indexOf("ts") > -1){    
                    this.tester = true
                }
                this.up()
                cb()
            }
        }

        let error:ErrorHandler = (msg:string) => {
            console.log(msg)    
        }

        let conn = new Connection({
            port:Port.getugrp, 
            name:name, 
            responseHandler:response,
            errorHandler:error})

        conn.run({ObjectData: {"uname": uname}})
    }





    save(cb:Function):void{

        let response:ResponseHandler = (stack:RpStack) => {
            cb(stack.dataVar("result"))    
        }

        let error:ErrorHandler = (msg:string) => {
            cb(false, msg)    
        }

        let data = {
            "uname": this.uname, 
            "ad":this.admin, 
            "md": this.moderator,
            "ts": this.tester
        }

        let conn = new Connection({
            port:Port.upugrp, 
            name:name, 
            responseHandler:response,
            errorHandler:error})

        conn.run({ObjectData: data})
    }

}
