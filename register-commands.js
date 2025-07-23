import dotenv from 'dotenv/config'
import {REST, Routes} from 'discord.js'   
const commands = [
    {
        name: 'scoreboard',
        description: 'fetches server scoreboard',
    }, 
    {
        name: 'help',
        description: 'fetches help menu for the bot',
    }, 
]

const rest = new REST({version: '10'}).setToken(process.env.DISCORD_TOKEN); 
(async () => {
    try {
        console.log('starting putting commands')
        await rest.put( Routes.applicationCommands(process.env.BOT_ID), {body: commands})
        console.log('Successfully registered application commands.');
    } catch (error) {
        console.log(error);
    }

})()
