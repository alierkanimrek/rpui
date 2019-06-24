import {GDocument, GDataObject} from "./glider/glider"
import {Translation} from "./components/translation"
import {viewport, VPTypes} from "./components/viewport"
import {LangSelectorData} from "./widgets/lang/selector"

import {Base, BaseData} from "./user/base"
import {Login, LoginData} from "./user/login"
import {Signup, SignupData} from "./user/signup"
import {Forgot, ForgotData} from "./user/forgot"








const app = "user"
const i18npath = "/heap/i18n/"
const translator = new Translation(i18npath, app)








function appReady():boolean {
    if(!translator.t.state){    return(false)}
    return(true)
}








function login():void{
    
    let base = new Base()
    let login = new Login()
}




function signup():void{
    
    let base = new Base()
    let signup = new Signup()
}




function forgot():void{
    
    let base = new Base()
    let forgot = new Forgot()
}








let route = [
    {'/user/login' : login},
    {'/user/signup': signup},
    {'/user/forgotpassw': forgot}
]




let store = {
    base: new BaseData(),
    langselector: new LangSelectorData(),
    trns: translator,
    login: new LoginData(),
    signup: new SignupData(),
    forgot: new ForgotData()
}








GDocument.setReadyChecker(appReady)
GDocument.stores(store)
GDocument.route(route)



//history.replaceState({page: 1}, "title 1", "?page=1")
//window.location.hash = "/?page=1"
//console.log(window.location)
//console.log(document.)
