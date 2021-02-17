const rnd = require("../utils/extra/math.js")

class Person{
    name = "";
    icon = "";
    npc = false;
    constructor(name,icon){
        this.name = name;
        this.icon = icon;
    }
}
class NPC extends Person{
    id   = "";
    npc = true;
    desc = "";
    constructor(name,desc,icon,id){
        super(name,icon)
        this.name = name;
        this.id = id;
        this.desc = desc;
    }
}

class Trader extends NPC{
    items = {};
    list_trade = [];
    constructor(name,desc,icon,id,items){
        super(name,desc,icon,id);
        this.items = items;
        this.generateNewTradeList();
        setInterval(()=>{
            this.generateNewTradeList();
        },35000)
    }
    generateNewTradeList(){
        this.list_trade = []
        Object.keys(this.items).map(c=>{
            if(rnd.getBoolByChance(this.items[c].chance)){
                this.list_trade.push({
                    id:c,
                    info:this.items[c]
                })
            }
        })
    }
    get trade_list(){
        return this.list_trade
    }
}

module.exports = {
    Person : Person,
    NPC    : NPC,
    Trader : Trader
}