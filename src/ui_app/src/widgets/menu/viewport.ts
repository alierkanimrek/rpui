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
