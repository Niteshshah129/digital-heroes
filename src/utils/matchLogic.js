export const checkMatch = (drawNumbers, userScores) => {

const draw = drawNumbers
.split(",")
.map(n => Number(n.trim()))

let match = 0

userScores.forEach(score=>{
if(draw.includes(Number(score))){
match++
}
})

return match

}