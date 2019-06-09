import {GHTMLControl, GDataObject} from "../../glider/glider"
import {Translator} from "../../i18n/gettext"

/*
    This widget should make auto generate the language button list
    So need to development
*/










const view = `
mainMenuContainer
  DIV class = tile is-parent
    DIV class = tile is-child box
      P class=title is-5 id=mainMenuLgTitle
      DIV
        TABLE class=table is-fullwidth style=margin: 0;
          TBODY
            TR
              TD style=width: 100%; vertical-align: middle; padding-bottom:0;
                LABEL gid=enLabel
                ^ English
              TD style=padding-bottom:0;
                A class=button is-light gid=enButton value=en-us
                ^ English
        TABLE class=table is-fullwidth style=margin: 0;
          TBODY
            TR
              TD style=width: 100%; vertical-align: middle; padding-top:0;
                LABEL gid=trLabel
                ^ Türkçe
              TD style=padding-bottom:0;
                A class=button is-light gid=trButton value=tr-tr
                ^ Turkish

`




const Selected="button is-success"
const Unselect="button is-light"








export class LangMenuItem extends GHTMLControl {





    trns:Translator

    enButton:HTMLButtonElement
    enLabel:HTMLLabelElement
    trButton:HTMLButtonElement
    trLabel:HTMLLabelElement

    eventMap: any = [
        [this.enButton, "click", this.toggle],
        [this.trButton, "click", this.toggle]
    ]




    constructor() {
        super({view:view})
        this.trns = this.gDoc.gData("trns").t
        this.trns.addEventListener("change", this.langChanged.bind(this))

        this.update()
        this.linkEvents(this.eventMap)        
    }



    private update():void{
        this.trButton.className = Unselect
        this.enButton.className = Unselect
        switch (this.trns.current) {
            case "tr-tr":
                this.trButton.className = Selected
                break;
            case "en-us":
                this.enButton.className = Selected
                break;
        }

    }




    private langChanged(e:Translator):void{
        this.update()
    }




    private toggle (e:MouseEvent):void{
        let t = <HTMLButtonElement>e.target
        let value = t.getAttribute("value")
        this.trns.change(value)
    }


}
