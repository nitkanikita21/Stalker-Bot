const npc = require("../assets/persons.js");
const Inventory = require("../assets/inventory.js");
const LocationManager = require("./game/location_manager.js");
const ItemManager = require("./game/item_manager.js");

const extra_log = require("./extra/logger.js");
const logger = new extra_log(__filename);

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
    transit(sublocate_id,callback){
        let loc = LocationManager.findById(this.currentLocation.loc)
        if(loc.findByIdSubLoc(sublocate_id) === undefined)return false;

        let time = loc.transit_time;

        let transit_loc = loc.findByIdSubLoc(sublocate_id)

        if(transit_loc.transit !== null){
            let new_loc = transit_loc.transit.locate;
            let new_subloc = transit_loc.transit.sublocation;

            console.log(new_loc,new_subloc)
            this.currentLocation.loc = new_loc
            this.currentLocation.sub = new_subloc

            time = (time+new_loc.transit_time)*0.5;
        }else {
            this.currentLocation.sub = sublocate_id;
        }
        setTimeout(()=>{
            callback();
        },time)
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
    register(user,name,icon){
        logger.log(`${user.tag} был зарегестрирован как \n- ${name}`)
        this.users[user.id] = new Player(name,icon)
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