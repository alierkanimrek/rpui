import {GHTMLControl, GDataObject} from "../../glider/glider"
import {GetText} from "../../i18n/gettext"
import {VPTypes, viewport} from "../../components/viewport"
import {Switch} from "../elements/switch"

import view from './viewport.ghtml'











export class ViewportMenuItem extends GHTMLControl {




    desktopToggleContainer:HTMLElement
    handToggleContainer:HTMLElement
    wallToggleContainer:HTMLElement

    desktopSw:Switch
    handSw:Switch
    wallSw:Switch

    trns:GetText



    constructor() {
        super({view:view})

        this.trns = this.store("trns").t.translations("base")

        this.desktopSw = new Switch(this.desktopToggleContainer.id)
        this.handSw = new Switch(this.handToggleContainer.id)
        this.wallSw = new Switch(this.wallToggleContainer.id)

        this.trns.updateStatics()
    }




}
