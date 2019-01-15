const openDyslexic = {
  init() {
      this.checkStatus(); // Check if the check box is set.
  },
  isEmpty(obj) {
      for (var prop in obj) {
          if (obj.hasOwnProperty(prop))
              return false;
      }
      return true;
  },
  checkStatus() {

      const keysArray = [
          'enabled',
          'font'
      ];

      chrome.storage.sync.get(keysArray, setting => {

          let enabled = setting.enabled;
          let defaultFont = 'opendyslexic';

          if (this.isEmpty(setting.font) === false) {
            defaultFont = setting.font;
          }

          if( enabled === true){
            openDyslexic.enableOpenDyslexic(docs, defaultFont);
          }

          if(enabled === false){
            openDyslexic.disableOpenDyslexic();
          }

      });
  },
  disableOpenDyslexic() {
      let elem = document.getElementById('opendyslexic');
      if (elem) { // available
          elem.parentNode.removeChild(elem);
          (document.head || document.documentElement)
          .removeChild(elem);
          openDyslexic.reloadPage();
      }
  },
  enableOpenDyslexic(paid, defaultFont) {
      let style = document.createElement('link');
      style.rel = 'stylesheet';
      style.type = 'text/css';
      style.setAttribute('id', 'opendyslexic');
  
          style.href = chrome.extension.getURL(`styles/${defaultFont.toLowerCase()}.min.css`);

      document.head.appendChild(style);
      openDyslexic.reloadPage();
  },
  reloadPage() {
      chrome.tabs.query({
          active: true,
          lastFocusedWindow: true
      }, function (tabs) {
          // and use that tab to fill in out title and url
          const currentTab = tabs[0];
          const script = 'window.location.reload();';
          chrome.tabs.executeScript(currentTab.id, {
              code: script
          });
      });
  }
};

openDyslexic.init();