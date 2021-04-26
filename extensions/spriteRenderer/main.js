import Renderer from "./renderer.js";

const extension = new Extension({
  id: "spriteRenderer",
  name: "Sprite Renderer",
  icon: "▦",
  category: "graphics",
  about: "Draws the game with a spritesheet",
  author: "CoherentNonsense"
});


  ///////////////
 // VARIABLES //
///////////////

let canvas;
let renderer;

extension.onStart((client) => {
  // Create canvas element
  // canvas = ui.createElement("canvas", "sprite-renderer-canvas");
  const worldBox = document.getElementById("world-box");
  canvas = document.createElement("canvas");
  canvas.style.position = "absolute";
  canvas.style.inset = 0;
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  worldBox.style.position = "relative";
  worldBox.appendChild(canvas);
  // ui.attachElementById("world-box", canvas);

  // Create renderer
  renderer = new Renderer(canvas);

});

extension.onUpdate((client) => {
  const position = client.traveler.getPosition();

  for (let x = position.x - 15; x < position.x + 16; ++x)
  {
    for (let y = position.y + 15; y > position.y - 16; --y)
    {
      switch (WORLD.deriveTile(x, y))
      {
        case WORLD.TILES.sand:
          renderer.drawSprite(1, 0, x - position.x, y - position.y);
          break;
        case WORLD.TILES.grass:
          renderer.drawSprite(4, 3, x - position.x, y - position.y);
          break;
        case WORLD.TILES.tree:
          // Draw island tree or sand tree
          if (WORLD.getPerlin(x, y + 5500, 10000) > 0.57)
          {
              renderer.drawSprite(2, 1, x - position.x, y - position.y);
          }
          else
          {
              renderer.drawSprite(1, 1, x - position.x, y - position.y);
          }
          break;
        case WORLD.TILES.mountain:
          renderer.drawSprite(0, 3, x - position.x, y - position.y);
          break;
        case WORLD.TILES.swamp:
          renderer.drawSprite(12, 3, x - position.x, y - position.y);
          break;
        case WORLD.TILES.forest:
          renderer.drawSprite(8, 3, x - position.x, y - position.y);
          break;
        case WORLD.TILES.water:
          renderer.drawSprite(16, 3, x - position.x, y - position.y);
          break;
        case WORLD.TILES.island:
          renderer.drawSprite(2, 0, x - position.x, y - position.y);
          break;
        case WORLD.TILES.worldedge:
          renderer.drawSprite(20, 3, x - position.x, y - position.y);
          break;
        case WORLD.TILES.house:
          renderer.drawSprite(3, 1, x - position.x, y - position.y);
          break;
        case WORLD.TILES.city:
          renderer.drawSprite(4, 1, x - position.x, y - position.y);
          break;
        case WORLD.TILES.startbox:
          renderer.drawSprite(5, 1, x - position.x, y - position.y);
          break;
        case WORLD.TILES.monument:
          renderer.drawSprite(0, 1, x - position.x, y - position.y)
          break;
        default:
          renderer.drawSprite(0, 0, x - position.x, y - position.y);
      }
    }
  }

  // Draw Player
  renderer.drawSprite(0, 2, 0, 0);


  renderer.render();
});

extension.onStop((client) => {
  canvas.remove();
  renderer = null;
});

export default extension;