import Extension from "../../src/extension.js";

const extension = new Extension({
  id: "resourceGatherer",
  name: "Resource Gatherer",
  icon: "⛏",
  category: "bot",
  about: "Gathers resources based on supplied list",
  author: "CoherentNonsense"
});

extension.onSettings((client) => {
  client.popup.build("Select Resources", (body) => {
    body.addParagraph("Cities & Houses");
    
  });
});

export default extension;