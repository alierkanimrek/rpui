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
import {ControlWidgetMeta, Creator, CWBase} from "./interfaces"
import {ControlWidgetData, getControlWidgetData} from "../../components/view"

//import {meta as testMeta} from "./widgets/test"
import {meta as defaultMeta} from "./widgets/default"
import {meta as swMeta} from "./widgets/switch"
import {meta as prgMeta} from "./widgets/progress"
import {meta as slMeta} from "./widgets/slider"
import {meta as txtMeta} from "./widgets/txtview"




interface MetaData {
    [name: string]: ControlWidgetMeta
}

interface CWNames {

}



const lst = [
    defaultMeta,
    swMeta,
    prgMeta,
    slMeta,
    txtMeta]








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
