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














class Cookies {




    public set(cname:string, cvalue:string, exdays?:number):void {
        if(!exdays){    exdays = 30    }
        let d = new Date()
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
        let expires = "expires="+d.toUTCString()
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/"
    }




    public get(cname:string):string {
        let name = cname + "="
        let ca = document.cookie.split(';')
        
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i]
            while (c.charAt(0) == ' ') {
                c = c.substring(1)
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length)
            }
        }
        return("")
    }

}



/*
Example


function check() {

    let cookie = new Cookies()
    var user = cookie.get("username");
    if (user != "") {
        alert("Welcome again " + user);
    } 
    else {
        user = prompt("Please enter your name:", "");
        if (user != "" && user != null) {
            cookie.set("username", user, 365);
        }
    }
} 
*/



export let cookie = new Cookies()