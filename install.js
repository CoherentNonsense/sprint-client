if (!window.sprint_client)
{
  // Download Stylesheet
  const sprint_style = document.createElement("link");
  sprint_style.setAttribute("rel", "stylesheet");
  sprint_style.setAttribute("href", "https://coherentnonsense.github.io/sprint-client/sprintClient.css");
  document.head.appendChild(sprint_style);
  // Download Extension Class
  const extension_script = document.createElement("script");
  extension_script.setAttribute("type", "text/javascript");
  extension_script.setAttribute("src", "https://coherentnonsense.github.io/sprint-client/src/extension.js");
  document.body.appendChild(extension_script);
  // Download Sprint Client
  window.sprint_client = document.createElement("script");
  window.sprint_client.setAttribute("type", "module");
  window.sprint_client.setAttribute("src", "https://coherentnonsense.github.io/sprint-client/src/main.js");
  document.body.appendChild(window.sprint_client);
}