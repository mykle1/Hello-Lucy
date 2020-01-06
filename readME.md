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

## 3 Step Installation
### Please complete all 3

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
  confirmationSound: "ding.mp3",      // when command is accepted. use your own or default, name and extension of sound file
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

* Otherwise, please read the "How to add modules to Hello-Lucy" file included with this repo.

### Future upgrades for Hello_Lucy will eliminate the need for any modifications by the user (That's you)

## Modules below that work by default
### Note: I can add modules for you. Usually, in less than 24 hours.

* alert
* clock
* calendar
* compliments
* newsfeed

* Hello-Lucy
* MMM-AfterShip
* MMM-Astro
* MMM-ATM
* MMM-BMW-DS
* MMM-CARDS
* MMM-Census
* MMM-Cocktails
* MMM-DailyQuotes
* MMM-EARTH
* MMM-EarthWinds
* MMM-EasyBack
* MMM-EventHorizon
* MMM-Events
* MMM-EyeCandy
* MMM-FMI
* MMM-Fortune
* MMM-Gas
* MMM-Glock
* MMM-History
* MMM-ISS
* MMM-ISS-Live
* MMM-Insults
* MMM-JEOPARDY
* MMM-LICE
* MMM-Lottery
* MMM-EasyPix
* MMM-MARS
* MMM-Lunartic
* MMM-NASA
* MMM-NOAA3
* MMM-PC-Stats
* MMM-PetFinder
* MMM-PilotWX
* MMM-SORT
* MMM-SoundMachine
* MMM-SunRiseSet
* MMM-ToDoLive





