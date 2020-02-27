import {GDocument, GDataObject} from "./glider/glider"
import {Translation} from "./components/translation"
import {viewport, VPTypes} from "./components/viewport"
import {SessionUpdater} from "./components/session"
import {LangSelectorData} from "./widgets/lang/selector"

import {Base, BaseData} from "./admin/base"
import {Main, MainData} from "./admin/main"
import {AdminData} from "./admin/admin"
import {UGroupData} from "./admin/ugroup"
import {InviteData} from "./admin/invite"







const app = "admin"
const i18npath = "/heap/i18n/"
const translator = new Translation(i18npath, app)

let store = {
    base: new BaseData(),
    session: new SessionUpdater(),
    langselector: new LangSelectorData(),
    trns: translator,
    main: new MainData(),
    admin: new AdminData(),
    ugroup: new UGroupData(),
    invite: new InviteData()
}








function appReady():boolean {
    if(!translator.t.state  && !translator.t.error){    return(false)}
    return(true)
}




function main():void{
    if( !store.session.hasSession ){
        location.assign("/user/login")
    }else{
        let base = new Base()
        let main = new Main()
    }
}









let route = [
    {path:'/admin', app: main}
]




GDocument.setReadyChecker(appReady)
GDocument.stores(store)
GDocument.route(route)