import {GDataObject, ValidityMessages, ValidityNames} from "../glider/glider"
import {Translator} from "../i18n/gettext"






export class Translation extends GDataObject {
    



    public t:Translator
    public appName:string



    constructor(path:string, name:string){
        super()
        this.appName = name
        this.t = new Translator(path, name)
    }




    public getValidityMessages(section:string, name:string):ValidityMessages{
        /*
        Generates ValidityMessages object from dynamic values
        Translation example: ( , name="email")
            "email_typeMismatch" : _("Email is not valid")
        */
        let _ = this.t.translations(section).get_()
        let messages:ValidityMessages = {}
        ValidityNames.forEach((n:string)=>{
            let id:string = name+"_"+n
            let msg:string = _(id)
            if(msg){
                Object.defineProperty(messages, n, {value:msg})
            }
        })
        return(messages)
    }
}