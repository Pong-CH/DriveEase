try {
  const theme = localStorage.getItem("theme");
  document.documentElement.classList.toggle(
    "dark",
    theme ? theme === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches,
  );
} catch {
  document.documentElement.classList.toggle(
    "dark",
    window.matchMedia("(prefers-color-scheme: dark)").matches,
  );
}
