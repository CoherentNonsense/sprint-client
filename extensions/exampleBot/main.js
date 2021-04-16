import Module from "../../src/module.js";
import random_quotes from "./quotes.js";

const bot = new Module({
  name: "exampleBot",
  icon: "c",
  category: "examples",
  about: "Prints a famous quote everytime you turn this on and off."
});

bot.on_start((client) => {
  console.log(random_quotes[Math.floor(Math.random() * random_quotes.length)]);
});

bot.on_stop((client) => {
  console.log(random_quotes[Math.floor(Math.random() * random_quotes.length)]);
});

export default bot;