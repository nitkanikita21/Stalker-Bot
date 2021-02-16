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
        return this.sublocations;
    }
}
class SubLocation{
    name = "";
    id   = "";
    npcs = [];
    transit = null;
    constructor(name,id,transit,npcs){
        this.name = name;
        this.id = id;
        this.npcs = npcs;
        this.transit = transit;
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