import {GHTMLControl, createGHTML, GHTMLElement} from "../../../glider/glider"
import {getControlWidgetMeta, CWBase, Creator} from "../interfaces"
import {ControlWidgetData} from "../../../components/view"












interface PrgMap{
    [vname:string]: GHTMLElement
}


export let meta = getControlWidgetMeta({
    name:"Simple Progress Bar", 
    vars:[
        "prg1val", 
        "prg1max", 
        "prg2val", 
        "prg2max", 
        "prg3val",
        "prg3max",
        "prg4val",
        "prg4max"],
    staticVars:[
        "prg1name", 
        "prg1max", 
        "prg2name", 
        "prg2max",
        "prg3name", 
        "prg3max",
        "prg4name", 
        "prg4max"],
    creator:create,
    editable_default: false
})


const view = `
any
    DIV gid=pbroot
    
`

const prgView = `
any
    DIV class=columns is-mobile is-1 
        DIV class=column is-narrow
            LABEL gid={label} class=is-capitalized
        DIV class=column
            PROGRESS gid={prg} style=width:100%;
`






class ProgressCW extends CWBase {





    map:PrgMap = {}
    names:Array<string> = ["prg1", "prg2", "prg3", "prg4"]


    constructor(rootId:string, wdata:ControlWidgetData) {
        super(view, rootId, wdata)
        
        this.names.forEach((name:string)=>{
            let val = this._wdata.map[name+"val"]
            let label = this._wdata.static[name+"name"]
            let labelid = name+"_label"
            let prgid = name
            let itemView = prgView.replace("{label}", labelid)
            itemView = itemView.replace("{prg}", prgid)
            if(label == ""){    label = name    }
            
            if(val){
                createGHTML(itemView, this, this.e["pbroot"].id)
                this.map[name] = this.e[prgid]
                this.e[labelid].textContent = label
                //sw.addEventListener("change", this.changed.bind(this))
            }
        })
    }




    /*changed(e:Switch|any){
        this.setCmd(this._wdata.map[e.vname], e.checked)
    }*/



    
    update(){
        
        Object.keys(this.map).forEach((name:string)=>{
            let valsrc = this._wdata.map[name+"val"]
            let maxsrc = this._wdata.map[name+"max"]
            let prg:any = this.map[name]
            let val = Number(this.getTaskData({uri:valsrc}))
            let max:number
            if(this._wdata.static[name+"max"]){
               max = Number(this._wdata.static[name+"max"])
            }
            if(this.getTaskData({uri:maxsrc})){
                max = Number(this.getTaskData({uri:maxsrc}))
            }
            prg.max = max
            prg.value = val 
        })

    }
    
}








function create(parm:Creator):GHTMLControl{
    return(new ProgressCW(parm.rootId, parm.wdata))
}