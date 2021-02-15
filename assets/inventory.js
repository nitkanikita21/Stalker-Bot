const items = require("./items.js"       ).types;
const extra = require("../utils/extra/array.js");
class Inventory{
    bag = [];
    armor;
    get totalMass (){
        let finalSumm = 0;
        this.bag.forEach(i=>{
            let mass = i.mass;
            finalSumm += mass;
        })
        return finalSumm;
    }
    Equip(i){
        if(this.bag[i] == undefined){
            return undefined;
        }
        if((typeof this.bag[i]) != items.Armor){
            return false;
        }
        Object.assign(this.armor,this.bag[i]);
        bag = extra.delete(bag,this.bag[i]);
    }
    add(item){
        this.bag.push(item);
    }
}

module.exports = Inventory;