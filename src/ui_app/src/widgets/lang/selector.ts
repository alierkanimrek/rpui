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








import {GHTMLControl, GDataObject, GHTMLInputEvent} from "../../glider/glider"
import {Translator} from "../../i18n/gettext"
//import "./selector.css"



const name = "langselector"





const view = `
any
  DIV class=select
    SELECT gid=langSelectorSelect name=lang

`








export class LangSelector extends GHTMLControl {



    langSelectorSelect:HTMLInputElement
	bindingStore:LangSelectorData
    trns:Translator

    



    constructor(rootId:string) {
        super({view:view, root:rootId, bindTo:name})
        this.trns = this.gDoc.gData("trns").t


        let options = ["any"]


        this.trns.names.forEach((s:string)=>{
            let val = this.trns.id(s)
            options.push(`    option value=${val}`)
            options.push(`    ^ ${s}`)
        })


        this.createGHTML(options, this.langSelectorSelect)

        this.bindingStore.lang = this.trns.current
        this.up()
        //this.bindingSet("lang", this.trns.current)



    }

    /*
    submit(e:Event){
        console.log(this.bindingStore)
        //window.location.hash = "/test"
    }
    */



}




export class LangSelectorData extends GDataObject {
	
	
    lang : string = ""


    /*
    uname_validation:ValidationRules = {
		required: {required:true, message:"Required"},
		matches: {regex:"regex", equal:"abc", message:"not valid"},
		standard: {standard: "email", message:"not standard"},
		length: {min:8, max:12, message:"min:8 max: 12 char"},
		items: {min:1, max:3, message:"min:1, max:3 items"},
		range: {min:0, max:100, message:"Allowed range is 0-100 "}
    }*/




    input(event:GHTMLInputEvent):void{
        console.log(event.name+" : "+String(event.value))
        console.log(this)
        console.log(event.element)
        console.log(event.control)
    }

    change(event:GHTMLInputEvent):void{
        console.log(event.name+" : "+String(event.value))
        console.log(this)
        console.log(event.element)
        console.log(event.control)
    }

}
