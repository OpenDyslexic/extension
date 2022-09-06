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
									@change="enableDyslexica"
								/>
								<span class="toggle-mark"></span>
							</div>
						</label>
					</div>
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
				</div>
			</div>
		</main>

		<footer>
			<div class="max-auto text-center p-6">
				<p
					class="text-base text-white mx-auto"
					v-bind:class="number === 1 ? 'block' : 'hidden'"
				>
					Support
					<a
						href="https://www.patreon.com/opendyslexic"
						target="_blank"
						class="text-white decoration-white no-underline hover:underline hover:text-white hover:decoration-wavy"
						><b>OpenDyslexic</b></a
					>
				</p>

				<p
					class="text-base text-white mx-auto"
					v-bind:class="
						number === 2 || number === 4 ? 'block' : 'hidden'
					"
				>
					Discover
					<a
						target="_blank"
						href="https://www.helperbird.com"
						class="text-white decoration-white no-underline hover:underline hover:text-white hover:decoration-wavy"
						><b>Helperbird</b></a
					>
				</p>

				<p
					class="text-base text-white mx-auto"
					v-bind:class="number === 3 ? 'block' : 'hidden'"
				>
					Review
					<a
						target="_blank"
						href="https://www.helperbird.com"
						class="text-white decoration-white no-underline hover:underline hover:text-white hover:decoration-wavy"
						><b>this extension</b></a
					>
				</p>
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
				font: 'regular',
				number: 1,
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
			this.number = this.randomIntFromInterval(1, 4);
		},
		methods: {
			fontChanged: function () {
				this.save('font', this.selectedFont.font);
			},

			randomIntFromInterval: function (min, max) {
				// min and max included
				return Math.floor(Math.random() * (max - min + 1) + min);
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

<style></style>
