/**
 * A wrapper for the POPUP object to easily create lots of HTML without all the typing.
 */
const Popup = (function() {


  // TODO: make more dynamic for input types
  function createElement(tag, className, text)
  {
    const element = document.createElement(tag);
    element.className = className;
    !text ? null : element.innerHTML = text;

    return element;
  }

  class Body
  {
    constructor()
    {
      this.contents = createElement("div", "unselectable");
      this.idCounter = 0;

      this.inExpandable = false;
    }

    break()
    {
      this.contents.appendChild(createElement("hr", "sprint-break"));  
    }

    addTitle(text)
    {
      this.contents.appendChild(createElement("h3", "sprint-title", text));
    }

    addParagraph(text)
    {
      const p = createElement("p", "unselectable sprint-para", text);
      this.contents.appendChild(p);
    }

    addCheckbox(title, set, initialValue)
    {
      const id = this._generateId();

      const label = createElement("label", "sprint-popup-label", title);
      label.htmlFor = id;

      const check = createElement("input");
      check.id = id;
      check.type = "checkbox";
      check.onclick = (e) => { set(e.currentTarget.checked) };
      
      check.checked = !!initialValue;

      label.insertBefore(check, null);
      this.contents.appendChild(label);
    }

    addButton(title, buttonValue, onclick)
    {
      const id = this._generateId();

      const label = createElement("label", "sprint-popup-label", title);
      label.htmlFor = id;

      const button = createElement("input");
      button.id = id;
      button.type = "button";
      button.value = buttonValue;
      button.onclick = onclick;

      label.insertBefore(button, null);
      this.contents.appendChild(label);
    }

    buildExpandable(title, create)
    {
      const header = createElement("div", "sprint-title", title);
      const body = new Body();
      create(body);

      body.contents.classList.add("sprint-popup-hidden");
      header.onclick = () => {
        body.contents.classList.toggle("sprint-popup-hidden");
      };

      this.contents.appendChild(header);
      this.contents.appendChild(body.contents);
    }

    _generateId()
    {
      return `sprint-popup-${this.idCounter++}`;
    }

    addDropdown(title, options, callback, current)
    {
      const header = createElement("span", "", title);

      const dropdown = createElement("select", "sprint-dropdown");
      options.forEach((option) => {
        const item = createElement("option", "", option);
        item.value = option;
        
        // Select current direction
        dropdown.selectedIndex = [...dropdown.options].findIndex(o => o.text === current);
        
        dropdown.append(item);
      });

      dropdown.onchange = (e) => callback(e.target.options[e.target.selectedIndex].value);

      this.contents.appendChild(dropdown);
      this.contents.appendChild(header);
    }
  }

  return {

    build(title, create)
    {
      const body = new Body();
      create(body);

      POPUP.new(createElement("span", "unselectable", title), body.contents);
    },

    /**
     * A bare bones wrapper around the POPUP object
     * @param {string} title
     * @param {string} html HTML or string to insert into the popup
     * @param {Object} buttons
     */
    custom(title, html, buttons)
    {
      const titleHTML = createElement("span", "unselectable", title);

      const bodyHTML = createElement("div", "unselectable", html);

      POPUP.new(titleHTML, bodyHTML, buttons);
    }

  }

})();

export default Popup;