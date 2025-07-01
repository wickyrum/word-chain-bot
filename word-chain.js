const DB_USED = new URL('./arsenal/used_words.txt', import.meta.url).pathname
const SCOREBOARD = new URL('./arsenal/scores.json', import.meta.url).pathname
 
let lastUsr = undefined
let lastWord = 'apple'
let redundancy = undefined
import dotenv from 'dotenv/config'
import {wordSearch, wordWrite} from '/home/wickrum/word-chain-bot/arsenal/dataBase.js'
import {Client, IntentsBitField, Embed} from "discord.js"
import fs from 'node:fs';
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
    const oldScoreListStr = await fs.readFileSync(SCOREBOARD, null, 'utf-8')
    const oldScoreList = JSON.parse(oldScoreListStr) 
    for (let x in oldScoreList) {
        console.log(points)
        console.log(oldScoreList[x].user)
        console.log(lastUsr)
        if (oldScoreList[x].user == lastUsr) {
            oldScoreList[x].score += points
            console.log("hi vikram")
        }
        else {
            let newUser = {user: lastUsr, score: points}
            oldScoreList.push(newUser)
            return
        }
    }
    const newScoreListStr = await fs.writeFileSync(SCOREBOARD, JSON.stringify(oldScoreList, null, 4))
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
            message.react('\u0038\ufe0f\u20e3') //8 points
            points += 8
        }
        else if (word.length <= 6 && word[0] == word[word.length-1])  {
            message.react('\u0036\ufe0f\u20e3') //6 points 
            points += 6
        }
        else if (word.length > 6) {
            message.react('\u0036\ufe0f\u20e3') //6 points
            points += 6
        }
        else {
            message.react('\u0034\ufe0f\u20e3') //4 points
            points += 4
        }
        console.log(points)
    }
    lastWord = word
    return points
}

async function messageHandler(message) {
    if (message.channelId == '959416923878195202' && message.author.username != 'lichess-bot') {
        //NOTE(steps to do)
        // 
            // 1. word validation [x]
        let word = message.content.toLowerCase()
        const wordVal = await wordSearch(word, wordListPath) // returns a truth value
        if (word.length <= 2) {
            message.reply("Enter a bigger word")
        }
        if (wordVal) {
            // 2. word usage check
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

             
                //    --> allocate points to the word
            //        --> allocate points to the user

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
