/*
 *
 * native-window.js | V 1.0
 *
 * Copyright (C) 2020 Amine Jafur
 *
 * www.aminejafur.com/nativeWindow
 *
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], function () {
      return factory(root);
    });
  } else if (typeof exports === "object") {
    module.exports = factory(root);
  } else {
    root.nativeWindow = factory(root);
  }
})(
  typeof global !== "undefined"
    ? global
    : typeof window !== "undefined"
    ? window
    : this,
  function (root) {
    // stay strict, stay clean!
    "use strict";

    // feature test
    const supports =
      "querySelectorAll" in document && "addEventListener" in root;

    // helpers
    const logError = (message) =>
      console.log(`%c ${message} `, "color:red;font-weight:bold;");

    const createNode = (element) => document.createElement(element);

    const append = (parent, el) => parent.appendChild(el);

    const onMultiListener = (el, s, fn) => {
      s.split(" ").forEach((e) => el.addEventListener(e, fn, false));
    };

    // prevent text select on drag
    const disableSelect = (e) => e.preventDefault();
    
    // fixing some conflicts between windows
    const fixConflict = () => {
      let allWindows = document.querySelectorAll(`#${mainDivID}`);
      for (let i = 0; i < allWindows.length; i++) {
        if (
          allWindows[i].getAttribute("data-thiswindowcount") !=
          mainDiv.getAttribute("data-thiswindowcount")
        ) {
          allWindows[i].style.display = "none";
          // Remove creating class from windows
          allWindows[i].classList.remove(creatingClass);
        }
      }
    };

    const hideShadow = () => {
      mainDiv.querySelector("iframe").style.display = "none";
      mainDiv.style.boxShadow = null;
      mainDiv.style.transition =
        "all 500ms ease-in-out, top 0s, left 0s, width 0s, height 0s";
    };

    const BodyScroll = () => {
      if (document.body.style.overflowX == "hidden") {
        document.body.style.overflowX = "unset";
        document.body.style.overflowY = "unset";
      } else {
        document.body.style.overflowX = "hidden";
        document.body.style.overflowY = "hidden";
      }
    };

    document.body.addEventListener("mouseup", function (e) {
      if (!!mainDiv) {
        document.removeEventListener("mousemove", mouseMove);
        // document.removeEventListener("mouseup",mouseUp);
        mainDiv.querySelector("iframe").style.display = "inline";
        mainDiv.style.boxShadow = defaults.WindowShadow;

        mainDiv.style.transition = null;
        document.onmouseup = null;
        document.onmousemove = null;

        let allWindows = document.querySelectorAll(`#${mainDivID}`);
        for (let i = 0; i < allWindows.length; i++) {
          if (
            allWindows[i].getAttribute("data-thiswindowcount") !=
            mainDiv.getAttribute("data-thiswindowcount")
          ) {
            allWindows[i].style.display = "unset";
          }
        }
      }
    });

    // Dimensions
    let mouseMove = null,
      rightResize = null,
      windowCount = 0,
      zIndex = 99,
      pos1 = null,
      pos2 = null,
      pos3 = null,
      pos4 = null,
      newTop = null,
      newLeft = null;

    // Classes & id's
    let body = document.querySelector("body"),
      // main window div
      mainDivID = "nativewindow",
      // childs
      mainBannerID = "nativewindowbanner",
      containerID = "nativewindowcontainer",
      contetnHolderID = "nativewindowcontent",
      //icons
      iconsGroupID = "nativewindowiconsgroup",

      normalizeClass = "normalize",
      iconizeClass = 'iconize',
      maximizeClass = "maximize",
      closeClass = "close",
      // animations
      creatingClass = "create",
      destroyClass = "destroy",
      fullSizeClass = "fullScreen",
      cornerClass = "incorner",
      // actions
      disableDrag = "disableDrag",
      resizeRightBorder = "resize-border-right",
      resizeBottomBorder = "resize-border-bottom";

    // Elements
    let defaults = {},
      icons = {},
      mainBannerCss = {},
      mainDivCss = {},
      mainDiv = null,
      backgroundFocus = null,
      contentDiv = null,
      container = null,
      topBanner = null,
      li = null,
      row = null,
      iconsGroup = null,
      img = null,
      iframe = null,
      old = {};

    //Create Windows Holder
    let windowsHolder = document.querySelector("#NativeWindowsHolder");

    if (!!!windowsHolder) {
      const holderDiv = createNode("div");
      holderDiv.id = "NativeWindowsHolder";
      append(document.querySelector("body"), holderDiv);

      windowsHolder = document.querySelector("#NativeWindowsHolder");
    }

    // our Plugin
    const nativeWindow = {
      create: function (options) {
        // validate feature test
        if (!supports)
          return logError("nativeWindow is not supported on this browser");

        // validate passed data
        if (!!options && typeof options !== "object")
          return logError("Option error, please check the documentation");

        // default params
        defaults = {
          Title: "Default Plugin Title", // Window Title
          TitleSize: 15, // Title font size
          TitleTextShadow: "rgb(74, 66, 66) 0px 0px 3px", // Title Text Shadow
          TitleTextColor: "rgb(255, 255, 255)", //Title Text color

          Link: null, // Link to show in iframe
          Html: null, // HTML to show in iframe

          Width: 600, // Width
          Height: 300, // Height
          Top: 50, // Top Position
          Left: 50, // Left Position

          BannerBackground:
            "-webkit-linear-gradient(top, rgb(67, 78, 95), rgb(37, 46, 78))", // Top banner backgroud

          WindowShadow: "hsla(0, 0%, 0%, 0.8) 0px 0px 25px 0px", //Window Shadow
          WindowBackground: "rgba(44, 53, 67, 0.73)", //Window bakground ( will be visible as window border )
          WindowRaduis: "3px", // window corners raduis

          ResizeEnable: true, // Enable Resizing
          DragEnable: true, // Enabe dragging
          ButtonFull: true, // Show Full screen button

          iconizeIcon: "https://raw.githubusercontent.com/aminejafur/native-window.js/master/icons/iconize.svg",
          normalizeIcon: "https://raw.githubusercontent.com/aminejafur/native-window.js/master/icons/normalize.svg",
          maximizeIcon: "https://raw.githubusercontent.com/aminejafur/native-window.js/master/icons/maximize.svg",
          closeIcon: "https://raw.githubusercontent.com/aminejafur/native-window.js/master/icons/close.svg",

          callbackBefore: () => {}, //Callback Before building window
          callbackAfter: () => {}, //Callback After building window
        };

        Object.assign(defaults, options || {});

        // width to px
        // defaults.Width = defaults.Width*(root.innerWidth/100);
        // defaults.Height = defaults.Height*(root.innerWidth/100);

        // check link
        if (!!!defaults.Link && !!!defaults.Html) {
          logError(`nativeWindow : Please provice an Html or Iframe link.`);
          return false;
        }

        // Props
        mainDivCss = {
          "z-index": zIndex,
          background: defaults.WindowBackground,
          "border-radius": defaults.WindowRaduis,
          width: `${defaults.Width}px`,
          height: `${defaults.Height}px`,
          top: `${defaults.Top}px`,
          left: `${defaults.Left}px`,
          "box-shadow": defaults.WindowShadow,
        };
        mainBannerCss = {
          background: defaults.BannerBackground,
          "text-shadow": defaults.TitleTextShadow,
          color: defaults.TitleTextColor,
          "font-size": `${defaults.TitleSize}px`,
        };
        icons = {
          normalize: defaults.normalizeIcon,
          iconize: defaults.iconizeIcon,
        };
        // Allow maximal screen
        if (defaults.ButtonFull)
          icons["maximize"] = defaults.maximizeIcon;

        icons["close"] = defaults.closeIcon;

        // build UI
        this.buildUI();

        // Hide normalize icon
        mainDiv.querySelector(`.${normalizeClass}`).classList.add("hide");

        // Create old sizes object
        old[windowCount] = {
          Width: `${defaults.Width}px`,
          Height: `${defaults.Height}px`,
          Top: `${defaults.Top}px`,
          Left: `${defaults.Left}px`,
        };

        // is resize enabled?
        if (defaults.ResizeEnable) {
          this.resizeRight(windowCount);
          this.resizeBottom(windowCount);
        }

        // is drag enbaled?
        if (defaults.DragEnable) {
          this.drag(windowCount);
        } else {
          mainDiv.querySelector(`#${mainBannerID}`).classList.add(disableDrag);
        }
        // focus current window
        this.focus(mainDiv);

        //Listen to icons
        this.iconActions(windowCount);

        //Listen to dblclick on banner to trigger full size
        if (defaults.ButtonFull) {
          mainDiv.querySelector(`#${mainBannerID}`).addEventListener(
            "dblclick",
            function () {
              this.maximize(mainDiv);
            }.bind(this)
          );
        }
      },
      buildUI: function () {
        // call back before
        defaults.callbackBefore();
        /*
         *
         *   Create the UI
         *
         * <div id="nativewindow" class="create" data-thiswindowcount="{windowCount}" style="{windowStyle}">
         *    <div id="nativewindowcontainer">
         *       <ul>
         *          <li id="nativewindowbanner" style="{bannerStyle}">
         *             <ul>
         *                <li id="text">
         *                   <p>Title</p>
         *                </li>
         *                <li id="nativewindowiconsgroup">
         *                   <ul>
         *                      <li class="normalize"><img title="normalize" src="{icon_img}"></li>
         *                      <li class="iconize"><img title="iconize" src="{icon_img}"></li>
         *                      <li class="maximize"><img title="maximize" src="{icon_img}"></li>
         *                      <li class="close"><img title="close" src="{icon_img}"></li>
         *                   </ul>
         *                </li>
         *             </ul>
         *          </li>
         *          <li id="nativewindowcontent"><iframe src="{iframeLink}" srcdoc={iframeHTML} allowtransparency="true" style="display: inline;"></iframe></li>
         *       </ul>
         *    </div>
         *    <div class="resize-border-right"></div>
         *    <div class="resize-border-bottom"></div>
         * </div>
         *
         */
        windowCount++;
        // mainDiv
        mainDiv = createNode("div");
        mainDiv.id = mainDivID;
        // creating animation class
        mainDiv.classList.add(creatingClass);
        mainDiv.setAttribute("data-thiswindowcount", windowCount);

        for (let prop in mainDivCss) {
          mainDiv.style[prop] = mainDivCss[prop];
        }

        // contentDiv
        contentDiv = createNode("div");
        contentDiv.id = containerID;
        // append content to main div
        append(mainDiv, contentDiv);

        // Banner
        topBanner = createNode("ul");

        li = createNode("li");
        li.id = mainBannerID;

        for (let prop in mainBannerCss) {
          li.style[prop] = mainBannerCss[prop];
        }

        // append li to topBanner
        append(topBanner, li);

        // row
        row = createNode("ul");

        // append row to li
        append(li, row);

        li = createNode("li");
        li.id = "text";
        li.innerHTML = `<p>${defaults.Title}</p>`;
        // append li to row
        append(row, li);

        // icons li
        li = createNode("li");
        li.id = iconsGroupID;
        // append iconsgroup to row
        append(row, li);

        iconsGroup = createNode("ul");
        // append iconsgroup to li
        append(li, iconsGroup);

        for (let prop in icons) {
          // icons
          li = createNode("li");
          li.classList.add(prop);
          // li Image
          img = createNode("img");
          img.title = prop;
          img.src = icons[prop];
          // append img to li
          append(li, img);
          // append li to iconsGroup
          append(iconsGroup, li);
        }

        // container
        li = createNode("li");
        li.id = contetnHolderID;
        // create iframe
        iframe = createNode("iframe");
        // append html or iframe link
        if (!!!defaults.Html) {
          iframe.setAttribute("src", defaults.Link);
        } else {
          iframe.srcdoc = defaults.Html;
        }
        // style iframe
        iframe.setAttribute("allowtransparency", "true");
        iframe.style.display = "inline";
        // append iframe to li
        append(li, iframe);

        // append li to topBanner
        append(topBanner, li);

        // append topBanner to contentDiv
        append(contentDiv, topBanner);

        // append topBanner to contentDiv
        append(contentDiv, topBanner);

        // append maind div to holder
        append(windowsHolder, mainDiv);

        // call back after
        defaults.callbackAfter();
      },
      resizeRight: function (thiswindowcount) {
        // activate right resize
        let bottomBorderDiv = createNode("div");
        bottomBorderDiv.className = resizeRightBorder;

        append(mainDiv, bottomBorderDiv);

        bottomBorderDiv.addEventListener(
          "mousedown",
          (rightResize = function rightResize(e) {
            mainDiv = document.querySelector(
              `[data-thiswindowcount="${thiswindowcount}"`
            );

            hideShadow();

            root.addEventListener("selectstart", disableSelect);

            let myoffset =
              e.clientX -
              (mainDiv.offsetLeft +
                parseInt(
                  root.getComputedStyle(mainDiv).getPropertyValue("width")
                ));

            document.addEventListener(
              "mousemove",
              (mouseMove = function mouseMove(e) {
                fixConflict();

                if (mainDiv.classList.contains(cornerClass)) return false;

                if (parseInt(mainDiv.style.width) < parseInt(defaults.Width)) {
                  document.removeEventListener("mousemove", mouseMove);
                  mainDiv.style.width = parseInt(defaults.Width) + 1 + "px";
                } else if (e.clientX < root.innerWidth - 200) {
                  let newWidth = `${
                    e.clientX - myoffset - mainDiv.offsetLeft
                  }px`;
                  mainDiv.style.width = newWidth;
                  old[thiswindowcount].Width = newWidth;
                }
              })
            );
          })
        );
      },
      resizeBottom: function (thiswindowcount) {
        // activate bottom resize
        let bottomBorderDiv = createNode("div");
        bottomBorderDiv.className = resizeBottomBorder;

        append(mainDiv, bottomBorderDiv);

        bottomBorderDiv.addEventListener(
          "mousedown",
          (rightResize = function rightResize(e) {
            mainDiv = document.querySelector(
              `[data-thiswindowcount="${thiswindowcount}"`
            );

            hideShadow();

            root.addEventListener("selectstart", disableSelect);

            let myoffset =
              e.clientY -
              (mainDiv.offsetTop +
                parseInt(
                  root.getComputedStyle(mainDiv).getPropertyValue("height")
                ));

            document.addEventListener(
              "mousemove",
              (mouseMove = function mouseMove(e) {
                fixConflict();

                if (mainDiv.classList.contains(cornerClass)) return false;

                let newHeight = `${e.clientY - myoffset - mainDiv.offsetTop}px`;
                mainDiv.style.height = newHeight;
                old[thiswindowcount].Height = newHeight;
              })
            );
          })
        );
      },
      drag: function (thiswindowcount) {
        // activate drag
        mainDiv = document.querySelector(
          `[data-thiswindowcount="${thiswindowcount}"`
        );

        (old[thiswindowcount].Top = mainDiv.style.top),
          (old[thiswindowcount].Left = mainDiv.style.left);

        mainDiv.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
          e.preventDefault();

          if (
            e.target.id == mainDivID ||
            e.target.classList.contains(resizeBottomBorder) ||
            e.target.classList.contains(resizeRightBorder)
          )
            return false;

          mainDiv = e.target.closest(`#${mainDivID}`);
          if (
            mainDiv
              .querySelector(`#${mainBannerID}`)
              .classList.contains(disableDrag)
          )
            return false;

          // initial mouse position
          pos3 = e.clientX;
          pos4 = e.clientY;


          // call a function whenever the cursor moves:
          document.onmousemove = function (e) {
            e.preventDefault();

            hideShadow();

            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            // get new Positions
            newTop = mainDiv.offsetTop - pos2;
            newLeft = mainDiv.offsetLeft - pos1;

            // prevetn from going out body
            if (newTop < 0 || newLeft < 0) return false;

            // set the new position:
            mainDiv.style.top = newTop + "px";
            mainDiv.style.left = newLeft + "px";
            (old[thiswindowcount].Top = mainDiv.style.top),
              (old[thiswindowcount].Left = mainDiv.style.left);
          };
        }
      },
      iconActions: function (thiswindowcount) {
        // icons actions
        let icons = document
          .querySelector(`[data-thiswindowcount="${windowCount}"`)
          .querySelectorAll(`#${iconsGroupID} li`);

        for (let i = 0; i < icons.length; i++) {
          icons[i].addEventListener("click", function (e) {
            let action = e.target.title;
            mainDiv = e.target.closest(`#${mainDivID}`);

            switch (action) {
              case "maximize":
                nativeWindow.maximize(mainDiv);
                break;
              case "iconize":
                nativeWindow.iconize(mainDiv);
                break;
              case "normalize":
                nativeWindow.normalize(mainDiv);
                break;
              case "close":
                nativeWindow.destroy(thiswindowcount);
                break;
              default:
                console.log(action);
            }
          });
        }
      },
      focus: function (mainDiv) {
        //focus current window
        mainDiv.addEventListener("mousedown", function (e) {
          if (e.target.title != "close") mainDiv.style.zIndex = zIndex++;
        });
      },
      maximize: function (mainDiv) {
        // maximize current window
        if (!!mainDiv.querySelector(`.${maximizeClass}`))
          mainDiv.querySelector(`.${maximizeClass}`).classList.add("hide");
        mainDiv.querySelector(`.${normalizeClass}`).classList.remove("hide");

        mainDiv.classList.add(fullSizeClass);

        BodyScroll();
        let newLeft =
          "-" +
          (root
            .getComputedStyle(document.body)
            .getPropertyValue("margin-left") || "0px");
        let newTop =
          document.body
            .getBoundingClientRect()
            .top.toString()
            .replace("-", "") + "px";
        let newWidth = root.innerWidth + "px";
        let newHeight = root.innerHeight + "px";

        mainDiv.style.left = null;

        mainDiv.style.left = newLeft;

        mainDiv.style.top = newTop;

        mainDiv.style.width = newWidth;

        mainDiv.style.height = newHeight;
      },
      iconize: function (mainDiv) {
        // iconize current window
        let Wincount = mainDiv.getAttribute("data-thiswindowcount");

        if (mainDiv.classList.contains(fullSizeClass)) {
          mainDiv.classList.add("wasFull");
          BodyScroll();
        }

        if (!mainDiv.classList.contains(cornerClass)) {
          mainDiv.classList.remove(fullSizeClass);

          mainDiv.style.left = null;
          mainDiv.style.top = null;
          mainDiv.style.top = parseInt(Wincount) * 60 + "px";
          mainDiv.style.height = "0px";

          let leftByWidth = parseInt(mainDiv.style.width) - 40;
          mainDiv.style.left = `-${leftByWidth}px`;

          mainDiv.classList.add(cornerClass);

          if (!!mainDiv.querySelector(`.${maximizeClass}`))
            mainDiv.querySelector(`.${maximizeClass}`).style.display = "none";
          mainDiv.querySelector(`.${normalizeClass}`).style.display = "none";
          mainDiv.querySelector(`.${closeClass}`).style.display = "none";
        } else {
          if (!mainDiv.classList.contains("wasFull")) {
            mainDiv.style.left = null;
            mainDiv.style.top = old[Wincount].Top;
            mainDiv.style.height = old[Wincount].Height;
            mainDiv.style.left = old[Wincount].Left;
          } else {
            nativeWindow.maximize(mainDiv);
            mainDiv.classList.remove("wasFull");
          }

          mainDiv.classList.remove(cornerClass);

          if (!!mainDiv.querySelector(`.${maximizeClass}`))
            mainDiv.querySelector(`.${maximizeClass}`).style.display = "unset";
          mainDiv.querySelector(`.${normalizeClass}`).style.display = "unset";
          mainDiv.querySelector(`.${closeClass}`).style.display = "unset";
        }
      },
      normalize: function (mainDiv) {
        // normalize current window
        let Wincount = mainDiv.getAttribute("data-thiswindowcount");

        if (!!mainDiv.querySelector(`.${maximizeClass}`))
          mainDiv.querySelector(`.${maximizeClass}`).classList.remove("hide");
        if (!!mainDiv.querySelector(`.${maximizeClass}`))
          mainDiv.querySelector(`.${maximizeClass}`).classList.remove("hide");
        mainDiv.querySelector(`.${normalizeClass}`).classList.add("hide");

        BodyScroll();

        mainDiv.style.top = old[Wincount].Top;
        mainDiv.style.left = old[Wincount].Left;
        mainDiv.style.width = old[Wincount].Width || defaults.Width + "px";
        mainDiv.style.height = old[Wincount].Height || defaults.Height + "px";
        mainDiv.classList.remove(fullSizeClass);
      },
      toggleDrag: function (winNum) {
        //Toggling between drag
        let disable = document
          .querySelector(`[data-thiswindowcount="${winNum}"`)
          .querySelector(`#${mainBannerID}`);

        if (disable.classList.contains(disableDrag)) {
          disable.classList.remove(disableDrag);
          this.drag(winNum);
        } else {
          disable.classList.add(disableDrag);
        }
      },
      toggleRightResize: function (winNum) {
        //Toggling between resize
        let rightBorder = document
          .querySelector(`[data-thiswindowcount="${winNum}"`)
          .querySelector(`.${resizeRightBorder}`);
        if (rightBorder.style.pointerEvents == "none") {
          rightBorder.style.pointerEvents = "unset";
        } else {
          rightBorder.style.pointerEvents = "none";
        }
      },
      toggleBottomResize: function (winNum) {
        //Toggling between resize
        let bottomBorder = document
          .querySelector(`[data-thiswindowcount="${winNum}"`)
          .querySelector(`.${resizeBottomBorder}`);
        if (bottomBorder.style.pointerEvents == "none") {
          bottomBorder.style.pointerEvents = "unset";
        } else {
          bottomBorder.style.pointerEvents = "none";
        }
      },
      destroy: function (winNum) {
        // destroy window
        let wind = document.querySelector(`[data-thiswindowcount="${winNum}"`);

        wind.classList.add(destroyClass);

        if(!!document.querySelector('#background_focus')) document.querySelector('#background_focus').remove()

        setTimeout(function () {
          wind.remove();
          delete old[winNum];
        }, 1000);
      },
    };

    // Creating alias for create method
    root.createNewWindow = (options) => nativeWindow.create(options);

    // return plugin
    return nativeWindow;
  }
); // End
