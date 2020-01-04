"use strict";

var importedSentences;                              /** Prepare variable to be populated from import. */
function readTextFile(file, callback) {
	var rawFile = new XMLHttpRequest();
	rawFile.overrideMimeType("application/json");
	rawFile.open("GET", file, true);
	rawFile.onreadystatechange = function() {
		if (rawFile.readyState === 4 && rawFile.status == "200") {
			callback(rawFile.responseText);
		}
	};
	rawFile.send(null);
}
const sfn=document.currentScript.src.substring(7,document.currentScript.src.lastIndexOf(document.currentScript.src.includes('//')?'//':'/'))
const localPath= sfn.substring(sfn.indexOf('modules'))
const ModuleName=localPath.substring(localPath.lastIndexOf("/")+1)
console.log("localPath="+localPath+" modulename="+ModuleName);

readTextFile(localPath+"/sentences.json", function(text){
	var tempImport = JSON.parse(text);
	importedSentences = tempImport;
	console.log("SENTENCE: "+importedSentences);
});

////////////////////////////////////////////////////

Module.register(ModuleName, {

	icon: "fa-microphone-slash",                    /** @member {string} icon - Microphone icon. */
	pulsing: true,                                  /** @member {boolean} pulsing - Flag to indicate listening state. */
	help: false,                                    /** @member {boolean} help - Flag to switch between render help or not. */
	timeout: null,                                  /** Done by @sdetweil to release mic from PocketSphinx */

	lucy: {                                        /** @member {Object} lucy - Defines the default mode and commands of this module. */
		mode: "Say, 'Hello Lucy'",                                  /** @property {string} mode - Voice mode of this module. */
		sentences: []                                   /** @property {string[]} sentences - List of lucy commands of this module. */
	},

	modules: [],                                    /** @member {Object[]} modules - Set of all modules with mode and commands. */
	previouslyHidden: [],                           /** @member - keep list of modules already hidden when sleep occurs */

	defaults: {
		timeout: 15,                                // time listening for a command/sentence when mic pulsing
		defaultOnStartup: "Hello-Lucy",
		keyword: "HELLO LUCY",                      // keyword to activate listening for a command/sentence
		standByMethod: "DPMS",                      // 'DPMS' = anything else than RPi or 'PI'
		sounds: ["a.mp3",  "b.mp3",  "c.mp3" , "d.mp3"], // welcome sounds at startup randomly chosen
		startHideAll: false,                        // if true, all modules start as hidden
		microphone: "default",  // Do * NOT * change, is read from ~/.asoundrc
		speed: 1000,                                // transition speed between show/no-show/show in milliseconds
	//	    defaultOnStartup: "Hello-Lucy",
	    	pageOneModules: ["Hello-Lucy"],         // default modules to show on page one/startup
		    pageTwoModules: [],                         // modules to show on page two
    		pageThreeModules: [],                       // modules to show on page two
    		pageFourModules: [],                        // modules to show on page two
    		pageFiveModules: [],                        // modules to show on page two
    		pageSixModules: [],                         // modules to show on page two
    		pageSevenModules: [],                       // modules to show on page two
    		pageEightModules: [],                       // modules to show on page two
    		pageNineModules: [],                        // modules to show on page two
    		pageTenModules: [],                          // modules to show on page two
		    greetingSounds: [ "a.mp3",  "b.mp3",  "c.mp3" , "d.mp3"], // randomized greeting sounds
				confirmationSound: "ding.mp3",               // when command is accepted. use your own or default
				debug: false,                               // get debug information in console
	},

	poweredOff: false,

	start() {
		var combinedSentences = importedSentences.concat(this.lucy.sentences);
		this.lucy.sentences = combinedSentences;
		Log.info(`Starting module: ${this.name}`);
		this.mode = this.translate("INIT");
		this.modules.push(this.lucy);
		Log.info(`${this.name} is waiting for lucy command registrations.`);
	},

	getStyles() {
		return ["font-awesome.css", "Hello-Lucy.css"];
	},

	getTranslations() {
		return {
			en: "translations/en.json",
			de: "translations/de.json",
			id: "translations/id.json"
		};
	},

	playConfirmationSound() {
		var audio = new Audio(localPath+"/sounds/" + this.config.confirmationSound);
		audio.play();
	},

	playGreetingSound() {
		// var audio_files = this.config.sounds;
		var random_file = this.config.sounds[Math.floor(Math.random() * this.config.sounds.length)];
		var audio = new Audio(localPath+"/sounds/"+random_file);
		audio.play();
	},

	getDom() {
		Log.log("lucy entered getDom")
		const wrapper = document.createElement("div");
		const lucy = document.createElement("div");
		lucy.classList.add("small", "align-left");

		const modeSpan = document.createElement("span");
		const icon = document.createElement("i");
		icon.classList.add("fa", this.icon, "icon");
		if (this.pulsing) {
			icon.classList.add("pulse");
			modeSpan.innerHTML = "Command Please:"
		}
		else
			modeSpan.innerHTML = this.mode;
		lucy.appendChild(icon);
		lucy.appendChild(modeSpan);

		if (this.config.debug) {
			const debug = document.createElement("div");
			debug.innerHTML = this.debugInformation;
			lucy.appendChild(debug);
		}

		const modules = document.querySelectorAll(".module");
		for (let i = 0; i < modules.length; i += 1) {
			if (!modules[i].classList.contains(this.name)) {
				if (this.help) {
					modules[i].classList.add(`${this.name}-blur`);
				} else {
					modules[i].classList.remove(`${this.name}-blur`);
				}
			}
		}

		if (this.help) {
			lucy.classList.add(`${this.name}-blur`);
			const modal = document.createElement("div");
			modal.classList.add("modal");
			this.appendHelp(modal);
			wrapper.appendChild(modal);
		}

		wrapper.appendChild(lucy);

		return wrapper;
	},

	notificationReceived(notification, payload, sender) {
		Log.log("lucy module notification received="+notification)
		var self=this;
		if (notification === "DOM_OBJECTS_CREATED") {
			Log.log("lucy module sending start")
			this.sendSocketNotification("START", { config: this.config, modules: this.modules });
		} else if (notification === "REGISTER_LUCY_MODULE") {
			if (Object.prototype.hasOwnProperty.call(payload, "mode") && Object.prototype.hasOwnProperty.call(payload, "sentences")) {
				this.modules.push(payload);
		}
		}
       // randomly chosen startup greeting
		if (notification === "DOM_OBJECTS_CREATED") {
			this.playGreetingSound();
		}

		// @TheStigh to manage hide/show modules on startup
		if (this.config.startHideAll) {
			if (notification === "DOM_OBJECTS_CREATED") {
				MM.getModules().enumerate((module) => {
					module.hide(1000);
				});
			}
		}

		if (notification === "DOM_OBJECTS_CREATED"){
			var showOnStart = MM.getModules().withClass(self.config.pageOneModules);
			showOnStart.enumerate(function(module) {
				var callback = function(){};
				module.show(self.config.speed, callback);
			});
		}

		if (notification === "DOM_OBJECTS_CREATED"){
			var showOnStart = MM.getModules().withClass(self.config.defaultOnStartup);
			showOnStart.enumerate(function(module) {
				var callback = function(){};
				module.show(self.config.speed, callback);
			});
		}

		// to show page one on alert @TheStigh
		if (notification === "SHOW_ALERT") {
			var showOnStart = MM.getModules().withClass(self.config.pageOneModules);
			showOnStart.enumerate(function(module) {
				var callback = function(){};
				module.show(self.config.speed, callback);
			});
		}
 	},

	socketNotificationReceived(notification, payload) {
		if (notification === "READY") {
			this.icon = "fa-microphone";
			this.mode = this.translate("NO_MODE")+ "'Hello Lucy'" // this.config.keyword;
			this.pulsing = false;

		} else if (notification === "LISTENING") {
			this.pulsing = true;

		} else if (notification === "SLEEPING") {
			this.pulsing = false;

		} else if (notification === "ERROR") {
			this.mode = notification;

		} else if (notification === "LUCY") {
			for (let i = 0; i < this.modules.length; i += 1) {
				if (payload.mode === this.modules[i].mode) {
					if (this.mode !== payload.mode) {
						this.help = false;
						this.sendNotification(`${notification}_MODE_CHANGED`, { old: this.mode, new: payload.mode });
						this.mode = payload.mode;
					}
					if (this.mode !== "LUCY") {
						this.sendNotification(`${notification}_${payload.mode}`, payload.sentence);
					}
					break;
				}
			}

		} else if (notification === "HIDE_MODULES") {
			// audible confirmation sound that Lucy understood the command
			this.playConfirmationSound();

			MM.getModules().enumerate((module) => {
				module.hide(1000);
			});

		} else if (notification === "SHOW_MODULES") {
			// audible confirmation sound that Lucy understood the command
			this.playConfirmationSound();

			MM.getModules().enumerate((module) => {
				module.show(1000);
			});

		} else if (notification === "DEBUG") {
			this.debugInformation = payload;

		} else if (notification === "MODULE_STATUS") {
			// audible confirmation sound that single or pages of modules was issued a Hide or show command
			this.playConfirmationSound();

			var hide = MM.getModules().withClass(payload.hide);
			hide.enumerate(function(module) {
				Log.log("Hide "+ module.name);
				var callback = function(){};
				module.hide(self.config.speed, callback);
			});

			var show = MM.getModules().withClass(payload.show);
			show.enumerate(function(module) {
				Log.log("Show "+ module.name);
				var callback = function(){};
				module.show(self.config.speed, callback);
			});

		} else if (notification === "MODULE_UPDATE") {
			this.sendNotification(payload);
			console.log("sendNoti received :"+payload);

		} else if (notification === "CLOSE_HELP") {
			this.help = false;
		} else if (notification === "OPEN_HELP") {
			this.help = true;
		}
		this.updateDom(300);
	},

	appendHelp(appendTo) {
		const listLabel = document.createElement("div");
		listLabel.classList.add("medium");
		// heading for help screen
		listLabel.innerHTML = `${this.translate("Lucy Commands")}:`;
		appendTo.appendChild(listLabel);

		const list = document.createElement("ul");
		for (let i = 0; i < this.lucy.sentences.length; i += 1) {
			const item = document.createElement("li");
			list.classList.add("xsmall");
			item.innerHTML = this.lucy.sentences[i];
			list.appendChild(item);
		}
		appendTo.appendChild(list);
	}
});
