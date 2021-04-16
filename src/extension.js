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

    // Callbacks
    this._start = () => {};
    this._stop = () => {};
    this._update = () => {};

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
}

export default Extension;