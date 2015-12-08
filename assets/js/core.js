var app = angular.module("opendyslexic", []);
app.controller("core", function ($scope) {


var sync,elem, code, style;

    $scope.init = function () {
        console.log('sssssss');
        // Use default value color = 'red' and likesColor = true.
        chrome.storage.sync.get({
            booleans: true
        }, function (items) {
            document.getElementById('like').checked = items.booleans;
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









});