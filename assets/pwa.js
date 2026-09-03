/* PWA 注册：仅在 http(s) 环境注册 Service Worker；file:// 直接打开时静默跳过。 */
(function () {
  if (!("serviceWorker" in navigator)) return;
  const proto = location.protocol;
  if (proto !== "http:" && proto !== "https:") return;
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js")
      .catch((err) => console.warn("[PWA] SW register failed:", err));
  });
})();
