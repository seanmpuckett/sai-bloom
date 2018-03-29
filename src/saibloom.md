# Bloom Filter (in SAI)

Code is based on a Javascript implementation at <https://github.com/jasondavies/bloomfilter.js>.

Note: Assumes platform support for Uint32Array, which is a pretty safe assumption in the node ecosystem.

Written by Sean M Puckett <mailto:seanmpuckett@gmail.com>.  MIT License (appears at end of file).

_This package is usable in pure Javascript projects. SAI is only needed to recompile it._


### What's a Bloom filter?

From Wikipedia:

> A Bloom filter is a space-efficient probabilistic data structure, conceived by Burton Howard Bloom in 1970, that is used to test whether an element is a member of a set. False positive matches are possible, but false negatives are not – in other words, a query returns either "possibly in set" or "definitely not in set". Elements can be added to the set, but not removed (though this can be addressed with a "counting" filter); the more elements that are added to the set, the larger the probability of false positives.

> Bloom proposed the technique for applications where the amount of source data would require an impractically large amount of memory if "conventional" error-free hashing techniques were applied. He gave the example of a hyphenation algorithm for a dictionary of 500,000 words, out of which 90% follow simple hyphenation rules, but the remaining 10% require expensive disk accesses to retrieve specific hyphenation patterns. With sufficient core memory, an error-free hash could be used to eliminate all unnecessary disk accesses; on the other hand, with limited core memory, Bloom's technique uses a smaller hash area but still eliminates most unnecessary accesses. For example, a hash area only 15% of the size needed by an ideal error-free hash still eliminates 85% of the disk accesses.

> More generally, fewer than 10 bits per element are required for a 1% false positive probability, independent of the size or number of elements in the set.

Note that SaiBloom is not a 'counting' filter, as described above. One cannot remove items from it.

### Performance

The filter does not get slower (or take up more memory) when more things are added. The configuration size of the filter is the final size. Adding more items just gradually increases the probability of false positives.

Roughly 4M tests or insertions can be be performed per second, on a 2012 MacBook Pro Retina laptop, under node 9.3.0. This estimate is for items on the order of 1-10 characters, with an acceptable false positive rate of about 5%. Longer items and more accurate filters will take slightly longer.)

### False positives characterization

I wanted to understand filter performance across bits-per-item and number of hash rounds, so I undertook a 2-dimensional characterization iterating from 2-32 _bits-per-item_, and 2-16 _rounds_. 

For each test case:

- A filter was created with 100K * _bits_ and the given number of _rounds_.
- Then 100K unique items were _Add_ed. 
- The filter was then _Test_ed 1M times, each with a different unique item. 
- The desired outcome is that each _Test_ would return `false`. 
- The percentage of times it returned `true` instead, is the _false positive rate_.

The number of _rounds_ affects the false positive rate. For each number of _bits_, there is an optimum number of _rounds_ that produces the fewest false positives in this test suite. In the results below, only the number of _rounds_ per _bits_ producing the _best results_ (i.e. the lowest false positive rate) is shown. A cursory examination suggests choosing a number of _rounds_ that is about 2/3 the number of _bits_ will produce the best results.

- 2 bits @ 2 hashes: 40.08% false positives
- 3 bits @ 2 hashes: 23.73%
- 4 bits @ 3 hashes: 14.75%
- 5 bits @ 4 hashes:  9.15% 
- 6 bits @ 4 hashes:  5.60% 
- 7 bits @ 5 hashes:  3.48% 
- 8 bits @ 6 hashes:  2.16% 
- 9 bits @ 6 hashes:  1.33% 
- 10 bits @ 7 hashes:  0.82% 
- 11 bits @ 7 hashes:  0.50% 
- 12 bits @ 8 hashes:  0.32% 
- 13 bits @ 9 hashes:  0.19% 
- 14 bits @ 9 hashes:  0.11% 
- 15 bits @ 12 hashes: 0.07% 
- 16 bits @ 10 hashes: 0.04% 
- 17 bits @ 11 hashes: 0.02% 
- 18 bits @ 11 hashes: 0.01% 
- 19 bits @ 15 hashes: 0.01% 
- 20 bits @ 15 hashes: 0.00% 
  
Beyond 20 bits per item to be stored, there were no false positives found in the best row, though this is just a statistical null result rather than a provable one -- it is always _possible_ for a Bloom filter to fail, it just gets more and more unlikely the more bits have been set aside per item.

### Manual configuration

Looking at the chart above, estimate about how many items you want to store, and choose your acceptable false positive rate.

If you are okay with a 5% false positiverate, 6 bits per item will do.  Multiply the number of bits by the number of items you anticipate storing, and use the suggested number of hash rounds. 

In this example, if you have 1M items at a 5% false positive rate, that gives you 6M bits at 4 hashes, so you'd use `create SaiBloom 6000000, 4` as your initializer.

### Automatic configuration

You can also autoconfigure the filter by initializing it with an estimated number of items and an allowed failure rate.  

Pass in an object with these attributes:

- __size__: approximate number of items you'd like to store
- __rate__: minimum acceptable rate of failure, as a decimal fraction (e.g. 5% = 0.05).

The above configuration case would be `create SaiBloom: size 1000000, rate 0.05`.

It's important to note that even if you ask for a zero false positive rate, there is no ironclad guarantee that you will not get a false positive eventually. Do not rely on this for important things.


## Examples

### Javascript

Manual configuration:
    
    var SaiBloom=require('sai-bloom')                      // example
    var bloom=new SaiBloom(1000*10,7)       
    bloom.Add(1)
    console.log(bloom.Test(1)) // true
    console.log(bloom.Test(2)) // false
    
Automatic configuration:

    var bloom2=new SaiBloom({size: 10000, rate: 0.01});   // example

### SAI

Automatic configuration:

    set bloom to create SaiBloom: size 10000, rate 0.01   // example
    bloom.Add 1
    debug from bloom.Test 1    // true
    debug from bloom.Test 2    // false

Save and reload state:

    set bloom to create SaiBloom: size 100, rate 0.01     // example
    count 50
      bloom.Add counter
    set filterstate to bloom.state
    
    set bloom2 to create SaiBloom filterstate
    debug from bloom2.Test 25   // true
    debug from bloom2.Test 75   // false



## Implementation

SAI code for the Bloom filter follows (yes, this file can be compiled directly).


### SaiBloom object

    object SaiBloom

Instance variables:

    instance:
      buckets empty     // this will be initialized with a Uint32Array
      bits 0            // number of bits in the bloom filter (rounded to 32)
      rounds 0          // number of hash rounds (bits to set per Add)


### .state attribute

Recover / restore the filter's current state.

- On _get_: return the filter's state as a plain JS object.
- On _set_: set the filter's state to a value previously retrieved.

Implementation:

    state get
      return:
        bits bits
        rounds rounds
        buckets (empty).slice.call(buckets) // convert array-like object into actual array

    set 
      Configure $bits, $rounds
      ply $buckets
        set buckets\key to it



### Instantiate method

If passed a state-like object from an already made filter, will recreate that filter:

 -  __state__: (as p) a plain object previously retrieved from a bloom filter's `.state`.

If passed an autoconfiguration object, will choose suitable parameters

 - __p.size__: number of objects you propose to store in the filter
 - __p.rate__: acceptable rate of false positives, expressed as a decimal between 0.0 and 1.0, e.g. 0.05 = 5%.

Otherwise, to create an empty filter with manual configuration:

- __bits__: (as p) number of bits in the filter (will be rounded up to an even 32)
- __rounds__: number of hash rounds to run, e.g. number of bits to set per Add
 
Implemenation:

    Instantiate task given p, rounds_

      if p.bits       // did we get a state object?
        set state p
        
      elsif p.size    // did we get an autoconfiguration request?
        assert p.rate<0.5, "SaiBloom autoconfiguration error, rate should be less than 0.5 (not ${p.rate}) -- percentages must be decimal, e.g. 5% is 0.05."
        set rate to p.rate ?> 0.00001
        set b to (Math.log(rate) * -2) + 0.5
        set r to Math.ceil( b * 0.66 )
        Configure b * p.size, r

      else            // assume we got manual configuration
        Configure p, rounds_



### Configure method

Set up arrays, inilialize state, filter empty.

 - __bits__:: number of bits in the filter
 - __rounds__: number of bits to set per add
 
Implementation:

    Configure task given bits_, rounds_
      set
        bucketcount Math.ceil(bits_ / 32)
        bits bucketcount * 32
        rounds rounds_
        buckets new ~Uint32Array bucketcount



### Add method

Add a stringable item to the filter. 
 
 - __item__: must either be a string or have a `.toString()` method
 
The item is marked as having been added, though you cannot recover or remove it later.  All you can do is validate for sure whether it has __not__ been added, or has __probably__ been added.
 
    Add task given item
      set
        s to typeof item is 'string' ?? item :: item.toString()
        a to FNV_1A(s)
        b to FNV_1A_B(a)
        x to a % bits
      
      count rounds 
        set loc to x<0 ?? (x+bits) :: x
        set buckets[loc rsh 5] orb (1 lsh (loc andb 0x1f))
        set x to (self+b) % bits



### Test method

Test the filter to see if a stringable has been added

 - __item__: either a string or has a `.toString()` method
 
Returns

 - `false` if item has not been added
 - `true` if it probably has been added
 
Implementation:
 
    Test task given item     
      set
        s to typeof item is 'string' ?? item :: item.toString()
        a to FNV_1A(s)
        b to FNV_1A_B(a)
        x to a % bits
      
      count rounds 
        set loc to x<0 ?? (x+bits) :: x
        unless buckets[loc rsh 5] andb (1 lsh (loc andb 0x1f))
          return false
        set x to (self+b) % bits
      
      return true



### Cardinality method

Return an estimate of how many things are stored in the filter.

This should not be appreciably lower than the actual number of things.
If it is, then the bit count is too small for the number of items you're trying to store in the filter.
The more items you insert for a given bitcount, the more risk of false positives you will get.

    Cardinality task 
      set bitcount to buckets | total using Bitcount
      return (-bits * Math.log(1-bitcount/bits)) / rounds



### Internal functions

Count number of bits in a 32 bit integer.  Pretty cool parallel addition from <http://graphics.stanford.edu/~seander/bithacks.html#CountBitsSetParallel>

    Bitcount unbound task given v
      set v to self - ((self rsh 1) andb 0x55555555)
      set v to (self andb 0x33333333) + ((self rsh 2) andb 0x33333333)
      set v to (((self + (self rsh 4)) andb 0x0f0f0f0f) * 0x01010101) rsh 24
      return v

Fowler/Noll/Vo string hash, the alternate (preferred) implementation.

    FNV_1A task given v
      set a to 2166136261
      count v's length as i
        set c to v.charCodeAt(i)
        set d to c andb 0xff00
        if d .. set a to FNV_MULTIPLY( ( a xorb d ) rsh 8 )
        set a to FNV_MULTIPLY( a xorb ( c andb 0xff ) )
      return FNV_MIX( a )

Additional rounds of bit mixing to apply for Bloom bit distributions.

    FNV_1A_B task given a
      return FNV_MIX( FNV_MULTIPLY( a ) )

FNV multiplication, essentially `a * 16777619` but done in such a way it doesn't cascade into a float and lose precision.

    FNV_MULTIPLY unbound task given a
      return a + (a lsh 1) + (a lsh 4) + (a lsh 7) + (a lsh 8) + (a lsh 24)

FNV bit mixer, see <https://web.archive.org/web/20131019013225/http://home.comcast.net/~bretm/hash/6.html>

    FNV_MIX unbound task given a
      set
        a + (self lsh 13)
        a xorb (self ursh 7)
        a + (self lsh 3)
        a xorb (self ursh 17)
        a + (self lsh 5)
        a andb 0xffffffff
      return a


### License

MIT License.

Copyright 2018, Sean M Puckett

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
