import resources from "./resources.js";
import Path from "./structurePaths.js";

const extension = new Extension({
  id: "resourceGatherer",
  name: "Resource Gatherer",
  icon: "⛏",
  category: "bot",
  about: "Gathers resources based on supplied list",
  author: "CoherentNonsense"
});

let gatherAll = false;

let direction = "n";
let currentPath = null;
let targetStructure = null;
const lootedStructures = {};

extension.onUpdate((client) => {
  // Go through structure
  if (currentPath)
  {
    if (!currentPath.next())
    {
      return;
    }

    currentPath = null;
    targetStructure = null;
  }
  
  // Move to structure
  if (!targetStructure)
  {
    findStructure();
    client.traveler.moveTo(targetStructure);
    return;
  }

  // Arrive at structure
  if (targetStructure.x === YOU.x && targetStructure.y === YOU.y)
  {
    // Add to list so we don't loot this again
    lootedStructures[targetStructure.x + "," + targetStructure.y] = true;
    
    // The second word in structure titles are descriptive enough
    const name = POPUP.evTitle.innerHTML.split(" ")[1];
    currentPath = new Path(name, resources);
  }
});

extension.onStop((client) => {
  currentPath = null;
  targetStructure = null;
  client.traveler.stop();
});

extension.onSettings((client) => {
  client.popup.build("Resource Gatherer", (body) => {
    body.addDropdown("Move Towards",
      ["n", "e", "s", "w"],
      (result) => { direction = result },
      direction
    );

    body.break();

    body.addTitle("Resources");

    // Select All
    body.addCheckbox("All", (state) => {
      gatherAll = state;
      resources.forEach((resource) => {
        resource.active = state;
        extension._settings(client);
      });
    }, gatherAll);

    resources.forEach((resource) => {
      body.addCheckbox(resource.id, (state) => {
        resource.active = state;

        // Update All Button
        if (!state && gatherAll)
        {
          gatherAll = false;
        }

        extension._settings(client)
      }, resource.active);
    });
  });
});


// Searches towards a cardinal direction like a sonar
function findStructure()
{
  let width = 1;

  while (!targetStructure)
  {
    for (let i = -width; i < width + 1; ++i)
    {
      let searchX, searchY;
      switch (direction)
      {
        case "n": searchX = YOU.x + i; searchY = YOU.y + width; break;
        case "e": searchX = YOU.x + width; searchY = YOU.y + i; break;
        case "s": searchX = YOU.x + i; searchY = YOU.y - width; break;
        case "w": searchX = YOU.x - width; searchY = YOU.y + i; break;
      }

      const tile = WORLD.deriveTile(searchX, searchY);

      if (
        (tile === WORLD.TILES.city || tile === WORLD.TILES.house) &&
        !lootedStructures[searchX + "," + searchY]
      )
      {
        targetStructure = { x: searchX, y: searchY };
        break;
      }
    }

    width += 1;
  }
}

export default extension;