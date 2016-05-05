/*
 * Add color support for console.log by giving string some additional methods to paint themself with color
 * @author Tao <tao@taoalpha.me>
 */

/* Import required modules */
let fs = require("fs");

/* @type {object} - Import the color code */
let codes = require("./codes");

/**
 * class Colors, will return one instance of this class
 */
class Colors {
	/**
	 * init with empty prefix and postfix
	 * @constructor
	 */
	constructor() {
        // all origin properties of String.prototype are blacklist
        this.stringPrototypeBlacklist = Reflect.ownKeys(String.prototype);
        this.stringPrototypeWhitelist = ["bold","italics"];
        this.safeMode = true;
		this.prefix = [];
		this.postfix = [];
	}
	/**
	 * Color the string
	 * @param {string} str - the string you want to color it
	 * @return {string} - colored string
	 */
	colors(str) {
		let res = this.prefix.join("") + str + this.postfix.join("");
		this.prefix = [];
		this.postfix = [];
		return res;
	}
	/**
	 * Extend string prototype
	 * @param {boolean} enable - Enable the extend or not
	 */
	extend(enable) {
        let flag = typeof String.prototype.red;
        // extend current colors
        Reflect.ownKeys(this.colors).map( (name) => {
            // skip functions we defined
            if (Object.keys(this.colors).indexOf(name) !== -1) return;
            // skip all static names like length... etc
            if (typeof this.colors[name] != "function") return;
            // if we never extended before and now we want to extend
            if (flag === 'undefined' && enable) {
                // skip the blacklist if we are in safemode, but white list has a higher prioty
                if (this.stringPrototypeBlacklist.indexOf(name) !== -1 && this.stringPrototypeWhitelist.indexOf(name) === -1) { 
                    console.log(this.colors.red('warn: ') + this.colors.magenta('String.prototype.' + name) + ' is probably something you don\'t want to override. Ignoring style name');
                }else{
                    // for later use in getter
                    let that = this;
                    Object.defineProperty(String.prototype, name, {
                        configurable: true,
                        get: function() { that.colors.prefix = []; that.colors.postfix = [];return that.colors[name].prefix + this + that.colors[name].postfix;}
                    });
                }
            }
            // we extended String before and now we want to remove
            if (flag !== 'undefined' && !enable) {
                if (this.stringPrototypeBlacklist.indexOf(name) !== -1 && this.stringPrototypeWhitelist.indexOf(name) === -1) { 
                    return;
                }
                Object.defineProperty(String.prototype, name, {
                    get: function() { return undefined; }
                });
            }
        } )
    }
    /**
     * Construct the properties data for using in defineProperties
     * @param {obj} pairs - prop_name : color_name/color_name list
     * @return {obj} - properties
     */
    genProps(pairs){
        let props = {};
        Reflect.ownKeys(pairs).map( (prop_name) => {
            props[prop_name] = {
                get: function () { 
                    let prefix = [], postfix = [];
                    if (pairs[prop_name] instanceof Array) {
                        prefix = pairs[prop_name].map( (item) => codes[item].open );
                        postfix = pairs[prop_name].map( (item) => codes[item].close );
                    } else if (typeof pairs[prop_name] == "string") {
                        prefix = [codes[pairs[prop_name]].open];
                        postfix = [codes[pairs[prop_name]].close];
                    }
                    this.prefix = this.uniq(prefix.concat(this.prefix));
                    this.postfix = this.uniq(postfix.concat(this.postfix));
                    return this;
                } 
            }
        } )
        return props;
    }
    /**
     * Remove duplicates from the list
     */
    uniq(ar){
        var prims = {"boolean":{}, "number":{}, "string":{}}, objs = [];
        return ar.filter(function(item) {
            var type = typeof item;
            if(type in prims)
                return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true);
            else
                return objs.indexOf(item) >= 0 ? false : objs.push(item);
        });
    }
    /**
     * Build the function chain
     */
    build() {
        let pairs = {}
        Reflect.ownKeys(codes).map( (name) => {
            pairs[name] = name;
        })

        Object.defineProperties(this.colors,this.genProps(pairs));

        /* forward the applyTheme call to this.colors to this.applyTheme */
        this.colors.applyTheme = this.applyTheme.bind(this);
        this.colors.setTheme = this.applyTheme.bind(this);
        this.colors.uniq = this.uniq.bind(this);
        this.colors.extend = this.extend.bind(this);
        this.colors.loadConfig = this.loadConfig.bind(this);
    }
    /**
     * Apply the theme if we have
     * @param {object} theme - pair of theme-name with color name
     */
    applyTheme(theme) {
        /* apply theme if we have one*/
        Object.defineProperties(this.colors,this.genProps(theme));
    }
    /**
     * Load configurations
     * @param {obj} config - Configuration you want to set
     */
    loadConfig(config) {
        this.extend(config.extend);
        if (config.theme instanceof Object) {
            this.applyTheme(config.theme);
        }
    }
}

let c = new Colors();
c.build();

module.exports = c.colors;
