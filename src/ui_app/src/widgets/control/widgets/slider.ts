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








import {GHTMLControl, createGHTML, GHTMLElement, GHTMLInputEvent} from "../../../glider/glider"
import {getControlWidgetMeta, CWBase, Creator} from "../interfaces"
import {ControlWidgetData} from "../../../components/view"












interface SlMap{
    [vname:string]: GHTMLElement
}


export let meta = getControlWidgetMeta({
    name:"Simple Slider Bar", 
    vars:[
        "sl1val", 
        "sl1max",
        "sl1min", 
        "sl2val", 
        "sl2max",
        "sl2min", 
        "sl3val", 
        "sl3max",
        "sl3min", 
        "sl4val", 
        "sl4max",
        "sl4min"],
    staticVars:[
        "sl1name", 
        "sl1max",
        "sl1min",
        "sl2name", 
        "sl2max",
        "sl2min",
        "sl3name", 
        "sl3max",
        "sl3min",
        "sl4name", 
        "sl4max",
        "sl4min",],
    creator:create,
    editable_default: true,
    autosend: true

})


const view = `
any
    DIV gid=slroot
    
`

const slView = `
any
    DIV class=columns is-mobile is-1 
        DIV class=column is-narrow
            LABEL gid={label} class=is-capitalized
        DIV class=column
            INPUT gid={sl} type=range min={slmin} max={slmax} name={slname} labelid={labelval} style=width:100%;
        DIV class=column is-narrow
            LABEL gid={labelval}
`






class SliderCW extends CWBase {





    map:SlMap = {}
    names:Array<string> = ["sl1", "sl2", "sl3", "sl4"]


    constructor(rootId:string, wdata:ControlWidgetData) {
        super(view, rootId, wdata)
        //this._wdata Widget properties
        // .map Variable names
        // .static Static values
        
        this.names.forEach((name:string)=>{
            let val_src = this._wdata.map[name+"val"]
            let label = this._wdata.static[name+"name"]
            let label_id = name+"_label"
            let val_min = this._wdata.static[name+"min"]
            let val_max = this._wdata.static[name+"max"]
            let label_val_id = name+"_labelval"
            let itemView = slView.replace("{label}", label_id)
            itemView = itemView.replace("{sl}", name)
            itemView = itemView.replace("{slmin}", val_min)
            itemView = itemView.replace("{slmax}", val_max)
            itemView = itemView.replace("{slname}", name)
            itemView = itemView.replace("{labelval}", label_val_id)
            itemView = itemView.replace("{labelval}", label_val_id) //for second
            if(label == ""){    label = name    }
            
            if(val_src){
                createGHTML(itemView, this, this.e["slroot"].id)
                this.map[name] = this.e[name]
                this.e[label_id].textContent = label
                this.e[name].addEventListener("change", this.changed.bind(this))
            }
        })
    }




    changed(e:Event){
        let target:any = e.target
        let label = this.e[target.getAttribute("labelid")]
        label.textContent = target.value
    }




    
    update(){
        
        Object.keys(this.map).forEach((name:string)=>{
            let val_src = this._wdata.map[name+"val"]
            let max_src = this._wdata.map[name+"max"]
            let min_src = this._wdata.map[name+"min"]
            let sl:any = this.map[name]
            let sl_val_label:any = this.e[name+"_labelval"]
            let val = Number(this.getTaskData({uri:val_src}))
            let max:number
            let min:number
            if(this._wdata.static[name+"max"]){
               max = Number(this._wdata.static[name+"max"])
            }
            else if(this.getTaskData({uri:max_src})){
                max = Number(this.getTaskData({uri:max_src}))
            }
            if(this._wdata.static[name+"min"]){
               min = Number(this._wdata.static[name+"min"])
            }
            else if(this.getTaskData({uri:min_src})){
                min = Number(this.getTaskData({uri:min_src}))
            }
            sl.max = max
            sl.min = min
            sl.value = val 
            sl_val_label.textContent = val.toString()
        })

    }





    input(e:GHTMLInputEvent){
        this.setCmd(this._wdata.map[e.name+"val"], e.value)
    }

}








function create(parm:Creator):GHTMLControl{
    return(new SliderCW(parm.rootId, parm.wdata))
}