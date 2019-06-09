import {GHTMLControl, GDataObject, GHTMLInputEvent, ValFalMessages} from "../../glider/glider"
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
