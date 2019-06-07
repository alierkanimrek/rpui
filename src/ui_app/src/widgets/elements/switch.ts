import {GHTMLControl} from "../../glider/glider"








const view = `
any
    DIV class=field has-addons
        DIV class=tile is-ancestor
            DIV class=tile
                A class=button is-small is-text gid=left
            DIV class=tile
                A class=button is-small is-light gid=right

`


const LeftON = "button is-success is-small"
const LeftOFF = "button is-text is-small"
const RightON = "button is-text is-small"
const RightOFF = "button is-light is-small"





export class Switch extends GHTMLControl {





    left:HTMLButtonElement
    right:HTMLButtonElement
    _checked:boolean = false
    freeze:boolean = false

    eventMap: any = [
        [this.left, "click", this.toggle],
        [this.right, "click", this.toggle]
    ]




    constructor(rootId:string) {
        super({view:view, root:rootId})
        this.linkEvents(this.eventMap)
    }



    private toggle(e?:Event):void{
        if(this.freeze){    return    }
        if(!this._checked){
            this.left.className = LeftON
            this.right.className = RightON
            this._checked = true
        }
        else{
            this.left.className = LeftOFF
            this.right.className = RightOFF
            this._checked = false
        }
        this.dispatchEvent("change", this)
    }




    set checked(checked:boolean){
        if(checked != this._checked){
            this.toggle()
        }
    }



    get checked():boolean{
        return(this._checked)
    }
}

