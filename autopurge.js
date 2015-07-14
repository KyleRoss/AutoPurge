/*!
 * AutoPurge - Purge old items from an array once it hits a certain length.
 * https://github.com/KyleRoss/AutoPurge
 * 
 * @version 1.0.0
 * @author Kyle Ross
 * @license MIT
 */
;(function(root, factory) {
    /*global define, module, exports */
    if(typeof define === 'function' && define.amd) define(factory);
    else if(typeof exports === 'object') module.exports = factory();
    else root.AutoPurge = factory();
}(this, function() {
    
    /**
     * AutoPurge constructor
     * @param {Number} maxlength The maxlength of the array before items are purged. Default is `50`.
     * @param {Array}  array     Optional reference to an array to use for item storage. Default is `[]`.
     */
    function AutoPurge(maxlength, array) {
        if(!(this instanceof AutoPurge)) return new AutoPurge(maxlength);
        
        this.maxlength = maxlength || 50;
        if(typeof this.maxlength !== 'number')
            throw new Error('Maxlength must be a number.');
        
        if(array && array.constructor !== Array)
            array = [];
        
        this._purged = 0;
        this._store = array || [];
    }

    AutoPurge.prototype = {
        /**
         * Get the current length of the storage array.
         * @returns {Number} The length of the storage array.
         */
        get length() {
            return this._store.length;
        },
        /**
         * Get the value of the storage array.
         * @returns {Array} The storage array.
         */
        get value() {
            return this._store;
        },
        
        /**
         * Add item(s) to the array.
         * @param {...*} args Item(s) to add to the array.
         * @return {Number} The number of items purged from the array as the result of the push.
         */
        push: function push() {
            var args = Array.prototype.slice.call(arguments);
            
            Array.prototype.push.apply(this._store, args);
            return this.auto().length;
        },
        
        /**
         * Purge a given number or all of the items from the storage array.
         * @param  {Number|String} [num] The number of items to purge from the array. `null`, `undefined` and `'all'` will remove all items.
         * @return {Array}               Array of items purged from the array.
         */
        purge: function purge(num) {
            if(!num || num === 'all') num = this._store.length;
            this._purged += num;
            return this._store.splice(0, num);
        },
        
        /**
         * Check and purge items if the array length is greater than the max length. Useful if modifying the array outside of AutoPurge.
         * @return {Array} Array of items purged from the array if applicable.
         */
        auto: function auto() {
            var len = this._store.length,
                diff = len - this.maxlength;
            
            if(diff > 0) return this.purge(diff);
            return [];
        },
        
        /**
         * Clear the entire array and reset the purged counter.
         */
        clear: function clear() {
            this.purge();
            this._purged = 0;
        }
    };
    
    return AutoPurge;
}));
