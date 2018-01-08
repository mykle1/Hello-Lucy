/* global Module */
/* Magic Mirror
 * Module: WunderGround
 *
 * By RedNax
 * MIT Licensed.
 */
Module.register("MMM-WunderGround", {

    // Default module config.
    defaults: {
        apikey: "",
        pws: "",
        currentweather: 1,
        coloricon: false,
        units: config.units,
        windunits: "bft", // choose from mph, bft
        updateInterval: 10 * 60 * 1000, // every 10 minutes
        animationSpeed: 1000,
        timeFormat: config.timeFormat,
        lang: config.language,
        showWindDirection: true,
        fade: true,
        fadePoint: 0.25, // Start on 1/4th of the list.
        tz: "",
        fcdaycount: "5",
        fcdaystart: "0",
		daily: "1",
        hourly: "0",
        hourlyinterval: "3",
        hourlycount: "2",
        fctext: "1",
        alerttime: 5000,
        roundTmpDecs: 1,
        UseCardinals: 0,
        layout: "vertical",
        sysstat: 0,
        scaletxt: 1,
        iconset: "VCloudsWeatherIcons",
		debug: 0,
		socknot: "GET_WUNDERGROUND",
		sockrcv: "WUNDERGROUND",
        enableCompliments: 0,

        retryDelay: 2500,

        apiBase: "http://api.wunderground.com/api/",

        iconTableDay: {
            "chanceflurries": "wi-day-snow-wind",
            "chancerain": "wi-day-showers",
            "chancesleet": "wi-day-sleet",
            "chancesnow": "wi-day-snow",
            "chancetstorms": "wi-day-storm-showers",
            "clear": "wi-day-sunny",
            "cloudy": "wi-cloud",
            "flurries": "wi-snow-wind",
            "fog": "wi-fog",
            "haze": "wi-day-haze",
            "hazy": "wi-day-haze",
            "mostlycloudy": "wi-cloudy",
            "mostlysunny": "wi-day-sunny-overcast",
            "partlycloudy": "wi-day-cloudy",
            "partlysunny": "wi-day-cloudy-high",
            "rain": "wi-rain",
            "sleet": "wi-sleet",
            "snow": "wi-snow",
            "tstorms": "wi-thunderstorm"
        },

        iconTableNight: {
            "chanceflurries": "wi-night-snow-wind",
            "chancerain": "wi-night-showers",
            "chancesleet": "wi-night-sleet",
            "chancesnow": "wi-night-alt-snow",
            "chancetstorms": "wi-night-alt-storm-showers",
            "clear": "wi-night-clear",
            "cloudy": "wi-night-alt-cloudy",
            "flurries": "wi-night-alt-snow-wind",
            "fog": "wi-night-fog",
            "haze": "wi-night-alt-cloudy-windy",
            "hazy": "wi-night-alt-cloudy-windy",
            "mostlycloudy": "wi-night-alt-cloudy",
            "mostlysunny": "wi-night-alt-partly-cloudy",
            "partlycloudy": "wi-night-alt-partly-cloudy",
            "partlysunny": "wi-night-alt-partly-cloudy",
            "rain": "wi-night-alt-rain",
            "sleet": "wi-night-alt-sleet",
            "snow": "wi-night-alt-snow",
            "tstorms": "wi-night-alt-thunderstorm"
        },
        
        iconTableCompliments: {
            "chanceflurries": "13",
            "chancerain": "10",
            "chancesleet": "13",
            "chancesnow": "13",
            "chancetstorms": "11",
            "clear": "01",
            "cloudy": "02",
            "flurries": "13",
            "fog": "50",
            "haze": "50",
            "hazy": "50",
            "mostlycloudy": "03",
            "mostlysunny": "02",
            "partlycloudy": "02",
            "partlysunny": "02",
            "rain": "10",
            "sleet": "13",
            "snow": "13",
            "tstorms": "11"
        }

    },

    // Define required translations.
    getTranslations: function() {
        return {
            en: "translations/en.json",
            nl: "translations/nl.json",
            de: "translations/de.json",
            dl: "translations/de.json",
            fr: "translations/fr.json",
            pl: "translations/pl.json"

        };
    },

    // Define required scripts.
    getScripts: function() {
        return ["moment.js"];
    },

    // Define required scripts.
    getStyles: function() {
        return ["weather-icons.css", "weather-icons-wind.css",
            "MMM-WunderGround.css"
        ];
    },

    // Define start sequence.
    start: function() {
        Log.info("Starting module: " + this.name);

        // Set locale.
        moment.locale(config.language);

        this.forecast = [];
        this.hourlyforecast = [];
        this.loaded = false;
        this.error = false;
        this.errorDescription = "";
        this.getWunder();
        this.updateTimer = null;
        this.systemp = "";
        this.wifiap = "";
        this.wifistrength = "";
        this.storage_size = 0;
        this.storage_used = 0;
        this.storage_free = 0;
        this.storage_pcent = 0;
        this.mem_used = 0;
        this.mem_size = 0;
        this.mem_free = 0;
        this.haveforecast = 0;

    },

    getWunder: function() {
        if ( this.config.debug === 1 ) {
			Log.info("WunderGround: Getting weather.");
		}
        //this.sendSocketNotification("GET_WUNDERGROUND", this.config);
		this.sendSocketNotification(this.config.socknot, this.config);
    },

    // Override dom generator.
    getDom: function() {
        var wrapper = document.createElement("div");
        var f;
        var forecast;
        var iconCell;
        var icon;
        var maxTempCell;
        var minTempCell;
        var popCell;
        var mmCell;
        var hourCell;
        var dayCell;
        var startingPoint;
        var currentStep;
        var steps;

        
        if (this.config.apikey === "") {
            wrapper.innerHTML = this.translate("APIKEY") + this.name +
                ".";
            wrapper.className = "dimmed light small";
            return wrapper;
        }

        if (this.error) {
            wrapper.innerHTML = "Error: " + this.errorDescription;
            wrapper.className = "dimmed light small";
            return wrapper;
        }

        if (!this.loaded) {
            wrapper.innerHTML = this.translate("LOADING");
            wrapper.className = "dimmed light small";
            return wrapper;
        }
        if (this.config.currentweather === 1) {
            var small = document.createElement("div");
            small.className = "normal medium";

            var spacer = document.createElement("span");
            spacer.innerHTML = "&nbsp;";

            var table_sitrep = document.createElement("table");

            var row_sitrep = document.createElement("tr");


            var windIcon = document.createElement("td");
            if (this.config.windunits == "mph") {
                windIcon.innerHTML = this.windSpeedMph + "<sub>mph</sub>";
            } else {
                windIcon.className = "wi " + this.windSpeed;
            }
            row_sitrep.appendChild(windIcon);
            row_sitrep.className = "pop";

            var windDirectionIcon = document.createElement("td");
            if (this.config.UseCardinals === 0) {
                windDirectionIcon.className = "wi wi-wind " + this.windDirection;
                windDirectionIcon.innerHTML = "&nbsp;";
            } else {
                windDirectionIcon.innerHTML = this.windDirectionTxt;
            }
            row_sitrep.appendChild(windDirectionIcon);

            var HumidityIcon = document.createElement("td");
            HumidityIcon.className = "wi wi-humidity lpad";
            row_sitrep.appendChild(HumidityIcon);

            var HumidityTxt = document.createElement("td");
            HumidityTxt.innerHTML = this.Humidity + "&nbsp;";
            HumidityTxt.className = "vcen left";
            row_sitrep.appendChild(HumidityTxt);

            var sunriseSunsetIcon = document.createElement("td");
            sunriseSunsetIcon.className = "wi " + this.sunriseSunsetIcon;
            row_sitrep.appendChild(sunriseSunsetIcon);

            var sunriseSunsetTxt = document.createElement("td");
            sunriseSunsetTxt.innerHTML = this.sunriseSunsetTime;
            sunriseSunsetTxt.className = "vcen left";
            row_sitrep.appendChild(sunriseSunsetTxt);

            var moonPhaseIcon = document.createElement("td");
            moonPhaseIcon.innerHTML = this.moonPhaseIcon;
            row_sitrep.appendChild(moonPhaseIcon);

            table_sitrep.appendChild(row_sitrep);
            small.appendChild(table_sitrep);

            var large = document.createElement("div");
            large.className = "large light";

            var weatherIcon = document.createElement("span");
            if (this.config.coloricon) {
                weatherIcon.innerHTML = this.weatherTypeTxt;
            } else {
                weatherIcon.className = "wi " + this.weatherType;
            }

            var temperature = document.createElement("span");
            temperature.className = "bright";
            temperature.innerHTML = " " + this.temperature + "&deg;";
            large.appendChild(weatherIcon);
            large.appendChild(temperature);

            wrapper.appendChild(small);
            wrapper.appendChild(large);

        }

        // Forecast table

        var table = document.createElement("table");
        table.className = "small";
        table.setAttribute("width", "25%");

        // this.config.layout = "vertical";

        if (this.config.layout == "vertical") {

            var row = document.createElement("tr");
            table.appendChild(row);

            if (this.config.fctext == 1) {
                var forecastTextCell = document.createElement("td");
                // forecastTextCell.className = "forecastText";
                forecastTextCell.setAttribute("colSpan", "10");
                forecastTextCell.innerHTML = this.forecastText;

                row.appendChild(forecastTextCell);
            }

            row = document.createElement("tr");

            var dayHeader = document.createElement("th");
            dayHeader.className = "day";
            dayHeader.innerHTML = "";
            row.appendChild(dayHeader);

            var iconHeader = document.createElement("th");
            iconHeader.className = "tableheader icon";
            iconHeader.innerHTML = "";
            row.appendChild(iconHeader);

            var maxtempHeader = document.createElement("th");
            maxtempHeader.className = "align-center bright tableheader";
            row.appendChild(maxtempHeader);

            var maxtempicon = document.createElement("span");
            maxtempicon.className = "wi wi-thermometer";
            maxtempHeader.appendChild(maxtempicon);


            var mintempHeader = document.createElement("th");
            mintempHeader.className = "align-center bright tableheader";
            row.appendChild(mintempHeader);

            var mintempicon = document.createElement("span");
            mintempicon.className = "wi wi-thermometer-exterior";
            mintempHeader.appendChild(mintempicon);


            var popiconHeader = document.createElement("th");
            popiconHeader.className = "align-center bright tableheader";
            popiconHeader.setAttribute("colSpan", "10");
            row.appendChild(popiconHeader);

            var popicon = document.createElement("span");
            popicon.className = "wi wi-umbrella";
            popicon.setAttribute("colSpan", "10");
            popiconHeader.appendChild(popicon);

            table.appendChild(row);

            if (this.config.hourly == 1) {
                for (f in this.forecast) {
                    forecast = this.hourlyforecast[f * this.config.hourlyinterval];

                    row = document.createElement("tr");
                    table.appendChild(row);

                    hourCell = document.createElement("td");
                    hourCell.className = "hourv";
                    hourCell.innerHTML = forecast.hour;
                    row.appendChild(hourCell);

                    iconCell = document.createElement("td");
                    iconCell.className =
                        "align-center bright weather-icon";
                    row.appendChild(iconCell);

                    icon = document.createElement("span");
                    if (this.config.coloricon) {
                        icon.innerHTML = forecast.icon_url;
                    } else {
                        icon.className = "wi " + forecast.icon;
                    }
                    iconCell.appendChild(icon);

                    maxTempCell = document.createElement("td");
                    maxTempCell.innerHTML = forecast.maxTemp + "&deg;";
                    maxTempCell.className = "align-right max-temp";
                    row.appendChild(maxTempCell);

                    minTempCell = document.createElement("td");
                    minTempCell.innerHTML = forecast.minTemp + "&deg;";
                    minTempCell.className = "align-right min-temp";
                    row.appendChild(minTempCell);

                    popCell = document.createElement("td");
                    popCell.innerHTML = forecast.pop + "%";
                    popCell.className = "align-right pop";
                    row.appendChild(popCell);

                    mmCell = document.createElement("td");
                    mmCell.innerHTML = forecast.mm;
                    mmCell.className = "align-right mm";
                    row.appendChild(mmCell);

                    if (f > this.config.hourlycount) {
                        break;
                    }
					
					if (this.config.daily == 0) {
					
						if (this.config.fade && this.config.fadePoint < 1) {
							if (this.config.fadePoint < 0) {
								this.config.fadePoint = 0;
							}
							startingPoint = this.forecast.length * this.config.fadePoint;
							steps = this.forecast.length - startingPoint;
							if (f >= startingPoint) {
								currentStep = f - startingPoint;
								row.style.opacity = 1 - (1 / steps *
									currentStep);
							}
						}
					}

                }
            }


            if (this.config.daily == 1) {
				for (f in this.forecast) {
					forecast = this.forecast[f];

					row = document.createElement("tr");
					table.appendChild(row);
	
					dayCell = document.createElement("td");
					dayCell.className = "day";
					dayCell.innerHTML = forecast.day;
					row.appendChild(dayCell);

					iconCell = document.createElement("td");
					iconCell.className = "align-center bright weather-icon";
					row.appendChild(iconCell);

					icon = document.createElement("span");
					if (this.config.coloricon) {
						icon.innerHTML = forecast.icon_url;
					} else {
						icon.className = "wi " + forecast.icon;
					}
					iconCell.appendChild(icon);

					maxTempCell = document.createElement("td");
					maxTempCell.innerHTML = forecast.maxTemp + "&deg;";
					maxTempCell.className = "align-right max-temp";
					row.appendChild(maxTempCell);
	
					minTempCell = document.createElement("td");
					minTempCell.innerHTML = forecast.minTemp + "&deg;";
					minTempCell.className = "align-right min-temp";
					row.appendChild(minTempCell);
	
					popCell = document.createElement("td");
					popCell.innerHTML = forecast.pop + "%";
					popCell.className = "align-right pop";
					row.appendChild(popCell);

					mmCell = document.createElement("td");
					mmCell.innerHTML = forecast.mm;
					mmCell.className = "align-right mm";
					row.appendChild(mmCell);

					if (this.config.fade && this.config.fadePoint < 1) {
						if (this.config.fadePoint < 0) {
							this.config.fadePoint = 0;
						}
						startingPoint = this.forecast.length * this.config.fadePoint;
						steps = this.forecast.length - startingPoint;
						if (f >= startingPoint) {
							currentStep = f - startingPoint;
							row.style.opacity = 1 - (1 / steps *
								currentStep);
						}
					}
				}
            }


            wrapper.appendChild(table);

        } else {

            // horizontal

            var fctable = document.createElement("div");
            var divider = document.createElement("hr");
            divider.className = "hrDivider";
            fctable.appendChild(divider);

            if (this.config.fctext == 1) {
                var row = document.createElement("tr");
                var forecastTextCell = document.createElement("td");

                forecastTextCell.className = "forecastText";
                forecastTextCell.setAttribute("colSpan", "10");
                forecastTextCell.innerHTML = this.forecastText;

                row.appendChild(forecastTextCell);
                table.appendChild(row);
                fctable.appendChild(table);
                fctable.appendChild(divider.cloneNode(true));
            }

            table = document.createElement("table");
            table.className = "small";
            table.setAttribute("width", "25%");

            if (this.config.sysstat == 1) {

                row_mem = document.createElement("tr");
                row_storage = document.createElement("tr");
                row_stemp = document.createElement("tr");
                row_wifi = document.createElement("tr");

                iconCell = document.createElement("td");
                iconCell.className = "align-right bright weather-icon";

                icon = document.createElement("span");
                icon.className = "wi wi-thermometer";

                iconCell.appendChild(icon);
                row_stemp.appendChild(iconCell);

                sysTempCell = document.createElement("td");
                sysTempCell.innerHTML = this.systemp;
                sysTempCell.className = "align-left";
                row_stemp.appendChild(sysTempCell);

                iconCell = document.createElement("td");
                iconCell.className = "align-right bright weather-icon";
                icon = document.createElement("span");

                icon.className = "fa fa-wifi ";
                iconCell.appendChild(icon);
                row_stemp.appendChild(iconCell);

                WifiCell = document.createElement("td");
                WifiCell.innerHTML = this.wifiap + " @ " + this.wifistrength + "%";
                WifiCell.className = "align-left";

                row_stemp.appendChild(WifiCell);
                table.appendChild(row_stemp);

                FillCell = document.createElement("td");
                row_mem.appendChild(FillCell);
                FillCell = document.createElement("td");
                FillCell.innerHTML = "Size";
                row_mem.appendChild(FillCell);
                FillCell = document.createElement("td");
                FillCell.innerHTML = "Used";
                row_mem.appendChild(FillCell);
                FillCell = document.createElement("td");
                FillCell.innerHTML = "Free";
                row_mem.appendChild(FillCell);
                table.appendChild(row_mem);

                row_mem = document.createElement("tr");
                FillCell = document.createElement("td");
                FillCell.innerHTML = "Memory";
                row_mem.appendChild(FillCell);
                FillCell = document.createElement("td");
                FillCell.innerHTML = this.mem_size;
                row_mem.appendChild(FillCell);
                FillCell = document.createElement("td");
                FillCell.innerHTML = this.mem_used;
                row_mem.appendChild(FillCell);
                FillCell = document.createElement("td");
                FillCell.innerHTML = this.mem_free;
                row_mem.appendChild(FillCell);
                table.appendChild(row_mem);

                row_mem = document.createElement("tr");
                FillCell = document.createElement("td");
                FillCell.innerHTML = "Storage";
                row_mem.appendChild(FillCell);
                FillCell = document.createElement("td");
                FillCell.innerHTML = this.storage_size;
                row_mem.appendChild(FillCell);
                FillCell = document.createElement("td");
                FillCell.innerHTML = this.storage_used;
                row_mem.appendChild(FillCell);
                FillCell = document.createElement("td");
                FillCell.innerHTML = this.storage_free;
                row_mem.appendChild(FillCell);
                table.appendChild(row_mem);

                fctable.appendChild(table);
                fctable.appendChild(document.createElement("hr"));

                table = document.createElement("table");
                table.className = "small";
                table.setAttribute("width", "25%");

            }

            if (this.config.hourly == 1) {

                row_time = document.createElement("tr");
                row_icon = document.createElement("tr");
                row_temp = document.createElement("tr");
                row_pop = document.createElement("tr");
                row_wind = document.createElement("tr");


                for (f in this.forecast) {
                    forecast = this.hourlyforecast[f * this.config.hourlyinterval];

                    hourCell = document.createElement("td");
                    hourCell.className = "hour";
                    hourCell.innerHTML = forecast.hour;
                    row_time.appendChild(hourCell);


                    iconCell = document.createElement("td");
                    iconCell.className = "align-center bright weather-icon";
                    icon = document.createElement("span");
                    if (this.config.coloricon) {
                        icon.innerHTML = forecast.icon_url;
                    } else {
                        icon.className = "wi " + forecast.icon;
                    }
                    iconCell.appendChild(icon);
                    row_icon.appendChild(iconCell);

                    maxTempCell = document.createElement("td");
                    maxTempCell.innerHTML = forecast.maxTemp + "&deg;/" + forecast.minTemp + "&deg;";
                    maxTempCell.className = "hour";
                    row_temp.appendChild(maxTempCell);

                    mmCell = document.createElement("td");

                    if (this.config.units == "metric") {
                        mmCell.innerHTML = forecast.pop + "%/" + forecast.mm;
                        mmCell.className = "hour";
                    } else {
                        mmCell.innerHTML = forecast.pop + "%/" + forecast.mm;
                        mmCell.className = "hour";

                    }

                    row_pop.appendChild(mmCell);

                    var windDirectionIcon = document.createElement("td");
                    windDirectionIcon.className = "center";

                    windDirectionIconCell = document.createElement("i");
                    if (this.config.windunits == "mph") {
                        windDirectionIconCell.innerHTML = forecast.windSpdMph + "<sub>mph</sub>";
                    } else {
                        windDirectionIconCell.className = "wi " + forecast.windSpd;
                    }
                    windDirectionIcon.appendChild(windDirectionIconCell);

                    var spacer = document.createElement("i");
                    spacer.innerHTML = "&nbsp;&nbsp;";
                    windDirectionIcon.appendChild(spacer);


                    windDirectionIconCell = document.createElement("i");

                    if (this.config.UseCardinals === 0) {
                        windDirectionIconCell.className = "wi wi-wind " + forecast.windDir;
                    } else {
                        windDirectionIconCell.className = "smaller";
                        windDirectionIconCell.innerHTML = this.windDirImp;
                    }
                    windDirectionIcon.appendChild(windDirectionIconCell);

                    row_wind.appendChild(windDirectionIcon);




                    var nl = Number(f) + 1;
                    if ((nl % 4) === 0) {
                        table.appendChild(row_time);
                        table.appendChild(row_icon);
                        table.appendChild(row_temp);
                        table.appendChild(row_pop);
                        table.appendChild(row_wind);
                        row_time = document.createElement("tr");
                        row_icon = document.createElement("tr");
                        row_temp = document.createElement("tr");
                        row_pop = document.createElement("tr");
                        row_wind = document.createElement("tr");
                    }

                    if (f > this.config.hourlycount) {
                        break;
                    }
                }


                table.appendChild(row_time);
                table.appendChild(row_icon);
                table.appendChild(row_temp);
                table.appendChild(row_pop);
                table.appendChild(row_wind);
                fctable.appendChild(table);
                fctable.appendChild(divider.cloneNode(true));

            }

            table = document.createElement("table");
            table.className = "small";
            table.setAttribute("width", "25%");

            row_time = document.createElement("tr");
            row_icon = document.createElement("tr");
            row_temp = document.createElement("tr");
            row_pop = document.createElement("tr");
            row_wind = document.createElement("tr");


			if (this.config.daily == 1) {
				for (f in this.forecast) {
					forecast = this.forecast[f];

					dayCell = document.createElement("td");
					dayCell.className = "hour";
					dayCell.innerHTML = forecast.day;
					row_time.appendChild(dayCell);

					iconCell = document.createElement("td");
					iconCell.className = "align-center bright weather-icon";

					icon = document.createElement("span");
					if (this.config.coloricon) {
						icon.innerHTML = forecast.icon_url;
					} else {
						icon.className = "wi " + forecast.icon;
					}
					iconCell.appendChild(icon);

					row_icon.appendChild(iconCell);

					maxTempCell = document.createElement("td");
					maxTempCell.innerHTML = forecast.maxTemp + "&deg;/" + forecast.minTemp + "&deg;";
					maxTempCell.className = "hour";
					row_temp.appendChild(maxTempCell);

					mmCell = document.createElement("td");
					if (this.config.units == "metric") {
						mmCell.innerHTML = forecast.pop + "%/" + forecast.mm;
						mmCell.className = "hour";
					} else {
						mmCell.innerHTML = forecast.pop + "%/" + forecast.mm;
						mmCell.className = "hour";
					}

					row_pop.appendChild(mmCell);

					windDirectionIcon = document.createElement("td");
					windDirectionIcon.className = "center";
					windDirectionIconCell = document.createElement("i");
					if (this.config.windunits == "mph") {
						windDirectionIconCell.innerHTML = forecast.windSpdMph + "<sub>mph</sub>";
					} else {
						windDirectionIconCell.className = "wi " + forecast.windSpd;
					}
					windDirectionIcon.appendChild(windDirectionIconCell);

					spacer = document.createElement("i");
					spacer.innerHTML = "&nbsp;&nbsp;";
					windDirectionIcon.appendChild(spacer);

					windDirectionIconCell = document.createElement("i");

					if (this.config.UseCardinals === 0) {
						windDirectionIconCell.className = "wi wi-wind " + forecast.windDir;
					} else {
						windDirectionIconCell.className = "smaller";
						windDirectionIconCell.innerHTML = this.windDirImp;
					}
					windDirectionIcon.appendChild(windDirectionIconCell);

					row_wind.appendChild(windDirectionIcon);

					var nl = Number(f) + 1;
					if ((nl % 4) === 0) {
						table.appendChild(row_time);
						table.appendChild(row_icon);
						table.appendChild(row_temp);
						table.appendChild(row_pop);
						table.appendChild(row_wind);
						row_time = document.createElement("tr");
						row_icon = document.createElement("tr");
						row_temp = document.createElement("tr");
						row_pop = document.createElement("tr");
						row_wind = document.createElement("tr");
					}

				}

				table.appendChild(row_time);
				table.appendChild(row_icon);
				table.appendChild(row_temp);
				table.appendChild(row_pop);
				table.appendChild(row_wind);
				fctable.appendChild(table);
				wrapper.appendChild(fctable);
			}

        }
        return wrapper;

    },
    
    /////  Add this function to the modules you want to control with voice //////

    notificationReceived: function(notification, payload) {
        if (notification === 'HIDE_WEATHER') {
            this.hide(1000);
            this.updateDom(300);
        }  else if (notification === 'SHOW_WEATHER') {
            this.show(1000);
            this.updateDom(300);
        }
            
    },
    


    /* processWeather(data)
     * Uses the received data to set the various values.
     *
     * argument data object - Weather information received form openweather.org.
     */

    processWeather: function(data) {
        if (data.current_observation.estimated.hasOwnProperty("estimated") && this.haveforecast == 1) {
            if ( this.config.debug === 1 ) {
				console.log("WeatherUnderground served us an estimated forecast. Skipping update...");
			}
            return;
        }

        this.haveforecast = 1;

        if (data.response.hasOwnProperty("error")) {
            this.errorDescription = data.response.error.description;
            this.error = true;
            this.updateDom(this.config.animationSpeed);
        } else {
            this.error = false;
            var forecast;
            var i;
            var count;
            var iconTable = this.config.iconTableDay;
            this.alerttext = "";
            this.alertmsg = "";

            var now = new Date();

            var sunrise = new Date();
            this.sunrhour = Number(data.sun_phase.sunrise.hour);
            sunrise.setHours(data.sun_phase.sunrise.hour);
            sunrise.setMinutes(data.sun_phase.sunrise.minute);

            var sunset = new Date();
            this.sunshour = Number(data.sun_phase.sunset.hour);
            sunset.setHours(data.sun_phase.sunset.hour);
            sunset.setMinutes(data.sun_phase.sunset.minute);

            // The moment().format("h") method has a bug on the Raspberry Pi.
            // So we need to generate the timestring manually.
            // See issue: https://github.com/MichMich/MagicMirror/issues/181

            var sunriseSunsetDateObject = (sunrise < now && sunset >
                now) ? sunset : sunrise;
            
            if (this.config.enableCompliments === 1) {
                var complimentIconSuffix = (sunrise < now && sunset > now) ? "d" : "n";
                var complimentIcon = '{"data":{"weather":[{"icon":"' + this.config.iconTableCompliments[data.current_observation.icon] + complimentIconSuffix + '"}]}}';
                var complimentIconJson = JSON.parse(complimentIcon);
                this.sendNotification("CURRENTWEATHER_DATA", complimentIconJson);
            }
            
            var timeString = moment(sunriseSunsetDateObject).format(
                "HH:mm");

            if (this.config.timeFormat !== 24) {
                if (this.config.showPeriod) {
                    if (this.config.showPeriodUpper) {
                        timeString = moment(sunriseSunsetDateObject).format(
                            "h:mm A");
                    } else {
                        timeString = moment(sunriseSunsetDateObject).format(
                            "h:mm a");
                    }
                } else {
                    timeString = moment(sunriseSunsetDateObject).format(
                        "h:mm");
                }
            }

            this.sunriseSunsetTime = timeString;
            this.sunriseSunsetIcon = (sunrise < now && sunset > now) ?
                "wi-sunset" : "wi-sunrise";
            this.iconTable = (sunrise < now && sunset > now) ? this.config
                    .iconTableDay : this.config.iconTableNight;
 
			var now = new Date();
			var firstAlert = 1;
 
            for (i = 0, count = data.alerts.length; i < count; i++) {
				
				var expire = data.alerts[i].expires;
				expire = expire.substring(0, expire.length - 4) + 'Z';
				if ( moment(expire).isAfter(now) ) {
  
					var talert = data.alerts[i].description;
					var malert = data.alerts[i].message;
					if (talert.length < malert.length) {
						talert = malert;
					}
					if (this.config.alerttruncatestring !== "") {
						var ialert = talert.indexOf(this.config.alerttruncatestring);
						if (ialert > 0) {
							talert = talert.substring(1, ialert);
						}
					}

					if (firstAlert === 0) {
						this.alerttext = this.alerttext + "<BR>";
					}
					
					this.alertmsg = this.alertmsg + talert;
					
					firstAlert = 0;

					this.alerttext = this.alerttext + "<B style=\"color:" +
						data.alerts[i].level_meteoalarm_name + "\">" + this
						.translate(data.alerts[i].type) + "</B>";
				}
            }

            if (this.alertmsg !== "" && this.config.show_popup == 1) {
                this.sendNotification("SHOW_ALERT", {
                    type: "alert",
                    message: this.alertmsg,
                    title: this.alerttext,
                    timer: this.config.alerttime
                });
            }

            this.weatherType = this.iconTable[data.current_observation.icon];
            
            //Log.info("observation logo " + this.weatherType)
            this.windDirection = this.deg2Cardinal(data.current_observation.wind_degrees);
            this.windDirectionTxt = data.current_observation.wind_dir;
            this.Humidity = data.current_observation.relative_humidity;
            this.Humidity = this.Humidity.substring(0, this.Humidity.length - 1);
            this.windSpeed = "wi-wind-beaufort-" + this.ms2Beaufort(data.current_observation.wind_kph);
            this.windSpeedMph = data.current_observation.wind_mph;
            this.moonPhaseIcon = "<img class='moonPhaseIcon' src='https://www.wunderground.com/graphics/moonpictsnew/moon" + data.moon_phase.ageOfMoon + ".gif'>";


            if (this.config.units == "metric") {
                this.temperature = data.current_observation.temp_c;
                var fc_text = data.forecast.txt_forecast.forecastday[0].fcttext_metric.replace(/(.*\d+)(C)(.*)/gi, "$1°C$3");
            } else {
                this.temperature = data.current_observation.temp_f;
                var fc_text = data.forecast.txt_forecast.forecastday[0].fcttext;
            }

            // Attempt to scale txt_forecast in case it results in too many lines
            // var fc_text = data.forecast.txt_forecast.forecastday[0].fcttext_metric.replace(/(.*\d+)(C)(.*)/gi, "$1°C$3");
            var fc_wrap = 35;
            var fc_flines = 3;
            var fc_scale = 100;
            if (this.config.scaletxt == 1) {
                var fc_lines = fc_text.length / fc_wrap;
                if (fc_lines > fc_flines) {
                    fc_scale = Math.round((fc_flines / fc_lines) * 100);
                    fc_wrap = Math.round(fc_wrap * (100 / fc_scale));
                }
            }
            this.forecastText = '<div style="font-size:' + fc_scale + '%">';
            this.forecastText = this.forecastText + this.wordwrap(fc_text, fc_wrap, "<BR>");
            // console.log("Wrap: " + fc_wrap + " Scale: " + fc_scale + " Lines: " + fc_lines + " Length: " + fc_text.length);

            this.temperature = this.roundValue(this.temperature);
            this.weatherTypeTxt = "<img src='./modules/MMM-WunderGround/img/" + this.config.iconset + "/" +
                data.current_observation.icon_url.replace('http://icons.wxug.com/i/c/k/', '').replace('.gif', '.png') +
                "' style='vertical-align:middle' class='currentWeatherIcon'>";

            if (this.alerttext !== "") {
                this.forecastText = "<B>" + this.alerttext + "</B><BR>" +
                    this.forecastText;
            }


            this.forecast = [];
            for (i = this.config.fcdaystart, count = data.forecast.simpleforecast
                .forecastday.length; i < this.config.fcdaycount; i++) {

                forecast = data.forecast.simpleforecast.forecastday[i];

                if (this.config.units == "metric") {
                    this.tmaxTemp = forecast.high.celsius;
                    this.tminTemp = forecast.low.celsius;
                    if (Number(forecast.snow_allday.cm) > 0) {
                        this.tmm = forecast.snow_allday.cm + "cm";
                    } else {
                        this.tmm = forecast.qpf_allday.mm + "mm";
                    }
                } else {
                    this.tmaxTemp = forecast.high.fahrenheit;
                    this.tminTemp = forecast.low.fahrenheit;
                    if (Number(forecast.snow_allday.in) > 0) {
                        this.tmm = forecast.snow_allday.in + "in";
                    } else {
                        this.tmm = forecast.qpf_allday.in + "in";
                    }
                }

                this.maxTemp = this.roundValue(this.maxTemp);
                this.minTemp = this.roundValue(this.minTemp);

                this.windDir = this.deg2Cardinal(forecast.maxwind.degrees);
                this.windDirImp = forecast.maxwind.dir;
                this.windSpd = "wi-wind-beaufort-" + this.ms2Beaufort(forecast.maxwind.kph);
                this.windSpdMph = forecast.maxwind.mph;

                this.icon_url = "<img style='max-height:100%; max-width:100%; vertical-align:middle' src='./modules/MMM-WunderGround/img/" + this.config.iconset + "/" +
                    forecast.icon_url.replace('http://icons.wxug.com/i/c/k/', '').replace('.gif', '.png') + "' class='forecastWeatherIcon'>";

                this.forecast.push({
                    day: forecast.date.weekday_short,
                    maxTemp: this.tmaxTemp,
                    minTemp: this.tminTemp,
                    icon: this.config.iconTableDay[forecast.icon],
                    icon_url: this.icon_url,
                    pop: forecast.pop,
                    windDir: this.windDir,
                    windDirImp: this.windDirImp,
                    windSpd: this.windSpd,
                    windSpdMph: this.windSpdMph,
                    mm: this.tmm
                });

            }

            if (this.config.hourly == 1) {
                this.hourlyforecast = [];
                for (i = 0, count = data.hourly_forecast.length; i <
                    count; i++) {

                    var hourlyforecast = data.hourly_forecast[i];

                    if (this.config.units == "metric") {
                        this.tmaxTemp = hourlyforecast.temp.metric;
                        this.tminTemp = hourlyforecast.feelslike.metric;
                        if (Number(forecast.snow_allday.cm) > 0) {
                            this.tmm = forecast.snow_allday.cm + "cm";
                        } else {
                            this.tmm = forecast.qpf_allday.mm + "mm";
                        }
                        this.thour = hourlyforecast.FCTTIME.hour + ":00";
                    } else {
                        this.tmaxTemp = hourlyforecast.temp.english;
                        this.tminTemp = hourlyforecast.feelslike.english;
                        if (Number(forecast.snow_allday.in) > 0) {
                            this.tmm = forecast.snow_allday.in + "in";
                        } else {
                            this.tmm = forecast.qpf_allday.in + "in";
                        }
                        this.thour = hourlyforecast.FCTTIME.civil;
                    }
                    this.tthour = Number(hourlyforecast.FCTTIME.hour);
                    this.ForecastIcon = (this.sunrhour < this.tthour &&
                        this.sunshour > this.tthour) ? this.config.iconTableDay[
                        hourlyforecast.icon] : this.config.iconTableNight[
                        hourlyforecast.icon];

                    this.ForecastIconUrl = "<img style='max-height:100%; max-width:100%; vertical-align:middle' src='./modules/MMM-WunderGround/img/" + this.config.iconset + "/" +
                        hourlyforecast.icon_url.replace('http://icons.wxug.com/i/c/k/', '').replace('.gif', '.png') + "' class='forecastWeatherIcon'>";


                    this.windDir = this.deg2Cardinal(hourlyforecast.wdir.degrees);
                    this.windDirImp = hourlyforecast.wdir.dir;
                    this.windSpd = "wi-wind-beaufort-" + this.ms2Beaufort(hourlyforecast.wspd.metric);
                    this.windSpdMph = hourlyforecast.wspd.english;


                    this.hourlyforecast.push({
                        hour: this.thour,
                        maxTemp: this.tmaxTemp,
                        minTemp: this.tminTemp,
                        icon: this.ForecastIcon,
                        icon_url: this.ForecastIconUrl,
                        pop: hourlyforecast.pop,
                        windDir: this.windDir,
                        windDirImp: this.windDirImp,
                        windSpd: this.windSpd,
                        windSpdMph: this.windSpdMph,
                        mm: this.tmm
                    });
                }
            }

            if ( this.config.debug === 1 ) {
				Log.log(this.forecast);
			}

            this.loaded = true;
            this.updateDom(this.config.animationSpeed);
        }
    },


    /* ms2Beaufort(ms)
     * Converts m2 to beaufort (windspeed).
     *
     * argument ms number - Windspeed in m/s.
     *
     * return number - Windspeed in beaufort.
     */
    ms2Beaufort: function(kmh) {
        var speeds = [1, 5, 11, 19, 28, 38, 49, 61, 74, 88, 102,
            117, 1000
        ];
        for (var beaufort in speeds) {
            var speed = speeds[beaufort];
            if (speed > kmh) {
                return beaufort;
            }
        }
        return 12;
    },

    wordwrap: function(str, width, brk) {

        brk = brk || "n";
        width = width || 75;


        if (!str) {
            return str;
        }

        var re = new RegExp(".{1," + width +
            "}(\\s|$)|\\ S+?(\\s|$)", "g");

        var wordwrapped = str.trim().match(RegExp(re));
        for (var i in wordwrapped) {
            wordwrapped[i] = wordwrapped[i].trim();
        }

        return wordwrapped.join(brk);

    },

    /* function(temperature)
     * Rounds a temperature to 1 decimal.
     *
     * argument temperature number - Temperature.
     *
     * return number - Rounded Temperature.
     */

    deg2Cardinal: function(deg) {
        if (deg > 11.25 && deg <= 33.75) {
            return "wi-from-nne";
        } else if (deg > 33.75 && deg <= 56.25) {
            return "wi-from-ne";
        } else if (deg > 56.25 && deg <= 78.75) {
            return "wi-from-ene";
        } else if (deg > 78.75 && deg <= 101.25) {
            return "wi-from-e";
        } else if (deg > 101.25 && deg <= 123.75) {
            return "wi-from-ese";
        } else if (deg > 123.75 && deg <= 146.25) {
            return "wi-from-se";
        } else if (deg > 146.25 && deg <= 168.75) {
            return "wi-from-sse";
        } else if (deg > 168.75 && deg <= 191.25) {
            return "wi-from-s";
        } else if (deg > 191.25 && deg <= 213.75) {
            return "wi-from-ssw";
        } else if (deg > 213.75 && deg <= 236.25) {
            return "wi-from-sw";
        } else if (deg > 236.25 && deg <= 258.75) {
            return "wi-from-wsw";
        } else if (deg > 258.75 && deg <= 281.25) {
            return "wi-from-w";
        } else if (deg > 281.25 && deg <= 303.75) {
            return "wi-from-wnw";
        } else if (deg > 303.75 && deg <= 326.25) {
            return "wi-from-nw";
        } else if (deg > 326.25 && deg <= 348.75) {
            return "wi-from-nnw";
        } else {
            return "wi-from-n";
        }
    },

    /* function(temperature)
     * Rounds a temperature to 1 decimal.
     *
     * argument temperature number - Temperature.
     *
     * return number - Rounded Temperature.
     */
    roundValue: function(temperature) {
        return parseFloat(temperature).toFixed(this.config.roundTmpDecs);
    },

    socketNotificationReceived: function(notification, payload) {
        var self = this;

        if ( this.config.debug === 1 ) {
			Log.info('Wunderground received ' + notification);
		}
        if (notification === 'WIFI_STRENGTH') {
			if ( this.config.debug === 1 ) {
				Log.info('received WIFI_STRENGTH');
				Log.info(payload.wifi_strength);
			}
            this.wifiap = payload.wifi_ap;
            this.wifistrength = payload.wifi_strength;
            self.updateDom(self.config.animationSpeed);
        }
        if (notification === 'SYSTEM_TEMP') {
            if ( this.config.debug === 1 ) {
				Log.info('received SYSTEM_TEMP');
				Log.info(payload.system_temp);
			}
            this.systemp = payload.system_temp;
            self.updateDom(self.config.animationSpeed);
        }
        if (notification === 'SYSTEM_MEM') {
            if ( this.config.debug === 1 ) {
				Log.info('received SYSTEM_MEM');
				Log.info(payload);
			}
            this.mem_size = payload.mem_size;
            this.mem_used = payload.mem_used;
            this.mem_free = payload.mem_free;
            self.updateDom(self.config.animationSpeed);
        }
        if (notification === 'SYSTEM_STORAGE') {
            if ( this.config.debug === 1 ) {
				Log.info('received SYSTEM_STORAGE');
				Log.info(payload);
			}
            this.storage_size = payload.store_size;
            this.storage_used = payload.store_used;
            this.storage_free = payload.store_avail;
            self.updateDom(self.config.animationSpeed);
        }
//        if (notification === 'WUNDERGROUND') {
        if (notification === this.config.sockrcv) {
            if ( this.config.debug === 1 ) {
				Log.info('received ' + this.config.sockrcv);
				Log.info(payload);
			}
            self.processWeather(JSON.parse(payload));
        }

    }

});
