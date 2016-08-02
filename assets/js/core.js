var app = angular.module("opendyslexic", []);
app.controller("core", function($scope) {


    var sync, elem, code, style;
    var opendyslexicInput = document.getElementById('likeOpenDyslexic');
    var betaInput = document.getElementById('likeDocsBeta');
    $scope.init = function() {

        chrome.storage.sync.get({
            enableOpendyslexic: true,
            docsBeta: true
        }, function(items) {
            console.log(items);
            if (items.enableOpendyslexic === true) {
                opendyslexicInput.checked = true;
                document.getElementById('messageOpenDyslexic').innerHTML = "On";
                opendyslexicInput.setAttribute("checked", "true");

            } else if (items.enableOpendyslexic === false) {

                betaInput.checked = false;
                document.getElementById('messageBeta').innerHTML = "Off";
                betaInput.setAttribute("checked", "false");
                opendyslexicInput.checked = false;
                document.getElementById('messageOpenDyslexic').innerHTML = "Off";
                opendyslexicInput.setAttribute("checked", "false");

            } else if (items.docsBeta === false) {

                betaInput.checked = false;
                document.getElementById('messageBeta').innerHTML = "Off";
                betaInput.setAttribute("checked", "false");

            } else if (items.docsBeta === true) {

                betaInput.checked = true;
                document.getElementById('messageBeta').innerHTML = "On";
                betaInput.setAttribute("checked", "true");

                opendyslexicInput.checked = true;
                document.getElementById('messageOpenDyslexic').innerHTML = "One";
                opendyslexicInput.setAttribute("checked", "true");

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
            enableOpendyslexic: checkBox,
            docsBeta: checkBoxBeta
        }, function() { // Update status to let user know options were saved.
            if (checkBox === true) {
                document.getElementById('messageOpenDyslexic').innerHTML = "On";
            } else {
                document.getElementById('messageOpenDyslexic').innerHTML = "Off";
            }

            if (checkBoxBeta === true) {
                document.getElementById('messageBeta').innerHTML = "On";
            } else {
                document.getElementById('messageBeta').innerHTML = "Off";
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
            enableOpendyslexic: checkBox,
            docsBeta: checkBoxBeta
        }, function() { // Update status to let user know options were saved.
            if (checkBoxBeta === true) {
                document.getElementById('messageBeta').innerHTML = "On";
            } else {
                document.getElementById('messageBeta').innerHTML = "Off";
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
