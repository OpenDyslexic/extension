<template>
  <div
    class="relative max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8 h-screen flex items-center justify-center"
  >
    <div
      class="mx-auto lg:grid lg:grid-cols-2 lg:gap-8 h-screen flex items-center justify-center"
    >
      <div class="here mx-auto">
        <div class="w-full lg:border-none p-4 mb-2">
          <a
            href="https://opendyslexic.org?utm_source=opendyslexic-chrome&utm_medium=referral"
            target="_blank"
            class="btn btn-ghost normal-case text-2xl mx-auto text-center"
          >
            OpenDyslexic
          </a>
          <p class="text-base text-black mx-auto text-center">
            <a
              :href="advert.href"
              target="_blank"
              :title="advert.text"
              class="text-black decoration-black no-underline hover:underline hover:text-black hover:decoration-wavy"
              ><b> {{ advert.text }}</b></a
            >
          </p>
        </div>

        <main class="block">
          <div
            class="card shadow-lg compact side bg-base-100 text-base-content col-span-6 border-2 border-stone-600"
          >
            <div class="card-body">
              <div class="flex mb-8 mt-4">
                <div class="flex-1">
                  <h2 class="card-title font-normal text-lg">
                    {{
                      enable === true ? $helperbird_i18n("on") : $helperbird_i18n("off")
                    }}
                  </h2>
                </div>

                <label class="flex-0">
                  <div>
                    <input
                      type="checkbox"
                      checked="checked"
                      class="toggle toggle-primary"
                      v-model="enable"
                      @change="save('enabled')"
                    />
                    <span class="toggle-mark"></span>
                  </div>
                </label>
              </div>
              <div class="mb-8 mt-4">
                <h2 class="card-title font-normal mb-8 text-lg">
                  {{ $helperbird_i18n("style") }}
                </h2>

                <div class="grid grid-cols-2 gap-4 sm:gap-2">
                  <div v-for="font in text.fonts" :key="font.title" class="grid">
                    <button
                      :class="[
                        'btn',
                        'btn-sm',

                        'btn-neutral',

                        `helperbird-font-${font.font}`,
                        'text-sm',
                        {
                          'btn-outline': font.title !== text.selectedFont.title,
                        },
                      ]"
                      @click="save('font', font)"
                    >
                      {{ font.font }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import "./index.css";
import { Badge } from "@scripts/content/badge.js";
export default {
  inject: ["$helperbird_i18n", "sendToContentScript"],
  data() {
    return {
      paid: true,
      enable: null,
      font: "regular",
      BADGE: new Badge(),
      text: {
        selectedFont: {
          title: "OpenDyslexic",
          font: "regular",
        },
        fonts: [
          {
            title: "OpenDyslexic",
            font: "regular",
          },
          {
            title: "OpenDyslexic Bold",
            font: "bold",
          },
          {
            title: "OpenDyslexic Italic",
            font: "italic",
          },
        ],
      },
    };
  },

  mounted() {
    const SETTING_KEYS = ["font", "enabled"];
    chrome.storage.local.get(SETTING_KEYS, (settings) => {
      const findFont = this.text.fonts.find((o) => o.font === settings.font);
      this.text.selectedFont = findFont ? findFont : this.text.selectedFont;
      this.enable = settings.enabled ? true : false;
      this.BADGE.update({ state: this.enable });
    });
  },

  computed: {
    advert() {
      let points = [
        {
          href: "https://www.patreon.com/opendyslexic",
          text: "Support OpenDyslexic",
        },
        {
          href: "https://github.com/OpenDyslexic/extension",
          text: "We are on Github",
        },
        {
          href: "https://twitter.com/opendyslexic",
          text: "Follow us on Twitter",
        },
        {
          href:
            "https://addons.mozilla.org/en-US/firefox/addon/opendyslexic-for-firefox/",
          text: "Available on Firefox",
        },
        {
          href: "https://www.patreon.com/opendyslexic",
          text: "Created by Abbie Gonzalez",
        },
        {
          href: "https://www.patreon.com/opendyslexic",
          text: "Sponsor on Patreon",
        },
        {
          href: "https://www.helperbird.com",
          text: "Discover Helperbird for Chrome",
        },

        {
          href: "https://www.helperbird.com",
          text: "Maintained by Robert James",
        },
        {
          href:
            "https://chrome.google.com/webstore/detail/opendyslexic-for-chrome/cdnapgfjopgaggbmfgbiinmmbdcglnam/reviews",
          text: "Review this extension",
        },
      ];

      let random = Math.floor(Math.random() * points.length);

      return points[random];
    },
  },

  methods: {
    sync(token, type) {
      const setting = {};
      setting[token] = type;
      chrome.storage.local.set(setting);
      return setting;
    },

    isEmpty(value) {
      return (
        value === undefined ||
        value === null ||
        value === "" ||
        value === "undefined" ||
        value === "null"
      );
    },

    toaster(CONFIG) {
      const MESSAGE = CONFIG.message ? CONFIG.message : null;
      const TYPE = CONFIG.type ? CONFIG.type : "success";

      if (this.isEmpty(MESSAGE)) {
        return false;
      }

      switch (TYPE) {
        case "success":
          this.$toast.success(MESSAGE);
          break;
        case "error":
          this.$toast.error(MESSAGE);
          break;
        case "info":
          this.$toast.info(MESSAGE);
          break;
        case "warning":
          this.$toast.warning(MESSAGE);
          break;
        default:
          this.$toast.error(MESSAGE);
      }
    },

    save(featureID, selected) {
      let key = featureID;
      switch (key) {
        case "enabled":
          this.sync("enabled", this.enable);
          this.BADGE.update({ state: this.enable });
          break;

        case "font":
          if (this.isEmpty(selected) === false) {
            this.text.selectedFont = selected;
            this.sync("font", this.text.selectedFont.font);
          }
          break;
      }

      const TOASTER_CONFIG = {
        message: this.$helperbird_i18n("saved"),
        type: "success",
      };

      this.toaster(TOASTER_CONFIG);
    },
  },
};
</script>

<style lang="css">
.helperbird-font-italic {
  font-style: italic;
  font-weight: normal;
}
.helperbird-font-bold {
  font-style: bold;
  font-weight: bold;
}

.helperbird-font-regular {
  font-style: normal;
  font-weight: normal;
}
</style>
