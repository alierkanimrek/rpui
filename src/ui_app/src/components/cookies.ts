





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