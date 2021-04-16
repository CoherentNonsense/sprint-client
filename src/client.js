import config from "./config.js";
import UI from "./ui.js";
import ExtensionManager from "./extensionManager.js";
import Popup from "./popup.js";

/**
 * @file sprintClient.js
 * @description The base class of Sprint. Pulls all the strings. The all seeing eye
 */
class SprintClient
{

  constructor()
  {

    /**
     * Client Submodules
     */
    this.ui = UI;
    this.extensionManager = ExtensionManager;
    this.popup = Popup;


    this.engineUpdate = ENGINE.applyData;


    this.init();
  }

  async test()
  {
    await this.extensionManager.load("exampleExtension");

    this.extensionManager.saveLocal();
  }


  /**
   * Connects the game events to the extensions
   */
  init()
  {
    this.ui.hook(this);
    this.extensionManager.init(this);

    ENGINE.applyData = (json, midCycleCall) => {
      this.engineUpdate(json, midCycleCall);

      const data = {
        stumps: WORLD.otherStumps,
        openedDoors: json.doors || [],
        objects: WORLD.otherObjs
      };

      this.extensionManager.update(data);
    };

    this.test();

    this.debug("Initialized Client");
    this.log("-- SPRINT CLIENT --\nYou have successfully installed the Sprint Client. You can now start downloading a wide variety of travelersmmo content. Just go to the extensions tab next to the event log.\n\nYou can also learn how to make extensions here -> www.google.com");
    this.alert("Although all modules are looked through for malicious content before being made public, you should always be careful when downloading something onto your computer. You can check out all the source code for this client, as well as the modules here -> www.google.com");
  }


  /**
   * Prints a message through the console
   * @param {string} message The message to print
   */
  log(message)
  {
    console.log("%c" + message, "font-size: 12px;");
  }


  /**
   * Prints a high visible warning to the console
   * @param {strubg} message The message to print
   */
  alert(message)
  {
    console.log("%c" + message, "font-size: 13px;font-weight: bold; background-color: #f22; color: white; padding: 2px;");
  }


  /**
   * Prints a message if in development
   * @param {string} message The message to print
   */
  debug(message)
  {
    if (config.env == "dev")
    {
      console.log("%cSPRINT_CLIENT_DEBUG\n" + message, "font-size:12px;");
    }
  }

}

export default SprintClient;