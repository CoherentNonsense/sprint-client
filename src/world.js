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
        return false;
      }

      return true;
    }
  }


  function currentTile()
  {
    return getTile(_client.traveler);
  }


  function getTile(position)
  {
    return new Tile(WORLD.deriveTile(position.x, position.y), position);
  }

  return {
    currentTile,
    getTile
  };

};

export default World;