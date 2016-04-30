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
 * Combine string with proper colors.
 * @param {string} str - Input string
 */
function colors(str) {
    return this.prefix.join("") + str + this.postfix.join("")
};
colors.prefix = [];
colors.postfix = [];

/* Extend the String prototype if CONFIG.extend is true */
if (CONFIG.extend) {
    Reflect.ownKeys(codes).map( (name) => {
        Object.defineProperty(String.prototype, name, { get: function () { return codes[name].open + this + codes[name].close; } });
    } )
}


// set getter
Reflect.ownKeys(codes).map( (name) => {
    Object.defineProperty(colors, name, { 
        get: function () { 
            this.prefix = [codes[name].open].concat(this.prefix);
            this.postfix = [codes[name].close].concat(this.postfix);
            return this;
        } 
    });
} )


// test
let a  = "asdasd";
console.log(colors.yellow.bold.underline(a))
