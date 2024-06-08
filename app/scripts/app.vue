<template>
	<main
		class="max-w-md w-full mx-auto flex-grow h-full bg-transparent text-base-content p-6 overflow-hidden"
	>
		<div class="flex-1 p-2 h-fit mx-auto w-full flex items-center flex-col">
			<div class="w-full">
				<a
					href="https://www.opendyslexic.org"
					target="_blank"
					class="mx-auto block text-center text-4xl text-black hover:underline btn-neutral"
				>
					OpenDyslexic
				</a>
				<p class="text-base text-black mx-auto text-center mt-2">
					<a
						:href="advert.href"
						target="_blank"
						:title="advert.text"
						class="hover:underline"
						><b> {{ advert.text }}</b></a
					>
				</p>
			</div>

			<div class="w-full">
				<div class="flex mb-6 mt-10">
					<h2 class="flex-1 card-title text-black">
						{{ $coffeeandfun_i18n('dyslexic_font', 'OpenDylexic') }}
					</h2>
					<label class="flex-0 flex items-center" for="enableFont">
						<input
							id="enableFont"
							v-model="enable"
							type="checkbox"
							name="enableFont"
							class="toggle border-2"
							@change="turnOn"
							@keyup.enter="turnOn"
							:aria-checked="enable.toString()"
						/>
						<span class="sr-only">
							{{
								$coffeeandfun_i18n(
									'dyslexic_font',
									'OpenDylexic'
								)
							}}</span
						>
					</label>
				</div>

				<div
					class="card card-compact bg-base-300 border-stone-300 border-2 text-base-content block w-full mt-2"
				>
					<div class="card-body rounded-xl">
						<div class="flex-1">
							<div class="flex flex-col w-full border-opacity-50">
								<div class="flex-1 mb-8">
									<div class="grid grid-cols-1 gap-4">
										<div
											v-for="font in text.fonts"
											:key="font.title"
											class="grid items-center text-center"
										>
											<button
												:disabled="!enable"
												:class="[
													'btn',

													'btn-ghost',

													'normal-case',
													`helperbird-font-${font.font}`,
													{
														'btn-neutral':
															font.font.toLocaleLowerCase() ===
															text.selectedFont.font.toLocaleLowerCase(),
														'btn-active':
															font.font.toLocaleLowerCase() ===
															text.selectedFont.font.toLocaleLowerCase()
													}
												]"
												@click="save(font)"
											>
												{{ font.title }}
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</main>
</template>

<script>
	import './index.css';

	export default {
		inject: ['$coffeeandfun_i18n', 'sendToContentScript'],
		data() {
			return {
				enable: false,
				text: {
					selectedFont: {
						title: 'OpenDyslexic',
						font: 'regular'
					},
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
				}
			};
		},

		mounted() {
			const SETTING_KEYS = ['font', 'enabled'];

			chrome.storage.local.get(SETTING_KEYS, (settings) => {
				const findFont = this.text.fonts.find(
					(o) => o.font === settings.font
				);
				this.text.selectedFont = findFont
					? findFont
					: this.text.selectedFont;
				this.enable = settings.enabled ? true : false;
				this.updateBadge();
			});
		},

		computed: {
			advert() {
				let points = [
					{
						href: 'https://www.patreon.com/opendyslexic',
						text: 'Support OpenDyslexic'
					},
					{
						href: 'https://github.com/OpenDyslexic/extension',
						text: 'We are on Github'
					},
					{
						href: 'https://twitter.com/opendyslexic',
						text: 'Follow us on Twitter'
					},

					{
						href: 'https://addons.mozilla.org/en-US/firefox/addon/opendyslexic-for-firefox/',
						text: 'Available on Firefox'
					},
					{
						href: 'https://www.patreon.com/opendyslexic',
						text: 'Created by Abbie Gonzalez'
					},
					{
						href: 'https://www.patreon.com/opendyslexic',
						text: 'Sponsor on Patreon'
					},
					{
						href: 'https://www.helperbird.com',
						text: 'Discover Helperbird for Chrome'
					},
					{
						href: 'https://www.helperbird.com',
						text: 'Learn about Helperbird'
					},
					{
						href: 'https://www.helperbird.com',
						text: 'Maintained by Robert James'
					},
					{
						href: 'https://chrome.google.com/webstore/detail/opendyslexic-for-chrome/cdnapgfjopgaggbmfgbiinmmbdcglnam/reviews',
						text: 'Review this extension'
					}
				];

				let random = Math.floor(Math.random() * points.length);

				return points[random];
			}
		},

		methods: {
			sync(token, type) {
				const setting = {};
				setting[token] = type;
				chrome.storage.local.set(setting);
				return setting;
			},
			turnOn() {
				this.sync('enabled', this.enable);

				this.updateBadge();
			},
			updateBadge() {
				if (this.enable) {
					chrome.action.setBadgeText({ text: 'on' });
					chrome.action.setBadgeBackgroundColor({ color: '#00FF00' }); // Green color
				} else {
					chrome.action.setBadgeText({ text: 'off' });
					chrome.action.setBadgeBackgroundColor({ color: '#FF0000' }); // Red color
				}
			},
			isEmpty(value) {
				return (
					value === undefined ||
					value === null ||
					value === '' ||
					value === 'undefined' ||
					value === 'null'
				);
			},

			toaster(CONFIG) {
				const MESSAGE = CONFIG.message ? CONFIG.message : null;
				const TYPE = CONFIG.type ? CONFIG.type : 'success';

				if (this.isEmpty(MESSAGE)) {
					return false;
				}

				switch (TYPE) {
					case 'success':
						this.$toast.success(MESSAGE);
						break;
					case 'error':
						this.$toast.error(MESSAGE);
						break;
					case 'info':
						this.$toast.info(MESSAGE);
						break;
					case 'warning':
						this.$toast.warning(MESSAGE);
						break;
					default:
						this.$toast.error(MESSAGE);
				}
			},

			save(selected) {
				if (this.isEmpty(selected) === false) {
					this.text.selectedFont = selected;
					this.sync('font', this.text.selectedFont.font);
				}

				const TOASTER_CONFIG = {
					message: this.$coffeeandfun_i18n('saved'),
					type: 'success'
				};

				this.toaster(TOASTER_CONFIG);
			}
		}
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
