/**
 * @file extension.js
 * @author CoherentNonsense
 * The main class to hold all extension data
 * 
 * This is the only global object to allow other extensions to use it
 */
// eslint-disable-next-line no-unused-vars
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
    this.settings = fields.settings;
    this.updateOnRender = fields.updateOnRender || false;

    // Callbacks
    this._start = () => {};
    this._stop = () => {};
    this._update = () => {};
    this._settings = null;

    // Data
    this.data = {};
  }

  toggle(client, value)
  {
    try
    {
      if (typeof value === "boolean" && value != this.active)
      {
        this.active = !this.active;
        this.active ? this._start(client) : this._stop(client);
      }
      else
      {
        this.active = !this.active;
        this.active ? this._start(client) : this._stop(client);
      }
    }
    catch (e)
    {
      client.log(`${this.name} has an error in its start or stop method: ${e}`);
    }

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