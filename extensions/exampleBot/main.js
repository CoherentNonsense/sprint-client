import Module from "../../src/module";
import random_quotes from "./quotes.js";

const bot = new Module("example_bot");

bot.onstart((client) => {
  client.doSomething();
});

export default bot;