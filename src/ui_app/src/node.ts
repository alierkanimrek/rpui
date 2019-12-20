import {GDocument, GDataObject} from "./glider/glider"
import {Translation} from "./components/translation"
import {viewport, VPTypes} from "./components/viewport"
import {SessionUpdater} from "./components/session"
import {LangSelectorData} from "./widgets/lang/selector"
import {urls} from "./components/rules"

import {Base, BaseData} from "./node/base"
import {Nodes, NodesData} from "./node/nodes"
import {NewNodeData} from "./node/newnode"
import {NodeEdit, NodeEditData} from "./node/nodeedit"
import {Tasks, TasksData} from "./node/tasks"

import {NewViewData} from "./node/newview"




const app = "node"
const i18npath = "/heap/i18n/"
const translator = new Translation(i18npath, app)

let store = {
    session: new SessionUpdater(),
    langselector: new LangSelectorData(),
    trns: translator,
    base: new BaseData(),
    nodes: new NodesData(),
    newnode: new NewNodeData(),
    nodeedit: new NodeEditData(),
    tasks: new TasksData(),
    newview: new NewViewData(),
}






function appReady():boolean {
    if(!translator.t.state && !translator.t.error){    return(false)}
    return(true)
}




function exitIfHasNotSession() {
    if( !store.session.hasSession ){
        location.assign("/user/login")
    }
}




function userApp():void{
    location.reload() 
}




function nodess():void{
    exitIfHasNotSession()
    let base = new Base()
    let nodes = new Nodes()
}




function edit():void{
    exitIfHasNotSession()
    let base = new Base()
    let edit = new NodeEdit()
}




function edittasks():void{
    exitIfHasNotSession()
    let base = new Base()
    let edit = new Tasks()
}








let route = [
    { path: urls.userApp, app : userApp},
    { path: urls.nodes, app : nodess},
    { path: urls.nodeedit, app : edit},
    { path: urls.tasks, app : edittasks}
]






GDocument.setReadyChecker(appReady)
GDocument.stores(store)
GDocument.route(route)