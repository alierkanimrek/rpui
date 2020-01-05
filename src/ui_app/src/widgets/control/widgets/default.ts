import {GHTMLControl} from "../../../glider/glider"
import {getControlWidgetData, Creator} from "../interfaces"
import {ControlWidgetData} from "../../../components/view"





export let meta = getControlWidgetData({
    name:"default", 
    vars:[],
    creator:create})

const view = `
any
    P
    | Default Widget
`







export class DefaultCW extends GHTMLControl {




    constructor(rootId:string, wdata:ControlWidgetData) {
        super({view:view, root:rootId})
        
    }


}







function create(parm:Creator):GHTMLControl{
    return(new DefaultCW(parm.rootId, parm.wdata))
}