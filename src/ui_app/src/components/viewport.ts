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
    private _current:VPTypes = defaultVP




    constructor() {
        this.discover()
    }




    private discover():void{
        let c = cookie.get(this.cookie)
        if(c == VPTypes.Desktop || c == VPTypes.Hand || c == VPTypes.Wall){
            this._current = c
        }
    }




    set current(vp:VPTypes){
        cookie.set(this.cookie, vp, 999)
        this._current = vp
    }




    get current():VPTypes{
        return(this._current)
    }
}





export let viewport = new Viewport()