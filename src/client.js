import UI from "./ui.js";
import ExtensionManager from "./extensionManager.js";

/**
 * @file sprintClient.js
 * @description The base class of Sprint. Pulls all the strings. The all seeing eye
 */
class SprintClient
{

  constructor()
  {
    /**
     * The environment variable for development and production differences
     */
    this.env = "dev";

    /**
     * Client Modules (not Travelers' modules!)
     */
    this.ui = UI;
    this.extensionManager = ExtensionManager;

    
    this.ui.hook(this);
    this.extensionManager.init(this);
    this.extensionManager.add({category: "bots", icon:"t",name:"test", id:"test"});

    this.debug("Initialized Sprint Client");
    this.log("-- SPRINT CLIENT --\nYou have successfully installed the Sprint Client. You can now start downloading a wide variety of travelersmmo content. Just go to the extensions tab next to the event log.\n\nYou can also learn how to make extensions here -> www.google.com");
    this.alert("Although all modules are looked through for malicious content before being made public, you should always be careful when downloading something onto your computer. You can check out all the source code for this client, as well as the modules here -> www.google.com");
  }


  hook()
  {
    
  }


  /**
   * Prints a message through the console
   * @param {string} message The message to print
   */
  log(message)
  {
    console.log("%c" + message, "font-size: 15px;");
  }


  /**
   * Prints a high visible warning to the console
   * @param {strubg} message The message to print
   */
  alert(message)
  {
    console.log("%c" + message, "font-weight: bold; background-color: #f22; color: white; padding: 2px;");
  }


  /**
   * Prints a message if in development
   * @param {string} message The message to print
   */
  debug(message)
  {
    if (this.env == "dev")
    {
      console.log("SPRINT_CLIENT_DEBUG::" + message);
    }
  }

}

export default SprintClient;