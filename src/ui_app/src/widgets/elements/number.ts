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








import {GHTMLControl} from "../../glider/glider"









const view1 = `
any
    DIV class=columns is-mobile
        DIV class=column is-narrow style=padding-right:0.2rem; display:flex; border-style:solid none solid solid;
            i gid=plus class=fas fa-plus  style=cursor:pointer; margin:auto;
        DIV class=column style=padding:0; display:flex; border-style:solid none solid none;
            input gid=number type=number style=border:none;
        DIV class=column is-narrow style=padding-left:0.2rem; display:flex; border-style:solid solid solid none;
            i gid=minus class=fas fa-minus  style=cursor:pointer; margin:auto;
`


const view = `
any
    DIV class=columns is-mobile style=margin:auto;
        DIV class=column is-narrow style=padding-right:0.2rem; display:flex; 
            i gid=plus class=fas fa-plus  style=cursor:pointer; margin:auto;
        DIV class=column style=padding:0; display:flex; 
            input gid=number type=number 
        DIV class=column is-narrow style=padding-left:0.2rem; display:flex;
            i gid=minus class=fas fa-minus  style=cursor:pointer; margin:auto;
`







export class NumberInput extends GHTMLControl {





    plus:HTMLElement
    minus:HTMLElement
    number:HTMLInputElement
    freeze:boolean = false
    changeEvent:boolean = true


    constructor(rootId:string) {
        super({view:view, root:rootId})
        this.plus.addEventListener("click", this.incdec.bind(this, 1))
        this.minus.addEventListener("click", this.incdec.bind(this, -1))
    }




    private incdec(v:number):void{
        if(this.freeze){    return    }
        this.value = (Number(this.number.value) + Number(v)).toString()
        if(this.changeEvent){    this.dispatchEvent("change", this)    }
        else{    this.changeEvent = true    }
    }




    public set value(v : string) {
        this.number.value = v
        this.number.style.width = Number(v.length)+2+"rem"
    }




    public get value() : string {
        return(this.number.value)
    }
}

