// Aplica o tema e a paleta salvos antes da primeira pintura. Fica em arquivo próprio para a CSP não precisar liberar script inline.
(function () {
  var theme = null;
  try {
    theme = localStorage.getItem("elias-theme");
  } catch (e) {}
  if (theme !== "light" && theme !== "dark") {
    theme = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }
  document.documentElement.dataset.theme = theme;
  var palette = null;
  try {
    palette = localStorage.getItem("elias-palette");
  } catch (e) {}
  if (palette === "meraki") palette = "cafeteria";
  if (["green", "blue", "black", "graphite", "cafeteria"].indexOf(palette) > -1) document.documentElement.dataset.palette = palette;
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "light" ? "#ececee" : "#070b0a");
})();
