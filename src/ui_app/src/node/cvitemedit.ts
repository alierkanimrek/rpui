import {GHTMLControl, GDataObject, GHTMLInputEvent, ValidityMessages} from "../glider/glider"
import {VariableMap, ControlWidgetData} from "../components/view"
import {ViewData} from "./view"
import {Selector} from "../widgets/elements/selector"
import {TxtInput} from "../widgets/elements/txtinput"
import view from "./cvitemedit.ghtml"
import {metaData} from "../widgets/control/cwdata"



const name = "cvitemedit"










export class CVItemEdit extends GHTMLControl {




    bindingStore:CVItemEditData
    viewData:ViewData
    _: Function
    vars: Array<GHTMLControl> = []
    svars: Array<GHTMLControl> = []
    




    constructor(rootId:string, widgetData?:ControlWidgetData) {
        super({view:view, root:rootId, bindToLocal:new CVItemEditData()})
        //this.store("base").nname = ""
        let trns = this.store("trns").t.translations(name)
        trns.updateStatics(this)
        this._ = trns.get_()
        this.viewData = this.store("view")
        this.up()
        if(widgetData){ 
            this.bindingStore.data = widgetData
            this.upWidgetVars(widgetData.widget)
        }
        else{
            this.upWidgetVars("default")           
        }
        this.up()
        this.bindingStore.saveData()
        //this.bindingStore.load(this.store("base").name, this.loadedV.bind(this), this.loadedVL.bind(this))
    }




    input(event:GHTMLInputEvent):void{
        switch (event.name) {
            case "widget":
                this.bindingStore.adjustWidgetVars(event.value)
                this.upWidgetVars(event.value)
        }
        
    }




    private upWidgetVars(wname:string):void{
        this.vars.forEach((selector:GHTMLControl)=>{
            selector.clear()
        })
        this.svars.forEach((ti:GHTMLControl)=>{
            ti.clear()
        })
        this.vars = []
        this.svars = []
        let metaVars = metaData.getData(wname).vars
        let staticVars = metaData.getData(wname).static
        metaVars.forEach((vname:string)=>{
            this.vars.push( new Selector({
              rootId: this.e.varsContainer.id,
              name: vname,
              label: vname,
              value: this.bindingStore.getMap(vname),
              inputCall: this.input,
              options: this.viewData.nodevars
              }))
        })
        staticVars.forEach((vname:string)=>{
            this.svars.push( new TxtInput({
              rootId: this.e.svarsContainer.id,
              name: vname,
              label: vname,
              value: this.bindingStore.getStatic(vname),
              inputCall: this.input
              }))
        })
    }




    get data():ControlWidgetData{
        return(this.bindingStore.data)
    }




    map():VariableMap{
        let map:VariableMap = {} 
        this.vars.forEach((selector:Selector)=>{
            map[selector.name] = selector.value
        })
        return(map)
    }




    static():VariableMap{
        let st:VariableMap = {} 
        this.svars.forEach((ti:TxtInput)=>{
            st[ti.name] = ti.value
        })
        return(st)
    }




    save(){
        this.bindingStore.saveData()
    }
}









class CVItemEditData extends GDataObject {
	
    control:CVItemEdit
    title: string = ""
    widget: string = "default"
    widget_options: Array<String> = metaData.names
    editable: boolean = false   
    autosend: boolean = false
    map: VariableMap = {}
    static: VariableMap = {}
    private _data: ControlWidgetData 




    get data():ControlWidgetData{
        return(this._data)
    }




    set data(wdata:ControlWidgetData){
        this.title = wdata.title
        this.editable = wdata.editable
        this.autosend = wdata.autosend
        this.map = wdata.map
        this.static = wdata.static
        this.widget = wdata.widget
    }




    saveData():void{
        let data:ControlWidgetData = {
            title: this.title,
            order: 0,
            widget: this.widget,
            editable: this.editable,
            autosend: this.autosend,
            map: this.control.map(),
            static: this.control.static()
        }
        this._data = data
    }



    getMap(vname:string):string{
        if(Object.getOwnPropertyNames(this.map).indexOf(vname) > -1){
            return(this.map[vname])
        }
    }



    getStatic(vname:string):string{
        if(Object.getOwnPropertyNames(this.static).indexOf(vname) > -1){
            return(this.static[vname])
        }
    }




    adjustWidgetVars(widget:string){
        if(widget == this._data.widget){
            this.map = this._data.map
            this.static = this._data.static
        }
        else if(widget != this.widget){
            this.map = {}
            this.static = {}
        }
    }
}
