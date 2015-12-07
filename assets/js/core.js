var chrome, elem, code, style;

var helperBird = {
    Init: function () {
        checkStatus(); // Check if the check box is set.
    }
};
helperBird.Init();

function checkStatus() {
    chrome.storage.sync.get({
        booleans: true,
        fontSizes: "12"
    }, function (items) {
        if (items.booleans === true) {
            turnOnHelperBird();
            turnOnChangeFont(items.fontSizes);
            setLike(1);
            setNumberVaule(items.fontSizes);
        } else {
            turnOffHelperBird();
            removeChangeFont();
            setLike(0);
            setNumberVaule(items.fontSizes);
        }
    });
}


function setLike(bool) {
    if (document.getElementById("like") != null) { // available
        document.getElementById("like").checked = bool;
    }
}

function setNumberVaule(fontSizes) {
    if (document.getElementById("number") != null) { // available
        document.getElementById("number").value = fontSizes;
    }
}

function turnOffHelperBird() {
    if (document.getElementById("helperBird") != null) { // available
        elem = document.getElementById("helperBird");
        elem.parentNode.removeChild(elem);
        (document.head || document.documentElement)
        .removeChild(elem);
        reloadPage();
    }
}

function turnOnHelperBird() {
    style = document.createElement('link');
    style.rel = 'stylesheet';
    style.type = 'text/css';
    style.setAttribute("id", "helperBird");
    style.href = chrome.extension.getURL('assets/css/myStyles.css');
    (document.head || document.documentElement).appendChild(style);
}



function removeChangeFont() {
    if (document.getElementById("helperColor") != null) { // available
        elem = document.getElementById("helperColor");
        elem.parentNode.removeChild(elem);
        (document.head || document.documentElement).removeChild(elem);
        reloadPage();
    }
}

function turnOnChangeFont(fontSizes) {
    style = document.createElement('style');
    style.setAttribute("id", "helperColor");
    style.innerHTML = "p,span,li,a,ul{font-size:" + fontSizes + "px!important;}";

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
