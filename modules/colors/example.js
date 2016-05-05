let colors = require("./colors");

console.log(colors.red.underline("Hi, I am red with underline!"));
console.log(colors.yellow.bold("Hi, I am yellow with bold!"));
console.log(colors.red.bgGreen("Hi, I am red with green background!"));


console.log("let's define some themes");


console.log(colors.yellow("First some yellow text"));

console.log(colors.yellow.underline("Underline that text"));

console.log(colors.red.bold("Make it bold and red"));

// console.log(colors.rainbow("Double Raindows All Day Long"))
// 
// console.log(colors.trap("Drop the bass"))
// 
// console.log(colors.rainbow(colors.trap("DROP THE RAINBOW BASS")));

console.log(colors.bold.italic.underline.red('Chains are also cool.')); // styles not widely supported


console.log(colors.green('So ') + colors.underline('are') + ' ' + colors.inverse('inverse') + colors.yellow.bold(' styles! ')); // styles not widely supported

// console.log(colors.zebra("Zebras are so fun!"));

console.log("This is " + colors.strikethrough("not") + " fun.");


console.log(colors.black.bgWhite('Background color attack!'));
console.log(colors.random('Use random styles on everything!'))
// console.log(colors.america('America, Heck Yeah!'));

console.log('Setting themes is useful')

//
// Custom themes
//
//console.log('Generic logging theme as JSON'.green.bold.underline);
// Load theme with JSON literal
colors.setTheme({
  //silly: 'rainbow',
  input: ['grey'],
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  match: 'red',
  error: 'red'
});

// outputs red text
console.log(colors.error("this is an error"));

// outputs yellow text
console.log(colors.warn("this is a warning"));

// outputs grey text
console.log(colors.input("this is an input"));


// console.log('Generic logging theme as file'.green.bold.underline);

// Load a theme from file
// colors.setTheme(__dirname + '/../themes/generic-logging.js');

// console.log(colors.zalgo("Don't summon him"))
//* @const {object} - Import configuration */

/*
let CONFIG = require("./config")

colors.loadConfig(CONFIG);

console.log(colors.error("this is an error"));

console.log(colors.warn("this is a warning"));

console.log(colors.input("this is an input"));
*/


console.log("\n\n");
console.log(colors.red.bold("ENABLE THE DIRTY MODE"));

colors.dirty(true);

console.log("First some yellow text".yellow);

console.log("Underline that text".yellow.underline);

console.log("Make it bold and red".red.bold);

// console.log(("Double Raindows All Day Long").rainbow)

// console.log("Drop the bass".trap)

// console.log("DROP THE RAINBOW BASS".trap.rainbow)


console.log('Chains are also cool.'.bold.italic.underline.red); // styles not widely supported

console.log('So '.green + 'are'.underline + ' ' + 'inverse'.inverse + ' styles! '.yellow.bold); // styles not widely supported
// console.log("Zebras are so fun!".zebra);

//
// Remark: .strikethrough may not work with Mac OS Terminal App
//
console.log("This is " + "not".strikethrough + " fun.");

console.log('Background color attack!'.black.bgWhite)
console.log('Use random styles on everything!'.random)
// console.log('America, Heck Yeah!'.america)

