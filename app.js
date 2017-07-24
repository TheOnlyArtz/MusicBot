const Discord = require('discord.js');
const config = require('./config/config.json');
const client = new Discord.Client()
const winstonLogger = require('./classes/logger.js')
const fs = require('fs')

const winstonClass = new winstonLogger
global.logger = winstonClass.logger

client.commands = new Discord.Collection();

client.on('ready', () => {
  logger.info(`MusicBot is ready!`);
  logger.verbose(`Connected as ${client.user.tag}`)
  logger.verbose(`With the ID of ${client.user.id}`)
})

process.on('unhaldedRejection', (reason, p) => {
  logger.error(reason)
});

fs.readdir('./commands/', async (err, files) => {
  if (err) logger.error(err)
  let javascriptFiles = files.filter(r => r.split('.').pop() === 'js')
  if (javascriptFiles <= 0) {
    logger.info('No commands to load');
    return;
  } else {
    logger.info(`Loading ${javascriptFiles.length} command`)
  }
  let IndexNum = 0
  javascriptFiles.forEach(async (file, index) => {
    let props = require(`./commands/${file}`);
    logger.info(`${index + 1}: ${file} loaded`);
    client.commands.set(props.help.name, props)
  });
})





let prefix = '!'
client.on('message', async (message) => {
  if (message.content.startsWith(`${prefix}ping`)) {
    message.channel.send('Pinging...').then(r => {
      r.edit(`Ping! ${r.createdTimestamp - message.createdTimestamp}ms`)
    })
  }
  let args = message.content.split(" ").slice(1);
let command = message.content.split(" ")[0];
if (!command.startsWith(prefix)) return;
let cmd = client.commands.get(command.slice(prefix.length));
//runs the command handler
  if (cmd)
    try {
      cmd.run(client, message, args);
      logger.info(`${chalk.cyan(cmd.help.name)} just been executed by ${chalk.magenta(message.author.username)} inside ${chalk.yellow(message.guild.name)}`)
    } catch (e) {
      logger.error(e);
    }
})

client.login(config.token)
