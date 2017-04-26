app = angular.module('opendyslexic', [])

app.controller 'core', ($scope) ->

  $scope.enabled = 0
  $scope.message = if $scope.enabled then "On" else "Off"
  sync = undefined
  elem = undefined
  code = undefined
  style = undefined

  reload = ->
    chrome.tabs.getSelected null, (tab) ->
      code = 'window.location.reload();'
      chrome.tabs.executeScript tab.id, code: code
      return
    return


  $scope.init = ->
    chrome.storage.sync.get { booleans: false }, (items) ->
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
    checkBox = document.getElementById('likeOpenDyslexic').checked
    chrome.storage.sync.set { booleans: checkBox }, ->
      # Update status to let user know options were saved.
       $scope.reload()
      return
    return










$scope.reloadPage = ->
  chrome.tabs.getSelected null, (tab) ->
    code = 'window.location.reload();'
    chrome.tabs.executeScript tab.id, code: code
    return
  return

return
