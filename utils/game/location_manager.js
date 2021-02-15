
class LocationManager{
    locations = [];
    constructor(){
        this.load();
    }
    load(){
        this.locations = require("../../assets/locations.js").locations;
    }
    findById(id){
        return this.locations.find((i)=>i.id == id);
    }
}

module.exports = new LocationManager();
