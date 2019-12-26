







export const rules = {

    uname :  '[a-z0-9_]{3,20}',
    nname : '[a-z0-9_]{3,20}',
    tname : '[a-z0-9_]{3,20}',
    vname : '[a-z0-9_]{3,20}'

}


export const urls = {

    userApp : "^[\s\/]user[\s\/].+", 
    nodes : "^[\s\/]"+rules.uname+"$",
    nodeedit : "^[\s\/]"+rules.uname+"[\s\/]"+rules.nname+"[\s\/]edit",
    tasks : "^[\s\/]"+rules.uname+"[\s\/]"+rules.nname+"[\s\/]edit/tasks",
    view:  "^[\s\/]"+rules.uname+"[\s\/]view[\s\/]"+rules.vname
}



