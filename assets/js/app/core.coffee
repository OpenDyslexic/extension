app = angular.module('opendyslexic', [])

app.controller 'core', ($scope) ->

  $scope.checkboxModel =
    value : false
    text : 'Off'

  angular.element(document).ready ->
    chrome.storage.sync.get { 'enabled' }, (items) ->
      $scope.checkboxModel.value = items.enabled
      if $scope.checkboxModel.value == true
        $scope.checkboxModel.text = "On"
      else
        $scope.checkboxModel.text = "Off"
      return
    return


  ###*
  # Adds Saves the Optoins
  ###
  $scope.openDyslexic = ->
    # Saves options to chrome.storage
    chrome.storage.sync.set { enabled: $scope.checkboxModel.value }, ->
      # Update status to let user know options were saved.
      $scope.checkboxModel.value = $scope.checkboxModel.value
      if this.value == true
        $scope.checkboxModel.text = "On"
      else
        $scope.checkboxModel.text = "Off"
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
