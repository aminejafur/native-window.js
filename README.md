# native-window.js v 1.0 <a href="https://twitter.com/intent/tweet?url=https://github.com/aminejafur/native-window.js" target="_blank">![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social&logo=twitter)</a>
**Build your fully customizable Modal.**

This plugin is a part of a web desk project I am planning to work on and since the window modal is a main feature in web desk I decided to build a plugin for it and share it with the community, while using this plugin you will be able to create a powerful Modal with many features and controls over it like (Resize, Drag, Iconize, destroy and more), also the plugin will allow you to customize your modal theme depending on your needs.

## Preview
![](https://github.com/aminejafur/native-window.js/blob/master/gifs/native-window.gif)

### Demo
You can check a [Codepen demo here](https://codepen.io/aminejafur/pen/jOWVYbz).

## How to use :
## Installation

Start by including `native-window.js` and `native-window.css` or the minified versions in your HTML:

```html
<link rel="stylesheet" type="text/css" href="native-window.css"/>
<script type="text/javascript" src="native-window.js"></script>
```

## Usage & Customization

Create the button or the clickable area that will trigger the window, or you can call the `createNewWindow` function directly when the document is fully loaded.

```html
<div id="nativeWindow" >Open window with Iframe ,default theme and default dimensions</div>
```
Then call the Plugin using (NB: We will call the plugin using an iframe link):

```js
// #nativeWindow, using default theme
document.querySelector('#nativeWindow').addEventListener('click',function(){
createNewWindow({
Title:"My before and after comparison plugin : ",
Link: "https://htmlpreview.github.io/?https://raw.githubusercontent.com/aminejafur/before-effect-slider.js/master/demo/index.html"
});
})
```

Or you can initiate the plugin with the following options (NB: We will call the plugin now using HTML content instead of Iframe link):

```js
createNewWindow({
Title:"Window With HTML Content : ", // Window Title
TitleSize : 13, // Title font size
TitleTextShadow: 'rgb(21, 21, 21) 0px 0px 3px', // Title Text Shadow
TitleTextColor: 'rgb(255, 255, 255)', // Title Text color
Html: myHTML, // Html content
Width: 600, // Width
Height: 300, // Height
Top: 10, // Top Position
Left: 150, // Left Position
BannerBackground: '-webkit-linear-gradient(top, rgb(164, 165, 169), rgb(164, 165, 169))', // Top banner backgroud
WindowShadow: 'hsla(0, 0%, 0%, 0.8) 0px 0px 25px 0px', //Window Shadow
WindowBackground: 'rgb(164, 165, 169)', // Window bakground ( will be visible as window border )
WindowRaduis: '0px', // window corners raduis
ResizeEnable:false, // Enable Resizing
DragEnable: true,  // Enabe dragging
ButtonFull: false, // Show Full screen button
iconizeIcon: 'https://image.flaticon.com/icons/svg/814/814151.svg', // iconize action Icon
normalizeIcon: 'https://image.flaticon.com/icons/svg/814/814144.svg', // normalize action Icon
maximizeIcon: 'https://image.flaticon.com/icons/svg/814/814143.svg' // Maximize action Icon
callbackBefore: () => {alert('before build')}, //Callback Before building window
callbackAfter: () => {alert('after build')}//Callback After building window, add setTimeout to wait animation finish if required ({setTimeout(function(){alert('after build')},200)})
});
```
Also, you can use the following actions to control your windows (Use the window number as parameter, ex: data-thiswindowcount="1"):

```js
// toggleDrag, Toggle between making the window draggable or not.
nativeWindow.toggleDrag(1)

// toggleRightResize, Toggle between making the Right border resizable or not.
nativeWindow.toggleRightResize(1)

// toggleBottomResize, Toggle between making the Bottom border resizable or not.
nativeWindow.toggleBottomResize(1)

// destroy, close the window.
nativeWindow.destroy(1)
```

## TODO

- [ ] Add touch events support.
- [ ] Add .min files.
- [ ] Work on responsive.

## Icons

- Icons from : <a href="https://flaticon.com" target="_blank">Flaticon</a>

### Star the repo to support the project :star:
### Feel free to fork, open pull requests and play around. Thanks! :heart:
