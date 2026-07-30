<p align="center">
  <a href="https://wwww.opendyslexic.org" target="_blank" rel="noopener noreferrer">
    <img width="750" src="./app/assets/images/readme.png" alt="OpenDyslexic logo">
  </a>
</p>

## 🌍 Translating OpenDyslexic

All user-facing text lives in `app/_locales/<locale>/messages.json`. English (`app/_locales/en/messages.json`) is the source of truth — every other locale is a translation of it.

Translations are contributed by hand (or with the help of an LLM, using the prompt below). There is no automated translation script.

## 🗂️ How the files work

This is the standard [browser extension i18n format](https://developer.chrome.com/docs/extensions/reference/api/i18n). Each entry looks like:

```json
{
	"addSite": {
		"message": "Add",
		"description": "Button that adds the typed website to the excluded list"
	}
}
```

- **Key** (`addSite`) — referenced from the code. **Never translate or rename a key.**
- **`message`** — the text users see. **This is the only field you translate.**
- **`description`** — a note for developers. Users never see it. Leave it in English.
- **`placeholders`** — dynamic values injected at runtime. See below.

### Placeholders

Two messages contain runtime values, written as `$NAME$` in the message:

```json
{
	"change_font_to_x": {
		"message": "Change font to $FONT$",
		"description": "Aria-label and tooltip for each font selector button. $FONT$ is the human-readable font title.",
		"placeholders": {
			"font": {
				"content": "$1",
				"example": "OpenDyslexic Bold"
			}
		}
	}
}
```

Keep `$FONT$` and `$SITE$` **exactly as-is** (uppercase, wrapped in `$`). You may move them within the sentence so the result reads naturally in your language, but never rename, translate, or delete them. Leave the whole `placeholders` block untouched.

## 🤖 Translation prompt

Copy the prompt below into an LLM, replace `<LANGUAGE>` and `<LOCALE>`, and paste in the contents of `app/_locales/en/messages.json`.

````text
You are translating the UI strings for OpenDyslexic, a browser extension that
replaces webpage fonts with the OpenDyslexic typeface to help people with
dyslexia read more comfortably.

Translate the JSON below from English into <LANGUAGE> (locale code: <LOCALE>).

Rules:
1. Translate ONLY the "message" values. Nothing else.
2. Keep every JSON key exactly as-is — keys are referenced from code.
3. Keep the "description" fields in English, unchanged. They are developer
   notes and are never shown to users.
4. Leave any "placeholders" blocks completely unchanged.
5. Preserve placeholder tokens such as $FONT$ and $SITE$ verbatim (uppercase,
   wrapped in dollar signs). You may reposition a token within the sentence so
   it reads naturally, but never rename, translate, or remove it.
6. Do NOT translate these — they are brand names or literal examples:
   - "OpenDyslexic" (and variants like "OpenDyslexic Bold")
   - "Helperbird"
   - "example.com"
   The appName / appNameEdge / appNameFirefox values should keep the word
   "OpenDyslexic" and translate only the surrounding words, e.g.
   "OpenDyslexic for Chrome".
7. This is accessibility software. Prefer clear, plain, everyday wording over
   formal or technical phrasing. Several strings are screen-reader labels, so
   they must describe the action plainly.
8. Keep translations short. They sit in a narrow popup, and long strings will
   be clipped.
9. Match the source punctuation style — if the English ends in a full stop,
   so should the translation.
10. Return the complete, valid JSON file and nothing else. No commentary, no
    markdown fences. Indent with tabs to match the repository style.

Here is the English source:

```json
<PASTE THE CONTENTS OF app/_locales/en/messages.json HERE>
```
````

## ✅ Before opening a pull request

- Save the result as `app/_locales/<locale>/messages.json`.
- Confirm the file is valid JSON and has the same keys as `en`:

```bash
node -e "const en=require('./app/_locales/en/messages.json'),t=require('./app/_locales/LOCALE/messages.json'),m=Object.keys(en).filter(k=>!(k in t));console.log(m.length?'Missing: '+m.join(', '):'All keys present')"
```

- Check the popup renders correctly. Load the unpacked extension (see the [README](./README.md)), then set your browser's display language to your locale.

## 🈳 Locales currently in the repo

58 locales are present:

```
af ar bg bn bs ca cs cy da de el en es et fa fi fil fr ga gu he hi hr hu hy
id it ja ka kn ko lt lv mk ml mr ms nb nl no pl pt pt-PT ro ru sk sl sq sr
sv sw te th tr uk vi zh zu
```

All 58 locales carry the full set of 58 keys, so there are no English fallbacks in the popup. Use this to confirm that stays true after adding a key to `en`:

```bash
node -e "const fs=require('fs'),en=Object.keys(require('./app/_locales/en/messages.json'));let bad=[];for(const l of fs.readdirSync('./app/_locales')){const k=Object.keys(require('./app/_locales/'+l+'/messages.json'));const m=en.filter(x=>!k.includes(x));if(m.length)bad.push(l+' ('+m.length+')')}console.log(bad.length?'Incomplete: '+bad.join(', '):'All locales complete')"
```

### 🔍 Which strings are live

Only **28 of the 58 keys are referenced** by the code or the manifests. The other 30 (`fontColorLabel`, `googleDocsTooltip`, `featureTint`, `reviews`, `websiteLabel` and similar) are leftovers from an earlier version of the popup. They are still translated, but nobody sees them, so don't spend effort polishing them — and check `git grep` before assuming a key is live.

The 28 live keys have been reviewed and rewritten across all 58 locales. The 30 dead ones are still raw output from the old automated script and have never been reviewed.

### ⚠️ What the old automated translations got wrong

Worth knowing, because the same traps apply to any new locale:

- **Standalone words were translated by dictionary sense, not by role.** `On` and `Off` label a toggle, but they came out as prepositions in over twenty locales — French "Sur", Japanese "の上" ("on top of"), Russian "На", Chinese "在"/"离开" ("leave"), Korean "~에" (a grammatical particle), Serbian "Он" ("he").
- **Brand names were transliterated.** 34 locales lost at least one. Serbian was the worst: "Цхроме" for "Chrome" — a letter-by-letter transliteration that reads nothing like the product.
- **Tense and part of speech drifted.** "Settings Applied" (a confirmation) became a noun phrase or present continuous in several locales, and Welsh had "Gosodiadau Cymhwysol" — "applicable settings".

Keep product names (`OpenDyslexic`, `Chrome`, `Firefox`, `Edge`, `Github`, `Discord`, `Helperbird`, `X`) and the credited people (`Abbie Gonzalez`, `Robert James Gabriel`) in Latin script, exactly as in `en`. Attach your language's grammatical particles around them rather than respelling them.
