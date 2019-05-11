#!/bin/bash

# This source file is part of the rpdev open source project
#    Copyright 2018 Ali Erkan IMREK and project authors
#    Licensed under the MIT License 




path=$(dirname $(readlink -f $0))
cd $path

po_path=po
mo_path=mo
json_path=json

app_names=(user)
locales=(tr)
locale_files=(tr)




current="$(du -bs *.py)"
last="$(cat .py.total)"

if [[ $current != $last ]]; then
    du -bs *.py > .py.total
    
    for app in *.py
    do
        cd $path
        mkdir -p $po_path/

        echo -e  "\n\nUpdate $app.pot"
        xgettext --language=Python --keyword=_ --from-code=UTF-8 --output=$po_path/$app.pot $app

        cd $po_path
        for locale in $locales
        do [ -f "$locale" ]
            mkdir -p $locale/
            echo -e  "\nGenerating $locale"
            msginit --input=$app.pot --locale=$locale --output-file=$locale/$app.po
        done
        for locale in $locale_files
        do [ -f "$locale" ]
            echo -e  "\nUpdating $locale"
            msgmerge --update $locale/$app.po $app.pot
        done    
    done
fi


cd $path

current="$(du -bs $po_path)"
last="$(cat .po.total)"

if [[ $current != $last ]]; then
    du -bs $po_path > .po.total

    for app in *.py
    do
        echo -e  "\n\nGenerate $app mo"

        for locale in $locale_files
        do [ -f "$locale" ]
            echo -e  "\nGenerating $locale"
            mkdir -p $mo_path/$locale/LC_MESSAGES/
            mkdir -p $json_path/$locale/
            msgfmt $po_path/$locale/$app.po --output-file $mo_path/$locale/LC_MESSAGES/$app.mo
            echo -e  "\nGenerating json"
            python3 $app
        done
    done
fi
