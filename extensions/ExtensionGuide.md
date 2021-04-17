## How to Make an Extension

Check out the [example extension](./exampleExtension/main.js) to start right away or read the [documentation](#documentation) for more info

### Quickstart

These steps will guide you on making a copy of this repository by forking it, create an extension, and make a pull request to add your extension into Sprint

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
2. Make a new branch for your extension.
   ```
   git checkout -b [extensionId] 
   ```
3. Install dependencies (eslint for development and serve for local testing)
   ```
   npm install
   ```

4. Create a new directory in extensions. The name of this folder will be the extension id
   ```
   /extensions
       ...
       [extensionId]
   /src
   ```

5. Create a main.js file in your directory and import the Extension class
   **main.js**
   ```js
   import Extension from "../../src/extension.js"
   ``` 

6. Create an extension with the fields you want. The id must be the same as your directory
   **main.js**
   ```js
   const extension = new Extension({
     id: [extensionId],
     name: [extensionName],
     ...
   }); 
   ```

7. Override the events you want to use. These events will give access to the client object
   ```js
   extension.onStart((client) => {
     console.log("I made an extension!");
     console.log(client.traveler.position);
   });
   ```
  
8.  Export your extension
   ```js
   export default extension;
   ```

11. **TODO:** Make a development environment to test extensions

12. Commit and push your changes back to your repository
    ```
    git add -A
    git commit -m "Added [extension name]
    git push
    ```

13. There should now be a 'Compare & pull request' button which you can use to make a pull request.

### Documentation

Sprint makes it easy to interact with the travelers code by abstracting over it so that you can focus on your extensions.

#### Extension

The base class for an extension. Holds the meta data and event methods.

##### Constructor
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

##### onStart(callback)
When this extension is turned on, Sprint calls an extensions start method. You can set the start method with onStart(callback). The callback is passed the [client](#client).

```js
extension.onStart((client) => {
  console.log("Thanks for installing. I can finally begin... World domination!!!");
});
```

##### onStop(callback)
When this extension is turned off (maybe an extension turned out to be evil), then Sprint calls its stop method. You can set the stop method with onStop(callback). The callback is passed the [client](#client).

```js
extension.onStop((client) => {
  console.log("NO-O-O-O-O...O-O-O-O-O-O-O...O-O-O-O-O");
});
```

##### onUpdate(callback)
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

##### onSettings(callback)
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


#### Client
The client is the main class for Sprint. The client has no functionality to extensions other than holding all the Sprint submodules. The modules useful for extension development are:

* [traveler](#traveler)
* [world](#world)
* [inventory](#inventory)
* [popup](#popup)

#### Traveler

#### World

##### Tile

#### Inventory

#### Popup

#### Server Data

