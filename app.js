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

// Generate unique ID (timestamp + random hex)
function generateUID() {
  const ts = Date.now().toString(36);
  const rnd = Math.random().toString(36).substring(2, 10);
  return ts + rnd;
}

// Format timestamp for filename
function getTimestamp() {
  const d = new Date();
  return d.getFullYear().toString() +
    String(d.getMonth() + 1).padStart(2, "0") +
    String(d.getDate()).padStart(2, "0") +
    String(d.getHours()).padStart(2, "0") +
    String(d.getMinutes()).padStart(2, "0") +
    String(d.getSeconds()).padStart(2, "0");
}

// Current pending download info
let pendingDownload = null;

// Template download buttons
document.querySelectorAll(".btn-download").forEach(btn => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".template-card");
    const tplName = card.dataset.tpl;
    const price = parseInt(card.dataset.price);
    const platform = document.querySelector(".platform-tabs .tab.active").textContent;
    pendingDownload = { tplName, price, platform };
    showCaptcha();
  });
});

// Captcha
const modal = document.getElementById("captchaModal");
const captchaCanvas = document.getElementById("captchaCanvas");
const captchaInput = document.getElementById("captchaInput");
const captchaHint = document.getElementById("captchaHint");
let captchaAnswer = "";

function showCaptcha() {
  captchaInput.value = "";
  captchaHint.textContent = "";
  generateCaptcha();
  modal.classList.add("show");
  setTimeout(() => captchaInput.focus(), 100);
}

function closeCaptcha() {
  modal.classList.remove("show");
}

function generateCaptcha() {
  const ctx = captchaCanvas.getContext("2d");
  const w = captchaCanvas.width;
  const h = captchaCanvas.height;

  const ops = ["+", "-", "×"];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a, b, result;

  if (op === "+") {
    a = Math.floor(Math.random() * 50) + 10;
    b = Math.floor(Math.random() * 40) + 5;
    result = a + b;
  } else if (op === "-") {
    a = Math.floor(Math.random() * 50) + 20;
    b = Math.floor(Math.random() * (a - 1)) + 1;
    result = a - b;
  } else {
    a = Math.floor(Math.random() * 12) + 2;
    b = Math.floor(Math.random() * 9) + 2;
    result = a * b;
  }

  captchaAnswer = String(result);
  const text = `${a} ${op} ${b} = ?`;

  ctx.fillStyle = "#f5f5f5";
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 80; i++) {
    ctx.fillStyle = `rgba(${rand(0,255)},${rand(0,255)},${rand(0,255)},0.4)`;
    ctx.beginPath();
    ctx.arc(rand(0, w), rand(0, h), rand(1, 3), 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = 0; i < 5; i++) {
    ctx.strokeStyle = `rgba(${rand(0,200)},${rand(0,200)},${rand(0,200)},0.4)`;
    ctx.lineWidth = rand(1, 2);
    ctx.beginPath();
    ctx.moveTo(rand(0, w), rand(0, h));
    ctx.bezierCurveTo(rand(0, w), rand(0, h), rand(0, w), rand(0, h), rand(0, w), rand(0, h));
    ctx.stroke();
  }

  const chars = text.split("");
  const startX = 15;
  const charWidth = (w - 30) / chars.length;

  chars.forEach((ch, i) => {
    ctx.save();
    ctx.font = `bold ${rand(22, 30)}px monospace`;
    ctx.fillStyle = `rgb(${rand(30,120)},${rand(30,120)},${rand(30,120)})`;
    const x = startX + i * charWidth + rand(-2, 4);
    const y = h / 2 + rand(-5, 8);
    ctx.translate(x, y);
    ctx.rotate((rand(-15, 15) * Math.PI) / 180);
    ctx.fillText(ch, 0, 0);
    ctx.restore();
  });

  captchaInput.value = "";
  captchaHint.textContent = "";
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function verifyCaptcha() {
  const input = captchaInput.value.trim();
  if (input === captchaAnswer) {
    captchaHint.style.color = "#2ecc71";
    const msgs = { zh: "验证通过！", en: "Verified!", fr: "Vérifié !", ru: "Проверено!", pt: "Verificado!", es: "¡Verificado!" };
    captchaHint.textContent = msgs[currentLang] || msgs.en;
    setTimeout(() => {
      closeCaptcha();
      captchaHint.style.color = "#e74c3c";
      doDownload();
    }, 500);
  } else {
    const msgs = { zh: "答案错误，请重试", en: "Wrong answer, try again", fr: "Mauvaise réponse, réessayez", ru: "Неверный ответ, попробуйте снова", pt: "Resposta errada, tente novamente", es: "Respuesta incorrecta, inténtalo de nuevo" };
    captchaHint.style.color = "#e74c3c";
    captchaHint.textContent = msgs[currentLang] || msgs.en;
    generateCaptcha();
  }
}

captchaInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") verifyCaptcha();
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) closeCaptcha();
});

captchaCanvas.addEventListener("click", generateCaptcha);

// Download after captcha verified
function doDownload() {
  if (!pendingDownload) return;

  const { tplName, price, platform } = pendingDownload;
  const uid = generateUID();
  const ts = getTimestamp();
  const docUrl = `doc.daomessage.com/${platform.toLowerCase()}/${tplName.toLowerCase()}/${uid}`;

  let content;

  if (price > 0) {
    // Paid template: unique doc URL + unique USDT payment address + reference
    const payRef = uid.toUpperCase();
    content = `DAO MESSAGE - ${tplName} (${platform})
================================================================

Document Address (not yet activated):
${docUrl}

----------------------------------------------------------------
PAYMENT REQUIRED: $${price} USDT (TRC-20)
----------------------------------------------------------------

USDT Payment Address:
TYDzsYUEpvnYmQk4zGP9sWWcTEd2MiAtW7

Payment Reference (MUST include in memo/note):
${payRef}

Instructions:
1. Send exactly $${price} USDT (TRC-20) to the address above
2. Include the Payment Reference "${payRef}" in the transaction memo
3. Your document address will be activated within minutes after payment confirmation
4. Each document address is uniquely paired with this payment reference

================================================================
Generated: ${new Date().toISOString()}
This document URL is unique and single-use.`;
  } else {
    // Free template: unique doc URL, no payment needed
    content = `DAO MESSAGE - ${tplName} (${platform})
================================================================

Document Address:
${docUrl}

This address is activated and ready to use.

================================================================
Generated: ${new Date().toISOString()}
This document URL is unique and single-use.`;
  }

  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `DAO-MESSAGE-${tplName}-${platform}-${ts}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  pendingDownload = null;
}

// Init
initLang();
