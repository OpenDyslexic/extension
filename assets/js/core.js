var app = angular.module("opendyslexic", []);
app.controller("core", function($scope) {


    var sync, elem, code, style;

    $scope.init = function() {

        chrome.storage.sync.get({
            booleans: true,
            docsBeta: false
        }, function(items) {
            if (items.booleans === true) {
                document.getElementById('likeOpenDyslexic').checked = true;
                document.getElementById('messageOpenDyslexic').innerHTML = "On";
                  document.getElementById('likeOpenDyslexic').setAttribute("checked", "true");
            } else if (items.docsBeta === true) {
                document.getElementById('likeDocsBeta').checked = true;
                document.getElementById('messageDocsBeta').innerHTML = "On";

                document.getElementById('likeDocsBeta').setAttribute("checked", "true");
            } else if (items.docsBeta === false) {
                document.getElementById('likeDocsBeta').checked = false;
                document.getElementById('likeDocsBeta').setAttribute("checked", "false");
                document.getElementById('messageDocsBeta').innerHTML = "Off";
            } else {
                document.getElementById('likeOpenDyslexic').checked = false;
                document.getElementById('likeOpenDyslexic').setAttribute("checked", "false");
                document.getElementById('messageOpenDyslexic').innerHTML = "Off";
            }
        });

    };


    /**
     * Adds Saves the Optoins
     */
    $scope.openDyslexic = function() { // Saves options to chrome.storage

        checkBox = document.getElementById('likeOpenDyslexic').checked;
        checkBoxBeta = document.getElementById('likeDocsBeta').checked;
        chrome.storage.sync.set({
            booleans: checkBox,
            docsBeta: checkBoxBeta
        }, function() { // Update status to let user know options were saved.
            if (checkBox === true) {
                document.getElementById('messageOpenDyslexic').innerHTML = "On";
            } else {
                document.getElementById('messageOpenDyslexic').innerHTML = "Off";
            }
            reload();
        });
    };

    /**
     * Adds Saves the Optoins
     */
    $scope.docsBeta = function() { // Saves options to chrome.storage

        checkBox = document.getElementById('likeOpenDyslexic').checked;
        checkBoxBeta = document.getElementById('likeDocsBeta').checked;
        chrome.storage.sync.set({
            booleans: checkBox,
            docsBeta: checkBoxBeta
        }, function() { // Update status to let user know options were saved.
            if (checkBoxBeta === true) {
              document.getElementById('likeDocsBeta').checked = true;
            } else {
              document.getElementById('likeDocsBeta').checked = false;
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
