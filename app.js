const Discord = require('discord.js');
const config = require('./config/config.json');
const client = new Discord.Client()


client.login(config.clientToken);
