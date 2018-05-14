var checkStatus, openDyslexic, reloadPage, turnOffOpenDyslexic, turnOnOpenDyslexic;

openDyslexic = {
  Init: function () {
    checkStatus();
  }
};

checkStatus = function () {
  chrome.storage.sync.get({
    "enabled": "enabled"
  }, function (items) {
    console.log(items.enabled);
    if (items.enabled) {
      turnOnOpenDyslexic();
    } else {
      turnOffOpenDyslexic();
    }
  });
};

turnOffOpenDyslexic = function () {
  var elem;
  if (document.getElementById('opendyslexic') !== null) {
    elem = document.getElementById('opendyslexic');
    elem.parentNode.removeChild(elem);
    (document.head || document.documentElement).removeChild(elem);
  }
};

turnOnOpenDyslexic = function () {
  var style;
  style = document.createElement('link');
  style.rel = 'stylesheet';
  style.type = 'text/css';
  style.setAttribute('id', 'opendyslexic');
  style.href = chrome.extension.getURL('assets/dist/css/app/accesibility.min.css');
  (document.head || document.documentElement).appendChild(style);
};

reloadPage = function () {
  chrome.tabs.getSelected(null, function (tab) {
    var code;
    code = 'window.location.reload();';
    chrome.tabs.executeScript(tab.id, {
      code: code
    });
  });
};

openDyslexic.Init();
