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








import {GHTMLControl, GDataObject, GHTMLInputEvent, ValidityMessages} from "../glider/glider"
import {GetText} from "../i18n/gettext"
import {Port, Connection, ResponseHandler, ErrorHandler} from "../components/connection"
import {RpStack} from "../components/msg"
import view from "./nodeedit.ghtml"
import {SendButtonParameters, SendButton} from "../widgets/elements/sendbutton"
import {TaskEdit} from "../widgets/taskeditor/taskeditor"
import {SearchInput} from "../widgets/elements/searchinput"
import {ButtonSelect} from "../widgets/elements/buttonselect"
import {getUri} from "../components/source"







const name = "nodeedit"








export class NodeEdit extends GHTMLControl {




	bindingStore:NodeEditData
    trns: GetText
    _: Function

    title:HTMLElement
    sendBtnContainer: HTMLElement
    sendButton:SendButton
    access:HTMLElement
    back:HTMLElement
    tasks:HTMLElement
    remove:HTMLElement
    removeMsgContainer:HTMLElement
    descInput:HTMLInputElement
    search1: SearchInput
    search2: SearchInput
    userlist: ButtonSelect
    tasklist: ButtonSelect
    nodeSelector: ButtonSelect
    taskSelector: ButtonSelect

    emap: Array<any> = [
        [this.back, "click", this.footernav],
        [this.tasks, "click", this.footernav],
        [this.remove, "click", this.footernav],
        [this.e.ulistRemoveBtn, "click", this.removeUList],
        [this.e.tlistRemoveBtn, "click", this.removeTList]
    ]


    constructor() {
        super({view:view, bindTo:name})
        this.trns = this.store("trns").t.translations(name)
        this._ = this.trns.get_()
        this.trns.updateStatics(this)
        
        this.search1 = new SearchInput({
            rootId: this.e.searchContainer1.id,
            label: "Search user:"
        })
        this.emap.push([this.search1, "selected", this.search1Selected])
        this.emap.push([this.search1, "input", this.search1Input])
        this.userlist = new ButtonSelect(this.e.userlistContainer.id)

        this.search2 = new SearchInput({
            rootId: this.e.searchContainer2.id,
            label: "Search user:"
        })
        this.emap.push([this.search2, "selected", this.search2Selected])
        this.emap.push([this.search2, "input", this.search2Input])

        this.nodeSelector = new ButtonSelect(this.e.nodeSelect.id)
        this.emap.push([this.nodeSelector, "selected", this.nodeSelected])

        this.taskSelector = new ButtonSelect(this.e.taskSelect.id)
        this.emap.push([this.taskSelector, "selected", this.taskSelected])
        this.tasklist = new ButtonSelect(this.e.tasklistContainer.id)

        this.sendButton = new SendButton({
            rootId: this.sendBtnContainer.id,
            clickCall: this.update.bind(this),
            buttonLabel: this._("sendBtnLabel"),
            sendingMsg: this._("sending"),
            successMsg: this._("updateSuccess"),
            errorMsg: this._("updateError"),
            classx: "button is-block is-info is-fullwidth is-medium"
        })

        if(this.store("base").nname == ""){
            this.store("base").getNNameFromUri(this.gDoc.path)
        }
        this.bindingStore.load(this.store("base").nname, this.load.bind(this))

        this.linkEvents(this.emap)
    }





    footernav(e:Event){
        let t = <HTMLElement>e.target
        switch (t) {
            case this.back:
                this.gDoc.navigate("/"+this.store("session").user)
                break;
            case this.tasks:
                this.gDoc.navigate("/"+this.store("session").user+"/"+this.store("base").nname+"/edit/tasks")
                break;
            case this.remove:
                this.removeMsgContainer.style.visibility = "visible"
        }
    }




    update(e:Event){
        this.bindingStore.save(this.saved.bind(this))
    }




    load():void{
        this.title.textContent = this.bindingStore.title
        this.up()
        this.userlist.options = this.bindingStore.userlist_options
        this.tasklist.options = this.bindingStore.tasklist_options
        if(this.bindingStore.access == "1"){
            this.e.friendsContainer.style.visibility = "visible"
            this.e.friendsContainer.style.height = ""
        }
    }



    saved(status:boolean, msg?:string){
        if(status){
            this.sendButton.success()
            if(this.bindingStore.desc = "remove"){
                this.gDoc.navigate("/"+this.store("session").user)
            }
        }
        else{
            this.sendButton.error()
        }
    }




    input(event:GHTMLInputEvent):void{
        if(event.name == "desc" && event.value == "remove"){
            this.descInput.style.color = "red"
            this.sendButton.submit.style.backgroundColor = "red"
        }
        else{
            this.descInput.style.color = ""
            try{this.sendButton.submit.style.backgroundColor = ""}
            catch{    null    }
        }

        if(event.name == "access"){
            if(event.value == "1"){
                this.e.friendsContainer.style.visibility = "visible"
                this.e.friendsContainer.style.height = ""
            }else{
                this.e.friendsContainer.style.visibility = "hidden"
                this.e.friendsContainer.style.height = "0"

            }
        }

    }




    search1Input(value:string){
        this.search1.clear()
        let loaded = (unamelist:Array<string>) =>{
            this.search1.options = unamelist
        }
        if(value && this.search1.options.indexOf(value) == -1){
            this.bindingStore.searchUser(value, loaded.bind(this), "all")
        }
    }    




    search1Selected(value:string){
        this.userlist.add(value)
        this.bindingStore.userlist_options = this.userlist.options
    }




    search2Input(value:string){
        this.search2.clear()
        this.nodeSelector.clear()
        this.taskSelector.clear()
        let loaded = (unamelist:Array<string>) =>{
            this.search2.options = unamelist
            if(unamelist.length == 1 ){
                this.search2.value = unamelist[0]
                this.search2Selected(unamelist[0])
            }
        }
        if(value && this.search2.options.indexOf(value) == -1){
            this.bindingStore.searchUser(value, loaded.bind(this), "share")
        }
    }    




    search2Selected(value:string){
        this.nodeSelector.clear()
        this.taskSelector.clear()
        let loaded = (nodes:Array<string>) =>{
            if(this.store("session").user == this.search2.value){
                nodes.splice(nodes.indexOf(this.store("base").nname),1)
            }
            this.nodeSelector.options = nodes
            this.e.nodeContainer.style.visibility = "visible"
            this.e.nodeContainer.style.height = ""
            if(nodes.length == 1){
                this.nodeSelector.value = nodes[0]
                this.nodeSelected(nodes[0])
            }
        }
        this.bindingStore.getNodes(value, loaded.bind(this))
    }




    nodeSelected(value:string){
        this.taskSelector.clear()
        let loaded = (tasks:Array<string>) =>{
            this.taskSelector.options = tasks
            this.e.taskContainer.style.visibility = "visible"
            this.e.taskContainer.style.height = ""
        }
        this.bindingStore.getTasks(this.search2.value, value, loaded.bind(this))
    }




    taskSelected(value:string){
        this.tasklist.add(getUri(this.search2.value, this.nodeSelector.value, value))
        this.bindingStore.tasklist_options = this.tasklist.options
    }




    removeUList(e:Event){
        this.userlist.removeSelected()
        this.bindingStore.userlist_options = this.userlist.options
    }



    removeTList(e:Event){
        this.tasklist.removeSelected()
        this.bindingStore.tasklist_options = this.tasklist.options
    }


}








export class NodeEditData extends GDataObject {
	
	
    control: NodeEdit
    title: string = ""
    desc: string = ""
    access: string = "0"
    userlist: Array<string> = []
    userlist_options: Array<string> = []
    tasklist: Array<string> = []
    tasklist_options: Array<string> = []



    load(nname:string, cb:Function):void{

        let response:ResponseHandler = (stack:RpStack) => {
            if(!stack.dataVar("result")){
                this.title = stack.stack[0].data.nname
                this.desc = stack.stack[0].data.desc
                this.access = String(stack.stack[0].data.access)
                this.userlist_options = stack.stack[0].data.group
                this.tasklist_options = stack.stack[0].data.followup
                cb()
            }
        }

        let error:ErrorHandler = (msg:string) => {
            console.log(msg)    
        }

        let data = {"nname": nname}

        let conn = new Connection({
            port:Port.getnode, 
            name:name, 
            responseHandler:response,
            errorHandler:error})

        conn.run({ObjectData: data})

    }




    searchUser(term:string, cb:Function, mode:string):void{

        let response:ResponseHandler = (stack:RpStack) => {
            if(stack.dataVar("namelist")){
                cb(stack.dataVar("namelist"))
            }
        }

        let error:ErrorHandler = (msg:string) => {
            console.log(msg)    
        }

        let conn = new Connection({
            port:Port.srcusr, 
            name:name, 
            responseHandler:response,
            errorHandler:error})

        conn.run({ObjectData: {"term": term, "mode": mode}})

    }




    getNodes(uname:string, cb:Function):void{

        let response:ResponseHandler = (stack:RpStack) => {
            if(stack.dataVar("namelist")){
                cb(stack.dataVar("namelist"))
            }
        }

        let error:ErrorHandler = (msg:string) => {
            console.log(msg)
        }

        let conn = new Connection({
            port:Port.getshrnodes, 
            name:name, 
            responseHandler:response,
            errorHandler:error})

        conn.run({ObjectData: {"uname": uname}})

    }




    getTasks(uname:string, nname:string, cb:Function):void{

        let response:ResponseHandler = (stack:RpStack) => {
            if(stack.dataVar("namelist")){
                cb(stack.dataVar("namelist"))
            }
        }

        let error:ErrorHandler = (msg:string) => {
            console.log(msg)
        }

        let conn = new Connection({
            port:Port.getshrtasks, 
            name:name, 
            responseHandler:response,
            errorHandler:error})

        conn.run({ObjectData: {"uname": uname, "nname" : nname}})

    }




    save(cb:Function):void{

        let response:ResponseHandler = (stack:RpStack) => {
            cb(stack.dataVar("result"))    
        }

        let error:ErrorHandler = (msg:string) => {
            cb(false, msg)    
        }

        let data = {
            "title": this.title, 
            "desc":this.desc, 
            "access": Number(this.access),
            "group": this.userlist_options,
            "followup" : this.tasklist_options
        }

        let conn = new Connection({
            port:Port.upnode, 
            name:name, 
            responseHandler:response,
            errorHandler:error})

        conn.run({ObjectData: data})
    }

}
