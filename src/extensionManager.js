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
   * When safe mode is turned on, only extensions from the official repo can be installed
   */
  let _safe_mode;

  

  /**
   * Loads and runs the main.js file in an extension directory 
   * @param {string} extension_filepath A directory holding an extension
   */
  async function load(extension_filepath, toggle = false)
  {
    if (!extension_filepath || typeof extension_filepath != "string") return;

    return loadFile(`${extension_filepath}/main.js`, toggle);
  }


  /**
   * Loads and runs a file.
   * @param {string} extension_filepath A file to run
   */
  async function loadFile(extension_filepath, toggle = false)
  {
    // Only load main.js files
    if (!extension_filepath.endsWith("/main.js")) return;


    const filepath_parts = extension_filepath.split("/");
    filepath_parts.pop(); // Remove main.js
    let extension_id = filepath_parts.pop(); // Get the extension id


    // Prevent duplicate downloads
    if (_extensions.has(extension_id)) return;
    

    // External extensions
    // A URL is larger than the 2 part relative path
    if (filepath_parts.length > 0)
    {
      // Ignore if safe mode is on
      if (!extension_filepath.startsWith("https://") || _safe_mode) return;

      // Download
      try
      {
        const external_module_object = await import(extension_filepath);
        external_module_object.default.url = extension_filepath;

        add(external_module_object.default, toggle);
      }
      catch(e)
      {
        alert("Invalid URL");
      }

      return;
    }


    // Download
    try
    {
      const module_object = await import(`../extensions/${extension_id}/main.js`);
      module_object.default.url = extension_id;
      add(module_object.default, toggle);
    }
    // eslint-disable-next-line no-empty
    catch(e){} // Maybe some user feedback when official extensions fail but that shouldn't happen
  }


  /**
   * Adds an extension to the current downloads
   * @param {Extension} extension The extension to be added
   */
  function add(extension, tog = false)
  {
    if (!extension || get(extension.id) != null) return
    
    _extensions.set(extension.id, extension);
    
    if (tog)
    {
      toggle(extension.id);
      return;
    }

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
    
    toggle(extension_id, false);
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
    saveLocal();
  }

  function update(client, data)
  {
    _extensions.forEach((extension) => {
      if (extension.active)
      {
        try
        {
          extension._update(client, data);
        }
        catch (e)
        {
          _client.log(`${extension.name} has an error in its update loop: ${e}`);
        }
      }
    });
  }

  function render(client, data)
  {
    _extensions.forEach((extension) => {
      if (extension.active && extension.updateOnRender)
      {
        try{
          extension._update(client, data);
        }
        catch (e)
        {
          _client.log(`${extension.name} has an error in its update loop while rendering: ${e}`);
        }
      }
    });
  }

  function isSafeMode()
  {
    return _safe_mode;
  }

  function toggleSafeMode()
  {
    _safe_mode = !_safe_mode;

    saveLocal();
  }

  function saveLocal()
  {
    const extension_urls = [];
    _extensions.forEach((extension) => {
      extension_urls.push((extension.active ? "-active-" : "") + extension.url);
    });

    localStorage.setItem("sprint-extensions", JSON.stringify(extension_urls));

    localStorage.setItem("sprint-safe-mode", JSON.stringify(_safe_mode));
  }

  function restoreLocal()
  {
    _extensions.clear();

    let extension_urls = JSON.parse(localStorage.getItem("sprint-extensions"));
    let safe_mode = JSON.parse(localStorage.getItem("sprint-safe-mode"));

    if (!extension_urls)
    {
      extension_urls = [];
    }

    if (typeof safe_mode !== "boolean")
    {
      safe_mode = true;
    }

    _safe_mode = safe_mode;


    extension_urls.forEach(async (extension_url) => {
      const activeExtension = extension_url.startsWith("-active-");

      if (activeExtension)
      {
        extension_url = extension_url.substring(8);
      }

      await load(extension_url, activeExtension);
    });

    _client.ui.updateExtensions(_extensions);
  }

  async function renderStore()
  {
    const availableExtensionsModule = await import("../availableExtensions.js");
    const availableExtensions = availableExtensionsModule.default;

    _client.popup.build("Extension List", (build) => {
      // Show external extensions if safe mode is turned off
      if (!_safe_mode)
      {
        build.addTitle("Download External Extensions");
        build.addParagraph("(Only download extensions you can trust)");
        build.addButton("External Extension", "URL", () => { load(prompt("Enter the URL to the extension")) })
        build.break();
      }


      // Show official extensions
      build.addTitle("Download Extensions");
      let newExtensionCount = 0;

      availableExtensions.forEach((category) => {
        const noninstalledExtensions = category.extensions.filter((extensionId) => !_extensions.has(extensionId));

        if (noninstalledExtensions.length === 0)
        {
          return;
        }

        build.addParagraph(category.name);
  
        noninstalledExtensions.forEach((extensionId) => {
          ++newExtensionCount;
          build.addButton(extensionId, "Add", async () => { await load(extensionId); renderStore(); });
        });

        build.break();
  
      });

      if (newExtensionCount == 0)
      {
        build.addParagraph("All Extensions Downloaded");
      }

    });
  }


  return {
    load,
    add,
    remove,
    get,
    toggle,
    toggleSafeMode,
    isSafeMode,
    update,
    render,
    saveLocal,
    restoreLocal,
    renderStore
  }
}

export default ExtensionManager;