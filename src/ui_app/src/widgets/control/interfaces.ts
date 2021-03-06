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








import {GHTMLControl} from "../../glider/glider"
import {ControlWidgetData, VariableMap} from "../../components/view"
import {UserData, NodeData} from "../../components/msg"
import {parseUri} from "../../components/source"
import {metaData} from "./cwdata"


export interface ControlWidgetMeta{
    name: string,
    desc: string,
    vars: Array<string>,
    static: Array<string>,
    creator: Function,
    editable: boolean,
    autosend: boolean,
    editable_default: boolean,
    autosend_default: boolean
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
    staticVars?: Array<string>,
    editable?: boolean,
    autosend?: boolean,
    editable_default?: boolean,
    autosend_default?: boolean}):ControlWidgetMeta{

    let res:ControlWidgetMeta = {
        name:parm.name, 
        vars:parm.vars, 
        creator:parm.creator, 
        desc:"", 
        static:[],
        editable: false,
        autosend: false,
        editable_default: false,
        autosend_default: false}
    if(parm.desc){    res.desc = parm.desc    }
    if(parm.staticVars){    res.static = parm.staticVars    }
    if(parm.autosend_default){
        res.autosend_default = true
        res.editable_default = true
        res.editable = true
    }
    if(parm.editable_default){
        res.editable_default = true
    }
    if(parm.autosend){
        res.editable = true
        res.autosend = true
    }
    if(parm.editable){
        res.editable = true
    }
    return(res)
}





export class CWBase extends GHTMLControl{


    protected _data: UserData
    protected _wdata: ControlWidgetData
    private _meta: ControlWidgetMeta
    protected _cmd: VariableMap = {}    //{uri:value,... } for sending
    protected _up: boolean = true



    
    constructor(view:string, rootId:string, wdata:ControlWidgetData) {
        super({view:view, root:rootId})
        this._wdata = wdata
        this._meta = metaData.getData(wdata.widget)
    }




    set data(data:UserData){
        this._data = data
        if(this._up){
            this.update()
        }
    }


    set updating(up:boolean){
        this._up = up
    }


    get updating():boolean{
        return(this._up)
    }


    get meta():ControlWidgetMeta{
        return(this._meta)
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
        // Update (this)VariableMap for sending command
        if(this._wdata.editable){
            this._cmd[uri] = val
            // Trigger "cmd" event for sending VariableMap by ControlItem 
            this.dispatchEvent("cmd", this)
        }
    }




    clearCmd(){
        this._cmd = {}
    }




    private sending():void{
        if(this.autoSend){
            
        }
    }

}