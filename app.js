const Discord = require('discord.js');
const config = require('./config/config.json');

const client = new Discord.Client();
const winstonLogger = require('./classes/logger.js');
const fs = require('fs');
const chalk = require('chalk');
const db = require('node-json-db');

const queue = new db('./queue/songs.json', true, true);
const songAmount = [];
// Logger -------- //
const winstonClass = new winstonLogger();
global.logger = winstonClass.logger;
client.commands = new Discord.Collection();

client.on('ready', async () => {
	logger.info(`MusicBot is ready!`);
	logger.verbose(`Connected as ${client.user.tag}`);
	logger.verbose(`With the ID of ${client.user.id}`);
	logger.info('======================================');
	await getGuilds();
	queue.delete('/parent');
});

process.on('unhaldedRejection', (reason, p) => {
	logger.error(reason);
});

fs.readdir('./commands/', (err, files) => {
	if (err) {
		logger.error(err);
	}
	const jsfiles = files.filter(f => f.split('.').pop() === 'js');
	if (jsfiles.length <= 0) {
		logger.info('No commands to load!');
		return;
	}
	logger.info(`Loading ${jsfiles.length} commands!`);

  // Loop through all the files and load them
	jsfiles.forEach((f, i) => {
		const props = require(`./commands/${f}`);
		logger.info(`${i + 1}: ${f} loaded`);
		client.commands.set(props.help.name, props);
	});
});

const prefix = config.prefix;
client.on('message', async message => {
	if (message.content.startsWith(`${prefix}ping`)) {
		message.channel.send('Pinging...').then(r => {
			r.edit(`Ping! ${r.createdTimestamp - message.createdTimestamp}ms`);
		});
	}
	const args = message.content.split(' ').slice(1);
	const command = message.content.split(' ')[0];
	if (!command.startsWith(prefix)) {
		return;
	}
	const cmd = client.commands.get(command.slice(prefix.length));
// Runs the command handler
	if (cmd) {
		try {
			cmd.run(client, message, args);
			logger.info(`${chalk.cyan(cmd.help.name)} just been executed by ${chalk.magenta(message.author.username)} inside ${chalk.yellow(message.guild.name)}`);
		} catch (e) {
			logger.error(e);
		}
	}
});

function getGuilds() {
	const map = client.guilds.map(i => i.id);
	const guildMaps = [];
	const songMaps = [];
	try {
		map.forEach(index => {
			const l = queue.getData(`/parent/${index}/TheSongs/mySongs/queue`);
			if (l) {
				songMaps.push(l.length);
			}
		});
	} catch (e) {

	}
	try {
		map.forEach(index => {
			if (queue.getData(`/parent/${index}`)) {
				guildMaps.push(index);
			}
			logger.verbose(`Deleting ${guildMaps.length} Guilds and ${songMaps} Songs from the queue`);
		});
	} catch (e) {
	}
}

client.login(config.token);
