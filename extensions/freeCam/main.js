
const extension = new Extension({
  id: "freeCam",
  name: "Free Cam",
  icon: "📷",
  category: "graphics",
  about: "Draws the game with a spritesheet",
  author: "CoherentNonsense"
});

let eventID = null;

extension.onStart((client) => {
  eventID = (e) => {
    switch(e.key)
    {
      case "ArrowUp": client.camera.move(0, 1); break;
      case "ArrowRight": client.camera.move(1, 0); break;
      case "ArrowDown": client.camera.move(0, -1); break;
      case "ArrowLeft": client.camera.move(-1, 0); break;
    }
  };
  
  addEventListener("keydown", eventID);
});

extension.onStop((client) => {
  removeEventListener("keydown", eventID);
  eventID = null;
  client.camera.set(0, 0);
});

export default extension;