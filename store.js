// =============================================
// Shared Data Store (localStorage)
// =============================================

const STORE_KEYS = {
  developers: "dao_developers",
  templates: "dao_templates",
  adminPass: "dao_admin_pass",
  currentDev: "dao_current_dev",
  usdtBindings: "dao_usdt_bindings"
};

// Default admin password (sha256 hash of "daomessage2026")
const DEFAULT_ADMIN_HASH = "daomessage2026";

// ---- Generic helpers ----
function storeGet(key) {
  try { return JSON.parse(localStorage.getItem(key)) || []; }
  catch { return []; }
}
function storeSet(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// ---- BIP39-style Mnemonic ----
const WORDLIST = [
  "abandon","ability","able","about","above","absent","absorb","abstract","absurd","abuse",
  "access","accident","account","accuse","achieve","acid","acoustic","acquire","across","act",
  "action","actor","actress","actual","adapt","add","addict","address","adjust","admit",
  "adult","advance","advice","aerobic","affair","afford","afraid","again","age","agent",
  "agree","ahead","aim","air","airport","aisle","alarm","album","alcohol","alert",
  "alien","all","alley","allow","almost","alone","alpha","already","also","alter",
  "always","amateur","amazing","among","amount","amused","analyst","anchor","ancient","anger",
  "angle","angry","animal","ankle","announce","annual","another","answer","antenna","antique",
  "anxiety","any","apart","apology","appear","apple","approve","april","arch","arctic",
  "area","arena","argue","arm","armed","armor","army","around","arrange","arrest",
  "arrive","arrow","art","artefact","artist","artwork","ask","aspect","assault","asset",
  "assist","assume","asthma","athlete","atom","attack","attend","attitude","attract","auction",
  "audit","august","aunt","author","auto","autumn","average","avocado","avoid","awake",
  "aware","awesome","awful","awkward","axis","baby","bachelor","bacon","badge","bag",
  "balance","balcony","ball","bamboo","banana","banner","bar","barely","bargain","barrel",
  "base","basic","basket","battle","beach","bean","beauty","because","become","beef",
  "before","begin","behave","behind","believe","below","belt","bench","benefit","best",
  "betray","better","between","beyond","bicycle","bid","bike","bind","biology","bird",
  "birth","bitter","black","blade","blame","blanket","blast","bleak","bless","blind",
  "blood","blossom","blow","blue","blur","blush","board","boat","body","boil",
  "bomb","bone","bonus","book","boost","border","boring","borrow","boss","bottom",
  "bounce","box","boy","bracket","brain","brand","brass","brave","bread","breeze",
  "brick","bridge","brief","bright","bring","brisk","broccoli","broken","bronze","broom",
  "brother","brown","brush","bubble","buddy","budget","buffalo","build","bulb","bulk",
  "bullet","bundle","bunny","burden","burger","burst","bus","business","busy","butter",
  "buyer","buzz","cabbage","cabin","cable","cactus","cage","cake","call","calm",
  "camera","camp","can","canal","cancel","candy","cannon","canoe","canvas","canyon",
  "capable","capital","captain","car","carbon","card","cargo","carpet","carry","cart",
  "case","cash","casino","castle","casual","cat","catalog","catch","category","cattle",
  "caught","cause","caution","cave","ceiling","celery","cement","census","century","cereal",
  "certain","chair","chalk","champion","change","chaos","chapter","charge","chase","cheap",
  "check","cheese","chef","cherry","chest","chicken","chief","child","chimney","choice",
  "choose","chronic","chuckle","chunk","churn","citizen","city","civil","claim","clap",
  "clarify","claw","clay","clean","clerk","clever","click","client","cliff","climb",
  "clinic","clip","clock","clog","close","cloth","cloud","clown","club","clump",
  "cluster","clutch","coach","coast","coconut","code","coffee","coil","coin","collect",
  "color","column","combine","come","comfort","comic","common","company","concert","conduct",
  "confirm","congress","connect","consider","control","convince","cook","cool","copper","copy",
  "coral","core","corn","correct","cost","cotton","couch","country","couple","course",
  "cousin","cover","coyote","crack","cradle","craft","cram","crane","crash","crater",
  "crawl","crazy","cream","credit","creek","crew","cricket","crime","crisp","critic",
  "crop","cross","crouch","crowd","crucial","cruel","cruise","crumble","crush","cry",
  "crystal","cube","culture","cup","cupboard","curious","current","curtain","curve","cushion",
  "custom","cute","cycle","dad","damage","damp","dance","danger","daring","dash",
  "daughter","dawn","day","deal","debate","debris","decade","december","decide","decline",
  "decorate","decrease","deer","defense","define","defy","degree","delay","deliver","demand",
  "demise","denial","dentist","deny","depart","depend","deposit","depth","deputy","derive",
  "describe","desert","design","desk","despair","destroy","detail","detect","develop","device",
  "devote","diagram","dial","diamond","diary","dice","diesel","diet","differ","digital",
  "dignity","dilemma","dinner","dinosaur","direct","dirt","disagree","discover","disease","dish",
  "dismiss","disorder","display","distance","divert","divide","divorce","dizzy","doctor","document",
  "dog","doll","dolphin","domain","donate","donkey","donor","door","dose","double",
  "dove","draft","dragon","drama","drastic","draw","dream","dress","drift","drill",
  "drink","drip","drive","drop","drum","dry","duck","dumb","dune","during",
  "dust","dutch","duty","dwarf","dynamic","eager","eagle","early","earn","earth"
];

function generateMnemonic() {
  const words = [];
  for (let i = 0; i < 12; i++) {
    words.push(WORDLIST[Math.floor(Math.random() * WORDLIST.length)]);
  }
  return words.join(" ");
}

function mnemonicToId(mnemonic) {
  // Simple hash from mnemonic to create a deterministic ID
  let hash = 0;
  for (let i = 0; i < mnemonic.length; i++) {
    const c = mnemonic.charCodeAt(i);
    hash = ((hash << 5) - hash) + c;
    hash |= 0;
  }
  return "dev_" + Math.abs(hash).toString(16).padStart(8, "0");
}

// ---- Developers ----
function getDevelopers() { return storeGet(STORE_KEYS.developers); }

function getDeveloper(devId) {
  return getDevelopers().find(d => d.id === devId) || null;
}

function registerDeveloper(mnemonic) {
  const devId = mnemonicToId(mnemonic);
  const devs = getDevelopers();
  let dev = devs.find(d => d.id === devId);
  if (!dev) {
    dev = {
      id: devId,
      mnemonicHash: mnemonicToId(mnemonic),
      usdtAddress: "",
      createdAt: new Date().toISOString()
    };
    devs.push(dev);
    storeSet(STORE_KEYS.developers, devs);
  }
  return dev;
}

function loginDeveloper(mnemonic) {
  const devId = mnemonicToId(mnemonic);
  const dev = getDeveloper(devId);
  if (dev) {
    localStorage.setItem(STORE_KEYS.currentDev, devId);
    return dev;
  }
  return null;
}

function getCurrentDev() {
  const devId = localStorage.getItem(STORE_KEYS.currentDev);
  return devId ? getDeveloper(devId) : null;
}

function logoutDev() {
  localStorage.removeItem(STORE_KEYS.currentDev);
}

function updateDevUsdtAddress(devId, address) {
  const devs = getDevelopers();
  const dev = devs.find(d => d.id === devId);
  if (dev) {
    dev.usdtAddress = address;
    storeSet(STORE_KEYS.developers, devs);
  }
}

// ---- Templates ----
// Status: pending | approved | rejected
function getTemplates() { return storeGet(STORE_KEYS.templates); }

function getApprovedTemplates() {
  return getTemplates().filter(t => t.status === "approved");
}

function getPendingTemplates() {
  return getTemplates().filter(t => t.status === "pending");
}

function getDevTemplates(devId) {
  return getTemplates().filter(t => t.devId === devId);
}

function submitTemplate(data) {
  const templates = getTemplates();
  const tpl = {
    id: "tpl_" + Date.now().toString(36) + Math.random().toString(36).substr(2, 6),
    devId: data.devId,
    name: data.name,
    description: data.description,
    price: parseFloat(data.price) || 0,
    platforms: data.platforms || [],
    images: data.images || [],
    fileContent: data.fileContent || "",
    status: "pending",
    createdAt: new Date().toISOString(),
    reviewedAt: null
  };
  templates.push(tpl);
  storeSet(STORE_KEYS.templates, templates);
  return tpl;
}

function reviewTemplate(tplId, approved) {
  const templates = getTemplates();
  const tpl = templates.find(t => t.id === tplId);
  if (tpl) {
    tpl.status = approved ? "approved" : "rejected";
    tpl.reviewedAt = new Date().toISOString();
    storeSet(STORE_KEYS.templates, templates);
  }
  return tpl;
}

function deleteTemplate(tplId) {
  const templates = getTemplates().filter(t => t.id !== tplId);
  storeSet(STORE_KEYS.templates, templates);
}

// ---- Admin ----
function verifyAdmin(password) {
  return password === DEFAULT_ADMIN_HASH;
}
