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
    if( store.session.hasSession){
        location.assign("/"+store.session.user)
    }else{
        let base = new Base()
        let login = new Login()
    }
}




function signup():void{
    if( store.session.hasSession){
        location.assign("/"+store.session.user)
    }else{
        let base = new Base()
        let signup = new Signup()
    }
}




function forgot():void{
    if( store.session.hasSession){
        location.assign("/"+store.session.user)
    }else{
        let base = new Base()
        let forgot = new Forgot()
    }
}





function changepassw():void{
    if( !store.session.hasSession ){
        location.assign("/user/login")
    }else{
        let base = new Base()
        let chp = new ChangePassw()
    }
}





function settings():void{
    if( !store.session.hasSession ){
        location.assign("/user/login")
    }else{
        let base = new Base()
        let usettings = new UserSettings()
    }
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