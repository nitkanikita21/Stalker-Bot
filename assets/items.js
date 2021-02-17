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
    new Item(
        "medicine_chest_standart",
        "Аптечка",
        "Ваше спасение",
        10,
        "https://i.imgur.com/Q9D6ytg.jpg"
    ),
    new Item(
        "medicine_chest_army",
        "Армейская аптечка",
        "Ваше спасение",
        25,
        "https://i.imgur.com/pXB4gGx.jpg"
    ),
    new Item(
        "medicine_chest_science",
        "Научная аптечка",
        "Ваше спасение",
        34,
        "https://i.imgur.com/ec6nnrO.png"
    ),

    new Item(
        "bread",
        "Буханка хлеба",
        "Ешь вместе с едой",
        34,
        "https://i.imgur.com/WxpE65j.jpg"
    ),

    new Item(
        "akm74",
        "АКM-74",
        "Работает безотказно",
        40000,
        "https://i.imgur.com/gAXMr0Y.jpg"
    ),
    
    new Armor(
        "test_armor",
        "Тестовая броня",
        "А чё",
        450000,
        "https://static.wikia.nocookie.net/modistalker/images/5/5e/9190166.gif/revision/latest?cb=20171014155446&path-prefix=ru"
    )
]
