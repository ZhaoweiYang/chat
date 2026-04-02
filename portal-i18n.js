// Portal multilingual translations
const portalI18n = {
  zh: {
    // Nav
    nav_home: "首页", nav_admin: "管理端", nav_dev: "开发者",
    // Developer Auth
    dev_title: "开发者平台", tab_register: "注册", tab_login: "登录",
    register_hint: "您的身份由12个助记词创建。请安全保存——这是您访问账户的唯一方式。",
    gen_new: "生成新助记词", create_account: "创建账户",
    login_hint: "输入您的12个助记词以访问开发者账户。",
    login_placeholder: "助记词1 助记词2 助记词3 ...", btn_login: "登录",
    invalid_mnemonic: "助记词无效。",
    // Dashboard
    dash_title: "开发者后台", btn_logout: "退出登录",
    usdt_title: "USDT 结算地址", usdt_placeholder: "TRC-20 USDT 地址", btn_save: "保存",
    saved: "已保存！",
    // Submit template
    submit_title: "提交新模板",
    lbl_name: "模板名称", ph_name: "例如 SecureChat Pro",
    lbl_desc: "描述", ph_desc: "这个模板的功能是什么？",
    lbl_preview_img: "效果预览（最多9张图片）",
    lbl_file: "模板文档（.txt）", ph_file: "点击或拖拽上传 .txt 文件", err_file: "请上传模板文档。", err_file_type: "仅支持 .txt 文件",
    lbl_price: "价格（USD，0 = 免费）", lbl_platforms: "适用平台",
    btn_submit: "提交审核",
    lbl_platform: "适用平台（单选）",
    err_name: "请输入模板名称。", err_desc: "请输入描述。", err_platform: "请先选择适用平台。",
    submit_ok: "模板已提交审核！",
    // My templates
    my_tpl_title: "我的模板", no_tpl: "暂无提交的模板。",
    status_approved: "已通过", status_rejected: "已拒绝", status_pending: "审核中",
    btn_delete: "删除", free: "免费",
    // Admin
    admin_title: "管理平台", admin_dash: "管理后台",
    admin_pass_label: "管理员密码", admin_pass_ph: "输入密码",
    wrong_pass: "密码错误。",
    stat_pending: "待审核", stat_approved: "已通过", stat_rejected: "已拒绝", stat_devs: "开发者",
    pending_title: "待审核模板", no_pending: "暂无待审核模板。",
    all_tpl_title: "所有模板", no_tpl_found: "未找到模板。",
    filter_all: "全部", filter_approved: "已通过", filter_rejected: "已拒绝", filter_pending: "待审核",
    btn_approve: "通过", btn_reject: "拒绝",
    preview_link: "预览"
  },
  en: {
    nav_home: "Home", nav_admin: "Admin", nav_dev: "Developer",
    dev_title: "Developer Portal", tab_register: "Register", tab_login: "Login",
    register_hint: "Your identity is created from a 12-word mnemonic phrase. Save it securely — it is your only way to access your account.",
    gen_new: "Generate New Phrase", create_account: "Create Account",
    login_hint: "Enter your 12-word mnemonic phrase to access your developer account.",
    login_placeholder: "word1 word2 word3 ...", btn_login: "Login",
    invalid_mnemonic: "Invalid mnemonic.",
    dash_title: "Developer Dashboard", btn_logout: "Logout",
    usdt_title: "USDT Settlement Address", usdt_placeholder: "TRC-20 USDT Address", btn_save: "Save",
    saved: "Saved!",
    submit_title: "Submit New Template",
    lbl_name: "Template Name", ph_name: "e.g. SecureChat Pro",
    lbl_desc: "Description", ph_desc: "What does this template do?",
    lbl_preview_img: "Preview Images (max 9)",
    lbl_file: "Template Document (.txt)", ph_file: "Click or drag to upload .txt file", err_file: "Please upload a template document.", err_file_type: "Only .txt files are supported",
    lbl_price: "Price (USD, 0 = free)", lbl_platforms: "Platforms",
    btn_submit: "Submit for Review",
    lbl_platform: "Platform (select one)",
    err_name: "Please enter a template name.", err_desc: "Please enter a description.", err_platform: "Please select a platform first.",
    submit_ok: "Template submitted for review!",
    my_tpl_title: "My Templates", no_tpl: "No templates submitted yet.",
    status_approved: "Approved", status_rejected: "Rejected", status_pending: "Pending Review",
    btn_delete: "Delete", free: "Free",
    admin_title: "Admin Portal", admin_dash: "Admin Dashboard",
    admin_pass_label: "Admin Password", admin_pass_ph: "Enter password",
    wrong_pass: "Wrong password.",
    stat_pending: "Pending", stat_approved: "Approved", stat_rejected: "Rejected", stat_devs: "Developers",
    pending_title: "Pending Reviews", no_pending: "No pending templates.",
    all_tpl_title: "All Templates", no_tpl_found: "No templates found.",
    filter_all: "All", filter_approved: "Approved", filter_rejected: "Rejected", filter_pending: "Pending",
    btn_approve: "Approve", btn_reject: "Reject",
    preview_link: "Preview"
  },
  fr: {
    nav_home: "Accueil", nav_admin: "Admin", nav_dev: "Développeur",
    dev_title: "Portail Développeur", tab_register: "Inscription", tab_login: "Connexion",
    register_hint: "Votre identité est créée à partir d'une phrase mnémonique de 12 mots. Conservez-la en sécurité — c'est votre seul moyen d'accéder à votre compte.",
    gen_new: "Générer une nouvelle phrase", create_account: "Créer un compte",
    login_hint: "Entrez votre phrase mnémonique de 12 mots pour accéder à votre compte développeur.",
    login_placeholder: "mot1 mot2 mot3 ...", btn_login: "Connexion",
    invalid_mnemonic: "Phrase mnémonique invalide.",
    dash_title: "Tableau de bord", btn_logout: "Déconnexion",
    usdt_title: "Adresse de règlement USDT", usdt_placeholder: "Adresse USDT TRC-20", btn_save: "Enregistrer",
    saved: "Enregistré !",
    submit_title: "Soumettre un nouveau modèle",
    lbl_name: "Nom du modèle", ph_name: "ex. SecureChat Pro",
    lbl_desc: "Description", ph_desc: "Que fait ce modèle ?",
    lbl_preview_img: "Aperçu (9 images max)",
    lbl_file: "Document modèle (.txt)", ph_file: "Cliquez ou glissez pour télécharger un fichier .txt", err_file: "Veuillez télécharger un document.", err_file_type: "Seuls les fichiers .txt sont acceptés",
    lbl_price: "Prix (USD, 0 = gratuit)", lbl_platforms: "Plateformes",
    btn_submit: "Soumettre pour examen",
    lbl_platform: "Plateforme (sélectionnez une)",
    err_name: "Veuillez entrer un nom.", err_desc: "Veuillez entrer une description.", err_platform: "Veuillez d'abord sélectionner une plateforme.",
    submit_ok: "Modèle soumis pour examen !",
    my_tpl_title: "Mes modèles", no_tpl: "Aucun modèle soumis.",
    status_approved: "Approuvé", status_rejected: "Rejeté", status_pending: "En attente",
    btn_delete: "Supprimer", free: "Gratuit",
    admin_title: "Portail Admin", admin_dash: "Tableau de bord Admin",
    admin_pass_label: "Mot de passe admin", admin_pass_ph: "Entrez le mot de passe",
    wrong_pass: "Mot de passe incorrect.",
    stat_pending: "En attente", stat_approved: "Approuvé", stat_rejected: "Rejeté", stat_devs: "Développeurs",
    pending_title: "Examens en attente", no_pending: "Aucun modèle en attente.",
    all_tpl_title: "Tous les modèles", no_tpl_found: "Aucun modèle trouvé.",
    filter_all: "Tous", filter_approved: "Approuvé", filter_rejected: "Rejeté", filter_pending: "En attente",
    btn_approve: "Approuver", btn_reject: "Rejeter",
    preview_link: "Aperçu"
  },
  ru: {
    nav_home: "Главная", nav_admin: "Админ", nav_dev: "Разработчик",
    dev_title: "Портал разработчика", tab_register: "Регистрация", tab_login: "Вход",
    register_hint: "Ваша личность создаётся из мнемонической фразы из 12 слов. Сохраните её надёжно — это единственный способ доступа к вашему аккаунту.",
    gen_new: "Сгенерировать новую фразу", create_account: "Создать аккаунт",
    login_hint: "Введите мнемоническую фразу из 12 слов для доступа к аккаунту разработчика.",
    login_placeholder: "слово1 слово2 слово3 ...", btn_login: "Войти",
    invalid_mnemonic: "Недействительная мнемоническая фраза.",
    dash_title: "Панель разработчика", btn_logout: "Выйти",
    usdt_title: "Адрес для расчётов USDT", usdt_placeholder: "USDT TRC-20 адрес", btn_save: "Сохранить",
    saved: "Сохранено!",
    submit_title: "Отправить новый шаблон",
    lbl_name: "Название шаблона", ph_name: "напр. SecureChat Pro",
    lbl_desc: "Описание", ph_desc: "Что делает этот шаблон?",
    lbl_preview_img: "Превью (макс. 9 изображений)",
    lbl_file: "Документ шаблона (.txt)", ph_file: "Нажмите или перетащите файл .txt", err_file: "Загрузите документ шаблона.", err_file_type: "Поддерживаются только файлы .txt",
    lbl_price: "Цена (USD, 0 = бесплатно)", lbl_platforms: "Платформы",
    btn_submit: "Отправить на проверку",
    lbl_platform: "Платформа (выберите одну)",
    err_name: "Введите название шаблона.", err_desc: "Введите описание.", err_platform: "Сначала выберите платформу.",
    submit_ok: "Шаблон отправлен на проверку!",
    my_tpl_title: "Мои шаблоны", no_tpl: "Шаблоны ещё не отправлены.",
    status_approved: "Одобрен", status_rejected: "Отклонён", status_pending: "На проверке",
    btn_delete: "Удалить", free: "Бесплатно",
    admin_title: "Портал администратора", admin_dash: "Панель администратора",
    admin_pass_label: "Пароль администратора", admin_pass_ph: "Введите пароль",
    wrong_pass: "Неверный пароль.",
    stat_pending: "На проверке", stat_approved: "Одобрено", stat_rejected: "Отклонено", stat_devs: "Разработчики",
    pending_title: "Ожидающие проверки", no_pending: "Нет шаблонов на проверке.",
    all_tpl_title: "Все шаблоны", no_tpl_found: "Шаблоны не найдены.",
    filter_all: "Все", filter_approved: "Одобрено", filter_rejected: "Отклонено", filter_pending: "На проверке",
    btn_approve: "Одобрить", btn_reject: "Отклонить",
    preview_link: "Превью"
  },
  pt: {
    nav_home: "Início", nav_admin: "Admin", nav_dev: "Desenvolvedor",
    dev_title: "Portal do Desenvolvedor", tab_register: "Registrar", tab_login: "Entrar",
    register_hint: "Sua identidade é criada a partir de uma frase mnemônica de 12 palavras. Salve-a com segurança — é a única forma de acessar sua conta.",
    gen_new: "Gerar nova frase", create_account: "Criar conta",
    login_hint: "Digite sua frase mnemônica de 12 palavras para acessar sua conta de desenvolvedor.",
    login_placeholder: "palavra1 palavra2 palavra3 ...", btn_login: "Entrar",
    invalid_mnemonic: "Frase mnemônica inválida.",
    dash_title: "Painel do Desenvolvedor", btn_logout: "Sair",
    usdt_title: "Endereço de liquidação USDT", usdt_placeholder: "Endereço USDT TRC-20", btn_save: "Salvar",
    saved: "Salvo!",
    submit_title: "Enviar novo modelo",
    lbl_name: "Nome do modelo", ph_name: "ex. SecureChat Pro",
    lbl_desc: "Descrição", ph_desc: "O que este modelo faz?",
    lbl_preview_img: "Pré-visualização (máx. 9 imagens)",
    lbl_file: "Documento do modelo (.txt)", ph_file: "Clique ou arraste para enviar arquivo .txt", err_file: "Envie um documento de modelo.", err_file_type: "Apenas arquivos .txt são aceitos",
    lbl_price: "Preço (USD, 0 = grátis)", lbl_platforms: "Plataformas",
    btn_submit: "Enviar para revisão",
    lbl_platform: "Plataforma (selecione uma)",
    err_name: "Digite o nome do modelo.", err_desc: "Digite uma descrição.", err_platform: "Selecione uma plataforma primeiro.",
    submit_ok: "Modelo enviado para revisão!",
    my_tpl_title: "Meus modelos", no_tpl: "Nenhum modelo enviado.",
    status_approved: "Aprovado", status_rejected: "Rejeitado", status_pending: "Em análise",
    btn_delete: "Excluir", free: "Grátis",
    admin_title: "Portal Admin", admin_dash: "Painel Admin",
    admin_pass_label: "Senha do admin", admin_pass_ph: "Digite a senha",
    wrong_pass: "Senha incorreta.",
    stat_pending: "Pendente", stat_approved: "Aprovado", stat_rejected: "Rejeitado", stat_devs: "Desenvolvedores",
    pending_title: "Revisões pendentes", no_pending: "Nenhum modelo pendente.",
    all_tpl_title: "Todos os modelos", no_tpl_found: "Nenhum modelo encontrado.",
    filter_all: "Todos", filter_approved: "Aprovado", filter_rejected: "Rejeitado", filter_pending: "Pendente",
    btn_approve: "Aprovar", btn_reject: "Rejeitar",
    preview_link: "Prévia"
  },
  es: {
    nav_home: "Inicio", nav_admin: "Admin", nav_dev: "Desarrollador",
    dev_title: "Portal de Desarrollador", tab_register: "Registrarse", tab_login: "Iniciar sesión",
    register_hint: "Su identidad se crea a partir de una frase mnemónica de 12 palabras. Guárdela de forma segura — es su única forma de acceder a su cuenta.",
    gen_new: "Generar nueva frase", create_account: "Crear cuenta",
    login_hint: "Ingrese su frase mnemónica de 12 palabras para acceder a su cuenta de desarrollador.",
    login_placeholder: "palabra1 palabra2 palabra3 ...", btn_login: "Iniciar sesión",
    invalid_mnemonic: "Frase mnemónica inválida.",
    dash_title: "Panel del Desarrollador", btn_logout: "Cerrar sesión",
    usdt_title: "Dirección de liquidación USDT", usdt_placeholder: "Dirección USDT TRC-20", btn_save: "Guardar",
    saved: "¡Guardado!",
    submit_title: "Enviar nueva plantilla",
    lbl_name: "Nombre de plantilla", ph_name: "ej. SecureChat Pro",
    lbl_desc: "Descripción", ph_desc: "¿Qué hace esta plantilla?",
    lbl_preview_img: "Vista previa (máx. 9 imágenes)",
    lbl_file: "Documento de plantilla (.txt)", ph_file: "Haga clic o arrastre para subir archivo .txt", err_file: "Suba un documento de plantilla.", err_file_type: "Solo se aceptan archivos .txt",
    lbl_price: "Precio (USD, 0 = gratis)", lbl_platforms: "Plataformas",
    btn_submit: "Enviar para revisión",
    lbl_platform: "Plataforma (seleccione una)",
    err_name: "Ingrese el nombre de la plantilla.", err_desc: "Ingrese una descripción.", err_platform: "Seleccione una plataforma primero.",
    submit_ok: "¡Plantilla enviada para revisión!",
    my_tpl_title: "Mis plantillas", no_tpl: "No hay plantillas enviadas.",
    status_approved: "Aprobada", status_rejected: "Rechazada", status_pending: "En revisión",
    btn_delete: "Eliminar", free: "Gratis",
    admin_title: "Portal Admin", admin_dash: "Panel Admin",
    admin_pass_label: "Contraseña de admin", admin_pass_ph: "Ingrese la contraseña",
    wrong_pass: "Contraseña incorrecta.",
    stat_pending: "Pendiente", stat_approved: "Aprobado", stat_rejected: "Rechazado", stat_devs: "Desarrolladores",
    pending_title: "Revisiones pendientes", no_pending: "No hay plantillas pendientes.",
    all_tpl_title: "Todas las plantillas", no_tpl_found: "No se encontraron plantillas.",
    filter_all: "Todas", filter_approved: "Aprobadas", filter_rejected: "Rechazadas", filter_pending: "Pendientes",
    btn_approve: "Aprobar", btn_reject: "Rechazar",
    preview_link: "Vista previa"
  }
};

// Get portal translation
let portalLang = localStorage.getItem("chat_lang") || "zh";

function pt(key) {
  return (portalI18n[portalLang] && portalI18n[portalLang][key]) || portalI18n.en[key] || key;
}

function switchPortalLang(lang) {
  portalLang = lang;
  localStorage.setItem("chat_lang", lang);
  document.documentElement.lang = lang;
  // Update data-pt attributes
  document.querySelectorAll("[data-pt]").forEach(el => {
    el.textContent = pt(el.getAttribute("data-pt"));
  });
  document.querySelectorAll("[data-pt-ph]").forEach(el => {
    el.placeholder = pt(el.getAttribute("data-pt-ph"));
  });
}

function initPortalLang() {
  const saved = localStorage.getItem("chat_lang");
  if (saved && portalI18n[saved]) portalLang = saved;
  const sel = document.getElementById("portalLangSelect");
  if (sel) sel.value = portalLang;
  switchPortalLang(portalLang);
}
