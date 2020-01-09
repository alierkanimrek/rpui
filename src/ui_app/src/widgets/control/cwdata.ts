import {GHTMLControl} from "../../glider/glider"
import {ControlWidgetMeta, Creator, CWBase} from "./interfaces"
import {ControlWidgetData, getControlWidgetData} from "../../components/view"

import {meta as defaultMeta} from "./widgets/default"
import {meta as testMeta} from "./widgets/test"



interface MetaData {
    [name: string]: ControlWidgetMeta
}

interface CWNames {

}



const lst = [
    defaultMeta,
    testMeta]








class CWMetaData {
    



    private _metadata: MetaData = {}
    private _names: Array<string> = []
    public default: string = "default"




    constructor() {
        lst.forEach((md:ControlWidgetMeta)=>{ 
            this.add(md)
        })
        this._names.sort()
    }




    private add(metadata:ControlWidgetMeta):void{
        this._metadata[metadata.name] = metadata
        this._names.push(metadata.name)
    }



    get names():Array<string>{
        return(this._names)
    }



    public getData(name:string):ControlWidgetMeta{
        return(this._metadata[name])
    }
}






export let metaData = new CWMetaData()







export function createCW(parm:Creator):CWBase{
    if(parm.wdata){
        if(metaData.names.indexOf(parm.wdata.widget) > -1){
            return(metaData.getData(parm.wdata.widget).creator({
                rootId:parm.rootId, 
                wdata:parm.wdata}))
        }
        else{
            parm.wdata.widget = metaData.default
            return(metaData.getData(metaData.default).creator({
                rootId:parm.rootId, 
                wdata:parm.wdata}))
        }
    }
    else{
        return(metaData.getData(metaData.default).creator({
            rootId:parm.rootId, 
            wdata:getControlWidgetData(metaData.default)}))
    }
}
