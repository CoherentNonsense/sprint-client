
const extension = new Extension({
  id: "freeCam",
  name: "Free Cam",
  icon: "📷",
  category: "tools",
  about: "Draws the game with a spritesheet",
  author: "CoherentNonsense",
  settings: "help"
});

let eventID = null;

extension.onStart((client) => {
  eventID = (e) => {
    switch(e.key)
    {
      case "w": client.camera.move(0, 1); break;
      case "d": client.camera.move(1, 0); break;
      case "s": client.camera.move(0, -1); break;
      case "a": client.camera.move(-1, 0); break;
    }
  };
  
  addEventListener("keydown", eventID);
});

extension.onStop((client) => {
  removeEventListener("keydown", eventID);
  eventID = null;
  client.camera.set(0, 0);
});

extension.onSettings((client) => {
  client.popup.build("Free Cam", (body) => {
    body.addTitle("Controls");
    body.addParagraph("WASD: Move camera");
  });
});

export default extension;