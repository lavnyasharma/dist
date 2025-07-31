// ********************************
// ##- Create Chat Widget Start -##
// ********************************

// const newyearSound = new Audio('https://coroverbackendstorage.blob.core.windows.net/iglcontainer/ksrtc_voice.mpeg');
var notWelcomeVoice = true;
var isMobile = window.orientation > -1;

// Widget Container
const chatWidget = document.createElement("div");
chatWidget.id = "corover-cb-widget";
chatWidget.style.cssText =
  "width: 120px; height: 120px; position: fixed; bottom: 60px; right: 20px; background-image: url(https://cdn.jsdelivr.net/gh/corover/assets@latest/digisaathi-assets/Vani_web.png); background-repeat: no-repeat; background-size: contain; background-position: 0 0; transition: transform 0.2s ease; cursor: pointer; transform-origin: 50% 50%; z-index: 9999;";

// Close Button
let closeBtn = document.createElement("div");
closeBtn.id = "corover-close-btn";
closeBtn.style.cssText =
  "background: url(https://cdn.jsdelivr.net/gh/corover/assets@latest/digisaathi-assets/closebtn.svg); position: absolute; top: 0px; right: 0px; width: 18px; height: 18px; background-size: contain; background-position: 0 0; background-repeat: no-repeat;";

// Minimize Button
let minBtn = document.createElement("div");
minBtn.id = "corover-min-btn";
minBtn.style.cssText =
  "background: url(https://cdn.jsdelivr.net/gh/corover/assets@latest/digisaathi-assets/minbtn.svg); position: absolute; top: 0px; left: 9px; width: 18px; height: 18px; background-size: contain; background-position: 0 0; background-repeat: no-repeat;";

// Maximize Button
let maxBtn = document.createElement("div");
maxBtn.id = "corover-max-btn";
maxBtn.style.cssText =
  "background: url(https://cdn.jsdelivr.net/gh/corover/assets@latest/digisaathi-assets/plusbtn.svg); position: absolute; top: 0px; left: 5px; width: 20px; height: 30px; background-size: contain; background-position: 0 0; background-repeat: no-repeat; display: none;";

// Ad Iframe
let adFrame = document.createElement("div");
adFrame.id = "ATD_Ad_Ksrtc_320x50";
adFrame.style.cssText =
  "width:320px;position: absolute; padding-top: 2.5px; top: 122px;  height: 50px; right:0px; z-index: -1;margin:auto; ";

//DEALS Ribbon
let dealIcon = document.createElement("img");
dealIcon.id = "corover-deal-icon";
dealIcon.style.cssText = isMobile
  ? "position: absolute; top: 41px; right: 157px; width: 156px; cursor: pointer; padding-right: 4px;z-index: 9999999;"
  : (dealIcon.style.cssText =
      " position: absolute; top: 93px; right: 157px; width: 156px; cursor: pointer; padding-right: 4px;z-index: 9999999;" +
      "");
// ******************************
// ##- Create Chat Widget End -##
// ******************************

// ********************************
// ##- Create ChatBox Start -##
// ********************************

// ChatBox Container
const chatbox = document.createElement("div");
chatbox.id = "corover-chatbox";
chatbox.style.cssText =
  "font-family: Arial, Helvetica, sans-serif; color: white; z-index: 999999; display:none; width: 340px; height: 540px; position: fixed; bottom: 0; right: 15px; background: white; border: 1px solid #272a2b; border-bottom: none; border-radius: 10px 10px 0 0; box-shadow: 0 0 10px rgba(0, 0, 0, 0.3); z-index: 9999;";

// Title Bar
let titleBar = document.createElement("div");
titleBar.id = "corover-title-bar";
titleBar.style.cssText =
  "background-color: #272a2b; border-radius: 10px 10px 0 0; color: white;";

// ChatBot Frame
let frameBody = document.createElement("div");
frameBody.id = "corover-frame-body";
frameBody.style.cssText =
  "width: 100%; height: 100%; background: #000; border-radius: 10px 10px 0 0";

let chatFrame = document.createElement("iframe");
chatFrame.id = "corover-chat-frame";
chatFrame.src = "https://ai.corover.mobi/ksrtc";
chatFrame.setAttribute("frameborder", "none");
chatFrame.setAttribute("width", "100%");
chatFrame.setAttribute("height", "100%");
chatFrame.setAttribute(
  "allow",
  "geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor"
);
chatFrame.style.borderRadius = "10px 10px 0 0";

frameBody.appendChild(chatFrame);

// Close Button
let closeCbBtn = document.createElement("div");
closeCbBtn.id = "corover-close-cb-btn";
closeCbBtn.style.cssText =
  "width: 50px; height: 20px; background-image: url(https://cdn.jsdelivr.net/gh/corover/assets@latest/digisaathi-assets/close-btn.svg); background-repeat: no-repeat; background-size: contain; background-position: 0 0; position: absolute; top: -20px; left: 50%; transform: translateX(-50%); cursor: pointer;";
titleBar.appendChild(closeCbBtn);

// ********************************
// ##- Create ChatBox End -##
// ********************************

// *********************************
// ##- Add Event Listeners Start -##
// *********************************
chatWidget.addEventListener("click", openBot);

function openBot(e) {
  // if(notWelcomeVoice){
  //     newyearSound.play();
  //     notWelcomeVoice = false;
  // }
  this.style.display = "none";
  chatbox.style.display = "block";
  e.stopPropagation();
}

dealIcon.addEventListener(
  "click",
  function() {
    window.open("http://amzn.to/2XwmMUk");
  },
  false
);

chatWidget.addEventListener(
  "mouseover",
  function() {
    this.style.transform = "scale(1.1)";
  },
  false
);

chatWidget.addEventListener(
  "mouseout",
  function() {
    this.style.transform = "scale(1)";
  },
  false
);

closeBtn.addEventListener(
  "click",
  function(e) {
    e.stopPropagation();
    chatWidget.style.display = "none";
    chatFrame.src = "";
  },
  false
);

minBtn.addEventListener(
  "click",
  function(e) {
    e.stopPropagation();
    chatWidget.style =
      "width: 55px; height: 123px;position: fixed;bottom: 15px;right: 20px;background-image: url(https://cdn.jsdelivr.net/gh/corover/assets@latest/digisaathi-assets/Vani_web.png);background-repeat: no-repeat;background-size: contain;background-position: 0px 0px;transition: transform 0.2s ease 0s;cursor: pointertransform-origin: 50% 50%;z-index: 9999;";
    adFrame.style.cssText =
      "width:320px;position: absolute; padding-top: 2.5px; top: 70px;  height: 50px; right:0px; z-index: -1;margin:auto; ";

    closeBtn.style.display = "none";
    maxBtn.style.display = "block";
    this.style.display = "none";

    dealIcon.style =
      "position: absolute; top: 41px; right: 157px; width: 156px; cursor: pointer; padding-right: 4px;z-index: 9999999;";
  },
  false
);

maxBtn.addEventListener(
  "click",
  function(e) {
    e.stopPropagation();
    chatWidget.style =
      "width: 120px; height: 123px;position: fixed;bottom: 62px;right: 20px;background-image: url(https://cdn.jsdelivr.net/gh/corover/assets@latest/digisaathi-assets/Vani_web.png);background-repeat: no-repeat;background-size: contain;background-position: 0px 0px;transition: transform 0.2s ease 0s;cursor: pointertransform-origin: 50% 50%;z-index: 9999;";
    adFrame.style.cssText =
      "width:320px;position: absolute; padding-top: 2.5px; top: 122px;  height: 50px; right:0px; z-index: -1;margin:auto;";
    closeBtn.style.display = "block";
    minBtn.style.display = "block";
    this.style.display = "none";

    dealIcon.style =
      "position: absolute; top: 93px; right: 157px; width: 156px; cursor: pointer; padding-right: 4px;z-index: 9999999;";
  },
  false
);

closeCbBtn.addEventListener(
  "click",
  function() {
    chatbox.style.display = "none";
    chatWidget.style.display = "block";
    // newyearSound.pause();
    // newyearSound.currentTime = 0;
  },
  false
);

// *******************************
// ##- Add Event Listeners End -##
// *******************************

// ***************************
// ##- Append to DOM Start -##
// ***************************

// Appending elements
let appendChatWidget = () => {
  chatWidget.appendChild(closeBtn);
  chatWidget.appendChild(minBtn);
  chatWidget.appendChild(maxBtn);
  chatWidget.appendChild(adFrame);
  //    chatWidget.appendChild(dealIcon);
  document.body.appendChild(chatWidget);
};

dealIcon.src =
  "https://cdn.jsdelivr.net/gh/corover/assets@latest/digisaathi-assets/DEALS....png";

appendChatWidget();
chatbox.appendChild(titleBar);
chatbox.appendChild(frameBody);
document.body.appendChild(chatbox);

// *************************
// ##- Append to DOM End -##
// *************************

// ***********************
// ##- Add Style Start -##
// ***********************

let style = document.createElement("style");
style.innerHTML = `@media only screen and (max-width:640px) {
    #corover-chatbox {
        width: 100% !important;
        height: calc(100% - 20px) !important;
        top: 20px !important;
        right: 0px !important;
        left: 0px !important;
        bottom: 0px !important;
    }

    #corover-max-btn {
        left: -10px !important;
    }
}
@media only screen and (max-width:1000px) {
    #corover-cb-widget {
        background-image: url(https://cdn.jsdelivr.net/gh/corover/assets@latest/digisaathi-assets/Vani_mob.png) !important;
    }
    
    #corover-min-btn {
        left: -9px !important;
    }
    
    #corover-close-btn {
        right: 9px !important;
    }
}
`;

// Media Query plus button handling
function checkBtn(x) {
  if (x.matches) {
    // If media query matches
    chatWidget.style =
      "width: 55px; height: 123px;position: fixed;bottom: 15px;right: 20px;background-image: url(https://cdn.jsdelivr.net/gh/corover/assets@latest/digisaathi-assets/Vani_web.png);background-repeat: no-repeat;background-size: contain;background-position: 0px 0px;transition: transform 0.2s ease 0s;cursor: pointertransform-origin: 50% 50%;z-index: 9999;";
    adFrame.style.cssText =
      "width:320px;position: absolute; padding-top: 2.5px; top: 70px;  height: 50px; right:0px; z-index: -1;margin:auto;";
    closeBtn.style.display = "none";
    maxBtn.style.display = "block";
    minBtn.style.display = "none";
  } else {
    chatWidget.style =
      "width: 120px; height: 123px;position: fixed;bottom: 62px;right: 20px;background-image: url(https://cdn.jsdelivr.net/gh/corover/assets@latest/digisaathi-assets/Vani_web.png);background-repeat: no-repeat;background-size: contain;background-position: 0px 0px;transition: transform 0.2s ease 0s;cursor: pointertransform-origin: 50% 50%;z-index: 9999;";
    adFrame.style.cssText =
      "width:320px;position: absolute; padding-top: 2.5px; top: 122px;  height: 50px; right:0px; z-index: -1;margin:auto;";
    maxBtn.style.cssText =
      "background: url(https://cdn.jsdelivr.net/gh/corover/assets@latest/digisaathi-assets/plusbtn.svg); position: absolute; top: 0px; left: -9px; width: 20px; height: 30px; background-size: contain; background-position: 0 0; background-repeat: no-repeat; display: none;";
    closeBtn.style.display = "block";
    minBtn.style.display = "block";
    maxBtn.style.display = "none";
  }
}

var x = window.matchMedia("(max-width: 640px)");
checkBtn(x); // Call listener function at run time
x.addListener(checkBtn); // Attach listener function on state changes

document.head.appendChild(style);

// var script = document.createElement("script");
// script.type = "text/javascript";
// script.src =
//   "https://cdn.jsdelivr.net/gh/unib0ts/unibots@latest/ksrtc/scriptAd.js";

// document.getElementsByTagName("head")[0].appendChild(script);

var s = document.createElement("script");
s.src = "https://go.automatad.com/geo/5nSGY2/afihbs.js";
s.type = "text/javascript";
document.getElementsByTagName("head")[0].appendChild(s);

// *********************
// ##- Add Style End -##
// *********************
