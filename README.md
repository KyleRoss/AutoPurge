# Auto Purge
Automatically purge items from an array when the maxlength is hit. This module can be used in Node or the browser. Browser support is for modern ES5 browsers (IE9+, Chrome, Firefox, etc.)

**Why?** There are certain cases where you want a rolling array of values that are limited such as a log system or chat. Once the array fills up to the maxlength, the oldest records are purged from the array.

## Getting Started
Install the AutoPurge module.

### Node

    npm install autopurge


    var AutoPurge = require('autopurge');


### Bower

    bower install autopurge

### Without Package Manager
Download `autopurge.js` or `autopurge.min.js` in the repository and include in your application.

### Browser

    <script type="text/javascript" src="path/to/autopurge.min.js"></script>


## Example
    
    var myArray = ['test', 'value', true, false, 1, 20],
        purge = new AutoPurge(10, myArray);
    
    purge.push('new value'); // => 0 (no records purged)
    purge.length; // => 7
    purge.value; // => ['test', 'value', true, false, 1, 20, 'new value']
    purge.push.apply(purge, [1, 2, 3, 4, 5]); // => 2 (records purged)
    purge.value; // => [true, false, 1, 20, 'new value', 1, 2, 3, 4, 5]
    
    purge.purge(2); // => [true, false]
    purge.length; // => 8
    
    // Array modified outside of AutoPurge?
    myArray.push('modifying', 'outside', 'does', 'not', 'purge');
    purge.length; // => 13 (over the maxlength!)
    purge.auto(); // => [1, 20, 'new value']
    purge.length; // => 3
    
    purge.clear();
    purge.value; // => []
    purge.length; // => 0

## API Documentation

### Methods
#### AutoPurge([maxlength], [array])
Constructor function to create a new purgable array. Can be called with or without the `new` keyword.

Required | Argument      | Type      | Description
-------- | ------------- | --------- | ------------
No       | maxlength     | Number    | The maxlength the array can be. Default is `50`.
No       | array         | Array     | An external array to use. Default is `[]`.

    var purge = new AutoPurge();
    var purge2 = AutoPurge(10);
    var purge3 = AutoPurge(null, ['custom', 'array']);
    var purge4 = new AutoPurge(10, ['custom', 'array']);

Returns `AutoPurge`

#### AutoPurge.push(...)
Push item(s) to the array. Each item should be an argument if pushing multiple items. If you need to push an array of items, use `purge.push.apply(purge, [1, 2, 3, 4, 5]);`.

Required | Argument      | Type      | Description
-------- | ------------- | --------- | ------------
Yes      | ...           | Any       | Each item to push to the array as a separate argument.

    purge.push('new item');
    purge.push(1, 2, 'test', false);
    purge.push.apply(purge, [1, 2, 3, 4, 5]);

Returns `Number` (the number of items purged as result of the push)

#### AutoPurge.purge([num])
Purge the given number of old items from the array or remove all items without resetting the `_purged` counter like `AutoPurge.clear()`.

Required | Argument      | Type               | Description
-------- | ------------- | ------------------ | ------------
No       | num           | Number/String/null | The number of items to remove, `null`, `undefined`, or `'all'` to remove all items.

    var purge = new AutoPurge(10, ['custom', 'array', 1, 2, 3, 4]);
    purge.purge(2); // => ['custom', 'array']
    
    purge.purge(); // => [1, 2, 3, 4]
    purge.value; // => []
    purge._purged; // => 6

Returns `Array` (the items purged from the array)

#### AutoPurge.auto()
If the array is modified without using any of the API methods, you will need to purge it. This will purge the array if the length of the array is greater than `maxlength`.

    var arr = ['custom', 'array', 1, 2, 3, 4, true, false, {}, []],
        purge = new AutoPurge(10, arr);
    
    purge.length; // => 10
    arr.push('not', 'using', 'AutoPurge');
    purge.length; // => 13
    
    purge.auto(); // => ['custom', 'array', 1]
    purge.length; // => 13

Returns `Array` (the items purged from the array)

#### AutoPurge.clear()
Clears the array and resets the `_purged` counter back to 0.

    var purge = new AutoPurge(10, ['custom', 'array', 1, 2, 3, 4]);
    purge.purge(2); // => ['custom', 'array']
    purge._purged; // => 2
    
    purge.clear();
    purge.value; // => []
    purge._purged; // => 0

Returns `undefined`

### Properties
#### AutoPurge.length
**Type:** Number (getter)<br>
The total length of the array.

#### AutoPurge.value
**Type:** Array (getter)<br>
Returns the purgable array.

#### AutoPurge.maxlength
**Type:** Number<br>
The configuration maxlength for the array.

#### AutoPurge._store
**Type:** Array<br>
Reference to the purgable array.

#### AutoPurge._purged
**Type:** Number<br>
The total items that have been purged from the array.

---

## TODO

* Make the array observable when it's no longer "hacky" to do so.

## Contributing
Want to fix a bug or implement a new feature? Submit a pull request! Before you submit the request, please follow the guidelines below:

* If you implement a new feature, write the test case for it.
* Make sure all tests pass.
* Build the minified version using grunt.
* If bumping version, update `package.json`, `bower.json` and the JS file.

## License
Licensed under MIT.
