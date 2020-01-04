import {GHTMLControl, GDataObject, GHTMLInputEvent} from "../../glider/glider"








const view = `
any
  DIV class=field
    DIV class=columns is-mobile
      DIV class=column is-one-quarter
        LABEL gid=label class=is-left is-capitalized
      DIV class=column
        INPUT gid=inputt class=input type=text name=value
`


export interface InputParameters{
    rootId: string,
    name: string,
    inputCall: Function,
    label?: string,
    value?: string
}




export class TxtInput extends GHTMLControl {



    bindingStore: TxtInputData
    private callBack:Function
    private _name:string




    constructor(p:InputParameters) { 
        super({view:view, root:p.rootId, bindToLocal:new TxtInputData()}) 
        this.e.label.textContent = p.label
        this._name = p.name
        this.callBack = p.inputCall
        if(p.value){    this.bindingStore.value = p.value    }
        this.up()
    }  




    input(event:GHTMLInputEvent):void{
        this.callBack(event)
    }




    get name():string{    
        return(this._name)
    }




    get value():string{    
        return(this.bindingStore.value)
    }


}







class TxtInputData extends GDataObject {
    
    value: string = ""
}