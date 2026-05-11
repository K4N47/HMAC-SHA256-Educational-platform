/* ═══════════════════════════════════════
   i18n.js — Bilingual system EN / RU
   ═══════════════════════════════════════ */

const LANGS = {
  en: {
    // ── NAV ──────────────────────────────────────────────────────────────────
    nav_learn:"LEARN",nav_practice:"PRACTICE",nav_account:"ACCOUNT",
    nav_dashboard:"Dashboard",nav_theory:"Theory",nav_generator:"HMAC Generator",
    nav_stepviz:"Step Visualization",nav_compare:"Hash Comparison",
    nav_verify:"Verification",nav_practiceM:"Interactive Practice",
    nav_history:"History",nav_settings:"Settings",
    btn_theme:"🌙 Theme",btn_lang:"RU",

    // ── PAGE TITLES ───────────────────────────────────────────────────────────
    title_dashboard:"Dashboard",title_theory:"Theory Module",
    title_generator:"HMAC Generator",title_stepviz:"Step-by-Step Visualization",
    title_compare:"Hash Comparison",title_verify:"Verification",
    title_practice:"Interactive Practice",title_history:"History",title_settings:"Settings",

    // ── AUTH ──────────────────────────────────────────────────────────────────
    auth_welcome:"Welcome to HMAC-SHA-256",auth_subtitle:"Learn cryptography interactively",
    auth_guest:"Continue as Guest",
    auth_guest_desc:"No registration required. History won't be saved after closing the tab.",
    auth_login:"Sign In",auth_register:"Create Account",
    auth_username:"Username",auth_email:"Email",auth_password:"Password",
    auth_login_btn:"Sign In",auth_reg_btn:"Register",
    auth_have_account:"Already have an account? Sign in",auth_no_account:"No account? Register",
    auth_or:"or",
    auth_logout:"Sign Out",auth_guest_label:"Guest",
    auth_mode_guest:"Guest mode — history not saved",auth_mode_user:"Signed in as",
    auth_guest_msg:"Continuing as guest. History clears when you close the tab.",
    auth_fill:"Please fill all fields",
    auth_wrong:"Invalid username or password",
    auth_offline:"Cannot connect to server. Make sure Flask is running (python -m backend.app).",
    auth_pw_short:"Password must be at least 6 characters",
    auth_reg_fail:"Registration failed. Username or email may already be taken.",
    auth_logout_btn:"Sign Out",
    auth_logout_q:"Sign out from your account?",
    auth_signin_btn:"Sign In / Register",
    user_guest:"Guest",

    // ── ACCOUNT / SETTINGS ────────────────────────────────────────────────────
    acc_title:"Account",acc_username:"Username",acc_email:"Email",acc_since:"Member since",
    acc_logout:"Sign Out",acc_guest_title:"Guest Mode",
    acc_guest_desc:"You are browsing as a guest. Create an account to save your history and progress.",
    acc_register_now:"Create Account",
    set_account:"Account",
    set_acc_user:"Registered User",
    set_acc_stats:"Your activity",
    set_acc_guest_msg:"You are browsing as a guest. History is stored in this tab only and cleared when closed. Create an account to save progress permanently.",

    // ── DASHBOARD ─────────────────────────────────────────────────────────────
    stat_generated:"HMACs Generated",stat_verified:"Verifications Run",
    stat_practice:"Practice Score",stat_theory:"Theory Progress",
    progress_label:"📖 Learning Progress",prog_theory:"Theory",prog_gen:"Generator",prog_prac:"Practice",
    quick_start:"🚀 Quick Start",qs_theory:"📘 Start Theory",qs_generator:"🔐 Try Generator",
    qs_stepviz:"⚙️ Step Visualization",qs_practice:"🧪 Practice Mode",

    // ── THEORY ────────────────────────────────────────────────────────────────
    th_badge:"Interactive",

    th1_title:"1. What is Cryptographic Hashing?",
    th1_body:"SHA-256 is part of the SHA-2 family, designed by the NSA and standardized by NIST in 2001. It uses the Merkle–Damgård construction: the input is divided into 512-bit (64-byte) blocks, and each block updates an internal 256-bit state through 64 rounds of bitwise operations (AND, OR, XOR, rotations). The output is always exactly 256 bits — whether you hash a single letter 'a' or a 100 MB file. This fixed-size guarantee, combined with the one-way property, makes SHA-256 ideal as the core of HMAC.",
    th1_p1_title:"One-Way",th1_p1_desc:"Cannot reverse the hash to get the original input — mathematically infeasible",
    th1_p2_title:"Fixed Length",th1_p2_desc:"Always 64 hex chars (256 bits) regardless of input size",
    th1_p3_title:"Avalanche Effect",th1_p3_desc:"Flip 1 input bit → ~128 output bits change (~50%)",
    th1_p4_title:"Deterministic",th1_p4_desc:"Same input always produces the exact same hash — no randomness",
    th1_p5_title:"Collision Resistant",th1_p5_desc:"Finding two different inputs with the same hash requires ~2¹²⁸ attempts",
    th1_p6_title:"Fast Computation",th1_p6_desc:"Millions of hashes per second on modern hardware",

    th2_title:"2. What is HMAC?",
    th2_body:"HMAC (Hash-based Message Authentication Code) was invented by Mihir Bellare, Ran Canetti, and Hugo Krawczyk and published as RFC 2104 in 1997. The core problem it solves: a plain hash like SHA-256 has no key — anyone can compute it, so an attacker can re-hash a modified message. HMAC fixes this by combining the message with a secret key through a specific double-hash construction. The result is a MAC: a cryptographic tag that only someone who knows the secret key can produce or verify. HMAC provides two guarantees: integrity (the message was not modified) and authenticity (the sender knows the key).",
    th2_b1:"Without HMAC, an attacker intercepts 'Transfer: $100' and its hash, replaces it with 'Transfer: $9000', recomputes the hash, and the server has no way to detect the tampering.",
    th2_b2:"With HMAC, the server checks HMAC(key, message). The attacker cannot compute a valid HMAC for the modified message without knowing the secret key — even if they see thousands of valid message/HMAC pairs.",

    th3_title:"3. The HMAC Formula — click any term!",
    tt_kopad:"opad = 0x5C (01011100) repeated 64 times.\nXOR with key to form outer padding.\n0x36 ⊕ 0x5C = 0x6A — differ in 4 of 8 bits.",
    tt_kipad:"ipad = 0x36 (00110110) repeated 64 times.\nXOR with key to form inner padding.\nipad and opad were chosen to differ in every bit position.",
    tt_m:"m = the message you want to authenticate.\nCan be any length — SHA-256 handles variable input.",
    th3_leg1:" — SHA-256 hash function",th3_leg2:" — Key padded/truncated to 64 bytes",
    th3_leg3:" — 0x36 × 64 (inner pad)",th3_leg4:" — 0x5C × 64 (outer pad)",

    th4_title:"4. Why Two Nested Hashes?",
    th4_body:"SHA-256 uses the Merkle–Damgård construction, which is vulnerable to a length-extension attack. If HMAC were simply H(key ∥ message), an attacker who sees the resulting hash knows the internal state of SHA-256 after processing 'key ∥ message'. They can then continue hashing from that state and compute H(key ∥ message ∥ extra_data) without ever knowing the key — a complete forgery. The HMAC double-hash prevents this: the inner hash H(K'⊕ipad ∥ m) binds the message to the key, and the outer hash H(K'⊕opad ∥ inner_hash) produces a new value from an entirely different starting state. The opad-key produces a different SHA-256 internal state than the ipad-key, making the outer hash unreachable by the attacker.",

    th5_title:"5. Key Normalization — Why 64 Bytes?",
    th5_body:"SHA-256 processes data in 512-bit (64-byte) blocks — this is the natural block boundary for the compression function. HMAC requires XOR-ing the key with every byte of ipad and opad, so the key and the pads must be the same length. Example: key = 'sha256' (6 bytes) → padded to 0x73 0x68 0x61 0x32 0x35 0x36 0x00 0x00 ... 0x00 (64 bytes total). Then XOR byte-by-byte with ipad (0x36 × 64). If the key were 'very_long_key...' (> 64 bytes), SHA-256(key) = 32 bytes, then zero-padded to 64 bytes.",

    th6_title:"6. Real-World Usage of HMAC",
    th6_items:[
      "AWS Signature v4: Every AWS API request is signed with HMAC-SHA-256 using your secret access key — without it the request is rejected",
      "GitHub Webhooks: GitHub signs outgoing webhook payloads with HMAC-SHA-256 so your server can verify the request came from GitHub",
      "JWT / HS256: The most common JSON Web Token algorithm signs header+payload with HMAC-SHA-256; the server verifies before trusting any claim",
      "TLS 1.2 HMAC: Every TLS record is protected by an HMAC computed over the sequence number + record content to detect tampering in transit",
      "PBKDF2 Password Hashing: PBKDF2 calls HMAC thousands of times as a pseudo-random function to stretch a password into a secure key",
      "TOTP (Google Authenticator): Time-based one-time passwords use HMAC-SHA-1/SHA-256 with a shared secret and the current time as the message"
    ],

    th7_title:"7. XOR Operation — Binary Walkthrough",
    th7_body:"XOR (Exclusive OR) is the heart of HMAC's padding step. Two identical bits → 0. Two different bits → 1. XOR has a powerful property: it is its own inverse — (A ⊕ B) ⊕ B = A. This means XOR mixing is fully reversible. The constants ipad (0x36) and opad (0x5C) were specifically chosen so that 0x36 ⊕ 0x5C = 0x6A — they differ in 4 of 8 bit positions — guaranteeing the inner key (K' ⊕ ipad) and outer key (K' ⊕ opad) are always substantially different regardless of the actual key value.",
    th7_table_h:["Bit A","Bit B","A ⊕ B","Rule"],
    th7_table_r:[["0","0","0","same → 0"],["0","1","1","different → 1"],["1","0","1","different → 1"],["1","1","0","same → 0"]],
    th7_example:"Example: 0x6B ⊕ 0x36",
    th7_binary_a:"0x6B = 0110 1011",th7_binary_b:"0x36 = 0011 0110",th7_binary_r:"0x5D = 0101 1101  ← result",
    th7_note:"Tip: convert both bytes to 8 bits, then XOR each bit position independently. Same → 0, different → 1.",

    th8_title:"8. Timing Attacks & Constant-Time Comparison",
    th8_body:"A subtle but critical security flaw: naive string comparison (=== or strcmp) short-circuits on the first mismatch. An attacker can send thousands of forged HMACs and measure server response times with microsecond precision. If the response is 1μs faster for 'abc...' than 'xyz...', the attacker knows the first byte matches and can recover the HMAC one byte at a time with only 256 × 32 = 8,192 requests instead of 2²⁵⁶. Always use constant-time comparison — it always checks all bytes regardless of where the first mismatch occurs.",
    th8_bad:"// ❌ Vulnerable — exits early on mismatch\nif (received === computed) { ... }",
    th8_good:"// ✅ Safe — always compares all bytes\nif (crypto.timingSafeEqual(received, computed)) { ... }",
    th8_note:"Python's hmac.compare_digest() and Node's crypto.timingSafeEqual() implement constant-time comparison. Our backend's verify_hmac() uses Python's hmac.compare_digest() correctly.",

    // ── QUIZ ─────────────────────────────────────────────────────────────────
    quiz_title:"🎯 Theory Quiz — Test Your Knowledge",

    // ── GENERATOR ─────────────────────────────────────────────────────────────
    gen_badge:"RFC 2104 Compliant",gen_msg_lbl:"📝 Message",gen_key_lbl:"🔑 Secret Key",
    gen_msg_ph:"Enter your message here...",gen_key_ph:"Enter secret key...",
    gen_rnd:"🎲 Random Key",gen_btn:"🔐 Generate HMAC-SHA-256",gen_result:"✅ Generated HMAC-SHA-256",
    gen_sha_lbl:"SHA-256 hash of message only:",gen_hmac_lbl:"HMAC-SHA-256 (message + key):",
    gen_send_ver:"📤 Send to Verification",gen_see_steps:"⚙️ See Step Visualization",

    // ── STEP VIZ ─────────────────────────────────────────────────────────────
    viz_badge:"Interactive",viz_msg_lbl:"📝 Message",viz_key_lbl:"🔑 Secret Key",
    viz_start:"▶️ Start Visualization",viz_next:"Next Step →",viz_restart:"🔄 Restart",
    viz_steps:["Key Normalization","XOR with ipad","Inner Hash","XOR with opad","Final HMAC"],
    s1_title:"Step 1 — Key Normalization",
    s1_explain:"The HMAC algorithm requires the key to be exactly 64 bytes long. <strong>If the key is shorter than 64 bytes</strong>, it is padded with zero bytes (0x00). <strong>If longer than 64 bytes</strong>, it is first hashed with SHA-256, then padded.",
    s1_orig:"🔑 Original Key Bytes",s1_padded:"📦 Padded to 64 bytes",
    s1_info_pre:"Key length: ",s1_info_suf:" bytes → padded with ",s1_info_suf2:" zero bytes to reach 64",
    s2_title:"Step 2 — XOR with ipad (Inner Padding)",
    s2_explain:"ipad = 0x36 repeated 64 times. XOR every byte of the padded key K' with 0x36 to create the inner key.",
    s2_kp:"K' (padded key)",s2_ipad:"⊕ ipad (0x36 × 64)",s2_res:"= K' ⊕ ipad result",
    s3_title:"Step 3 — Inner Hash (First SHA-256)",
    s3_explain:"Concatenate (K'⊕ipad) with the message, then apply SHA-256. This binds the message to the key.",
    s3_input:"Input to SHA-256:",s3_formula:"(K' ⊕ ipad) ∥ message",s3_output:"⬇️ SHA-256 Output (Inner Hash):",
    s4_title:"Step 4 — XOR with opad (Outer Padding)",
    s4_explain:"opad = 0x5C repeated 64 times. XOR the same padded key K' with 0x5C. opad and ipad differ in every bit — ensuring inner and outer keys are completely different.",
    s4_kp:"K' (padded key)",s4_opad:"⊕ opad (0x5C × 64)",s4_res:"= K' ⊕ opad result",
    s5_title:"Step 5 — Outer Hash (Final HMAC)",
    s5_explain:"Concatenate (K'⊕opad) with the Inner Hash from Step 3, then apply SHA-256 one final time.",
    s5_formula:"(K' ⊕ opad) ∥ inner_hash",s5_output:"⬇️ Final HMAC-SHA-256:",
    s5_done:"✅ HMAC-SHA-256 Complete!",s5_done_desc:"This 256-bit value proves the message is authentic and unmodified.",

    // ── COMPARE ───────────────────────────────────────────────────────────────
    cmp_badge:"Visual",cmp_desc:"Change even one character and roughly half of the 256 bits in the hash change. This is the avalanche effect.",
    cmp_msg_a:"📝 Message A",cmp_msg_b:"📝 Message B",cmp_key:"🔑 Shared Secret Key",
    cmp_msg_a_lbl:"Message A",cmp_msg_b_lbl:"Message B (🔴 = different bits)",
    cmp_bits_lbl:"Bit pattern:",cmp_diff:"bits changed",cmp_pct:"of 256 bits",cmp_same:"bits same",

    // ── VERIFY ────────────────────────────────────────────────────────────────
    ver_badge:"Authenticity Check",
    ver_desc:"Enter the message, the secret key, and the HMAC you received. The system will recompute and compare hashes.",
    ver_msg_lbl:"📝 Message",ver_key_lbl:"🔑 Secret Key",ver_exp_lbl:"🔏 Expected HMAC-SHA-256",
    ver_msg_ph:"Message to verify...",ver_key_ph:"Secret key...",ver_exp_ph:"Paste expected HMAC here...",
    ver_btn:"🔍 Verify HMAC",ver_tv:"Load RFC Test Vector",ver_result:"Verification Result",
    ver_exp_disp:"Expected HMAC:",ver_comp_disp:"Computed HMAC:",
    ver_valid:"✅ VALID — Message is authentic and unmodified",
    ver_invalid:"❌ INVALID — HMAC does not match. Message may be altered.",

    // ── PRACTICE ─────────────────────────────────────────────────────────────
    prac_badge:"Hands-On",
    tab_xor:"1 XOR Practice",tab_drag:"2 Step Order",tab_binary:"3 Binary XOR",
    tab_quiz:"4 Multi-Choice",tab_fill:"5 Formula Fill",

    xor_title:"Challenge 1 — Manual XOR with ipad",
    xor_desc:"XOR each key byte with ipad (0x36). Enter the hex result for each byte. Example: 0x6B ⊕ 0x36 = 0x5D",
    xor_check:"✅ Check Answers",
    hint_show:"💡 Show Hint",hint_hide:"🙈 Hide Hint",
    xor_hint_body:"To XOR: convert both bytes to 8 binary bits, then compare each bit position: same → 0, different → 1. Example: 0x6B = 0110 1011, 0x36 = 0011 0110 → XOR bit-by-bit: 0101 1101 = 0x5D. Shortcut: Windows Calculator in Programmer mode — type first value, press XOR, type second value, press =.",
    xor_correct:"✅ Perfect! All XOR values correct.",xor_wrong:"❌ Not quite. Correct answers: ",

    drag_title:"Challenge 2 — Arrange HMAC Steps in Correct Order",
    drag_desc:"Drag the algorithm steps into the correct HMAC-SHA-256 execution order.",
    drag_src:"Available steps (drag from here):",drag_tgt:"Drop them in the correct order:",
    drag_check:"✅ Check Order",drag_reset:"🔄 Reset",
    drag_hint_body:"Think of HMAC as two layers. Inner layer: (1) Normalize key to 64 bytes → (2) XOR padded key with ipad (0x36) → (3) SHA-256(key_ipad ∥ message). Outer layer: (4) XOR same padded key with opad (0x5C) → (5) SHA-256(key_opad ∥ inner_hash). Step 5 is the final HMAC.",
    drag_correct:"✅ Correct! You understand the HMAC algorithm flow.",drag_wrong:"❌ Not quite. Correct order: ",

    bin_title:"Challenge 3 — Binary XOR Visualization",
    bin_desc:"Click on the result bits to toggle 0/1. Each column: top ⊕ middle = bottom (your answer).",
    bin_check:"✅ Check Answers",
    bin_hint_body:"XOR rule for each bit column independently: 0⊕0=0, 0⊕1=1, 1⊕0=1, 1⊕1=0. Look at the top row (Byte A) and middle row (Byte B) for each position. Same bits → 0. Different bits → 1. Work left to right, one column at a time.",
    bin_correct:"✅ Binary XOR mastered!",bin_wrong:"❌ Check your bits. XOR: same→0, different→1. Correct: ",

    mc_title:"Challenge 4 — Multiple Choice",mc_new:"🔄 New Question",
    mc_hint_body:"Key facts to memorize: SHA-256 block size = 512 bits = 64 bytes. ipad = 0x36 (binary: 00110110). opad = 0x5C (binary: 01011100). ipad ⊕ opad = 0x6A — they differ in 4 of 8 bits. HMAC gives integrity + authenticity but NOT confidentiality. Keys > 64 bytes are SHA-256-hashed first.",

    fill_title:"Challenge 5 — Complete the HMAC Formula",
    fill_desc:"Select the correct term for each blank in the HMAC formula.",
    fill_check:"✅ Check Formula",fill_reset:"🔄 Reset",
    fill_hint_body:"Full formula: HMAC(K, m) = H( (K'⊕opad) ∥ H( (K'⊕ipad) ∥ m ) ). Pattern: the INNER hash uses ipad, the OUTER hash uses opad. H is always SHA-256. K' is always the 64-byte normalized key. There are 2 H calls, 2 K' references, 1 ipad, 1 opad, and 1 m.",

    // ── HISTORY ───────────────────────────────────────────────────────────────
    hist_badge:"records",
    hist_search:"🔍 Search by message or hash...",
    hist_empty:"No history yet. Generate some HMACs to see them here.",
    hist_none:"No records found.",hist_gen:"🔐 Generated",hist_ver_ok:"✅ Verified",hist_ver_fail:"❌ Failed",

    // ── SETTINGS ─────────────────────────────────────────────────────────────
    set_appearance:"Appearance",set_dark:"Dark Theme",
    set_dark_desc:"Toggle between dark and light mode",
    set_light_btn:"Switch to Light",set_dark_btn:"Switch to Dark",
    set_data:"Data",set_clear:"Clear History",
    set_clear_desc:"Remove all stored hash history",set_clear_btn:"Clear All",
    set_about:"About",
    set_about_body:"HMAC-SHA-256 Educational Platform — built for users to learn and practice HMAC-SHA-256 cryptography method. All cryptographic operations performed using the Web Crypto API.",

    // ── MISC ─────────────────────────────────────────────────────────────────
    copy_ok:"Copied to clipboard!",fill_all:"Please fill all fields",
    enter_both:"Please enter both message and key",viz_fill:"Enter message and key",
    clear_q:"Clear all history?",hist_clear:"History cleared",
    computing:"Computing...",gen_ok:"HMAC generated successfully!",

    // ── DRAG STEPS ───────────────────────────────────────────────────────────
    drag_step1:"Key Normalization (K')",
    drag_step2:"XOR with ipad → K' ⊕ ipad",
    drag_step3:"Inner Hash: SHA-256(K' ⊕ ipad ∥ m)",
    drag_step4:"XOR with opad → K' ⊕ opad",
    drag_step5:"Outer Hash: SHA-256(K' ⊕ opad ∥ InnerHash) = HMAC",
  },

  ru: {
    // ── NAV ──────────────────────────────────────────────────────────────────
    nav_learn:"ОБУЧЕНИЕ",nav_practice:"ПРАКТИКА",nav_account:"АККАУНТ",
    nav_dashboard:"Дашборд",nav_theory:"Теория",nav_generator:"Генератор HMAC",
    nav_stepviz:"Пошаговая визуализация",nav_compare:"Сравнение хешей",
    nav_verify:"Проверка",nav_practiceM:"Интерактивная практика",
    nav_history:"История",nav_settings:"Настройки",
    btn_theme:"🌙 Тема",btn_lang:"EN",

    // ── PAGE TITLES ───────────────────────────────────────────────────────────
    title_dashboard:"Дашборд",title_theory:"Теоретический модуль",
    title_generator:"Генератор HMAC",title_stepviz:"Пошаговая визуализация",
    title_compare:"Сравнение хешей",title_verify:"Проверка",
    title_practice:"Интерактивная практика",title_history:"История",title_settings:"Настройки",

    // ── AUTH ──────────────────────────────────────────────────────────────────
    auth_welcome:"Добро пожаловать в HMAC-SHA-256",auth_subtitle:"Изучайте криптографию интерактивно",
    auth_guest:"Продолжить как гость",
    auth_guest_desc:"Регистрация не нужна. История не сохраняется после закрытия вкладки.",
    auth_login:"Войти",auth_register:"Создать аккаунт",
    auth_username:"Имя пользователя",auth_email:"Электронная почта",auth_password:"Пароль",
    auth_login_btn:"Войти",auth_reg_btn:"Зарегистрироваться",
    auth_have_account:"Уже есть аккаунт? Войти",auth_no_account:"Нет аккаунта? Зарегистрироваться",
    auth_or:"или",
    auth_logout:"Выйти",auth_guest_label:"Гость",
    auth_mode_guest:"Гостевой режим — история не сохраняется",auth_mode_user:"Вы вошли как",
    auth_guest_msg:"Продолжаете как гость. История очищается при закрытии вкладки.",
    auth_fill:"Пожалуйста, заполните все поля",
    auth_wrong:"Неверное имя пользователя или пароль",
    auth_offline:"Нет соединения с сервером. Убедитесь, что Flask запущен.",
    auth_pw_short:"Пароль должен содержать минимум 6 символов",
    auth_reg_fail:"Ошибка регистрации. Имя пользователя или email уже занят.",
    auth_logout_btn:"Выйти",
    auth_logout_q:"Выйти из аккаунта?",
    auth_signin_btn:"Войти / Зарегистрироваться",
    user_guest:"Гость",

    // ── ACCOUNT / SETTINGS ────────────────────────────────────────────────────
    acc_title:"Аккаунт",acc_username:"Имя пользователя",acc_email:"Электронная почта",acc_since:"Дата регистрации",
    acc_logout:"Выйти",acc_guest_title:"Гостевой режим",
    acc_guest_desc:"Вы просматриваете как гость. Создайте аккаунт, чтобы сохранять историю и прогресс.",
    acc_register_now:"Создать аккаунт",
    set_account:"Аккаунт",
    set_acc_user:"Зарегистрированный пользователь",
    set_acc_stats:"Ваша активность",
    set_acc_guest_msg:"Вы просматриваете сайт как гость. История хранится только в текущей вкладке и очищается при закрытии. Создайте аккаунт для постоянного сохранения прогресса.",

    // ── DASHBOARD ─────────────────────────────────────────────────────────────
    stat_generated:"Сгенерировано HMAC",stat_verified:"Проверок выполнено",
    stat_practice:"Очки практики",stat_theory:"Прогресс теории",
    progress_label:"📖 Прогресс обучения",prog_theory:"Теория",prog_gen:"Генератор",prog_prac:"Практика",
    quick_start:"🚀 Быстрый старт",qs_theory:"📘 Начать теорию",qs_generator:"🔐 Попробовать генератор",
    qs_stepviz:"⚙️ Пошаговая визуализация",qs_practice:"🧪 Режим практики",

    // ── THEORY ────────────────────────────────────────────────────────────────
    th_badge:"Интерактивный",

    th1_title:"1. Что такое криптографическое хеширование?",
    th1_body:"SHA-256 входит в семейство SHA-2, разработанное АНБ и стандартизованное NIST в 2001 году. Он использует конструкцию Меркла–Дамгора: входные данные делятся на 512-битные (64-байтные) блоки, каждый блок обновляет внутреннее 256-битное состояние через 64 раунда побитовых операций (AND, OR, XOR, сдвиги). Выход всегда ровно 256 бит — будь то одна буква 'a' или файл размером 100 МБ. Это фиксированный размер вместе со свойством необратимости делает SHA-256 идеальным для HMAC.",
    th1_p1_title:"Одностороннесть",th1_p1_desc:"Невозможно восстановить исходные данные из хеша — математически нецелесообразно",
    th1_p2_title:"Фиксированная длина",th1_p2_desc:"Всегда 64 шестнадцатеричных символа (256 бит) независимо от размера входа",
    th1_p3_title:"Лавинный эффект",th1_p3_desc:"Изменение 1 бита → ~128 бит выхода меняются (~50%)",
    th1_p4_title:"Детерминизм",th1_p4_desc:"Одинаковые входные данные всегда дают одинаковый хеш — никакой случайности",
    th1_p5_title:"Устойчивость к коллизиям",th1_p5_desc:"Найти два разных входа с одинаковым хешем требует ~2¹²⁸ попыток",
    th1_p6_title:"Быстрое вычисление",th1_p6_desc:"Миллионы хешей в секунду на современном железе",

    th2_title:"2. Что такое HMAC?",
    th2_body:"HMAC (код аутентификации сообщений на основе хеша) изобрели Михир Беллар, Ран Канетти и Хьюго Кравчик, опубликовавшие его как RFC 2104 в 1997 году. Проблема: простой хеш SHA-256 не имеет ключа — любой может его вычислить. Злоумышленник может изменить сообщение и пересчитать хеш. HMAC решает это, комбинируя сообщение с секретным ключом через специальную конструкцию двойного хеширования. Результат — MAC: криптографический тег, который может создать или проверить только тот, кто знает секретный ключ. HMAC даёт два гарантии: целостность (сообщение не изменено) и подлинность (отправитель знает ключ).",
    th2_b1:"Без HMAC злоумышленник перехватывает 'Перевод: 100₸' и его хеш, заменяет на 'Перевод: 9000₸', пересчитывает хеш — сервер не замечает подмены.",
    th2_b2:"С HMAC сервер проверяет HMAC(ключ, сообщение). Злоумышленник не может вычислить корректный HMAC для изменённого сообщения без секретного ключа — даже видя тысячи пар сообщение/HMAC.",

    th3_title:"3. Формула HMAC — кликни на любой элемент!",
    tt_kopad:"opad = 0x5C (01011100) повторяется 64 раза.\nXOR с ключом создаёт внешнее заполнение.\n0x36 ⊕ 0x5C = 0x6A — отличаются в 4 из 8 бит.",
    tt_kipad:"ipad = 0x36 (00110110) повторяется 64 раза.\nXOR с ключом создаёт внутреннее заполнение.\nipad и opad выбраны так, чтобы отличаться в каждой позиции бита.",
    tt_m:"m = сообщение, которое нужно аутентифицировать.\nМожет быть любой длины — SHA-256 обрабатывает переменный вход.",
    th3_leg1:" — хеш-функция SHA-256",th3_leg2:" — ключ, нормализованный до 64 байт",
    th3_leg3:" — 0x36 × 64 (внутреннее заполнение)",th3_leg4:" — 0x5C × 64 (внешнее заполнение)",

    th4_title:"4. Почему два вложенных хеша?",
    th4_body:"SHA-256 использует конструкцию Меркла–Дамгора, уязвимую к атаке расширения длины. Если бы HMAC был просто H(ключ ∥ сообщение), злоумышленник, видящий хеш, знал бы внутреннее состояние SHA-256 после обработки 'ключ ∥ сообщение'. Он мог бы продолжить хеширование из этого состояния и вычислить H(ключ ∥ сообщение ∥ дополнение) — без знания ключа. Это полная подделка. HMAC предотвращает это: внутренний хеш H(K'⊕ipad ∥ m) привязывает сообщение к ключу, внешний хеш H(K'⊕opad ∥ inner) создаёт новое значение из совершенно другого начального состояния. Ключ с opad даёт другое внутреннее состояние SHA-256, чем с ipad — внешний хеш недостижим для атакующего.",

    th5_title:"5. Нормализация ключа — почему 64 байта?",
    th5_body:"SHA-256 обрабатывает данные блоками по 512 бит (64 байта) — это естественная граница блока для функции сжатия. HMAC требует XOR ключа с каждым байтом ipad и opad, поэтому ключ и константы должны быть одинаковой длины. Пример: ключ = 'sha256' (6 байт) → дополняется до 0x73 0x68 0x61 0x32 0x35 0x36 0x00 0x00 ... 0x00 (64 байта). Затем XOR побайтово с ipad (0x36 × 64). Если ключ > 64 байт — сначала SHA-256(ключ) = 32 байта, затем дополняется до 64.",

    th6_title:"6. Применение HMAC в реальном мире",
    th6_items:[
      "AWS Signature v4: каждый запрос к AWS подписывается HMAC-SHA-256 секретным ключом доступа — без него запрос отклоняется",
      "GitHub Webhooks: GitHub подписывает исходящие webhook-данные HMAC-SHA-256, чтобы сервер мог проверить источник",
      "JWT / HS256: самый распространённый алгоритм JWT подписывает header+payload с HMAC-SHA-256; сервер проверяет перед тем как доверять данным",
      "TLS 1.2 HMAC: каждая TLS-запись защищена HMAC для обнаружения подмены при передаче",
      "PBKDF2 хеширование паролей: PBKDF2 вызывает HMAC тысячи раз как псевдослучайную функцию для растяжения пароля",
      "TOTP (Google Authenticator): одноразовые пароли на основе времени используют HMAC-SHA-1/SHA-256 с общим секретом и текущим временем"
    ],

    th7_title:"7. Операция XOR — разбор в двоичном виде",
    th7_body:"XOR (исключающее ИЛИ) — основа шага заполнения в HMAC. Одинаковые биты → 0. Разные биты → 1. XOR обладает мощным свойством: он является собственной обратной операцией — (A ⊕ B) ⊕ B = A. Это значит, смешивание через XOR полностью обратимо. Константы ipad (0x36) и opad (0x5C) выбраны специально: 0x36 ⊕ 0x5C = 0x6A — они отличаются в 4 из 8 позиций бита. Это гарантирует, что внутренний ключ (K' ⊕ ipad) и внешний ключ (K' ⊕ opad) всегда существенно различаются независимо от значения ключа.",
    th7_table_h:["Бит A","Бит B","A ⊕ B","Правило"],
    th7_table_r:[["0","0","0","одинаковые → 0"],["0","1","1","разные → 1"],["1","0","1","разные → 1"],["1","1","0","одинаковые → 0"]],
    th7_example:"Пример: 0x6B ⊕ 0x36",
    th7_binary_a:"0x6B = 0110 1011",th7_binary_b:"0x36 = 0011 0110",th7_binary_r:"0x5D = 0101 1101  ← результат",
    th7_note:"Подсказка: переведи каждый байт в 8 бит, затем XOR каждую позицию независимо. Одинаковые → 0, разные → 1.",

    th8_title:"8. Атаки по времени и сравнение за постоянное время",
    th8_body:"Критическая уязвимость: наивное сравнение строк (=== или strcmp) прерывается при первом несовпадении. Злоумышленник отправляет тысячи поддельных HMAC и измеряет время ответа с точностью до микросекунды. Если ответ на 'abc...' на 1 мкс быстрее чем на 'xyz...', значит первый байт совпал. Так можно восстановить HMAC побайтово — 256 × 32 = 8192 запроса вместо 2²⁵⁶. Всегда используй сравнение за постоянное время — оно проверяет все байты независимо от позиции первого несовпадения.",
    th8_bad:"// ❌ Уязвимо — прерывается при несовпадении\nif (received === computed) { ... }",
    th8_good:"// ✅ Безопасно — всегда сравнивает все байты\nif (crypto.timingSafeEqual(received, computed)) { ... }",
    th8_note:"hmac.compare_digest() в Python и crypto.timingSafeEqual() в Node реализуют сравнение за постоянное время. Backend нашей платформы использует hmac.compare_digest() корректно.",

    // ── QUIZ ─────────────────────────────────────────────────────────────────
    quiz_title:"🎯 Тест по теории — Проверь знания",

    // ── GENERATOR ─────────────────────────────────────────────────────────────
    gen_badge:"Совместим с RFC 2104",gen_msg_lbl:"📝 Сообщение",gen_key_lbl:"🔑 Секретный ключ",
    gen_msg_ph:"Введите ваше сообщение...",gen_key_ph:"Введите секретный ключ...",
    gen_rnd:"🎲 Случайный ключ",gen_btn:"🔐 Сгенерировать HMAC-SHA-256",gen_result:"✅ Сгенерирован HMAC-SHA-256",
    gen_sha_lbl:"Хеш SHA-256 только сообщения:",gen_hmac_lbl:"HMAC-SHA-256 (сообщение + ключ):",
    gen_send_ver:"📤 Отправить на проверку",gen_see_steps:"⚙️ Пошаговая визуализация",

    // ── STEP VIZ ─────────────────────────────────────────────────────────────
    viz_badge:"Интерактивный",viz_msg_lbl:"📝 Сообщение",viz_key_lbl:"🔑 Секретный ключ",
    viz_start:"▶️ Начать визуализацию",viz_next:"Следующий шаг →",viz_restart:"🔄 Перезапустить",
    viz_steps:["Нормализация ключа","XOR с ipad","Внутренний хеш","XOR с opad","Финальный HMAC"],
    s1_title:"Шаг 1 — Нормализация ключа",
    s1_explain:"Алгоритм HMAC требует, чтобы ключ был ровно 64 байта. <strong>Короче 64 байт</strong> — дополняется нулями. <strong>Длиннее 64 байт</strong> — сначала хешируется SHA-256, затем дополняется.",
    s1_orig:"🔑 Байты исходного ключа",s1_padded:"📦 Дополненный до 64 байт",
    s1_info_pre:"Длина ключа: ",s1_info_suf:" байт → добавлено ",s1_info_suf2:" нулевых байт до 64",
    s2_title:"Шаг 2 — XOR с ipad (Внутреннее заполнение)",
    s2_explain:"ipad = 0x36, повторяется 64 раза. XOR каждого байта дополненного ключа K' с 0x36.",
    s2_kp:"K' (дополненный ключ)",s2_ipad:"⊕ ipad (0x36 × 64)",s2_res:"= результат K' ⊕ ipad",
    s3_title:"Шаг 3 — Внутренний хеш (первый SHA-256)",
    s3_explain:"Конкатенируем (K'⊕ipad) с сообщением, затем применяем SHA-256. Это привязывает сообщение к ключу.",
    s3_input:"Вход для SHA-256:",s3_formula:"(K' ⊕ ipad) ∥ сообщение",s3_output:"⬇️ Выход SHA-256 (внутренний хеш):",
    s4_title:"Шаг 4 — XOR с opad (Внешнее заполнение)",
    s4_explain:"opad = 0x5C, повторяется 64 раза. XOR того же ключа K' с 0x5C. opad и ipad отличаются в каждой позиции бита.",
    s4_kp:"K' (дополненный ключ)",s4_opad:"⊕ opad (0x5C × 64)",s4_res:"= результат K' ⊕ opad",
    s5_title:"Шаг 5 — Внешний хеш (финальный HMAC)",
    s5_explain:"Конкатенируем (K'⊕opad) с внутренним хешем, затем применяем SHA-256 последний раз.",
    s5_formula:"(K' ⊕ opad) ∥ внутренний_хеш",s5_output:"⬇️ Финальный HMAC-SHA-256:",
    s5_done:"✅ HMAC-SHA-256 вычислен!",s5_done_desc:"Это 256-битное значение доказывает подлинность сообщения.",

    // ── COMPARE ───────────────────────────────────────────────────────────────
    cmp_badge:"Наглядный",cmp_desc:"Измените даже один символ — примерно половина из 256 бит хеша изменится. Это лавинный эффект.",
    cmp_msg_a:"📝 Сообщение A",cmp_msg_b:"📝 Сообщение B",cmp_key:"🔑 Общий секретный ключ",
    cmp_msg_a_lbl:"Сообщение A",cmp_msg_b_lbl:"Сообщение B (🔴 = другие биты)",
    cmp_bits_lbl:"Битовый паттерн:",cmp_diff:"бит изменено",cmp_pct:"из 256 бит",cmp_same:"бит совпадают",

    // ── VERIFY ────────────────────────────────────────────────────────────────
    ver_badge:"Проверка подлинности",
    ver_desc:"Введите сообщение, секретный ключ и полученный HMAC. Система пересчитает и сравнит хеши.",
    ver_msg_lbl:"📝 Сообщение",ver_key_lbl:"🔑 Секретный ключ",ver_exp_lbl:"🔏 Ожидаемый HMAC-SHA-256",
    ver_msg_ph:"Сообщение для проверки...",ver_key_ph:"Секретный ключ...",ver_exp_ph:"Вставьте ожидаемый HMAC...",
    ver_btn:"🔍 Проверить HMAC",ver_tv:"Загрузить RFC тестовый вектор",ver_result:"Результат проверки",
    ver_exp_disp:"Ожидаемый HMAC:",ver_comp_disp:"Вычисленный HMAC:",
    ver_valid:"✅ ВЕРНО — Сообщение подлинно и не изменено",
    ver_invalid:"❌ НЕВЕРНО — HMAC не совпадает. Сообщение могло быть изменено.",

    // ── PRACTICE ─────────────────────────────────────────────────────────────
    prac_badge:"Практика",
    tab_xor:"1 XOR Практика",tab_drag:"2 Порядок шагов",tab_binary:"3 Двоичный XOR",
    tab_quiz:"4 Тест",tab_fill:"5 Заполни формулу",

    xor_title:"Задание 1 — Ручной XOR с ipad",
    xor_desc:"Выполните XOR каждого байта ключа с ipad (0x36). Введите шестнадцатеричный результат. Пример: 0x6B ⊕ 0x36 = 0x5D",
    xor_check:"✅ Проверить ответы",
    hint_show:"💡 Показать подсказку",hint_hide:"🙈 Скрыть подсказку",
    xor_hint_body:"Для XOR: переведи оба байта в 8 двоичных бит, сравни каждую позицию: одинаковые → 0, разные → 1. Пример: 0x6B = 0110 1011, 0x36 = 0011 0110 → XOR побитово: 0101 1101 = 0x5D. Быстрый способ: калькулятор Windows в режиме Программист — введи первое значение, нажми XOR, введи второе, нажми =.",
    xor_correct:"✅ Отлично! Все значения XOR верны.",xor_wrong:"❌ Не совсем. Правильные ответы: ",

    drag_title:"Задание 2 — Расставь шаги HMAC в правильном порядке",
    drag_desc:"Перетащи шаги алгоритма в правильный порядок выполнения HMAC-SHA-256.",
    drag_src:"Доступные шаги (перетаскивай отсюда):",drag_tgt:"Перетащи в правильный порядок:",
    drag_check:"✅ Проверить порядок",drag_reset:"🔄 Сбросить",
    drag_hint_body:"Думай о HMAC как о двух слоях. Внутренний: (1) Нормализация ключа до 64 байт → (2) XOR ключа с ipad (0x36) → (3) SHA-256(ключ_ipad ∥ сообщение). Внешний: (4) XOR ключа с opad (0x5C) → (5) SHA-256(ключ_opad ∥ внутренний_хеш). Результат шага 5 — финальный HMAC.",
    drag_correct:"✅ Правильно! Ты понимаешь алгоритм HMAC.",drag_wrong:"❌ Не совсем. Правильный порядок: ",

    bin_title:"Задание 3 — Визуализация двоичного XOR",
    bin_desc:"Кликай на биты результата для переключения 0/1. Каждый столбец: верхний ⊕ средний = нижний (твой ответ).",
    bin_check:"✅ Проверить ответы",
    bin_hint_body:"Правило XOR для каждой позиции отдельно: 0⊕0=0, 0⊕1=1, 1⊕0=1, 1⊕1=0. Смотри на верхнюю строку (Байт A) и среднюю строку (Байт B) для каждой позиции. Одинаковые биты → 0. Разные биты → 1. Работай слева направо, по одному столбцу.",
    bin_correct:"✅ Двоичный XOR освоен!",bin_wrong:"❌ Проверь биты. XOR: одинаковые→0, разные→1. Правильно: ",

    mc_title:"Задание 4 — Тест с несколькими вариантами",mc_new:"🔄 Новый вопрос",
    mc_hint_body:"Ключевые факты: размер блока SHA-256 = 512 бит = 64 байта. ipad = 0x36 (двоично: 00110110). opad = 0x5C (двоично: 01011100). ipad ⊕ opad = 0x6A — различаются в 4 из 8 бит. HMAC даёт целостность + подлинность, но НЕ конфиденциальность. Ключи > 64 байт сначала хешируются SHA-256.",

    fill_title:"Задание 5 — Заполни формулу HMAC",
    fill_desc:"Выбери правильный термин для каждого пропуска в формуле HMAC.",
    fill_check:"✅ Проверить формулу",fill_reset:"🔄 Сбросить",
    fill_hint_body:"Полная формула: HMAC(K, m) = H( (K'⊕opad) ∥ H( (K'⊕ipad) ∥ m ) ). Внутренний хеш всегда использует ipad. Внешний — opad. H — это SHA-256. K' — ключ после нормализации (64 байта). Есть 2 вызова H, 2 ссылки K', по одному ipad, opad и m.",

    // ── HISTORY ───────────────────────────────────────────────────────────────
    hist_badge:"записей",
    hist_search:"🔍 Поиск по сообщению или хешу...",
    hist_empty:"Пока нет истории. Сгенерируйте HMAC, чтобы увидеть их здесь.",
    hist_none:"Записи не найдены.",hist_gen:"🔐 Сгенерировано",hist_ver_ok:"✅ Проверено",hist_ver_fail:"❌ Не прошло",

    // ── SETTINGS ─────────────────────────────────────────────────────────────
    set_appearance:"Внешний вид",set_dark:"Тёмная тема",
    set_dark_desc:"Переключение между тёмным и светлым режимом",
    set_light_btn:"Переключить на светлую",set_dark_btn:"Переключить на тёмную",
    set_data:"Данные",set_clear:"Очистить историю",
    set_clear_desc:"Удалить все сохранённые записи истории",set_clear_btn:"Очистить всё",
    set_about:"О платформе",
    set_about_body:"Образовательная платформа HMAC-SHA-256 — создана для изучения и практики метода криптографии HMAC-SHA-256. Все криптографические операции выполняются с помощью Web Crypto API.",

    // ── MISC ─────────────────────────────────────────────────────────────────
    copy_ok:"Скопировано в буфер обмена!",fill_all:"Пожалуйста, заполните все поля",
    enter_both:"Введите сообщение и ключ",viz_fill:"Введите сообщение и ключ",
    clear_q:"Очистить всю историю?",hist_clear:"История очищена",
    computing:"Вычисление...",gen_ok:"HMAC успешно сгенерирован!",

    // ── DRAG STEPS ───────────────────────────────────────────────────────────
    drag_step1:"Нормализация ключа (K')",
    drag_step2:"XOR с ipad → K' ⊕ ipad",
    drag_step3:"Внутренний хеш: SHA-256(K' ⊕ ipad ∥ m)",
    drag_step4:"XOR с opad → K' ⊕ opad",
    drag_step5:"Внешний хеш: SHA-256(K' ⊕ opad ∥ InnerHash) = HMAC",
  }
};

// ── LANGUAGE ENGINE ───────────────────────────────────────────────────────────
let currentLang = localStorage.getItem('hmac_lang') || 'en';

function t(key) {
  return (LANGS[currentLang] && LANGS[currentLang][key]) || LANGS['en'][key] || key;
}
function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('hmac_lang', lang);
  applyTranslations();
}
function toggleLang() { setLang(currentLang === 'en' ? 'ru' : 'en'); }

// ── APPLY TRANSLATIONS ────────────────────────────────────────────────────────
function applyTranslations() {
  // Static data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = t(key);
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = val;
    else el.textContent = val;
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    el.innerHTML = t(el.getAttribute('data-i18n-html'));
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
  });

  // Lang button
  const btn = document.getElementById('lang-btn');
  if (btn) btn.textContent = t('btn_lang');

  // Dynamic lists and tables
  updateTheoryLists();
  renderXORTable();

  // ── FIX Q1: Re-render language-dependent dynamic content ──────────────────
  // Theory quiz questions must refresh when language changes
  if (typeof loadTheoryQuiz === 'function') loadTheoryQuiz();
  // Practice multiple-choice question
  if (typeof loadMCQuestion === 'function') loadMCQuestion();
  // Drag-and-drop items (step labels change language)
  if (typeof resetDrag === 'function') resetDrag();
}

// ── THEORY HELPER FUNCTIONS ───────────────────────────────────────────────────
function updateTheoryLists() {
  const list6 = document.getElementById('th6-list');
  if (list6) {
    const items = t('th6_items');
    if (Array.isArray(items)) {
      list6.innerHTML = items.map(item =>
        `<li style="margin-bottom:10px;color:var(--muted);font-size:14px;line-height:1.6">${item}</li>`
      ).join('');
    }
  }
}

function renderXORTable() {
  const tbl = document.getElementById('th7-xor-table');
  if (!tbl) return;
  const headers = t('th7_table_h');
  const rows    = t('th7_table_r');
  if (!Array.isArray(headers) || !Array.isArray(rows)) return;
  const hRow  = `<tr>${headers.map(h => `<th style="padding:8px 14px;background:var(--hover);border:1px solid var(--border);font-size:13px">${h}</th>`).join('')}</tr>`;
  const bRows = rows.map(r =>
    `<tr>${r.map((c, i) =>
      `<td style="padding:7px 14px;border:1px solid var(--border);text-align:center;font-family:monospace;font-size:13px;color:${i===2?'var(--accent)':i===3?'var(--muted)':'var(--text)'}">${c}</td>`
    ).join('')}</tr>`
  ).join('');
  tbl.innerHTML = `<thead>${hRow}</thead><tbody>${bRows}</tbody>`;
}

// ── EXPORTS ───────────────────────────────────────────────────────────────────
window.t = t;
window.setLang = setLang;
window.toggleLang = toggleLang;
window.applyTranslations = applyTranslations;
window.renderXORTable = renderXORTable;
Object.defineProperty(window, 'currentLang', {
  get: () => currentLang,
  set: v  => { currentLang = v; }
});
