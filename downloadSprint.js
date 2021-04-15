if (!window.sprint_client)
{
  window.sprint_client = document.createElement("script");
  window.sprint_client.setAttribute("type", "module");
  window.sprint_client.setAttribute("src", "src/main.js");
  document.body.appendChild(window.sprint_client);
}