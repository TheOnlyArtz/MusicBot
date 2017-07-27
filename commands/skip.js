exports.run = async(client, message) => {
  let skipper = [];
  let skipReq = 0;

      if (skipper.indexOf(message.author.id) === -1) {
        skipper.push(message.author.id);
        skipReq++;
        if (skipReq >= Math.ceil((message.member.voiceChannel.members.size - 1) / 2)) {
  				await skip_song();
  				skipReq = 0;
  				skipper = []
  				message.reply('Skipped on the song successfully!')
  				logger.info(`${message.author.username} Skipped successfully on the song`)
  			} else {
  				message.reply(`Hey ${message.author.username}, Your skip as been added to the list\n\
  you need` + Math.ceil(((message.member.voiceChannel.members.size - 1) / 2) - skipReq) + 'Guy(s) to skip the song')
  			}
  	}

}
function skip_song() {
  dispatcher.end()
}

module.exports.help = {
	name: 'skip'
};
