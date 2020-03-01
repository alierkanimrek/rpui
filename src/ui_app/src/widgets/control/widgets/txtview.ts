import {GHTMLControl} from "../../../glider/glider"
import {getControlWidgetMeta, Creator, CWBase} from "../interfaces"
import {ControlWidgetData} from "../../../components/view"






export let meta = getControlWidgetMeta({
    name:"Simple Text View", 
    vars:["txt", "file", "row"],
    staticVars:["file", "row"],
    creator:create})

const view = `
any
    DIV
        TEXTAREA gid=txt style=font-size:0.7rem; padding: 0.3rem; white-space:pre; width:100%

`







export class TxtViewCW extends CWBase {




    constructor(rootId:string, wdata:ControlWidgetData) {
        super(view, rootId, wdata)
    }


    update(){
        let valsrc = this._wdata.map["txt"]
        let row = this._wdata.static["row"]
        let val = this.getTaskData({uri:valsrc})
        this.e.txt.innerHTML = val
        this.e.txt.style.height = row+"rem"
    }

}







function create(parm:Creator):CWBase{
    return(new TxtViewCW(parm.rootId, parm.wdata))
}