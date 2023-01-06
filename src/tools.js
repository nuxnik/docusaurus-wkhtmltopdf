import Cli from './Cli.js';


// override the normal console.log
const log = (message) => {
  if (!Cli.argv.quiet) { 
    console.log(message);
  }
}

export default log;
