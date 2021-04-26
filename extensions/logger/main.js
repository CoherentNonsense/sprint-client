const extension = new Extension({
  id: "logger",
  name: "Location Logger",
  icon: "᭡",
  category: "info",
  about: "Logs special locations",
  author: "Coherent Nonsense",
  settings: "Show Logs"
});

let logs = new Map();

extension.onStart(() => {
  const oldLogs = getLogs();

  if (oldLogs)
  {
    logs = new Map(oldLogs);
  }
  else
  {
    saveLogs();
  }
});


extension.onUpdate((_, data) => {

  // Log objects
  data.objects.forEach((object) => {

    // Don't log cities and houses
    if (object.char === "C" || object.char === "H") return;

    const objectId = `${object.x}${object.y}${object.char}`;
    if (!logs.has(objectId))
    {
      logs.set(objectId, {
        x: object.x,
        y: object.y,
        char: object.char
      });
    }

  });

  // Log players
  data.players.forEach((player) => {

    const playerId = `${player.x}${player.y}&`;
    if (!logs.has(playerId))
    {
      logs.set(playerId, {
        x: player.x,
        y: player.y,
        char: "&"
      });
    }

  });

  // Log stumps
  data.stumps.forEach((stump) => {

    const stumpId = `${stump.x}${stump.y}stump`;
    if (!logs.has(stumpId))
    {
      logs.set(stumpId, {
        x: stump.x,
        y: stump.y,
        char: "stump"
      });
    }

  });

  saveLogs()
});


extension.onSettings((client) => {
  buildSettings(client.popup);
});

function buildSettings(popup)
{
  popup.build("Location Logger", (body) => {
    body.addButton("Clear Logs", "Clear", () => {
      logs.clear();
      saveLogs();
      buildSettings(popup);
    });

    const objects = [];
    const stumps = [];
    const players = [];

    logs.forEach((log) => {
      if (log.char === "stump")
      {
        stumps.push(log);
        return;
      }

      if (log.char === "&")
      {
        players.push(log);
        return;
      }

      objects.push(log);
    });

    body.break();

    body.buildExpandable("Objects (click to expand)", (body) => {
      if (objects.length === 0)
      {
        body.addParagraph("Empty");
      }

      objects.forEach((object) => {
        body.addParagraph(`${object.char} (${object.x}, ${object.y})`);
      });
    });

    body.break();

    body.buildExpandable("Stumps (click to expand)", (body) => {
      if (stumps.length === 0)
      {
        body.addParagraph("Empty");
      }

      stumps.forEach((stump) => {
        body.addParagraph(`(${stump.x}, ${stump.y})`);
      });
    });

    body.break();

    body.buildExpandable("Players (click to expand)", (body) => {
      
      if (players.length === 0)
      {
        body.addParagraph("Empty");
      }
      
      players.forEach((player) => {
        body.addParagraph(`(${player.x}, ${player.y})`);
      });
    });

  });
}

function saveLogs()
{
  localStorage.setItem("sprint-logger-data", JSON.stringify(Array.from(logs.entries())));
}

function getLogs()
{
  let data;
  try
  {
    data = JSON.parse(localStorage.getItem("sprint-logger-data"));
  }
  catch (e)
  {
    return null;
  }

  if (!!data && !!data.length)
  {
    return data;
  }

  return null;
}

export default extension;