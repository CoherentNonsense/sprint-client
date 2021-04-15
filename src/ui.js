/**
 * @file ui.js
 * @description This class makes it much easier to manipulate the UI as well as sets up a bunch of stuff to integrate my HTML into the game
 *              This only encompasses UI that is connected to the game"s UI. If I make anything that can be completely separate,
 *              such as a texture editor, it will not be done here.
 *
 * this stuff is really gross. I'll try modularize it later. not a fan of DOM stuff.
 */
const makeUI = (function() {

const UI = {

  client: null,
  tabMenus: {},

  
  // Hooks into the game"s UI and stuffs a bunch of my own HTML
  hook: (client) => {
    // this code is looking kinda chunky
    // Console menu
    UI.client = client;
    const consoleHTML = document.getElementById("consoleDiv");
    const eventLogHTML = document.getElementById("console-scroll");
    const consoleInfoMenu = new InfoMenu(consoleHTML); // information menu when you click an item in the console
    consoleHTML.removeChild(consoleHTML.childNodes[1]); // removes the event title in the console. it gets replaced with a clickable tab later
    UI.tabMenus["console"] = new TabMenu(consoleHTML, consoleInfoMenu);
    UI.tabMenus["console"].addTab("events", eventLogHTML);


      /////////////////
    // Create Tabs //
    UI.tabMenus["console"].addTab("extensions");
    // UI.tabMenus["console"].getTab("extensions").addItem("mods", "download", "+", () => { consoleInfoMenu.open("mods coming soon", "mods change how the game is played. modded items cannot be mixed with core game items. it is best to treat mods as completely separate games that use the travelers world map.") });
    // UI.tabMenus["console"].getTab("extensions").addItem("mods", "bluestone", "BS", () => { consoleInfoMenu.open("bluestone", "create kilometre wide circuits.")});
    // UI.tabMenus["console"].getTab("extensions").addItem("mods", "factorlers", "ooo", () => { consoleInfoMenu.open("orios", "adds a whole bunch of new materials which can be mined, processed, and crafted with.")});
    // UI.tabMenus["console"].getTab("extensions").addItem("texture packs", "download", "+", () => { consoleInfoMenu.open("texture packs", "create or download a texture pack. sprint supplies you with a texture pack editor which can create both text and sprite texture packs.")});
    // UI.tabMenus["console"].getTab("extensions").addItem("texture packs", "happy", ":)");
    // UI.tabMenus["console"].getTab("extensions").addItem("bots", "download", "+", () => { consoleInfoMenu.open("bots coming soon", "bots automate your playing experience. you can create one with javascript or download one from the community.")});
    // UI.tabMenus["console"].getTab("extensions").addItem("bots", "xp", "xp");
    // UI.tabMenus["console"].getTab("extensions").addItem("bots", "raider", "CHC");
    // UI.tabMenus["console"].getTab("extensions").addItem("bots", "lumber", "--A");
    // UI.tabMenus["console"].getTab("extensions").addItem("bots", "travel", "&");

    // This has to be bound after all the tabs are created so it is put at the bottom.
    consoleInfoMenu.bind();

    // lets me initialize tab in debug mode
    if (UI.client.env == "dev")
    {
      UI.tabMenus["console"].selectTab(1);
    }


    /////////////////
    // Stats menu //
    const statsHTML = document.getElementById("statsDiv");
    const username = statsHTML.childNodes[1].innerHTML;
    const accountStatsHTML = document.getElementById("stats-scroll");
    const statsInfoMenu = new InfoMenu(statsHTML); // information menu when you click an item in the stats
    statsHTML.removeChild(statsHTML.childNodes[1]);
    UI.tabMenus["stats"] = new TabMenu(statsHTML, statsInfoMenu);
    UI.tabMenus["stats"].addTab("SPRINT");
    UI.tabMenus["stats"].getTab("SPRINT").addPara("about", "the sprint client allows users to easily download extensions for UI game. it also sets up a framework for users to easily create their own extensions and share them with others.");
    UI.tabMenus["stats"].getTab("SPRINT").addItem("credits", "CoherentNonsense", "CN", () => { statsInfoMenu.open("CoherentNonsense", "developer") });
    UI.tabMenus["stats"].getTab("SPRINT").addItem("help", "extensions", "ext", () => { statsInfoMenu.open("extensions", "extensions are programs that you run on this client. you can download extensions or make your own in the \"extensions\" tab below.")});
    UI.tabMenus["stats"].addTab(username, accountStatsHTML);
    statsInfoMenu.bind(); // Has to be bound after tabs are made so it is at the bottom
    UI.tabMenus["stats"].selectTab(1); // the default stat tab is (1)
  },

  updateExtensions: (extensions) => {
    extensions.forEach((extension) => {
      console.log(UI)
      UI.tabMenus["console"].getTab("extensions").addItem(extension.category, extension.name, extension.icon);
    });

    UI.tabMenus["console"].selectTab(1);
  },

}

// A container that holds multiple tabs that you can click between
class TabMenu
{
  constructor(containerHTML, infoMenuHTML)
  {
    this.containerHTML = containerHTML;
    this.infoMenuHTML = infoMenuHTML;
    this.menuHTML = document.createElement("div");
    this.menuHTML.className = "tab-menu";
    this.containerHTML.prepend(this.menuHTML);
    this.currentTab = 0;
    this.tabs = [];
  }

  // gets a tab object
  getTab(name)
  {
    for (const id in this.tabs)
    {
      if (this.tabs[id].name == name)
      {
        return this.tabs[id];
      }
    }
  }

  // creates a tab for an HTML element and adds it to the tab menu
  addTab(name, tabHTML)
  {
    let noRender = true;
    if (!tabHTML)
    {
      tabHTML = document.createElement("div");
      tabHTML.className = "side-section-scroll scrollbar";
      this.containerHTML.appendChild(tabHTML);
      noRender = false;
    }
    const tabId = this.tabs.length;
    const menuHTML = document.createElement("div");
    menuHTML.className = "tab-menu-item";
    menuHTML.innerHTML = name;
    this.menuHTML.appendChild(menuHTML);
    menuHTML.addEventListener("click", () => {
      this.selectTab(tabId);
    });
    this.tabs[tabId] = new Tab(tabHTML, menuHTML, tabId, name, noRender);
  }

  // selects a tab
  selectTab(id)
  {
    this.infoMenuHTML.close();
    for (let i = 0; i < this.tabs.length; i++)
    {
      if (this.tabs[i].id === id)
      {
        this.tabs[i].el.style.display = "block";
        this.tabs[i].tab.classList.add("tab-selected");
        this.tabs[i].render();
      }
      else
      {
        this.tabs[i].el.style.display = "none";
        this.tabs[i].tab.classList.remove("tab-selected");
      }
    }
  }

  clearTab(id)
  {
    this.infoMenuHTML.close();
    for (let i = 0; i < this.tabs.length; i++)
    {
      if (this.tabs[i].id === id)
      {
        this.tabs[i] = {};
        break;
      }
    }
  }
}

// Holds the contents of a tab and the logic to open and close it
class Tab
{
  constructor(elementHTML, tabHTML, id, name, noRender)
  {
    this.noRender = noRender
    this.el = elementHTML;
    this.tab = tabHTML;
    this.id = id;
    this.name = name;
    this.sections = {};
    this.el.style.display = "none";
  }

  // Adds an item (like your inventory in-game)
  addItem(category, name, icon, onclick)
  {
    if (!this.sections[category])
    {
      this.sections[category] = [];
    }
    this.sections[category].push({
      type: 1,
      name,
      icon,
      onclick,
    });
  }

  // Adds a paragraph
  addPara(category, text)
  {
    if (!this.sections[category])
    {
      this.sections[category] = [];
    }
    this.sections[category].push({
      type: 0,
      text,
    });
  }

  // Clears this tab
  clear()
  {
      this.sections = {};
  }

  // Creates the HTML and renders this tab
  render()
  {
    if (this.noRender)
    {
      return;
    }
    this.el.innerHTML ="";
    for (const category in this.sections)
    {
      const categoryHTML = document.createElement("p");
      categoryHTML.className = "supply-category scrollbar";
      categoryHTML.innerHTML = category;
      this.el.appendChild(categoryHTML);

      const categoryContent = this.sections[category];
      for (let i = 0; i < categoryContent.length; i++)
      {
        const itemHTML = document.createElement("div");
        switch(categoryContent[i].type)
        {
          case 0:
            itemHTML.className = "tab-text";
            itemHTML.innerHTML = categoryContent[i].text;
            break;
          case 1: {
            itemHTML.className = "supplies-box-icon";
            itemHTML.onclick = categoryContent[i].onclick;
            const itemIconHTML = document.createElement("div");
            itemIconHTML.className = "supplies-icon-symbol";
            itemIconHTML.innerHTML = categoryContent[i].icon;

            itemHTML.append(itemIconHTML);
          }

        }

        this.el.appendChild(itemHTML);
      }
    }
  }
}

// The menu that opens when you click an item
class InfoMenu
{
  constructor(parentHTML)
  {
    this.parentHTML = parentHTML;

    this.infoHTML = document.createElement("div");
    this.infoHTML.className = "sprint-info";
    this.close();
  }

  // Appends this menu to its parent
  bind()
  {
    this.parentHTML.appendChild(this.infoHTML);
  }

  // Creates the HTML and renders the info
  open(title, about, buttons)
  {
    this.close();
    this.infoHTML.style.display = "block";
    const titleHTML = document.createElement("div");
    titleHTML.className = "supplies-infotitle";
    titleHTML.innerHTML = title;

    const aboutHTML = document.createElement("div");
    aboutHTML.className = "supplies-infodesc";
    aboutHTML.innerHTML = about;

    const closeButton = document.createElement("input");
    closeButton.type = "button";
    closeButton.className = "craft-btns";
    closeButton.value = "close";
    closeButton.onclick = () => {
      this.close();
    };

    this.infoHTML.appendChild(titleHTML);
    this.infoHTML.appendChild(closeButton);
    this.infoHTML.appendChild(aboutHTML);
  }

  // Hides the info menu
  close()
  {
    this.infoHTML.style.display = "none";
    this.infoHTML.innerHTML = "";
  }
}

return UI;

});

export default makeUI();