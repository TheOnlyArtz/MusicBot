const Discord = require('discord.js');
const config = require('./config/config.json');
const client = new Discord.Client()
const winstonLogger = require('./classes/logger.js')

const winstonClass = new winstonLogger
global.logger = winstonClass.logger

client.on('ready', () => {
  logger.info(`MusicBot is ready!`);
  logger.verbose(`Connected as ${client.user.tag}`)
  logger.verbose(`With the ID of ${client.user.id}`)
})

client.login(config.token)
