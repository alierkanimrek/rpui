import {GDocument, GDataObject} from "./glider/glider"
import {Translation} from "./components/translation"
import {viewport, VPTypes} from "./components/viewport"
import {SessionUpdater} from "./components/session"
import {LangSelectorData} from "./widgets/lang/selector"

import {Base, BaseData} from "./front/base"
import {Front, FrontData} from "./front/front"








const app = "front"
const i18npath = "/heap/i18n/"
const translator = new Translation(i18npath, app)

let store = {
    base: new BaseData(),
    session: new SessionUpdater(),
    langselector: new LangSelectorData(),
    trns: translator,
    front: new FrontData()
}








function appReady():boolean {
    if(!translator.t.state  && !translator.t.error){    return(false)}
    return(true)
}




function front():void{
    let base = new Base()
    let front = new Front()
}









let route = [
    {path:'/', app: front}
]




GDocument.setReadyChecker(appReady)
GDocument.stores(store)
GDocument.route(route)