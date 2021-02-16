class Item {
    id   = "";
    icon = "";
    name = "";
    desc = "";
    mass = 0 ;
    count= 1 ;
    constructor(
        id  ,
        name,
        desc,
        mass,
        icon
    ){
        this.id    =  id;
        this.icon  =  icon;
        this.name  =  name;
        this.mass  =  mass;
        this.desc  =  desc;
    }
    get mass () {
        return this.mass * this.count;
    }
    get stringMass(){
        return ((this.mass * this.count)/1000).toString();
    }
}
class Armor extends Item{
    strength = 100;
    constructor(
        id,
        name,
        desc,
        mass,
        icon,
    ){
        super(id,
            name,
            desc,
            mass,
            icon);
    }
}
module.exports.types = {
    Item: Item,
    Armor: Armor
}

module.exports.items = [
    new Item(
        "icon_group",
        "Эмблема групировки",
        "Обычная эмблема групировки",
        10,
        "https://i.pinimg.com/originals/77/b6/2d/77b62d8854cae578b63b2f338fb26d0e.png"
    ),
    new Armor(
        "test_armor",
        "Тестовая броня",
        "А чё",
        450000,
        "https://static.wikia.nocookie.net/modistalker/images/5/5e/9190166.gif/revision/latest?cb=20171014155446&path-prefix=ru"
    )
]
