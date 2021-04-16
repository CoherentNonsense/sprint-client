class Extension
{
  constructor(fields)
  {
    this.name = fields.name || "?";
    this.category = fields.category || "extension";
    this.active = false;
    this.icon = fields.icon || "?";
    this.about = fields.about || "";

    // Callbacks
    this._start;
    this._stop;
    this._update;
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

  on_start(callback)
  {
    this._start = callback;
  }

  on_stop(callback)
  {
    this._stop = callback;
  }
}

export default Extension;