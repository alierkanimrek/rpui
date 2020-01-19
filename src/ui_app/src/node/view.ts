import {GHTMLControl, GDataObject, GHTMLElement, GHTMLInputEvent, ValidityMessages} from "../glider/glider"
import {GetText} from "../i18n/gettext"
import {Port, Connection, ResponseHandler, ErrorHandler} from "../components/connection"
import {RpStack, UserData} from "../components/msg"
import {parseUri} from "../components/source"
import {SendButton} from "../widgets/elements/sendbutton"
import {SimpleMenu} from "../widgets/elements/simplemenu"
import {CWBase} from "../widgets/control/interfaces"
import {NewViewItem} from "./newview"
import {ControlItem} from "./controlitem"
import {ControlWidgetData, ControlView, VariableMap} from "../components/view"




const name = "view"
const view = `
baseMainContent
    DIV class=tile is-ancestor
        DIV class=tile is-vertical is-parent
            DIV class=tile is-child gid=ViewListContainer
            DIV class=tile is-child
                DIV class=columns is-multiline gid=ControlViewContainer
            DIV class=tile is-child
                DIV class=tile is-vertical is-parent gid=FooterContainer
                    DIV class=tile is-child style=padding: 0.75rem !important; text-align: center;
                        i gid=addButton class=fas fa-plus role=button style=float:center; font-size:1.2em; cursor:pointer;
                    DIV class=tile is-child style=padding: 0.75rem !important; text-align: center;
                        DIV gid=saveContainer style=display:inline-grid;
                    DIV class=tile is-child style=padding: 0.75rem !important; text-align: center;
                        A gid=nodesLink
`









export class View extends GHTMLControl {




	bindingStore:ViewData
    _: Function

    ViewListContainer:HTMLElement
    ControlViewContainer:HTMLElement
    saveContainer:HTMLElement
    saveButton:SendButton





    constructor() { 
        super({view:view, bindTo:name})
        //this.store("base").nname = ""
        let trns = this.store("trns").t.translations(name)
        this._ = trns.get_()
        trns.updateStatics(this)
        this.bindingStore.uname = this.gDoc.gData("session").user
        this.linkEvents([
          [this.e.addButton, "click", this.addCVItem],
          [this.e.nodesLink, "click", this.nav]
        ])
        this.saveButton = new SendButton({
            rootId: this.saveContainer.id,
            clickCall: this.save.bind(this),
            buttonLabel: this._("saveBtnLabel"),
            sendingMsg: this._("saving"),
            successMsg: this._("saveSuccess"),
            errorMsg: this._("saveError"),
            classx: "button is-block is-info is-medium"
        })
        this.bindingStore.load(this.store("base").name, this.loadedV.bind(this), this.loadedVL.bind(this))
        this.bindingStore.checkData(this.dataLoaded.bind(this))
    }




    loadedV(view:ControlView){
        
        for (let i = 0; i < view.items.length; i++) {
            view.items.forEach((item:ControlWidgetData)=>{
                if(item.order == i){    
                    let ci = new ControlItem(this.ControlViewContainer.id, item)
                    ci.addEventListener("remove", this.remove.bind(this))
                    ci.addEventListener("add", this.addCVItem.bind(this))
                    ci.addEventListener("move", this.moveCVItem.bind(this))
                    ci.addEventListener("cmd", this.cmdCVItem.bind(this))
                }
            })
        }
        this.bindingStore.dataConn.play()   
    }




    loadedVL(viewlist:Array<any>){
        let names: Array<string> = []
        viewlist.forEach((view:any) =>{
            names.push(view.vname)
        })
        new SimpleMenu(
            this.ViewListContainer.id, 
            this._("cMenu"), 
            names, 
            this.nav.bind(this), 
            this.addControl.bind(this))
    }




    dataLoaded(data:UserData):void{
        this.ControlViewContainer.childNodes.forEach((cn:any)=>{
            cn.control.taskData = data
        })
    }




    remove(id:any){
        this.ControlViewContainer.childNodes.forEach((cn:any)=>{
            if(cn.control.id == id){
                cn.control.clear()
            }
        })
    }




    nav(name:string|Event):void{
        if(typeof(name) == typeof("")){
            this.gDoc.navigate("/"+this.gDoc.gData("session").user+"/view/"+name)
        }else{
            this.gDoc.navigate("/"+this.gDoc.gData("session").user)
        }
    }




    addControl():void{
        new NewViewItem(this.ViewListContainer.id)
    }




    moveCVItem(moveIt:Array<any>){
        let index:number = 0
        let cns:any = this.ControlViewContainer.childNodes
        for (let i = 0; i < cns.length; i++) {
            if(moveIt[0].id == cns[i].id){    index = i    }
        }
        if(moveIt[1] == "up" && index > 0){
            this.ControlViewContainer.insertBefore(moveIt[0], cns[index-1])
        }
        else if(moveIt[1] == "down" && index < cns.length-1){
            this.ControlViewContainer.insertBefore(cns[index+1], moveIt[0])
        }
    }




    addCVItem(e:Event|HTMLElement):void{
        let controlItem = new ControlItem(this.ControlViewContainer.id)
        controlItem.addEventListener("add", this.addCVItem.bind(this))
        controlItem.addEventListener("remove", this.remove.bind(this))
        controlItem.addEventListener("move", this.moveCVItem.bind(this))
        controlItem.addEventListener("cmd", this.cmdCVItem.bind(this))
        if("tagName" in e){
            this.ControlViewContainer.insertBefore(controlItem.item, e)
        }
    }




    save(e:Event):void{

        let items:Array<any> = <any>this.ControlViewContainer.childNodes
        let wdata:ControlWidgetData
        let data:Array<ControlWidgetData> = []

        for (let i = 0; i < items.length; i++) {
            wdata =  items[i].control.data
            wdata.order = i
            data.push(wdata)
        }
        this.bindingStore.save(this.store("base").name, data, this.saved.bind(this))
    }



    saved(result:boolean):void{
        if(result){    this.saveButton.success()    }
        else{    this.saveButton.error()    }
    }




    cmdCVItem(widget:CWBase){
        if(widget){
            this.bindingStore.addCmd(widget.cmd)
        }
        else{
            this.ControlViewContainer.childNodes.forEach((cn:any)=>{
                this.bindingStore.addCmd(cn.widget.cmd)       
            })
        }
    }



    onRemove(){
        this.bindingStore.dataConn.pause()
    }

}








export class ViewData extends GDataObject {
	
	

    viewnames: Array<string> = []
    nodevars: Array<string> = []    //cvitemedit use it
    view: ControlView
    dataCallBack:Function
    dataConn:Connection = new Connection({
            port:Port.chkdata, 
            name:name, 
            responseHandler:this.dataLoaded.bind(this),
            errorHandler:this.error,
            repeat: true,
            upData: this.preSend.bind(this)})
    cmd: VariableMap = {}
    uname: string = ""


    load(vname:string, cbV:Function, cbVL:Function):void{

        // Load ViewList
        let responseVL:ResponseHandler = (stack:RpStack) => {
            if(stack.dataVar("result")){
                console.error("[View] Server error")
            }
            else{
                this.viewnames = []
                let viewlist:Array<any> = stack.dataVar("viewlist")
                viewlist.forEach((view:any) =>{
                    this.viewnames.push(view.vname)
                })
                cbVL(viewlist)


                // Load Nodevars
                let responseNV:ResponseHandler = (stack:RpStack) => {
                    if(stack.dataVar("result")){
                        console.error("[View] Server error")
                    }
                    else{
                        this.nodevars = stack.dataVar("nodevars")


                        // Load View
                        let responseV:ResponseHandler = (stack:RpStack) => {
                            if(stack.dataVar("result")){
                                this.view = stack.dataVar("view")
                                cbV(this.view)
                            }
                            else{
                                console.error("[View] Server error")
                            }
                        }
                        new Connection({
                            port:Port.getview, 
                            name:name, 
                            responseHandler:responseV}).run({ObjectData: {"vname":vname}})
                    }
                }
                new Connection({
                    port:Port.getnodevars, 
                    name:name, 
                    responseHandler:responseNV}).run({ObjectData: {}})
                    }
        }
        new Connection({
            port:Port.getviews, 
            name:name, 
            responseHandler:responseVL}).run({ObjectData: {}})
    }




    save(name:string, data:Array<ControlWidgetData>, cb:Function):void{

        let response:ResponseHandler = (stack:RpStack) => {
            if(stack.dataVar("result")){    cb(stack.dataVar("result"))    }
            else{    
                console.error("[View] Server error")
                cb(false)
            }
        }

        let parms = { vname:name, items:data}

        let conn = new Connection({
            port:Port.saveview, 
            name:name,
            responseHandler:response})
        
        conn.run({ObjectData: parms})
    }



    
    checkData(cb:Function):void{
        this.dataCallBack = cb
        //this.dataConn.run({ObjectData: {}})
    }




    dataLoaded(stack:RpStack):void{
        let d:any = stack.stack[0]["data"]
        delete d.result
        this.dataCallBack(d)    
    }




    error(msg:string):void{
        console.error("[AppNodes] "+msg)    
    }



    addCmd(cmd:VariableMap):void{

        Object.assign(this.cmd, cmd)

    }




    preSend():void{
        let cmd:VariableMap = {}
        let names
        let uri

        Object.keys(this.cmd).forEach((u:string)=>{
            names = parseUri(this.uname+"/"+u)
            uri = names.uname+"/"+names.nname+"/"+names.name
            cmd[uri] = this.cmd[u] 
        })

        this.dataConn.objectData = cmd
        this.cmd = {}
    }

}
