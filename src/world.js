const World = function(client) {

  const _client = client;

  class Tile
  {
    constructor(char, position)
    {
      this.char = char;
      this.position = position;
    }

    isSprintableTerrain()
    {
      if (this.char === WORLD.TILES.mountain || this.char === WORLD.TILES.water)
      {
        // Check for ocean tiles
        for (let i = 0; i < WORLD.otherObjs.length; i++)
        {
          if (WORLD.otherObjs[i].char == "Θ" && WORLD.otherObjs[i].x == YOU.x && WORLD.otherObjs[i].y == YOU.y)
          {
            return true;
          }
        }

        return false;
      }

      return true;
    }
  }

  function addObject(object)
  {
    WORLD.otherObjs.push(object);
    _client.data.objects.push(object);
  }

  function removeObject(object)
  {
    const objectIndex = WORLD.otherObjs.findIndex((tile) => (
      tile.char === object.char &&
      tile.x === object.x &&
      tile.y === object.y
    ));

    if (objectIndex < 0) return;

    const dataIndex = _client.data.objects.findIndex((tile) => (
      tile.char === object.char &&
      tile.x === object.x &&
      tile.y === object.y
    ));

    WORLD.otherObjs.splice(objectIndex, 1);
    _client.data.objects.splice(dataIndex, 1);
  }

  function currentTile()
  {
    return getTile({ x: YOU.x, y: YOU.y });
  }


  function getTile(position)
  {
    return new Tile(WORLD.deriveTile(position.x, position.y), position);
  }

  return {
    currentTile,
    getTile,
    addObject,
    removeObject
  };

};

export default World;