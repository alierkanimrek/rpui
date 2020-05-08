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








import {GHTMLControl, GHTMLInputEvent} from "../../../glider/glider"
import {getControlWidgetMeta, Creator, CWBase} from "../interfaces"
import {ControlWidgetData} from "../../../components/view"
import {NumberInput} from "../../elements/number"






export let meta = getControlWidgetMeta({
    name:"Simple Text View", 
    vars:["txt", "file", "row"],
    staticVars:["file", "row"],
    creator:create,
    autosend_default: false,
    editable: true})

const view = `
any
    DIV
        DIV class=columns is-mobile is-1 style=margin-bottom:0;
            DIV class=column 
                INPUT gid=file name=file type=text 
            DIV gid=rowContainer class=column is-narrow
        TEXTAREA gid=txt style=font-size:0.7rem; padding: 0.3rem; white-space:pre; width:100%
`







export class TxtViewCW extends CWBase {


    file:HTMLInputElement
    row:NumberInput
    txt:HTMLTextAreaElement




    constructor(rootId:string, wdata:ControlWidgetData) {
        super(view, rootId, wdata)
        this.row = new NumberInput(this.e.rowContainer.id)
        this.row.addEventListener("change", this.input.bind(this))
    }




    update(){
        let txt_var = this._wdata.map["txt"]
        let file_var = this._wdata.map["file"]
        let row_var = this._wdata.map["row"]
        let txt_val = this.getTaskData({uri:txt_var})
        let file_val = this.getTaskData({uri:file_var})
        let row_val = this.getTaskData({uri:row_var})
        let row_stval = this._wdata.static["row"]
        let file_stval = this._wdata.static["file"]

        if( this.txt.innerHTML != txt_val){
            this.txt.innerHTML = txt_val
        }
        if(row_val){
            this.txt.style.height = (Number(row_val)+1).toString()+"rem"
            this.row.value = row_val
        }
        else if(row_stval){
            this.txt.style.height = (Number(row_stval)+1).toString()+"rem" 
            this.row.value = row_stval
        }
        else{
            this.txt.style.height = "10rem"
            this.row.value = "10"
        }
        if(file_val){
            this.file.value = file_val
        }
        else if(file_stval){
            this.file.value = file_stval
        }

    }




    input(e:GHTMLInputEvent){
        if(e.name == "file"){
            // Update sending variables at CWBase
            this.setCmd(this._wdata.map["file"], this.file.value)
        }
        else{
            this.setCmd(this._wdata.map["row"], this.row.value)
        }
    }
}







function create(parm:Creator):CWBase{
    return(new TxtViewCW(parm.rootId, parm.wdata))
}