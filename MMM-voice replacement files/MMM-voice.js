/**
 * @file MMM-voice.js
 *
 * @author fewieden
 * @license MIT
 *
 * @see  https://github.com/fewieden/MMM-voice
 */

/* global Module Log MM */

/**
 * @external Module
 * @see https://github.com/MichMich/MagicMirror/blob/master/js/module.js
 */

/**
 * @external Log
 * @see https://github.com/MichMich/MagicMirror/blob/master/js/logger.js
 */

/**
 * @external MM
 * @see https://github.com/MichMich/MagicMirror/blob/master/js/main.js
 */

/**
 * @module MMM-voice
 * @description Frontend for the module to display data.
 *
 * @requires external:Module
 * @requires external:Log
 * @requires external:MM
 */
Module.register('MMM-voice', {

    /** @member {string} icon - Microphone icon. */
    icon: 'fa-microphone-slash',
    /** @member {boolean} pulsing - Flag to indicate listening state. */
    pulsing: true,
    /** @member {boolean} help - Flag to switch between render help or not. */
    help: false,

    /**
     * @member {Object} voice - Defines the default mode and commands of this module.
     * @property {string} mode - Voice mode of this module.
     * @property {string[]} sentences - List of voice commands of this module.
     */


///////////// Add your commands to the sentences array below ///////////////////
    voice: {
        mode: 'VOICE',
        sentences: [
      'HIDE ALARM',
      'SHOW ALARM',
      'HIDE BACKGROUND',
      'SHOW BACKGROUND',
      'HIDE CALENDAR',
      'SHOW CALENDAR',
      'HIDE CARDS',
      'SHOW CARDS',
      'HIDE CENSUS',
      'SHOW CENSUS',
      'HIDE CLOCK',
      'SHOW CLOCK',
      'HIDE COCKTAILS',
      'SHOW COCKTAILS',
      'HIDE COMPLIMENTS',
      'SHOW COMPLIMENTS',
      'HIDE COWBOY',
      'SHOW COWBOY',
      'HIDE DARWIN',
      'SHOW DARWIN',
      'HIDE EARTH',
      'SHOW EARTH',
      'HIDE EYECANDY',
      'SHOW EYECANDY',
      'HIDE EVENTS',
      'SHOW EVENTS',
      'HIDE FAX',
      'SHOW FAX',
      'HIDE FLIPPER',
      'SHOW FLIPPER',
      'HIDE FLIGHTS',
      'SHOW FLIGHTS',
      'HIDE FORTUNE',
      'SHOW FORTUNE',
      'HIDE JEOPARDY',
      'SHOW JEOPARDY',
      'HIDE LICE',
      'SHOW LICE',
      'HIDE LOCATION',
      'SHOW LOCATION',
      'HIDE LOTTERY',
      'SHOW LOTTERY',
      'HIDE LUCY',
      'SHOW LUCY',
      'HIDE MODULES',
      'SHOW MODULES',
      'HIDE MOON',
      'SHOW MOON',
            'HIDE NASA',
      'SHOW NASA',
      'HIDE NEO',
      'SHOW NEO',
      'HIDE NEWS',
      'SHOW NEWS',
      'HIDE PETFINDER',
      'SHOW PETFINDER',
            'HIDE PHONE',
      'SHOW PHONE',
      'HIDE PICTURES',
      'SHOW PICTURES',
            'HIDE PILOTS',
      'SHOW PILOTS',
      'HIDE SHIPPING',
      'SHOW SHIPPING',
      'HIDE STATION',
      'SHOW STATION',
      'HIDE STATS',
      'SHOW STATS',
      'HIDE SUNRISE',
      'SHOW SUNRISE',
      'HIDE SUDOKU',
      'SHOW SUDOKU',
            'HIDE TIDES',
      'SHOW TIDES',
      'HIDE TIMER',
      'SHOW TIMER',
      'HIDE TRIVIA',
      'SHOW TRIVIA',
      'HIDE VOICE',
      'SHOW VOICE',
            'HIDE WEATHER',
      'SHOW WEATHER',
      'HIDE PAGE ONE',
      'SHOW PAGE ONE',
      'HIDE PAGE TWO',
      'SHOW PAGE TWO',
      'HIDE PAGE THREE',
      'SHOW PAGE THREE',
      'HIDE PAGE FOUR',
      'SHOW PAGE FOUR',
      'PLEASE WAKE UP',
      'GO TO SLEEP',
            'OPEN HELP',
      'CLOSE HELP',
        ]
    },

    /** @member {Object[]} modules - Set of all modules with mode and commands. */
    modules: [],
    /** @member {string[]} previouslyHidden - keep list of module identifiers already hidden when sleep occurs */
    previouslyHidden: [],
    /**
     * @member {Object} defaults - Defines the default config values.
     * @property {int} timeout - Seconds to active listen for commands.
     * @property {string} keyword - Keyword to activate active listening.
     * @property {boolean} debug - Flag to enable debug information.
     */
    defaults: {
        timeout: 15,
        keyword: 'MAGIC MIRROR',
        debug: false,
        standByMethod: 'DPMS',
        startHidden:  true,
    },

    /**
     * @function start
     * @description Sets mode to initialising.
     * @override
     */
    start() {
        Log.info(`Starting module: ${this.name}`);
        this.mode = this.translate('INIT');
        this.modules.push(this.voice);
        Log.info(`${this.name} is waiting for voice command registrations.`);
    },

    /**
     * @function getStyles
     * @description Style dependencies for this module.
     * @override
     *
     * @returns {string[]} List of the style dependency filepaths.
     */
    getStyles() {
        return ['font-awesome.css', 'MMM-voice.css'];
    },

    /**
     * @function getTranslations
     * @description Translations for this module.
     * @override
     *
     * @returns {Object.<string, string>} Available translations for this module (key: language code, value: filepath).
     */
    getTranslations() {
        return {
            en: 'translations/en.json',
            de: 'translations/de.json',
            id: 'translations/id.json'
        };
    },

    /**
     * @function getDom
     * @description Creates the UI as DOM for displaying in MagicMirror application.
     * @override
     *
     * @returns {Element}
     */
    getDom() {
        const wrapper = document.createElement('div');
        const voice = document.createElement('div');
        voice.classList.add('small', 'align-left');

        const icon = document.createElement('i');
        icon.classList.add('fa', this.icon, 'icon');
        if (this.pulsing) {
            icon.classList.add('pulse');
        }
        voice.appendChild(icon);

        const modeSpan = document.createElement('span');
        modeSpan.innerHTML = this.mode;
        voice.appendChild(modeSpan);
        if (this.config.debug) {
            const debug = document.createElement('div');
            debug.innerHTML = this.debugInformation;
            voice.appendChild(debug);
        }

        const modules = document.querySelectorAll('.module');
        for (let i = 0; i < modules.length; i += 1) {
            if (!modules[i].classList.contains(this.name)) {
                if (this.help) {
                    modules[i].classList.add(`${this.name}-blur`);
                } else {
                    modules[i].classList.remove(`${this.name}-blur`);
                }
            }
        }
/////// Edit help screen to fit all commands TO DO @ Mykle ////////////////////////////////
        if (this.help) {
            voice.classList.add(`${this.name}-blur`);
            const modal = document.createElement('div');
            modal.classList.add('modal');
            this.appendHelp(modal);
            wrapper.appendChild(modal);
        }

        wrapper.appendChild(voice);

        return wrapper;
    },


 /////////// @ Mykle enhancement ////////////////////
    notificationReceived: function(notification, payload) {
        if (notification === 'HIDE_VOICE') {
            this.hide();
        }  else if (notification === 'SHOW_VOICE') {
            this.show(1000);
        }

    },

    /**
     * @function notificationReceived
     * @description Handles incoming broadcasts from other modules or the MagicMirror core.
     * @override
     *
     * @param {string} notification - Notification name
     * @param {*} payload - Detailed payload of the notification.
     */
    notificationReceived(notification, payload) {
        if (notification === 'DOM_OBJECTS_CREATED') {
            this.sendSocketNotification('START', { config: this.config, modules: this.modules });
        } else if (notification === 'REGISTER_VOICE_MODULE') {
            if (Object.prototype.hasOwnProperty.call(payload, 'mode') && Object.prototype.hasOwnProperty.call(payload, 'sentences')) {
                this.modules.push(payload);
            }
        }
 //   },  // <-- removed }, here when I edited

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////// @ Mykle enhancement //////////////////
     if(this.config.startHidden) {		
       if (notification === 'DOM_OBJECTS_CREATED') {
          MM.getModules().enumerate((module) => {
               module.hide(1000);
          });
        }
     }
/////////// @ Mykle enhancement //////////////////
    if (notification === 'DOM_OBJECTS_CREATED') {
        if(this.config.startHidden) {
            this.sendNotification('SHOW_LUCY'); // for showing MMM-EasyPix(Lucy) when MM launches
            this.show(1000); // for showing MMM-voice when MM launches
            this.sendNotification('HELLO_LUCY');
        }
    }


    },

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * @function socketNotificationReceived
     * @description Handles incoming messages from node_helper.
     * @override
     *
     * @param {string} notification - Notification name
     * @param {*} payload - Detailed payload of the notification.
     */
    socketNotificationReceived(notification, payload) {
        if (notification === 'READY') {
            this.icon = 'fa-microphone';
            this.mode = this.translate('NO_MODE'); // <-- was 'NO_MODE' @Mykle
            this.pulsing = false;
        } else if (notification === 'LISTENING') {
            this.pulsing = true;
        } else if (notification === 'SLEEPING') {
            this.pulsing = false;
        } else if (notification === 'ERROR') {
            this.mode = notification;
        } else if (notification === 'VOICE') {
            for (let i = 0; i < this.modules.length; i += 1) {
                if (payload.mode === this.modules[i].mode) {
                    if (this.mode !== payload.mode) {
                        this.help = false;
                        this.sendNotification(`${notification}_MODE_CHANGED`, { old: this.mode, new: payload.mode });
                        this.mode = payload.mode;
                    }
                    if (this.mode !== 'VOICE') {
                        this.sendNotification(`${notification}_${payload.mode}`, payload.sentence);
                    }
                    break;
                }
            }
        } else if (notification === 'BYTES') {
            this.sendNotification('MMM-TTS', payload);
        } else if (notification === 'HIDE_MODULES') {
            MM.getModules().enumerate((module) => {
                module.hide(1000);
            });
            this.sendNotification('STAND_BY', { status: true, modules: [] });
        } else if (notification === 'SHOW_MODULES') {
            MM.getModules().enumerate((module) => {
                module.show(1000);
            });
            this.sendNotification('STAND_BY', { status: false });
       } else if (notification === 'STAND_BY_ACTION') {
            if (payload.type === 'show') {
                if (payload.hardware === false) {
                    MM.getModules().enumerate((module) => {
                        if (this.previouslyHidden.includes(module.identifier)) {
                            module.show(1000);
                        }
                    });
                    this.previouslyHidden = [];
                }

                this.sendNotification('STAND_BY', { status: false });
            } else if (payload.type === 'hide') {
                if (payload.hardware === false) {
                    MM.getModules().enumerate((module) => {
                        if (module.hidden === true) {
                            this.previouslyHidden.push(module.identifier);
                        } else {
                            module.hide(1000);
                        }
                    });
                }

                this.sendNotification('STAND_BY', { status: true, modules: this.previouslyHidden.slice(0) });
            }
       }
/*

    if (notification === 'DOM_OBJECTS_CREATED') {
         MM.getModules().enumerate((module) => {
                module.hide(1000);
            });
     }


*/

//////////// PAGES BY VOICE COMMAND @ Mykle  ///////////////////////////////////////	
     else if (notification === 'SHOW_PAGE_ONE') {
       this.sendNotification('HIDE_LUCY');
       this.sendNotification('HIDE_PAGE_TWO');
       this.sendNotification('HIDE_PAGE_THREE');
       this.sendNotification('SHOW_LOTTERY');
       this.sendNotification('SHOW_CLOCK');
       this.sendNotification('SHOW_EARTH');
       this.sendNotification('SHOW_EYECANDY');
       this.sendNotification('SHOW_LICE');
       this.sendNotification('SHOW_COWBOY');
       this.sendNotification('SHOW_TIDES');
       this.sendNotification('SHOW_VOICE');

     } else if (notification === 'HIDE_PAGE_ONE') {
       this.sendNotification('HIDE_LUCY');
       this.sendNotification('HIDE_LOTTERY');
       this.sendNotification('HIDE_CLOCK');
       this.sendNotification('HIDE_EARTH');
       this.sendNotification('HIDE_EYECANDY');
       this.sendNotification('HIDE_LICE');
       this.sendNotification('HIDE_COWBOY');
       this.sendNotification('HIDE_TIDES');
       this.sendNotification('HIDE_VOICE');
///////////////////////////////////////////////////////////////////////////////////////////////			
     } else if (notification === 'SHOW_PAGE_TWO') {
       this.sendNotification('HIDE_LUCY');
       this.sendNotification('HIDE_PAGE_ONE');
       this.sendNotification('HIDE_PAGE_THREE');
       this.sendNotification('SHOW_PILOTS');
       this.sendNotification('SHOW_MOON');
       this.sendNotification('SHOW_NASA');
       this.sendNotification('SHOW_ALARM');
       this.sendNotification('SHOW_COCKTAILS');
       this.sendNotification('SHOW_WEATHER');
       this.sendNotification('SHOW_VOICE');

    } else if (notification === 'HIDE_PAGE_TWO') {
       this.sendNotification('HIDE_LUCY');
       this.sendNotification('HIDE_PILOTS');
       this.sendNotification('HIDE_MOON');
       this.sendNotification('HIDE_NASA');
       this.sendNotification('HIDE_ALARM');
       this.sendNotification('HIDE_COCKTAILS');
       this.sendNotification('HIDE_WEATHER');
       this.sendNotification('HIDE_VOICE');
////////////////////////////////////////////////////////////////////////////////////////////////
    } else if (notification === 'SHOW_PAGE_THREE') {
       this.sendNotification('HIDE_LUCY');
       this.sendNotification('HIDE_PAGE_ONE');
       this.sendNotification('HIDE_PAGE_TWO');
       this.sendNotification('SHOW_BACKGROUND');
       this.sendNotification('SHOW_CALENDAR');
       this.sendNotification('SHOW_COMPLIMENTS');
       this.sendNotification('SHOW_DARWIN');
       this.sendNotification('SHOW_FLIPPER');
       this.sendNotification('SHOW_NEWS');
       this.sendNotification('SHOW_PICTURES');

    } else if (notification === 'HIDE_PAGE_THREE') {
       this.sendNotification('HIDE_LUCY');
       this.sendNotification('HIDE_BACKGROUND');
       this.sendNotification('HIDE_CALENDAR');
       this.sendNotification('HIDE_COMPLIMENTS');
       this.sendNotification('HIDE_DARWIN');
       this.sendNotification('HIDE_FLIPPER');
       this.sendNotification('HIDE_NEWS');
       this.sendNotification('HIDE_PICTURES');
      ///////////////////////////////////////////////////////////////////////////////////////////////			
     } else if (notification === 'SHOW_PAGE_FOUR') {
       this.sendNotification('HIDE_LUCY');
       this.sendNotification('HIDE_PAGE_ONE');
       this.sendNotification('HIDE_PAGE_THREE');
       this.sendNotification('SHOW_STATS');
       this.sendNotification('SHOW_FAX');
       this.sendNotification('SHOW_NASA');
       this.sendNotification('SHOW_ALARM');
       this.sendNotification('SHOW_COCKTAILS');
       this.sendNotification('SHOW_WEATHER');
       this.sendNotification('SHOW_VOICE');

    } else if (notification === 'HIDE_PAGE_FOUR') {
       this.sendNotification('HIDE_LUCY');
       this.sendNotification('HIDE_STATS');
       this.sendNotification('HIDE_FAX');
       this.sendNotification('HIDE_NASA');
       this.sendNotification('HIDE_ALARM');
       this.sendNotification('HIDE_COCKTAILS');
       this.sendNotification('HIDE_WEATHER');
       this.sendNotification('HIDE_VOICE');
////////////////////////////////////////////////////////////////////////////////////////////////
    }


/////////// SINGULAR VOICE COMMANDS @ Mykle ///////////////////////////////////		

        // You have to add your UNIQUE commands like this

    // MMM-voice sends notification to MMM-AlarmClock to HIDE
        else if (notification === 'HIDE_ALARM') {
             this.sendNotification('HIDE_ALARM');
        }

        // MMM-voice sends notification to MMM-AlarmClock to SHOW
        else if (notification === 'SHOW_ALARM') {
             this.sendNotification('SHOW_ALARM');
        }

    // MMM-voice sends notification to MMM-Back to HIDE
     else if (notification === 'HIDE_BACKGROUND') {
             this.sendNotification('HIDE_BACKGROUND');
        }

        // MMM-voice sends notification to MMM-Back to SHOW
        else if (notification === 'SHOW_BACKGROUND') {
             this.sendNotification('SHOW_BACKGROUND');
        }

  // MMM-voice sends notification to calendar to HIDE
        else if (notification === 'HIDE_CALENDAR') {
             this.sendNotification('HIDE_CALENDAR');
        }

        // MMM-voice sends notification to calendar to SHOW
        else if (notification === 'SHOW_CALENDAR') {
             this.sendNotification('SHOW_CALENDAR');
        }

    // MMM-voice sends notification to MMM-CARDS to HIDE
        else if (notification === 'HIDE_CARDS') {
             this.sendNotification('HIDE_CARDS');
        }

        // MMM-voice sends notification to MMM-CARDS to SHOW
        else if (notification === 'SHOW_CARDS') {
             this.sendNotification('SHOW_CARDS');
        }

    // MMM-voice sends notification to MMM-Census to HIDE
        else if (notification === 'HIDE_CENSUS') {
             this.sendNotification('HIDE_CENSUS');
        }

        // MMM-voice sends notification to MMM-Census to SHOW
        else if (notification === 'SHOW_CENSUS') {
             this.sendNotification('SHOW_CENSUS');
        }

    // MMM-voice sends notification to MMM-CLOCK to HIDE
        else if (notification === 'HIDE_CLOCK') {
             this.sendNotification('HIDE_CLOCK');
        }

        // MMM-voice sends notification to MMM-CLOCK to SHOW
        else if (notification === 'SHOW_CLOCK') {
             this.sendNotification('SHOW_CLOCK');
        }

    // MMM-voice sends notification to MMM-COCKTAILS to HIDE
        else if (notification === 'HIDE_COCKTAILS') {
             this.sendNotification('HIDE_COCKTAILS');
        }

        // MMM-voice sends notification to MMM-COCKTAILS to SHOW
        else if (notification === 'SHOW_COCKTAILS') {
             this.sendNotification('SHOW_COCKTAILS');
        }

    // MMM-voice sends notification to compliments to HIDE
        else if (notification === 'HIDE_COMPLIMENTS') {
             this.sendNotification('HIDE_COMPLIMENTS');
        }

        // MMM-voice sends notification to compliments to SHOW
        else if (notification === 'SHOW_COMPLIMENTS') {
             this.sendNotification('SHOW_COMPLIMENTS');
        }

    // MMM-voice sends notification to MMM-NOAA to HIDE
        else if (notification === 'HIDE_COWBOY') {
             this.sendNotification('HIDE_COWBOY');
        }

        // MMM-voice sends notification to MMM-NOAA to SHOW
        else if (notification === 'SHOW_COWBOY') {
             this.sendNotification('SHOW_COWBOY');
        }

    // MMM-voice sends notification to MMM-EOL to HIDE
        else if (notification === 'HIDE_DARWIN') {
             this.sendNotification('HIDE_DARWIN');
        }

        // MMM-voice sends notification to MMM-EOL to SHOW
        else if (notification === 'SHOW_DARWIN') {
             this.sendNotification('SHOW_DARWIN');
        }

    // MMM-voice sends notification to MMM-EARTH to HIDE
        else if (notification === 'HIDE_EARTH') {
             this.sendNotification('HIDE_EARTH');
        }

        // MMM-voice sends notification to MMM-EARTH to SHOW
        else if (notification === 'SHOW_EARTH') {
             this.sendNotification('SHOW_EARTH');
        }

     // MMM-voice sends notification to MMM-EyeCandy to HIDE
        else if (notification === 'HIDE_EYECANDY') {
             this.sendNotification('HIDE_EYECANDY');
        }

        // MMM-voice sends notification to MMM-EyeCandy to SHOW
        else if (notification === 'SHOW_EYECANDY') {
             this.sendNotification('SHOW_EYECANDY');
        }

    // MMM-voice sends notification to MMM-Events to HIDE
        else if (notification === 'HIDE_EVENTS') {
             this.sendNotification('HIDE_EVENTS');
        }

        // MMM-voice sends notification to MMM-Events to SHOW
        else if (notification === 'SHOW_EVENTS') {
             this.sendNotification('SHOW_EVENTS');
        }

    // MMM-voice sends notification to MMM-rfacts to HIDE
        else if (notification === 'HIDE_FAX') {
             this.sendNotification('HIDE_FAX');
        }

        // MMM-voice sends notification to MMM-rfacts to SHOW
        else if (notification === 'SHOW_FAX') {
             this.sendNotification('SHOW_FAX');
        }

     // MMM-voice sends notification to MMM-Glock to HIDE
        else if (notification === 'HIDE_FLIPPER') {
             this.sendNotification('HIDE_FLIPPER');
        }

        // MMM-voice sends notification to MMM-Glock to SHOW
        else if (notification === 'SHOW_FLIPPER') {
             this.sendNotification('SHOW_FLIPPER');
        }

     // MMM-voice sends notification to MMM-FlightsAbove to HIDE
        else if (notification === 'HIDE_FLIGHTS') {
             this.sendNotification('HIDE_FLIGHTS');
        }

        // MMM-voice sends notification to MMM-FlightsAbove to SHOW
        else if (notification === 'SHOW_FLIGHTS') {
             this.sendNotification('SHOW_FLIGHTS');
        }

    // MMM-voice sends notification to MMM-Fortune to HIDE
        else if (notification === 'HIDE_FORTUNE') {
             this.sendNotification('HIDE_FORTUNE');
        }

        // MMM-voice sends notification to MMM-Fortune to SHOW
        else if (notification === 'SHOW_FORTUNE') {
             this.sendNotification('SHOW_FORTUNE');
        }

    // MMM-voice sends notification to MMM-JEOPARDY to HIDE
        else if (notification === 'HIDE_JEOPARDY') {
             this.sendNotification('HIDE_JEOPARDY');
        }

        // MMM-voice sends notification to MMM-JEOPARDY to SHOW
        else if (notification === 'SHOW_JEOPARDY') {
             this.sendNotification('SHOW_JEOPARDY');
        }

    // MMM-voice sends notification to MMM-LICE to HIDE
        else if (notification === 'HIDE_LICE') {
             this.sendNotification('HIDE_LICE');
        }

        // MMM-voice sends notification to MMM-LICE to SHOW
        else if (notification === 'SHOW_LICE') {
             this.sendNotification('SHOW_LICE');
        }

    // MMM-voice sends notification to MMM-URHere to HIDE
        else if (notification === 'HIDE_LOCATION') {
             this.sendNotification('HIDE_LOCATION');
        }

        // MMM-voice sends notification to MMM-URHere to SHOW
        else if (notification === 'SHOW_LOCATION') {
             this.sendNotification('SHOW_LOCATION');
        }

    // MMM-voice sends notification to MMM-Lottery to HIDE
        else if (notification === 'HIDE_LOTTERY') {
             this.sendNotification('HIDE_LOTTERY');
        }

        // MMM-voice sends notification to MMM-Lottery to SHOW
        else if (notification === 'SHOW_LOTTERY') {
             this.sendNotification('SHOW_LOTTERY');
        }


        // MMM-voice sends notification to MMM-EasyPix to HIDE
        else if (notification === 'HIDE_LUCY') {
             this.sendNotification('HIDE_LUCY');
        }

        // MMM-voice sends notification to MMM-EasyPix to SHOW
        else if (notification === 'SHOW_LUCY') {
             this.sendNotification('SHOW_LUCY');
        }

        // MMM-voice sends notification to MMM-Lunartic to HIDE
        else if (notification === 'HIDE_MOON') {
             this.sendNotification('HIDE_MOON');
        }

        // MMM-voice sends notification to MMM-Lunartic to SHOW
        else if (notification === 'SHOW_MOON') {
             this.sendNotification('SHOW_MOON');
        }

    // MMM-voice sends notification to MMM-NASA to HIDE
        else if (notification === 'HIDE_NASA') {
             this.sendNotification('HIDE_NASA');
        }

        // MMM-voice sends notification to MMM-NASA to SHOW
        else if (notification === 'SHOW_NASA') {
             this.sendNotification('SHOW_NASA');
        }

    // MMM-voice sends notification to MMM-NEO to HIDE
        else if (notification === 'HIDE_NEO') {
             this.sendNotification('HIDE_NEO');
        }

        // MMM-voice sends notification to MMM-NEO to SHOW
        else if (notification === 'SHOW_NEO') {
             this.sendNotification('SHOW_NEO');
        }

    // MMM-voice sends notification to newsfeed to HIDE
        else if (notification === 'HIDE_NEWS') {
             this.sendNotification('HIDE_NEWS');
        }

        // MMM-voice sends notification to newsfeed to SHOW
        else if (notification === 'SHOW_NEWS') {
             this.sendNotification('SHOW_NEWS');
        }

    // MMM-voice sends notification to MMM-PETFINDER to HIDE
        else if (notification === 'HIDE_PETFINDER') {
             this.sendNotification('HIDE_PETFINDER');
        }

        // MMM-voice sends notification to MMM-PETFINDER to SHOW
        else if (notification === 'SHOW_PETFINDER') {
             this.sendNotification('SHOW_PETFINDER');
        }

         // MMM-voice sends notification to MMM-FMI to HIDE
        else if (notification === 'HIDE_PHONE') {
             this.sendNotification('HIDE_PHONE');
        }

        // MMM-voice sends notification to MMM-FMI to SHOW
        else if (notification === 'SHOW_PHONE') {
             this.sendNotification('SHOW_PHONE');
        }

     // MMM-voice sends notification to MMM-ImageSlideshow to HIDE
        else if (notification === 'HIDE_PICTURES') {
             this.sendNotification('HIDE_PICTURES');
        }

        // MMM-voice sends notification to MMM-ImageSlideshow to SHOW
        else if (notification === 'SHOW_PICTURES') {
             this.sendNotification('SHOW_PICTURES');
        }

        // MMM-voice sends notification to MMM-PilotWX to HIDE
        else if (notification === 'HIDE_PILOTS') {
             this.sendNotification('HIDE_PILOTS');
        }

        // MMM-voice sends notification to MMM-PilotWX to SHOW
        else if (notification === 'SHOW_PILOTS') {
             this.sendNotification('SHOW_PILOTS');
        }

    // MMM-voice sends notification to MMM-AfterShip to HIDE
        else if (notification === 'HIDE_SHIPPING') {
             this.sendNotification('HIDE_SHIPPING');
        }

        // MMM-voice sends notification to MMM-AfterShip to SHOW
        else if (notification === 'SHOW_SHIPPING') {
             this.sendNotification('SHOW_SHIPPING');
        }

    // MMM-voice sends notification to MMM-ISS to HIDE
        else if (notification === 'HIDE_STATION') {
             this.sendNotification('HIDE_STATION');
        }

        // MMM-voice sends notification to MMM-ISS to SHOW
        else if (notification === 'SHOW_STATION') {
             this.sendNotification('SHOW_STATION');
        }

    // MMM-voice sends notification to MMM-PC-Stats to HIDE
        else if (notification === 'HIDE_STATS') {
             this.sendNotification('HIDE_STATS');
        }

        // MMM-voice sends notification to MMM-PC-Stats to SHOW
        else if (notification === 'SHOW_STATS') {
             this.sendNotification('SHOW_STATS');
        }

    // MMM-voice sends notification to MMM-Sudoku to HIDE
        else if (notification === 'HIDE_SUDOKU') {
             this.sendNotification('HIDE_SUDOKU');
        }

        // MMM-voice sends notification to MMM-Sudoku to SHOW
        else if (notification === 'SHOW_SUDOKU') {
             this.sendNotification('SHOW_SUDOKU');
        }

    // MMM-voice sends notification to MMM-SunRiseSet to HIDE
        else if (notification === 'HIDE_SUNRISE') {
             this.sendNotification('HIDE_SUNRISE');
        }

        // MMM-voice sends notification to MMM-SunRiseSet to SHOW
        else if (notification === 'SHOW_SUNRISE') {
             this.sendNotification('SHOW_SUNRISE');
        }

     // MMM-voice sends notification to MMM-SORT to HIDE
        else if (notification === 'HIDE_TIDES') {
             this.sendNotification('HIDE_TIDES');
        }

        // MMM-voice sends notification to MMM-SORT to SHOW
        else if (notification === 'SHOW_TIDES') {
             this.sendNotification('SHOW_TIDES');
        }

    // MMM-voice sends notification to MMM-EventHorizon to HIDE
        else if (notification === 'HIDE_TIMER') {
             this.sendNotification('HIDE_TIMER');
        }

        // MMM-voice sends notification to MMM-EventHorizon to SHOW
        else if (notification === 'SHOW_TIMER') {
             this.sendNotification('SHOW_TIMER');
        }

        // MMM-voice sends notification to MMM-ATM to HIDE
        else if (notification === 'HIDE_TRIVIA') {
             this.sendNotification('HIDE_TRIVIA');
        }

        // MMM-voice sends notification to MMM-ATM to SHOW
        else if (notification === 'SHOW_TRIVIA') {
             this.sendNotification('SHOW_TRIVIA');
        }

     // MMM-voice sends notification to MMM-VOICE to HIDE
        else if (notification === 'HIDE_VOICE') {
             this.hide(1000);
        }

        // MMM-voice sends notification to MMM-VOICE to SHOW
        else if (notification === 'SHOW_VOICE') {
             this.show(1000);
        }

        // MMM-voice sends notification to MMM-WEATHER to HIDE
        else if (notification === 'HIDE_WEATHER') {
             this.sendNotification('HIDE_WEATHER');
        }

        // MMM-voice sends notification to MMM-WEATHER to SHOW
        else if (notification === 'SHOW_WEATHER') {
             this.sendNotification('SHOW_WEATHER');
        }


/////////////////////////////////////////////////////////////////////////////////

        else if (notification === 'DEBUG') {
            this.debugInformation = payload;
        }
        this.updateDom(300);
    },

    /**
     * @function appendHelp
     * @description Creates the UI for the voice command SHOW HELP.
     *
     * @param {Element} appendTo - DOM Element where the UI gets appended as child.
     */
    appendHelp(appendTo) {
        const title = document.createElement('h1');
        title.classList.add('xsmall'); // was medium @ Mykle
        title.innerHTML = `${this.name} - ${this.translate('COMMAND_LIST')}`;
        appendTo.appendChild(title);

        const mode = document.createElement('div');
    mode.classList.add('xsmall'); // added @ Mykle
        mode.innerHTML = `${this.translate('MODE')}: ${this.voice.mode}`;
        appendTo.appendChild(mode);

        const listLabel = document.createElement('div');
    listLabel.classList.add('xsmall'); // added @ Mykle
        listLabel.innerHTML = `${this.translate('VOICE_COMMANDS')}:`;
        appendTo.appendChild(listLabel);

        const list = document.createElement('ul');
        for (let i = 0; i < this.voice.sentences.length; i += 1) {
            const item = document.createElement('li');
      list.classList.add('xsmall'); // added @ Mykle
            item.innerHTML = this.voice.sentences[i];
            list.appendChild(item);
        }
        appendTo.appendChild(list);
    }
});
