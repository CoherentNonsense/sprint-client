import Extension from "../../src/extension.js";
import random_quotes from "./quotes.js";


/**
 * Initialization
 * Set all the values for the extension
 */
const extension = new Extension({
  name: "Example Extension", // The name that is shown to a player
  id: "exampleExtension", // A unique extension id. Must be the same as the directory name
  icon: "c", // The icon that appears in the extensions tab [Optional]
  category: "examples", // The category this extension is in e.g. texture pack [Optional]
  about: "Prints a famous quote everytime you turn this on and off.", // A short description [Optional]
  author: "CoherentNonsense" // The author [Optional]
});


/**
 * Private Variables
 * Make a list of all the variables your extension might need.
 */
let allowQuoteAlert = false


/**
 * Method calls
 * Every extension has three methods that the client will call 'on_start', 'on_stop', and 'on_update'
 * 
 * on_start: Called everytime this extension is turned on
 * on_stop: Called everytime this extension is turned off
 * on_update: Called everytime the server updates the client
 * 
 * Each methods will have access to the client object
 */

/**
 * Everytime this extension is turned on, it will create a popup with a random quote
 */
extension.onStart((client) => {
  const quote = random_quotes[Math.floor(Math.random() * random_quotes.length)];

  // A simple example of the popup builder
  client.popup.build("A Random Quote Appears", (body => {
    body.addParagraph(quote);
    body.break();
    body.addCheckbox("Checkbox", allowQuoteAlert);
    body.addButton("alert", () => { if (allowQuoteAlert) alert(quote) });
  }));
});


/**
 * Everytime this extension is turned off, if will print a popup into the console.
 */
extension.onStop((client) => {
  console.log(random_quotes[Math.floor(Math.random() * random_quotes.length)]);
});


/**
 * Every update this extension is turned on, it will print a random quote into the console
 */
extension.onUpdate((client, data) => {
  console.log(data);
});

export default extension;