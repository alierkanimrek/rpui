import {GHTMLControl} from "../../glider/glider"








const view = `
any
    DIV class=field has-addons
        DIV class=tile is-ancestor
            DIV class=tile
                A class=button is-text gid=left
            DIV class=tile
                A class=button is-light gid=right

`


const LeftON = "button is-success"
const LeftOFF = "button is-text"
const RightON = "button is-text"
const RightOFF = "button is-light"





export class Switch extends GHTMLControl {




    left:HTMLButtonElement
    right:HTMLButtonElement
    _checked:boolean = false

    emap: any = [
        [this.left, "click", this.toggle],
        [this.right, "click", this.toggle]
    ]




    constructor(rootId:string) {
        super({view:view, root:rootId})
        this.linkEvents(this.emap)
    }



    private toggle(e?:Event):void{
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
    }




    set checked(checked:boolean){
        this._checked = checked
        this.toggle()
    }



    get checked():boolean{
        return(this._checked)
    }
}

