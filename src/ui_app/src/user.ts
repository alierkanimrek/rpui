import {GDocument} from "./glider/glider"
//import {Login, LoginData} from "./user/login"
import {Translator} from "./i18n/gettext"
import {Base, BaseData} from "./user/base"


const app = "user"
let i18n = new Translator("/app/i18n/", app, "en-us")




function appReady():boolean {
    if(!i18n.state){    return(false)}
    return(true)
}




function base():void{
    
    let base = new Base()
    console.log("base")
    let _ = i18n.translations("base").get_()
    console.log( _("loginCodeSent") )

}






let route = [
    {'/' : base},
]


let store = {
    base: new BaseData()
}

GDocument.setReadyChecker(appReady)
GDocument.stores(store)
GDocument.route(route)



//history.replaceState({page: 1}, "title 1", "?page=1")
//window.location.hash = "/?page=1"
//console.log(window.location)
//console.log(document.)
