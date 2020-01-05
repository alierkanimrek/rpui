import {GHTMLControl} from "../../../glider/glider"
import {getControlWidgetData, Creator} from "../interfaces"
import {ControlWidgetData} from "../../../components/view"




interface TestCWVars{
    width: number,
    height: number,
    depth: number,
    color: string
}


interface TestCWStaticVars{
    sv1: string,
    sv2: number
}


export let meta = getControlWidgetData({
    name:"test", 
    vars:["width","height","depth", "color"],
    staticVars:["sv1", "sv2"],
    creator:create
})


const view = `
any
    P
    | Test Widget
`







export class TestCW extends GHTMLControl {




    constructor(rootId:string, wdata:ControlWidgetData) {
        super({view:view, root:rootId})
        
    }


}








function create(parm:Creator):GHTMLControl{
    return(new TestCW(parm.rootId, parm.wdata))
}