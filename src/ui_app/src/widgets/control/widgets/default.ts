import {GHTMLControl} from "../../../glider/glider"
import {getControlWidgetData, Creator, CWBase} from "../interfaces"
import {ControlWidgetData} from "../../../components/view"
import {UserData, NodeData} from "../../../components/msg"




export let meta = getControlWidgetData({
    name:"default", 
    vars:[],
    creator:create})

const view = `
any
    DIV gid=txt

`







export class DefaultCW extends CWBase {




    constructor(rootId:string, wdata:ControlWidgetData) {
        super(view, rootId, wdata)
    }


    update(){
        //this.e.txt.textContent = this._data.toString()
        this.e.txt.innerHTML = ""
        Object.keys(this._data).forEach((node:string)=>{
            this.e.txt.innerHTML += node+":<br/>"
            Object.keys(this._data[node]).forEach((task:string)=>{
                this.e.txt.innerHTML += "&nbsp;&nbsp;"+task+" = "+this._data[node][task]+"<br/>"
            })

        })
    }

}







function create(parm:Creator):CWBase{
    return(new DefaultCW(parm.rootId, parm.wdata))
}