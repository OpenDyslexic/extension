chrome = undefined
elem = undefined
code = undefined
style = undefined
openDyslexic = Init: ->
  checkStatus()
  # Check if the check box is set.
  return

checkStatus = ->
  chrome.storage.sync.get { booleans: false }, (items) ->
    if items.booleans
      turnOnOpenDyslexic()
      setLike 1
      setMessage 'On'
    else
      turnOffOpenDyslexic()
      setLike 0
      setMessage 'Off'
    return
  return

setLike = (bool) ->
  if document.getElementById('likeOpenDyslexic') != null
    # available
    document.getElementById('likeOpenDyslexic').checked = bool
  return

setMessage = (text) ->
  if document.getElementById('messageOpenDyslexic') != null
    # available
    document.getElementById('messageOpenDyslexic').innerHTML = text
  return

turnOffOpenDyslexic = ->
  if document.getElementById('opendyslexic') != null
    # available
    elem = document.getElementById('opendyslexic')
    elem.parentNode.removeChild elem
    (document.head or document.documentElement).removeChild elem
    reloadPage()
  return

turnOnOpenDyslexic = ->
  style = document.createElement('link')
  style.rel = 'stylesheet'
  style.type = 'text/css'
  style.setAttribute 'id', 'opendyslexic'
  style.href = chrome.extension.getURL('assets/dist/css/opendyslexic/accesibility.min.css')
  (document.head or document.documentElement).appendChild style
  return

reloadPage = ->
  chrome.tabs.getSelected null, (tab) ->
    code = 'window.location.reload();'
    chrome.tabs.executeScript tab.id, code: code
    return
  return

openDyslexic.Init()
