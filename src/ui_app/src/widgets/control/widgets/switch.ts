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
    creator:create,
    autosend_default: true,
    editable_default: true
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