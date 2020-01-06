








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


export function getControlWidgetData(widget:string):ControlWidgetData{
    let res:ControlWidgetData = {
        title: "",
        order: 0,
        widget: widget,
        editable: false,
        autosend: false,
        map: {},
        static: {}
    }
    return(res)
}