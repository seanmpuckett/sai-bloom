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
var __context={"loader":"SAI.GetSourceFromFilename","path":"src/saibloom.md","mtime":"2018-03-26T23:42:18.706Z","fetched":"2018-03-26T23:45:39.061Z"};
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
var t = {
  autoconfig: [
    [0.4008, 2, 2],
    [0.2373, 3, 2],
    [0.1475, 4, 3],
    [0.0915, 5, 4],
    [0.056, 6, 4],
    [0.0348, 7, 5],
    [0.0216, 8, 6],
    [0.0133, 9, 6],
    [0.0082, 10, 7],
    [0.005, 11, 7],
    [0.0032, 12, 8],
    [0.0019, 13, 9],
    [0.0011, 14, 9],
    [0.0007, 15, 10],
    [0.0004, 16, 10],
    [0.0002, 17, 11],
    [0.0001, 18, 11],
    [0, 20, 15]
  ]
};
for (var i in t) {
  prototype.__tobelocked.push(i);
  prototype[i] = t[i];
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
      /*@:174*/
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
  var $10_list, $11_length, $12_none, $13_trial, $14_trial, $6_this, $7_trial, $8_this, $9_key, $ = this['Instantiate'] ? this : $bindfail('Instantiate'),
    $_c, $_d, _p = p; {
    if ($13_trial = (_p.bits)) {
      $.state = _p;
    } else if ($14_trial = (_p.size)) {
      var $10_list = $.autoconfig,
        $9_key;
      if (undefined === $10_list) $10_list = [];
      var $11_length = $10_list.length;
      for ($9_key = 0; $9_key < $11_length; $9_key++) {
        $8_this = $10_list[$9_key];
        if ($7_trial = (($8_this[0] < _p.rate))) {
          $.Configure(($8_this[1] * _p.size), $8_this[2]);
          /*@:206*/
          return;
        };
      }
      /*@:207*/
      throw new Error('SaiBloom unable to autoconfigure with parameters size:' + _p.size + ' rate:' + _p.rate + '.');
    } else {
      $.Configure(_p, _rounds_);
    }
  }
};
var $6g = prototype['Configure'] || function() {};
prototype['Configure'] = function(p, _rounds_) {
  var $15_this, $ = this['Configure'] ? this : $bindfail('Configure'),
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
  var $16_this, $17_stop, $18_step, $19_none, $ = this['Add'] ? this : $bindfail('Add'),
    _a, _b, _i, _item = p,
    _loc, _s, _x; {
    _s = (((typeof(_item) === 'string')) ? (_item) : (_item.toString()));
    _a = $.FNV_1A(_s);
    _b = $.FNV_1A_B(_a);
    _x = (_a % $.bits);
    /*@:247*/
    var _i = 0,
      $17_stop = $.rounds,
      $18_step = 1;
    if ($18_step <= 0) throw new Error("SAI Runtime: COUNT STEP value should be positive.");
    for (; _i < $17_stop; _i = _i + $18_step) {
      _loc = (((_x < 0)) ? ((_x + $.bits)) : (_x));
      /*@:249*/
      $.buckets[(_loc >> 5)] |= (1 << (_loc & 0x1f));
      /*@:250*/
      _x = ((_x + _b) % $.bits);;
    }
  }
};
var $8g = prototype['Test'] || function() {};
prototype['Test'] = function(p) {
  var $20_this, $21_stop, $22_step, $23_none, $ = this['Test'] ? this : $bindfail('Test'),
    _a, _b, _i, _item = p,
    _loc, _s, _x; {
    _s = (((typeof(_item) === 'string')) ? (_item) : (_item.toString()));
    _a = $.FNV_1A(_s);
    _b = $.FNV_1A_B(_a);
    _x = (_a % $.bits);
    /*@:274*/
    var _i = 0,
      $21_stop = $.rounds,
      $22_step = 1;
    if ($22_step <= 0) throw new Error("SAI Runtime: COUNT STEP value should be positive.");
    for (; _i < $21_stop; _i = _i + $22_step) {
      _loc = (((_x < 0)) ? ((_x + $.bits)) : (_x));
      /*@:276*/
      if (!(($.buckets[(_loc >> 5)] & (1 << (_loc & 0x1f))))) {
        return (false);
      }
      /*@:278*/
      _x = ((_x + _b) % $.bits);;
    }
    /*@:280*/
    return (true);
  }
};
var $9g = prototype['Cardinality'] || function() {};
prototype['Cardinality'] = function(p) {
  var $24_this, $ = this['Cardinality'] ? this : $bindfail('Cardinality'),
    _bitcount; {
    _bitcount = $AI.reduce_op_fast($.buckets, function(s, v, k) {
      var t = ($.Bitcount).call($, v, k);
      return (s === undefined) ? t : s + t;
    }, undefined);
    /*@:294*/
    return ((((0 - ($.bits)) * Math.log((1 - (_bitcount / $.bits)))) / $.rounds));
  }
};
var $10g = prototype['Bitcount'] || function() {};
prototype['Bitcount'] = function(p) {
  var $25_this, $ = this,
    _v = p; {
    _v = (_v - ((_v >> 1) & 0x55555555));
    /*@:304*/
    _v = ((_v & 0x33333333) + ((_v >> 2) & 0x33333333));
    /*@:305*/
    _v = ((((_v + (_v >> 4)) & 0x0f0f0f0f) * 0x01010101) >> 24);
    /*@:306*/
    return (_v);
  }
};
var $11g = prototype['FNV_1A'] || function() {};
prototype['FNV_1A'] = function(p) {
  var $26_this, $27_trial, $28_stop, $29_step, $30_none, $ = this['FNV_1A'] ? this : $bindfail('FNV_1A'),
    _a, _c, _d, _i, _v = p; {
    _a = 2166136261;
    /*@:312*/
    var _i = 0,
      $28_stop = _v.length,
      $29_step = 1;
    if ($29_step <= 0) throw new Error("SAI Runtime: COUNT STEP value should be positive.");
    for (; _i < $28_stop; _i = _i + $29_step) {
      _c = _v.charCodeAt(_i);
      /*@:314*/
      _d = (_c & 0xff00);
      /*@:315*/
      if ($27_trial = (_d)) {
        _a = $.FNV_MULTIPLY(((_a ^ _d) >> 8));;
      }
      /*@:316*/
      _a = $.FNV_MULTIPLY((_a ^ (_c & 0xff)));;
    }
    /*@:317*/
    return ($.FNV_MIX(_a));
  }
};
var $12g = prototype['FNV_1A_B'] || function() {};
prototype['FNV_1A_B'] = function(p) {
  var $31_this, $ = this['FNV_1A_B'] ? this : $bindfail('FNV_1A_B'),
    _a = p; {
    return ($.FNV_MIX($.FNV_MULTIPLY(_a)));
  }
};
var $13g = prototype['FNV_MULTIPLY'] || function() {};
prototype['FNV_MULTIPLY'] = function(p) {
  var $32_this, $ = this,
    _a = p; {
    return ((_a + ((_a << 1) + ((_a << 4) + ((_a << 7) + ((_a << 8) + (_a << 24)))))));
  }
};
var $14g = prototype['FNV_MIX'] || function() {};
prototype['FNV_MIX'] = function(p) {
  var $33_this, $ = this,
    _a = p; {
    _a += (_a << 13);
    _a ^= (_a >>> 7);
    _a += (_a << 3);
    _a ^= (_a >>> 17);
    _a += (_a << 5);
    _a &= 0xffffffff;
    /*@:339*/
    return (_a);
  }
};
$AI.finalizePrototype(prototype);
if (prototype.isof[prototype.isa].type === "singleton") { prototype.Constructor(); prototype.Instantiate(); }
var result=prototype.isof[prototype.isa].type === "main" ? prototype.constructor() : prototype;
exports=result; try { module.exports=result; } catch(e) {};
return result;
