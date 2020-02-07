import {GHTMLControl, GDataObject, GHTMLInputEvent, ValidityMessages} from "../glider/glider"
import {GetText} from "../i18n/gettext"
import {Port, Connection, ResponseHandler, ErrorHandler} from "../components/connection"
import {RpStack} from "../components/msg"
import view from "./nodeedit.ghtml"
import {SendButtonParameters, SendButton} from "../widgets/elements/sendbutton"
import {TaskEdit} from "../widgets/taskeditor/taskeditor"
import {SearchInput} from "../widgets/elements/searchinput"
import {ButtonSelect} from "../widgets/elements/buttonselect"








const name = "nodeedit"








export class NodeEdit extends GHTMLControl {




	bindingStore:NodeEditData
    trns: GetText
    _: Function

    title:HTMLElement
    sendBtnContainer: HTMLElement
    sendButton:SendButton
    access:HTMLElement
    TaskListContainer:HTMLElement
    back:HTMLElement
    tasks:HTMLElement
    remove:HTMLElement
    removeMsgContainer:HTMLElement
    descInput:HTMLInputElement
    search1: SearchInput
    search2: SearchInput
    userlist: HTMLSelectElement
    tasklist: HTMLSelectElement
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
        this.e.userlist.setAttribute("multiple", "true")
        this.e.tasklist.setAttribute("multiple", "true")
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
        this.setUList()
        if(this.bindingStore.access == "1"){
            this.e.friendsContainer.style.visibility = "visible"
            this.e.friendsContainer.style.height = ""
        }
    }



    saved(status:boolean, msg?:string){
        if(status){
            this.sendButton.success()
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
        let loaded = (unamelist:Array<string>) =>{
            this.search1.upData(unamelist)
        }
        if(value && this.search1.opts.indexOf(value) == -1){
            this.bindingStore.searchUser(value, loaded.bind(this), "all")
        }
    }    




    search1Selected(value:string){
        this.bindingStore.addUserList(value)
    }




    search2Input(value:string){
        let loaded = (unamelist:Array<string>) =>{
            this.search2.upData(unamelist)
            this.nodeSelector.clear()
            this.taskSelector.clear()
        }
        if(value && this.search2.opts.indexOf(value) == -1){
            this.bindingStore.searchUser(value, loaded.bind(this), "share")
        }
    }    




    search2Selected(value:string){
        let loaded = (nodes:Array<string>) =>{
            this.nodeSelector.options = nodes
            this.e.nodeContainer.style.visibility = "visible"
            this.e.nodeContainer.style.height = ""
            this.taskSelector.clear()
        }
        this.bindingStore.getNodes(value, loaded.bind(this))
    }




    nodeSelected(value:string){
        let loaded = (tasks:Array<string>) =>{
            this.taskSelector.options = tasks
            this.e.taskContainer.style.visibility = "visible"
            this.e.taskContainer.style.height = ""
        }
        this.bindingStore.getTasks(this.search2.value, value, loaded.bind(this))
    }




    taskSelected(value:string){
        this.bindingStore.addTaskList(this.search2.value, this.nodeSelector.value, value)
    }




    removeUList(e:Event){
        this.bindingStore.removeUsers()
    }



    removeTList(e:Event){
        this.bindingStore.removeTasks()
    }




    setUList(){
        if(this.userlist.options.length > 2){
            this.userlist.size = this.userlist.options.length
        }
        else{
             this.userlist.size = 2   
        }
    }




    setTList(){
        if(this.tasklist.options.length > 2){
            this.tasklist.size = this.tasklist.options.length
        }
        else{
             this.tasklist.size = 2   
        }
    }

}








export class NodeEditData extends GDataObject {
	
	
    control: NodeEdit
    title: string = ""
    desc: string = ""
    access: string = "0"
    userlist: Array<String> = []
    userlist_options: Array<String> = []
    tasklist: Array<String> = []
    tasklist_options: Array<String> = []



    load(nname:string, cb:Function):void{

        let response:ResponseHandler = (stack:RpStack) => {
            if(!stack.dataVar("result")){
                this.title = stack.stack[0].data.nname
                this.desc = stack.stack[0].data.desc
                this.access = String(stack.stack[0].data.access)
                this.userlist_options = stack.stack[0].data.group
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




    addUserList(value:string){
        if(this.userlist_options.indexOf(value) == -1){
            this.userlist_options.push(value)
            this.up()
            this.control.setUList()
        }
    }




    removeUsers(){
        let newlist:Array<string> = []
        this.userlist_options.forEach((uname:string)=>{
            if(this.userlist.indexOf(uname) == -1){
                newlist.push(uname)
            }
        })
        this.userlist_options = newlist
        this.up()
        this.control.setUList()
    }



    addTaskList(uname:string, nname:string, tname:string){
        let uri = uname+"/"+nname+"/"+tname
        if(this.tasklist_options.indexOf(uri) == -1){
            this.tasklist_options.push(uri)
            this.up()
            this.control.setTList()
        }
    }




    removeTasks(){
        let newlist:Array<string> = []
        this.tasklist_options.forEach((uri:string)=>{
            if(this.tasklist.indexOf(uri) == -1){
                newlist.push(uri)
            }
        })
        this.tasklist_options = newlist
        this.up()
        this.control.setTList()
    }

}
