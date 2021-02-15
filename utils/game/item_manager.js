
class ItemManager{
    items;
    constructor(){
        this.load();
    }
    findById(id){
        return this.items.find((i)=>i.id == id);
    }
    load(){
        this.items = require("../../assets/items.js").items;
    }
}

module.exports = new ItemManager();