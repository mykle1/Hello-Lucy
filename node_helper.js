
const Psc = require("pocketsphinx-continuous");
const fs = require("fs");
const exec = require("child_process").exec;
const lmtool = require("lmtool");
const bytes = require("./Bytes.js");
const NodeHelper = require("node_helper");

// import for new function of checkCommands()
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

const localPath= __dirname.substring(__dirname.indexOf('modules'))
//console.log("localPath="+localPath);

var loadingRules=fs.readFileSync(localPath+"/checkCommands.json", "utf8");
var importedWords = JSON.parse(loadingRules);
var firstWord, secWord, thirdWord, fourthWord, modName, trueFalse, sendNoti;
//console.log(importedWords);

module.exports = NodeHelper.create({

	listening: false,
	mode: false,
	words: [],

	start() {
		console.log(`Starting module helper: ${this.name}`);
	},

	socketNotificationReceived(notification, payload) {
		//console.log("Lucy received notification="+notification);
		if (notification === "START") {
			this.config = payload.config;
			this.time = this.config.timeout * 1000;
			this.modules = payload.modules;
			this.fillWords();
			this.checkFiles();

		} else if(notification === "ACTIVATE_MONITOR") {
			if(this.config.standByMethod === "DPMS")
			{exec("xset dpms force on", null);}
			if(this.config.standByMethod === "PI") // Turns off HDMI on Pi by @sdetweil
			{exec("/opt/vc/bin/tvservice -p && sudo chvt 6 && sudo chvt 7", null);}
			this.hdmi = true;

		} else if(notification === "DEACTIVATE_MONITOR") {
			if(this.config.standByMethod === "DPMS")
			{exec("xset dpms force off", null);}
			if(this.config.standByMethod === "PI") // Turns off HDMI on Pi by @sdetweil
			{exec("/opt/vc/bin/tvservice -o", null);}
			this.hdmi = false;

		}
	},

	fillWords() {
		// create array
		let words = this.config.keyword.split(" ");
		const temp = bytes.q.split(" ");
		words = words.concat(temp);
		for (let i = 0; i < this.modules.length; i += 1) {
			const mode = this.modules[i].mode.split(" ");
			words = words.concat(mode);
			for (let n = 0; n < this.modules[i].sentences.length; n += 1) {
				const sentences = this.modules[i].sentences[n].split(" ");
				words = words.concat(sentences);
			}
		}

		// filter duplicates
		words = words.filter((item, index, data) => data.indexOf(item) === index);

		// sort array
		words.sort();

		this.words = words;
	},

	checkFiles() {
		//console.log(`${this.name}: Checking files.`);
		fs.stat(localPath+"/words.json", (error, stats) => {
			if (!error && stats.isFile()) {
				fs.readFile(localPath+"/words.json", "utf8", (err, data) => {
					if (!err) {
						const words = JSON.parse(data).words;
						if (this.arraysEqual(this.words, words)) {
							this.startPocketsphinx();
							return;
						}
					}
					this.generateDicLM();
				});
			} else {
				this.generateDicLM();
			}
		});
	},

	arraysEqual(a, b) {
		if (!(a instanceof Array) || !(b instanceof Array)) {
			return false;
		}

		if (a.length !== b.length) {
			return false;
		}

		for (let i = 0; i < a.length; i += 1) {
			if (a[i] !== b[i]) {
				return false;
			}
		}

		return true;
	},

	// Generates new Dictionary and Language Model.
	generateDicLM() {
		console.log(`${this.name}: Generating dictionairy and language model.`);

		fs.writeFile(localPath+"/words.json", JSON.stringify({ words: this.words }), (err) => {
			if (err) {
				console.log(`${this.name}: Couldn't save words.json!`);
			} else {
				console.log(`${this.name}: Saved words.json successfully.`);
			}
		});

		lmtool(this.words, (err, filename) => {
			if (err) {
				this.sendSocketNotification("ERROR", "Couldn't create necessary files!");
			} else {
				fs.renameSync(`${filename}.dic`, localPath+"/Hello-Lucy.dic");
				fs.renameSync(`${filename}.lm`, localPath+"/Hello-Lucy.lm");

				this.startPocketsphinx();

				fs.unlink(`${filename}.log_pronounce`, this.noOp);
				fs.unlink(`${filename}.sent`, this.noOp);
				fs.unlink(`${filename}.vocab`, this.noOp);
				fs.unlink(`TAR${filename}.tgz`, this.noOp);
			}
		});
	},

	// Performs no operation.
	noOp() {},

	// Starts Pocketsphinx binary.
	startPocketsphinx() {
		//console.log(`${this.name}: Starting pocketsphinx.`);

		this.ps = new Psc({
			setId: this.name,
			verbose: true,
			microphone: this.config.microphone
		});

		this.ps.on("data", this.handleData.bind(this));
		if (this.config.debug) {
			this.ps.on("debug", this.logDebug.bind(this));
		}

		this.ps.on("error", this.logError.bind(this));

		if(typeof this.ps.start != "function")
		{console.log("downlevel pocketsphinx-continuous node module... error<===============================");}

		this.sendSocketNotification("READY");
	},

	// Helper method to handle recognized data.
	handleData(data) {
		if (typeof data === "string") {
			if (this.config.debug) {
				console.log(`${this.name} has recognized: ${data}`);
				this.sendSocketNotification("DEBUG", data);
			}
			if (data.includes(this.config.keyword) || this.listening) {
				this.listening = true;
				this.sendSocketNotification("LISTENING");
				if (this.timer) {
					clearTimeout(this.timer);
				}
				this.timer = setTimeout(() => {
					this.listening = false;
					this.sendSocketNotification("SLEEPING");
				}, this.time);
			} else {
				return;
			}

			let cleanData = this.cleanData(data);

			for (let i = 0; i < this.modules.length; i += 1) {
				const n = cleanData.indexOf(this.modules[i].mode);

				if (n === 0) {
					this.mode= this.modules[i].mode;

					cleanData = cleanData.substr(n + this.modules[i].mode.length).trim();
					break;
				}
			}

			this.mode="LUCY";
			if (this.mode) {
				this.sendSocketNotification("LUCY", { mode: this.mode, sentence: cleanData });
				if (this.mode === "LUCY") {
					this.checkCommands(cleanData);
				}
			}
		}
	},

	logDebug(data) {
		fs.appendFile(localPath+"/debug.log", data, (err) => {
			if (err) {
				console.log(`${this.name}: Couldn't save error to log file!`);
			}
		});
	},

	// Logs error information into error log file.
	logError(error) {
		if (error) {
			fs.appendFile(localPath+"/error.log", `${error}\n`, (err) => {
				if (err) {
					console.log(`${this.name}: Couldn't save error to log file!`);
				}
				this.sendSocketNotification("ERROR", error);
			});
		}
	},

	// Removes prefix/keyword and multiple spaces. Recognized data to clean. Cleaned data
	cleanData(data) {
		let temp = data;
		const i = temp.indexOf(this.config.keyword);
		if (i !== -1) {
			temp = temp.substr(i + this.config.keyword.length);
		}
		temp = temp.replace(/ {2,}/g, " ").trim();
		return temp;
	},

	// Checks for commands of lucy module. Recognized data
	checkCommands(data) {

		if (/(PLEASE)/g.test(data) && /(WAKE)/g.test(data) && /(UP)/g.test(data)) {
			if(this.config.standByMethod === "DPMS")
			{exec("xset dpms force on", null);}
			if(this.config.standByMethod === "PI")  /////////// Turns on HDMI on Pi @sdetweil
			{exec("/opt/vc/bin/tvservice -p && sudo chvt 6 && sudo chvt 7", null);}
			this.hdmi = true;

		} else if (/(GO)/g.test(data) && /(TO)/g.test(data) && /(SLEEP)/g.test(data)) {
			if(this.config.standByMethod === "DPMS")
			{exec("xset dpms force off", null);}
			if(this.config.standByMethod === "PI")  /////////// Turns off HDMI on Pi @sdetweil
			{exec("/opt/vc/bin/tvservice -o", null);}
			this.hdmi = false;

		} else if (/(HIDE)/g.test(data) && /(MODULES)/g.test(data)) {
			this.sendSocketNotification("HIDE_MODULES");

		} else if (/(SHOW)/g.test(data) && /(MODULES)/g.test(data)) {
			this.sendSocketNotification("SHOW_MODULES");

      // Help screen made better by @cowboysdude
		} else if (/(HELP)/g.test(data)) {
			if (/(CLOSE)/g.test(data) || (this.help && !/(OPEN)/g.test(data))) {
				this.sendSocketNotification("CLOSE_HELP");
				this.help = false;
			} else if (/(OPEN)/g.test(data) || (!this.help && !/(CLOSE)/g.test(data))) {
				this.sendSocketNotification("OPEN_HELP");
				this.help = true;
			}

			//////////////////    Toggle enhanced by @TheStigh /////////////
			////////////////			  Page 1 commands 			////////////////
		} else if (/(SHOW)/g.test(data) && /(PAGE)/g.test(data) && /(ONE)/g.test(data)) {
			this.sendSocketNotification("HIDE_MODULES");
			this.sendSocketNotification("MODULE_STATUS",{hide: [], show: this.config.pageOneModules, toggle:[]});

		} else if (/(HIDE)/g.test(data) && /(PAGE)/g.test(data) && /(ONE)/g.test(data)) {
			this.sendSocketNotification("HIDE_MODULES");

			////////////////			  Page 2 commands 			////////////////
		} else if (/(SHOW)/g.test(data) && /(PAGE)/g.test(data) && /(TWO)/g.test(data)) {
			this.sendSocketNotification("HIDE_MODULES");
			this.sendSocketNotification("MODULE_STATUS",{hide: [], show: this.config.pageTwoModules, toggle:[]});

		} else if (/(HIDE)/g.test(data) && /(PAGE)/g.test(data) && /(TWO)/g.test(data)) {
			this.sendSocketNotification("HIDE_MODULES");

			////////////////			  Page 3 commands 			////////////////
		} else if (/(SHOW)/g.test(data) && /(PAGE)/g.test(data) && /(THREE)/g.test(data)) {
			this.sendSocketNotification("HIDE_MODULES");
			this.sendSocketNotification("MODULE_STATUS",{hide: [], show: this.config.pageThreeModules, toggle:[]});

		} else if (/(HIDE)/g.test(data) && /(PAGE)/g.test(data) && /(THREE)/g.test(data)) {
			this.sendSocketNotification("HIDE_MODULES");

			////////////////			  Page 4 commands 			////////////////
		} else if (/(SHOW)/g.test(data) && /(PAGE)/g.test(data) && /(FOUR)/g.test(data)) {
			this.sendSocketNotification("HIDE_MODULES");
			this.sendSocketNotification("MODULE_STATUS",{hide: [], show: this.config.pageFourModules, toggle:[]});

		} else if (/(HIDE)/g.test(data) && /(PAGE)/g.test(data) && /(FOUR)/g.test(data)) {
			this.sendSocketNotification("HIDE_MODULES");

			////////////////			  Page 5 commands 			////////////////
		} else if (/(SHOW)/g.test(data) && /(PAGE)/g.test(data) && /(FIVE)/g.test(data)) {
			this.sendSocketNotification("HIDE_MODULES");
			this.sendSocketNotification("MODULE_STATUS",{hide: [], show: this.config.pageFiveModules, toggle:[]});

		} else if (/(HIDE)/g.test(data) && /(PAGE)/g.test(data) && /(FIVE)/g.test(data)) {
			this.sendSocketNotification("HIDE_MODULES");

			////////////////			  Page 6 commands 			////////////////
		} else if (/(SHOW)/g.test(data) && /(PAGE)/g.test(data) && /(SIX)/g.test(data)) {
			this.sendSocketNotification("HIDE_MODULES");
			this.sendSocketNotification("MODULE_STATUS",{hide: [], show: this.config.pageSixModules, toggle:[]});

		} else if (/(HIDE)/g.test(data) && /(PAGE)/g.test(data) && /(SIX)/g.test(data)) {
			this.sendSocketNotification("HIDE_MODULES");

			////////////////			  Page 7 commands 			////////////////
		} else if (/(SHOW)/g.test(data) && /(PAGE)/g.test(data) && /(SEVEN)/g.test(data)) {
			this.sendSocketNotification("HIDE_MODULES");
			this.sendSocketNotification("MODULE_STATUS",{hide: [], show: this.config.pageSevenModules, toggle:[]});

		} else if (/(HIDE)/g.test(data) && /(PAGE)/g.test(data) && /(SEVEN)/g.test(data)) {
			this.sendSocketNotification("HIDE_MODULES");

			////////////////			  Page 8 commands 			////////////////
		} else if (/(SHOW)/g.test(data) && /(PAGE)/g.test(data) && /(EIGHT)/g.test(data)) {
			this.sendSocketNotification("HIDE_MODULES");
			this.sendSocketNotification("MODULE_STATUS",{hide: [], show: this.config.pageEightModules, toggle:[]});

		} else if (/(HIDE)/g.test(data) && /(PAGE)/g.test(data) && /(EIGHT)/g.test(data)) {
			this.sendSocketNotification("HIDE_MODULES");

			////////////////			  Page 9 commands 			////////////////
		} else if (/(SHOW)/g.test(data) && /(PAGE)/g.test(data) && /(NINE)/g.test(data)) {
			this.sendSocketNotification("HIDE_MODULES");
			this.sendSocketNotification("MODULE_STATUS",{hide: [], show: this.config.pageNineModules, toggle:[]});

		} else if (/(HIDE)/g.test(data) && /(PAGE)/g.test(data) && /(NINE)/g.test(data)) {
			this.sendSocketNotification("HIDE_MODULES");

			////////////////			  Page 10 commands 			////////////////
		} else if (/(SHOW)/g.test(data) && /(PAGE)/g.test(data) && /(TEN)/g.test(data)) {
			this.sendSocketNotification("HIDE_MODULES");
			this.sendSocketNotification("MODULE_STATUS",{hide: [], show: this.config.pageTenModules, toggle:[]});

		} else if (/(HIDE)/g.test(data) && /(PAGE)/g.test(data) && /(TEN)/g.test(data)) {
			this.sendSocketNotification("HIDE_MODULES");

		} else {
      for (let row of importedWords.modOp){

// These vars ARE used in the .test(data) below
        // refactored
				firstWord = row[0];
				secWord = row[1];
				thirdWord = row[2];
				fourthWord = row[3];
				trueFalse = row[4];
				modName = row[5];
				sendNoti = row[6];

				this.firstWord = RegExp(firstWord);
				this.secWord = RegExp(secWord);
				this.thirdWord = RegExp(thirdWord);
				this.fourthWord = RegExp(fourthWord);
				this.trueFalse = trueFalse;
				this.modName = modName;
				this.sendNoti = sendNoti;

				if (this.firstWord.test(data) && this.secWord.test(data) && this.thirdWord.test(data) && this.fourthWord.test(data)) {
					//console.log(">>> modName & sendNoti : "+this.modName+" "+this.sendNoti);
					if (this.modName != "") {
						if (this.trueFalse === "true") {
							this.sendSocketNotification("MODULE_STATUS",{hide: [], show: [this.modName], toggle:[]});
						} else {
							this.sendSocketNotification("MODULE_STATUS",{hide: [this.modName], show: [], toggle:[]});
						}
					} else {
						this.sendSocketNotification("MODULE_UPDATE",this.sendNoti);
					}
				}
			}
		}
	}

});
