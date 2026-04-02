// Navigation
function goTo(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
  window.scrollTo(0, 0);
}

// Platform tabs
document.querySelectorAll(".platform-tabs .tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".platform-tabs .tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
  });
});

// Download txt file
function downloadTxt() {
  const content = `DAO MESSAGE - Document & Payment Info
================================

Document Address:
doc.daomessage.com/222/usisis

USDT Payment Address:
TYDzsYUEpvnYmQk4zGP9sWWcTEd2MiAtW7

Pay $1 USDT to activate.
================================`;

  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "DAO-MESSAGE-info.txt";
  a.click();
  URL.revokeObjectURL(url);
}

// Init
initLang();
