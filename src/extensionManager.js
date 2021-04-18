import availableExtensions from "../availableExtensions.js";

/**
 * @file moduleManager.js
 * @description Manages the storage, loading, and uploading of modules
 */
const ExtensionManager = function(client) {

  const _client = client;

  /**
   * The extension files currently downloaded
   */
  const _extensions = new Map();


  /**
   * Loads and runs the main.js file in an extension directory 
   * @param {string} extension_filepath A directory holding an extension
   */
  async function load(extension_filepath)
  {
    return loadFile(`${extension_filepath}/main.js`);
  }


  /**
   * Loads and runs a file.
   * @param {string} extension_filepath A file to run
   */
  async function loadFile(extension_filepath)
  {
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
    if (_extensions.has(extension_id)) return;

    // Download
    const module_object = await import(`../extensions/${extension_id}.${extension_filetype}`);

    add(module_object.default);
  }


  /**
   * Adds an extension to the current downloads
   * @param {Extension} extension The extension to be added
   */
  function add(extension)
  {
    if (!extension || get(extension.id) != null) return
    
    _extensions.set(extension.id, extension);
    saveLocal();
    _client.ui.updateExtensions(_extensions);
  }

  /**
   * Gets an extension by it's name
   * @param {string} extension_id The extension to retrieve
   * @returns {Extension} The extension with the corresponding name or null if not found
   */
  function get(extension_id)
  {
    return _extensions.get(extension_id);
  }


  /**
   * Removes an extension by it's name
   * @param {string} extension_id The extension to remove
   */
  function remove(extension_id)
  {
    const extension = get(extension_id);
    if (extension == null) return;
    
    if (extension.active)
    {
      extension._stop();
    }
    
    _extensions.delete(extension_id);
    saveLocal();
    _client.ui.updateExtensions(_extensions);
  }


  /**
   * Toggles an extension's state to either on or off
   * @param {string} extension_id The extension to toggle
   * @param {bool} [value] An optional value to choose a state
   */
  function toggle(extension_id, value)
  {
    const extension = _extensions.get(extension_id);

    if (!extension) return;

    extension.toggle(_client, value);
    _client.ui.updateExtensions(_extensions);
  }

  function update(client, data)
  {
    _extensions.forEach((extension) => {
      if (extension.active)
      {
        extension._update(client, data);
      }
    });
  }

  function saveLocal()
  {
    const extension_ids = [];
    _extensions.forEach((_, extension_id) => {
      extension_ids.push(extension_id);
    });

    localStorage.setItem("scextensions_extensions", JSON.stringify(extension_ids));
  }

  function restoreLocal()
  {
    _extensions.clear();

    let extension_ids = JSON.parse(localStorage.getItem("scextensions_extensions"));

    if (!extension_ids)
    {
      extension_ids = [];
    }
    
    extension_ids.forEach(async (extension_id) => {
      await load(extension_id);
    });
  }

  function renderStore()
  {
    _client.popup.build("Extension List", (build) => {
      const noninstalledExtensions = availableExtensions.filter((extensionId) => !_extensions.has(extensionId));

      if (noninstalledExtensions.length === 0)
      {
        build.addParagraph("All extensions have been installed.");
        return;
      }

      noninstalledExtensions.forEach((extensionId) => {
        build.addButton(extensionId, "Add", async () => { await load(extensionId); renderStore(); });
      });
    });
  }

  return {
    load,
    loadFile,
    add,
    remove,
    get,
    toggle,
    update,
    saveLocal,
    restoreLocal,
    renderStore
  }
}

export default ExtensionManager;