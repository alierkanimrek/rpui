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








import {GHTMLControl, GDataObject} from "../../glider/glider"
import {Translator} from "../../i18n/gettext"











const view = `
mainMenuContainer
  DIV
    DIV class=tile is-parent gid=userSection
      DIV class=tile is-child box
        P gid=sectionTitleLabel class=title is-5 id=mainMenuUrTitle
        DIV class=tile is-child
          DIV class=columns is-mobile is-1 
            DIV class=column is-narrow
              i gid=uimg class=fas fa-user role=button style=float:left; font-size:4em;
            DIV class=column
              P gid=unameLabel class=title is-size-6 is-capitalized
              A gid=logoutButton id=mainMenuUrLogoutLink
            DIV class=column is-narrow
              A class=button is-success style=float: right; gid=settingsButton id=mainMenuUrSettingsButton
`












export class UserItem extends GHTMLControl {





    userSection: HTMLElement
    logoutButton: HTMLButtonElement
    settingsButton: HTMLButtonElement
    unameLabel: HTMLLabelElement


    eventMap: any = [
        [this.logoutButton, "click", this.logout],
        [this.settingsButton, "click", this.settings]
    ]




    constructor() {
        super({view:view})
        
        this.checkSession()
        this.linkEvents(this.eventMap)    
    }




    checkSession():void{
        let uname = this.gDoc.gData("session").user
        if(uname){
            this.unameLabel.textContent = uname
            this.userSection.style.visibility = "visible"
            this.userSection.style.height = ""
        }
        else{
            this.userSection.style.visibility = "hidden"
            this.userSection.style.height = "0"
        }
    }




    logout(){
        this.gDoc.gData("session").logout()
    }




    settings(){
        this.gDoc.navigate("/user/settings")
    }


}
