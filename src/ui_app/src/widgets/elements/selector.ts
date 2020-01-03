import {GHTMLControl, GDataObject, GHTMLInputEvent} from "../../glider/glider"








const view = `
any
  DIV class=field
    DIV class=columns is-mobile
      DIV class=column is-one-quarter
        LABEL gid=label class=is-left is-capitalized
      DIV class=column
        SELECT gid=selector class=input is-capitalized name=value
`


export interface SelectorParameters{
    rootId: string,
    name: string,
    inputCall: Function,
    options: Array<any>,
    label?: string,
    value?: string
}




export class Selector extends GHTMLControl {



    bindingStore: SelectorData
    private callBack:Function
    private _name:string
    selector:HTMLSelectElement




    constructor(p:SelectorParameters) {
        super({view:view, root:p.rootId, bindToLocal:new SelectorData()})
        this.e.label.textContent = p.label
        this._name = p.name
        this.callBack = p.inputCall
        this.bindingStore.value_options = p.options

        /*p.options.forEach((val:string)=>{
            this.e.selector.add("option", {"value": val}).textContent = val
        })*/
        if(p.value){    this.selector.value = p.value    }
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







class SelectorData extends GDataObject {
    
    value: string = ""
    value_options: Array<string> = []
}