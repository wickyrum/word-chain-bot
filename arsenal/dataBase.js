// TODO:
// 0: save the last word
// 1: check validity
// 2: check redundancy
// 3: check first letter of curretn word and last letter last word
// 4: remove the current word from unused words list
// 5: calculate the score
// 6: react that number to that message
// 7: add that score to the user tally
// or reduce that score from the user tally
import fs from 'node:fs/promises'
import * as os from 'os'

export async function wordSearch(word, PATH) {
    const preReadFile = await fs.readFile(PATH,'utf-8')
    const readFile = preReadFile.split('\n')
    if (readFile.includes(word)) {
        return true
    }
    else {
        return false
    }
}

export async function wordWrite(word, PATH) {
    const val = await wordSearch(word, PATH)
    if (val == false) {
        const appendFile = fs.appendFile(PATH,'\n'+word, 'utf-8')
    }
    else {
        return false
    }
    
}




