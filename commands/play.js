const fetch = require('snekfetch');
const ytdl = require('ytdl-core');
const fs = require('fs');
const config = require('../config/config.json');
const fetchVideoInfo = require('youtube-info');
const Discord = require('discord.js');
const moment = require('moment');
const db = require('node-json-db');

const queue = new db('./queue/songs.json', true, true);
const titleForFinal = [];
const chalk = require('chalk');

const skipper = [];
const skipReq = 0;

exports.run = async (client, message) => {
  // Guilds = {};
	message.delete();
	// =========================Play Command==============================
	const toPlay = message.content.split(' ').slice(1).join(' ');
	if (!toPlay) {
		return message.reply('Please add a link of the song to the command');
	}

	if (!message.member.voiceChannel) {
		return message.channel.send('Please get into a voice channel');
	}
	if (!toPlay.includes('&list') && !toPlay.includes('index')) {
		fetch.get(`https://www.googleapis.com/youtube/v3/search?part=id&type=video&q=` + encodeURIComponent(toPlay) + '&key=' + config.ytKey)
     .then(async r => {
	if (r.body.items[0]) {
		fetchVideoInfo(`${r.body.items[0].id.videoId}`).then(l => {
			titleForFinal.push(l.title);
			const embed = new Discord.RichEmbed()
           .setAuthor(`Requested by ${message.author.username} and added to the queue`, l.thumbnailUrl)
           .addField(`Song Info`, `**Owner:** ${l.owner}\n\
    **Date Published:** ${l.datePublished}\n\
    **Duration:** ${(l.duration / 60).toFixed(2)} Minutes\n\
    **Views:** ${l.views}\n\
    **Song Name:** ${l.title}`)
           .setThumbnail(l.thumbnailUrl);
			message.channel.send({embed});
		});
	}

	try {
		queue.getData(`/parent/${message.guild.id}`);
	} catch (e) {
		queue.push(`/parent/${message.guild.id}/TheSongs/mySongs`, {queue: []}, false);
	}

	try {
		queue.push(`/parent/${message.guild.id}/TheSongs/mySongs`, {queue: [r.body.items[0].id.videoId]}, false);
	} catch (e) {
		logger.error(e);
	}

	if (!message.guild.voiceConnection) {
		message.member.voiceChannel.join().then(async connection => {
			logger.info(`Started to stream ${chalk.magenta(r.body.items[0].title)} for ${message.author.username}`);
			play(connection, message);
		});
	}
})
      .catch(e => {
	message.reply('We could\' find the requested song :pensive:');
	logger.error(e);
});
	} else {
	// =========================Plays Playlists==============================
		await playLists(message, toPlay);
		logger.info(`Streaming a playlist for ${message.author.username}`);
	}
};

// =========================Play Function==============================

function play(connection, message) {
	const songsQueue = [];
	const json = queue.getData(`/parent/${message.guild.id}/TheSongs/mySongs/queue`);
	dispatcher = connection.playStream(ytdl(json[0], {filter: 'audioonly'}));

	const list = queue.getData(`/parent/${message.guild.id}/TheSongs/mySongs/queue[0]`);
	if (!message.guild.voiceConnection) {
		message.member.voiceChannel.join().then(async connection => {
			logger.info(`Started to stream ${chalk.magenta(titleForFinal)} for ${message.author.username}`);
			play(connection, message);
		});
	}
	fetchVideoInfo(`${list}`).then(l => {
		message.channel.send(`Started to stream **\`${l.title}\`** Requested by ${message.author.username}`);
		logger.info(`Downloading the song ==> ${l.title} for ${message.author.username}`);
		logger.info(`Downloaded ${l.title} successfully Enjoy!`);
	});
	setTimeout(() => {
		queue.delete((`/parent/${message.guild.id}/TheSongs/mySongs/queue[0]`));
	}, 3000);

	dispatcher.on('end', () => {
		if (list) {
			play(connection, message);
		} else {
			connection.disconnect();
			queue.delete(`/parent/`);
		}
	});
}

// =========================Get Playlist Function==============================

function playLists(message, id) {
	fetch.get('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=' + id.split('&list=')[1] + '&key=' + config.ytKey)
    .then(res => {
	const playembed = new Discord.RichEmbed()
			.setAuthor(`New playlist added contains ${res.body.items.length} songs in it`, message.author.displayAvatarURL);
	message.channel.send({embed: playembed});
	try {
		queue.getData(`/parent/${message.guild.id}`);
	} catch (e) {
		queue.push(`/parent/${message.guild.id}/TheSongs/mySongs`, {queue: []}, false);
	}
	res.body.items.forEach(i => {
		if (i.id) {
			queue.push(`/parent/${message.guild.id}/TheSongs/mySongs`, {queue: [i.snippet.resourceId.videoId]}, false);
		}
	});
	if (!message.guild.voiceConnection) {
		message.member.voiceChannel.join().then(async connection => {
			play(connection, message);
		});
	}
})
    .catch(e => {
	logger.error(e);
	logger.error(id.split('&list=')[1]);
});
}

module.exports.help = {
	name: 'play'
};
