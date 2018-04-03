#!/usr/bin/env node

// Javascript source for test transpiled by SAI
//

"use strict";

var prototype=new function() {
  this.Constructor=function(){};
  this.__tobelocked=[];
  this.__tobefrozen=[];
  this.__contracts=[];
  this.__unverified=true;
  this.isof={};
  return this;
}();
var $AI=require("sai-library");
// Generated code follows
var __context={"loader":"SAI.GetSourceFromFilename","path":"test.sai","mtime":"2018-04-03T17:24:53.815Z","fetched":"2018-04-03T18:01:37.871Z"};
var _SaiBloomD = '../src/saibloom';
var _SaiBloomS = '../lib/saibloom';
var isa = prototype.isa = 'Test';
var $bindfail = function(m) {
  throw new Error("SAI: A call to " + m + " on object " + isa + " has come unbound from any instance of that object. (If this is not in error, mark the declaration of " + m + " as unbound.)");
}
prototype.isof['Test'] = {
  version: '0.0.0-unspecified',
  isa: isa,
  context: __context,
  type: "main"
};
prototype.__tobelocked = prototype.__tobelocked.concat(["Instantiate", "Speed", "Characterize", "isa"]);
prototype.__tobefrozen = prototype.__tobefrozen.concat(["isof"]);
var $1g = function() {
  var $ = this;
  return {
    SaiBloom: undefined
  };
}
for (var i in $1g()) {
  prototype[i] = undefined;
};
var $2g = prototype.Constructor || function() {};
prototype.Constructor = function() {
  $2g.call(this);
  var t = $1g();
  for (var i in t)
    if (t[i] !== undefined) this[i] = t[i];
};
var $3g = prototype['Instantiate'] || function() {};
prototype['Instantiate'] = function(p) {
  var $0_counter, $1_stop, $2_step, $3_none, $4_counter, $5_stop, $6_step, $7_none, $ = this['Instantiate'] ? this : $bindfail('Instantiate'),
    $_c, $_d, _bloom, _newbloom, _state; {
    $.SaiBloom = (($AI.environment().dynamic) ? (_SaiBloomD) : (_SaiBloomS));
    /*@:18*/
    _bloom = $AI.create_op($.SaiBloom, [Math.pow(2, 9), 5]);
    /*@:20*/
    _bloom.Add('hit the road, jack');
    /*@:22*/
    $AI.assert((_bloom.Test('fnoop') === false), 'fnoop should not exist');
    /*@:24*/
    $AI.assert((_bloom.Test('hit the road, jack') === true), 'hit the road, jack should exist');
    /*@:25*/
    _bloom = $AI.create_op($.SaiBloom, [1000, 4]);
    /*@:27*/
    _bloom.Add(1);
    /*@:28*/
    $AI.assert((_bloom.Test(1) === true), 'digit 1 should exist');
    /*@:29*/
    $AI.assert((_bloom.Test(2) === false), 'digit 2 should not exist');
    /*@:30*/
    var $0_counter = 0,
      $1_stop = 100,
      $2_step = 1;
    if ($2_step <= 0) throw new Error("SAI Runtime: COUNT STEP value should be positive.");
    for (; $0_counter < $1_stop; $0_counter = $0_counter + $2_step) {
      _bloom.Add($0_counter);;
    }
    /*@:33*/
    $AI.assert((Math.floor((_bloom.Cardinality() * 100)) === 9995), 'cardinality of 100 adds should be about 99.95');
    /*@:34*/
    _state = _bloom.state;
    /*@:35*/
    var $4_counter = 0,
      $5_stop = 1000,
      $6_step = 1;
    if ($6_step <= 0) throw new Error("SAI Runtime: COUNT STEP value should be positive.");
    for (; $4_counter < $5_stop; $4_counter = $4_counter + $6_step) {
      _bloom.Add($4_counter);;
    }
    /*@:37*/
    $AI.assert((Math.floor((_bloom.Cardinality() * 100)) === 95042), 'cardinality of 1000 adds should be about 950.42');
    /*@:38*/
    _bloom = $AI.create_op($.SaiBloom, [20, 10]);
    /*@:40*/
    _bloom.Add('number one crush');
    /*@:41*/
    $AI.assert(_bloom.Test('number one crush'), 'crush test should find added key');
    /*@:42*/
    $AI.assert((!(_bloom.Test('number two crush'))), 'crush test should not find non-added key');
    /*@:43*/
    _bloom = undefined;
    /*@:45*/
    _newbloom = $AI.create_op($.SaiBloom, [_state]);
    /*@:46*/
    $AI.assert((_newbloom.Test(1) === true), 'restored filter should have digit 1');
    /*@:47*/
    $AI.assert((_newbloom.Test(101) === false), 'restored filter should not have digit 101');
    /*@:48*/
    $AI.assert((Math.floor((_newbloom.Cardinality() * 100)) === 9995), 'restored filter should have cardinality of about 99.95');
    /*@:49*/
    _bloom = $AI.create_op($.SaiBloom, [{
      size: 50,
      rate: 0.1
    }]);
    /*@:51*/
    $AI.assert((_bloom.bits === 256), 'autoconfigure bits should be 256 not ' + _bloom.bits);
    /*@:52*/
    $AI.assert((_bloom.rounds === 4), 'autoconfigure rounds should be 4 not ' + _bloom.rounds);
    /*@:53*/
    _bloom = $AI.create_op($.SaiBloom, [{
      size: 50,
      rate: 0
    }]);
    /*@:55*/
    $AI.assert((_bloom.rounds === 16), 'autoconfigure rounds of out of range rate should be 16 not ' + _bloom.rounds);
    /*@:56*/
    $AI.debug_op('Bloom filter looks good.');
    /*@:59*/
  }
};
var $4g = prototype['Speed'] || function() {};
prototype['Speed'] = function(p) {
  var $10_stop, $11_step, $12_none, $13_trial, $14_trial, $15_counter, $16_stop, $17_step, $18_none, $19_trial, $20_trial, $21_counter, $22_stop, $23_step, $24_none, $25_counter, $26_stop, $27_step, $28_none, $8_this, $9_counter, $ = this['Speed'] ? this : $bindfail('Speed'),
    $_c, $_d, _bloom, _d, _d10, _found, _t1, _t2, _t3, _t4; {
    _t1 = new Date();
    /*@:64*/
    _d = 1000000;
    /*@:65*/
    _found = 0;
    /*@:66*/
    _bloom = $AI.create_op($.SaiBloom, [{
      size: _d,
      rate: 0.05
    }]);
    /*@:67*/
    var $9_counter = 0,
      $10_stop = _d,
      $11_step = 1;
    if ($11_step <= 0) throw new Error("SAI Runtime: COUNT STEP value should be positive.");
    for (; $9_counter < $10_stop; $9_counter = $9_counter + $11_step) {
      _bloom.Add($9_counter);;
    }
    /*@:69*/
    _t2 = new Date();
    /*@:70*/
    var $15_counter = 0,
      $16_stop = (_d * 10),
      $17_step = 1;
    if ($17_step <= 0) throw new Error("SAI Runtime: COUNT STEP value should be positive.");
    for (; $15_counter < $16_stop; $15_counter = $15_counter + $17_step) {
      if ($14_trial = (_bloom.Test($15_counter))) {
        if ($13_trial = (($15_counter >= _d))) {
          _found = (_found || 0) + 1;
        }
      };
    }
    /*@:74*/
    _t3 = new Date();
    /*@:75*/
    _d10 = Math.floor((_d / 10));
    /*@:76*/
    var $25_counter = 0,
      $26_stop = 10,
      $27_step = 1;
    if ($27_step <= 0) throw new Error("SAI Runtime: COUNT STEP value should be positive.");
    for (; $25_counter < $26_stop; $25_counter = $25_counter + $27_step) {
      var $21_counter = _d10,
        $22_stop = (_d + _d10),
        $23_step = 1;
      if ($23_step <= 0) throw new Error("SAI Runtime: COUNT STEP value should be positive.");
      for (; $21_counter < $22_stop; $21_counter = $21_counter + $23_step) {
        if ($20_trial = (_bloom.Test($21_counter))) {
          if ($19_trial = (($21_counter >= _d))) {
            _found = (_found || 0) + 1;
          }
        };
      };
    }
    /*@:81*/
    _t4 = new Date();
    /*@:82*/
    $AI.debug_op('Time to add ' + _d + ' items: ' + (_t2 - _t1) + 'ms.');
    /*@:84*/
    $AI.debug_op('Time to check ' + (_d * 10) + ' items, 90% not there: ' + (_t3 - _t2) + 'ms.');
    /*@:85*/
    $AI.debug_op('Time to check ' + (_d * 10) + ' items, 90% there: ' + (_t4 - _t3) + 'ms.');
    /*@:86*/
    $AI.debug_op('Got ' + (10 * (_found / _d)) + '% false positives');
    /*@:87*/
  }
};
var $5g = prototype['Characterize'] || function() {};
prototype['Characterize'] = function(p) {
  var $29_this, $30_trial, $31_trial, $32_counter, $33_stop, $34_step, $35_none, $36_trial, $37_counter, $38_stop, $39_step, $40_none, $41_stop, $42_step, $43_none, $44_this, $45_key, $46_stop, $47_step, $48_none, $ = this['Characterize'] ? this : $bindfail('Characterize'),
    $_c, $_d, _Format, _NiceNum, _bits, _bloom, _d, _fp, _results, _rounds, _t1, _t2, _whatever; {
    _d = 100000;
    /*@:91*/
    _results = [];
    /*@:92*/
    _NiceNum = function(p) {
      {
        if ($30_trial = ((p >= 1000000))) {
          return ('' + (p / 1000000) + 'M');
        }
        /*@:96*/
        if ($31_trial = ((p >= 1000))) {
          return ('' + (p / 1000) + 'K');
        }
        /*@:98*/
        return (p);
        /*@:99*/
      }
    };
    /*@:100*/
    _Format = function(p) {
      {
        $AI.debug_op('' + p.bits + 'bits @ ' + p.rounds + ' hashes: ' + (Math.floor((p.fp * 10000)) / 100) + '% false positives against ' + _NiceNum(_d) + ' items in ' + _NiceNum(p.size) + ' bytes, ' + _NiceNum((_d * 10)) + ' queries in ' + p.time + 'ms');
        /*@:102*/
      }
    };
    /*@:103*/
    var _bits = 2,
      $46_stop = 33,
      $47_step = 1;
    if ($47_step <= 0) throw new Error("SAI Runtime: COUNT STEP value should be positive.");
    for (; _bits < $46_stop; _bits = _bits + $47_step) {
      var _rounds = 2,
        $41_stop = 17,
        $42_step = 1;
      if ($42_step <= 0) throw new Error("SAI Runtime: COUNT STEP value should be positive.");
      for (; _rounds < $41_stop; _rounds = _rounds + $42_step) {
        _fp = 0;
        /*@:106*/
        _bloom = $AI.create_op($.SaiBloom, [(_d * _bits), _rounds]);
        /*@:107*/
        var $32_counter = 0,
          $33_stop = _d,
          $34_step = 1;
        if ($34_step <= 0) throw new Error("SAI Runtime: COUNT STEP value should be positive.");
        for (; $32_counter < $33_stop; $32_counter = $32_counter + $34_step) {
          _bloom.Add($32_counter);;
        }
        /*@:109*/
        _t1 = new Date();
        /*@:110*/
        var $37_counter = _d,
          $38_stop = (_d * 11),
          $39_step = 1;
        if ($39_step <= 0) throw new Error("SAI Runtime: COUNT STEP value should be positive.");
        for (; $37_counter < $38_stop; $37_counter = $37_counter + $39_step) {
          if ($36_trial = (_bloom.Test($37_counter))) {
            _fp = (_fp || 0) + 1;
          };
        }
        /*@:113*/
        _t2 = new Date();
        /*@:114*/
        _results.push({
          time: (_t2 - _t1),
          bits: _bits,
          rounds: _rounds,
          fp: (_fp / (_d * 10)),
          size: (_bloom.bits / 8)
        });;
      }
      /*@:120*/
      _Format($AI.reduce_op($AI.filter_op(_results, function($44_this, $45_key) {
        return ($44_this.bits === _bits);
      }), function(a, b) {
        var aa = a.fp;
        var bb = b.fp;
        return (aa > bb) ? b : a;
      }));
      /*@:121*/
      ;
    }
    /*@:122*/
    _whatever = 'Bloom filter characterization (2012 Retina MacBook Pro, single threaded, Node 9.3)' + '\n' + '' + '\n' + ' 2bits @ 2 hashes: 40.08% false positives against 100K items in 25K bytes,    1M queries in 233ms' + '\n' + ' 3bits @ 2 hashes: 23.73% false positives against 100K items in 37.5K bytes,  1M queries in 231ms' + '\n' + ' 4bits @ 3 hashes: 14.75% false positives against 100K items in 50K bytes,    1M queries in 223ms' + '\n' + ' 5bits @ 4 hashes:  9.15% false positives against 100K items in 62.5K bytes,  1M queries in 215ms' + '\n' + ' 6bits @ 4 hashes:  5.60% false positives against 100K items in 75K bytes,    1M queries in 217ms' + '\n' + ' 7bits @ 5 hashes:  3.48% false positives against 100K items in 87.5K bytes,  1M queries in 213ms' + '\n' + ' 8bits @ 6 hashes:  2.16% false positives against 100K items in 100K bytes,   1M queries in 220ms' + '\n' + ' 9bits @ 6 hashes:  1.33% false positives against 100K items in 112.5K bytes, 1M queries in 216ms' + '\n' + '10bits @ 7 hashes:  0.82% false positives against 100K items in 125K bytes,   1M queries in 213ms' + '\n' + '11bits @ 7 hashes:  0.50% false positives against 100K items in 137.5K bytes, 1M queries in 218ms' + '\n' + '12bits @ 8 hashes:  0.32% false positives against 100K items in 150K bytes,   1M queries in 217ms' + '\n' + '13bits @ 9 hashes:  0.19% false positives against 100K items in 162.5K bytes, 1M queries in 214ms' + '\n' + '14bits @ 9 hashes:  0.11% false positives against 100K items in 175K bytes,   1M queries in 218ms' + '\n' + '15bits @ 12 hashes: 0.07% false positives against 100K items in 187.5K bytes, 1M queries in 222ms' + '\n' + '16bits @ 10 hashes: 0.04% false positives against 100K items in 200K bytes,   1M queries in 229ms' + '\n' + '17bits @ 11 hashes: 0.02% false positives against 100K items in 212.5K bytes, 1M queries in 230ms' + '\n' + '18bits @ 11 hashes: 0.01% false positives against 100K items in 225K bytes,   1M queries in 205ms' + '\n' + '19bits @ 15 hashes: 0.01% false positives against 100K items in 237.5K bytes, 1M queries in 228ms' + '\n' + '20bits @ 15 hashes: 0.00% false positives against 100K items in 250K bytes,   1M queries in 233ms' + '\n' + '' + '\n' + 'Hash counts 2-16 were tested for each bit size, the row shown is the best (fewest false pasitives)' + '\n' + 'Beyond 21 bits per item to be stored, there were no false positives found in the best row.' + '\n' + '' + '\n' + 'Test method: A bloom filter was created with _n_ bits allocated per anticipated item to be stored.' + '\n' + 'That number of unique items (100K) were stored in the filter. Then the filter was queried with 1M' + '\n' + 'unique items known not to be in the filter.stored. Time is for queries alone, not insertions' + '\n' + '(which run about the same speed as queries).' + '\n' + '' + '\n' + '' + '\n' + '' + '\n' + '';
  }
};
$AI.finalizePrototype(prototype);
if (prototype.isof[prototype.isa].type === "singleton") { prototype.Constructor(); prototype.Instantiate(); }
var result=prototype.isof[prototype.isa].type === "main" ? prototype.constructor() : prototype;
exports=result; try { module.exports=result; } catch(e) {};
return result;
