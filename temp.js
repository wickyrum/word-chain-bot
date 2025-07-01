import fs from 'node:fs'
const SCOREBOARD = new URL('./arsenal/scores.json', import.meta.url).pathname

async function scoreBoard(points, user) {
    const oldScoreListStr = await fs.readFileSync(SCOREBOARD, null, 'utf-8')
    const oldScoreList = JSON.parse(oldScoreListStr) 
    console.log(oldScoreList)
}


scoreBoard(10, 'ramkumar')
/*let tempArr = [
    {user: "kunjirabatham", score: 10},
    {user: "kunjirabatham2", score: 15},
    {user: "kunjirabatham3", score: 12},
    {user: "kunjirabatham4", score: 22},
]
console.log(tempArr[1].score)*/
