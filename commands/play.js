const fetch = require('snekfetch');
const ytdl = require('ytdl-core');
const fs = require('fs');
const config = require('../config/config.json');
const fetchVideoInfo = require('youtube-info');
const Discord = require('discord.js')

exports.run = async (client, message) => {
  message.delete()
  const toPlay = message.content.split(' ').slice(1).join(' ');
  if (!toPlay) return message.reply('Please add a link of the song to the command')

  const ytdl = require('ytdl-core');
  const streamOptions = { seek: 0, volume: 1 };
  message.guild.member(message.author).voiceChannel.join()
 .then(connection => {
   fetch.get(`https://www.googleapis.com/youtube/v3/search?part=id&type=video&q=` + encodeURIComponent(toPlay) + "&key=" + config.ytKey)
    .then(async (r) => {
      // logger.debug(r.body.items[0]['videoId'])
      if (r.body.items[0]) {
        fetchVideoInfo(`${r.body.items[0].id.videoId}`).then( function (l) {
          const embed = new Discord.RichEmbed()
          .setAuthor(`Requested by ${message.author.username}`, l.thumbnailUrl)
          .addField(`Song Info`, `**Owner:** ${l.owner}\n\
  **Date Published:** ${l.datePublished}\n\
  **Duration:** ${l.duration}\n\
  **Views:** ${l.views}\n\
  **Song Name:** ${l.title}`)
          message.channel.send({embed})
        });
      } else {
        return message.reply('We didn\'t find the song :pensive:')
      }
    })
   const stream = ytdl(toPlay, { filter : 'audioonly' });
   const dispatcher = connection.playStream(stream, streamOptions);
  //  logger.info(dispatcher.range);

 })
 .catch(console.error);

};

module.exports.help = {
  name : 'play'
}
