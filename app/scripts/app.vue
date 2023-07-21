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
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											class="inline-block w-6 h-6 fill-current"
										>
											<path
												d="M0 0h24v24H0V0z"
												fill="none"
											/>
											<path
												d="M9.93 13.5h4.14L12 7.98zM20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-4.05 16.5l-1.14-3H9.17l-1.12 3H5.96l5.11-13h1.86l5.11 13h-2.09z"
											/>
										</svg>
										{{
											enable === true
												? $helperbird_i18n('on')
												: $helperbird_i18n('off')
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
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										class="inline-block w-6 h-6 fill-current"
									>
										<path d="M0 0h24v24H0z" fill="none" />
										<path
											d="M2.53 19.65l1.34.56v-9.03l-2.43 5.86c-.41 1.02.08 2.19 1.09 2.61zm19.5-3.7L17.07 3.98c-.31-.75-1.04-1.21-1.81-1.23-.26 0-.53.04-.79.15L7.1 5.95c-.75.31-1.21 1.03-1.23 1.8-.01.27.04.54.15.8l4.96 11.97c.31.76 1.05 1.22 1.83 1.23.26 0 .52-.05.77-.15l7.36-3.05c1.02-.42 1.51-1.59 1.09-2.6zM7.88 8.75c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-2 11c0 1.1.9 2 2 2h1.45l-3.45-8.34v6.34z"
										/>
									</svg>

									{{ $helperbird_i18n('style') }}
								</h2>

								<div
									class="grid grid-cols-3 gap-4 sm:gap-2 ml-8"
								>
									<div
										v-for="font in text.fonts"
										:key="font.title"
										class="grid items-center text-center"
									>
										<div
											:class="[
												'tooltip',
												'tooltip-primary',
												'tooltip-top'
											]"
											:data-tip="font.title"
										>
											<button
												:class="[
													'btn',
													'btn-square',
													'btn-neutral',
													'normal-case',
													`helperbird-font-${font.font}`,
													'text-lg',
													{
														'btn-outline':
															font.title !==
															text.selectedFont
																.title
													}
												]"
												@click="save('font', font)"
											>
												Aa
											</button>
										</div>
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
	import './index.css';

	export default {
		inject: ['$helperbird_i18n', 'sendToContentScript'],
		data() {
			return {
				paid: true,
				enable: null,
				font: 'regular',

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

			save(featureID, selected) {
				let key = featureID;
				switch (key) {
					case 'enabled':
						this.sync('enabled', this.enable);
						break;

					case 'font':
						if (this.isEmpty(selected) === false) {
							this.text.selectedFont = selected;
							this.sync('font', this.text.selectedFont.font);
						}
						break;
				}

				const TOASTER_CONFIG = {
					message: this.$helperbird_i18n('saved'),
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
