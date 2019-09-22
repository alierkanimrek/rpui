import {GDocument, GDataObject} from "./glider/glider"
import {Translation} from "./components/translation"
import {viewport, VPTypes} from "./components/viewport"
import {SessionUpdater} from "./components/session"
import {LangSelectorData} from "./widgets/lang/selector"
import {rules} from "./components/rules"

import {Base, BaseData} from "./node/base"
import {Nodes, NodesData} from "./node/nodes"
import {NewNodeData} from "./node/newnode"






const app = "node"
const i18npath = "/heap/i18n/"
const translator = new Translation(i18npath, app)







function appReady():boolean {
    if(!translator.t.state && !translator.t.error){    return(false)}
    return(true)
}




function exitIfHasNotSession() {
    if( !store.session.hasSession ){
        location.href = "/user/login"
    }
}




function nodes():void{
    exitIfHasNotSession()
    let base = new Base()
    let nodes = new Nodes()
}









let route = [
    { path:`/${rules.uname}`, app : nodes}
]




let store = {
    session: new SessionUpdater(),
    langselector: new LangSelectorData(),
    trns: translator,
    base: new BaseData(),
    nodes: new NodesData(),
    newnode: new NewNodeData()
}








GDocument.setReadyChecker(appReady)
GDocument.stores(store)
GDocument.route(route)