<template>
  <div class="viewport">
    <md-app>
      <md-app-toolbar>

        <div class="md-title" style="flex: 1">{{ $i18n('appTitle') }}</div>
        <md-button class="md-icon-button" @click="menuVisible = !menuVisible">
          <md-icon>menu</md-icon>
        </md-button>
      </md-app-toolbar>


      <md-app-drawer :md-active.sync="menuVisible">
        <md-toolbar class="md-title" style="flex: 1" md-elevation="0"> {{ $i18n('appTitle') }}</md-toolbar>


        <!-- Support section -->

        <md-list>
          <md-subheader class="md-accent">{{ $i18n('supportlSetting') }}</md-subheader>


          <md-list-item>
            <div class="md-list-item-text">
              <a href="http://opendyslexic.com/" target="_blank">
                {{ $i18n('websiteLabel') }}
              </a>
            </div>

            <div class="md-list-item">
              <a href="http://opendyslexic.com/" target="_blank">
                <md-icon>rate_review</md-icon>
              </a>
            </div>
          </md-list-item>
          <md-list-item>
            <div class="md-list-item-text">
              <a href="https://chrome.google.com/webstore/detail/opendyslexic-font-for-chr/cdnapgfjopgaggbmfgbiinmmbdcglnam/support"
                target="_blank">
                {{ $i18n('supportlSetting') }}
              </a>
            </div>

            <div class="md-list-item">
              <a href="https://chrome.google.com/webstore/detail/opendyslexic-font-for-chr/cdnapgfjopgaggbmfgbiinmmbdcglnam/support"
                target="_blank">
                <md-icon>help</md-icon>
              </a>
            </div>
          </md-list-item>
        </md-list>


        <md-list>
          <md-subheader class="md-accent">{{ $i18n('socialSetting') }}</md-subheader>
          <md-list-item>
            <div class="md-list-item-text">
              <a href="https://twitter.com/OpenDyslexic" target="_blank">
                {{ $i18n('followDyslexic') }}
              </a>
            </div>

            <div class="md-list-item">
              <a href="https://twitter.com/OpenDyslexic" target="_blank">
                <md-icon>person_add</md-icon>
              </a>
            </div>
          </md-list-item>
          <md-list-item>
            <div class="md-list-item-text">
              <a href="https://www.patreon.com/opendyslexic" target="_blank">
                {{ $i18n('followAbbie') }}
              </a>
            </div>
            <div class="md-list-item">
              <a href="https://www.patreon.com/opendyslexic" target="_blank">
                <md-icon>person_add</md-icon>
              </a>
            </div>
          </md-list-item>
          <md-list-item>
            <div class="md-list-item-text">
              <a href="https://twitter.com/RobertJGabriel" target="_blank">
                {{ $i18n('followRobertJames') }}
              </a>
            </div>

            <div class="md-list-item">
              <a href="https://twitter.com/RobertJGabriel" target="_blank">
                <md-icon>person_add</md-icon>
              </a>
            </div>
          </md-list-item>
        </md-list>

      </md-app-drawer>

      <md-app-content>
        <md-content>
          <!-- Enable font -->
          <md-list>

            <md-list-item>
              <span class="md-list-item-text">{{ $i18n('enableFontLabel') }}</span>
              <div class="md-list-item">
                <md-switch v-model="enable" class="md-primary" @change="enableDyslexica"></md-switch>
              </div>
            </md-list-item>

            <md-list-item>
              <div class="md-list-item full_width">

                <div class="md-list-item-text title topper">{{ $i18n("title_fonts") }}</div>
                <v-select label="title" searchable=searchable clearable=clearable append-to-body v-bind:options="fonts"
                  v-model="font">
                </v-select>

                <div class="md-list-item full_width topper">
                  <md-button class="md-raised md-primary button-right" @click="fontChanged"
                    :disabled='enable? false : true'>
                    Save
                  </md-button>

                </div>
              </div>

            </md-list-item>

          </md-list>



        </md-content>


      </md-app-content>


    </md-app>



    <md-snackbar :md-duration="duration" :md-active.sync="showSnackbar" v-html='popupMessage' md-persistent>
    </md-snackbar>
  </div>


</template>

<script>
  import Vue from 'vue';
  import 'material-icons/iconfont/material-icons.css';
  import 'vue-select/dist/vue-select.css';
  import vSelect from 'vue-select'
  import i18n from 'vue-plugin-webextension-i18n';
  Vue.use(i18n);
  export default {
    data: function () {
      return {
        enable: null,
        font: 'opendyslexic',
        duration: 3000,
        showSnackbar: false,
        popupMessage: '',
        menuVisible: false,
        currentFont: null,
        searchable: false,
        clearable: false,
        fonts: [{
            title: "OpenDyslexic",
            font: "regular"
          },
          {
            title: "OpenDyslexic Bold",
            font: "bold"
          },
          {
            title: "OpenDyslexic Italic",
            font: "italic"
          }
        ],
      }
    },
    components: {
      vSelect
    },
    mounted: function () {
      const SETTING_KEYS = ['font', 'enabled'];
      chrome.storage.sync.get(SETTING_KEYS, settings => {
        this.enable = settings.enabled ? true : false;
        this.font = settings.font ? settings.font : 'regular';
        return this.enable;
      });
    },
    methods: {
      fontChanged: function () {
        this.save('font', this.font);
      },
      save: function (token, type) {
        let setting = {};
        setting[token] = type;
        chrome.storage.sync.set(setting);
        this.reload();
        return setting;
      },

      enableDyslexica: function () {
        // Dont change the settings if its the same or no past
        this.showSnackbar = true;
        this.popupMessage = chrome.i18n.getMessage('saved');

        if (this.enable === true) {
          chrome.browserAction.setBadgeBackgroundColor({
            color: [236, 147, 104, 1]
          });
          chrome.browserAction.setBadgeText({
            text: 'On'
          });
        } else {
          chrome.browserAction.setBadgeText({
            text: ''
          });
        }

        this.save('enabled', this.enable);
        this.reload();
      },
      reload: function () {


        chrome.tabs.getSelected(null, function (tab) {
          console.log(tab);
          this.showSnackbar = true;
          this.popupMessage = chrome.i18n.getMessage('reloadingMessage');
          // and use that tab to fill in out title and url
          const CURRENT_TAB = tab.id;
          chrome.tabs.sendMessage(
            CURRENT_TAB, {
              message: 'reload'
            },
            function (response) {

            }
          );
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
    height: 450px;
    background-color: #fafafa;
  }

  .md-drawer.md-temporary.md-left+.md-app-container .md-content,
  .md-list.md-theme-default {
    background-color: #fafafa;
  }

  .button-right {
    float: right;
  }

  .md-app {
    height: 450px;
  }

  .md-drawer.md-temporary.md-active {
    background-color: #fafafa;
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

  .md-list-item-content {
    padding: 4px 0px 4px 16px !important;
  }

  .topper {
    padding: 16px 0px;
  }

  .full_width {
    width: 249px;
  }

  .md-switch {
    margin: 16px 0px 16px 0 !important;
  }

  .control {
    min-width: 250px;
    display: flex;
    flex-direction: column;
    padding: 16px;
  }

  .vs__clear {
    display: none !important;
  }


  .md-button.md-theme-default.md-primary {
    margin: 0;
  }
</style>