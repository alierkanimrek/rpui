import {ControlWidgetData} from "../../components/view"



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


