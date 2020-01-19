import {GHTMLControl, GDataObject, GHTMLInputEvent} from "../../glider/glider"








const view = `
any
    DIV class=columns is-mobile
        DIV class=column is-narrow
            LABEL gid=label
        DIV class=column
            INPUT gid=select name=value style=width:100% gdelay=800
            DATALIST gid=vlist name=vlist style=visibility:hidden; height:0px;
        DIV class=column is-narrow
            BUTTON gid=button class=button is-success
`


export interface SearchInputParameters{
    rootId: string,
    label: string,
    buttonLabel: string
}




export class SearchInput extends GHTMLControl {



    bindingStore: Data
    private callBack:Function
    private _name:string




    constructor(p:SearchInputParameters) { 
        super({view:view, root:p.rootId, bindToLocal:new Data()}) 
        this.e.label.textContent = p.label
        this.e.button.textContent = p.buttonLabel
        this.e.select.setAttribute("list", this.e.vlist.id)
        //this.e.select.list = this.e.vlist.id
        //if(p.inputCallback){    this.callBack = p.inputCallback    }
        //else{    this.callBack = (e:any)=>{}    }
        this.up()
        this.linkEvents([[this.e.button, "click", this.btnClck]])
    }  




    delayedInput():void{
        this.dispatchEvent("input", this.bindingStore.value)
    }




    get value():string{    
        return(this.bindingStore.value)
    }



    btnClck(e:Event){
        this.dispatchEvent("selected", this.bindingStore.value)
    }



    upData(names: Array<string>){
        this.e.vlist.childNodes.forEach((cn:ChildNode)=>{
            this.e.vlist.removeChild(cn)
        })
        names.forEach((opt:string)=>{
            this.e.vlist.add("option", {"value": opt}).textContent = opt})
    }

}







class Data extends GDataObject {
    
    control: SearchInput
    value: string = ""



    input(event:GHTMLInputEvent):void{
        this.control.delayedInput()
    }

}