








export interface VariableMap {
    [name: string]: string
}


export interface ControlWidgetData{
    title: string,
    order: number,
    widget: string,
    editable: boolean,
    autosend: boolean,
    map: VariableMap,
    static: VariableMap
}


export interface ControlView{
    vname: string,
    uname: string,
    decs: string,
    items: Array<ControlWidgetData>
}


