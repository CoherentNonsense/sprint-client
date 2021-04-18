/**
 * This is an example of how you would make an extension
 * This extension will print out any objects that are around the player every game tic
 * 
 * You can use import and export to split up your extension to as many files as you want
 * 
 */


// You can create separate files and import them here.
import { randomWelcomeMessage, randomFairwellMessages } from "./messages.js";


/**
 * Initialization
 * Set all the values for the extension
 */
const extension = new Extension({
  id: "exampleExtension", // A unique extension id. Must be the same as the directory name
  name: "Object Logger", // The name that is shown to a player
  icon: "᭡", // The icon that appears in the extensions tab [Optional]
  category: "examples", // The category this extension is in e.g. texture pack [Optional]
  about: "Prints surrounding objects into the console.", // A short description [Optional]
  author: "CoherentNonsense" // The author [Optional]
});


/**
 * Private Variables
 * Make a list of all the variables your extension might need.
 */
let onlyShowBuilding = false;


/**
 * Method calls
 * Extensions have optional methods you can override that the client will call
 * 
 * onStart: Called everytime this extension is turned on
 * onStop: Called everytime this extension is turned off
 * onUpdate: Called everytime the server updates the client
 * onSettings: Called when this extension's settings are clicked. Useful for making an info page as well
 * 
 * Each methods will have access to the client object
 */

/**
 * Everytime this extension is turned on, it will create a popup with a random quote
 */
extension.onStart((client) => {
  const quote = randomWelcomeMessage[Math.floor(Math.random() * randomWelcomeMessage.length)];
  console.log(quote);
});


/**
 * Everytime this extension is turned off, if will print a popup into the console.
 */
extension.onStop((client) => {
  console.log(randomFairwellMessages[Math.floor(Math.random() * randomFairwellMessages.length)]);
});


/**
 * Every update this extension is turned on, it will print a random quote into the console
 */
extension.onUpdate((client, data) => {
  if (onlyShowBuilding)
  {
    console.log(data.objects);
  }
  else
  {
    console.log(data);
  }
});


/**
 * A player can choose how much info they get on update
 * The standard way of displaying your settings is by using a popup
 */
extension.onSettings((client) => {
  client.popup.build("Object Logger Settings", (build) => {

    build.addParagraph("Logging Info");
    build.break();
    build.addParagraph("Turn on if you only want to log player built objects.");
    build.addCheckbox("Log player objects", (value) => { onlyShowBuilding = value }, onlyShowBuilding);

  });
});

export default extension;