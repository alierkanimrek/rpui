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
        if(widgetData){ this.bindingStore.setData(widgetData)    }
        //this.bindingStore.load(this.store("base").name, this.loadedV.bind(this), this.loadedVL.bind(this))
    }




    input(event:GHTMLInputEvent):void{
        switch (event.name) {
            case "widget":
                this.vars.forEach((selector:GHTMLControl)=>{
                    selector.clear()
                })
                this.vars = []
                let metaVars = metaData.getData(event.value).vars
                let staticVars = metaData.getData(event.value).static
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
        
    }




    get data():ControlWidgetData{
        let data = this.bindingStore.data 
        this.vars.forEach((selector:Selector)=>{
            data.map[selector.name] = selector.value
        })
        this.svars.forEach((selector:Selector)=>{
            data.static[selector.name] = selector.value
        })
        return(data)
    }

}









class CVItemEditData extends GDataObject {
	
    title: string = ""
    widget: string = "default"
    widget_options: Array<String> = metaData.names
    editable: boolean = false   
    autosend: boolean = false
    map: VariableMap
    static: VariableMap




    get data():ControlWidgetData{

        let data:ControlWidgetData = {
            title: this.title,
            order: 0,
            widget: this.widget,
            editable: this.editable,
            autosend: this.autosend,
            map: {},
            static: {}
        }
        return(data)
    }




    setData(wdata:ControlWidgetData):void{
        this.title = wdata.title
        this.editable = wdata.editable
        this.autosend = wdata.autosend
        this.map = wdata.map
        this.static = wdata.static
        this.up()
        this.widget = wdata.widget
        this.up({name:"widget", triggerInput:true})
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

}
