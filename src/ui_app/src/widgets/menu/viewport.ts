import {GHTMLControl, GDataObject} from "../../glider/glider"
import {GetText} from "../../i18n/gettext"
import {VPTypes, viewport} from "../../components/viewport"
import {Switch} from "../elements/switch"

import view from './viewport.ghtml'











export class ViewportMenuItem extends GHTMLControl {




    private desktopToggleContainer:HTMLElement
    private handToggleContainer:HTMLElement
    private wallToggleContainer:HTMLElement

    private desktopSw:Switch
    private handSw:Switch
    private wallSw:Switch
    private switches:Array<Switch>

    private _value:VPTypes

    private trns:GetText

    private eventMap: any



    constructor() {
        super({view:view})

        this.trns = this.store("trns").t.translations("base")

        this.desktopSw = new Switch(this.desktopToggleContainer.id)
        this.handSw = new Switch(this.handToggleContainer.id)
        this.wallSw = new Switch(this.wallToggleContainer.id)

        this.switches = [this.desktopSw, this.handSw, this.wallSw]

        this.trns.updateStatics()

        this.eventMap = [
            [this.desktopSw, "change", this.toggle],
            [this.handSw, "change", this.toggle],
            [this.wallSw, "change", this.toggle]        
        ]
        this.linkEvents(this.eventMap)

        this.value = viewport.current
    }




    toggle(e:Switch){

        if(e.checked){    
            this.switches.forEach((sw:Switch)=>{
                if(sw==e){
                    e.freeze = true
                    if(e == this.desktopSw){    viewport.current = VPTypes.Desktop    } 
                    if(e == this.handSw){    viewport.current = VPTypes.Hand    }                         
                    if(e == this.wallSw){    viewport.current = VPTypes.Wall    } 
                }
                else{
                    sw.freeze = false
                    sw.checked = false
                }
            })
        }
    }



    set value(val:VPTypes){
        if(val == VPTypes.Desktop){    this.desktopSw.checked = true    }
        if(val == VPTypes.Hand){    this.handSw.checked = true    }
        if(val == VPTypes.Wall){    this.wallSw.checked = true    }
    }


    get value():VPTypes{
        return(this._value)
    }

}
