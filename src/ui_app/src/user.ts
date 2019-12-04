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
import {UserSettings, UserSettingsData} from "./user/settings"







const app = "user"
const i18npath = "/heap/i18n/"
const translator = new Translation(i18npath, app)

let store = {
    base: new BaseData(),
    session: new SessionUpdater(),
    langselector: new LangSelectorData(),
    trns: translator,
    login: new LoginData(),
    signup: new SignupData(),
    forgot: new ForgotData(),
    changepassw: new ChangePasswData(),
    settings: new UserSettingsData()
}








function appReady():boolean {
    if(!translator.t.state  && !translator.t.error){    return(false)}
    return(true)
}




function exitIfHasSession(path:string) {
    if( store.session.hasSession){
        location.assign("/"+path)
    }
}




function exitIfHasNotSession() {
    if( !store.session.hasSession ){
        location.assign("/user/login")
    }
}




function login():void{
    exitIfHasSession(store.session.user)
    let base = new Base()
    let login = new Login()
}




function signup():void{
    exitIfHasSession(store.session.user)
    let base = new Base()
    let signup = new Signup()
}




function forgot():void{
    exitIfHasSession(store.session.user)
    let base = new Base()
    let forgot = new Forgot()
}





function changepassw():void{
    exitIfHasNotSession()
    let base = new Base()
    let chp = new ChangePassw()
}





function settings():void{
    exitIfHasNotSession()
    let base = new Base()
    let usettings = new UserSettings()
}






let route = [
    {path:'/user/login', app: login},
    {path:'/user/signup', app: signup},
    {path:'/user/forgotpassw', app: forgot},
    {path:'/user/changepassw', app: changepassw},
    {path:'/user/settings', app: settings},
]




GDocument.setReadyChecker(appReady)
GDocument.stores(store)
GDocument.route(route)