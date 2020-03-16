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
import {urls} from "./components/rules"

import {Base, BaseData} from "./node/base"
import {Nodes, NodesData} from "./node/nodes"
import {NewNodeData} from "./node/newnode"
import {NodeEdit, NodeEditData} from "./node/nodeedit"
import {Tasks, TasksData} from "./node/tasks"

import {NewViewData} from "./node/newview"
import {View, ViewData} from "./node/view"
import {ControlItemData} from "./node/controlitem"




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
    view: new ViewData(),
    controlitem: new ControlItemData()
}






function appReady():boolean {
    if(!translator.t.state && !translator.t.error){    return(false)}
    return(true)
}





function userApp():void{
    location.reload() 
}




function nodess():void{
    if( !store.session.hasSession ){
        location.assign("/user/login")
    }else{
        let base = new Base()
        let nodes = new Nodes()
    }
}




function edit():void{
    if( !store.session.hasSession ){
        location.assign("/user/login")
    }else{
        let base = new Base()
        let edit = new NodeEdit()
    }
}




function edittasks():void{
    if( !store.session.hasSession ){
        location.assign("/user/login")
    }else{
        let base = new Base()
        let edit = new Tasks()
    }
}




function view():void{
    if( !store.session.hasSession ){
        location.assign("/user/login")
    }else{
        let base = new Base()
        let view = new View()
    }
}







let route = [
    { path: urls.userApp, app : userApp},
    { path: urls.nodes, app : nodess},
    { path: urls.nodeedit, app : edit},
    { path: urls.tasks, app : edittasks},
    { path: urls.view, app : view}
]






GDocument.setReadyChecker(appReady)
GDocument.stores(store)
GDocument.route(route)