var chrome, elem, code, style;


var openDyslexic = {
    Init: function () {
        checkStatus(); // Check if the check box is set.
    }
};
openDyslexic.Init();

function checkStatus() {
    chrome.storage.sync.get({
        booleans: true
    }, function (items) {
        if (items.booleans === true) {
            turnOnOpenDyslexic();
            setLike(1);
        } else {
            turnOffOpenDyslexic();
            setLike(0);
        }
    });
}


function setLike(bool) {
    if (document.getElementById("like") != null) { // available
        document.getElementById("like").checked = bool;
    }
}



function turnOffOpenDyslexic() {
    if (document.getElementById("opendyslexic") != null) { // available
        elem = document.getElementById("opendyslexic");
        elem.parentNode.removeChild(elem);
        (document.head || document.documentElement)
        .removeChild(elem);
        reloadPage();
    }
}

function turnOnOpenDyslexic() {
    style = document.createElement('link');
    style.rel = 'stylesheet';
    style.type = 'text/css';
    style.setAttribute("id", "opendyslexic");
    style.href = chrome.extension.getURL('assets/dist/css/opendyslexic/accesibility.min.css');
    (document.head || document.documentElement).appendChild(style);
}

function reloadPage() {
    chrome.tabs.getSelected(null, function (tab) {
        code = 'window.location.reload();';
        chrome.tabs.executeScript(tab.id, {
            code: code
        });
    });
}
