import {GHTMLControl} from "../../glider/glider"








const view = `
any
    IMG gid=img style=width: 4rem; margin:auto; display:flex;
`


const Online = "/heap/wgt/nodeitem/status-online.png"
const Offline = "/heap/wgt/nodeitem/status-offline.png"









export class NodeStatus extends GHTMLControl {





    _status:boolean = false
    img: HTMLImageElement




    constructor(rootId:string) {
        super({view:view, root:rootId})
        this.img.src = Offline
    }



    public set status(v : boolean) {
        if(v){
            this.img.src = Online
        }
        else{
            this.img.src = Offline
        }
        this._status = v;
    }




    public get status():boolean{
        return(this._status)
    }
}

