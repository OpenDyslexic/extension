
![alt text](.github/readme.png "OpenDyslexic")



# About 

Open-Dyslexic is an open sourced font created to increase readability for readers with dyslexia. This extension overrides all fonts on webpages with the OpenDyslexic font, and formats pages to be more easily readable. 

Your brain can sometimes do funny things to letters. OpenDyslexic tries to help prevent some of these things from happening. Letters have heavy weighted bottoms to add a kind of "gravity" to each letter. You are able to quickly figure out which part of the letter is down because of this feature. It aids in recognizing the correct letter, and sometimes helps to keep your brain from rotating them around. Consistently weighted bottoms can also help reinforce the line of text. The unique shapes of each letter can help prevent confusion through flipping and swapping.

Open-Dyslexic has recently received favorable coverage from the [BBC](http://bbc.com/news/technology-19734341), and is included in many iOS and Android apps. 

Unlike many other dyslexia or DRD typefaces, OpenDyslexic is completely free for individuals, companies, schools, and in short: everyone. 




# Set up

**Prerequisites:** [Node](http://nodejs.org/) and the following global node modules:  gulp (if you have none of these modules, just run npm run global-deps).
- Clone this repo locally ``` git clone  https://github.com/antijingoist/opendyslexic-chrome```
- Open up either terimal or CMD
- Naviagte to the repo 
- Run the following command inside the repo ```npm install```
- Then run ```gulp build```, which build all javascript and css.



# Install

- See set up first
- Open up Google chrome
- Go the Google Chrome Settings
- Go to extensions
- Click enable developer mode.
- Load unpackaged extensions.
- Pick the opendyslexic-chrome folder.


# Build Files

- Open up command line or termial
- Naviagate to the opendyslexic-chrome folder
- Run ```npm install ```
- Then ``` gulp build ```
- This will create a folder called dist and compress all css, and javascript :)


# Important Notes

- system.js handles the turning on and off of the font on the page
- core.js handles the button click using angler.js
- Gulp Watch will be added in soon.

# Screenshots

## Before

![Display of icon for chrome](https://github.com/antijingoist/opendyslexic-chrome/blob/master/.github/images/before.png)

## After

![Display of icon for chrome](https://github.com/antijingoist/opendyslexic-chrome/blob/master/.github/images/after.png)


