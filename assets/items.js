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
        "Броня грешника",
        "А чё",
        450000,
        "https://static.wikia.nocookie.net/stalker_ru_gamepedia/images/2/2e/%D0%98%D0%BA%D0%BE%D0%BD%D0%BA%D0%B0_%D0%BA%D0%BE%D0%BC%D0%B1%D0%B8%D0%BD%D0%B5%D0%B7%D0%BE%D0%BD%D0%B0_%D1%81%D1%82%D0%B0%D0%BB%D0%BA%D0%B5%D1%80%D0%B0.jpg/revision/latest/scale-to-width-down/250?cb=20170724225746"
    )
]
