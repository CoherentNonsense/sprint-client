const extension = new Extension({
  id: "cleanEvents",
  name: "Clean Events",
  icon: "ev",
  description: "Removes terrain and event logs from the event log.",
  category: "tools"
});

let checkMoveLog = null;
let applyServerEvent = null;
let engineLog = null;

const removedPhrases = [
  "you earned", // XP
  "leveled up",
  "finally summer ends", // Seasons
  "the hot air rests",
  "the cool air rests still over",
  "the warm air rests",
  "winter passes",
  "another year has passed",
  "the air grows cooler",
  "the air becomes almost unbearably",
  "the warm air rests still over the",
  "maybe there's some", // Events
  "body overburdened"
]

extension.onStart(() => {
  // Remove move logs
  checkMoveLog = YOU.checkMoveLog;
  YOU.checkMoveLog = () => {};

  // Remove event logs
  applyServerEvent = EVENTS.applyServerEvent;
  EVENTS.applyServerEvent = eval("(" + applyServerEvent.toString().replace("ENGINE.log(desc);", "") + ")");

  // Don't print some server events
  engineLog = ENGINE.log;
  ENGINE.log = (text, replaceOldSame) => {
    
    // Dont log these
    let isRemoved = false;
    removedPhrases.forEach((phrase) => {
      if (text.contains(phrase)) isRemoved = true;
    });

    if (isRemoved) return;

    engineLog(text, replaceOldSame);
  };
});

extension.onStop(() => {
  // Restore move logs
  YOU.checkMoveLog = checkMoveLog;

  // Restore event logs
  EVENTS.applyServerEvent = applyServerEvent;
  ENGINE.log = engineLog;
});

export default extension;