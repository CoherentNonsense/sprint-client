export default (function(client) {
  
  const offset = { x: 0, y: 0 };

  function move(x, y)
  {
    offset.x += x;
    offset.y += y;
    client.render();
  }

  function set(x, y)
  {
    offset.x = x;
    offset.y = y;
    client.render();
  }

  return {
    offset,
    move,
    set
  };

});