export default (function() {
  
  const offset = { x: 0, y: 0 };

  function move(x, y)
  {
    offset.x += x;
    offset.y += y;
    WORLD.build();
  }

  function set(x, y)
  {
    offset.x = x;
    offset.y = y;
    WORLD.build();
  }

  return {
    offset,
    move,
    set
  };

});