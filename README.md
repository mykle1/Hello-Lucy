## HELLO-LUCY

A poor man's Alexa. Hide/Show all or individual modules using MMM-voice.
The sounds you will have to create on your own. It's not that hard.
Sounds are triggered by notifications between modules.

## Credit to Strawberry for MMM-voice

This "hack" was only possible because of his fine work.

## Mykle, this isn't really a module

That's true. I fully admit that but I did take the time to learn what I wanted to do
and then made all the enhancements to the modules. It was tremendously rewarding for
me and lots of fun and I learned quite a bit doing it. :-)

## Notice!

All enhancements and testing were done on an old, Compaq Presario CQ57 Dual Core laptop 
with 4GB of Ram running ubuntu 16.04 LTS. Will it run on a Pi? Probably, but this old
dog of a PC runs it without a hitch and the response time is fantastic.

## Works immediately with these modules after replacing module.js files

* clock           (default module)
* MMM-Alarm-Clock (I use this with alert module disabled and click button)
* MMM-EARTH       (Realtime images of Earth from 1,000,000 miles away)
* MMM-EasyPix     (necessary for animated graphic and sound response)
* MMM-EyeCandy    (Pretty damn cool)
* MMM-LICE        (Live International Currency Exchange)
* MMM-Lottery     (Random Lottery Numbers)
* MMM-Lunartic    (Lunar information and graphics)
* MMM-NOAA        (MM's most popular weather module)
* MMM-PilotWX     (Conditions and Weather for Pilots)
* MMM-SORT        (Worldwide tides module)
* MMM-voice       (of course)
* MMM-WunderGround

Remember to replace the respective module.js files with the ones provided here.

## Add any module you want to use this with

I've commented the enhanced files, telling you what you need to do
if you want to use this with any other module. One enhancement for each module
you want to use, one to the NEW node helper and two to the MMM-voice.js 
(sentences array and notification)

## Installation. Pay Attention!

* You MUST install MMM-voice first and get that running
https://github.com/fewieden/MMM-voice

* Replace the MMM-voice.js and the node helper.js in the MMM-voice module folder.
I've provided the enhanced files in this repo.

* Install the modules listed above for immediate use with this "hack"

* Replace respective module.js files with the module.js files in this repo

## How to add any module for use with this "hack"

* Open the module.js file that you want to use. Example MMM-EARTH

* After the }, after the return wrapper
```
        return wrapper;
    }, <-- AFTER THIS ADD THE FUNCTION BELOW AND CHANGE EARTH(x2) TO YOUR WORD
    
    /////  Add this function to the modules you want to control with voice //////

    notificationReceived: function(notification, payload) {
        if (notification === 'HIDE_EARTH') {
            this.hide(1000);
            this.updateDom(300);
        }  else if (notification === 'SHOW_EARTH') {
            this.show(1000);
            this.updateDom(300);
        }
            
    },
```

* Now open the new node helper that you put in the MMM-voice folder
Add this on line 429 (it should be a blank line) and change EARTH(x4) to your word

```
else if (/(SHOW)/g.test(data) && /(EARTH)/g.test(data)) {
            this.sendSocketNotification('SHOW_EARTH');
        } else if (/(HIDE)/g.test(data) && /(EARTH)/g.test(data)) {
            this.sendSocketNotification('HIDE_EARTH');
        }
```

* Now open the new MMM-voice.js file that you put in your MMM-voice folder
Add this to the sentences array starting at line 54
Change EARTH (x2) with your command word
```
'HIDE EARTH',
'SHOW EARTH',
```

* Now go to line 431 (it should be blank)
Add this and change EARTH (x6) to your word

```
        // MMM-voice sends notification to MMM-EARTH to HIDE
        else if (notification === 'HIDE_EARTH') {
             this.sendNotification('HIDE_EARTH');
        }
    
        // MMM-voice sends notification to MMM-EARTH to SHOW
        else if (notification === 'SHOW_EARTH') {
             this.sendNotification('SHOW_EARTH');
        }
```

## Set your keyword in your config.js entry for MMM-voice

Mine is `keyword: 'HELLO LUCY',`. When you speak your keyword, the microphone
icon of MMM-voice will begin to flash(pulse). During this time you can issue
your voice commands. Default is 15 seconds. After each successful command the
15 seconds begins again. When the microphone stops flashing you'll have to speak
your keyword again in order to issue new commands.

## Old Dual Core laptop beats Quad Core i7 desktop dev machine

You read that right. There is a noticable difference in response time when issuing
voice commands and the old laptop wins! Why? This is my guess. The laptop uses an 
integrated microphone. The desktop uses a USB microphone. I believe there is some
latency with the USB microphone, whereas the integrated microphone of the laptop
has none, or much less than the USB microphone. This may become more pronounced if 
you attempt this on a Pi.

## That should do it

Remember, this is a hack. It could have been done more elegantly and concisely
by someone with more experience. I have virtually none. I just wanted to prove
to myself that I could accomplish what I set out to do. In doing so I learned
quite a bit about how things work within MM and now I have something cool that I 
managed by myself. :-)

## Hint

Some modules are larger than others. For instance, MMM-PilotWX and MMM-NOAA.
I set these two to the same postion (top left) but only show one at a time.
In this way you can have many modules loaded and occupying the same position 
but only show certain ones at certain times.

## Peace
