import Extension from "./extension.js";

class Module extends Extension
{
  constructor(name)
  {
    super(name, "mod");
  }

  on_update(callback)
  {
    this._update = callback;
  }
}

export default Module;