







export const rules = {

    'uname' :  '[a-z0-9_]{3,20}',
    'nname' : '[a-z0-9_]{3,20}',

}


export const urls = {

    "nodes" : "^[\\s\\/]"+rules.uname,
    "nodeedit" : "^[\\s\\/]"+rules.uname+"[\\s\\/]"+rules.nname+"[\\s\\/]edit"
}



