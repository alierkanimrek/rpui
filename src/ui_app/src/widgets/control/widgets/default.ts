import {GHTMLControl} from "../../../glider/glider"
import {getControlWidgetData} from "../interfaces"





export let defalut_meta = getControlWidgetData({
    name:"default", 
    vars:[],
    creator:createDefaultCW})

const view = `
any
    P
    | Default Widget
`







export class DefaultCW extends GHTMLControl {




    constructor(rootId:string) {
        super({view:view, root:rootId})
        
    }


}







function createDefaultCW(rootId:string):DefaultCW{
    return(new DefaultCW(rootId))
}