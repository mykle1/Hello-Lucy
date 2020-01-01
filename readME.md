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

## Installation

* `git clone https://github.com/mykle1/Hello-Lucy` into the ~/MagicMirror/modules directory
* `cd modules/Hello-Lucy/installers`
* `bash dependencies.sh`

## Config options

```
{
disabled: false,
module: "Hello-Lucy",
position: "top_right",
config: {
  keyword: 'HELLO LUCY',               // MUST BE CAPITALS to make Lucy start listening
  timeout: 15,                        // timeout listening for a command/sentence
  defaultOnStartup: 'Hello-Lucy',
  standByMethod: 'DPMS',              // 'DPMS' = anything else than RPi or 'PI'
  sounds: ["1.mp3", "11.mp3"],        // welcome sound at startup. Add several for a random choice of welcome sound
  startHideAll: true,                 // if true, all modules start as hidden
  pageOneModules: ["Hello-Lucy", "MMM-Insults"],    // default modules to show on page one/startup
  pageTwoModules: ["MMM-BMW-DS", "MMM-Events"],     // modules to show on page two
  pageThreeModules: ["MMM-Lunartic"],               // modules to show on page three
  pageFourModules: ["MMM-PC-Stats"],                // modules to show on page four
  pageFiveModules: [],                              // modules to show on page five
  pageSixModules: [],                               // modules to show on page six
  pageSevenModules: [],                             // modules to show on page seven
  pageEightModules: [],                             // modules to show on page eight
  pageNineModules: [],                              // modules to show on page nine
  pageTenModules: []                               // modules to show on page ten
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

As of right now you have to make additions to 2 files in the Hello-Lucy folder.
(1) sentences.json file.
Example: Add your commands to the sentences array:
```
"HIDE ALARM",
"SHOW ALARM",
```
(2) checkCommands.json file.
Example: Add your commands to the modOp array:
```
{"wordOne":"SHOW","wordTwo":"ALARM","wordThree":"","wordFour":"","toShow":"true","moduleName":"MMM-AlarmClock","sendNoti":""},
{"wordOne":"HIDE","wordTwo":"ALARM","wordThree":"","wordFour":"","toShow":"false","moduleName":"MMM-AlarmClock","sendNoti":""},
```
* The command word after HIDE or SHOW can be any word you like.
* The module you name in "moduleName" will now be controlled by Hello-LUCY

### Future upgrades for Hello_Lucy will eliminate the need for any modifications by the user (That's you)

## Modules below that work by default
### Note: I can add modules for you. Usually, in less than 24 hours.

* alert
* MMM-EasyBack
* calendar
* MMM-CARDS
* MMM-Census
* clock
* MMM-Glock
* MMM-Cocktails
* compliments
* MMM-EARTH
* MMM-EarthWinds
* MMM-Events
* MMM-EyeCandy
* MMM-Fortune
* MMM-Gas
* MMM-History
* MMM-Astro
* MMM-Insults
* MMM-JEOPARDY
* MMM-LICE
* MMM-Lottery
* MMM-EasyPix
* MMM-MARS
* MMM-Lunartic
* MMM-NASA
* newsfeed
* MMM-PetFinder
* MMM-PilotWX
* MMM-FMI
* MMM-DailyQuotes
* MMM-ToDoLive
* MMM-AfterShip
* MMM-ISS
* MMM-ISS-Live
* MMM-PC-Stats
* MMM-SoundMachine
* MMM-SunRiseSet
* MMM-SORT
* MMM-EventHorizon
* MMM-ATM
* Hello-Lucy
* MMM-BMW-DS
* MMM-NOAA3
