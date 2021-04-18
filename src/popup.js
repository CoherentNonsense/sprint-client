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
      this.buttons = [];
      this.idCounter = 0;
    }

    break()
    {
      this.contents.appendChild(createElement("hr"));  
    }

    addParagraph(text)
    {
      const p = createElement("p", "unselectable", text);
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

    _generateId()
    {
      return `sprint-popup-${this.idCounter++}`;
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
    custom(title, body, buttons)
    {
      const titleHTML = createElement("span", "unselectable", title);

      const bodyHTML = createElement("div", "unselectable", body);

      //POPUP.new(titleHTML, bodyHTML, buttons);
      console.log(titleHTML, bodyHTML);
    }

  }

})();

export default Popup;