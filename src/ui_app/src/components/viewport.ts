import {cookie} from "../components/cookies"





/*
    Viewport types
*/
export enum VPTypes {
    Desktop = "desktop",    // Desktop monitors, Laptops etc.
    Hand = "hand",          // Phones, tablets etc.
    Wall = "wall"           // Wide screen devices like TV
}








let defaultVP = VPTypes.Desktop







class Viewport  {




    private cookie:string = "viewport"
    private _current:VPTypes
    private _link:HTMLElement
    private _path:string




    constructor(path:string) {
        this._path = path
        this._link = document.createElement("link")
        this._link.setAttribute("rel", "stylesheet")
        this._link.setAttribute("type", "text/css")
        document.head.appendChild(this._link)
        this.discover()
        this.load()
    }




    private discover():void{
        let c = cookie.get(this.cookie)
        if(c == VPTypes.Desktop || c == VPTypes.Hand || c == VPTypes.Wall){
            this._current = c
        }
        else{
            // Discover needs development
            this._current = VPTypes.Desktop
        }
    }



    private load():void{
        this._link.setAttribute("href", this._path+"/"+this._current+".css")
    }




    set current(vp:VPTypes){
        cookie.set(this.cookie, vp, 999)
        this._current = vp
        this.load()
    }




    get current():VPTypes{
        return(this._current)
    }
}





export let viewport = new Viewport("/heap/css")