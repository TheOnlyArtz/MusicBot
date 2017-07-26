const fetch = require('snekfetch');
const ytdl = require('ytdl-core');
const fs = require('fs');
const config = require('../config/config.json');
const fetchVideoInfo = require('youtube-info');
const Discord = require('discord.js')
const moment = require('moment')
const db = require('node-json-db')
const queue = new db("./commands/songs.json", true, true)
const titleForFinal = [];
const chalk = require('chalk')
const skipper = [];

exports.run = async (client, message) => {
  let action = message.content.split(' ')[1]
  // guilds = {};
  message.delete()
  if (action === 'play') {
    const toPlay = message.content.split(' ').slice(2).join(' ');
    if (!toPlay) return message.reply('Please add a link of the song to the command')


    if(!message.member.voiceChannel) {
      return message.channel.send('Please get into a voice channel')
    }
    if (!toPlay.includes('&list') && !toPlay.includes('index')) {
      fetch.get(`https://www.googleapis.com/youtube/v3/search?part=id&type=video&q=` + encodeURIComponent(toPlay) + "&key=" + config.ytKey)
     .then(async (r) => {
       if (r.body.items[0]) {
         fetchVideoInfo(`${r.body.items[0].id.videoId}`).then( function (l) {
           titleForFinal.push(l.title)
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
         queue.getData(`/parent/${message.guild.id}`)
       } catch (e) {
         queue.push(`/parent/${message.guild.id}/TheSongs/mySongs`, {queue: []}, false);

       }

       queue.push(`/parent/${message.guild.id}/TheSongs/mySongs`, {queue: [r.body.items[0].id.videoId]}, false);


      if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(async (connection) => {
        logger.info(`Started to stream ${chalk.magenta(titleForFinal)} for ${message.author.username}`)
        play(connection, message);
        });

      })
      .catch(e => {
        message.reply('We could\' find the requested song :pensive:')
        logger.error(e)
      })
    } else {
      console.log('got playlist before download');
      await playLists(message, toPlay)
      console.log('got playlist after download');
    }
  }
  if (action === 'skip') {
    let skipReq = 0
    if (skipper.indexOf(message.author.id) === -1) {
      skipper.push(message.author.id);
      skipReq++;
      if (skipReq >= Math.ceil((message.member.voiceChannel.members.size - 1) / 2)) {
        message.member.voiceChannel.join().then(async (connection) => {
         connection.dispatcher.end()
         logger.info(`${message.author.username} skipped successfully`)
         message.reply('Skipping successfully')
         })
         .catch(e => {
           message.channel.send(`${message.author.username} failed horribly at skipping a song.`)
           logger.error(e)
         })
      } else {
        message.channel.send(`Your skip got into the \`skippers list\` but you need more` + Math.ceil((message.member.voiceChannel.members.size - 1) / 2 - skipReq) + `guy(s)`)
      }
    }

  }

}

  function play(connection, message) {
    let songsQueue = [];
    // try {
    //   queue.getData(`/${message.guild.id}`)
    // } catch (e) {
    //   logger.error(e)
    // }
    let json = queue.getData(`/parent/${message.guild.id}/TheSongs/mySongs/queue`);
    json.dispatcher = connection.playStream(ytdl(json[0], {filter: 'audioonly'}));


    setTimeout(() => {
      queue.delete((`/parent/${message.guild.id}/TheSongs/mySongs/queue[0]`));
    }, 3000)

    // queue.delete(`/${message.guild.id}/queue[0]`)

    let list = queue.getData(`/parent/${message.guild.id}/TheSongs/mySongs/queue[0]`);
    console.log(json.dispatcher);
    json.dispatcher.on('end', function () {
      if (list) {
      play(connection, message)
      } else {
        connection.disconnect()
        queue.delete(`/parent/`)
      }
    })
  }

  function playLists(message, id) {
    fetch.get('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=' + id.split('&list=')[1] + '&key=' + config.ytKey)

    .then(res => {
      console.log(res.body.items.snippet);
      res.body.items.forEach(i => {
        if (i.id) {
          queue.push(`/parent/${message.guild.id}/TheSongs/mySongs`, {queue: [i.snippet.resourceId.videoId]}, false);
        }
      })
    })
    .catch(e => {
      logger.error(e)
      logger.error(id.split('&list=')[1])
    })
  }

module.exports.help = {
  name : 'music'
}
