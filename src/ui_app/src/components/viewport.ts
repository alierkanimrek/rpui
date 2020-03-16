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








import {cookie} from "../components/cookies"





/*
    Viewport types
*/
export enum VPTypes {
    Desktop = "desktop",    // Desktop monitors, Laptops etc.
    Hand = "hand",          // Phones, tablets etc.
    Wall = "wall"           // Wide screen devices like TV
}


const userAgentTerms = {
    "hand" : ["Android", "iPhone", "iPad", "iPod", "Windows Mobile"],
    "desktop" : ["Windows NT", "Macintosh", "X11"],
    "wall" : ["Xbox"]
}





let defaultVP = VPTypes.Hand







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
            userAgentTerms.hand.forEach((term:string)=>{
                if(navigator.userAgent.indexOf(term) > -1){
                    this._current = VPTypes.Hand
                }    
            })
            if(typeof this._current == "undefined"){
                userAgentTerms.desktop.forEach((term:string)=>{
                    if(navigator.userAgent.indexOf(term) > -1){
                        this._current = VPTypes.Desktop
                    }    
                })
            }
            if(typeof this._current == "undefined"){
                userAgentTerms.wall.forEach((term:string)=>{
                    if(navigator.userAgent.indexOf(term) > -1){
                        this._current = VPTypes.Wall
                    }
                })
            }
            if(typeof this._current == "undefined"){
                this._current = defaultVP
            }
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