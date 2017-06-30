
openDyslexic = Init: ->

  checkStatus()
  # Check if the check box is set.
  return

checkStatus = ->
  chrome.storage.sync.get { "enabled" }, (items) ->
    if items.enabled
      turnOnOpenDyslexic()
    else
      turnOffOpenDyslexic()
    return
  return


turnOffOpenDyslexic = ->
  if document.getElementById('opendyslexic') != null
    # available
    elem = document.getElementById('opendyslexic')
    elem.parentNode.removeChild elem
    (document.head or document.documentElement).removeChild elem
  return

turnOnOpenDyslexic = ->
  style = document.createElement('link')
  style.rel = 'stylesheet'
  style.type = 'text/css'
  style.setAttribute 'id', 'opendyslexic'
  style.href = chrome.extension.getURL('assets/dist/css/app/accesibility.min.css')
  (document.head or document.documentElement).appendChild style
  return

reloadPage = ->
  chrome.tabs.getSelected null, (tab) ->
    code = 'window.location.reload();'
    chrome.tabs.executeScript tab.id, code: code
    return
  return

openDyslexic.Init()
