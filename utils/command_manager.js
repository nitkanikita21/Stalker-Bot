const usersManager = require("./users_manager.js");
const extra = require("./extra/reactions.js");
const Discord = require("discord.js");

const extra_log = require("./extra/logger.js");
const logger = new extra_log(__filename);



class CommandManager {
    fastlogin = (msg)=>{
        let embed = new Discord.MessageEmbed();
            embed
                .setColor("#2f3136")
                .setAuthor("S.T.A.L.K.E.R RP",this.client.user.avatarURL())
                .setDescription(`К сожалению вы не вошли в систему!\nВы можете быстро ввойти в систему нажав на 🔐`);
            msg.channel.send(embed).then(bot_msg=>{
                bot_msg.react("🔐").then(my_react=>{
                    this.awaitReaction(bot_msg,msg.author,"🔐",
                        ()=>{
                            logger.log("React")
                            let name = msg.author.username
                            usersManager.register(msg.author.id,name,msg.author.avatarURL());
                            let embed = new Discord.MessageEmbed();
                            embed
                                .setColor("#2f3136")
                                .setAuthor("S.T.A.L.K.E.R RP",this.client.user.avatarURL())
                                .setDescription(`Вы успешно зарегестрированы как \`${name}\``);
                            bot_msg.edit(embed)
                            my_react.remove(this.client.user);
                            my_react.remove(msg.author);
                        }
                    )
                })
                
            })
    }
    commands = {
        "войти":(msg)=>{
            let name = msg.content.split(" ");
            name = name.slice(1).join(" ")
            usersManager.register(msg.author.id,name,msg.author.avatarURL());
            
            let embed = new Discord.MessageEmbed();
            embed
                .setColor("#2f3136")
                .setAuthor("S.T.A.L.K.E.R RP",this.client.user.avatarURL())
                .setDescription(`Вы успешно зарегестрированы как \`${name}\``);
            
            msg.channel.send(embed);
        },
        "инвентарь":(msg)=>{
            if(!usersManager.checkRegUser(msg.author.id)){
                this.fastlogin(msg)
                return
            }
            let player = usersManager.getPlayerFromId(msg.author.id);
            let inventory = player.inventory;

            let inv_text = [];

            inventory.bag.map((c,i)=>{
                inv_text[i] = `${i}. \`${c.name}\` *${c.stringMass}кг*`
            })

            let embed = new Discord.MessageEmbed();
            embed
                .setAuthor("Вещи",this.client.user.avatarURL())
                .setThumbnail(inventory.armor.icon)
                .addField("Надето",inventory.armor.name)
                .addField("В сумке",inv_text.join("\n"))
                .addField("Общая сумма",inventory.totalMass+"кг")
                .setColor("#2f3136")
            
            msg.channel.send(embed);
        },
        "профиль":(msg)=>{
            if(!usersManager.checkRegUser(msg.author.id)){
                this.fastlogin(msg)
                return
            }

            let player = usersManager.getPlayerFromId(msg.author.id);
            
            let embed = new Discord.MessageEmbed();
            embed
                .setColor("#2f3136")
                .setAuthor("ПДА: Ваш профиль",this.client.user.avatarURL())
                .addField("Кличка",player.person.name,true)
                .addField("Групировка","`Нереализовано`",true)
                .setThumbnail(player.person.icon)
            
            msg.channel.send(embed);
        },
        "локация":(msg)=>{
            if(!usersManager.checkRegUser(msg.author.id)){
                this.fastlogin(msg)
                return
            }

            let player = usersManager.getPlayerFromId(msg.author.id);
            let locations = player.allSubLocations;
            
            let str = [];
            locations.map((c,i)=>{
                str[i] = `${i}. \`${c.name}\``
            })

            let embed = new Discord.MessageEmbed();
            embed
                .setColor("#2f3136")
                .setAuthor("ПДА: Местоположение",this.client.user.avatarURL())
                .setDescription(`**${player.location.location.name}**\n   *${player.location.sublocation.name}*`)
                .addField("Отправится в:",str.join("\n"))
                .setFooter("Нажми на номер нужной локации")
            
            msg.channel.send(embed).then(msg=>{
                for(let i = 0; i < locations.length; i++){
                    msg.react(extra.getReactFromInt(i))
                }
            });            
        },
        "реакция":(msg)=>{

            msg.channel.send("Сообщение").then(message=>{
                message.react(this.client.emojis.cache.get("668923953515069440")).then(my_react=>{
                    
                    this.awaitReaction(
                        message,
                        msg.author,
                        "<:monowut:668923953515069440>",
                        ()=>{
                            my_react.remove(this.client.user);
                            msg.reply("<:monowut:668923953515069440>");
                        }
                    )
                })

            })
        },
        "бот":(msg)=>{
            this.client.fetchApplication().then(app=>{
                let owner = app.owner;

                msg.channel.send(
                    new Discord.MessageEmbed()
                    .setColor("#2f3136")
                    .setAuthor("S.T.A.L.K.E.R RP",this.client.user.avatarURL())
                    .addField("Автор",`*\`${owner.tag}\`*`)
                    .setThumbnail(owner.avatarURL())
                    .addField("Сыллки",
                        `[\`[Пригласить бота]\`](https://discord.com/api/oauth2/authorize?client_id=683258927311618101&permissions=117824&scope=bot)\n`+
                        `[\`[GitHub]\`](https://github.com/VVSnitka/Stalker-Bot)`
                    )
                )
            })
        }

    }
    constructor(client){
        this.client = client;
    }

    findAndRun(cmd_name,msg){
        if(this.commands[cmd_name] !== undefined){
            this.commands[cmd_name](msg);
        }
    }
    awaitReaction (message,usr,react,callback) {
        function tick (cmd_manager){
            const filter = (reaction, user) => {
                return reaction.emoji.toString() === react && user.id === usr.id &&user.id !== cmd_manager.client.user.id
            }
            message.awaitReactions(filter, { time:100 })
                .then(collected => {
                    if(collected.size > 0){
                        callback();
                        clearInterval(this);
                    }
                })
                .catch(console.error);
        }
        setInterval(tick,100,this)
    }
}
module.exports = CommandManager