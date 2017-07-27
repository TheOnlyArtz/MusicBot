const Table = require('cli-table')
exports.run = async (client, message) => {
  var table = new Table({
    chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
           , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
           , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
           , 'right': '║' , 'right-mid': '╢' , 'middle': '│' },

    head: [
          `Song Name`,
          `Song Link`
       ], colWidths: [50, 50]
  });

  table.push(
      ['foo', 'bar']
    , ['frob', 'bar']
  );

  console.log(table.toString());};


module.exports.help = {
	name: 'test'
};
