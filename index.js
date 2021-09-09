//Constantes
const Discord = require('discord.js');
const client = new Discord.Client();
const db = require('quick.db');
const config = require('./config.json');
const status = db.get(`StatusBot`);
const hora = new Date();
//Carregar alguns arquivos
require('./Load/ExtendedMessages.js')
//Script Ready
client.on('ready', () => {
    console.log(`
        =================================
        ✔️ Bot iniciado ✔️
        
        Nome: ${client.user.tag}
        Usuarios: ` + client.users.cache.size +
            `\n        Hora: ${hora.getUTCHours()}:${hora.getUTCMinutes()}:${hora.getUTCSeconds()}
        =================================
    `);
    if(status){
        var tabela = [
        { name: `${db.get(`StatusBot`)}`, type: 'WATCHING' },
        ];
    
        function setStatus() {
        var altstatus = tabela[Math.floor(Math.random() * tabela.length)]
        client.user.setActivity(altstatus)
        }
        setStatus("ONLINE")
        setInterval(() => setStatus(), 5000)
    }
});
//Acessar a pasta commands
client.on('message', async (message, guild) => {
    const db = require("quick.db");
    const Discord = require('discord.js');
    const blacklist = db.get(`blacklist_${message.author.id}`, true)
    let prefix = db.get(`prefix_${message.guild.id}`) || "!"
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
    else
    {
      if(message.channel.type === "dm") return;  
      if (!message.content.startsWith(prefix)) return;
      if (!message.guild) return;
      if(blacklist == true) return message.inlineReply('Me desculpe, mas você se encontra na Blacklist! Entre em contato com um Administrador para ver o que aconteceu!');
      if (!message.member) message.member = message.guild.fetchMember(message);
      const args = message.content.slice(prefix.length).trim().split(/ +/g);
      const cmd = args.shift().toLowerCase();
      if (cmd.length == 0) return;
      let command = client.commands.get(cmd)
      if (!command) command = client.commands.get(client.aliases.get(cmd));
      if (command) command.run(client, message, args)
    }
})
//Iniciar o Bot
client.login(config.token);