## Hello-Lucy

* A short video of Hello Lucy, now with Pages!

https://youtu.be/bKHEXPzVb2A

Hide/Show all or individual modules or pages of modules.
The sounds you will have to create on your own. It's not that hard.
Sounds are triggered by notifications between modules.

## Credit to Strawberry for MMM-voice

This enhancement was only possible because of his fine work.

## Mykle, this isn't really a module

That's true. I fully admit that but I did take the time to learn what I wanted to do
and then made all the enhancements to the modules. It was tremendously rewarding for
me and lots of fun and I learned quite a bit doing it. :-)

## Notice! 

All enhancements and testing were done on an old, Compaq Presario CQ57 Dual Core laptop 
with 4GB of Ram running ubuntu 16.04 LTS. Will it run on a Pi? Probably, but this old
dog of a PC runs it without a hitch and the response time is fantastic. The Pi may slow
rendering the animated gif. If so, use a static picture file, or none.

**ATTENTION PI USERS** The digital face file being used in Hello-Lucy was tested on a Pi3 (1/21/18).
The Pi struggles badly with it, bringing MM to its knees. So, please use a a non animated image, or none.
I will make an attempt to reduce the size and demands of the digital face file.

## Works immediately with these modules

* **calendar**        (default MM module)
* **clock**           (default MM module)
* **compliments**     (default MM module)
* **newsfeed**        (default MM module)
* **MMM-AfterShip**   (Track all your deliveries in one module)
* **MMM-Alarm-Clock** (I use this with alert module disabled and click button)
* **MMM-ATM**         (Another Trivia Module? Really?)
* **MMM-CARDS**       (Play 5 card stud poker against your mirror)
* **MMM-Census**      (World Population by age and sex, or by individual country)
* **MMM-Cocktails**   (How to make all kinds of mixed drinks)
* **MMM-EARTH**       (Realtime images of Earth from 1,000,000 miles away)
* **MMM-EasyBack**    (The easiest way to use background/desktop pictures on your mirror.)
* **MMM-EasyPix**     (Necessary for animated graphic and sound response)
* **MMM-EOL**         (The Encyclopedia of Life)
* **MMM-Events**      (Concerts, Sports, Theatre, coming to your city)
* **MMM-EyeCandy**    (Pretty damn cool)
* **MMM-Fortune**     (A fortune cookie on your mirror)
* **MMM-JEOPARDY**    (The widely popular gameshow on your mirror)
* **MMM-LICE**        (Live International Currency Exchange)
* **MMM-Lottery**     (Random Lottery Numbers)
* **MMM-Lunartic**    (Lunar information and graphics)
* **MMM-NASA**        (Your universe in a single module)
* **MMM-NEO**         (Near Earth Objects passing by this week. Be afraid. Be VERY afraid!)
* **MMM-NOAA**        (MM's most popular weather module)
* **MMM-PC-Stats**    (For PC boards running MM. Works with ubuntu)
* **MMM-PetFinder**   (Pets for adoption in your area. All kinds.)
* **MMM-PilotWX**     (Conditions and Weather for Pilots)
* **MMM-rfacts**      (Random Facts module. Informative and fun!)
* **MMM-SORT**        (Static Or Rotating Tides module, worldwide)
* **MMM-SunRiseSet**  (Spherical or Day/Night map of planet Earth)
* **MMM-voice**       (of course)
* **MMM-WunderGround**

Remember to replace the respective module.js files with the ones provided here.

## Add any module to work with Hello Lucy!

I've commented the enhanced files, telling you what you need to do
if you want to use this with any other module. One enhancement for each module
you want to use, one to the NEW node helper of MMM-voice and two to the new MMM-voice.js 
(sentences array and notification). See directions below.

## You want pages controlled by voice commands?

You've come to the right place. By default, this enhancement has four page commands.
* **SHOW PAGE ONE**, **HIDE PAGE ONE**, **SHOW PAGE TWO** and **HIDE PAGE TWO**

These page commands work with the modules listed above if you install and enable them.
With the pages commands you can have multiple module sets hide and show with a single voice command. 
Set up your own page commands for everyone you love. Everyone gets their own page commands 
that hide and show only the module sets that interest them. How cool is that? :-)

Directions for creating your own pages of modules can be found below.

## Installation. Pay Attention!

* You MUST install MMM-voice first and get that running
https://github.com/fewieden/MMM-voice

* Clone this repo

* Replace the MMM-voice.js, MMM-voice.css and the node helper.js in the MMM-voice module folder.
I've provided the enhanced files in this repo.

* Install any or all of the modules listed above for immediate use with this enhancement

* Replace respective module.js files with the module.js files in this repo

* Put the face.gif in the modules/MMM-EasyPix/pix folder. I've provided a 25MB version

* Pi users put the Lucy.png files in the modules/MMM-EasyPix/pix folder

* Original animated gif can be gotten here. It's 60+ MB. 
https://github.com/HackerHouseYT/AI-Smart-Mirror/blob/master/magic_mirror/aiclient/face.gif
and place it in the modules/MMM-EasyPix/pix folder and change your config entry for
MMM-EasyPix to use it. Pi users should use a static image or a less demanding animated gif.

## How to add any module you want for use with Hello-Lucy

The modules listed above work without you changing anything.

* Open the module.js file that you want to use. Example MMM-EARTH.js

* After the }, after the return wrapper
```
        return wrapper;
    }, <-- AFTER THIS ADD THE FUNCTION BELOW AND CHANGE EARTH(x2) TO YOUR WORD
    
    /////  Add this function to the modules you want to control with voice //////

    notificationReceived: function(notification, payload) {
        if (notification === 'HIDE_EARTH') {
            this.hide();
        }  else if (notification === 'SHOW_EARTH') {
            this.show(1000);
        }
            
    },
```

* Now open the new node helper that you put in the MMM-voice folder
Add this at about line 429  (it should be a blank line) and change EARTH(x4) to your word

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

* Now go to about line 431 (it should be blank)
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

## How to add Pages of modules

At about line 443 in the new node helper of MMM-voice you'll see this:
```
/////////  Pages commands @ Mykle ///////////////////////////		
		else if (/(SHOW)/g.test(data) && /(PAGE)/g.test(data) && /(ONE)/g.test(data)) {
            this.sendSocketNotification('SHOW_PAGE_ONE');
        } else if (/(HIDE)/g.test(data) && /(PAGE)/g.test(data) && /(ONE)/g.test(data)) {
            this.sendSocketNotification('HIDE_PAGE_ONE');
        }
```

You have to add one of these for every page your create. Change the page numbers!

At about line 116 in the new MMM-voice.js file you'll need to add your sentence. In this case:
```
'HIDE PAGE ONE',
'SHOW PAGE ONE',
```

Still in the new MMM-voice.js file at about line 370 you'll need to add your set of modules for
the page you just created. In this case, it looks like this:
```
		 else if (notification === 'SHOW_PAGE_ONE') {
			 this.sendNotification('HIDE_LUCY');
			 this.sendNotification('SHOW_LOTTERY');
			 this.sendNotification('SHOW_CLOCK');
			 this.sendNotification('SHOW_EARTH');
			 this.sendNotification('SHOW_LICE');
			 this.sendNotification('SHOW_COWBOY');
			 this.sendNotification('SHOW_TIDES');
			 this.sendNotification('SHOW_VOICE');
			 
		 } else if (notification === 'HIDE_PAGE_ONE') {
			 this.sendNotification('HIDE_LOTTERY');
			 this.sendNotification('HIDE_CLOCK');
			 this.sendNotification('HIDE_EARTH');
			 this.sendNotification('HIDE_LICE');
			 this.sendNotification('HIDE_COWBOY');
			 this.sendNotification('HIDE_TIDES');
			 this.sendNotification('HIDE_VOICE');
			 
		 }
```

## Set your keyword in your config.js entry for MMM-voice

Mine is `keyword: 'HELLO LUCY',`. When you speak your keyword, the microphone
icon of MMM-voice will begin to flash(pulse). During this time you can issue
your voice commands. Default is 15 seconds. After each successful command the
15 seconds begins again. When the microphone stops flashing you'll have to speak
your keyword again in order to issue new commands.

## Who is Lucy and where does stuff go?

Well, my granddaughter's name is Lucy, so I chose her name for this project.

The animation (face.gif) is being displayed by MMM-EasyPix and resides in the 
modules/MMM-EasyPix/pix folder along with another one of my favorites (2.gif). 

The greeting sound file is in the modules/MMM-EasyPix/sounds folder. 
You can replace this with any sound that you choose.
Any other sounds you want to use can also be placed in this directory and
triggered by notification through the EasyPix module itself.


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

## Voice commands for the default modules in Hello-Lucy
```
			'HIDE ALARM',     'SHOW ALARM',      for MMM-Alarm-Clock
			'HIDE BACKGROUND','SHOW BACKGROUND', for MMM-EasyBack
			'HIDE CALENDAR',  'SHOW CALENDAR',   for default MM calendar module
			'HIDE CARDS',     'SHOW CARDS',
			'HIDE CENSUS',    'SHOW CENSUS',   
			'HIDE CLOCK',     'SHOW CLOCK',      for default MM clock module
			'HIDE COCKTAILS', 'SHOW COCKTAILS',
			'HIDE COMPLIMENTS', 'SHOW COCKTAILS',
			'HIDE COWBOY',    'SHOW COWBOY',     for MMM-NOAA
			'HIDE DARWIN',    'SHOW DARWIN',     for MMM-EOL (The Encyclopedia of Life)
			'HIDE EARTH',     'SHOW EARTH',
			'HIDE EYECANDY',  'SHOW EYECANDY',
			'HIDE EVENTS',    'SHOW EVENTS',
			'HIDE FAX',       'SHOW FAX',        for MMM-rfacts
			'HIDE FORTUNE',   'SHOW FORTUNE',
			'HIDE JEOPARDY',  'SHOW JEOPARDY',
			'HIDE LICE',      'SHOW LICE',
			'HIDE LOTTERY',   'SHOW LOTTERY',
			'HIDE LUCY',      'SHOW LUCY', 
			'HIDE MODULES',   'SHOW MODULES',    for ALL modules
			'HIDE MOON',      'SHOW MOON',       for MMM-Lunartic
            		'HIDE NASA',      'SHOW NASA',
			'HIDE NEO',       'SHOW NEO',
			'HIDE NEWS',      'SHOW NEWS',
			'HIDE PAGE ONE',  'SHOW PAGE ONE',   for example page
			'HIDE PAGE TWO',  'SHOW PAGE TWO',   for example page
			'HIDE PAGE THREE','SHOW PAGE THREE', for example page
			'HIDE PETFINDER', 'SHOW PETFINDER',
			'HIDE PICTURES',  'SHOW PICTURES',   for MMM-ImageSlideshow
            		'HIDE PILOTS',    'SHOW PILOTS',     for MMM-PilotWX
			'HIDE SHIPPING',  'SHOW SHIPPING',   for MMM-AfterShip
			'HIDE STATS',     'SHOW STATS',      for MMM-PC-Stats
			'HIDE SUNRISE',   'SHOW SUNRISE',    for MMM-SunRiseSet
            		'HIDE TIDES',     'SHOW TIDES',      for MMM-SORT
			'HIDE TRIVIA',    'SHOW TRIVIA',     for MMM-ATM
			'HIDE VOICE',     'SHOW VOICE',
            		'HIDE WEATHER',   'SHOW WEATHER',    for MMM-WunderGround
			'PLEASE WAKE UP', 'GO TO SLEEP',     for turning on and off display (standby)
     		        'OPEN HELP',      'CLOSE HELP',      Now working thanks to Cowboysdude
```

## Peace
