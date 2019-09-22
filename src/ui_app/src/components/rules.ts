







export const rules = {

    'uname' :  '[a-zA-Z0-9._]',
    /*           └─────┬────┘└───┬──┘└─────┬─────┘└─────┬─────┘ └───┬───┘
                       │         │         │            │           no _ or . at the end
                       │         │         │            │
                       │         │         │            allowed characters
                       │         │         │
                       │         │         no __ or _. or ._ or .. inside
                       │         │
                       │         no _ or . at the beginning
                       │
                       username is 8-20 characters long
    */

    'nname' : '^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$'
}




