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

  // Random math: a OP b = ?
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

  // Background
  ctx.fillStyle = "#f5f5f5";
  ctx.fillRect(0, 0, w, h);

  // Noise dots
  for (let i = 0; i < 80; i++) {
    ctx.fillStyle = `rgba(${rand(0,255)},${rand(0,255)},${rand(0,255)},0.4)`;
    ctx.beginPath();
    ctx.arc(rand(0, w), rand(0, h), rand(1, 3), 0, Math.PI * 2);
    ctx.fill();
  }

  // Interference lines
  for (let i = 0; i < 5; i++) {
    ctx.strokeStyle = `rgba(${rand(0,200)},${rand(0,200)},${rand(0,200)},0.4)`;
    ctx.lineWidth = rand(1, 2);
    ctx.beginPath();
    ctx.moveTo(rand(0, w), rand(0, h));
    ctx.bezierCurveTo(rand(0, w), rand(0, h), rand(0, w), rand(0, h), rand(0, w), rand(0, h));
    ctx.stroke();
  }

  // Draw each character with random rotation/color
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

// Enter key to submit
document.getElementById("captchaInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") verifyCaptcha();
});

// Close modal on overlay click
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeCaptcha();
});

// Click canvas to refresh
captchaCanvas.addEventListener("click", generateCaptcha);

// Trigger captcha before download
function downloadTxt() {
  showCaptcha();
}

function doDownload() {
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
