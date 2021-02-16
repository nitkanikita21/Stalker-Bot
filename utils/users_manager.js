const npc = require("../assets/persons.js");
const Inventory = require("../assets/inventory.js");
const LocationManager = require("./game/location_manager.js");
const ItemManager = require("./game/item_manager.js");
class Player {
    person = new npc.Person();
    inventory = new Inventory();
    currentLocation = {
        loc:"kordon",
        sub:"novice_village"
    }


    constructor(PersonName,ava){
        this.person = new npc.Person(PersonName,ava);
        this.inventory.add(ItemManager.findById("icon_group"));
        this.inventory.armor = ItemManager.findById("test_armor");
    }
    get location () {
        let loc = LocationManager.findById(this.currentLocation.loc)
        let sub = loc.findByIdSubLoc(this.currentLocation.sub)
        return {
            location: loc,
            sublocation: sub
        }
    }
    get allSubLocations () {
        let loc = LocationManager.findById(this.currentLocation.loc);
        let sublocations = loc.allSubLoc;
        return sublocations.filter(i=>i.id !== this.currentLocation.sub);
    }
}


class UsersManager {
    users = {};
    register(user_id,name,icon){
        this.users[user_id] = new Player(name,icon)
    }
    getPlayerFromId(user_id){
        return this.users[user_id];
    }
    checkRegUser(id){
        if(this.users[id] !== undefined)return true;
        else return false;
    }
}

module.exports = new UsersManager();