import {GDocument, GDataObject} from "./glider/glider"
import {Translation} from "./components/translation"
import {viewport, VPTypes} from "./components/viewport"


import {Login, LoginData} from "./user/login"
import {Base, BaseData} from "./user/base"
import {LangSelectorData} from "./widgets/lang/selector"








const app = "user"
const i18npath = "/app/i18n/"
const translator = new Translation(i18npath, app)




function appReady():boolean {
    if(!translator.t.state){    return(false)}
    return(true)
}








function login():void{
    
    let base = new Base()
    let login = new Login()
}






let route = [
    {'/' : login},
]


let store = {
    base: new BaseData(),
    langselector: new LangSelectorData(),
    trns: translator,
    login: new LoginData()
}

GDocument.setReadyChecker(appReady)
GDocument.stores(store)
GDocument.route(route)



//history.replaceState({page: 1}, "title 1", "?page=1")
//window.location.hash = "/?page=1"
//console.log(window.location)
//console.log(document.)
