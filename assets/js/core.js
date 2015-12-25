var app = angular.module("opendyslexic", []);
app.controller("core", function ($scope) {


    var sync, elem, code, style;

    $scope.init = function () {

        chrome.storage.sync.get({
            booleans: true
        }, function (items) {
            if (items.booleans === true) {
                document.getElementById('like').checked = 1;
                document.getElementById('message').innerHTML = "On";
            } else {
                document.getElementById('like').checked = 0;
                document.getElementById('message').innerHTML = "Off";
            }
        });

    };






    /**
     * Adds Saves the Optoins 
     */
    $scope.openDyslexic = function () { // Saves options to chrome.storage

        checkBox = document.getElementById('like').checked;
        chrome.storage.sync.set({
            booleans: checkBox
        }, function () { // Update status to let user know options were saved.
            if (checkBox === true) {
                document.getElementById('message').innerHTML = "On";
            } else {
                document.getElementById('message').innerHTML = "Off";
            }
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






});
