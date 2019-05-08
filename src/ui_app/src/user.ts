import {GDocument} from "./glider/glider"
//import {Login, LoginData} from "./user/login"
import {Base, BaseData} from "./user/base"






function base():void{
    
    let base = new Base()
    console.log("base")

}






let route = [
    {'/' : base},
]


let store = {
    base: new BaseData(),
}


GDocument.stores(store)
GDocument.route(route)



//history.replaceState({page: 1}, "title 1", "?page=1")
//window.location.hash = "/?page=1"
//console.log(window.location)
//console.log(document.)
