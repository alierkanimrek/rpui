#!/bin/bash

# This source file is part of the rpdev open source project
#    Copyright 2018 Ali Erkan IMREK and project authors
#    Licensed under the MIT License 



if [[ $1 == "" ]]; then
    echo 'update.sh <locale>'
    echo 'update.sh en-us'
    exit -1
fi

path=$(dirname $(readlink -f $0))
cd $path

po_path=po
mo_path=mo
json_path=json

app_names=(user)
locale=$1




current="$(du -bs *.py)"
last="$(cat .py.total)"

if [[ $current != $last ]]; then
    du -bs *.py > .py.total
    
    for app in *.py
    do
        fn="${app%.*}"
        echo -e "\n\n$Updating source of $app__________________________"
        mkdir -p $po_path/
        echo -e  "\nUpdate pot____"
        xgettext --language=Python --keyword=_ --from-code=UTF-8 --output=$po_path/$fn.pot $app

        cd $po_path
        mkdir -p $locale/
        echo -e  "\nGenerating po____"
        msginit --input=$fn.pot --locale=$locale --output-file=$locale/$fn.po

        echo -e  "\nUpdating po____"
        msgmerge --update $locale/$fn.po $fn.pot
    done
fi


cd $path

current="$(du -bs $po_path)"
last="$(cat .po.total)"

if [[ $current != $last ]]; then
    du -bs $po_path > .po.total

    for app in *.py
    do
        
        fn="${app%.*}"
        echo -e "\n\n$Updating translations of $app__________________________"

        mkdir -p $mo_path/$locale/LC_MESSAGES/
        mkdir -p $json_path/$locale/
        msgfmt $po_path/$locale/$fn.po --output-file $mo_path/$locale/LC_MESSAGES/$fn.mo
    done
fi
