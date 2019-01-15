<template>
  <div class="viewport">

    <md-toolbar class="md-accent" md-elevation="1">
      <div class="md-title" style="flex: 1">{{ $i18n('appTitle') }}</div>
    </md-toolbar>

    <md-list>
      <md-subheader class="md-accent">{{ $i18n('settings') }}</md-subheader>

      <md-list-item  md-expand>
            <md-icon>help</md-icon>
            <span class="md-list-item-text">Font</span>
             <md-list slot="md-expand">
               <md-list-item class="md-inset">
                <md-field>
                  <label for="font">{{ $i18n('selectedFontLabel') }}</label>
                  <md-select v-model="font" @md-closed="fontChanged">
                    <md-option value="opendyslexic">OpenDyslexic</md-option>
                  </md-select>
                </md-field>
               </md-list-item>
             </md-list>
      </md-list-item>

    </md-list>



    <md-list>
      <md-list-item md-expand>
        <md-icon>help</md-icon>
        <span class="md-list-item-text">Support</span>
        <md-list slot="md-expand">
          <md-list-item class="md-inset">

            <div class="md-list-item-text">
              Reviews
            </div>
            <md-tooltip md-direction="top">Leave or read reviews</md-tooltip>
            <div class="md-list-item">
              <a href="https://chrome.google.com/webstore/detail/opendyslexic-font-for-chr/cdnapgfjopgaggbmfgbiinmmbdcglnam/reviews"
                target="_blank">
                <md-icon>rate_review</md-icon>
              </a>
            </div>
          </md-list-item>

          <md-list-item class="md-inset">
            <div class="md-list-item-text">
              Support
            </div>
            <md-tooltip md-direction="top">Having an issue? Contact support.</md-tooltip>
            <div class="md-list-item">
              <a href="https://chrome.google.com/webstore/detail/opendyslexic-font-for-chr/cdnapgfjopgaggbmfgbiinmmbdcglnam/support"
                target="_blank">
                <md-icon>help</md-icon>
              </a>
            </div>
          </md-list-item>

          <md-list-item class="md-inset">
            <div class="md-list-item-text">
              Firefox Version
            </div>
            <md-tooltip md-direction="top">Download the Firefox verison</md-tooltip>
            <div class="md-list-item">
              <a href="https://addons.mozilla.org/en-US/firefox/addon/opendyslexic-for-firefox/" target="_blank">
                <md-icon>extension</md-icon>
              </a>
            </div>
          </md-list-item>

        </md-list>





      </md-list-item>
    </md-list>






    <md-list>

      <md-list-item md-expand>
        <md-icon>person_add</md-icon>
        <span class="md-list-item-text">Social</span>

        <md-list slot="md-expand">
          <md-list-item class="md-inset">

            <div class="md-list-item-text">
              Follow OpenDyslexic
            </div>
            <md-tooltip md-direction="top">Follow OpenDyslexic on Twitter</md-tooltip>
            <div class="md-list-item">
              <a href="https://twitter.com/OpenDyslexic" target="_blank">
                <md-icon>person_add</md-icon>
              </a>
            </div>
          </md-list-item>
          <md-list-item class="md-inset">
            <div class="md-list-item-text">
              Follow Abbie Gonzalez
            </div>
            <md-tooltip md-direction="top">Follow Abbie Gonzalez</md-tooltip>
            <div class="md-list-item">
              <a href="https://twitter.com/Antijingoist" target="_blank">
                <md-icon>person_add</md-icon>
              </a>
            </div>
          </md-list-item>
          <md-list-item class="md-inset">
            <div class="md-list-item-text">
              Follow Robert James
            </div>
            <md-tooltip md-direction="top">Follow maintainer</md-tooltip>
            <div class="md-list-item">
              <a href="https://twitter.com/robertjgabriel" target="_blank">
                <md-icon>person_add</md-icon>
              </a>
            </div>
          </md-list-item>
        </md-list>
      </md-list-item>
    </md-list>



    <md-list>
      <md-list-item md-expand>
        <md-icon>new_releases</md-icon>
        <span class="md-list-item-text">What`s new</span>
        <md-list slot="md-expand">
          <md-list-item class="md-inset">


            <div class="md-list-item">
fjfljkfkljfjklflkjfjkljkl
            </div>
          </md-list-item>


        </md-list>
      </md-list-item>
    </md-list>


    <md-snackbar :md-duration="duration" :md-active.sync="showSnackbar" v-html='popupMessage' md-persistent>
    </md-snackbar>
  </div>


</template>

<script>
  import Vue from 'vue';
  import 'material-icons/iconfont/material-icons.css';

  import i18n from 'vue-plugin-webextension-i18n';
  Vue.use(i18n);
  module.exports = {
    data: function () {
      return {
        paid: true,
        enable: null,
        font: null,
        duration: 3000,
        showSnackbar: false,
        popupMessage: '',
      }
    },
    mounted: function () {
      const SETTING_KEYS = ['font', 'enabled'];
      chrome.storage.sync.get(SETTING_KEYS, settings => {
        this.enable = settings.enabled ? true : false;
        this.font = settings.font ? settings.font : 'opendyslexic';
        return this.enable;
      });
    },
    methods: {
      fontChanged: function () {
        this.enable = false;
        this.save('font', this.font);
      },
      save: function (token, type) {
        let setting = {};
        setting[token] = type;
        chrome.storage.sync.set(setting);
        return setting;
      },

      enableDyslexica: function () {
        // Dont change the settings if its the same or no past
        this.showSnackbar = true;
        this.popupMessage = chrome.i18n.getMessage('saved');
        this.save('enabled', this.enable);
        this.reload();
      },
      reload: function () {
        chrome.tabs.query({
          active: true,
          lastFocusedWindow: true
        }, function (tabs) {
          this.showSnackbar = true;
          this.popupMessage = chrome.i18n.getMessage('reloadingMessage');
          // and use that tab to fill in out title and url
          const CURRENT_TAB = tabs[0];
          const SCRIPT = 'window.location.reload();';
          chrome.tabs.executeScript(CURRENT_TAB.id, {
            code: SCRIPT
          })
        });
      }
    }
  }
</script>




<style scoped>
  .viewport,
  body {
    width: 320px;
    max-width: 100%;
    display: inline-block;
    vertical-align: top;
    border: 1px solid rgba(#000, .12);
    min-height: fit-content;
    height: fit-content;
  }

  .full-control {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap-reverse;
  }

  .list {
    padding: 0 16px;
  }

  .full-control>.md-list {
    width: 320px;
    max-width: 100%;
    height: 400px;
    display: inline-block;
    overflow: auto;
    border: 1px solid rgba(#000, .12);
    vertical-align: top;
  }

  .control {
    min-width: 250px;
    display: flex;
    flex-direction: column;
    padding: 16px;
  }
</style>