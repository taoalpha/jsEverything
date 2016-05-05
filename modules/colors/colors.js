/*
 * Add color support for console.log by giving string some additional methods to paint themself with color
 * @author Tao <tao@taoalpha.me>
 */

/* Import required modules */
let fs = require("fs");

/* @type {object} - Import the color code */
let codes = require("./codes");

/* @const {object} - Import configuration */
let CONFIG = require("./config")

/**
 * class Colors, will return one instance of this class
 */
class Colors {
    /**
     * init with empty prefix and postfix
     * @constructor
     */
    constructor() {
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
        // if we never extended before and now we want to extend
        if (String.colorExtend === false && enable) {
            Reflect.ownKeys(codes).map( (name) => {
                Object.defineProperty(String.prototype, name, {
                    get: function() { return codes[name].open + this + codes[name].close;}
                });
            } )
        }
        // we extended String before and now we want to remove
        if (String.colorExtend === true && !enable) {
            Reflect.ownKeys(codes).map( (name) => {
                delete String.prototype[name]
            } )
        }
    }
    /**
     * Build the function chain
     */
    build() {
        /* set getter for our colors */
        Reflect.ownKeys(codes).map( (name) => {
            Object.defineProperty(this.colors, name, { 
                get: function () { 
                    this.prefix = [codes[name].open].concat(this.prefix);
                    this.postfix = [codes[name].close].concat(this.postfix);
                    return this;
                } 
            });
        } )

        /* forward the applyTheme call to this.colors to this.applyTheme */
        this.colors.applyTheme = this.applyTheme.bind(this);
        this.colors.setTheme = this.applyTheme.bind(this);
    }
    /**
     * Apply the theme if we have
     * @param {object} theme - pair of theme-name with color name
     */
    applyTheme(theme) {
        /* apply theme if we have one*/
        Reflect.ownKeys(theme).map( (name) => {
            Object.defineProperty(this.colors, name, { 
                get: function () { 
                    let prefix = [], postfix = [];
                    if (theme[name] instanceof Array) {
                        prefix = theme[name].map( (item) => codes[item].open );
                        postfix = theme[name].map( (item) => codes[item].close );
                    } else if (typeof theme[name] == "string") {
                        prefix = [codes[theme[name]].open];
                        postfix = [codes[theme[name]].close];
                    }
                    this.prefix = prefix.concat(this.prefix);
                    this.postfix = postfix.concat(this.postfix);
                    return this;
                } 
            });
        } )
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

c.loadConfig(CONFIG);
module.exports = c.colors;
