#!/bin/bash


desktop(){
    echo 'Building desktop'
    sass sass/desktop.scss css/desktop.css --style=compressed --no-source-map
}

hand(){
    echo 'Building hand'
    sass sass/hand.scss css/hand.css --style=compressed --no-source-map
}

wall(){
    echo 'Building wall'
    sass sass/wall.scss css/wall.css --style=compressed --no-source-map
}

all(){
    desktop
    hand
    wall
}


if [[ $1 == "" ]]; then
    all
fi

if [[ $1 == "desktop" ]]; then
    desktop
fi

if [[ $1 == "hand" ]]; then
    hand
fi

if [[ $1 == "wall" ]]; then
    wall
fi

mkdir -p ../../dist/app/css
cp -aRv css/* ../../dist/app/css
cp -aRv bulma/css/bulma.min.css ../../dist/app/css