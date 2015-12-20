var app = angular.module("opendyslexic", []);
app.controller("core", function ($scope) {


    var sync, elem, code, style;

    $scope.init = function () {
        console.log('sssssss');
        // Use default value color = 'red' and likesColor = true.
        chrome.storage.sync.get({
            booleans: true
        }, function (items) {
            console.log("core" + items.booleans);
            if (items.booleans === true) {
                document.getElementById('like').checked = 1;
                turnOnHelperBird();
            } else {
                turnOffHelperBird();
                document.getElementById('like').checked = 0;
            }
        });

    };

    /**
     * Adds Saves the Optoins 
     */
    $scope.openDyslexic = function () { // Saves options to chrome.storage
        console.log('hi');
        checkBox = document.getElementById('like').checked;
        chrome.storage.sync.set({
            booleans: checkBox
        }, function () { // Update status to let user know options were saved.
            reload();
        });
    };


    function reload() {
        chrome.tabs.getSelected(null, function (tab) {
            code = 'window.location.reload();';
            chrome.tabs.executeScript(tab.id, {
                code: code
            });
        });
    }




    function turnOffHelperBird() {

        if (document.getElementById("opendyslexic") != null) { // available
            elem = document.getElementById("opendyslexic");
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
        style.setAttribute("id", "opendyslexic");
        style.href = chrome.extension.getURL('assets/dist/css/opendyslexic/accesibility.min.css');
        (document.head || document.documentElement).appendChild(style);
    }





});
