/*
    The MIT License:

    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and 
    associated documentation files (the "Software"), to deal in the Software without restriction, 
    including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
    and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
    subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all copies or substantial 
    portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT 
    NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
    IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
    WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION 
    WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

    Copyright 2019,2020 Ali Erkan IMREK <alierkanimrek@gmail.com>
*/








import {GHTMLControl} from "../../glider/glider"






const view = `
any
    BUTTON gid=submit type=button
    | Button
    P gid=submitStatus class=has-icons-left has-icons-left 
        SPAN class=icon is-left
            I gid=submitStatusIcon class=fas fa-spinner fa-spin 
        LABEL gid=submitMsg class=is-right
        | Please wait...
`




const classSpinnerSpin = "fas fa-spinner fa-spin"
const classSpinner = "fas fa-spinner"
const classOk = "fas fa-check"
const classBan = "fas fa-ban"





export interface SendButtonParameters{
    rootId: string,
    clickCall: Function,
    successCb?: Function,
    errorCb?: Function,
    buttonLabel?: string,
    sendingMsg?: string,
    successMsg?: string,
    errorMsg?: string,
    disabled?: boolean,
    classx?: string
}





export class SendButton extends GHTMLControl {




    submitStatus: HTMLElement
    submit: HTMLButtonElement
    nname: HTMLInputElement
    submitStatusIcon: HTMLElement
    submitMsg: HTMLElement


    parm: SendButtonParameters 

    emap: any = [
        [this.submit, "click", this.send],
    ]





    constructor(p:SendButtonParameters) {
        super({view:view, root:p.rootId})

        this.parm =  {
            rootId: "",
            clickCall: this.fakeCb,
            successCb: this.fakeCb,
            errorCb: this.fakeCb,
            buttonLabel: "Send",
            sendingMsg: "Sending...",
            successMsg: "Success",
            errorMsg: "Error",
            disabled: false,
            classx: ""
        }
        Object.assign(this.parm, p)
        this.linkEvents(this.emap)
        this.submitStatus.style.visibility = "hidden"
        this.submitStatus.style.height = "0"
        this.submit.className = this.parm.classx
        this.submit.textContent = this.parm.buttonLabel
    }




    private fakeCb(){}



    send(e:Event):void{
        if(this.parm.disabled){    return    }
        this.submit.style.visibility = "hidden"
        this.submit.style.height = "0"
        this.submitStatus.style.visibility = "visible"
        this.submitStatus.style.height = ""
        this.submitStatusIcon.className = classSpinnerSpin
        this.submitMsg.textContent = this.parm.sendingMsg
        this.parm.clickCall()
    }




    private restore(status:boolean):void{
        this.submit.style.visibility = "visible"
        this.submit.style.height = ""
        this.submitStatus.style.visibility = "hidden"
        this.submitStatus.style.height = "0"
        if(status){    this.parm.successCb()    }
        else{    this.parm.errorCb()    }
    }




    public success(cb?:Function):void{
        this.submitStatusIcon.className = classOk + " has-text-success"
        this.submitMsg.className = " has-text-success"
        this.submitMsg.textContent = this.parm.successMsg
        if(cb){    this.parm.successCb = cb    }
        setTimeout(this.restore.bind(this, true), 1500)
    }




    public error(cb?:Function):void{
        this.submitStatusIcon.className = classBan + " has-text-danger"
        this.submitMsg.className = " has-text-danger"
        this.submitMsg.textContent = this.parm.errorMsg
        if(cb){    this.parm.errorCb = cb    }
        setTimeout(this.restore.bind(this, false), 3000)
    }




    public set disabled(v:boolean){
        this.parm.disabled = v
    }

}


