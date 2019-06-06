import {GDataObject} from "../glider/glider"
import {Translator} from "../i18n/gettext"






export class Translation extends GDataObject {
    



    public t:Translator



    constructor(path:string, name:string){
        super()
        this.t = new Translator(path, name)
    }
}