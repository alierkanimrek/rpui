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