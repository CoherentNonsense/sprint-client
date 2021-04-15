if (!window.sprint_client)
{
  const sprint_style = document.createElement("link");
  sprint_style.setAttribute("rel", "stylesheet");
  sprint_style.setAttribute("href", "https://coherentnonsense.github.io/sprint-client/sprintClient.css");
  window.sprint_client = document.createElement("script");
  document.head.appendChild(sprint_style);
  window.sprint_client.setAttribute("type", "module");
  window.sprint_client.setAttribute("src", "https://coherentnonsense.github.io/sprint-client/src/main.js");
  document.body.appendChild(window.sprint_client);
}