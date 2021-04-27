const extension = new Extension({
  id: "logger",
  name: "Location Logger",
  icon: "᭡",
  category: "logging",
  about: "Logs special locations",
  author: "Coherent Nonsense",
  settings: "Show Logs"
});

let logs = new Map();
let eventLogs = [];

let engineLog = null;

extension.onStart((client) => {
  // Get logs from storage
  logs = getLogs();
  eventLogs = getEventLogs();

  // Get engine logs
  const position = client.traveler.getPosition();
  engineLog = ENGINE.log;
  ENGINE.log = (text, replaceOldSame) => {
    engineLog(text, replaceOldSame);
    console.log(text);

    // Some logs that aren't useful
    if (
      !text ||
      text.contains("you earned") ||
      text.contains("the hot air rests") ||
      text.contains("maybe there's some") ||
      text.contains("need 10")
    ) return

    eventLogs.push(`(${position.x}, ${position.y}) ${text}`);
    saveEventLogs();
  };
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


extension.onStop(() => {
  ENGINE.log = engineLog;
});


extension.onSettings((client) => {
  buildLogs(client.popup);
});

function buildLogs(popup)
{
  popup.build("Location Logger", (body) => {
    body.addButton("Clear Logs", "Clear", () => {
      logs.clear();
      saveLogs();
      buildLogs(popup);
    });

    body.addButton("Event Logs", "Show", () => {
      buildEventLogs(popup);
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

function buildEventLogs(popup)
{
  popup.build("Event Logs", (body) => {
    body.addButton("Clear Event Logs", "Clear", () => {
      eventLogs = [];
      saveEventLogs();
      buildEventLogs(popup);
    });

    body.addButton("Logs", "Show", () => {
      buildLogs(popup);
    });

    eventLogs.forEach((log) => {
      body.addParagraph(log);
    });
  });
}


  /////////////////
 // Object Logs //
/////////////////
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
    // Nothing
  }

  if (!!data && !!data.length)
  {
    return new Map(data);
  }

  return new Map();
}


  ////////////////
 // Event Logs //
////////////////
function saveEventLogs()
{
  localStorage.setItem("sprint-logger-event", JSON.stringify(eventLogs));
}

function getEventLogs()
{
  let data;
  try
  {
    data = JSON.parse(localStorage.getItem("sprint-logger-event"));
  }
  catch (e)
  {
    // Nothing
  }

  if (!!data && !!data.length)
  {
    return data;
  }

  return [];
}


export default extension;