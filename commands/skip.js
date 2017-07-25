const db = require('node-json-db')
const queue = new db("./commands/songs.json", true, true)
exports.run = async (client, message) => {
  logger.debug(client.voiceConnections.map(r => r))

  if (!message.member.voiceChannel) {
    return message.reply('You cant skip if you are not in a voice channel')
  };

  try {
    queue.getData(`/${message.guild.id}`)
  } catch (e) {
    message.channel.send('Error while getting data')
  }

  // let json = queue.getData(`/TheSongs/mySongs/queue`);
  // json.dispatcher = connection.playStream(ytdl(json[0], {filter: 'audioonly'}));
  //
  // if (!json.dispatcher) {
  //   message.reply('No songs are playing');
  // }

}

module.exports.help = {
  name : 'skip'
}
