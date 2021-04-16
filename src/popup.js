/**
 * A wrapper for the POPUP object to easily create lots of HTML without all the typing.
 */
const Popup = (function() {

  class Body
  {
    constructor()
    {
      this.contents = "<div class=\"unselectable\">";
      this.buttons = [];
    }

    break()
    {
      this.contents += "<hr>";  
    }

    addParagraph(text)
    {
      this.contents += `<p>${text}</p>`;
    }
  }

  return {

    build(title, create)
    {

    },

    /**
     * A bare bones wrapper around the POPUP object
     * @param {string} title
     * @param {string} html HTML or string to insert into the popup
     * @param {Object} buttons
     */
    custom(title, body, buttons)
    {
      POPUP.new(
        `<span class='unselectable'>${title}</span>`,
        `<span class="unselectable'>${body}</span>`,
        buttons
      );
    }

  }

})();

export default Popup;