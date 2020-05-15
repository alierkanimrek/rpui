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








import {GHTMLControl, GDataObject} from "../../glider/glider"
import {Translator} from "../../i18n/gettext"

/*
    This widget should make auto generate the language button list
    So need to development
*/










const view = `
mainMenuContainer
  DIV class=tile is-parent style=min-width:33%
    DIV class=tile is-child box
      P class=title is-5 id=mainMenuLgTitle
      DIV
        TABLE class=table is-fullwidth style=margin: 0;
          TBODY
            TR
              TD style=width: 100%; vertical-align: middle; padding-bottom:0;
                LABEL gid=enLabel
                | English
              TD style=padding-bottom:0;
                A class=button is-light gid=enButton value=en-us
                | English
`



const Selected="button is-success"
const Unselect="button is-light"








export class LangMenuItem extends GHTMLControl {





    trns:Translator

    enButton:HTMLButtonElement
    enLabel:HTMLLabelElement
    //trButton:HTMLButtonElement
    //trLabel:HTMLLabelElement

    eventMap: any = [
        [this.enButton, "click", this.toggle],
        //[this.trButton, "click", this.toggle]
    ]




    constructor() {
        super({view:view})
        this.trns = this.gDoc.gData("trns").t
        this.trns.addEventListener("change", this.langChanged.bind(this))

        this.update()
        this.linkEvents(this.eventMap)        
    }



    private update():void{
        //this.trButton.className = Unselect
        this.enButton.className = Unselect
        switch (this.trns.current) {
            case "tr-tr":
                //this.trButton.className = Selected
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
