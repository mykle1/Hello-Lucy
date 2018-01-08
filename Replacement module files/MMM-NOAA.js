/* Magic Mirror
* Module: MMM-NOAA
* By cowboysdude and snille 
modified by barnosch
*/
var c = 0;
var dopo = false;

Module.register("MMM-NOAA", {

		// Module config defaults.
		defaults: {
			updateInterval: 30 * 60 * 1000, // every 10 minutes
			animationSpeed: 3650,
			initialLoadDelay: 875, //  delay
			retryDelay: 1500,
			maxWidth: "100%",
			apiKey: "",
			pws: "KNYELMIR13",
			ampm: true,
			dformat: true,
			showClock: true,
			useAir: false,
			airKEY: "",
			showGreet: false,
			name: "",
			showWind: false,
			showDate: false,
			showForecast: true,
			flash: false,
			showUV: true,
			showBar: true,
			showHum: true,
			position: 'top_left',
			alert: true,

			langFile: {
				"en": "en-US",
				"de": "de-DE",
				"sv": "sv-SE",
				"es": "es-ES",
				"fr": "fr-FR",
				"zh_cn": "zh-CN",
				"da": "da",
				"nl": "nl-NL",
				"nb": "nb-NO"
			},


			langTrans: {
				"en": "EN",
				"de": "DL",
				"sv": "SW",
				"es": "SP",
				"fr": "FR",
				"zh_cn": "CN",
				"da": "DK",
				"nl": "NL",
				"nb": "NO",
			},

			levelTrans: {
				"1":"green",
				"2":"yellow",
				"3":"orange",
				"4":"red",
			}				
		},

		// Define required scripts.
		getScripts: function() {
			return ["moment.js"];
		},

		getTranslations: function() {
			return {
				en: "translations/en.json",
				da: "translations/da.json",
				sv: "translations/sv.json",
				de: "translations/de.json",
				es: "translations/es.json",
				fr: "translations/fr.json",
				zh_cn: "translations/zh_cn.json",
				nl: "translations/nl.json",
				nb: "translations/nb.json"
			};
		},

		getStyles: function() {
			return ["MMM-NOAA.css", "weather-icons.css", "font-awesome.css"];
		},

		// Define start sequence.
		start: function() {
			Log.info("Starting module: " + this.name);
			this.config.lang = this.config.lang || config.language; //automatically overrides and sets language :)
			this.config.units = this.config.units || config.units;
			this.sendSocketNotification("CONFIG", this.config);

			// Set locale.  
			var lang = this.config.langTrans[config.language];
			this.url = "http://api.wunderground.com/api/" + this.config.apiKey + "/forecast/lang:" + lang + "/conditions/q/pws:" + this.config.pws + ".json";

			this.forecast = {};
			this.air = {};
			this.srss = {};
			this.alert = [];
			this.amess = [];
			this.today = "";
			this.scheduleUpdate();
		},

		processNoaa: function(data) {
			c = 0;
			this.current = data.current_observation;
			this.forecast = data.forecast.simpleforecast.forecastday;
			this.loaded = true;
		},

		processSRSS: function(data) {
			this.srss = data.results;
		},

		processAIR: function(data) {
			this.air = data.data.current.pollution;
		},

		processAlert: function(data) {
			this.alert = data;
			this.amess[c] = this.alert;
			c = c + 1;
		},

		secondsToString: function(seconds) {
			var srss = this.srss.day_length;
			var numhours = Math.floor((srss % 86400) / 3600);
			var numminutes = Math.floor(((srss % 86400) % 3600) / 60);
			return numhours + this.translate(" hours ") + " " + numminutes + " " +this.translate(" minutes ");
		},


		scheduleUpdate: function() {
			setInterval(() => {
					this.getNOAA();
				}, this.config.updateInterval);
			this.getNOAA(this.config.initialLoadDelay);
		},

		getNOAA: function() {
			this.sendSocketNotification("GET_NOAA", this.url);
		},

		socketNotificationReceived: function(notification, payload) {
			if (notification === "NOAA_RESULT") {
				this.processNoaa(payload);
			}
			if (notification === "SRSS_RESULTS") {
				this.processSRSS(payload);
			}
			if (notification === "AIR_RESULTS") {
				if (this.config.useAir != false){
					this.processAIR(payload);
				}
			}
			if (notification === "ALERT_RESULTS") {
				this.processAlert(payload);
			}
			this.updateDom(this.config.animationSpeed);
		},

		getTime: function() {
			var format = config.timeFormat;
			var location = config.language;
			var langFile = this.config.langFile;

			var time = new Date();
			if (format === 12) {
				time = time.toLocaleString(langFile[location], {
						hour: "numeric",
						minute: "numeric",
						hour12: true
					});
			} else {
				time = time.toLocaleString(langFile[location], {
						hour: "numeric",
						minute: "numeric",
						hour12: false
					});
			}
			return time;
		},

		getDom: function() {

			var wrapper = document.createElement("div");
			wrapper.style.maxWidth = this.config.maxWidth;

			if (!this.loaded) {
				wrapper.classList.add("small", "bright");
				wrapper.innerHTML = this.translate("GATHERING WEATHER STUFF");
				return wrapper;
			}

			var current = this.current;

			var d = new Date();
			var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
			var month = d.getUTCMonth() + 1; //months from 1-12
			var day = d.getUTCDate();
			var year = d.getUTCFullYear();
        
        
			if (this.config.units != "metric") {
				if (this.config.dformat == true) {
					var newdatea = this.translate(days[d.getDay()]) + " " + month + "/" + day + "/" + year;
				} else {
					var newdatea = this.translate(days[d.getDay()]) + " " + day + "/" + month + "/" + year;
				}
			} else {
				if (this.config.dformat == true) {
					var newdatea = this.translate(days[d.getDay()]) + " " + month + "." + day + "." + year;
				} else {
					var newdatea = this.translate(days[d.getDay()]) + " " + day + "." + month + "." + year;
				}
			}
        
			var n = d.getHours();


			if (this.config.showClock == true) {
				var CurTime = document.createElement("div");
				CurTime.classList.add("large", "fontClock");
				CurTime.innerHTML = this.getTime();
				wrapper.appendChild(CurTime);
			}

			if (this.config.showGreet == true) {
				var Greet = document.createElement("div");
				if (this.config.name != "") {
					if (n < 12) {
						Greet.classList.add("bright", "medium", "amclock");
						Greet.innerHTML = this.translate("Good Morning ") + this.config.name + "!";
					} else if (n > 12 && n < 18) {
						Greet.classList.add("bright", "medium", "eclock");
						Greet.innerHTML = this.translate("Good Afternoon ") + this.config.name + "!";
					} else if (n > 18 && n < 24) {
						Greet.classList.add("bright", "medium", "pmclock");
						Greet.innerHTML = this.translate("Good Evening ") + this.config.name + "!";
					}
				} else {
					if (n < 12) {
						Greet.classList.add("bright", "medium", "amclock");
						Greet.innerHTML = this.translate("Good Morning!");
					} else if (n > 12 && n < 18) {
						Greet.classList.add("bright", "medium", "eclock");
						Greet.innerHTML = this.translate("Good Afternoon!");
					} else if (n > 18 && n < 24) {
						Greet.classList.add("bright", "medium", "pmclock");
						Greet.innerHTML = this.translate("Good Evening!");
					}
				}
				wrapper.appendChild(Greet);
			}

			if (this.config.showDate != false) {
				var CurDate = document.createElement("div");
				CurDate.classList.add("medium", "fontClock");
				CurDate.innerHTML = newdatea;
				wrapper.appendChild(CurDate);
			}

		var wDiv = document.createElement("div");
        wDiv.classList.add("wDiv");
        
        var crtLogo = document.createElement("span");
        crtLogo.classList.add("img", "topset");
        if (n < 17){
        crtLogo.innerHTML = "<img class = 'icon2' src='modules/MMM-NOAA/images/" + current.icon + ".png'>";
        } else {
		crtLogo.innerHTML = "<img class = 'icon2' src='modules/MMM-NOAA/images/nt_" + current.icon + ".png'>";		
		}
		wDiv.appendChild(crtLogo);
        wrapper.appendChild(wDiv);


			var cTempHigh = document.createElement("span");
			cTempHigh.classList.add("bright", "wFont");
			if (this.config.units != "metric") {
				if (current.temp_f > 80) {
					cTempHigh.innerHTML = "&nbsp;&nbsp;" + Math.round(current.temp_f) + "&#730;</font>";
				} else {
					cTempHigh.innerHTML = "&nbsp;&nbsp;" + Math.round(current.temp_f) + "&#730;";
				}
			} else {
				if (current.temp_c > 26) {
					cTempHigh.innerHTML = "<font color=#7dfafd>" + Math.round(current.temp_c) + "&#730;</font>";
				} else {
					cTempHigh.innerHTML = Math.round(current.temp_c) + "&#730;";
				}
			}
			wDiv.appendChild(cTempHigh);
			wrapper.appendChild(wDiv);


			var curCon = document.createElement("div");
			curCon.classList.add("xsmall", "bright");
			if (this.config.language != 'nb'){
				curCon.innerHTML = this.translate("Currently: ") + current.weather;	
			} else {
				curCon.innerHTML = this.translate("Currently: ") + this.translate(current.weather);	
			}
			wrapper.appendChild(curCon);

		
			if (this.config.useAir != false) {

				var cpCondition = document.createElement("span");
				if (this.config.position != 'top_left' || this.config.position != "top_left"){
					cpCondition.classList.add("xsmall", "bright", "rset");	
				} else {
					cpCondition.classList.add("xsmall", "bright", "set");	
				}
				if (current.UV >= 0 && current.UV < 3) {
					cpCondition.innerHTML = this.translate("UVI")  +"<div class=box><b>" + current.UV + " G</b></div>";
				} else if (current.UV > 2 && current.UV < 6) {
					cpCondition.innerHTML = this.translate("UVI ") +"<div class=box><b>" + current.UV + "</b></div>";
				} else if (current.UV > 5 && current.UV < 8) {
					cpCondition.innerHTML = this.translate("UVI ") + "<div class=box><b>" + current.UV +  "</b></div>";
				} else if (current.UV > 7 && current.UV < 11) {
					cpCondition.innerHTML = this.translate("UVI ") + "<div class=box><b>" + current.UV +  "</b></div>";
				} else if (current.UV >= 11) {
					cpCondition.innerHTML = this.translate("UVI ") + "<div class=box><b>" + current.UV +  "</b></div>";
				}
				wrapper.appendChild(cpCondition);

				var aqius = this.air.aqius;
				var aqi = document.createElement("span");
				if (this.config.position != 'top_left' || this.config.position != "top_left"){
					aqi.classList.add("xsmall", "bright", "rset");	
				} else {
					aqi.classList.add("xsmall", "bright", "set");	
				}
				if (aqius < 51) {
					aqi.innerHTML = this.translate("AQI") + "<div class=box><b>" + aqius + " G</b></div>";
				} else if (aqius > 50 && aqius < 101) {
					aqi.innerHTML = this.translate("AQI ") + "<div class=box><b>" + aqius + "Y</b></div>";
				} else if (aqius > 100 && aqius < 151) {
					aqi.innerHTML = this.translate("AQI ") + "<div class=box><b>" + aqius + "O</b></div>";
				} else if (aqius > 150 && aqius < 201) {
					aqi.innerHTML = this.translate("AQI ") + "<div class=box><b>" + aqius + "R</b></div>";
				} else {
					aqi.innerHTML = this.translate("AQI ") + "<div class=box><b>" + aqius + "P</b></div>";
				}
				wrapper.appendChild(aqi);
				dopo = true;

			}

			if (this.config.showHum != false){
				var reHumid = current.relative_humidity.substring(0, 2);
				var ccurHumid = document.createElement("div");
				if (this.config.position != 'top_left' || this.config.position != "top_left"){
					ccurHumid.classList.add("xsmall", "bright", "rset");	
				} else {
					ccurHumid.classList.add("xsmall", "bright", "set");	
				}
				ccurHumid.classList.add("xsmall", "bright", "set");
				ccurHumid.innerHTML = this.translate("Hum") + "<div class=box><b>" + current.relative_humidity + "</b></div>";
				wrapper.appendChild(ccurHumid);

       
				"BARO<div class=box><b>" + current.pressure_in + "<b>";

				if (this.config.showBar != false){
					var bP = document.createElement("div");
					if (this.config.position != 'top_left' || this.config.position != "top_left"){
						bP.classList.add("xsmall", "bright", "rset");	
					} else {
						bP.classList.add("xsmall", "bright", "set");	
					}
					if (this.config.units == "imperial") {
						if (current.pressure_trend === "+") {
							bP.innerHTML = this.translate("BARO") +"<div class=baro><b>" + current.pressure_in +   "<b>&uarr; </div>";
						} else if (current.pressure_trend === "-") {
							bP.innerHTML = this.translate("BARO") +"<div class=baro><b>" + current.pressure_in +   "<b>&darr; </div>";
						} else {
							bP.innerHTML = this.translate("BARO") +"<div class=baro><b>" + current.pressure_in +   "<b></div>";
						}
					} else {
						if (current.pressure_trend === "+") {
							bP.innerHTML = this.translate("hPa ") +"<div class=baro><b>" + current.pressure_mb +   "<b>&uarr; </div>";
						} else if (current.pressure_trend === "-") {
							bP.innerHTML = this.translate("hPa ") +"<div class=baro><b>" + current.pressure_mb +   "<b>&darr; </div>";
						} else {
							bP.innerHTML = this.translate("hPa ") +"<div class=baro><b>" + current.pressure_mb +   "<b></div>";
						}

					}
					wrapper.appendChild(bP);
				}
				dopo = true;
			}

			if (dopo == true) {
				var spacer = document.createElement("div");
				spacer.classList.add("small", "bright", "font");
				spacer.innerHTML = "<br><br>";
				wrapper.appendChild(spacer);
				dopo = false;
			}

			if (this.config.showWind != false) {

       			       if (current.wind_mph > 0 || current.wind_kph > 0){
					var wind = document.createElement("div");
					wind.classList.add("xsmall", "bright");
					if (this.config.units != "metric") {
						wind.innerHTML = this.translate("Wind: ") + current.wind_mph + " mph ~ " + this.translate("From: ") + current.wind_dir;
               
					} else {
               
						wind.innerHTML = this.translate("Wind: ") + current.wind_kph + " kph ~ " + this.translate("From: ") + current.wind_dir;
               
					}
					wrapper.appendChild(wind);
				}
			  }
		
			var srss = this.srss;


			var Dlength = document.createElement("div");
			Dlength.classList.add("xsmall", "bright", "font");
			Dlength.innerHTML = this.translate("Amount of Daylight") + ": " + this.secondsToString();
			wrapper.appendChild(Dlength);

			if (this.config.lat != "" && this.config.lon != "") {
				var sunrise = srss.sunrise;
				var sunset = srss.sunset;
				var utcsunrise = moment.utc(sunrise).toDate();
				var utcsunset = moment.utc(sunset).toDate();
				var sunrise = this.config.ampm == true ? moment(utcsunrise).local().format("h:mm A") : moment(utcsunrise).local().format("H:mm");
				var sunset = this.config.ampm == true ? moment(utcsunset).local().format("h:mm A") : moment(utcsunset).local().format("H:mm");


				var Rdate = document.createElement("div");
				if (n < 12) {
					Rdate.classList.add("bright", "xsmall", "amclock");
				} else if (n > 12 && n < 21) {
					Rdate.classList.add("bright", "xsmall", "eclock");
				} else {
					Rdate.classList.add("bright", "xsmall", "pmclock");
				}
				Rdate.innerHTML = "<img class = srss src='modules/MMM-NOAA/images/sunrise1.png'> " + sunrise + " &nbsp;&nbsp;&nbsp;<img class = srss src='modules/MMM-NOAA/images/sunset1.png'> " + sunset + "<br><br>";
				wrapper.appendChild(Rdate);
			}

			if (this.config.showForecast != false) {
				var top = document.createElement("div");
				//top.classList.add("imgs","text");

				var weatherTable = document.createElement("table");
				//weatherTable.classList.add("text");

				var forecastRow = document.createElement("tr");

				var first = document.createElement("th");
				var tempSymbol = document.createElement("i");
				first.appendChild(tempSymbol);
				forecastRow.appendChild(first);

				var spacer = document.createElement("th");
				forecastRow.appendChild(spacer);

				if (current.temp_f > 32) {
					var second = document.createElement("th");
					var tempSymbol = document.createElement("i");
					tempSymbol.classList.add("wi", "wi-umbrella");
					second.appendChild(tempSymbol);
					forecastRow.appendChild(second);
				} else {
					var second = document.createElement("th");
					var tempSymbol = document.createElement("i");
					tempSymbol.classList.add("wi", "wi-snowflake-cold");
					second.appendChild(tempSymbol);
					forecastRow.appendChild(second);
				}

				var third = document.createElement("th");
				var currentHSymbol = document.createElement("i");
				currentHSymbol.classList.add("wi", "wi-thermometer");
				third.appendChild(currentHSymbol);
				forecastRow.appendChild(third);

				var fourth = document.createElement("th");
				var currentWindSymbol = document.createElement("i");
				currentWindSymbol.classList.add("wi", "wi-thermometer-exterior");
				fourth.appendChild(currentWindSymbol);
				forecastRow.appendChild(fourth);

				var fifth = document.createElement("th");
				var currentWSymbol = document.createElement("i");
				currentWSymbol.classList.add("wi", "wi-humidity");
				fifth.appendChild(currentWSymbol);
				forecastRow.appendChild(fifth);

				weatherTable.appendChild(forecastRow);

				for (i = 0; i < this.forecast.length; i++) {
					var noaa = this.forecast[i];

					var TDrow = document.createElement("tr");
					TDrow.classList.add("xsmall", "bright");
					TDrow.setAttribute('style', 'line-height: 30%;');

					var d = new Date();
					var weekday = new Array(7);
					weekday[0] = "Sun";
					weekday[1] = "Mon";
					weekday[2] = "Tue";
					weekday[3] = "Wed";
					weekday[4] = "Thu";
					weekday[5] = "Fri";
					weekday[6] = "Sat";

					var n = this.translate(weekday[d.getDay()]);

					var td1 = document.createElement("td");
					if (noaa.date.weekday_short == n) {
						td1.innerHTML = this.translate("Today");
						if (this.config.flash != false){
							td1.classList.add("pulse");	
						}
					} else {
						td1.innerHTML = this.translate(noaa.date.weekday_short);
					}
					TDrow.appendChild(td1);
					weatherTable.appendChild(TDrow);

					var td2 = document.createElement("td");
					td2.innerHTML = "<img src='modules/MMM-NOAA/images/" + noaa.icon + ".png' height='22' width='28'>&nbsp;&nbsp;";
					TDrow.appendChild(td2);
					weatherTable.appendChild(TDrow);

					var td3 = document.createElement("td");
					//td3.classList.add("small","bright");
					td3.innerHTML = noaa.pop + "%";
					TDrow.appendChild(td3);
					weatherTable.appendChild(TDrow);

					var td5 = document.createElement("td");
					//td5.classList.add("xsmall", "bright");
					if (this.config.units != "metric") {
						td5.innerHTML = noaa.high.fahrenheit + "&#730;";
					} else {
						td5.innerHTML = noaa.high.celsius + "&#730;";
					}
					TDrow.appendChild(td5);
					weatherTable.appendChild(TDrow);

					var td7 = document.createElement("td");
					if (this.config.units != "metric") {
						td7.innerHTML = noaa.low.fahrenheit + "&#730;";
					} else {
						td7.innerHTML = noaa.low.celsius + "&#730;";
					}
					TDrow.appendChild(td7);
					weatherTable.appendChild(TDrow);

					var td6 = document.createElement("td");
					td6.innerHTML = noaa.avehumidity + "%";
					TDrow.appendChild(td6);
					weatherTable.appendChild(TDrow);

					top.appendChild(weatherTable);
					wrapper.appendChild(top);
				}
			}

                        if (this.config.alert != false){
			var alert = this.amess[0];

			if (typeof alert != 'undefined'){			
				
				var all = document.createElement("div");
				all.classList.add("bright", "xsmall", "alert");
     				all.innerHTML = "<BR>" + this.translate("***ALERT***") + "<br><br>";
				wrapper.appendChild(all);

				var Alert = [];
				var Level = [];
				for(var i = 0; i < c; i++){

					var alert = this.amess[i];

					Level[i] = document.createElement("div");
					Level[i].classList.add("bright", "xsmall", "alerts");
					Level[i].innerHTML =  this.translate("Warning Level: ") + alert.level + "<br>";
					wrapper.appendChild(Level[i]);
					

					Alert[i] = document.createElement("div");
					Alert[i].classList.add("bright", "xsmall", "aler");
					Alert[i].innerHTML = "<font color=" + this.config.levelTrans[alert.level] +">" + alert.desc + "<br>";
					wrapper.appendChild(Alert[i]);
				}
				}
			}

			return wrapper;
		},
	
	/////  Add this function to the modules you want to control with voice //////

    notificationReceived: function(notification, payload) {
        if (notification === 'HIDE_COWBOY') {
            this.hide(1000);
            this.updateDom(300);
        }  else if (notification === 'SHOW_COWBOY') {
            this.show(1000);
            this.updateDom(300);
        }
		
	},
	
});
