// Navigation
function goTo(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
  window.scrollTo(0, 0);
  if (pageId !== "page3") history.replaceState(null, "", location.pathname);
}

// Handle URL hash for template detail (e.g. #tpl_xxx)
async function handleHash() {
  const hash = location.hash.replace("#", "");
  if (hash.startsWith("tpl_")) {
    await showTemplateDetail(hash);
  }
}
window.addEventListener("hashchange", handleHash);

// Platform tabs
document.querySelectorAll(".platform-tabs .tab").forEach(tab => {
  tab.addEventListener("click", async () => {
    document.querySelectorAll(".platform-tabs .tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    await renderTemplateMarket();
  });
});

// =============================================
// Dynamic Template Market
// =============================================
function escHtml(s) {
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}

async function renderTemplateMarket() {
  const list = document.getElementById("templateList");
  const empty = document.getElementById("emptyMarket");
  if (!list) return;

  const platform = document.querySelector(".platform-tabs .tab.active").textContent;

  try {
    const approved = await getApprovedTemplates(platform);

    if (approved.length === 0) {
      list.innerHTML = "";
      empty.style.display = "block";
      return;
    }

    empty.style.display = "none";
    const viewLabel = translations[currentLang]?.tpl_view || "View";
    list.innerHTML = approved.map(t => {
      const priceTag = t.price > 0 ? `<span class="tpl-price">$${t.price}</span>` : `<span class="tpl-free">${translations[currentLang]?.tpl_free_tag || "Free"}</span>`;
      return `
        <div class="template-card">
          <div class="template-info">
            <h3>${escHtml(t.name)}</h3>
            <p>${escHtml(t.description)}</p>
            <div class="tpl-tags">${priceTag}<span class="tpl-platform">${t.platforms.join(", ")}</span></div>
          </div>
          <button class="btn-outline" onclick="location.hash='${t.id}'">${viewLabel}</button>
        </div>`;
    }).join("");
  } catch(e) {
    list.innerHTML = "";
    empty.style.display = "block";
  }
}

// =============================================
// USDT Address Pool
// =============================================
const USDT_POOL = [
  "TYDzsYUEpvnYmQk4zGP9sWWcTEd2MiAtW7",
  "TJDENsfBJs4RFETt1X1W8wMDc8M5z7ms8m",
  "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
  "TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9",
  "TLa2f6VPqDgRE67v1736s7bJ8Ray5wYjU7",
  "TVj7RNVHy6thbM7BWdSTe9jKCMx6GE2wKn",
  "TPYmHEhy5n8TCEfYGqW2rPxsghSfzghPDn",
  "TKzxdSv2FZKQrEqkKVgp5DcwEXBEKMg2Ax",
  "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE",
  "TX2RuZry9X3EpKHRMGRWDpvLCkpP9LM2nW"
];

const BIND_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const STORAGE_KEY = "dao_usdt_bindings";

// Load bindings from localStorage
function loadBindings() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

// Save bindings to localStorage
function saveBindings(bindings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bindings));
}

// Clean up expired bindings
function cleanExpiredBindings() {
  const now = Date.now();
  const bindings = loadBindings().filter(b => b.expiresAt > now);
  saveBindings(bindings);
  return bindings;
}

// Allocate an available USDT address
function allocateAddress() {
  const bindings = cleanExpiredBindings();
  const usedAddresses = new Set(bindings.map(b => b.address));
  const available = USDT_POOL.filter(addr => !usedAddresses.has(addr));

  if (available.length === 0) return null;

  const address = available[Math.floor(Math.random() * available.length)];
  const expiresAt = Date.now() + BIND_TIMEOUT_MS;

  bindings.push({ address, expiresAt });
  saveBindings(bindings);

  return { address, expiresAt };
}

// Format deadline for display
function formatDeadline(timestamp) {
  const d = new Date(timestamp);
  const pad = n => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} (UTC${d.getTimezoneOffset() > 0 ? "-" : "+"}${pad(Math.abs(Math.floor(d.getTimezoneOffset()/60)))})`;
}

// =============================================
// Unique ID & Timestamp
// =============================================
function generateUID() {
  const ts = Date.now().toString(36);
  const rnd = Math.random().toString(36).substring(2, 10);
  return ts + rnd;
}

function getTimestamp() {
  const d = new Date();
  return d.getFullYear().toString() +
    String(d.getMonth() + 1).padStart(2, "0") +
    String(d.getDate()).padStart(2, "0") +
    String(d.getHours()).padStart(2, "0") +
    String(d.getMinutes()).padStart(2, "0") +
    String(d.getSeconds()).padStart(2, "0");
}

// =============================================
// Download flow
// =============================================
let pendingDownload = null;

// =============================================
// Template Detail Page
// =============================================
async function showTemplateDetail(tplId) {
  const container = document.getElementById("tplDetail");
  if (!container) return;

  container.innerHTML = `<p style="text-align:center;color:var(--text-muted);">Loading...</p>`;
  goTo("page3");

  try {
    const t = await getTemplateById(tplId);
    const lang = currentLang;
    const btnLabel = t.price > 0
      ? `${translations[lang]?.tpl_buy || "Buy"} - $${t.price}`
      : (translations[lang]?.tpl_download || "Download");

    const imagesHtml = t.images && t.images.length
      ? `<div class="detail-images">${t.images.map(s => `<img src="${s}" class="detail-img" onclick="openImg(this.src)">`).join("")}</div>`
      : "";

    container.innerHTML = `
      <h2 class="detail-title">${escHtml(t.name)}</h2>
      <div class="detail-meta">
        <span class="tpl-platform">${t.platforms.join(", ")}</span>
        ${t.price > 0 ? `<span class="tpl-price">$${t.price}</span>` : `<span class="tpl-free">${translations[lang]?.tpl_free_tag || "Free"}</span>`}
      </div>
      ${imagesHtml}
      <div class="detail-desc">${escHtml(t.description)}</div>
      <button class="btn-primary detail-btn" onclick="onDownload('${t.id}', '${escHtml(t.name)}', ${t.price}, '${t.platforms[0] || ""}')">${btnLabel}</button>
    `;
  } catch(e) {
    container.innerHTML = `<p style="text-align:center;color:#ef4444;">${e.message}</p>`;
  }
}

function openImg(src) {
  const overlay = document.createElement("div");
  overlay.className = "img-overlay";
  overlay.innerHTML = `<img src="${src}"><button onclick="this.parentElement.remove()">&times;</button>`;
  overlay.addEventListener("click", e => { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}

function onDownload(tplId, tplName, price, platform) {
  pendingDownload = { tplId, tplName, price, platform: platform || "Unknown" };
  showCaptcha();
}

// =============================================
// Captcha
// =============================================
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

  const style = getComputedStyle(document.documentElement);
  const captchaBg = style.getPropertyValue("--captcha-bg").trim() || "#12121a";
  const cR = parseInt(style.getPropertyValue("--captcha-text-r")) || 150;
  const cG = parseInt(style.getPropertyValue("--captcha-text-g")) || 140;
  const cB = parseInt(style.getPropertyValue("--captcha-text-b")) || 180;

  ctx.fillStyle = captchaBg;
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 80; i++) {
    ctx.fillStyle = `rgba(${rand(60,180)},${rand(60,180)},${rand(60,180)},0.25)`;
    ctx.beginPath();
    ctx.arc(rand(0, w), rand(0, h), rand(1, 3), 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = 0; i < 5; i++) {
    ctx.strokeStyle = `rgba(${rand(60,160)},${rand(60,160)},${rand(60,160)},0.3)`;
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
    ctx.fillStyle = `rgb(${rand(cR,cR+80)},${rand(cG,cG+80)},${rand(cB,cB+80)})`;
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

// =============================================
// Download logic - multilingual txt content
// =============================================
const txtStrings = {
  zh: {
    docAddrLabel: "文档地址（尚未激活）：",
    docAddrLabelFree: "文档地址：",
    payRequired: "需要支付：",
    payAddr: "USDT 支付地址：",
    payDeadline: "支付截止时间：",
    important: "重要提示：",
    rule1: "请在上述截止时间前完成支付。",
    rule2: "30分钟后，此支付地址将过期失效。届时需重新下载文件获取新的支付地址。",
    rule3: "请准确发送 ${price} USDT (TRC-20) 到上述地址。",
    rule4: "链上确认付款后，您的文档地址将自动激活。",
    rule5: "此 USDT 地址在30分钟内专属分配给您，每个地址同一时间仅服务一笔交易。",
    generated: "生成时间：",
    orderId: "订单号：",
    uniquePaid: "此文档地址和支付地址对本订单唯一。",
    freeReady: "此地址已激活，可直接使用。",
    uniqueFree: "此文档地址唯一且一次性使用。"
  },
  en: {
    docAddrLabel: "Document Address (not yet activated):",
    docAddrLabelFree: "Document Address:",
    payRequired: "Payment Required:",
    payAddr: "USDT Payment Address:",
    payDeadline: "Payment Deadline:",
    important: "IMPORTANT:",
    rule1: "Please complete payment BEFORE the deadline shown above.",
    rule2: "After 30 minutes, this payment address will expire and become invalid. You will need to download a new file to get a new payment address.",
    rule3: "Send EXACTLY ${price} USDT (TRC-20) to the address above.",
    rule4: "Once payment is confirmed on-chain, your document address will be activated automatically.",
    rule5: "This USDT address is exclusively assigned to you for 30 minutes. Each address serves only one transaction at a time.",
    generated: "Generated:",
    orderId: "Order ID:",
    uniquePaid: "This document URL and payment address are unique to this order.",
    uniqueFree: "This document URL is unique and single-use.",
    freeReady: "This address is activated and ready to use."
  },
  fr: {
    docAddrLabel: "Adresse du document (pas encore activée) :",
    docAddrLabelFree: "Adresse du document :",
    payRequired: "Paiement requis :",
    payAddr: "Adresse de paiement USDT :",
    payDeadline: "Date limite de paiement :",
    important: "IMPORTANT :",
    rule1: "Veuillez effectuer le paiement AVANT la date limite indiquée ci-dessus.",
    rule2: "Après 30 minutes, cette adresse de paiement expirera. Vous devrez télécharger un nouveau fichier pour obtenir une nouvelle adresse.",
    rule3: "Envoyez exactement ${price} USDT (TRC-20) à l'adresse ci-dessus.",
    rule4: "Une fois le paiement confirmé sur la blockchain, votre adresse de document sera activée automatiquement.",
    rule5: "Cette adresse USDT vous est exclusivement attribuée pour 30 minutes.",
    generated: "Généré :",
    orderId: "N° de commande :",
    uniquePaid: "L'adresse du document et l'adresse de paiement sont uniques pour cette commande.",
    uniqueFree: "Cette adresse de document est unique et à usage unique.",
    freeReady: "Cette adresse est activée et prête à l'emploi."
  },
  ru: {
    docAddrLabel: "Адрес документа (ещё не активирован):",
    docAddrLabelFree: "Адрес документа:",
    payRequired: "Требуется оплата:",
    payAddr: "Адрес оплаты USDT:",
    payDeadline: "Крайний срок оплаты:",
    important: "ВАЖНО:",
    rule1: "Пожалуйста, завершите оплату ДО указанного срока.",
    rule2: "Через 30 минут этот платёжный адрес станет недействительным. Вам потребуется загрузить новый файл для получения нового адреса.",
    rule3: "Отправьте ровно ${price} USDT (TRC-20) на указанный адрес.",
    rule4: "После подтверждения оплаты в блокчейне ваш адрес документа будет активирован автоматически.",
    rule5: "Этот USDT-адрес назначен вам на 30 минут. Каждый адрес обслуживает только одну транзакцию.",
    generated: "Создано:",
    orderId: "ID заказа:",
    uniquePaid: "Адрес документа и платёжный адрес уникальны для этого заказа.",
    uniqueFree: "Этот адрес документа уникален и одноразовый.",
    freeReady: "Этот адрес активирован и готов к использованию."
  },
  pt: {
    docAddrLabel: "Endereço do documento (ainda não ativado):",
    docAddrLabelFree: "Endereço do documento:",
    payRequired: "Pagamento necessário:",
    payAddr: "Endereço de pagamento USDT:",
    payDeadline: "Prazo de pagamento:",
    important: "IMPORTANTE:",
    rule1: "Complete o pagamento ANTES do prazo indicado acima.",
    rule2: "Após 30 minutos, este endereço de pagamento expirará. Você precisará baixar um novo arquivo para obter um novo endereço.",
    rule3: "Envie exatamente ${price} USDT (TRC-20) para o endereço acima.",
    rule4: "Após a confirmação do pagamento na blockchain, seu endereço de documento será ativado automaticamente.",
    rule5: "Este endereço USDT é exclusivamente atribuído a você por 30 minutos.",
    generated: "Gerado:",
    orderId: "ID do pedido:",
    uniquePaid: "O endereço do documento e o endereço de pagamento são exclusivos deste pedido.",
    uniqueFree: "Este endereço de documento é único e de uso único.",
    freeReady: "Este endereço está ativado e pronto para uso."
  },
  es: {
    docAddrLabel: "Dirección del documento (aún no activada):",
    docAddrLabelFree: "Dirección del documento:",
    payRequired: "Pago requerido:",
    payAddr: "Dirección de pago USDT:",
    payDeadline: "Fecha límite de pago:",
    important: "IMPORTANTE:",
    rule1: "Complete el pago ANTES de la fecha límite indicada arriba.",
    rule2: "Después de 30 minutos, esta dirección de pago expirará. Deberá descargar un nuevo archivo para obtener una nueva dirección.",
    rule3: "Envíe exactamente ${price} USDT (TRC-20) a la dirección anterior.",
    rule4: "Una vez confirmado el pago en la blockchain, su dirección de documento se activará automáticamente.",
    rule5: "Esta dirección USDT se le asigna exclusivamente durante 30 minutos.",
    generated: "Generado:",
    orderId: "ID de pedido:",
    uniquePaid: "La dirección del documento y la dirección de pago son únicas para este pedido.",
    uniqueFree: "Esta dirección de documento es única y de un solo uso.",
    freeReady: "Esta dirección está activada y lista para usar."
  }
};

function getTxt(key) {
  const s = txtStrings[currentLang] || txtStrings.en;
  return s[key] || (txtStrings.en[key] || "");
}

async function doDownload() {
  if (!pendingDownload) return;

  const { tplId, tplName, price, platform } = pendingDownload;
  const uid = generateUID();
  const ts = getTimestamp();

  // Fetch the developer's uploaded file content from API
  let devFileContent = "";
  if (tplId) {
    try {
      const tpl = await getTemplateById(tplId);
      if (tpl && tpl.fileContent) devFileContent = tpl.fileContent;
    } catch(e) { console.error(e); }
  }

  let content;

  if (price > 0) {
    const allocation = allocateAddress();

    if (!allocation) {
      const msgs = {
        zh: "当前支付通道繁忙，请30分钟后再试。",
        en: "Payment channels are busy. Please try again in 30 minutes.",
        fr: "Les canaux de paiement sont occupés. Réessayez dans 30 minutes.",
        ru: "Платёжные каналы заняты. Попробуйте через 30 минут.",
        pt: "Canais de pagamento ocupados. Tente novamente em 30 minutos.",
        es: "Canales de pago ocupados. Intente de nuevo en 30 minutos."
      };
      alert(msgs[currentLang] || msgs.en);
      pendingDownload = null;
      return;
    }

    const deadline = formatDeadline(allocation.expiresAt);

    content = `DAO MESSAGE - ${tplName} (${platform})
================================================================
${devFileContent ? "\n" + devFileContent + "\n\n================================================================" : ""}

================================================================
${getTxt("payRequired")} $${price} USDT (TRC-20)
================================================================

${getTxt("payAddr")}
${allocation.address}

${getTxt("payDeadline")}
${deadline}

${getTxt("important")}
- ${getTxt("rule1")}
- ${getTxt("rule2")}
- ${getTxt("rule3").replace("${price}", price)}
- ${getTxt("rule4")}
- ${getTxt("rule5")}

================================================================
${getTxt("generated")} ${new Date().toISOString()}
${getTxt("orderId")} ${uid.toUpperCase()}
${getTxt("uniquePaid")}`;
  } else {
    content = devFileContent
      ? `DAO MESSAGE - ${tplName} (${platform})\n================================================================\n\n${devFileContent}\n\n================================================================\n${getTxt("generated")} ${new Date().toISOString()}\n${getTxt("uniqueFree")}`
      : `DAO MESSAGE - ${tplName} (${platform})\n================================================================\n\n${getTxt("freeReady")}\n\n================================================================\n${getTxt("generated")} ${new Date().toISOString()}\n${getTxt("uniqueFree")}`;
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

// =============================================
// Theme toggle (dark / light)
// =============================================
function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute("data-theme") || "dark";
  const next = current === "dark" ? "light" : "dark";
  html.setAttribute("data-theme", next);
  localStorage.setItem("dao_theme", next);
  updateThemeIcon(next);
}

function updateThemeIcon(theme) {
  const icon = document.getElementById("themeIcon");
  icon.innerHTML = theme === "dark" ? "&#9788;" : "&#9790;";
}

function initTheme() {
  const saved = localStorage.getItem("dao_theme") || "dark";
  document.documentElement.setAttribute("data-theme", saved);
  updateThemeIcon(saved);
}

// Init
initTheme();
initLang();
renderTemplateMarket();
handleHash();
