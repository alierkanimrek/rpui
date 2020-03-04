import {GHTMLControl, GHTMLInputEvent} from "../../../glider/glider"
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
        DIV class=columns is-mobile is-1 style=margin-bottom:0;
            DIV class=column 
                INPUT gid=file name=file type=text
            DIV class=column is-narrow
                INPUT gid=row name=row type=number style=width:3.5rem;
        TEXTAREA gid=txt style=font-size:0.7rem; padding: 0.3rem; white-space:pre; width:100%

`







export class TxtViewCW extends CWBase {


    file:HTMLInputElement
    row:HTMLInputElement
    txt:HTMLTextAreaElement




    constructor(rootId:string, wdata:ControlWidgetData) {
        super(view, rootId, wdata)
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
            this.txt.style.height = row_val+"rem"
            this.row.value = row_val
        }
        else if(row_stval){
            this.txt.style.height = row_stval+"rem"
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