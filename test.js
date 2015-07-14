/**
 * AutoPurge - Tests
 * @requires mocha (npm install mocha -g)
 * @author Kyle Ross
 */

/*global describe, it, before, beforeEach */

var should = require('should'),
    AutoPurge = require('./autopurge.js');

describe('AutoPurge', function() {
    it('should be a function', function() {
        AutoPurge.should.be.a.Function;
    });
    
    it('should create an instance with new', function() {
        var purge = new AutoPurge();
        purge.should.be.an.instanceof(AutoPurge);
    });
    
    it('should create an instance without new', function() {
        var purge = AutoPurge();
        purge.should.be.an.instanceof(AutoPurge);
    });
    
    it('should throw an error with incorrect maxlength', function() {
        (function() {
            AutoPurge(true);
        }).should.throw();
    });
    
    it('should set maxlength', function() {
        var purge = AutoPurge(10);
        purge.maxlength.should.be.exactly(10);
    });
    
    it('should set empty array if array is not passed in', function() {
        var purge = AutoPurge(10, 'not valid');
        purge._store.should.be.an.Array;
    });
    
    describe('defaults', function() {
        var purge = new AutoPurge();
        
        it('should have maxlength defaulted to 50', function() {
            purge.maxlength.should.be.type('number').and.be.exactly(50);
        });
        
        it('should have _purged set to 0', function() {
            purge._purged.should.be.type('number').and.be.exactly(0);
        });
        
        it('should have _store set to empty array', function() {
            purge._store.should.be.an.Array;
            purge._store.should.have.a.lengthOf(0);
        });
        
        it('should have length getter which returns 0', function() {
            purge.length.should.be.type('number').and.be.exactly(0);
        });
        
        it('should have a value getter which returns an empty array', function() {
            purge.value.should.be.an.Array;
            purge.value.should.have.lengthOf(0);
        });
        
        it('should have push function', function() {
            purge.push.should.be.a.Function;
        });
        
        it('should have purge function', function() {
            purge.purge.should.be.a.Function;
        });
        
        it('should have auto function', function() {
            purge.auto.should.be.a.Function;
        });
        
        it('should have clear function', function() {
            purge.clear.should.be.a.Function;
        });
    });
    
    describe('methods', function() {
        describe('default array (maxlength 5)', function() {
            var purge2;
            
            beforeEach(function() {
                purge2 = new AutoPurge(5);
                purge2.push('test', 'test', 'test', 'test', 'test');
            });
            
            it('should have 5 values in array', function() {
                purge2.length.should.be.exactly(5);
            });
            
            it('should purge an old record', function() {
                purge2.push('new').should.be.exactly(1);
                purge2.length.should.be.exactly(5);
                purge2.value[4].should.be.exactly('new');
            });
            
            it('should auto purge', function() {
                purge2._store.push('new', 'new', 'new');
                purge2.length.should.be.exactly(8);
                purge2.auto().length.should.be.exactly(3);
                purge2.length.should.be.exactly(5);
            });
            
            it('should count purged records', function() {
                purge2.push('new', 'new');
                purge2._purged.should.be.exactly(2);
                purge2.value[4].should.be.exactly('new');
            });
            
            it('should clear and reset', function() {
                purge2.push('new', 'new');
                purge2._purged.should.be.exactly(2);
                purge2.clear();
                purge2.length.should.be.exactly(0);
                purge2._purged.should.be.exactly(0);
            });
            
            it('should purge a given amount', function() {
                purge2.purge(2).length.should.be.exactly(2);
                purge2.length.should.be.exactly(3);
            });
            
            it('should purge all with "all"', function() {
                purge2.purge('all').length.should.be.exactly(5);
                purge2.length.should.be.exactly(0);
            });
            
            it('should purge all with no value passed', function() {
                purge2.purge().length.should.be.exactly(5);
                purge2.length.should.be.exactly(0);
            });
        });
        
        describe('custom array (maxlength 5)', function() {
            var purge2;
            
            beforeEach(function() {
                purge2 = new AutoPurge(5, [{ type: 'test' }, 1, ['hello', 'world'], 'custom', true]);
            });
            
            it('should have 2 values in array', function() {
                purge2.length.should.be.exactly(5);
            });
            
            it('should purge an old record', function() {
                purge2.push('new').should.be.exactly(1);
                purge2.length.should.be.exactly(5);
                purge2.value[4].should.be.exactly('new');
                purge2.value[0].should.be.a.Number;
            });
            
            it('should auto purge', function() {
                purge2._store.push('new', 'new', 'new');
                purge2.length.should.be.exactly(8);
                purge2.auto().length.should.be.exactly(3);
                purge2.length.should.be.exactly(5);
            });
            
            it('should count purged records', function() {
                purge2.push({ dummyKey: 'some dummy object' }, 'new');
                purge2._purged.should.be.exactly(2);
                purge2.value[4].should.be.exactly('new');
                purge2.value[3].should.be.an.Object;
            });
            
            it('should clear and reset', function() {
                purge2.push('new', 'new');
                purge2._purged.should.be.exactly(2);
                purge2.clear();
                purge2.length.should.be.exactly(0);
                purge2._purged.should.be.exactly(0);
            });
            
            it('should purge a given amount', function() {
                purge2.purge(2).length.should.be.exactly(2);
                purge2._purged.should.be.exactly(2);
                purge2.length.should.be.exactly(3);
            });
        });
    });
});
