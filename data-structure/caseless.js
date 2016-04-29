/**
 * Class representing a caseless dictionary
 * @author Tao <tao@taoalpha.me>
 * @class
 */
class Caseless {
    /**
     * Create a caseless dictionary
     * @constructs Caseless
     * @param {object} obj - Create the caseless dict based on existed dictionary
     * @param {boolean} clobber - Indicate whether overwrite or concatenate values
     */
    constructor(obj, clobber) {
        this.dict = {};
        this.clobber = !!clobber;
        if (obj) this.clean(obj);
    }
    /**
     * Get the value by name
     * @method get
     * @param {string|symbol} name - The name you want to get the value by
     * @returns {(boolean|*)} - Either return the value matched the name or false if not found.
     */
    get(name) {
        let map = this.dict;
        let result = false;
        if (typeof name !== "symbol") name = name.toLowerCase();
        Reflect.ownKeys(map).map( (entry) => {
            if (entry === name || (typeof entry !== "symbol" && entry.toLowerCase() === name)) result = map[entry];
        } )

        return result;
    }
    /**
     * Check existence of a given name
     * @method has
     * @param {(string|symbol)} name - The name you want to check
     * @returns {(boolean|string|symbol)} - Either return the found name or false if not found.
     */
    has(name) {
        let keys = Reflect.ownKeys(this.dict);
        if (typeof name !== "symbol") name = name.toLowerCase();
        for (let i = 0; i < keys.length; i++) {
            if (keys[i] === name || (typeof keys[i] !== "symbol" && keys[i].toLowerCase() === name)) return keys[i];
        }
        return false;
    }
    /**
     * Set a value to a name
     * @method set
     * @param {(string|symbol)} name - The name you want to associate the value with
     * @param {*} value - The value you want to store
     * @returns {boolean} - Set successfully or not.
     */
    set(name,value) {
        let has = this.has(name);
        // if clobber is true, we concatenate
        if (has && this.clobber) {
            this.dict[has] = this.dict[has] + "," + value;
        } else {
            // we overwrite or add the new key
            this.dict[has || name] = value;
        }
        return true;
    }
    /**
     * Replace the exist key
     * @method swap
     * @params {(string|symbol)} name - The name you want to replace the exist one
     */
    swap(name) {
        // replace the key matched with new name
        let has = this.has(name);
        if (has) {
            this.dict[name] = this.dict[has];
            delete this.dict[has];
        }
    }
    /**
     * Delete an entry in caseless dictionary 
     * @param {(string|symbol)} name - The name of the entry you want to delete
     */
    del(name) {
        let has = this.has(name);
        if (has) {
            delete this.dict[has];
        }
    }
    /**
     * Clean current dictionary with given object
     * @param {object} obj - The obj you given
     */
    clean(obj) {
        this.dict = {};
        let keys = Reflect.ownKeys(obj);
        for (let i = 0; i < keys.length; i++) {
            this.set(keys[i],obj[keys[i]]);
        }
    }
}

module.exports = Caseless;
