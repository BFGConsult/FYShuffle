# FYShuffle

FYShuffle is based on the Fisher-Yates shuffle algorithm, and is a scrambler for arbitrary text. The primary intended use is to prevent bots from reading email directly, but any text can be scrambled or unscrambled.

## Cryptographic strength
First off, never use this for anything security related. This is not the right way to go if you need any security properties.
That being said, the cryptographic properties of the algorithm are not as bad as one could expect.

There is no cleartext, so you cannot break it by a known plaintext attack, it's only easy to deduce the length of the text. The key is limited to 2^31, which implies that when the length of the text to encrypt is less than 12 characters, you cannot really deduce anything. When the length of the text to encrypt increases. Statistical methods becomes more usable.
