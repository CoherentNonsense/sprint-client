/**
 * The paths to loot 
 */

const paths = {

  // A Humble Home (empty)
  humble: {
    loot: [],
    getPath: () => []
  },

  // An Old Home
  old: {
    loot: ["scrap_metal"],
    getPath: () => [
      "enter",
      "the back room",
      "the closet",
      "search",
      "/loot"
    ]
  },

  // A Garage
  garage: {
    loot: [],
    getPath: (dontHave) => {
      if (dontHave["bolt_cutters"])
      {
        return [];
      }

      return [
        "break in",
        "step over tripwire",
        "the supply room",
        "loot area",
        "/loot"
      ];
    }
  },

  // A Withered City (Dont want to map this out yet)
  withered: {
    loot: [],
    getPath: () => []
  },

  blasted: {
    loot: [
      "circuit_board",
      "copper_coil",
      "wire",
      "scrap_metal",
      "battery",
      "plastic",
      "rope",
      "keycard_e",
      "bp_low_teleporter",
      "bp_high_teleporter",
      "pistol",
      "cloth",
      "bullet"
    ],
    getPath: (dontHave) => {

      const safePath = [
        "the safe",
        "/loot"
      ];

      const boltCutterPath = [
        "the ladder",
        "the eighteenth floor",
        "the staircase",
        "the electrical room",
        "/loot",
        "back in the tower",
        "loot area",
        "/loot",
        "continue",
        "return to tower base",
        "the staircase",
        "the ladder",
        "the eighteenth floor",
        "the staircase",
        "the electical room",
        "/loot",
        "the lift",
        "ascend",
        "the ladders",
        "loot area",
        "/loot",
        "return to tower base",
        "re-enter tower",
      ];

      const noBoltCutterPath = [
        "the rubble pile",
        "the spiral stairs",
        "return to tower base",
        "re-enter tower"
      ];

      return [
        "the road",
        "the tower",
        "the elevator",
        "/loot",
        "the staircase",
        ...(dontHave["powered_blowtorch"] ? [] : safePath),
        ...(dontHave["bold_cutters"] ? noBoltCutterPath : boltCutterPath),
        "the exit sign",
        "the fire escape",
        "the eighth floor",
        "the office",
        "loot area",
        "/loot",
        "return to tower base"
      ];
    }
  }

};

class Path
{
  constructor(name, loot, dontHave = [])
  {
    this.loot = loot;
    this.step = 0;

    if (!paths[name])
    {
      this.path = [];
      console.log("Resource Gatherer: Structure not mapped yet.");
      return;
    }

    const structureLoot = paths[name].loot;
    let containsLoot = false;

    for (let i = 0; i < structureLoot.length; ++i)
    {
      if (loot[structureLoot[i]].active)
      {
        containsLoot = true;
        break;
      }
    }

    if (containsLoot)
    {
      this.path = paths[name].getPath(dontHave);
    }
    
    // No loot so leave event
    this.path = [];
  }

  next()
  {
    const classList = document.getElementsByClassName("popup-button")
    const otherList = document.getElementsByClassName("popup-reqbutton");

    // Leave if finished
    if (this.step === this.path.length)
    {
      for (let i = 0; i < classList.length; i++)
      {
        if (classList[i].value === "exit event")
        {
          classList[i].click();
          SOCKET.send({"action": "event_choice", "option": "__leave__"});
        }
      }
      return true;
    }

    const step = this.path[this.step++];

    // Loot
    if (step === "/loot")
    {
      SOCKET.send({action: "loot_takeall"});
      SOCKET.send({"action": "loot_next"});
      return;
    }
    
    // Next step
    for (let i = 0; i < classList.length; i++)
    {
      if (classList[i].value === step)
      {
        classList[i].onclick();
        return false;
      }
    }
  
    for (let i = 0; i < otherList.length; i++)
    {
      if (otherList[i].innerHTML.includes(step))
      {
        otherList[i].onclick();
        return false;
      }
    }

    // Step not found
    console.log("Path Error: Route has incorrect step.");
  }
}

export default Path;