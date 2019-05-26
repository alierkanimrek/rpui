import {GDocument, GDataObject} from "./glider/glider"
//import {Login, LoginData} from "./user/login"
import {Translator} from "./i18n/gettext"
import {Base, BaseData} from "./user/base"
import {LangSelectorData} from "./widgets/lang/selector"


const app = "user"


/*
    Translation objects
*/
export class Translation extends GDataObject {
    public t:Translator = new Translator("/app/i18n/", app)
}

let translator = new Translation()

function appReady():boolean {
    if(!translator.t.state){    return(false)}
    return(true)
}




function base():void{
    
    let base = new Base()
    console.log("base")
    //let _ = i18n.translations("base").get_()
    //console.log( _("loginCodeSent") )





}






let route = [
    {'/' : base},
]


let store = {
    base: new BaseData(),
    langselector: new LangSelectorData(),
    trns: translator
}

GDocument.setReadyChecker(appReady)
GDocument.stores(store)
GDocument.route(route)



//history.replaceState({page: 1}, "title 1", "?page=1")
//window.location.hash = "/?page=1"
//console.log(window.location)
//console.log(document.)
