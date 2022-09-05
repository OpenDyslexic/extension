<template>
	<div class="viewport red h-full">
		<!-- This example requires Tailwind CSS v2.0+ -->
		<header>
			<nav class="mx-auto max-w-7xl p-2" aria-label="Top">
				<div class="flex w-full lg:border-none p-4">
					<a
						href="https://opendyslexic.org?utm_source=opendyslexic-chrome&utm_medium=referral"
						target="_blank"
						class="btn btn-ghost normal-case text-4xl mx-auto"
					>
						OpenDyslexic
					</a>
				</div>
			</nav>
		</header>

		<main class="grid grid-cols-6 gap-4 m-4 h-full">
			<div
				class="card shadow-lg compact side bg-base-100 text-base-content col-span-6"
			>
				<div class="card-body">
					<h2 class="card-title">{{
						$helperbird_i18n('options')
					}}</h2>

					<div class="flex mb-8 mt-4">
						<div class="flex-0 mr-4">
							<h2 class="card-title font-normal">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="inline-block w-6 h-6 fill-current"
									viewBox="0 0 24 24"
								>
									<path d="M0 0h24v24H0V0z" fill="none" />
									<path
										d="M9.93 13.5h4.14L12 7.98zM20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-4.05 16.5l-1.14-3H9.17l-1.12 3H5.96l5.11-13h1.86l5.11 13h-2.09z"
									/>
								</svg>
								{{ $helperbird_i18n('options') }}
							</h2>
						</div>

						<div class="flex-1">
							<div>
								<v-select
									label="title"
									:searchable="searchable"
									:clearable="clearable"
									v-bind:options="fonts"
									append-to-body
									@input="fontChanged"
									v-model="selectedFont"
								>
								</v-select>
							</div>
						</div>
					</div>

					<div class="flex mb-8 mt-4">
						<div class="flex-1">
							<h2 class="card-title font-normal">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="inline-block w-6 h-6 fill-current"
									viewBox="0 0 24 24"
								>
									<path d="M0 0h24v24H0V0z" fill="none" />
									<path
										d="M9.93 13.5h4.14L12 7.98zM20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-4.05 16.5l-1.14-3H9.17l-1.12 3H5.96l5.11-13h1.86l5.11 13h-2.09z"
									/>
								</svg>
								{{ $helperbird_i18n('fontColorLabel') }}
							</h2>
						</div>

						<label class="flex-0">
							<div>
								<input
									type="checkbox"
									checked="checked"
									class="toggle toggle-primary"
									v-model="enable"
									@change="enableDyslexica"
								/>
								<span class="toggle-mark"></span>
							</div>
						</label>
					</div>
				</div>
			</div>
		</main>

		<footer>
			<div
				class="max-w-7xl mx-auto py-4 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8"
			>
				<div class="carousel w-full pointer-events-none">
					<div id="slide1" class="carousel-item relative w-full">
						<p class="text-base text-white mx-auto">
							Support
							<a
								href="https://www.patreon.com/opendyslexic"
								target="_blank"
								class="text-white decoration-white no-underline hover:underline hover:text-white hover:decoration-wavy"
								><b>OpenDyslexic</b></a
							>
						</p>
						<div
							class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2"
						>
							<a href="#slide2" class="btn btn-circle">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="w-6 h-6"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M15.75 19.5L8.25 12l7.5-7.5"
									/>
								</svg>
							</a>
							<a href="#slide2" class="btn btn-circle">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="w-6 h-6"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M8.25 4.5l7.5 7.5-7.5 7.5"
									/>
								</svg>
							</a>
						</div>
					</div>
					<div id="slide2" class="carousel-item relative w-full">
						<p class="text-base text-white mx-auto">
							Powered by
							<a
								target="_blank"
								href="https://www.helperbird.com"
								class="text-white decoration-white no-underline hover:underline hover:text-white hover:decoration-wavy"
								><b>Helperbird</b></a
							>
						</p>
						<div
							class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2"
						>
							<a href="#slide1" class="btn btn-circle">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="w-6 h-6"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M15.75 19.5L8.25 12l7.5-7.5"
									/>
								</svg>
							</a>
							<a href="#slide1" class="btn btn-circle">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="w-6 h-6"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M8.25 4.5l7.5 7.5-7.5 7.5"
									/>
								</svg>
							</a>
						</div>
					</div>
				</div>
			</div>
		</footer>
	</div>
</template>

<script>
	import './index.css';

	export default {
		inject: ['$helperbird_i18n', 'sendToContentScript'],
		data: function () {
			return {
				paid: true,
				enable: null,
				font: 'lexend',

				menuVisible: false,
				currentFont: null,
				searchable: false,
				clearable: false,
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
			};
		},

		mounted: function () {
			const SETTING_KEYS = ['font', 'enabled'];
			chrome.storage.sync.get(SETTING_KEYS, (settings) => {
				let findFont = this.fonts.find((o) => o.font === settings.font);

				this.selectedFont = findFont ? findFont : this.selectedFont;

				this.enable = settings.enabled ? true : false;

				return this.enable;
			});
		},
		methods: {
			fontChanged: function () {
				this.save('font', this.selectedFont.font);
			},

			save(token, type) {
				let setting = {};
				setting[token] = type;
				chrome.storage.sync.set(setting);
				return setting;
			},

			enableDyslexica() {
				// Dont change the settings if its the same or no past

				this.save('enabled', this.enable);
			}
		}
	};
</script>

<style scoped>
	.viewport,
	body {
		width: 400px;
		max-width: 100%;
		max-height: 400px;
	}

	.red {
		color: #fff !important;
	}
</style>
