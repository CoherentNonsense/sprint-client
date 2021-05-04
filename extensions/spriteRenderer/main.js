import Renderer from "./renderer.js";
import { renderDynamicTile, renderMountain, renderDynamicObject } from "./dynamicTiles.js";


const extension = new Extension({
  id: "spriteRenderer",
  name: "Sprite Renderer",
  icon: "▦",
  category: "graphics",
  about: "Draws the game with a spritesheet",
  author: "CoherentNonsense",
  updateOnRender: true,
});


  ///////////////
 // VARIABLES //
///////////////

let canvas;
let renderer;

extension.onStart((client) => {
  client.options.defaultRender = false;

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
  renderer = new Renderer(canvas, client);
});

extension.onUpdate((client, data) => {
  renderer.startDraw();

  const { offset } = client.camera;

  // Draw Terrain
  for (let x = YOU.x + offset.x - 15; x < YOU.x + offset.x + 16; ++x)
  {
    for (let y = YOU.y + offset.y + 15; y > YOU.y + offset.y - 16; --y)
    {
      // Darken tiles out of sight
      const xVis = Math.abs(x - YOU.x) < 16 ? 1 : Math.max(15 / Math.abs(x - YOU.x), 0.75);
      const yVis = Math.abs(y - YOU.y) < 16 ? 1 : Math.max(15 / Math.abs(y - YOU.y), 0.75)
      renderer.brightness = Math.min(xVis, yVis);

      switch (WORLD.deriveTile(x, y))
      {
        case WORLD.TILES.sand:
          renderer.drawSprite(1, 0, x, y);
          break;
        case WORLD.TILES.grass:
          renderDynamicTile(renderer, WORLD.TILES.grass, 4, 3, x, y);
          break;
        case WORLD.TILES.tree:
          // Draw island tree or sand tree
          if (WORLD.getPerlin(x, y + 5500, 10000) > 0.57)
          {
              renderer.drawSprite(2, 1, x, y);
          }
          else
          {
              renderer.drawSprite(1, 1, x, y);
          }
          break;
        case WORLD.TILES.mountain:
          renderMountain(renderer, x, y);
          break;
        case WORLD.TILES.swamp:
          renderDynamicTile(renderer, WORLD.TILES.swamp, 12, 3, x, y);
          break;
        case WORLD.TILES.forest:
          renderDynamicTile(renderer, WORLD.TILES.forest, 8, 3, x, y);
          break;
        case WORLD.TILES.water:
          renderDynamicObject(renderer, WORLD.TILES.water, 16, 3, x, y);
          break;
        case WORLD.TILES.island:
          renderer.drawSprite(2, 0, x, y);
          break;
        case WORLD.TILES.worldedge:
          renderDynamicTile(renderer, WORLD.TILES.worldedge, 20, 3, x, y);
          break;
        case WORLD.TILES.house:
          renderer.drawSprite(3, 1, x, y);
          break;
        case WORLD.TILES.city:
          renderer.drawSprite(4, 1, x, y);
          break;
        case WORLD.TILES.startbox:
          renderer.drawSprite(5, 1, x, y);
          break;
        case WORLD.TILES.monument:
          renderer.drawSprite(0, 1, x, y)
          break;
        default:
          renderer.drawSprite(0, 0, x, y);
      }
    }
  }


  // Draw Objects
  data.objects.forEach((object) => {
    switch (object.char)
    {
      case WORLD.TILES.wood_block:
        renderDynamicObject(renderer, object, 0, 7);
        break;
      case WORLD.TILES.scrap_block:
        renderDynamicObject(renderer, object, 4, 7);
        break;
      case WORLD.TILES.steel_block:
        renderDynamicObject(renderer, object, 8, 7);
        break;
      case WORLD.TILES.anchor:
        renderer.drawSprite(7, 1, object.x, object.y);
        break;
      case WORLD.TILES.small_chest:
        renderer.drawSprite(8, 1, object.x, object.y);
        break;
      case WORLD.TILES.large_chest:
        renderer.drawSprite(9, 1, object.x, object.y);
        break;
      case WORLD.TILES.wood_door:
        renderer.drawSprite(0 + (object.opened ? 1 : 0), 11, object.x, object.y);
        break;
      case WORLD.TILES.scrap_door:
        renderer.drawSprite(4 + (object.opened ? 1 : 0), 11, object.x, object.y);
        break;
      case WORLD.TILES.steel_door:
        renderer.drawSprite(8 + (object.opened ? 1 : 0), 11, object.x, object.y);
        break;
      case WORLD.TILES.sign_block:
        renderer.drawSprite(10, 1, object.x, object.y);
        break;
      case WORLD.TILES.city:
        renderer.drawSprite(4, 1, object.x, object.y);
        break;
      case WORLD.TILES.house:
        renderer.drawSprite(3, 1, object.x, object.y);
        break;
      case '@':
        renderer.drawSprite(4, 2, object.x, object.y);
          break;
      default:
        renderer.drawSprite(0, 0, object.x, object.y);
    }
  });


  // Draw other playesr
  data.players.forEach((player) => {
    
  });


  // Draw Player
  renderer.drawSprite(0, 2, YOU.x, YOU.y);


  renderer.render();
});

extension.onStop((client) => {
  client.options.defaultRender = true;
  canvas.remove();
  renderer = null;
  WORLD.build();
});

export default extension;