import {GHTMLControl, createGHTML} from "../../../glider/glider"
import {getControlWidgetMeta, CWBase, Creator} from "../interfaces"
import {ControlWidgetData} from "../../../components/view"
import {Switch} from "../../elements/switch"











interface SwMap{
    [vname:string]: Switch
}


export let meta = getControlWidgetMeta({
    name:"Simple Switch", 
    vars:["sw1","sw2","sw3","sw4"],
    staticVars:["sw1", "sw2", "sw3", "sw4"],
    creator:create
})


const view = `
any
    DIV gid=ssroot
    
`

const swView = `
any
    DIV class=columns is-mobile is-1 
        DIV class=column
            LABEL gid={label} class=is-capitalized
        DIV class=column is-narrow gid={sw}

`






class SwitchCW extends CWBase {





    map:SwMap = {}


    constructor(rootId:string, wdata:ControlWidgetData) {
        super(view, rootId, wdata)
        
        Object.keys(this._wdata.map).forEach((vname:string)=>{
            let val = this._wdata.map[vname]
            let label = this._wdata.static[vname]
            let labelid = vname+"_label"
            let swid = vname+"_sw"
            let itemView = swView.replace("{label}", labelid)
            itemView = itemView.replace("{sw}", swid)
            if(label == ""){    label = vname    }
            
            if(val){
                createGHTML(itemView, this, this.e["ssroot"].id)
                let sw = new Switch(this.e[swid].id)
                Object.assign(sw, {"vname": vname})
                this.map[vname] = sw
                this.e[labelid].textContent = label
                sw.addEventListener("change", this.changed.bind(this))
            }
        })
    }




    changed(e:Switch|any){
        this.setCmd(this._wdata.map[e.vname], e.checked)
    }



    
    update(){
        Object.keys(this._wdata.map).forEach((vname:string)=>{
            let source = this._wdata.map[vname]
            let target = this.map[vname]
            let val:string = ""
            if(source){
                val = String(this.getTaskData({uri:source}))
                switch (val.toLowerCase()) {
                    case "true" || "1":
                        this.map[vname].checked = true
                        break      
                    case "false" || "0":
                        this.map[vname].checked = false
                }
            }
        })
    }
    
}








function create(parm:Creator):GHTMLControl{
    return(new SwitchCW(parm.rootId, parm.wdata))
}