const fetch = require('snekfetch');
const ytdl = require('ytdl-core');
const fs = require('fs')
exports.run = async (client, message) => {
  const toPlay = message.content.split(' ').slice(1).join(' ');
  if (!toPlay) return message.reply('Please add a link of the song to the command')

  const ytdl = require('ytdl-core');
  const streamOptions = { seek: 0, volume: 1 };
  message.guild.member(message.author).voiceChannel.join()
 .then(connection => {
   const stream = ytdl(toPlay, { filter : 'audioonly' });
   ytdl.getInfo(toPlay, async (err, info) => {
     if (err) logger.log(err);
     console.log(info);
   })
   const dispatcher = connection.playStream(stream, streamOptions);
  //  logger.info(dispatcher.range);

 })
 .catch(console.error);

};

module.exports.help = {
  name : 'play'
}
