#!/usr/bin/env node

// Javascript source for saibloom.sai.md transpiled by SAI
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
var __context={"loader":"SAI.GetSourceFromFilename","path":"src/saibloom.sai.md","mtime":"2018-04-03T18:35:37.767Z","fetched":"2018-04-03T19:07:52.436Z"};
var $count$stepup = function(v) {
  throw new Error("SAI Runtime: COUNT STEP value should be positive, not " + v);
};
var isa = prototype.isa = 'SaiBloom';
var $bindfail = function(m) {
  throw new Error("SAI: A call to " + m + " on object " + isa + " has come unbound from any instance of that object. (If this is not in error, mark the declaration of " + m + " as unbound.)");
}
prototype.isof['SaiBloom'] = {
  version: '0.0.0-unspecified',
  isa: isa,
  context: __context
};
prototype.__tobelocked = prototype.__tobelocked.concat(["state", "Instantiate", "Configure", "Add", "Test", "Cardinality", "Bitcount", "FNV_1A", "FNV_1A_B", "FNV_MULTIPLY", "FNV_MIX", "Encode32to5", "Decode32to5", "isa"]);
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
    var $0_this, $1_key, $2_list, $3_length, $4_none, $ = this,
      $_c, $_d, _codes; {
      _codes = new Array($.buckets.length);
      var $2_list = $.buckets,
        $1_key;
      if (undefined === $2_list) $2_list = [];
      var $3_length = $2_list.length;
      for ($1_key = 0; $1_key < $3_length; $1_key++) {
        $0_this = $2_list[$1_key];
        _codes[$1_key] = _Encode32to5($0_this);;
      }
      return ({
        bits: $.bits,
        rounds: $.rounds,
        encoded: _codes.join('')
      });
    }
  },
  set: function(p) {
    var $5_this, $6_counter, $7_stop, $8_step, $9_none, $ = this,
      $_c, $_d; {
      $.Configure(p.bits, p.rounds);
      var $6_counter = 0,
        $7_stop = p.encoded.length,
        $8_step = 5;
      if (!($8_step > 0)) $count$stepup($8_step);
      for (; $6_counter < $7_stop; $6_counter = $6_counter + $8_step) {
        $.buckets[($6_counter / 5)] = _Decode32to5(p.encoded, $6_counter);;
      }
    }
  }
});
var $5g = prototype['Instantiate'] || function() {};
prototype['Instantiate'] = function(p, _rounds_) {
  var $10_this, $11_trial, $12_trial, $ = this['Instantiate'] ? this : $bindfail('Instantiate'),
    $_c, $_d, _b, _p = p,
    _r, _rate; {
    if ($11_trial = (_p.bits)) {
      $.state = _p;
    } else if ($12_trial = (_p.size)) {
      $AI.assert((_p.rate < 0.5), 'SaiBloom autoconfiguration error, rate should be less than 0.5 (not ' + _p.rate + ') -- percentages must be decimal, e.g. 5% is 0.05.');
      _rate = $AI.max_op(_p.rate, 0.00001);
      _b = ((Math.log(_rate) * (0 - (2))) + 0.5);
      _r = Math.ceil((_b * 0.66));
      $.Configure((_b * _p.size), _r);
    } else {
      $.Configure(_p, _rounds_);
    }
  }
};
var $6g = prototype['Configure'] || function() {};
prototype['Configure'] = function(p, _rounds_) {
  var $13_this, $ = this['Configure'] ? this : $bindfail('Configure'),
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
  var $14_this, $15_counter, $16_stop, $17_step, $18_none, $ = this['Add'] ? this : $bindfail('Add'),
    _a, _b, _item = p,
    _loc, _s, _x; {
    _s = (((typeof(_item) === 'string')) ? (_item) : (_item.toString()));
    _a = _FNV_1A(_s);
    _b = _FNV_1A_B(_a);
    _x = (_a % $.bits);
    var $15_counter = 0,
      $16_stop = $.rounds,
      $17_step = 1;
    if (!($17_step > 0)) $count$stepup($17_step);
    for (; $15_counter < $16_stop; $15_counter = $15_counter + $17_step) {
      _loc = (((_x < 0)) ? ((_x + $.bits)) : (_x));
      $.buckets[(_loc >> 5)] |= (1 << (_loc & 0x1f));
      _x = ((_x + _b) % $.bits);;
    }
  }
};
var $8g = prototype['Test'] || function() {};
prototype['Test'] = function(p) {
  var $19_this, $20_counter, $21_stop, $22_step, $23_none, $ = this['Test'] ? this : $bindfail('Test'),
    _a, _b, _item = p,
    _loc, _s, _x; {
    _s = (((typeof(_item) === 'string')) ? (_item) : (_item.toString()));
    _a = _FNV_1A(_s);
    _b = _FNV_1A_B(_a);
    _x = (_a % $.bits);
    var $20_counter = 0,
      $21_stop = $.rounds,
      $22_step = 1;
    if (!($22_step > 0)) $count$stepup($22_step);
    for (; $20_counter < $21_stop; $20_counter = $20_counter + $22_step) {
      _loc = (((_x < 0)) ? ((_x + $.bits)) : (_x));
      if (!(($.buckets[(_loc >> 5)] & (1 << (_loc & 0x1f))))) {
        return (false);
      }
      _x = ((_x + _b) % $.bits);;
    }
    return (true);
  }
};
var $9g = prototype['Cardinality'] || function() {};
prototype['Cardinality'] = function(p) {
  var $24_this, $ = this['Cardinality'] ? this : $bindfail('Cardinality'),
    _bitcount; {
    _bitcount = $AI.sum_op($.buckets, function(s, v, k) {
      var t = (_Bitcount).call($, v, k);
      return (s === undefined) ? t : s + t;
    }, undefined);
    return ((((0 - ($.bits)) * Math.log((1 - (_bitcount / $.bits)))) / $.rounds));
  }
};
var $10g = prototype['Bitcount'] || function() {};
var _Bitcount = prototype['Bitcount'] = function(p) {
  var $25_this, $ = undefined,
    _v = p; {
    _v = (_v - ((_v >> 1) & 0x55555555));
    _v = ((_v & 0x33333333) + ((_v >> 2) & 0x33333333));
    _v = ((((_v + (_v >> 4)) & 0x0f0f0f0f) * 0x01010101) >> 24);
    return (_v);
  }
};
var $11g = prototype['FNV_1A'] || function() {};
var _FNV_1A = prototype['FNV_1A'] = function(p) {
  var $26_this, $27_trial, $28_stop, $29_step, $30_none, $ = undefined,
    _a, _c, _d, _i, _v = p; {
    _a = 2166136261;
    var _i = 0,
      $28_stop = _v.length,
      $29_step = 1;
    if (!($29_step > 0)) $count$stepup($29_step);
    for (; _i < $28_stop; _i = _i + $29_step) {
      _c = _v.charCodeAt(_i);
      _d = (_c & 0xff00);
      if ($27_trial = (_d)) {
        _a = _FNV_MULTIPLY(((_a ^ _d) >> 8));;
      }
      _a = _FNV_MULTIPLY((_a ^ (_c & 0xff)));;
    }
    return (_FNV_MIX(_a));
  }
};
var $12g = prototype['FNV_1A_B'] || function() {};
var _FNV_1A_B = prototype['FNV_1A_B'] = function(p) {
  var $31_this, $ = undefined,
    _a = p; {
    return (_FNV_MIX(_FNV_MULTIPLY(_a)));
  }
};
var $13g = prototype['FNV_MULTIPLY'] || function() {};
var _FNV_MULTIPLY = prototype['FNV_MULTIPLY'] = function(p) {
  var $32_this, $ = undefined,
    _a = p; {
    return ((_a + ((_a << 1) + ((_a << 4) + ((_a << 7) + ((_a << 8) + (_a << 24)))))));
  }
};
var $14g = prototype['FNV_MIX'] || function() {};
var _FNV_MIX = prototype['FNV_MIX'] = function(p) {
  var $33_this, $ = undefined,
    _a = p; {
    _a += (_a << 13);
    _a ^= (_a >>> 7);
    _a += (_a << 3);
    _a ^= (_a >>> 17);
    _a += (_a << 5);
    _a &= 0xffffffff;
    return (_a);
  }
};
var $15g = prototype['Encode32to5'] || function() {};
var _Encode32to5 = prototype['Encode32to5'] = function(p) {
  var $34_this, $35_counter, $36_stop, $37_step, $38_none, $ = undefined,
    _i = p,
    _p, _v; {
    _v = '';
    var $35_counter = 0,
      $36_stop = 5,
      $37_step = 1;
    if (!($37_step > 0)) $count$stepup($37_step);
    for (; $35_counter < $36_stop; $35_counter = $35_counter + $37_step) {
      _p = (_i % 90);
      _v += String.fromCharCode((35 + _p));
      _i = ((_i - _p) / 90);;
    }
    return (_v);
  }
};
var $16g = prototype['Decode32to5'] || function() {};
var _Decode32to5 = prototype['Decode32to5'] = function(p, _pos) {
  var $39_this, $40_counter, $41_stop, $42_step, $43_none, $ = undefined,
    _i, _j, _s = p; {
    if (undefined === _pos) _pos = 0;
    _i = 0;
    _j = 1;
    var $40_counter = 0,
      $41_stop = 5,
      $42_step = 1;
    if (!($42_step > 0)) $count$stepup($42_step);
    for (; $40_counter < $41_stop; $40_counter = $40_counter + $42_step) {
      _i += ((_s.charCodeAt((_pos + $40_counter)) - 35) * _j);
      _j *= 90;;
    }
    return (_i);
  }
};
$AI.finalizePrototype(prototype);
if (prototype.isof[prototype.isa].type === "singleton") { prototype.Constructor(); prototype.Instantiate(); }
var result=prototype.isof[prototype.isa].type === "main" ? prototype.constructor() : prototype;
exports=result; try { module.exports=result; } catch(e) {};
return result;
