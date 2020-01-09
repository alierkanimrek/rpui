import {GHTMLControl} from "../../glider/glider"
import {ControlWidgetData} from "../../components/view"
import {UserData, NodeData} from "../../components/msg"



export interface ControlWidgetMeta{
    name: string,
    desc: string,
    vars: Array<string>,
    static: Array<string>,
    creator: Function
}




export interface Creator{
    rootId: string,
    wdata: ControlWidgetData
}




export function getControlWidgetData(parm:{
    name:string,
    vars: Array<string>,
    creator: Function,
    desc?: string,
    staticVars?: Array<string>}):ControlWidgetMeta{

    let res:ControlWidgetMeta = {name:parm.name, vars:parm.vars, creator:parm.creator, desc:"", static:[]}
    if(parm.desc){    res.desc = parm.desc    }
    if(parm.staticVars){    res.static = parm.staticVars    }
    return(res)
}






export class CWBase extends GHTMLControl{


    protected _data: UserData
    protected _wdata: ControlWidgetData


    
    constructor(view:string, rootId:string, wdata:ControlWidgetData) {
        super({view:view, root:rootId})
        this._wdata = wdata
    }




    set data(data:UserData){
        this._data = data
        this.update()
    }




    getTaskData(nname:string, tname:string):any{
        try{    return(this._data[nname][tname])    }
        catch{  return(null)  }
    }




    //Override method
    protected update():void{}
}