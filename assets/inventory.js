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
        return (finalSumm/1000).toString();
    }
    findStackedItem(item){
        let it = this.bag.find(i => i == item)
        return {
            item: it,
            index: this.bag.indexOf(it)
        }
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
        let find_item = this.findStackedItem(item)
        if(find_item.item !== undefined){
            this.bag[find_item.index].count++
        }else{
            this.bag.push(item);
        }
    }
    remove(item){
        let find_item = this.findStackedItem(item);


        if(find_item.item !== undefined){
            if(find_item.item.count > 1)
                this.bag[find_item.index].count--;
            else
            this.bag = extra.delete(this.bag,this.bag[find_item.index]);
        }else{
            this.bag = extra.delete(this.bag,this.bag[find_item.index]);
        }

        return item;
    }
}

module.exports = Inventory;