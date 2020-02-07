import {GHTMLControl, GDataObject, GHTMLInputEvent} from "../../glider/glider"








const view = `
any
    DIV gid=items 
`






export class ButtonSelect extends GHTMLControl {



    private callBack:Function
    private _options: Array<string> = []
    private _value: string = ""
    private _last: HTMLButtonElement



    constructor(rootId:string) { 
        super({view:view, root:rootId}) 
    }  




    get value():string{    
        return(this._value)
    }




    get options():Array<string>{
        return(this._options)
    }




    set options(options: Array<string>){
        this._options = options
        this.clear()
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
        if(this._last){
            this._last.className = "button is-rounded is-capitalized"
        }
        this._last = <HTMLButtonElement>e.target
        this._last.className = "button is-rounded is-capitalized is-light" 
        this._value = this._last.value
        this.dispatchEvent("selected", this._last.value)
    }




    clear():void{
        while (this.e.items.childNodes.length > 0) { this.e.items.childNodes[0].remove() }
    }

}
