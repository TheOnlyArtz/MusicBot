const fetch = require('snekfetch');
const ytdl = require('ytdl-core');
const fs = require('fs');
const config = require('../config/config.json');
const fetchVideoInfo = require('youtube-info');
const Discord = require('discord.js')
const moment = require('moment')
const db = require('node-json-db')
const queue = new db("./commands/songs.json", true, true)

exports.run = async (client, message) => {
  console.log(queue[message.guild.id]);
  // guilds = {};
  message.delete()
  const toPlay = message.content.split(' ').slice(1).join(' ');
  if (!toPlay) return message.reply('Please add a link of the song to the command')

  const ytdl = require('ytdl-core');

  if(!message.member.voiceChannel) {
    return message.channel.send('Please get into a voice channel')
  }

  fetch.get(`https://www.googleapis.com/youtube/v3/search?part=id&type=video&q=` + encodeURIComponent(toPlay) + "&key=" + config.ytKey)
 .then(async (r) => {
   if (r.body.items[0]) {
     fetchVideoInfo(`${r.body.items[0].id.videoId}`).then( function (l) {
       const embed = new Discord.RichEmbed()
       .setAuthor(`Requested by ${message.author.username} and added to the queue`, l.thumbnailUrl)
       .addField(`Song Info`, `**Owner:** ${l.owner}\n\
**Date Published:** ${l.datePublished}\n\
**Duration:** ${(l.duration / 60).toFixed(2)} Minutes\n\
**Views:** ${l.views}\n\
**Song Name:** ${l.title}`)
       .setThumbnail(l.thumbnailUrl)
       message.channel.send({embed})
     });
   }

   try {
     queue.getData(`/${message.guild.id}`)
   } catch (e) {
     queue.push("/TheSongs/mySongs", {queue: []}, false);

   }

   queue.push("/TheSongs/mySongs", {queue: [r.body.items[0].id.videoId]}, false);


  if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(async (connection) => {
    play(connection, message);
    });

  })
  .catch(e => {
    message.reply('We could\' find the requested song :pensive:')
    logger.error(e)
  })
}

function play(connection, message) {
  let songsQueue = [];
  // try {
  //   queue.getData(`/${message.guild.id}`)
  // } catch (e) {
  //   logger.error(e)
  // }
  let json = queue.getData(`/TheSongs/mySongs/queue`);
  json.dispatcher = connection.playStream(ytdl(json[0], {filter: 'audioonly'}));


  setTimeout(() => {
    queue.delete(("/TheSongs/mySongs/queue[0]"));
  }, 3000)

  // queue.delete(`/${message.guild.id}/queue[0]`)

  json.dispatcher.on('end', function () {
    if (json) play(connection, message)
    else connection.disconnect()
  })
}
module.exports.help = {
  name : 'music'
}
