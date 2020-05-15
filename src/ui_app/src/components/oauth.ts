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














class OAuth {




    head:HTMLElement = document.getElementsByTagName('head')[0]
    googleID:string = '291313068128-jbjdvb6mt6c8r01toi9qs1bbclal5t0k.apps.googleusercontent.com'
    injected:boolean = false
    gapi:any //Google gapi





    public init():void{
        Object.assign(document, {"oauth":this})

        // Google
        let gscript = document.createElement("script")
        gscript.src = 'https://apis.google.com/js/platform.js'
        gscript.async = true
        gscript.defer = true
        gscript.onload = this.gapiLoaded.bind(this)
        
        let gid = document.createElement("meta")
        gid.name = 'google-signin-client_id'
        gid.content = this.googleID

        this.head.appendChild(gid)
        this.head.appendChild(gscript)
        
    }




    private gapiLoaded(){
        let w:any = window
        this.gapi = w.gapi
        this.gapi.load('auth2', this.auth2Loaded.bind(this))
    }




    private auth2Loaded(){
        this.gapi.auth2.init({ 
        client_id:this.googleID,
        scope: 'email profile',
        response_type: 'id_token'})

    }




    authorize(callback:Function){
        let inst = this.gapi.auth2.getAuthInstance()
        inst.signIn().then(callback)
    }
}





export let oauth = new OAuth()