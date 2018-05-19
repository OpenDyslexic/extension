'use strict';

var app = angular.module('opendyslexic', []);
app.controller('core', function ($scope) {
  var sync, elem, code, style;

  $scope.init = function () {
    var openDyslexicEnabled = document.getElementById('likeOpenDyslexic');
    var messageOpenDyslexic = document.getElementById('messageOpenDyslexic');
    chrome.storage.sync.get({
      enabled: false
    }, function (items) {
      if (items.enabled === true) {
        openDyslexicEnabled.checked = 1;
        messageOpenDyslexic.innerHTML = 'On';
      } else {
        openDyslexicEnabled.checked = 0;
        messageOpenDyslexic.innerHTML = 'Off';
      }
    });
  };

  /**
   * Adds Saves the Optoins
   */
  $scope.openDyslexic = function () {
    // Saves options to chrome.storage

    var checkBox = document.getElementById('likeOpenDyslexic').checked;
    var messageOpenDyslexic = document.getElementById('messageOpenDyslexic');
    chrome.storage.sync.set({
      enabled: checkBox
    }, function () {
      // Update status to let user know options were saved.
      if (checkBox === true) {
        messageOpenDyslexic.innerHTML = 'On';
      } else {
        messageOpenDyslexic.innerHTML = 'Off';
      }
      reload();
    });
  };

  function reload() {

    chrome.tabs.query({
      active: true,
      lastFocusedWindow: true
    }, function (tabs) {
      // and use that tab to fill in out title and url
      var tab = tabs[0];
      code = 'window.location.reload();';
      chrome.tabs.executeScript(tab.id, {
        code: code
      });
    });
  }
});