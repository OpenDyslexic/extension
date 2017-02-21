var app = angular.module("opendyslexic", []);
app.controller("core", function($scope) {


    var sync, elem, code, style;

    $scope.init = function() {

        chrome.storage.sync.get({
            booleans: false
        }, function(items) {
            if (items.booleans) {
                document.getElementById('likeOpenDyslexic').checked = 1;
                document.getElementById('messageOpenDyslexic').innerHTML = "On";
            } else {
                document.getElementById('likeOpenDyslexic').checked = 0;
                document.getElementById('messageOpenDyslexic').innerHTML = "Off";
            }
        });

    };


    /**
     * Adds Saves the Optoins
     */
    $scope.openDyslexic = function() { // Saves options to chrome.storage

        checkBox = document.getElementById('likeOpenDyslexic').checked;
        chrome.storage.sync.set({
            booleans: checkBox
        }, function() { // Update status to let user know options were saved.
            if (checkBox) {
                document.getElementById('messageOpenDyslexic').innerHTML = "On";
            } else {
                document.getElementById('messageOpenDyslexic').innerHTML = "Off";
            }
            reload();
        });
    };


    function reload() {
        chrome.tabs.getSelected(null, function(tab) {
            code = 'window.location.reload();';
            chrome.tabs.executeScript(tab.id, {
                code: code
            });
        });
    }






});