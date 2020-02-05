import {GHTMLControl, GDataObject, GHTMLInputEvent} from "../../glider/glider"








const view = `
any
    DIV class=columns is-mobile style=margin-bottom: 0;
        DIV class=column is-narrow
            LABEL gid=label
        DIV class=column
            INPUT gid=search name=term style=width:100% gdelay=800
    DIV gid=items 
`


export interface SearchInputParameters{
    rootId: string,
    label: string,
}




export class SearchInput extends GHTMLControl {



    bindingStore: Data
    private callBack:Function
    private _name:string
    private _options: Array<string> = []
    private _value: string = ""



    constructor(p:SearchInputParameters) { 
        super({view:view, root:p.rootId, bindToLocal:new Data()}) 
        this.e.label.textContent = p.label
    }  




    delayedInput():void{
        this.dispatchEvent("input", this.bindingStore.term)
    }




    get value():string{    
        return(this._value)
    }




    get opts():Array<string>{
        return(this._options)
    }




    upData(options: Array<string>){
        this._options = options
        while (this.e.items.childNodes.length > 0) { this.e.items.childNodes[0].remove() }
        options.forEach((opt:string)=>{
            let btn = this.e.items.add("button", {
                "class": "button is-rounded is-capitalized", 
                "value" : opt,
                "style" : "margin: 0.2rem;"
            })
            btn.textContent = opt
            btn.addEventListener("click", this.select.bind(this))
        })

    }




    select(e:Event){
        let t = <HTMLButtonElement>e.target
        this._value = t.value
        this.dispatchEvent("selected", t.value)
    }




    clear():void{
        this.bindingStore.term = ""
        this.up()
    }

}







class Data extends GDataObject {
    
    control: SearchInput
    term: string = ""



    input(event:GHTMLInputEvent):void{
        this.control.delayedInput()
    }

}