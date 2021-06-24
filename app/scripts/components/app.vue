<template>
	<div class="h-full w-full bg-base-200" style="width: 350px">
		<div class="navbar mb-2 text-neutral-content bg-base-300">
			<div class="flex-1 px-2 lg:flex-none">
				<a class="text-lg font-bold">
					{{ $i18n('appTitle') }}
				</a>
			</div>
			<div class="flex justify-end flex-1 px-2">
				<div class="flex items-stretch">
					<div class="dropdown dropdown-end">
						<div tabindex="0" class="btn btn-ghost rounded-btn">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="inline-block w-6 h-6 stroke-current"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
								/>
							</svg>
						</div>
						<ul
							class="
								shadow
								menu
								dropdown-content
								bg-base-100
								rounded-box
								w-56
							"
						>
							<li>
								<a
									class="
										block
										px-4
										py-2
										text-sm text-base-content
										hover:bg-base-200
										button_strech
									"
									href="https://www.opendyslexic.com"
									target="_blank"
								>
									Discover OpenDyslexic
								</a>
							</li>

							<li>
								<a
									class="
										block
										px-4
										py-2
										text-sm text-base-content
										hover:bg-base-200
										button_strech
									"
									href="https://www.helperbird.com"
									target="_blank"
								>
									Discover Helperbird
								</a>
							</li>
						</ul>
					</div>

					<div class="dropdown dropdown-end">
						<div tabindex="0" class="btn btn-ghost rounded-btn">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="inline-block w-6 h-6 stroke-current"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 6h16M4 12h16m-7 6h7"
								/>
							</svg>
						</div>
						<ul
							class="
								shadow
								menu
								dropdown-content
								bg-base-100
								rounded-box
								w-56
							"
						>
							<li>
								<a
									class="
										block
										px-4
										py-2
										text-sm text-base-content
										hover:bg-base-200
										button_strech
									"
									href="https://chrome.google.com/webstore/detail/opendyslexic-font-for-chr/cdnapgfjopgaggbmfgbiinmmbdcglnam/review"
									target="_blank"
								>
									{{ $i18n('review') }}
								</a>
							</li>

							<li>
								<a
									class="
										block
										px-4
										py-2
										text-sm text-base-content
										hover:bg-base-200
										button_strech
									"
									href="https://chrome.google.com/webstore/detail/opendyslexic-font-for-chr/cdnapgfjopgaggbmfgbiinmmbdcglnam/support"
									target="_blank"
								>
									{{ $i18n('supportlSetting') }}
								</a>
							</li>

							<li>
								<a
									class="
										block
										px-4
										py-2
										text-sm text-base-content
										hover:bg-base-200
										button_strech
									"
									href="https://twitter.com/OpenDyslexic"
									target="_blank"
								>
									{{ $i18n('followDyslexic') }}
								</a>
							</li>

							<li>
								<a
									class="
										block
										px-4
										py-2
										text-sm text-base-content
										hover:bg-base-200
										button_strech
									"
									href="https://www.patreon.com/opendyslexic"
									target="_blank"
								>
									{{ $i18n('followAbbie') }}
								</a>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>

		<main class="p-4">
			<div class="card shadow-lg bordered mb-4 bg-base-100">
				<div class="flex-row card-body">
					<label class="flex-1">
						<div class="flex-1">
							<h2 class="card-title">{{
								$i18n('title_fonts')
							}}</h2>
						</div>
						<div>
							<v-select
								label="title"
								:searchable="searchable"
								:clearable="clearable"
								class="
									input
									style-chooser
									input-borded
									text-base-content
									px-0
									border
									select-lg
								"
								append-to-body
								v-bind:options="fonts"
								@input="enableDyslexica"
								v-model="font"
							>
							</v-select></div
					></label>
				</div>
			</div>

			<div class="card shadow-lg bordered bg-base-100">
				<div class="card-body flex-row">
					<div class="flex-1">
						<h2 class="card-title m-0">
							{{ enable ? $i18n('on') : $i18n('off') }}
						</h2>
					</div>
					<label class="flex-0">
						<div>
							<input
								type="checkbox"
								checked="checked"
								class="toggle toggle-secondary"
								v-model="enable"
								@change="enableDyslexica"
							/>
							<span class="toggle-mark"></span>
						</div>
					</label>
				</div>
			</div>
		</main>
	</div>
</template>

<script>
	import vSelect from 'vue-select';

	import './index.css';

	export default {
		inject: ['notyf'],
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
				fonts: [
					{
						title: 'OpenDyslexic',
						font: 'regular'
					},
					{
						title: 'OpenDyslexic Bold',
						font: 'bold'
					},
					{
						title: 'OpenDyslexic Italic',
						font: 'italic'
					}
				]
			};
		},
		components: {
			vSelect
		},
		mounted: function () {
			const SETTING_KEYS = ['font', 'enabled'];
			chrome.storage.sync.get(SETTING_KEYS, (settings) => {
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
			snackbar: function (message, type = 'success') {
				if (
					message === undefined ||
					message === '' ||
					message === null
				) {
					message = 'Error';
					type = 'error';
				}
				switch (type) {
					case 'success':
						this.notyf.success(message);
						break;
					case 'error':
						this.notyf.error(message);
						break;
					default:
						this.notyf.success(message);
				}
			},
			enableDyslexica: function () {
				// Dont change the settings if its the same or no past

				this.snackbar(chrome.i18n.getMessage('saved'), 'success');
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
				chrome.tabs.query(
					{
						active: true,
						currentWindow: true
					},
					function (tabs) {
						// and use that tab to fill in out title and url
						const CURRENT_TAB = tabs[0].id;
						chrome.tabs.sendMessage(
							CURRENT_TAB,
							{
								message: 'reload'
							},
							function (response) {}
						);
					}
				);
			}
		}
	};
</script>

<style lang="css">
	.style-chooser .vs__search::placeholder,
	.style-chooser .vs__dropdown-toggle,
	.style-chooser .vs__dropdown-menu {
		height: 100%;
		text-transform: lowercase;
		font-variant: small-caps;
	}

	[data-theme='dark'] .style-chooser .vs__selected {
		color: #fff;
	}
	[data-theme='dark'] .style-chooser .vs__clear,
	[data-theme='dark'] .style-chooser .vs__open-indicator {
		fill: #fff;
		cursor: pointer;
	}
</style>
