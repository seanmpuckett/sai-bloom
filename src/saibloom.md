# Bloom Filter (in SAI)

Code is based on a Javascript implementation at <https://github.com/jasondavies/bloomfilter.js>.

Note: Assumes platform support for Uint32Array, which is a pretty safe assumption in the node ecosystem.

Written by Sean M Puckett <mailto:seanmpuckett@gmail.com>.  MIT License (appears at end of file).


### What's a Bloom filter?

From Wikipedia:

> A Bloom filter is a space-efficient probabilistic data structure, conceived by Burton Howard Bloom in 1970, that is used to test whether an element is a member of a set. False positive matches are possible, but false negatives are not – in other words, a query returns either "possibly in set" or "definitely not in set". Elements can be added to the set, but not removed (though this can be addressed with a "counting" filter); the more elements that are added to the set, the larger the probability of false positives.

> Bloom proposed the technique for applications where the amount of source data would require an impractically large amount of memory if "conventional" error-free hashing techniques were applied. He gave the example of a hyphenation algorithm for a dictionary of 500,000 words, out of which 90% follow simple hyphenation rules, but the remaining 10% require expensive disk accesses to retrieve specific hyphenation patterns. With sufficient core memory, an error-free hash could be used to eliminate all unnecessary disk accesses; on the other hand, with limited core memory, Bloom's technique uses a smaller hash area but still eliminates most unnecessary accesses. For example, a hash area only 15% of the size needed by an ideal error-free hash still eliminates 85% of the disk accesses.

> More generally, fewer than 10 bits per element are required for a 1% false positive probability, independent of the size or number of elements in the set.

Note that SaiBloom is not a 'counting' filter, as described above. One cannot remove items from it.

### Characterization

The following are the results of a performance test, running 100K unique items into a filter with the given number of bits per item, then checking 1M different unique items (which should be not be found) against the filter. 

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
  
Hash counts 2-16 were tested for each bit size, the row shown is the best (fewest false pasitives)

Beyond 20 bits per item to be stored, there were no false positives found in the best row.
    
Test method: A bloom filter was created with _n_ bits allocated per anticipated item to be stored. That number of unique items (100K) were stored in the filter. Then the filter was queried with 1M unique items known not to be in the filter. Time is for queries alone, not insertions (which run about the same speed as queries).

### Performance

Roughly 4-5M tests or insertions can be be performed per second, on a 2012 MacBook Pro Retina laptop, under node 9.3.0. 

### Configuring to your needs

Looking at the chart above, estimate about how many items you want to store, and choose your acceptable false positive rate.

If you are okay with a 5% false positive, 6 bits per items will do.  Multiply the number of bits by the number of items, and use the suggested number of hash rounds. 

In this example, if you have 1M items, that gives you 6M bits at 4 hashes, so you'd use `create SaiBloom 6000000, 4` as your initializer.

### Autoconfiguration

You can also autoconfigure the filter if you give it an estimated number of items and an allowed failure rate.  Pass in an object with these attributes:

- __size__: approximate number of items you'd like to store
- __rate__: minimum acceptable rate of failure, as a decimal fraction (e.g. 5% = 0.05).

The above configuration case would be `create SaiBloom: size 1000000, rate 0.05`.

It's important to note that even if you ask for a zero false positive rate, there is no ironclad guarantee that you will not get a false positive eventually. Do not rely on this for important things.


## Examples

### Javascript

Manual configuration:
    
    var SaiBloom=require('saibloom')                      // example
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

Static data:

    given:
      autoconfig:
        : 0.4008,  2,  2   // derived from the profiling
        : 0.2373,  3,  2   // an array of arrays
        : 0.1475,  4,  3   //  .0  false positive rate
        : 0.0915,  5,  4   //  .1  number of bits 
        : 0.0560,  6,  4   //  .2  number of rounds
        : 0.0348,  7,  5
        : 0.0216,  8,  6
        : 0.0133,  9,  6
        : 0.0082, 10,  7
        : 0.0050, 11,  7
        : 0.0032, 12,  8
        : 0.0019, 13,  9
        : 0.0011, 14,  9
        : 0.0007, 15, 10
        : 0.0004, 16, 10
        : 0.0002, 17, 11
        : 0.0001, 18, 11
        : 0.0000, 20, 15   // fencepost: still no guarantee of never getting a false positive



### .state attribute

Recover / restore the filter's present state.

- On _get_: return the filter's state as a plain JS object.
- On _set_: set the filter's state to a value previously retrieved
 

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
 

    Instantiate task given p, rounds_

      if p.bits       // did we get a state object?
        set state p
        
      elsif p.size    // did we get an autoconfiguration request?
        ply autoconfig
          if .0 < p.rate
            Configure .1 * p.size, .2
            return
        throw new Error "SaiBloom unable to autoconfigure with parameters size:${p.size} rate:${p.rate}."

      else            // assume we got manual configuration
        Configure p, rounds_



### Configure method

Set up arrays, inilialize state, filter empty.

 - __bits__:: number of bits in the filter
 - __rounds__: number of bits to set per add
 

    Configure task given bits_, rounds_
      set
        bucketcount Math.ceil(bits_ / 32)
        bits bucketcount * 32
        rounds rounds_
        buckets new ~Uint32Array bucketcount



### Add method

Add a stringable item to the filter. 

The item is marked as having been added, though you cannot recover or remove it later.  All you can do is validate for sure whether it has __not__ been added, or has __probably__ been added.
 
 - __item__: must either be a string or have a `.toString()` method
 
 
    Add task given item
      set
        s to typeof item is 'string' ?? item :: item.toString()
        a to FNV_1A(s)
        b to FNV_1A_B(a)
        x to a % bits
      
      count rounds as i
        set loc to x<0 ?? (x+bits) :: x
        set buckets[loc rsh 5] orb (1 lsh (loc andb 0x1f))
        set x to (self+b) % bits



### Test method

Test the filter to see if a stringable has been added

 - __item__: either a string or has a `.toString()` method
 
Returns

 - `false` if item has not been added
 - `true` if it probably has been added
 
 
    Test task given item     
      set
        s to typeof item is 'string' ?? item :: item.toString()
        a to FNV_1A(s)
        b to FNV_1A_B(a)
        x to a % bits
      
      count rounds as i
        set loc to x<0 ?? (x+bits) :: x
        unless buckets[loc rsh 5] andb (1 lsh (loc andb 0x1f))
          return false
        set x to (self+b) % bits
      
      return true



### Cardinality method

Return an estimate of how many things are stored in the filter.

This should not be appreciably lower than the actual number of things.
If it is, then the filter probably doesn't have enough bits.

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

FNV multiplication, essentially `a * 16777619` but done in such a way it doesn't cascade into a float.

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