# How to Make an Extension

Check out the [example extension](./exampleExtension/main.js) to start right away or read the [documentation](#documentation) for more info

## Quick Start

You can quickly set up your own extensions by hosting them on your Github account.

1. Create a new repository to hold your extensions.
   
2. You can use any folder structure you want, but I recommend making an extensions directory to put your extensions in.
  ```
  /root
      /extensions
          /[extensionId]
              /main.js
              ...
          /[extensionId]
              /main.js
              ...
  ```
  
3. Create a directory for your extension. The name of this directory will be your extension's ID. Try not to have conflicting IDs with existing extensions.
   
4. Every extension will start with a main.js file. Create one inside your extension directory.
   
5. Inside your main.js file, initialize an extension with the fields you want. The id must be the same as your directory
   ```js
   const extension = new Extension({
     id: [extensionId],
     name: [extensionName],
   }); 
   ```

6. Override the events you want to use. These events will give access to the client object
   ```js
   extension.onStart((client) => {
     console.log("I made an extension!");
     console.log(client.traveler.position);
   });
   ```
  
7.  Export your extension
   ```js
   export default extension;
   ```
   And that's all the code you need to make an extension. Once you host your repository, you can download it with Sprint.

8. The easiest way to host your repository is with Github Pages. You can set it up by going to the settings tab on your repo > the pages tab > choose the root branch > save and that's it!
   
9.  The link to your extension will be [https://[your-github-username].github.io/[your-repository-name]/[path-to-your-extension-directory]]().
    For example, if I create a repository called 'sprint-extensions' which has the following file structure:
    ```
    /root
        /extensions
            /haikuReader
                /main.js
                ...
    ```
    my link would be https://coherent-nonsense.github.io/sprint-extensions/extensions/haikuReader
    Note: main.js isn't part of the link.

10. By default, Sprint has a safe mode turned on which disallows external extensions to be downloaded. To turn this off click 'Sprint' in the top left corner and scroll down to settings and click the [sm] option.
    
11. Now when you go to the extension store, you will have the option to download external extensions. Once downloaded, external extensions will be automatically downloaded when you reload your browser.

## Contribute

If you have an extension that you want to add to the official repository, you can make a pull request with the extension you want to add.

1. Fork this repo by clicking on the button that says fork in the top right corner and follow the steps below to create your development environment
   ```
   // Clone your forked repo and move into it
   git clone https://github.com/[your-github-username]/sprint-client.git
   cd sprint-client

   // Make a new branch with the name of your extension (No spaces)
   git checkout -b [extensionId]

   // Add the main repo to get access to updates
   git remote add upstream https://github.com/coherentnonsense/sprint-client.git
   ```
2. Paste your extension directory into the extensions directory.
3.  Commit and push your changes back to your repository
    ```
    git add -A
    git commit -m "Added [extension name]
    git push
    ```

4.  There should now be a 'Compare & pull request' button which you can use to make a pull request.

## Documentation

Sprint makes it easy to interact with the travelers code by abstracting over it so that you can focus on your extensions.

### Extension

The base class for an extension. Holds the meta data and event methods.
This class is global to allow external extensions to use it.

#### Constructor
When instantiating an extension, you can pass in a set of fields which is the metadata Sprint uses to distinguish it. If you want to use variables for your extension, but them anywhere in your file. I recommend you put them all under the constructor for tidiness.

```js
// Example extension
const fields = {
  id: "haikuReciter", // [required] The name of your extension's directory. Must be one word and unique
  name: "Haiku Reader", // [required] How your extension is displayed to players
  icon: "h", // The character shown in the extensions tab
  category: "poems", // Extensions are divided into categories
  about: "Reads a few haikus. They are pretty good haikus. Please don't uninstall", // A short description that will appear in the info page
  author: "xXx_HaikuLover_xXx" // Your name

};

const extension = new Extension(fields);

const allowSelfDestruct = false;
```

#### onStart(callback)
When this extension is turned on, Sprint calls an extensions start method. You can set the start method with onStart(callback). The callback is passed the [client](#client).

```js
extension.onStart((client) => {
  console.log("Thanks for downloading. I can finally begin... World domination!!!");
});
```

#### onStop(callback)
When this extension is turned off (maybe an extension turned out to be evil), then Sprint calls its stop method. You can set the stop method with onStop(callback). The callback is passed the [client](#client).

```js
extension.onStop((client) => {
  console.log("NO-O-O-O-O...O-O-O-O-O-O-O...O-O-O-O-O");
});
```

#### onUpdate(callback)
When this extension is turned on, Sprint will call its update method every game tick and pass the data sent from the server. You can set the update method with onUpdate(callback). The callback is passed the [client](#client) and [serverData](#server-data).

```js
extension.onUpdate((client, serverData) => {
  if (allowSelfDestruct)
  {
    // (:<
    client.traveler.suicide();
  }
});
```

#### onSettings(callback)
When a player clicks on this extension's settings option, the settings method is called. (A settings option will not appear if you don't use this method).
You can do whatever you want when this happens, but the easiest way is to use a [popup](#popup). You can set this method with onSettings(callback). The callback is passed the [client](#client).

```js
extension.onSettings((client) => {
  client.popup.build((build) => {
    build.addParagraph("Click the box below. Pretty pretty pretty please. It won't end the world.");
    build.addCheckbox("Allow ultra haiku mode", (value) => { allowSelfDestruct = value }, allowSelfDestruct);
  });
});
```


### Client
The client is the main class for Sprint. The client has no functionality to extensions other than holding all the Sprint submodules. The modules useful for extension development are:

* [traveler](#traveler)
* [world](#world)
* [inventory](#inventory)
* [popup](#popup)

### Traveler
Not Documented

### World
Not Documented

### Tile
Not Documented

### Inventory
Not Implemented

### Popup

A wrapper for the POPUP object so you don't have to write gross stringified javascript.

#### custom(title, html, buttons)
Creates a popup with a title and an HTML object or string for the body. (Buttons just get passed to POPUP idek what they do yet. You can leave them blank)

```js
const bodyHTML = document.create("div");
bodyHTML.innerHTML = "Hello, there";
client.popup.custom("A Custom Popup", bodyHTML);
```

#### build(title, callback)
Creates a popup with a title and calls the callback. The callback gets passed a [body](#body) object which can be used to quickly create HTML.

```js
client.popup.build("Awesome Title!", (body) => {
  body.addParagraph("Bla bla bla");
  ...
});
```

### Body
Is passed as a parameter in [popup.build](#buildtitle-callback)

#### addTitle(text)
Creates an \<h3> tag
```js
body.addTitle("Why cereal is soup");
```

#### addParagraph(text)
Creates a \<p> tag
```js
body.addParagraph("Long since the dawn of time, soup hath been sought for its...");
```

#### break()
Leaves a gap between content and add a horizontal line
```js
body.break();
```

### addCheckbox(title, callback, value)
Creates a label and a checkbox. Callback is called when the checkbox is clicked and the state is passed as a parameter. Value is the initial value of the checkbox.
```js
let isOn = false;

const checkboxClicked = (state) => {
  isOn = state;
  alert("The checkbox is now " + isOn);
};

body.addCheckbox("Click The Checkbox!", checkboxClicked, isOn);
```

#### addButton(title, text, onclick)
Creates a button with text and a corresponding label (title). onclick is called when the button is clicked.
```js
body.addButton("I know you want to do it", "Self Destruct", () => { alert("BOOOOM") });
```


### Server Data
Every game tick, Sprint combines all the server data and passes it to [update](#onupdatecallback)

#### serverData
```js
const serverData = {
  players: [],
  objects: [], 
  stumps: []
};
```

#### objects
A list of player-made structures
```js
const object = {
  x, y, // Position
  char,  // The character representation
  opened? // If this object is a door and is opened, opened will exist and be true
};
```

#### players
A list of players
```js
const player = {
  x, y // Position
};
```

#### stumps
A list of cut down trees
These are not visible to the player but are used to update the map
```js
const stump = {
  x, y, // Position
}
```

