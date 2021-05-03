const extension = new Extension({
  id: "streamerMode",
  name: "Streamer Mode",
  icon: "👁",
  description: "Hides your coordinates.",
  category: "logging"
});

extension.onStart(() => {
  document.querySelector("#world-coords").style.opacity = '0';
});

extension.onStop(() => {
  document.querySelector("#world-coords").style.opacity = '';
});

export default extension;