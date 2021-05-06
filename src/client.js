import config from "./config.js";
import UI from "./ui.js";
import ExtensionManager from "./extensionManager.js";
import Popup from "./popup.js";
import World from "./world.js";
import Traveler from "./traveler.js";
import Camera from "./camera.js";

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
    this.extensionManager = ExtensionManager(this);
    this.popup = Popup;
    this.world = World(this);
    this.traveler = Traveler(this);
    this.camera = Camera(this);

    // Data from the server
    this.data = { objects: [], players: [], stumps: [] };
    this.doors = new Map();

    // Bunch of data that the client may use
    // This is a hacky way to have shared data across multiple extensions
    this.options = {
      defaultRender: true, // Calls WORLD.build every frame

    };

    // Private variables
    this._hotbarButtonCount = 0;

    this.init();
  }

  /**
   * Connects the game events to the extensions
   */
  init()
  {
    this.ui.hook();


    this.initUpdate();
    this.initRender();
    
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

  initUpdate()
  {
    // Attaches extensions with the server update
    this._update = eval("(" +
      ENGINE.applyData.toString()
      .replace("WORLD.build();", "")
      .replace("WORLD.checkPlayersAndObjs();", "")
      + ")"
    );

    ENGINE.applyData = (json, midCycleDataCall) => {
      this._update(json, midCycleDataCall);

      // Build server data
      this.doors.clear();
      if (json.doors)
      {
        json.doors.forEach((door) => {
          this.doors.set(door, true);
        });
      }

      let objects = WORLD.otherObjs.map((object) => {
        if (this.doors.has(object.x + "|" + object.y))
        {
          object.opened = true;
        }

        return object;
      });

      // Remember object out of view but not too far
      const unchangedObjects = this.data.objects.filter((object) => (
        (object.x > YOU.x + 15 && object.x < YOU.x + 500) ||
        (object.x < YOU.x - 15 && object.x > YOU.x - 500) ||
        (object.y > YOU.y + 15 && object.y < YOU.y + 500) ||
        (object.y < YOU.y - 15 && object.y > YOU.y - 500)
      ));

      objects = [...unchangedObjects, ...objects];

      this.data.players = WORLD.otherPlayers;
      this.data.stumps = WORLD.otherStumps;
      this.data.objects = objects;

      // Updates extensions
      this.extensionManager.update(this, this.data);


      // Update modules
      this.traveler._update();

      // Render
      this.render();
    };
  }

  initRender()
  {
    // Copied and modified from worldgen.js
    WORLD.checkPlayersAndObjs = () => {
      for (let i = 0; i < this.data.stumps.length; i++)
      {
        let x = this.data.stumps[i].x;
        let y = this.data.stumps[i].y;

        if (YOU.x === x && YOU.y === y)
        {
          YOU.currentTile = WORLD.TILES.grass;
        }
        else
        {
          WORLD.changeTile(x, y, WORLD.TILES.grass);
        }
      }

      for (let i = 0; i < this.data.players.length; i++)
      {
        let x = this.data.players[i].x,
        y = this.data.players[i].y;

        // in case you forget, this will not need to include future building types, only ones that are generated in the clientside worldgen
        WORLD.changeTile(x, y, WORLD.TILES.traveler, true);
      }

      let atop = false,
      atop_and_above = false;
      HANDS.breakBtnEl.style.display = "none";
      for (let i = 0; i < this.data.objects.length; i++) {
        let x = this.data.objects[i].x,
          y = this.data.objects[i].y,
          char = this.data.objects[i].char,
          canWalkOver = this.data.objects[i].walk_over;

        if (char === "H") { // texturepack compatibility
            char = WORLD.TILES.house;
        }
        if (char === "C") {
            char = WORLD.TILES.city;
        }

        // if it's breakable and next to you, show "dismantle" button
        if (Math.abs(x - YOU.x) <= 1 && Math.abs(y - YOU.y) <= 1 && (this.data.objects[i].is_breakable || this.data.objects[i].is_door)) {
            HANDS.breakBtnEl.style.display = "";
        }

        if (canWalkOver) {
          if ((YOU.x !== x || YOU.y !== y)) {
            if (document.getElementById(x + "|" + y).innerHTML !== WORLD.TILES.traveler) {
              WORLD.changeTile(x, y, char);
            }
          }

          if (YOU.x === x && YOU.y === y) {
            atop_and_above = true;
          }
        } else {
          WORLD.changeTile(x, y, char);

          if (YOU.x === x && YOU.y === y) {
            atop = true;
          }
        }
      }
      
      ENGINE.atop_another = atop;
      ENGINE.atop_obj_and_above = atop_and_above;
    }
    
    // Copied from worldgen.js
    WORLD.build = () => {
      if (this.options.defaultRender)
      {
        let count = 0;
        for (let i = -1 * WORLD.gridRadius; i <= WORLD.gridRadius; i++) {
          for (let j = -1 * WORLD.gridRadius; j <= WORLD.gridRadius; j++) {
            let newX = YOU.x + this.camera.offset.x + j;
            let newY = YOU.y + this.camera.offset.y - i;
            let tile = WORLD.deriveTile(newX, newY);
  
            WORLD.tilemap[count].id = newX + "|" + newY;
            WORLD.tilemap[count].innerHTML = tile;
            WORLD.tilemap[count].style.fontWeight = "";
  
            if (newX === YOU.x && newY === YOU.y) {
              YOU.currentTile = tile;
              WORLD.tilemap[count].innerHTML = YOU.char;
            }
  
            count++;
          }
        }
      }
      else
      {
        YOU.currentTile = WORLD.deriveTile(YOU.x, YOU.y);
      }

      WORLD.coordsElem.innerHTML = YOU.getCoordString();
      WORLD.biomeElem.innerHTML = YOU.biome;

      YOU.checkMoveLog();

      this.extensionManager.render(this, this.data);
    };
  }

  render()
  {
    WORLD.build();
    WORLD.checkPlayersAndObjs();
  }


  addHotbarButton(title, onclick, toggle)
  {
    const button = document.createElement("span");
    button.id = "sprint-hotbar-button-" + this._hotbarButtonCount;
    button.className = "hotbar-btn unselectable";
    button.innerHTML = title;

    if (toggle)
    {
      button.onclick = () => {
        button.classList.toggle("active");
        onclick();
      };
    }
    else
    {
      button.onclick = onclick;
    }

    document.getElementById("hotbar-box").append(button);

    return this._hotbarButtonCount++;
  }

  removeHotbarButton(id)
  {
    document.getElementById("sprint-hotbar-button-" + id).remove();
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