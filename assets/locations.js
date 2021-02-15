const { Trader } = require("./persons.js");

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
        console.log(this.sublocations)
        return this.sublocations;
    }
}
class SubLocation{
    name = "";
    id   = "";
    npcs = [];
    transitions = [];
    constructor(name,id,transitions,npcs){
        this.name = name;
        this.id = id;
        this.npcs = npcs;
        this.transitions = transitions;
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
                [],
                [
                    new Trader(
                        "Сидорович",
                        "sidor",
                        {
                            "ak47":{
                                cost:22000,
                                chance:60
                            },
                            "bread":{
                                cost:120,
                                chance:90
                            }
                        }
                    )
                ]
            ),
            new SubLocation(
                "АТП",
                "atp",
                [],
                [
                    
                ]
            ),
            new SubLocation(
                "Разрушеный мост",
                "broken_bridge",
                [],
                [
                    
                ]
            ),
            new SubLocation(
                "Тунель под насыпью",
                "bridge_tunel",
                [],
                [
                    
                ]
            )
        ]
    )
]