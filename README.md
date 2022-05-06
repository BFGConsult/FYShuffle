# FYShuffle

FYShuffle is based on the Fisher-Yates shuffle algorithm, and is a scrambler for arbitrary text. The primary intended use is to prevent bots from reading email directly, but any text can be scrambled or unscrambled.

## Cryptographic strength
First off, **never use this for anything security related**. This is not the right way to go if you need any security properties.
That being said, the cryptographic properties of using this algorithm for its intended purpose are not as bad as one could expect.

There is no cleartext, so you cannot break it by a known plaintext attack, it's only easy to deduce the length of the text. The key is limited to 2^31, which implies that when the length of the text to encrypt is less than 12 characters, you cannot really deduce anything. When the length of the text to encrypt increases, statistical methods becomes more usable.

## Why does this work?
It shouldn't work, if you can read it a bot can read it. But for all practical purposes bots can't allocate enough resources to process a page by javascript, since it's querying thousands of pages per second. So in practice what happens is that the bot sees whatever you write in the non-JS version of the page, but the user sees the intended text.

## How about accessibility
This is not how to do accessibility right. This is simply a solution to the problem of spammers scraping email-addresses. Accessibility is important and I would argue that if you're using this script used on a limited scope, the benefits can outweigh the drawbacks, but I would very much emphasize the importance of universal access. Don't ignore someone, just because their method of experience your pages aren't the normal way.

## Testing
There's an example page continously deployed available at https://bfgconsult.github.io/FYShuffle/ . You can use this to generate "secret"-text
