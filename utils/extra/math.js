module.exports = {
    getBoolByChance:(chance)=>{
        return Math.floor((Math.random()*100)) < chance
    }
}