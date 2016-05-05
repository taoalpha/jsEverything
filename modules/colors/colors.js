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
        this.dirtyMode = false;
        this.props = [];
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
	dirty(enable) {
        this.dirtyMode = enable;
        let flag = typeof String.prototype.red;
        // extend current colors
        Reflect.ownKeys(this.colors).map( (name) => {
            // skip functions we defined like clear, applyTheme...
            if (Object.keys(this.colors).indexOf(name) !== -1) return;

            // skip all static names like length... etc
            if (typeof this.colors[name] != "function") return;

            // clear since we use the get for typeof
            this.clear();

            // if we never extended before and now we want to extend
            if (flag === 'undefined' && enable) {
                // skip the blacklist but white list has a higher prioty
                if (this.stringPrototypeBlacklist.indexOf(name) !== -1 && this.stringPrototypeWhitelist.indexOf(name) === -1) { 
                    console.log(this.colors.red('warn: ') + this.colors.magenta('String.prototype.' + name) + ' is probably something you don\'t want to override. Ignoring style name');
                }else{
                    // for later use in getter
                    let that = this;
                    Object.defineProperty(String.prototype, name, {
                        configurable: true,
                        get: function() { 
                            that.clear();
                            let temp = that.colors[name];
                            let colordStr = temp.prefix + this + temp.postfix;
                            return colordStr;
                        }
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
            this.props.push(prop_name);
            this.props = this.uniq(this.props);
            props[prop_name] = {
                configurable: true,
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
        this.colors.clear = this.clear.bind(this);
        this.colors.dirty = this.dirty.bind(this);
        this.colors.loadConfig = this.loadConfig.bind(this);
        this.colors.getProps = this.getProps.bind(this);
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
        this.dirty(config.dirty);
        if (config.theme instanceof Object) {
            this.applyTheme(config.theme);
        }
    }
    /**
     * Define extra features by name - getFunction pair
     * @param {string} name - The name
     * @param {function} getter - The getter function
     */
    extend(name,getter){
        Object.defineProperty(this.colors,name,{ 
            configurable: true,
            get: getter.bind(this.colors)
        });
        if (this.dirtyMode) {
            console.log("should not see this")
            this.dirty(true);
        }
    }
    /**
     * Get props
     */
    getProps(){
        return this.props;
    }
    /** 
     * Clear prefix and postfix
     */
    clear(){
        this.colors.prefix = [];
        this.colors.postfix = [];
    }
}

let c = new Colors();
c.build();


c.extend("random", function() {
    let prefix = [], postfix = [], totalNum = 0, colorList = this.getProps();
    totalNum = colorList.length;
    let prop_name = colorList[parseInt(Math.random() * totalNum)];
    prefix = this[prop_name].prefix;
    postfix = this[prop_name].postfix;
    this.prefix = this.uniq(prefix.concat(this.prefix));
    this.postfix = this.uniq(postfix.concat(this.postfix));
    return this;
})

module.exports = c.colors;
