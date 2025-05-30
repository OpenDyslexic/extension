<template>
	<div class="relative max-w-5xl mx-auto">
		<nav class="bg-yellow-500 py-2 text-white lg:block">
			<div class="relative overflow-hidden max-w-full">
				<div
					class="animate-marquee whitespace-nowrap px-4"
					style="animation-delay: 0s"
				>
					<template v-for="advert in adverts" :key="advert.text">
						<a
							:href="advert.href"
							target="_blank"
							:title="advert.text"
							class="btn btn-sm btn-ghost"
						>
							{{ advert.text }}
						</a>
						----
					</template>
				</div>
			</div>
		</nav>

		<!-- Header -->
		<header class="p-4 mb-2 lg:border-none w-full mx-auto text-center">
			<a
				href="https://opendyslexic.org?utm_source=opendyslexic-chrome&utm_medium=referral"
				target="_blank"
				class="btn btn-ghost normal-case text-2xl mx-auto text-center"
			>
				OpenDyslexic
			</a>
		</header>

		<!-- Main Card -->
		<main class="p-4">
			<div
				class="card shadow-lg compact side bg-base-100 text-base-content"
			>
				<div class="card-body">
					<div class="flex my-4">
						<div class="flex-1">
							<h2 class="card-title font-normal text-lg">
								{{
									enable
										? $helperbird_i18n('on')
										: $helperbird_i18n('off')
								}}
							</h2>
						</div>

						<label>
							<input
								type="checkbox"
								class="toggle toggle-primary"
								v-model="enable"
								@change="save('enabled')"
							/>
							<span class="toggle-mark"></span>
						</label>
					</div>

					<div class="my-4">
						<div
							class="grid grid-cols-1 max-h-48 overflow-auto gap-2"
						>
							<template
								v-for="font in text.fonts"
								:key="font.title"
							>
								<button
									:class="[
										'btn',
										'flex',
										'items-center',
										'justify-between',
										'normal-case',
										'gap-2',
										'text-sm',
										'w-full',
										'text-left',
										`helperbird-font-${font.font}`,
										{
											'btn-active':
												font.title ===
												text.selectedFont.title
										}
									]"
									:aria-label="
										$helperbird_i18n(
											'change_font_to_x',
											text.selectedFont.title
										)
									"
									:title="
										$helperbird_i18n(
											'change_font_to_x',
											text.selectedFont.title
										)
									"
									type="button"
									@click="save('font', font)"
									@keyup.enter="save('font', font)"
								>
									{{ font.title }}
									<span
										v-if="
											font.title ===
											text.selectedFont.title
										"
										class="btn btn-circle btn-xs btn-active btn-success ml-auto"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 -960 960 960"
											class="h-4 w-4"
											fill="#ffffff"
										>
											<path
												d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"
											/>
										</svg>
									</span>
								</button>
							</template>
						</div>
					</div>
				</div>
			</div>
		</main>
	</div>
</template>

<script>
	import './index.css';

	export default {
		inject: ['$helperbird_i18n'],

		data() {
			return {
				paid: true,
				enable: null,
				adverts: [
					{
						href: 'https://www.patreon.com/opendyslexic',
						text: this.$helperbird_i18n('followAbbie')
					},
					{
						href: 'https://github.com/OpenDyslexic/extension',
						text: this.$helperbird_i18n('weAreOnGithub')
					},
					{
						href: 'https://www.x.com/opendyslexic',
						text: this.$helperbird_i18n('followDyslexicToolTip')
					},
					{
						href: 'https://addons.mozilla.org/en-US/firefox/addon/opendyslexic-for-firefox/',
						text: this.$helperbird_i18n('downloadOnFirefox')
					},
					{
						href: 'https://www.patreon.com/opendyslexic',
						text: this.$helperbird_i18n('created_by')
					},
					{
						href: 'https://discord.com/invite/wRfymbz2',
						text: this.$helperbird_i18n('bugs')
					},
					{
						href: 'https://www.helperbird.com',
						text: this.$helperbird_i18n('helperbird')
					},
					{
						href: 'https://www.coffeeandfun.com',
						text: this.$helperbird_i18n('followRobertJamesToolTip')
					},
					{
						href: 'https://chrome.google.com/webstore/detail/opendyslexic-for-chrome/cdnapgfjopgaggbmfgbiinmmbdcglnam/reviews',
						text: this.$helperbird_i18n('supportToolTip')
					}
				],
				font: 'regular',

				text: {
					selectedFont: {
						title: 'OpenDyslexic',
						font: 'regular'
					},
					fonts: [
						{ title: 'OpenDyslexic', font: 'regular' },
						{ title: 'OpenDyslexic Bold', font: 'bold' },
						{ title: 'OpenDyslexic Italic', font: 'italic' }
					]
				}
			};
		},

		mounted() {
			const SETTING_KEYS = ['font', 'enabled'];
			chrome.storage.local.get(SETTING_KEYS, (settings) => {
				const found = this.text.fonts.find(
					(f) => f.font === settings.font
				);
				if (found) {
					this.text.selectedFont = found;
				}
				this.enable = settings.enabled ? true : false;
			});
		},

		computed: {},

		methods: {
			sync(key, value) {
				const setting = {};
				setting[key] = value;
				chrome.storage.local.set(setting);
				return setting;
			},

			isEmpty(val) {
				return (
					val === undefined ||
					val === null ||
					val === '' ||
					val === 'undefined' ||
					val === 'null'
				);
			},

			toaster(config) {
				const msg = config.message || null;
				const type = config.type || 'info';

				if (this.isEmpty(msg)) {
					return false;
				}

				switch (type) {
					case 'success':
						this.$toast.info(msg);
						break;
					case 'error':
						this.$toast.error(msg);
						break;
					case 'info':
						this.$toast.info(msg);
						break;
					case 'warning':
						this.$toast.warning(msg);
						break;
					default:
						this.$toast.error(msg);
				}
			},

			save(featureID, selected) {
				switch (featureID) {
					case 'enabled':
						this.sync('enabled', this.enable);
						break;
					case 'font':
						if (!this.isEmpty(selected)) {
							this.text.selectedFont = selected;
							this.sync('font', this.text.selectedFont.font);
						}
						break;
				}

				this.toaster({
					message: this.$helperbird_i18n('saved'),
					type: 'success'
				});
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
		font-style: normal;
		font-weight: bold;
	}

	.helperbird-font-regular {
		font-style: normal;
		font-weight: normal;
	}

	@keyframes marquee {
		0% {
			/* Start from slightly off the right, or from 0 if you'd like it visible immediately */
			transform: translateX(0%);
		}
		100% {
			/* Move entirely to the left */
			transform: translateX(-100%);
		}
	}

	.animate-marquee {
		display: inline-block;
		animation: marquee 80s linear infinite; /* Adjust timing as needed */
		animation-delay: 0s; /* Explicitly no delay */
	}

	.animate-marquee:hover {
		animation-play-state: paused;
	}
</style>
