module.exports = async (client, message, id) => {
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
      logger.info(`Started to stream by playing playlist requested by ${message.author.username}`);
      play(connection, message);
    });
  }
})
    .catch(e => {
  logger.error(e);
  logger.error(id.split('&list=')[1]);
});
}
