const Discord = require("discord.js");
const config = require("../config.js").managers;
const client = new Discord.Client();
const cmd_manager = require("./command_manager.js");
const CommandManager = new cmd_manager(client);

const extra_log = require("./extra/logger.js");
const logger = new extra_log(__filename);

function Start(){
    client.on("message",(msg)=>{
        let name = msg.content.split(" ")[0];
        name = name.replace(config.command.prefix,"");

        CommandManager.findAndRun(name,msg);
    })
    client.on("ready",()=>{
        logger.log("Bot online")
    })

    client.login(require("../ds.json").token)
}
module.exports.Start = Start;