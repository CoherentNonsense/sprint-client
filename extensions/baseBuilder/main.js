import materials from "./materials.js";

const extension = new Extension({
  id: "baseBuilder",
  name: "Base Builder",
  icon: "⌂",
  category: "bot",
  about: "Create a base blueprint and automatically construct it.",
  author: "Coherent Nonsense"
});

let hotbarButtonId;
let blueprintMode = false;
let cursorIndex = 0
const offset = { x: 0, y: 0 };
const cursor = { char: materials[cursorIndex], x: 0, y: 0 };

let blueprint = [];

let eventId = null;

extension.onStart((client) => {
  hotbarButtonId = client.addHotbarButton("blueprint", () => {
    blueprintMode = !blueprintMode;
  }, true);

  eventId = (e) => {
    if (!blueprintMode) return;

    switch(e.key)
    {
      case "i": ++cursor.y; ++offset.y; break;
      case "l": ++cursor.x; ++offset.x; break;
      case "k": --cursor.y; --offset.y; break;
      case "j": --cursor.x; --offset.x; break;
      case "u": --cursorIndex; break;
      case "o": ++cursorIndex; break;
      case "c": blueprint = []; break;
      case " ":  e.preventDefault(); placeRemoveBlueprint(client); break;
    }
    if (cursorIndex === materials.length) cursorIndex = 0;
    if (cursorIndex === -1) cursorIndex = materials.length - 1;
    cursor.char = materials[cursorIndex];

    client.render();
  };

  cursor.x = YOU.x;
  cursor.y = YOU.y;

  addEventListener("keydown", eventId);
});

extension.onUpdate((client) => {
  if (!blueprintMode) return;

  // Move Cursor
  cursor.x = YOU.x + offset.x;
  cursor.y = YOU.y + offset.y;

  // Render blueprint
  blueprint.forEach((object) => {
    client.world.addObject(object);
  });

  // Add Cursor
  client.world.addObject(cursor);
});

extension.onStop((client) => {
  blueprintMode = false;
  cursor.charIndex = 0;
  offset.x = 0;
  offset.y = 0;
  client.removeHotbarButton(hotbarButtonId);
  addEventListener("keydown", eventId);
});

extension.onSettings((client) => {
  client.popup.build("Base Builder", (body) => {
    body.addTitle("Controls");
    body.addParagraph("Click the 'blueprint' button in your hotbar to toggle between blueprint mode.");
    body.addParagraph("When you are in blueprint mode, a cursor will appear.");
    body.addParagraph("IJKL - Move cursor");
    body.addParagraph("U and O - Switch current material.");
    body.addParagraph("Space - place or remove material.");
    body.break();
    body.addParagraph("NOTE: This extension is much more preformant if used with the sprite renderer.");
  });
});

function placeRemoveBlueprint(client)
{
  // Check if blueprint spot is full
  const blueprintIndex = blueprint.findIndex((tile) => (
    tile.x === cursor.x &&
    tile.y === cursor.y
  ));


  // If cursor is hovering over nothing place it
  if (blueprintIndex < 0)
  {
    blueprint.push({ ...cursor });
    client.world.addObject({ ...cursor });
  }
  else
  {
    // Remove it
    blueprint.splice(blueprintIndex, 1);
    client.world.removeObject(cursor);
  }

}

export default extension;