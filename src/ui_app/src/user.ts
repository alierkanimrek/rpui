import {GDocument, GDataObject} from "./glider/glider"
import {Translation} from "./components/translation"
import {viewport, VPTypes} from "./components/viewport"
import {SessionUpdater} from "./components/session"
import {LangSelectorData} from "./widgets/lang/selector"

import {Base, BaseData} from "./user/base"
import {Login, LoginData} from "./user/login"
import {Signup, SignupData} from "./user/signup"
import {Forgot, ForgotData} from "./user/forgot"
import {ChangePassw, ChangePasswData} from "./user/changepassw"







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





function changepassw():void{
    
    let base = new Base()
    let chp = new ChangePassw()
}





let route = [
    {'/user/login' : login},
    {'/user/signup': signup},
    {'/user/forgotpassw': forgot},
    {'/user/changepassw': changepassw}
]




let store = {
    base: new BaseData(),
    langselector: new LangSelectorData(),
    trns: translator,
    login: new LoginData(),
    signup: new SignupData(),
    forgot: new ForgotData(),
    changepassw: new ChangePasswData()
}








GDocument.setReadyChecker(appReady)
GDocument.stores(store)
GDocument.route(route)

let session = new SessionUpdater()
