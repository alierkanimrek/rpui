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








export interface RpSourceShape {
    id: string
    name: string
    uname: string
    nname: string
}



export function createRpSource(uname: string, nname: string, name: string): RpSourceShape{
    let newSource = {
        id: getUri(uname, nname, name),
        name: name,
        uname: uname,
        nname: nname
    }
    return newSource as RpSourceShape
}



export function getUri (uname: string, nname: string, name: string):string{
    return(uname+"/"+nname+"/"+name)
}



export function parseUri(uri: string):RpSourceShape {

    let p:Array<string>
    
    let result = {
        "id": uri,
        "uname": "",
        "nname": "",
        "name": ""
    }
    

    if(uri.charAt(0) == "/"){    
        p = uri.substr(1).split("/")    }
    else{
        p = uri.split("/")
    }

    try{
        result.uname = p[0]
        result.nname = p[1]
        result.name = p[2]
    }
    catch{    null    }
    return(result)
}