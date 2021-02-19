const usersManager = require("./users_manager.js");
const itemManager = require("./game/item_manager.js");
const extra = require("./extra/reactions.js");
const Discord = require("discord.js");

const extra_log = require("./extra/logger.js");
const logger = new extra_log(__filename);

class ButtonMenu{
    emoji = "";
    desc = "";
    onClick = ()=>{};
    constructor(emoji,desc,onClick){
        this.onClick = onClick;
        this.desc = desc;
        this.emoji = emoji;
    }
}

class MenuManager{
    constructor(client){
        this.client = client;
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
    menus = {
        "LOGIN_ERROR":{
            open:(msg,reason)=>{
                var embed_error = new Discord.MessageEmbed()
                embed_error
                    .setColor("#2f3136")
                    .setAuthor("S.T.A.L.K.E.R RP",this.client.user.avatarURL())
                    .setDescription(`Ошибка:\n${reason}`);
            
                msg.channel.send(embed_error);
            }
        },
        "LOGIN_SUCCESSFUL":{
            open:(msg,name)=>{
                let embed = new Discord.MessageEmbed();
                embed
                    .setColor("#2f3136")
                    .setAuthor("S.T.A.L.K.E.R RP",this.client.user.avatarURL())
                    .setImage("https://i.imgur.com/sMBguw1.png")
                    .setDescription(`Вы успешно зарегестрированы как **${name}**`+
                        (msg.channel.type != "dm" ? "```fix\n Для приватной игры используйте личные сообщения!```" : "")
                    )
                    .addField("__________",[
                        "▶️ - Начать игру"
                    ].join("\n"));
                
                msg.channel.send(embed).then(bot_msg=>{
                    bot_msg.react("▶️").then(react=>{
                        this.awaitReaction(bot_msg,msg.author,"▶️",()=>{
                            react.remove(this.client.user);
                            react.remove(msg.author);

                            this.openMenu(msg,"MAIN_MENU",null)
                        })
                    })
                    
                });
            }
        },
        "TUTORIAL":{
            open:()=>{

            }
        },
        "MAIN_MENU":{
            open:(msg)=>{
                let mm = this;
                let buttons = [
                    new ButtonMenu("📱","мой профиль",()=>{
                        mm.openMenu(msg,"PROFILE",null);
                    }),
                    new ButtonMenu("🗃️","инвентарь",()=>{
                        mm.openMenu(msg,"INVENTORY",null);
                    }),
                    new ButtonMenu("🚹","люди на локаци",()=>{
                        mm.openMenu(msg,"NPC",null);
                    }),
                    new ButtonMenu("🚶","сменить локацию",()=>{
                        mm.openMenu(msg,"LOCATION",null);
                    }),

                ]

                let embed = new Discord.MessageEmbed();
                embed
                    .setColor("#2f3136")
                    .setAuthor("Главное меню",this.client.user.avatarURL())
                    .addField("Меню",
                    
                        buttons.map(i=>{
                            return `${i.emoji} - ${i.desc}`;
                        }).join("\n")

                    )

                msg.channel.send(embed).then(bot_msg=>{
                    buttons.forEach(i=>{
                        bot_msg.react(i.emoji).then(react=>{
                            this.awaitReaction(
                                bot_msg,msg.author,
                                i.emoji,i.onClick
                            )
                        })
                    })
                })
            }
        },
        "INVENTORY":{
            open:(msg)=>{
                let mm = this;
                let buttons = [
                    new ButtonMenu("↩️","главное меню",()=>{
                        mm.openMenu(msg,"MAIN_MENU",null);
                    })
                ]

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

                msg.channel.send(embed).then(bot_msg=>{
                    buttons.forEach(i=>{
                        bot_msg.react(i.emoji).then(react=>{
                            this.awaitReaction(
                                bot_msg,msg.author,
                                i.emoji,()=>{
                                    react.remove(msg.author);
                                    i.onClick();
                                }
                            )
                        })
                    })
                });
            }
        },
        "PROFILE":{
            open:(msg)=>{
                let mm = this;
                let buttons = [
                    new ButtonMenu("↩️","главное меню",()=>{
                        mm.openMenu(msg,"MAIN_MENU",null);
                    })
                ]

                let player = usersManager.getPlayerFromId(msg.author.id);
                
                let embed = new Discord.MessageEmbed();
                embed
                    .setColor("#2f3136")
                    .setAuthor("ПДА: Ваш профиль",this.client.user.avatarURL())
                    .addField("Кличка",player.person.name,true)
                    .addField("Групировка","`Нереализовано`",true)
                    .setThumbnail(player.person.icon);
                
                msg.channel.send(embed).then(bot_msg=>{
                    buttons.forEach(i=>{
                        bot_msg.react(i.emoji).then(react=>{
                            this.awaitReaction(
                                bot_msg,msg.author,
                                i.emoji,()=>{
                                    react.remove(msg.author);
                                    i.onClick();
                                }
                            )
                        })
                    })
                });
            }
        },
        "LOCATION":{
            open:(msg)=>{
                let mm = this;
                let buttons = [
                    new ButtonMenu("↩️","главное меню",()=>{
                        mm.openMenu(msg,"MAIN_MENU",null);
                    })
                ]


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

                let reactions = []
                let client_link = this.client;

                function delAllReacts (){
                    reactions.forEach(r=>{
                        r.remove(client_link.user)
                    })
                }


                msg.channel.send(embed).then(msg_bot=>{
                    buttons.forEach(i=>{
                        msg_bot.react(i.emoji).then(reaction=>{
                            this.awaitReaction(
                                msg_bot,msg.author,
                                i.emoji,()=>{
                                    reaction.remove(msg.author)
                                    i.onClick()
                                }
                            )
                        })
                    })
                    for(let i = 0; i < locations.length; i++){
                        msg_bot.react(extra.getReactFromInt(i)).then(reaction=>{
                            reactions.push(reaction)
                            this.awaitReaction(
                                msg_bot,
                                msg.author,
                                extra.getReactFromInt(i),
                                ()=>{

                                    reaction.remove(msg.author)
                                    delAllReacts();

                                    msg_bot.edit(
                                        new Discord.MessageEmbed()
                                        .setAuthor("Смена локации")
                                        .setDescription("Это может занять некоторое время...")
                                    )
                                    player.transit(
                                        locations[i].id,
                                        ()=>{
                                            msg_bot.edit(
                                                new Discord.MessageEmbed()
                                                .setColor("#2f3136")
                                                .setAuthor("ПДА: Местоположение",this.client.user.avatarURL())
                                                .setDescription(`**${player.location.location.name}**\n   *${player.location.sublocation.name}*`)
                                            )
                                        }
                                    )

                                }
                            )
                        })
                    }
                });  
            }
        },
        "NPC":{
            open:(msg)=>{

                let mm = this;
                let buttons = [
                    new ButtonMenu("↩️","главное меню",()=>{
                        mm.openMenu(msg,"MAIN_MENU",null);
                    })
                ]

                let player = usersManager.getPlayerFromId(msg.author.id);
                let loc = player.location.location
                let subloc = player.location.sublocation;

                let entitys = player.location.sublocation.entitys;

                entitys = entitys.filter(i=>i !== player.person);

                let str = [];
                entitys.map((c,i)=>{
                    str[i] = `${i}. \`${c.name}\``
                })
                if(entitys.length == 0){
                    str[0] = "`Похоже здесь людей нет...`"
                }

                let embed = new Discord.MessageEmbed();
                embed
                    .setColor("#2f3136")
                    .setAuthor("ПДА: Люди",this.client.user.avatarURL())
                    .setDescription(`**${loc.name}**\n   *${subloc.name}*`)
                    .addField("Люди:",str.join("\n"))
                    .addField("Примечание","Взаимодействие доступно только для NPC\nторговцев и квестовых персонажей\n \nДля игроков выводится информация о них")
                    .setFooter("Нажми на номер нужного человека")

                let reactions = []

                let client_link = this.client;

                function delAllReacts (){
                    reactions.forEach(r=>{
                        r.remove(client_link.user)
                    })
                }

                msg.channel.send(embed).then(msg_bot=>{
                    let reactions = []
                    buttons.forEach(i=>{
                        msg_bot.react(i.emoji).then(reaction=>{
                            reactions.push(reaction)
                            this.awaitReaction(
                                msg_bot,msg.author,
                                i.emoji,()=>{
                                    reaction.remove(msg.author)
                                    i.onClick();
                                }
                            )
                        })
                    })

                    for(let i = 0; i < entitys.length; i++){
                        msg_bot.react(extra.getReactFromInt(i)).then(reaction=>{
                            let npc = entitys[i]
                            reactions.push(reaction)

                            this.awaitReaction(
                                msg_bot,
                                msg.author,
                                extra.getReactFromInt(i),
                                ()=>{
                                    delAllReacts()

                                    if(subloc.entityIsTrader(entitys[i].id)){

                                        let str_items = []
                                        npc.trade_list.map((c,i)=>{
                                            console.log(c)
                                            let item = itemManager.findById(c.id)
                                            str_items[i] = `${i}. \`${item.name}\` *${c.info.cost}RU*`
                                        })

                                        let embed_trade = new Discord.MessageEmbed();
                                        embed_trade
                                            .setColor("#2f3136")
                                            .setAuthor(`${npc.name}: Предметы в продаже`,npc.icon)
                                            .setDescription(`**${loc.name}**\n   *${subloc.name}*`)
                                            .addField("Предметы:",str_items.join("\n"))

                                        msg.channel.send(embed_trade)
                                    }if(subloc.entityIsPlayer(entitys[i].id)){

                                        console.log(npc.id)
                                        let user_player = usersManager.getPlayerFromId(npc.id);
                                        console.log(user_player)
                                        let embed_player = new Discord.MessageEmbed();
                                        embed_player
                                            .setColor("#2f3136")
                                            .setAuthor(`${npc.name}`,npc.icon)
                                            .addField("Групировка:","`Нереализовано`")
                                            .setFooter(`${user_player.user.tag} | Discord`,user_player.user.avatarURL())
                                        msg.channel.send(embed_player)
                                    }else {
                                        let embed_entity = new Discord.MessageEmbed();
                                        embed_entity
                                            .setColor("#2f3136")
                                            .setAuthor(npc.name,npc.icon)
                                            .setDescription(`${npc.desc}`)

                                        msg.channel.send(embed_entity)
                                    }
                                }
                            )
                        })
                    }

                })
            }
        }
    }
    openMenu(msg,menu_name,menu_args){
        this.menus[menu_name].open(msg,menu_args)
    }
}


class CommandManagerOld {
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
                            let name = msg.author.username
                            usersManager.register(msg.author,name,msg.author.avatarURL());
                            let embed = new Discord.MessageEmbed();
                            embed
                                .setColor("#2f3136")
                                .setAuthor("S.T.A.L.K.E.R RP",this.client.user.avatarURL())
                                .setImage("https://i.imgur.com/sMBguw1.png")
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
            if(/[^А-Яа-я ]/.test(name)){
                var embed_error = new Discord.MessageEmbed()
                embed_error
                    .setColor("#2f3136")
                    .setAuthor("S.T.A.L.K.E.R RP",this.client.user.avatarURL())
                    .setDescription(`Только кирилица!`);
            
                msg.channel.send(embed_error);
                return
            }
            if(name == ""){
                var embed_error = new Discord.MessageEmbed()
                embed_error
                    .setColor("#2f3136")
                    .setAuthor("S.T.A.L.K.E.R RP",this.client.user.avatarURL())
                    .setDescription(`Пустой ник нельзя! :)`);
            
                msg.channel.send(embed_error);
                return
            }
            usersManager.register(msg.author,name,msg.author.avatarURL());
            
            let embed = new Discord.MessageEmbed();
            embed
                .setColor("#2f3136")
                .setAuthor("S.T.A.L.K.E.R RP",this.client.user.avatarURL())
                .setImage("https://i.imgur.com/sMBguw1.png")
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
            
            msg.channel.send(embed).then(msg_bot=>{
                let reactions = []
                let client_link = this.client;
                for(let i = 0; i < locations.length; i++){
                    msg_bot.react(extra.getReactFromInt(i)).then(reaction=>{
                        reactions.push(reaction)
                        this.awaitReaction(
                            msg_bot,
                            msg.author,
                            extra.getReactFromInt(i),
                            ()=>{

                                reaction.remove(msg.author)
                                reactions.forEach(r=>{
                                    r.remove(client_link.user)
                                })
                                msg_bot.edit(
                                    new Discord.MessageEmbed()
                                    .setAuthor("Смена локации")
                                    .setDescription("Это может занять некоторое время...")
                                )
                                player.transit(
                                    locations[i].id,
                                    ()=>{
                                        msg_bot.edit(
                                            new Discord.MessageEmbed()
                                            .setColor("#2f3136")
                                            .setAuthor("ПДА: Местоположение",this.client.user.avatarURL())
                                            .setDescription(`**${player.location.location.name}**\n   *${player.location.sublocation.name}*`)
                                        )
                                    }
                                )

                            }
                        )
                    })
                }
            });            
        },
        "люди":(msg)=>{
            if(!usersManager.checkRegUser(msg.author.id)){
                this.fastlogin(msg)
                return
            }

            let player = usersManager.getPlayerFromId(msg.author.id);
            let loc = player.location.location
            let subloc = player.location.sublocation;

            let entitys = player.location.sublocation.entitys;

            entitys = entitys.filter(i=>i !== player.person);

            let str = [];
            entitys.map((c,i)=>{
                str[i] = `${i}. \`${c.name}\``
            })
            if(entitys.length == 0){
                str[0] = "`Похоже здесь людей нет...`"
            }

            let embed = new Discord.MessageEmbed();
            embed
                .setColor("#2f3136")
                .setAuthor("ПДА: Люди",this.client.user.avatarURL())
                .setDescription(`**${loc.name}**\n   *${subloc.name}*`)
                .addField("Люди:",str.join("\n"))
                .addField("Примечание","Взаимодействие доступно только для NPC\nторговцев и квестовых персонажей\n \nДля игроков выводится информация о них")
                .setFooter("Нажми на номер нужного человека")
            
            msg.channel.send(embed).then(msg_bot=>{
                let reactions = []
                let client_link = this.client;

                for(let i = 0; i < entitys.length; i++){
                    msg_bot.react(extra.getReactFromInt(i)).then(reaction=>{
                        let npc = entitys[i]
                        reactions.push(reaction)

                        this.awaitReaction(
                            msg_bot,
                            msg.author,
                            extra.getReactFromInt(i),
                            ()=>{
                                reaction.remove(msg.author)
                                reactions.forEach(r=>{
                                    r.remove(client_link.user)
                                })

                                if(subloc.entityIsTrader(entitys[i].id)){

                                    let str_items = []
                                    npc.trade_list.map((c,i)=>{
                                        console.log(c)
                                        let item = itemManager.findById(c.id)
                                        str_items[i] = `${i}. \`${item.name}\` *${c.info.cost}RU*`
                                    })

                                    let embed_trade = new Discord.MessageEmbed();
                                    embed_trade
                                        .setColor("#2f3136")
                                        .setAuthor(`${npc.name}: Предметы в продаже`,npc.icon)
                                        .setDescription(`**${loc.name}**\n   *${subloc.name}*`)
                                        .addField("Предметы:",str_items.join("\n"))

                                    msg.channel.send(embed_trade)
                                }if(subloc.entityIsPlayer(entitys[i].id)){

                                    console.log(npc.id)
                                    let user_player = usersManager.getPlayerFromId(npc.id);
                                    console.log(user_player)
                                    let embed_player = new Discord.MessageEmbed();
                                    embed_player
                                        .setColor("#2f3136")
                                        .setAuthor(`${npc.name}`,npc.icon)
                                        .addField("Групировка:","`Нереализовано`")
                                        .setFooter(`${user_player.user.tag} | Discord`,user_player.user.avatarURL())
                                    msg.channel.send(embed_player)
                                }else {
                                    let embed_entity = new Discord.MessageEmbed();
                                    embed_entity
                                        .setColor("#2f3136")
                                        .setAuthor(npc.name,npc.icon)
                                        .setDescription(`${npc.desc}`)

                                    msg.channel.send(embed_entity)
                                }
                            }
                        )
                    })
                }

            })
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
            this.commands["~"+cmd_name](msg);
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

class CommandManager {
    menu = new MenuManager();
    commands = {
        "войти":(msg)=>{
            let name = msg.content.split(" ");
            name = name.slice(1).join(" ")
            if(/[^А-Яа-я ]/.test(name)){
                this.menu.openMenu(msg,"LOGIN_ERROR","Используйте только кириллицу!")
                return
            }
            if(name == ""){
                this.menu.openMenu(msg,"LOGIN_ERROR","Введите имя а не пустое поле!")
                return
            }
            usersManager.register(msg.author,name,msg.author.avatarURL());
            
            this.menu.openMenu(msg,"LOGIN_SUCCESSFUL",name)
            
        },
        "инвентарь":(msg)=>{
            msg.reply(" команда устарела! Пожалуйста, используйте управление через `меню`!")
        },
        "профиль":(msg)=>{
            msg.reply(" команда устарела! Пожалуйста, используйте управление через `меню`!")
        },
        "локация":(msg)=>{
            msg.reply(" команда устарела! Пожалуйста, используйте управление через `меню`!")           
        },
        "люди":(msg)=>{
            msg.reply(" команда устарела! Пожалуйста, используйте управление через `меню`!")
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
        this.menu = new MenuManager(client);
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