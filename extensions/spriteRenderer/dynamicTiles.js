/**
 * These functions check a tile's neighbors and renders the correct sprite
 * 
 * renderMountain: Renders mountains and adds some fake height based on the perlin noise
 */


// Neighbors for bitwise operations
const TILE_ENUM = {
  n: 1,
  e: 2,
  s: 4,
  w: 8,
};

export function renderMountain(renderer, x, y)
{
  let neighbors = 0;
  const height = normalizedPerlin(x, y);
  neighbors |= (WORLD.deriveTile(x  , y+1) == WORLD.TILES.mountain && normalizedPerlin(x, y+1) < height + 1) ? TILE_ENUM.n : 0;
  neighbors |= (WORLD.deriveTile(x+1, y  ) == WORLD.TILES.mountain && normalizedPerlin(x+1, y) < height + 1) ? TILE_ENUM.e : 0;
  neighbors |= (WORLD.deriveTile(x  , y-1) == WORLD.TILES.mountain && normalizedPerlin(x, y-1) < height + 1) ? TILE_ENUM.s : 0;
  neighbors |= (WORLD.deriveTile(x-1, y  ) == WORLD.TILES.mountain && normalizedPerlin(x-1, y) < height + 1) ? TILE_ENUM.w : 0;

  renderFromNeighbors(renderer, neighbors, 0, 3, x, y);
}


export function renderDynamicTile(renderer, char, u, v, x, y)
{
  let neighbors = 0;
  neighbors |= WORLD.deriveTile(x  , y+1) == char ? TILE_ENUM.n : 0;
  neighbors |= WORLD.deriveTile(x+1, y  ) == char ? TILE_ENUM.e : 0;
  neighbors |= WORLD.deriveTile(x  , y-1) == char ? TILE_ENUM.s : 0;
  neighbors |= WORLD.deriveTile(x-1, y  ) == char ? TILE_ENUM.w : 0;

  renderFromNeighbors(renderer, neighbors, u, v, x, y);
}

export function renderDynamicObject(renderer, object, u, v)
{
  let neighbors = 0;
  WORLD.otherObjs.forEach((neighbor) => {
    if (neighbor.char != object.char) return;

    neighbors |= (object.x == neighbor.x && object.y + 1 == neighbor.y) ? TILE_ENUM.n : 0;
    neighbors |= (object.x + 1 == neighbor.x && object.y == neighbor.y) ? TILE_ENUM.e : 0;
    neighbors |= (object.x == neighbor.x && object.y - 1 == neighbor.y) ? TILE_ENUM.s : 0;
    neighbors |= (object.x - 1 == neighbor.x && object.y == neighbor.y) ? TILE_ENUM.w : 0;
  });

  renderFromNeighbors(renderer, neighbors, u, v, object.x, object.y);
}


// turns a -1 to 1 float to a -10 to 10 int
function normalizedPerlin(x, y)
{
    let value = WORLD.getPerlin(x, y);
    let smooth = WORLD.getPerlin(x, y+5500, 10000) - WORLD.getPerlin(x, y, 25);

    value =  Math.floor((value) * 30);
    if (smooth < 0.1)
    {
        value++;
    }

    return value;
}


/**
 * Renders a tile based on it's neighbors
 */
function renderFromNeighbors(renderer, neighbors, u, v, x, y)
{
  switch (neighbors)
    {
        case               TILE_ENUM.e | TILE_ENUM.s               : renderer.drawSprite(u  , v  , x, y); break;
        case               TILE_ENUM.e | TILE_ENUM.s | TILE_ENUM.w : renderer.drawSprite(u+1, v  , x, y); break;
        case                             TILE_ENUM.s | TILE_ENUM.w : renderer.drawSprite(u+2, v  , x, y); break;
        case                             TILE_ENUM.s               : renderer.drawSprite(u+3, v  , x, y); break;
        case TILE_ENUM.n | TILE_ENUM.e | TILE_ENUM.s               : renderer.drawSprite(u  , v+1, x, y); break;
        case TILE_ENUM.n | TILE_ENUM.e | TILE_ENUM.s | TILE_ENUM.w : renderer.drawSprite(u+1, v+1, x, y); break;
        case TILE_ENUM.n |               TILE_ENUM.s | TILE_ENUM.w : renderer.drawSprite(u+2, v+1, x, y); break;
        case TILE_ENUM.n |               TILE_ENUM.s               : renderer.drawSprite(u+3, v+1, x, y); break;
        case TILE_ENUM.n | TILE_ENUM.e                             : renderer.drawSprite(u  , v+2, x, y); break;
        case TILE_ENUM.n | TILE_ENUM.e |               TILE_ENUM.w : renderer.drawSprite(u+1, v+2, x, y); break;
        case TILE_ENUM.n |                             TILE_ENUM.w : renderer.drawSprite(u+2, v+2, x, y); break;
        case TILE_ENUM.n                                           : renderer.drawSprite(u+3, v+2, x, y); break;
        case               TILE_ENUM.e                             : renderer.drawSprite(u  , v+3, x, y); break;
        case               TILE_ENUM.e |               TILE_ENUM.w : renderer.drawSprite(u+1, v+3, x, y); break;
        case                                           TILE_ENUM.w : renderer.drawSprite(u+2, v+3, x, y); break;
        default                                                    : renderer.drawSprite(u+3, v+3, x, y); break;
    }
}