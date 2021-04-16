class Extension
{
  constructor(fields)
  {

    // Extension data
    this.id = fields.id || ".";
    this.name = fields.name || "?";
    this.category = fields.category || "extension";
    this.active = false;
    this.icon = fields.icon || "?";
    this.about = fields.about || "";
    this.inProduction = false;
    this.settings = document.createElement("div");
    this.settings.innerHTML = "Test";

    // Callbacks
    this._start = () => {};
    this._stop = () => {};
    this._update = () => {};
    this._settings = null;

    // Data
    this.data = {};
  }

  toggle(value)
  {
    if (typeof value === "boolean")
    {
      value ? this._start() : this._stop();
    }
    else
    {
      this.active ? this._stop() : this._start();
    }

    this.active = !this.active;
  }

  onStart(callback)
  {
    this._start = callback;
  }

  onStop(callback)
  {
    this._stop = callback;
  }

  onUpdate(callback)
  {
    this._update = callback;
  }

  onSettings(callback)
  {
    this._settings = callback;
  }
}

export default Extension;