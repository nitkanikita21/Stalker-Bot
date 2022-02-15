const npcs = require("./persons.js");

const extra = require("../utils/extra/array.js");

class Location {
    name = "";
    desc = "";
    id   = "";
    transit_time = 0 ;
    sublocations = [];
    constructor(name,desc,id,transit_time,sublocations){
        this.name = name;
        this.desc = desc;
        this.id = id;
        this.transit_time = transit_time;
        this.sublocations = sublocations;
    }
    findByIdSubLoc(id){
        return this.sublocations.find((i)=>i.id == id);
    }
    get allSubLoc(){
        return this.sublocations;
    }
}
class SubLocation{
    name = "";
    id   = "";
    entitys = [];
    transit = null;
    constructor(name,id,transit,npcs){
        this.name = name;
        this.id = id;
        this.entitys = npcs;
        this.transit = transit;
    }
    findEntityById(id){
        return this.entitys.find(e=>e.id === id);
    }
    checkEntityById(id){
        return this.findEntityById(id).npc
    }
    entityIsTrader(id){
        let npc = this.findEntityById(id);
        return npc instanceof npcs.Trader;
    }
    entityIsPlayer(id){
        let npc = this.findEntityById(id);
        return npc instanceof npcs.PlayerPeson;
    }
    addPerson(pers){
        this.entitys.push(pers)
    }
    remove(pers){
        this.entitys = extra.delete(this.entitys,pers);
    }
}

module.exports.types = {
    Location:Location,
    SubLocation:SubLocation
}

module.exports.locations = [
    new Location(
        "Кордон",
        "Предбанник зоны. Место где зелёные стают сталкерами.",
        "kordon",
        1000,
        [
            new SubLocation(
                "Деревня новичков",
                "novice_village",
                null,
                [
                    new npcs.Trader(
                        "Сидорович",
                        "Торгует вещами для новичков в своём подвале",
                        "https://i.imgur.com/qUZqi4O.jpg",
                        "sidor",
                        {
                            "akm74":{
                                cost:22000,
                                chance:60
                            },
                            "bread":{
                                cost:120,
                                chance:90
                            },
                            "medicine_chest_standart":{
                                cost:90,
                                chance:75
                            },
                            "medicine_chest_army":{
                                cost:310,
                                chance:45
                            },
                            "medicine_chest_science":{
                                cost:420,
                                chance:15
                            },
                        }
                    ),
                    new npcs.NPC(
                        "Волк",
                        "Главный в `Деревне новичков`",
                        "https://i.imgur.com/SfZqee4.jpg"
                    )
                ]
            ),
            new SubLocation(
                "АТП",
                "atp",
                null,
                [
                    
                ]
            ),
            new SubLocation(
                "Разрушеный мост",
                "broken_bridge",
                null,
                [
                    
                ]
            ),
            new SubLocation(
                "Тунель под насыпью",
                "bridge_tunel",
                null,
                [
                    
                ]
            ),
            new SubLocation(
                "Переход на свалку",
                "transit_svalka",
                {
                    locate:"svalka",
                    sublocation:"cemetery"
                },
                [
                    
                ]
            )
        ]
    ),
    new Location(
        "Свалка",
        "Место тусовки бандитов",
        "svalka",
        1000,
        [
            new SubLocation(
                "Кладбище техники",
                "cemetery",
                null,
                [
                    
                ]
            ),
            
            new SubLocation(
                "Застава долга",
                "dolg_outpost",
                null,
                [
                    
                ]
            ),
            new SubLocation(
                "Переход на Кордон",
                "transit_kordon",
                {
                    locate:"kordon",
                    sublocation:"broken_bridge"
                },
                [
                    
                ]
            )
        ]
    )
]