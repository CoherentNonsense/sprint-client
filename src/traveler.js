const Traveler = function(client) {

  const _client = client;

  const position = { x: 0, y: 0 }

  function canSprint()
  {
    return XP.sp > 9;
  }

  function sprint()
  {
    if (_client.traveler.canSprint() && !DSTEP.btnIsActive() && _client.world.currentTile().isSprintableTerrain())
    {
      DSTEP.click();
    }
  }

  return {
    position,
    canSprint,
    sprint
  };

};

export default Traveler;