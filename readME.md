## Hello-Lucy

### Streamlined off-line voice control for MM

### New and improved. More user friendly and more improvements to come.

## Special thanks
* sdetweil for unwavering support, instruction, error correction and amusing commentary.

## Acknowledgements
* cowboysdude for inspiration, modal column magic and audio support
* STRAWBERRY 3.141 for MMM-voice
* TheStigh for VoiceCommander

## From the original Hello-Lucy
* A short video of Hello-Lucy with Pages! https://youtu.be/bKHEXPzVb2A

## Custom Audio support
* The sounds you will have to create on your own. It's not that hard.

## Add any module to work with Hello-Lucy!
* Simplified process. See below.

## Very important Pi users!
* Read and perform the steps in the piAudioSetup.md file to set up your microphone.
* Your microphone should be working BEFORE the installation.
* Run `arecord -l` in your terminal. You need the card# and device# of your microphone/sound card for config entry.

## 3 Step Installation
### Please complete all 3

* `git clone https://github.com/mykle1/Hello-Lucy` into the ~/MagicMirror/modules directory
* `cd Hello-Lucy/installers`
* `bash dependencies.sh`

## Config options

```
{
disabled: false,
module: "Hello-Lucy",
position: "top_center",
config: {
    keyword: 'HELLO LUCY',              // keyword to activate listening for a command/sentence
    timeout: 15,                        // timeout listening for a command/sentence
    standByMethod: 'DPMS',              // 'DPMS' = anything else than RPi or 'PI'
    microphone: "0,0",                  // run "arecord -l" card # and device # mine is "0,0"
    sounds: ["1.mp3", "11.mp3"],        // welcome sound at startup. Add several for a random greetings
    confirmationSound: "ding.mp3",      // name and extension of sound file
    startHideAll: true,                 // All modules start as hidden EXCEPT PAGE ONE
    // *** Page One is your default startup page *** This overrides startHideAll: true,
    pageOneModules: ["Hello-Lucy","MMM-EasyPix"],                     // default modules to show on page one/startup
    pageTwoModules: ["Hello-Lucy", "MMM-BMW-DS", "MMM-EventHorizon"], // modules to show on page two
    pageThreeModules: ["Hello-Lucy", "MMM-Lunartic"],                 // modules to show on page three
    pageFourModules: ["Hello-Lucy", "MMM-PC-Stats"],                  // modules to show on page four
    pageFiveModules: ["Hello-Lucy", "MMM-Searchlight"],               // modules to show on page five
    pageSixModules: ["Hello-Lucy", "MMM-NOAA3"],                      // modules to show on page six
    pageSevenModules: ["Hello-Lucy", "MMM-Recipe"],                   // modules to show on page seven
    pageEightModules: ["Hello-Lucy", "MMM-rfacts"],                   // modules to show on page eight
    pageNineModules: ["Hello-Lucy", "MMM-History"],                   // modules to show on page nine
    pageTenModules: ["Hello-Lucy", "MMM-HardwareMonitor"]             // modules to show on page ten
    }
},
```
## StandBy options
| **Option** | **Default** | **Description** | **info** |
| --- | --- | --- | --- |
| `standByMethod` | OPTIONAL | | |
|        |          |'PI' |  use the tvservice command available on Raspberry pi to turn off the HDMI monitor source |
|  |  | 'DPMS' |  use the exec DMPS command to turn off the monitor source (not on pi, or not hdmi) (default) |
|  |  | 'HIDE' |  hide all module content, if display is on EnergyStar device that shows ugly 'no signal' screen for the other two choices |
| `startHidden` | true/false | whether at MagciMirror startup to hide all modules and show image | default=true |

## How to add any module you want for use with Hello-Lucy
* You can ask me to add them for you or follow the example directions below.
* If you are not comfortable modifying files it's best that I do it. :-)

* Otherwise, please read the "How to add modules to Hello-Lucy" file included with this repo.

### Future upgrades for Hello_Lucy will eliminate the need for any modifications by the user (That's you)

## Modules below that work by default
### Note: I can add modules for you. Usually, in less than 24 hours.

* alert
* clock
* calendar
* compliments
* currentweather
* newsfeed
* weatherforecast

* Hello-Lucy
* MMM-Advice
* MMM-AfterShip
* MMM-Astro
* MMM-ATM
* MMM-BMW-CC (ClimaCell)
* MMM-BMW-DS (Darksky)
* MMM-BMW-OW (OpenWeather Coming soon)
* MMM-CARDS
* MMM-Census
* MMM-Cocktails
* MMM-DailyQuotes
* MMM-DarkSkyForecast
* MMM-EARTH
* MMM-EarthWinds
* MMM-EasyBack
* MMM-EasyPix
* MMM-EventHorizon
* MMM-Events
* MMM-EveryNews
* MMM-EyeCandy
* MMM-FMI
* MMM-Fortune
* MMM-Gas
* MMM-Glock
* MMM-History
* MMM-Holiday
* MMM-ISS
* MMM-ISS-Live
* MMM-Insults
* MMM-JEOPARDY
* MMM-LICE
* MMM-Lottery
* MMM-Lunartic
* MMM-MARS
* MMM-MercuryInRetrograde
* MMM-MLB
* MMM-MLBStandings
* MMM-MusicCharts
* MMM-NASA
* MMM-NHL
* MMM-NiceThings
* MMM-NOAA3
* MMM-PC-Stats
* MMM-PetFinder
* MMM-PilotWX
* MMM-PLOW
* MMM-Recipe
* MMM-rfacts
* MMM-SORT
* MMM-SoundMachine
* MMM-SunRiseSet
* MMM-ToDoLive
* MMM-WeatherOrNot
