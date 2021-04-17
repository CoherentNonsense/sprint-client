import config from "./config.js";
import UI from "./ui.js";
import ExtensionManager from "./extensionManager.js";
import Popup from "./popup.js";
import World from "./world.js";
import Traveler from "./traveler.js";

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
    this.ui = UI(this);
    this.popup = Popup;
    this.extensionManager = ExtensionManager(this);
    this.world = World(this);
    this.traveler = Traveler(this);

    this.traveler.position = { x: YOU.x, y: YOU.y };

    this.init();
  }

  async test()
  {
    await this.extensionManager.load("exampleExtension");
    await this.extensionManager.load("autoSprint");

    this.extensionManager.saveLocal();

  }


  /**
   * Connects the game events to the extensions
   */
  init()
  {
    this.ui.hook();


    // Attaches extensions with the server update
    this.engineUpdate = ENGINE.applyData;
    ENGINE.applyData = (json, midCycleCall) => {
      this.engineUpdate(json, midCycleCall);

      // Update Client
      this.traveler.x = YOU.x;
      this.traveler.y = YOU.y;

      // Send server data to extensions
      const data = {
        stumps: WORLD.otherStumps,
        openedDoors: json.doors || [],
        objects: WORLD.otherObjs
      };

      this.extensionManager.update(this, data);
    };

    
    // Updates POPUP to allow Element objects
    const oldCode = ["this.evTitle.innerHTML = titleText;", "this.evDesc.innerHTML = descText.split(\"\\n\").join(\"<br />\");"]
    const newCode = "if(typeof titleText === \"string\"){" + oldCode[0] + oldCode[1] + "}else{this.evTitle.appendChild(titleText);this.evDesc.appendChild(descText);}";
    POPUP.new = eval("(" + POPUP.new.toString().replace(oldCode[0], "// Updated By Sprint Client") + ")");
    POPUP.new = eval("(" + POPUP.new.toString().replace(oldCode[1], newCode) + ")");

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