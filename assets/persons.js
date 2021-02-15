class Person{
    name = "";
    icon = "";
    constructor(name,icon){
        this.name = name;
        this.icon = icon;
    }
}
class NPC extends Person{
    id   = "";
    constructor(name,icon,id){
        super(name,icon)
        this.name = name;
        this.id = id;
    }
}

class Trader extends NPC{
    items = [];
    constructor(name,id,items){
        super(name,id);
        this.items = items;
    }
}

module.exports = {
    Person : Person,
    NPC    : NPC,
    Trader : Trader
}