const extension = new Extension({
  id: "autoSprint",
  name: "Auto Sprint",
  icon: "ꆜ",
  category: "bot",
  about: "Automatically double steps",
  author: "Coherent Nonsense"
});


extension.onUpdate((client) => {
  const { traveler } = client;

  traveler.sprint();
});

export default extension;