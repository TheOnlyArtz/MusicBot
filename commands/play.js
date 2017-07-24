const fetch = require('snekfetch');
const ytdl = require('ytdl-core');
const fs = require('fs')
exports.run = async (client, message) => {
  const toPlay = message.content.split(' ').slice(1).join(' ');
  fs.readdir('./songs/', async (err, files) => {
    console.log(files.length);
    ytdl(toPlay, { filter: function(format) { return format.container === 'mp4'; } })
    .pipe(fs.createWriteStream(`./songs/Song${files.length + 1}.mp4`));
    if (!message.guild.member(message.author).voiceChannel) {
      logger.error('Please join into a voice channel.')
    } else {
      message.guild.member(message.author).voiceChannel.join();
    }
    console.log();
  })
};

module.exports.help = {
  name : 'play'
}
