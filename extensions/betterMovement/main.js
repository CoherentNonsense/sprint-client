const extension = new Extension({
  id: "betterMovement",
  name: "Better Movement",
  icon: "⇅",
  category: "tools",
  about: "Improves movement using the arrow keys",
  author: "Coherent Nonsense"
});

const keys = {up: false, right: false, down: false, left: false};
let eventID;

function onKeyDown(client, e)
{
  e.preventDefault();
  if (e.repeat) return;

  let changed = true;
  const pressed = e.type === "keydown";

  switch (e.key)
  {
    case "ArrowUp": keys.up = pressed; break;
    case "ArrowDown": keys.down = pressed; break;
    case "ArrowLeft": keys.left = pressed; break;
    case "ArrowRight": keys.right = pressed; break;
    default: changed = false;
  }

  
  if (changed)
  {
    const direction = { x: 0, y: 0 };
    if (keys.up) direction.y++;
    if (keys.down) direction.y--;
    if (keys.left) direction.x--;
    if (keys.right) direction.x++;
    client.traveler.move(direction.x, direction.y);

    // Default behaviour is to move so the line above actually cancels it
    // Move once more
    // Kind of a hack ):
    if (pressed) client.traveler.move(direction.x, direction.y);
  }

}

extension.onStart((client) => {
  eventID = (e) => onKeyDown(client, e);
  addEventListener("keydown", eventID);
  addEventListener("keyup", eventID);
});


extension.onStop(() => {
  removeEventListener("keydown", eventID);
  removeEventListener("keyup", eventID);
});

export default extension;