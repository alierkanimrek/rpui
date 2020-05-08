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








import {GHTMLControl} from "../../../glider/glider"
import {getControlWidgetMeta, Creator, CWBase} from "../interfaces"
import {ControlWidgetData} from "../../../components/view"
import {UserData, NodeData} from "../../../components/msg"




export let meta = getControlWidgetMeta({
    name:"default", 
    vars:[],
    creator:create,
    editable_default:false})

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
                let val = this._data[node][task].toString()
                let more = ""
                if(val.length > 25){    more = "..."    }
                this.e.txt.innerHTML += "&nbsp;&nbsp;"+task+" = "+val.slice(0,25)+more+"<br/>"
            })

        })
    }

}







function create(parm:Creator):CWBase{
    return(new DefaultCW(parm.rootId, parm.wdata))
}