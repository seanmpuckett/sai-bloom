#!/usr/bin/env node

// Javascript source for saibloom.md transpiled by SAI
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
var __context={"loader":"SAI.GetSourceFromFilename","path":"src/saibloom.md","mtime":"2018-03-28T13:17:08.793Z","fetched":"2018-03-28T13:17:14.500Z"};
var isa = prototype.isa = 'SaiBloom';
var $bindfail = function(m) {
  throw new Error("SAI: A call to " + m + " on object " + isa + " has come unbound from any instance of that object. (If this is not in error, mark the declaration of " + m + " as unbound.)");
}
prototype.isof['SaiBloom'] = {
  version: '0.0.0-unspecified',
  isa: isa,
  context: __context
};
prototype.__tobelocked = prototype.__tobelocked.concat(["state", "Instantiate", "Configure", "Add", "Test", "Cardinality", "Bitcount", "FNV_1A", "FNV_1A_B", "FNV_MULTIPLY", "FNV_MIX", "isa"]);
prototype.__tobefrozen = prototype.__tobefrozen.concat(["isof"]);
var $1g = function() {
  var $ = this;
  return {
    buckets: [],
    bits: 0,
    rounds: 0
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
Object.defineProperty(prototype, "state", {
  configurable: true,
  enumerable: true,
  get: function(p) {
    var $ = this; {
      return ({
        bits: $.bits,
        rounds: $.rounds,
        buckets: [].slice.call($.buckets)
      });
    }
  },
  set: function(p) {
    var $0_this, $1_this, $2_key, $3_list, $4_length, $5_none, $ = this,
      $_c, $_d; {
      $.Configure(p.bits, p.rounds);
      /*@:165*/
      var $3_list = p.buckets,
        $2_key;
      if (undefined === $3_list) $3_list = [];
      var $4_length = $3_list.length;
      for ($2_key = 0; $2_key < $4_length; $2_key++) {
        $1_this = $3_list[$2_key];
        $.buckets[$2_key] = $1_this;;
      }
    }
  }
});
var $5g = prototype['Instantiate'] || function() {};
prototype['Instantiate'] = function(p, _rounds_) {
  var $6_this, $7_trial, $8_trial, $ = this['Instantiate'] ? this : $bindfail('Instantiate'),
    $_c, $_d, _b, _p = p,
    _r, _rate; {
    if ($7_trial = (_p.bits)) {
      $.state = _p;
    } else if ($8_trial = (_p.size)) {
      $AI.assert((_p.rate < 0.5), 'SaiBloom autoconfiguration error, rate should be less than 0.5 (not ' + _p.rate + ') -- percentages must be decimal, e.g. 5% is 0.05.');
      /*@:195*/
      _rate = $AI.min_op($AI.max_op(_p.rate, 0.00001), 0.5);
      /*@:196*/
      _b = ((Math.log(_rate) * (0 - (2))) + 0.5);
      /*@:197*/
      _r = Math.ceil((_b * 0.66));
      /*@:198*/
      $.Configure((_b * _p.size), _r);
    } else {
      $.Configure(_p, _rounds_);
    }
  }
};
var $6g = prototype['Configure'] || function() {};
prototype['Configure'] = function(p, _rounds_) {
  var $9_this, $ = this['Configure'] ? this : $bindfail('Configure'),
    _bits_ = p,
    _bucketcount; {
    _bucketcount = Math.ceil((_bits_ / 32));
    $.bits = (_bucketcount * 32);
    $.rounds = _rounds_;
    $.buckets = new Uint32Array(_bucketcount);
  }
};
var $7g = prototype['Add'] || function() {};
prototype['Add'] = function(p) {
  var $10_this, $11_counter, $12_stop, $13_step, $14_none, $ = this['Add'] ? this : $bindfail('Add'),
    _a, _b, _item = p,
    _loc, _s, _x; {
    _s = (((typeof(_item) === 'string')) ? (_item) : (_item.toString()));
    _a = $.FNV_1A(_s);
    _b = $.FNV_1A_B(_a);
    _x = (_a % $.bits);
    /*@:238*/
    var $11_counter = 0,
      $12_stop = $.rounds,
      $13_step = 1;
    if ($13_step <= 0) throw new Error("SAI Runtime: COUNT STEP value should be positive.");
    for (; $11_counter < $12_stop; $11_counter = $11_counter + $13_step) {
      _loc = (((_x < 0)) ? ((_x + $.bits)) : (_x));
      /*@:240*/
      $.buckets[(_loc >> 5)] |= (1 << (_loc & 0x1f));
      /*@:241*/
      _x = ((_x + _b) % $.bits);;
    }
  }
};
var $8g = prototype['Test'] || function() {};
prototype['Test'] = function(p) {
  var $15_this, $16_counter, $17_stop, $18_step, $19_none, $ = this['Test'] ? this : $bindfail('Test'),
    _a, _b, _item = p,
    _loc, _s, _x; {
    _s = (((typeof(_item) === 'string')) ? (_item) : (_item.toString()));
    _a = $.FNV_1A(_s);
    _b = $.FNV_1A_B(_a);
    _x = (_a % $.bits);
    /*@:265*/
    var $16_counter = 0,
      $17_stop = $.rounds,
      $18_step = 1;
    if ($18_step <= 0) throw new Error("SAI Runtime: COUNT STEP value should be positive.");
    for (; $16_counter < $17_stop; $16_counter = $16_counter + $18_step) {
      _loc = (((_x < 0)) ? ((_x + $.bits)) : (_x));
      /*@:267*/
      if (!(($.buckets[(_loc >> 5)] & (1 << (_loc & 0x1f))))) {
        return (false);
      }
      /*@:269*/
      _x = ((_x + _b) % $.bits);;
    }
    /*@:271*/
    return (true);
  }
};
var $9g = prototype['Cardinality'] || function() {};
prototype['Cardinality'] = function(p) {
  var $20_this, $ = this['Cardinality'] ? this : $bindfail('Cardinality'),
    _bitcount; {
    _bitcount = $AI.reduce_op_fast($.buckets, function(s, v, k) {
      var t = (_Bitcount).call($, v, k);
      return (s === undefined) ? t : s + t;
    }, undefined);
    /*@:285*/
    return ((((0 - ($.bits)) * Math.log((1 - (_bitcount / $.bits)))) / $.rounds));
  }
};
var $10g = prototype['Bitcount'] || function() {};
var _Bitcount = prototype['Bitcount'] = function(p) {
  var $21_this, $ = undefined,
    _v = p; {
    _v = (_v - ((_v >> 1) & 0x55555555));
    /*@:295*/
    _v = ((_v & 0x33333333) + ((_v >> 2) & 0x33333333));
    /*@:296*/
    _v = ((((_v + (_v >> 4)) & 0x0f0f0f0f) * 0x01010101) >> 24);
    /*@:297*/
    return (_v);
  }
};
var $11g = prototype['FNV_1A'] || function() {};
prototype['FNV_1A'] = function(p) {
  var $22_this, $23_trial, $24_stop, $25_step, $26_none, $ = this['FNV_1A'] ? this : $bindfail('FNV_1A'),
    _a, _c, _d, _i, _v = p; {
    _a = 2166136261;
    /*@:303*/
    var _i = 0,
      $24_stop = _v.length,
      $25_step = 1;
    if ($25_step <= 0) throw new Error("SAI Runtime: COUNT STEP value should be positive.");
    for (; _i < $24_stop; _i = _i + $25_step) {
      _c = _v.charCodeAt(_i);
      /*@:305*/
      _d = (_c & 0xff00);
      /*@:306*/
      if ($23_trial = (_d)) {
        _a = _FNV_MULTIPLY(((_a ^ _d) >> 8));;
      }
      /*@:307*/
      _a = _FNV_MULTIPLY((_a ^ (_c & 0xff)));;
    }
    /*@:308*/
    return (_FNV_MIX(_a));
  }
};
var $12g = prototype['FNV_1A_B'] || function() {};
prototype['FNV_1A_B'] = function(p) {
  var $27_this, $ = this['FNV_1A_B'] ? this : $bindfail('FNV_1A_B'),
    _a = p; {
    return (_FNV_MIX(_FNV_MULTIPLY(_a)));
  }
};
var $13g = prototype['FNV_MULTIPLY'] || function() {};
var _FNV_MULTIPLY = prototype['FNV_MULTIPLY'] = function(p) {
  var $28_this, $ = undefined,
    _a = p; {
    return ((_a + ((_a << 1) + ((_a << 4) + ((_a << 7) + ((_a << 8) + (_a << 24)))))));
  }
};
var $14g = prototype['FNV_MIX'] || function() {};
var _FNV_MIX = prototype['FNV_MIX'] = function(p) {
  var $29_this, $ = undefined,
    _a = p; {
    _a += (_a << 13);
    _a ^= (_a >>> 7);
    _a += (_a << 3);
    _a ^= (_a >>> 17);
    _a += (_a << 5);
    _a &= 0xffffffff;
    /*@:330*/
    return (_a);
  }
};
$AI.finalizePrototype(prototype);
if (prototype.isof[prototype.isa].type === "singleton") { prototype.Constructor(); prototype.Instantiate(); }
var result=prototype.isof[prototype.isa].type === "main" ? prototype.constructor() : prototype;
exports=result; try { module.exports=result; } catch(e) {};
return result;
