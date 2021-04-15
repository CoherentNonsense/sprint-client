class Extension
{
  constructor(name)
  {
    this.name = name;
    this.category = "";
    this.active = false;

    // Callbacks
    this._start;
    this._stop;
    this._update;
  }

  toggle(value)
  {
    if (this.active || value)
    {
      this.stop();
    }
    else
    {
      this.start();
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

  on_update(callback)
  {
    this._update = callback;
  }
}

export default Extension;