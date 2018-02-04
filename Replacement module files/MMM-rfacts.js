/* Magic Mirror
 * Module: MMM-rfacts
 *
 * By cowboysdude
 * 
 */
Module.register("MMM-rfacts", {

    // Module config defaults.
    defaults: {
        updateInterval: 10 * 60 * 1000, // every 10 minutes
        animationSpeed: 10,
        initialLoadDelay: 875, // 0 seconds delay
        retryDelay: 1500,
        fadeSpeed: 7
    },

    getStyles: function() {
        return ["MMM-rfacts.css"];
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

    // Define start sequence.
    start: function() {
        Log.info("Starting module: " + this.name);
        this.config.lang = this.config.lang || config.language; 
		this.sendSocketNotification("CONFIG", this.config);

        // Set locale. 
        this.today = "";
        this.scheduleUpdate();
    },


    getDom: function() {


        var fact = this.fact;


        var wrapper = document.createElement("div");
        wrapper.className = "wrapper";
        wrapper.style.maxWidth = this.config.maxWidth;

        if (!this.loaded) {
            wrapper.classList.add("wrapper");
            wrapper.innerHTML = this.translate("Getting a Fact ...");
            wrapper.className = "bright light small";
            return wrapper;
        }

        var top = document.createElement("div");


        var title = document.createElement("div");
        title.classList.add("xsmall", "bright", "title");
        title.innerHTML = this.translate("Random Fact");
        top.appendChild(title);

        var des = document.createElement("div");
        des.classList.add("small", "bright", "description");
        if (this.config.lang !== 'en'){
		des.innerHTML = fact[0]['text'];	
		} else {
		des.innerHTML = fact;	
		}
        top.appendChild(des);

        wrapper.appendChild(top);
        return wrapper;

    },
	
	 /////  Add this function to the modules you want to control with voice //////

    notificationReceived: function(notification, payload) {
        if (notification === 'HIDE_FAX') {
            this.hide();
        }  else if (notification === 'SHOW_FAX') {
            this.show(1000);
        }
            
    },

    processFacts: function(data) {
        this.today = data.Today;
        this.fact = data;
    //    console.log(this.fact);
        this.loaded = true;
    },

    scheduleUpdate: function() {
        setInterval(() => {
            this.getFact();
        }, this.config.updateInterval);
        this.getFact(this.config.initialLoadDelay);
    },

    getFact: function() {
        this.sendSocketNotification('GET_FACT');
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "FACT_RESULT") {
            this.processFacts(payload);
            this.updateDom(this.config.animationSpeed);
        }
        this.updateDom(this.config.initialLoadDelay);
    },

});