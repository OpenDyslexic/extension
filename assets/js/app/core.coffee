app = angular.module('opendyslexic', [])

app.controller 'core', ($scope) ->

  $scope.enabled = false
  $scope.message =  if $scope.enabled then "On" else "Off"


  $scope.init = ->  
    chrome.storage.sync.get { booleans: false }, (items) ->
      console.log items
      if items.booleans
        $scope.enabled = 1
      else
        $scope.enabled = 0
      return
    return


  ###*
  # Adds Saves the Optoins
  ###
  $scope.openDyslexic = ->
    # Saves options to chrome.storage
    chrome.storage.sync.set { booleans: $scope.enabled }, ->
      # Update status to let user know options were saved.
       $scope.reloadPage()
      return
    return


  $scope.reloadPage = ->
    chrome.tabs.getSelected null, (tab) ->
      code = 'window.location.reload();'
      chrome.tabs.executeScript tab.id, code: code
      return
    return

return
