const extension = new Extension({
  id: "cleanEvents",
  name: "Clean Events",
  icon: "ev",
  description: "Removes terrain and event logs from the event log.",
  category: "logging"
});

let checkMoveLog = null;
let applyServerEvent = null;

extension.onStart(() => {
  // Remove move logs
  checkMoveLog = YOU.checkMoveLog;
  YOU.checkMoveLog = () => {};

  // Remove event logs
  applyServerEvent = EVENTS.applyServerEvent;
  EVENTS.applyServerEvent = eval("(" + applyServerEvent.toString().replace("ENGINE.log(desc);", "") + ")");
});

extension.onStop(() => {
  // Restore move logs
  YOU.checkMoveLog = checkMoveLog;

  // Restore event logs
  EVENTS.applyServerEvent = applyServerEvent;
});