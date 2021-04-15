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
    ExtensionManager.loadFile(`${extension_filepath}/main.js`);
  },


  /**
   * Loads and runs a file.
   * @param {string} extension_filepath A file to run
   */
  loadFile: async (extension_filepath) => {
    // Parse extension file path
    const extension_parts = extension_filepath.split(".");

    let extension_name = extension_parts[0];
    let extension_filetype;

    // If the extension file path does not have an extension, default as js
    if (extension_parts.length == 1)
    {
      extension_filetype = "js";
    }
    else
    {
      extension_filetype = extension_filetype[1];
    }

    // Prevent duplicate downloads
    if (ExtensionManager._extensions.has(extension_name)) return;

    // Download
    const module_object = await import(`${extension_filepath}.${extension_filetype}`);

    ExtensionManager.add(module_object.default);
  },


  /**
   * Adds an extension to the current downloads
   * @param {Extension} extension The extension to be added
   */
  add: (extension) => {
    if (ExtensionManager.get(extension.name) != null) return

    ExtensionManager._extensions.set(extension.name, extension);

    ExtensionManager._client.ui.updateExtensions(ExtensionManager._extensions);
  },


  /**
   * Gets an extension by it's name
   * @param {string} extension_name The extension to retrieve
   * @returns {Extension} The extension with the corresponding name or null if not found
   */
  get: (extension_name) => {
    return ExtensionManager._extensions.get(extension_name);
  },


  /**
   * Removes an extension by it's name
   * @param {string} extension_name The extension to remove
   */
  remove: (extension_name) => {
    const extension = ExtensionManager.get(extension_name);
    if (extension == null) return;

    if (extension.active)
    {
      extension.stop();
    }

    ExtensionManager._extensions.delete(extension_name);
  },


  /**
   * Toggles an extension's state to either on or off
   * @param {string} extension_name The extension to toggle
   * @param {bool} [value] An optional value to choose a state
   */
  toggle: (extension_name, value) => {
    const extension = ExtensionManager._extensions.get(extension_name);

    if (!extension_name) return;

    extension.toggle(value);
  },


  update: (client, data) => {
    ExtensionManager._extensions.forEach((extension) => {
      extension.update(client, data);
    });
  },

  saveLocal: () => {
    const extension_names = [];
    ExtensionManager._extensions.forEach((_, extension_name) => {
      extension_names.push(extension_name);
    });

    localStorage.setItem("scextensions_extensions", JSON.stringify(extension_names));
  },

  restoreLocal: () => {
    ExtensionManager._extensions.clear();

    const extension_names = JSON.parse(localStorage.getItem("scextensions_extensions"));

    extension_names.forEach(async (extension_name) => {
      await ExtensionManager.load(extension_name);
    });
  }

}

export default ExtensionManager;