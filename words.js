import fs from 'node:fs';

// Returns the path to the word list which is separated by `\n`.
import wordListPath from 'word-list';

const wordArray = fs.readFileSync(wordListPath, 'utf8').split('\n');
console.log(wordArray.length)
const temp = [1, 2 , 3, 4, 5]
console.log(wordArray)
for (let x of wordArray) {
    console.log(x)
    if (x === 'abscond') {
        break;
    }
}
