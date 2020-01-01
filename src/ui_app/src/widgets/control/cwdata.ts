import {ControlWidgetMeta} from "./interfaces"

import {defalut_meta} from "./widgets/default"
import {test_meta} from "./widgets/test"



interface MetaData {
    [name: string]: ControlWidgetMeta
}

interface CWNames {

}




const lst = [
    defalut_meta,
    test_meta]








class CWMetaData {
    



    private _metadata: MetaData = {}
    private _names: Array<string> = []



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