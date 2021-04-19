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

    // Data from the server
    this.data = {};
    this.doors = new Map();

    this.init();
  }

  /**
   * Connects the game events to the extensions
   */
  init()
  {

    // Attaches extensions with the server update
    this.engineUpdate = ENGINE.applyData;
    ENGINE.applyData = (json, midCycleCall) => {
      this.engineUpdate(json, midCycleCall);

      // Update Client
      this.traveler.position.x = YOU.x;
      this.traveler.position.y = YOU.y;

      // Send server data to extensions
      this.doors.clear();
      if (json.doors)
      {
        json.doors.forEach((door) => {
          this.doors.set(door, true);
        });
      }

      const objects = WORLD.otherObjs.map((object) => {
        if (this.doors.has(object.x + "|" + object.y))
        {
          object.opened = true;
        }
      });

      this.data = {
        stumps: WORLD.otherStumps,
        objects,
        players: WORLD.otherPlayers
      };

      this.extensionManager.update(this, this.data);
    };

    
    // Updates POPUP to allow Element objects
    const oldCode = ["this.evTitle.innerHTML = titleText;", "this.evDesc.innerHTML = descText.split(\"\\n\").join(\"<br />\");"]
    const newCode = "if(typeof titleText === \"string\"){" + oldCode[0] + oldCode[1] + "}else{this.evTitle.appendChild(titleText);this.evDesc.appendChild(descText);}";
    POPUP.new = eval("(" + POPUP.new.toString().replace(oldCode[0], "// Updated By Sprint Client") + ")");
    POPUP.new = eval("(" + POPUP.new.toString().replace(oldCode[1], newCode) + ")");

    this.extensionManager.restoreLocal();

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