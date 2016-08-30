var chrome, elem, code, style, docsBeta;


var openDyslexic = {
    Init: function() {
        checkStatus(); // Check if the check box is set.
    }
};
openDyslexic.Init();

function checkStatus() {
    chrome.storage.sync.get({
        enableOpendyslexic: true,
        docsBeta: true
    }, function(items) {
        docsBeta = items.docsBeta;
        if (items.enableOpendyslexic) {
            turnOnOpenDyslexic();
            setLike(true);
            setMessage("On");
        } else {
            turnOffOpenDyslexic();
            setLike(false);
            setMessage("Off");
        }

        if (items.docsBeta) {
            turnOnOpenDyslexic();
            setLike(true);
            setMessage("On");
        } else {
            turnOffOpenDyslexic();
            setLike(false);
            setMessage("Off");
        }
    });
}


function setLike(bool) {

    if (document.getElementById("likeOpenDyslexic") != null) { // available
        document.getElementById("likeOpenDyslexic").checked = bool;
    }
    if (document.getElementById("likeDocsBeta") != null) {
        document.getElementById("likeDocsBeta").checked = bool;
    }
}


function setMessage(text) {
    if (document.getElementById("messageOpenDyslexic") != null) { // available
        document.getElementById('messageOpenDyslexic').innerHTML = text;
    }
    if (document.getElementById("likeDocsBeta") != null) {
        document.getElementById('messageBeta').innerHTML = text;
    }
}



function turnOffOpenDyslexic() {
    if (document.getElementById("opendyslexic") != null) { // available
        elem = document.getElementById("opendyslexic");
        elem.parentNode.removeChild(elem);
        (document.head || document.documentElement).removeChild(elem);
        reloadPage();
    }
}

function turnOnOpenDyslexic() {
    style = document.createElement('link');
    style.rel = 'stylesheet';
    style.type = 'text/css';
    style.setAttribute("id", "opendyslexic");
    style.href = chrome.extension.getURL('assets/dist/css/opendyslexic/accesibility.min.css');

    docsBeta === true ? (document.head || document.documentElement).appendChild(style) : null;



}

function regexUrlextensioncheck(n) {
    var s = document.URL,
        e = new RegExp(n);
    return e.test(s);
}

function reloadPage() {
    chrome.tabs.getSelected(null, function(tab) {
        code = 'window.location.reload();';
        chrome.tabs.executeScript(tab.id, {
            code: code
        });
    });
}
