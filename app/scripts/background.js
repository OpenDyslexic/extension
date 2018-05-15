'use strict';

var chrome, elem, code, style;

var openDyslexic = {
  Init: function Init() {
    checkStatus(); // Check if the check box is set.
  }
};

openDyslexic.Init();

function checkStatus() {
  chrome.storage.sync.get({
    enabled: false
  }, function (items) {
    if (items.enabled === true) {
      enableOpenDyslexic();
    } else {
      disableOpenDyslexic();
    }
  });
}

function disableOpenDyslexic() {
  if (document.getElementById('opendyslexic') != null) {
    // available
    elem = document.getElementById('opendyslexic');
    elem.parentNode.removeChild(elem);(document.head || document.documentElement).removeChild(elem);
    reloadPage();
  }
}

function enableOpenDyslexic() {
  style = document.createElement('link');
  style.rel = 'stylesheet';
  style.type = 'text/css';
  style.setAttribute('id', 'opendyslexic');
  style.href = chrome.extension.getURL('styles/accesibility.css');(document.head || document.documentElement).appendChild(style);
}

function reloadPage() {
  chrome.tabs.getSelected(null, function (tab) {
    code = 'window.location.reload();';
    chrome.tabs.executeScript(tab.id, {
      code: code
    });
  });
}