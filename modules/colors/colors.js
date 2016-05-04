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
        let res = this.prefix.join("") + str + this.postfix.join("")
        this.prefix = [];
        this.postfix = [];
        return res;
    }
    /**
     * Extend string prototype
     */
    extend() {
        Reflect.ownKeys(codes).map( (name) => {
            Object.defineProperty(String.prototype, name, {
                get: function() { return codes[name].open + this + codes[name].close;}
            });
        } )
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
                    this.prefix = [codes[theme[name]].open].concat(this.prefix);
                    this.postfix = [codes[theme[name]].close].concat(this.postfix);
                    return this;
                } 
            });
        } )
    }
}

let c = new Colors();
c.build();

if (CONFIG.extend) {
    c.extend();
}
if (CONFIG.theme) {
    c.applyTheme(CONFIG.theme);
}

module.exports = c.colors;
