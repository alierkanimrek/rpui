/*
Copyright © 2019 <Ali Erkan İMREK>

Permission is hereby granted, free of charge, to any person obtaining a copy of 
this software and associated documentation files (the “Software”), 
to deal in the Software without restriction, including without limitation 
the rights to use, copy, modify, merge, publish, distribute, sublicense, 
and/or sell copies of the Software, and to permit persons to 
whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included 
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL 
THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR 
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, 
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR 
OTHER DEALINGS IN THE SOFTWARE.
*/





import {RpSourceShape, createRpSource, getUri} from './source'









export interface RpStackShape extends RpSourceShape{
    data: {}
}




export interface RpMessageShape{
    uid : string
    nid : string
    uname : string
    nname : string
    _xsrf : string
    stack : any[]
}


export interface RpStackData{
    id : string
    name : string
    uname : string
    nname : string
    data : any 
}




export interface NodeData{
    [tname:string]: object
}




export interface UserData{
    [nname:string]: NodeData
}










export function createRpStack(source: RpSourceShape, data: any): RpStackShape {
    let newStack = {    
        id : source.id,
        name : source.name,
        uname : source.uname,
        nname : source.nname,
        data : data
    }
    return newStack as RpStackShape
}




export function createRpMessage(uname: string, nname: string, stack: RpStack): RpMessageShape {

    let newMessage = {
        uid : "",
        nid : "",
        uname : uname,
        nname : nname,
        _xsrf : getXsrfCookie(),
        stack : stack.stack
    }
    return newMessage as RpMessageShape
}




export function parseStack(msg:string):RpStack{

    let result = new RpStack()
    let src = createRpSource("","","")
    let stack:Array<Object>

    try{
        stack = JSON.parse(msg)["stack"]
        stack.forEach((d:RpStackData) => {
            src.id = getUri(d.uname,d.nname,d.name)
            src.name = d.name
            src.uname = d.uname
            src.nname = d.nname
            result.append(src, d.data)
        })
    }
    catch{
        console.error("[Msg] Message not parsed : " +msg)
    }
    return(result)
}





function getXsrfCookie(): string{
    let cookies = document.cookie.split(/ *; */)
    if (cookies[0] === '')     return ""
    for (let i = 0, j = cookies.length; i < j; i += 1) {
          const cookie = cookies[i].split('=');
          if(cookie[0] === "_xsrf")    return cookie[1]
    }        
    window.console.error("[Msg] XSRF Cookie not found!")
    return ""
}










export class RpStack {
    



    private _stack:{ [s: string]: RpStackShape } = {}
    



    public append( source: RpSourceShape, data: any) {
        this._stack[source.id] = createRpStack(source, data)
    }




    public update(id: string, data: any): void{
        if (this._stack.hasOwnProperty(id) ) {
            this._stack[id]['data'] = data
        }
        else{
            window.console.error("[Msg] Unknown id while updating:"+String(id))
        }
    }




    public data(id: string): any{
        if (this._stack.hasOwnProperty(id) ) {
            return this._stack[id]['data']
        }
        else{
            window.console.error("[Msg] Unknown id while getting data:"+String(id))
        }
    }



    public dataVar(vr:string, id?:string): any{
        try{
            if(id){
                return(this.data(id)[vr])
            }
            else{
                let keys = Object.keys(this._stack)
                let d = this._stack[keys[0]]["data"] as any
                return(d[vr])
            }
        }
        catch{
            console.error("[Msg] Unknown id or var : "+id+" - "+vr)   
            return(null)
        }
    }



    public delete(id: string): void{
        if (this._stack.hasOwnProperty(id) ) {
            delete this._stack[id]
        }
        else{
            window.console.error("[Msg] Unknown id while deleting data:"+String(id))
        }
    }




    get stack(): any[]{
        let lst = []
        let keys = Object.keys(this._stack)
        for (var i = keys.length - 1; i >= 0; i--) {
            lst.push(this._stack[keys[i]])
        }
        return lst
    }

}







export class RpMessage {



    private _msg: RpMessageShape
    public xsrf: string


    constructor(uname: string, nname: string, stack: RpStack) {
        this._msg = createRpMessage(uname, nname, stack)
        this.xsrf = this._msg._xsrf
    }



    get toString(): string{
        return JSON.stringify(this._msg)
    }
}



