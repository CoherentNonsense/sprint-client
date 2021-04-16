/**
 * @file moduleManager.js
 * @description Manages the storage, loading, and uploading of modules
 */
const ExtensionManager = {
  
  /**
   * The extension files currently downloaded
   */
  _extensions: new Map(),


  _client: null,


  init: (client) => {
    ExtensionManager._client = client;
  },


  /**
   * Loads and runs the main.js file in an extension directory 
   * @param {string} extension_filepath A directory holding an extension
   */
  load: async (extension_filepath) => {
    return ExtensionManager.loadFile(`${extension_filepath}/main.js`);
  },


  /**
   * Loads and runs a file.
   * @param {string} extension_filepath A file to run
   */
  loadFile: async (extension_filepath) => {
    // Parse extension file path
    const extension_parts = extension_filepath.split(".");

    let extension_id = extension_parts[0];
    let extension_filetype;

    // If the extension file path does not have an extension, default as js
    if (extension_parts.length == 1)
    {
      extension_filetype = "js";
    }
    else
    {
      extension_filetype = extension_parts[1];
    }

    // Prevent duplicate downloads
    if (ExtensionManager._extensions.has(extension_id)) return;

    // Download
    const module_object = await import(`../extensions/${extension_id}.${extension_filetype}`);

    ExtensionManager.add(module_object.default);
  },


  /**
   * Adds an extension to the current downloads
   * @param {Extension} extension The extension to be added
   */
  add: (extension) => {
    if (ExtensionManager.get(extension.id) != null) return
    
    ExtensionManager._extensions.set(extension.id, extension);

    ExtensionManager._client.ui.updateExtensions(ExtensionManager._extensions);
  },


  /**
   * Gets an extension by it's name
   * @param {string} extension_id The extension to retrieve
   * @returns {Extension} The extension with the corresponding name or null if not found
   */
  get: (extension_id) => {
    return ExtensionManager._extensions.get(extension_id);
  },


  /**
   * Removes an extension by it's name
   * @param {string} extension_id The extension to remove
   */
  remove: (extension_id) => {
    const extension = ExtensionManager.get(extension_id);
    if (extension == null) return;
    
    if (extension.active)
    {
      extension._stop();
    }
    
    ExtensionManager._extensions.delete(extension_id);
    ExtensionManager._client.ui.updateExtensions(ExtensionManager._extensions);
  },


  /**
   * Toggles an extension's state to either on or off
   * @param {string} extension_id The extension to toggle
   * @param {bool} [value] An optional value to choose a state
   */
  toggle: (extension_id, value) => {
    const extension = ExtensionManager._extensions.get(extension_id);

    if (!extension) return;

    extension.toggle(value);
    ExtensionManager._client.ui.updateExtensions(ExtensionManager._extensions);
  },


  update: (data) => {
    ExtensionManager._extensions.forEach((extension) => {
      if (extension.active)
      {
        extension._update(ExtensionManager._client, data);
      }
    });
  },

  saveLocal: () => {
    const extension_ids = [];
    ExtensionManager._extensions.forEach((_, extension_id) => {
      extension_ids.push(extension_id);
    });

    localStorage.setItem("scextensions_extensions", JSON.stringify(extension_ids));
  },

  restoreLocal: () => {
    ExtensionManager._extensions.clear();

    const extension_ids = JSON.parse(localStorage.getItem("scextensions_extensions"));

    extension_ids.forEach(async (extension_id) => {
      await ExtensionManager.load(extension_id);
    });
  }

}

export default ExtensionManager;