const DB_USED = new URL('./arsenal/used_words.txt', import.meta.url).pathname
const SCOREBOARD = new URL('./arsenal/scores.json', import.meta.url).pathname
 
let lastUsr = undefined
let lastWord = 'apple'
let redundancy = undefined
import dotenv from 'dotenv/config'
import {wordSearch, wordWrite} from '/home/wickrum/word-chain-bot/arsenal/dataBase.js'
import {Client, IntentsBitField, Embed} from "discord.js"
import fs from 'node:fs/promises';
import wordListPath from 'word-list';

let validity = undefined
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.MessageContent,   
    ]
})

async function scoreBoard(points) {
    const oldScoreListStr = await fs.readFile(SCOREBOARD, null, 'utf-8')
    const oldScoreList = JSON.parse(oldScoreListStr) 
    let newUser = true
    for (let x in oldScoreList) {
        if (oldScoreList[x].user == lastUsr) {
            oldScoreList[x].score += points
            newUser = false
        }
    }
    if (newUser) {
        const newUserObj = {user: lastUsr, score: points}
        oldScoreList.push(newUserObj)
    }
    const newScoreListStr = await fs.writeFile(SCOREBOARD, JSON.stringify(oldScoreList, null, 4))
}

function pointsHandler(message) {
    const word = message.content.toLowerCase()
    let points = 0
    if (!(lastWord[lastWord.length-1] == word[0]))  {
        message.reply("the first letter of the current word doesn't match with the last letter of the last word")
        return
    }
    else {
        if (word.length > 6 && word[0] == word[word.length-1]) {
            message.react('\u0038\ufe0f\u20e3') 
            points += 8
        }
        else if (word.length <= 6 && word[0] == word[word.length-1])  {
            message.react('\u0036\ufe0f\u20e3') 
            points += 6
        }
        else if (word.length > 6) {
            message.react('\u0036\ufe0f\u20e3') 
            points += 6
        }
        else {
            message.react('\u0034\ufe0f\u20e3') 
            points += 4
        }
    }
    lastWord = word
    return points
}

async function messageHandler(message) {
    const isWord = /^[a-zA-Z]+$/.test(message.content)
    if (!(isWord)) {
        return
    }

    if (message.channelId == '959416923878195202' && message.author.username != 'WordChain-bot') {
        let word = message.content.toLowerCase()
        const wordVal = await wordSearch(word, wordListPath) 
        if (word.length <= 2) {   // should be checked earlier??
            message.reply("Enter a bigger word")
        }
        if (wordVal) {
            const wordUse = await wordWrite(word, DB_USED)
            if (wordUse == false) {
                message.reply('this word has already been used buddy')
                return
            }
            else {
                const points = pointsHandler(message)
                scoreBoard(points)
            }
            //3. user repetition check
            //if (lastUsr == message.author.username) {
                //message.reply('Not your turn!, wait for someone else you lonely bitch')
                //return
            //}


            lastUsr = message.author.username
        }
        else {
            message.reply("please enter a valid word")
        }
    }
} 
client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
}); 
client.on('messageCreate', messageHandler) 
client.login(process.env.DISCORD_TOKEN)
