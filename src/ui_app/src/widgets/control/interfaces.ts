import {GHTMLControl} from "../../glider/glider"
import {ControlWidgetData, VariableMap} from "../../components/view"
import {UserData, NodeData} from "../../components/msg"
import {parseUri} from "../../components/source"


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




export function getControlWidgetMeta(parm:{
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
    protected _cmd: VariableMap = {}


    
    constructor(view:string, rootId:string, wdata:ControlWidgetData) {
        super({view:view, root:rootId})
        this._wdata = wdata
    }




    set data(data:UserData){
        this._data = data
        this.update()
    }




    getTaskData(parm:{uri?:string, nname?:string, tname?:string}):any{
        if( parm.nname && parm.tname){
            try{    return(this._data[parm.nname][parm.tname])    }
            catch{  }
        }
        else if (parm.uri) {
            let uri = parseUri("any/"+parm.uri)
            try{    return(this._data[uri.nname][uri.name])    }
            catch{  }
        }
        return(null)  
    }




    //Override method
    protected update():void{}




    get autoSend():boolean{
        return(this._wdata.autosend)
    }




    get cmd():VariableMap{
        let ret = this._cmd
        this._cmd = {}
        this.sending()
        return(ret)
    }




    setCmd(uri:string, val:any){
        if(this._wdata.editable){
            this._cmd[uri] = val
            this.dispatchEvent("cmd", this)
        }
    }



    private sending():void{
        if(this.autoSend){
            
        }
    }

}