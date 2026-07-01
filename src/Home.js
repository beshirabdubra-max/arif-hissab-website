import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase-config';

/* ─── Design tokens ─────────────────────────────────────────────── */
const C = {
  navy:       '#0B1629',
  navyCard:   '#152035',
  navyDeep:   '#080f1c',
  navyBorder: '#1e3050',
  blue:       '#3B6EF0',
  green:      '#00E096',
  gold:       '#F5C842',
  gray:       '#8892a4',
  grayDim:    '#5a6880',
  white:      '#ffffff',
};

/* ─── Feature cards data ─────────────────────────────────────────── */
const FEATURES = [
  {
    icon: '📊',
    en: 'Accounting',
    am: 'ሂሳብ አስተዳደር',
    descEn: 'Complete double-entry bookkeeping tailored for Ethiopian business standards.',
    descAm: 'ለኢትዮጵያ ንግድ ደረጃዎች የተዘጋጀ ሙሉ ሂሳብ አስተዳደር።',
    accent: C.blue,
  },
  {
    icon: '🧾',
    en: 'Invoicing',
    am: 'ደረሰኝ',
    descEn: 'Professional bilingual invoices in seconds — English & Amharic.',
    descAm: 'ሙያዊ ሁለት ቋንቋ ደረሰኞች በሰከንዶች ውስጥ።',
    accent: C.green,
  },
  {
    icon: '💳',
    en: 'Expense Tracking',
    am: 'ወጪ ክትትል',
    descEn: 'Track every birr with categories, receipts, and smart rules.',
    descAm: 'እያንዳንዱ ብር በምድቦች እና ደረሰኞች ይከታተሉ።',
    accent: C.gold,
  },
  {
    icon: '📈',
    en: 'Reports & Analytics',
    am: 'ሪፖርት እና ትንታኔ',
    descEn: 'Real-time P&L, cash flow, and balance sheet in both languages.',
    descAm: 'ሪልታይም ሪፖርቶች በሁለቱ ቋንቋዎች።',
    accent: C.blue,
  },
  {
    icon: '💱',
    en: 'Multi-Currency',
    am: 'ብዙ ምንዛሬ',
    descEn: 'ETB, USD, EUR and 50+ currencies with live exchange rates.',
    descAm: 'ብር፣ ዶላር እና 50+ ምንዛሬዎች ቀጥታ ምንዛሬ።',
    accent: C.green,
  },
  {
    icon: '☁️',
    en: 'Cloud Sync',
    am: 'ደመና ማስተባበሪያ',
    descEn: 'Access your data on any device, anywhere, any time.',
    descAm: 'ማንኛውም ጊዜ ማንኛውም ቦታ ይድረሱ።',
    accent: C.gold,
  },
];

/* ─── Pricing plan data ──────────────────────────────────────────── */
const PLANS = [
  {
    en: 'Basic',
    am: 'መሰረታዊ',
    descEn: 'Perfect for freelancers & small shops',
    descAm: 'ለነጻ ሰራተኞች እና ትናንሽ ሱቆች',
    items: [
      '50 invoices / month · 50 ደረሰኝ/ወር',
      'Expense tracking · ወጪ ክትትል',
      'Standard reports · ደረጃ ሪፖርቶች',
      'Email support · ኢሜይል ድጋፍ',
      '1 user · 1 ተጠቃሚ',
    ],
    popular: false,
    ctaEn: 'Get Started',
    ctaAm: 'ጀምር',
    btnClass: 'ah-btn-outline-blue',
    accent: C.blue,
  },
  {
    en: 'Business',
    am: 'ንግድ',
    descEn: 'For growing businesses that need more power',
    descAm: 'ለሚያድጉ ንግዶች ተጨማሪ ባህሪያት',
    items: [
      'Unlimited invoices · ያልተወሰነ ደረሰኝ',
      'Advanced tracking · የተሻሻለ ክትትል',
      'Full analytics suite · ሙሉ ትንታኔ',
      'Priority support · ቅድሚያ ድጋፍ',
      'Up to 5 users · 5 ተጠቃሚዎች',
    ],
    popular: true,
    ctaEn: 'Get Started',
    ctaAm: 'ጀምር',
    btnClass: 'ah-btn-green',
    accent: C.green,
  },
  {
    en: 'Enterprise',
    am: 'ኢንተርፕራይዝ',
    descEn: 'Custom solutions for large organizations',
    descAm: 'ለትልልቅ ድርጅቶች ብጁ መፍትሄዎች',
    items: [
      'Everything in Business · ሁሉም ባህሪያት',
      'Custom integrations · ብጁ ውህደቶች',
      'Dedicated account manager · አስተዳዳሪ',
      '24/7 phone support · ስልክ ድጋፍ',
      'Unlimited users · ያልተወሰነ ተጠቃሚ',
    ],
    popular: false,
    ctaEn: 'Contact Us',
    ctaAm: 'ያግኙን',
    btnClass: 'ah-btn-gold',
    accent: C.gold,
  },
];

/* ─── Firebase error → bilingual message map ─────────────────────── */
const AUTH_ERRORS = {
  'auth/user-not-found':        'No account found with this email. / ይህ ኢሜይል ያለው መለያ አልተገኘም።',
  'auth/wrong-password':        'Incorrect password. / የይለፍ ቃሉ ትክክል አይደለም።',
  'auth/email-already-in-use':  'Email already registered. / ኢሜይሉ ቀድሞ ተመዝግቧል።',
  'auth/invalid-email':         'Invalid email address. / ልክ ያልሆነ ኢሜይል አድራሻ።',
  'auth/weak-password':         'Password too weak (min 6 chars). / ደካማ የይለፍ ቃል (ቢያንስ 6)።',
  'auth/too-many-requests':     'Too many attempts — try again later. / ብዙ ሙከራዎች — ቆይተው ይሞክሩ።',
  'auth/invalid-credential':    'Wrong email or password. / ኢሜይል ወይም የይለፍ ቃል ስህተት።',
  'auth/network-request-failed':'Network error — check your connection. / የኔትወርክ ስህተት።',
};

/* ─── Injected CSS ───────────────────────────────────────────────── */
const CSS = `
  *, *::before, *::after { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body { margin: 0; font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; }

  /* Nav */
  .ah-nav-link {
    color: ${C.gray};
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    padding: 4px 0;
    transition: color 0.2s;
    white-space: nowrap;
  }
  .ah-nav-link:hover { color: ${C.white}; }

  .ah-hamburger {
    display: none;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 6px;
    border-radius: 8px;
  }
  .ah-hamburger span {
    display: block;
    width: 22px;
    height: 2px;
    background: ${C.white};
    border-radius: 2px;
    transition: transform 0.25s, opacity 0.25s;
  }
  .ah-mobile-menu {
    display: none;
    flex-direction: column;
    background: ${C.navyCard};
    border-bottom: 1px solid ${C.navyBorder};
    padding: 0 24px 20px;
    gap: 0;
  }
  .ah-mobile-menu.open { display: flex; }
  .ah-mobile-menu .ah-nav-link {
    font-size: 15px;
    padding: 14px 0;
    border-bottom: 1px solid ${C.navyBorder};
    display: block;
  }

  /* Buttons */
  .ah-btn {
    border: none;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, box-shadow 0.2s, transform 0.12s, opacity 0.2s;
    padding: 12px 26px;
    line-height: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    white-space: nowrap;
  }
  .ah-btn:active { transform: scale(0.97); }
  .ah-btn:disabled { opacity: 0.65; cursor: not-allowed; }

  .ah-btn-primary  { background: ${C.blue};  color: ${C.white}; }
  .ah-btn-primary:hover:not(:disabled)  { background: #2a5de0; box-shadow: 0 4px 20px rgba(59,110,240,0.45); }

  .ah-btn-green    { background: ${C.green}; color: ${C.navy}; }
  .ah-btn-green:hover:not(:disabled)    { background: #00cc85; box-shadow: 0 4px 20px rgba(0,224,150,0.35); }

  .ah-btn-gold     { background: ${C.gold};  color: ${C.navy}; }
  .ah-btn-gold:hover:not(:disabled)     { background: #e3b830; box-shadow: 0 4px 20px rgba(245,200,66,0.35); }

  .ah-btn-ghost {
    background: transparent;
    color: ${C.white};
    border: 1.5px solid rgba(255,255,255,0.2);
  }
  .ah-btn-ghost:hover:not(:disabled) { border-color: rgba(255,255,255,0.5); background: rgba(255,255,255,0.06); }

  .ah-btn-outline-blue {
    background: transparent;
    color: ${C.blue};
    border: 1.5px solid ${C.blue};
  }
  .ah-btn-outline-blue:hover:not(:disabled) { background: ${C.blue}; color: ${C.white}; }

  /* Cards */
  .ah-feature-card {
    background: ${C.navyCard};
    border-radius: 16px;
    padding: 28px 24px;
    border: 1px solid ${C.navyBorder};
    transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
    cursor: default;
  }
  .ah-feature-card:hover {
    transform: translateY(-6px);
    border-color: ${C.blue};
    box-shadow: 0 16px 48px rgba(59,110,240,0.14);
  }

  .ah-plan-card {
    background: ${C.navyCard};
    border-radius: 20px;
    padding: 36px 28px;
    border: 1px solid ${C.navyBorder};
    transition: transform 0.25s ease;
    position: relative;
    flex: 1;
    min-width: 260px;
    max-width: 340px;
  }
  .ah-plan-card.popular {
    border-color: ${C.blue};
    box-shadow: 0 0 48px rgba(59,110,240,0.18);
  }
  .ah-plan-card:hover { transform: translateY(-6px); }

  /* Form inputs */
  .ah-input {
    width: 100%;
    background: ${C.navy};
    border: 1.5px solid ${C.navyBorder};
    border-radius: 10px;
    color: ${C.white};
    padding: 13px 16px;
    font-size: 15px;
    outline: none;
    transition: border-color 0.2s;
    display: block;
    font-family: inherit;
  }
  .ah-input:focus  { border-color: ${C.blue}; }
  .ah-input:disabled { opacity: 0.6; cursor: not-allowed; }
  .ah-input::placeholder { color: ${C.gray}; }

  /* Modal */
  .ah-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(4, 9, 20, 0.88);
    backdrop-filter: blur(6px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    animation: ah-fadein 0.22s ease;
  }
  .ah-modal {
    background: ${C.navyCard};
    border-radius: 24px;
    padding: 40px;
    width: 100%;
    max-width: 440px;
    border: 1px solid ${C.navyBorder};
    animation: ah-slideup 0.28s ease;
    position: relative;
    max-height: 90vh;
    overflow-y: auto;
  }
  .ah-modal::-webkit-scrollbar { width: 4px; }
  .ah-modal::-webkit-scrollbar-thumb { background: ${C.navyBorder}; border-radius: 4px; }

  .ah-tab {
    flex: 1;
    padding: 11px;
    border: none;
    background: transparent;
    color: ${C.gray};
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: color 0.2s, border-color 0.2s;
    font-family: inherit;
  }
  .ah-tab.active { color: ${C.blue}; border-bottom-color: ${C.blue}; }
  .ah-tab:not(.active):hover { color: ${C.white}; }

  /* Misc utils */
  .ah-gradient-text {
    background: linear-gradient(130deg, ${C.blue} 0%, ${C.green} 65%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .ah-pill {
    display: inline-block;
    border-radius: 20px;
    padding: 5px 16px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.3px;
  }

  .ah-section-title {
    font-size: 38px;
    font-weight: 800;
    letter-spacing: -0.8px;
    margin: 0 0 12px;
    line-height: 1.15;
  }

  .ah-contact-link {
    color: ${C.gray};
    text-decoration: none;
    display: flex;
    align-items: flex-start;
    gap: 14px;
    margin-bottom: 18px;
    font-size: 14px;
    line-height: 1.55;
    transition: color 0.2s;
  }
  .ah-contact-link:hover { color: ${C.green}; }

  .ah-footer-link {
    color: ${C.grayDim};
    text-decoration: none;
    display: block;
    margin-bottom: 10px;
    font-size: 13px;
    transition: color 0.2s;
  }
  .ah-footer-link:hover { color: ${C.white}; }

  /* Spinner */
  @keyframes ah-spin    { to { transform: rotate(360deg); } }
  @keyframes ah-fadein  { from { opacity: 0; } to { opacity: 1; } }
  @keyframes ah-slideup { from { transform: translateY(22px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

  .ah-spinner {
    width: 17px;
    height: 17px;
    border: 2px solid rgba(255,255,255,0.25);
    border-top-color: #fff;
    border-radius: 50%;
    animation: ah-spin 0.72s linear infinite;
    flex-shrink: 0;
  }

  /* ── Responsive ──────────────────────────────────────── */
  @media (max-width: 940px) {
    .ah-desktop-only { display: none !important; }
    .ah-hamburger    { display: flex !important; }
    .ah-hero-visual  { display: none !important; }
    .ah-hero-title   { font-size: 38px !important; }
    .ah-hero-sub     { font-size: 16px !important; }
    .ah-features-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .ah-plans-flex   { flex-direction: column !important; align-items: center !important; }
    .ah-plan-card    { max-width: 100% !important; width: 100% !important; }
    .ah-contact-cols { flex-direction: column !important; }
    .ah-footer-grid  { grid-template-columns: 1fr 1fr !important; }
    .ah-section-title { font-size: 30px !important; }
    .ah-section-pad  { padding-left: 24px !important; padding-right: 24px !important; }
  }

  @media (max-width: 560px) {
    .ah-hero-title   { font-size: 28px !important; }
    .ah-features-grid { grid-template-columns: 1fr !important; }
    .ah-footer-grid  { grid-template-columns: 1fr !important; }
    .ah-modal        { padding: 28px 20px !important; }
    .ah-section-pad  { padding-left: 16px !important; padding-right: 16px !important; }
    .ah-hero-btns    { flex-direction: column !important; }
    .ah-hero-btns .ah-btn { width: 100% !important; }
  }
`;

/* ═══════════════════════════════════════════════════════════════════
   Main component
═══════════════════════════════════════════════════════════════════ */
function Home() {
  /* ── nav state ── */
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);

  /* ── modal state ── */
  const [showModal,   setShowModal]   = useState(false);
  const [isLogin,     setIsLogin]     = useState(true);
  const [email,       setEmail]       = useState('');
  const [password,    setPassword]    = useState('');
  const [confirmPw,   setConfirmPw]   = useState('');
  const [authError,   setAuthError]   = useState('');
  const [loading,     setLoading]     = useState(false);

  /* ── CSS injection ── */
  useEffect(() => {
    const el = document.createElement('style');
    el.id = 'ah-styles';
    el.textContent = CSS;
    if (!document.getElementById('ah-styles')) document.head.appendChild(el);
    return () => { const s = document.getElementById('ah-styles'); if (s) s.remove(); };
  }, []);

  /* ── Scroll shadow on nav ── */
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  /* ── Lock body scroll when modal open; ESC to close ── */
  useEffect(() => {
    if (!showModal) { document.body.style.overflow = ''; return; }
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape' && !loading) closeModal(); };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [showModal, loading]);

  /* ── Helpers ── */
  const openModal = (loginMode = true) => {
    setIsLogin(loginMode);
    setEmail(''); setPassword(''); setConfirmPw('');
    setAuthError(''); setLoading(false);
    setShowModal(true);
    setMobileOpen(false);
  };

  const closeModal = () => { if (!loading) setShowModal(false); };

  const switchTab = (loginMode) => {
    setIsLogin(loginMode);
    setEmail(''); setPassword(''); setConfirmPw('');
    setAuthError('');
  };

  /* ── Auth submit ── */
  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');

    if (!email.trim() || !password) {
      setAuthError('Please fill in all fields. / ሁሉንም መስኮች ይሙሉ።');
      return;
    }
    if (!isLogin && password !== confirmPw) {
      setAuthError('Passwords do not match. / የይለፍ ቃሎቹ አይዛመዱም።');
      return;
    }
    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters. / ቢያንስ 6 ቁምፊ ያስፈልጋል።');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      }
      closeModal();
      /* App.js onAuthStateChanged handles redirect automatically */
    } catch (err) {
      setAuthError(AUTH_ERRORS[err.code] || err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ══════════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════════ */
  return (
    <div style={{ background: C.navy, color: C.white, minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ── Ethiopian flag stripe ── */}
      <div style={{
        height: 5,
        background: 'linear-gradient(to right, #078930 33.33%, #FCDD09 33.33% 66.66%, #DA121A 66.66%)',
        flexShrink: 0,
      }} />

      {/* ════════════════════════════════════════════════════════
          NAVIGATION
      ════════════════════════════════════════════════════════ */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 200,
        background: scrolled ? 'rgba(11,22,41,0.96)' : 'transparent',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        borderBottom: `1px solid ${scrolled ? C.navyBorder : 'transparent'}`,
        transition: 'background 0.3s, border-color 0.3s',
      }}>
        {/* Desktop nav row */}
        <nav style={{
          maxWidth: 1200, margin: '0 auto',
          padding: '0 32px', height: 68,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
        }} className="ah-section-pad">
          {/* Logo */}
          <a href="#home" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
            <div style={{
              width: 38, height: 38,
              background: `linear-gradient(135deg, ${C.blue}, ${C.green})`,
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 800, color: C.white,
              flexShrink: 0,
            }}>ሀ</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: C.white, lineHeight: 1.1, letterSpacing: '-0.3px' }}>
                Arif Hissab
              </div>
              <div style={{ fontSize: 11, color: C.gray, lineHeight: 1 }}>አሪፍ ሂሳብ</div>
            </div>
          </a>

          {/* Desktop links */}
          <div className="ah-desktop-only" style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
            {[['#home','Home · መነሻ'],['#features','Features · ባህሪያት'],['#pricing','Pricing · ዋጋ'],['#contact','Contact · ያግኙን']].map(([href, label]) => (
              <a key={href} href={href} className="ah-nav-link">{label}</a>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="ah-desktop-only" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button className="ah-btn ah-btn-ghost" style={{ padding: '9px 20px', fontSize: 14 }} onClick={() => openModal(true)}>
              Sign In · ግባ
            </button>
            <button className="ah-btn ah-btn-primary" style={{ padding: '9px 22px', fontSize: 14 }} onClick={() => openModal(false)}>
              Get Started · ጀምር
            </button>
          </div>

          {/* Hamburger */}
          <button className="ah-hamburger" onClick={() => setMobileOpen(o => !o)} aria-label="Toggle menu">
            <span style={{ transform: mobileOpen ? 'rotate(45deg) translate(5px,5px)' : 'none' }} />
            <span style={{ opacity: mobileOpen ? 0 : 1 }} />
            <span style={{ transform: mobileOpen ? 'rotate(-45deg) translate(5px,-5px)' : 'none' }} />
          </button>
        </nav>

        {/* Mobile menu */}
        <div className={`ah-mobile-menu${mobileOpen ? ' open' : ''}`}>
          {[['#home','Home · መነሻ'],['#features','Features · ባህሪያት'],['#pricing','Pricing · ዋጋ'],['#contact','Contact · ያግኙን']].map(([href, label]) => (
            <a key={href} href={href} className="ah-nav-link" onClick={() => setMobileOpen(false)}>{label}</a>
          ))}
          <div style={{ display: 'flex', gap: 10, paddingTop: 18 }}>
            <button className="ah-btn ah-btn-ghost"   style={{ flex: 1, fontSize: 14 }} onClick={() => openModal(true)}>Sign In · ግባ</button>
            <button className="ah-btn ah-btn-primary" style={{ flex: 1, fontSize: 14 }} onClick={() => openModal(false)}>Get Started · ጀምር</button>
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════════════════════════
          HERO SECTION
      ════════════════════════════════════════════════════════ */}
      <section id="home" className="ah-section-pad" style={{
        maxWidth: 1200, margin: '0 auto',
        padding: '90px 32px 80px',
        display: 'flex', alignItems: 'center', gap: 64,
        minHeight: 'calc(90vh - 73px)',
        position: 'relative',
      }}>
        {/* Ambient glow blobs */}
        <div style={{ position: 'absolute', width: 700, height: 700, borderRadius: '50%',
          background: 'rgba(59,110,240,0.09)', filter: 'blur(130px)',
          top: -150, left: -300, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%',
          background: 'rgba(0,224,150,0.07)', filter: 'blur(100px)',
          bottom: -100, right: -100, pointerEvents: 'none' }} />

        {/* Text column */}
        <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
          {/* Eyebrow tag */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(59,110,240,0.12)',
            border: '1px solid rgba(59,110,240,0.28)',
            borderRadius: 20, padding: '6px 16px',
            fontSize: 13, color: C.blue, fontWeight: 600, marginBottom: 28,
          }}>
            🇪🇹 Built for Ethiopian Business · ለኢትዮጵያ ንግድ
          </div>

          {/* Headline */}
          <h1 className="ah-hero-title" style={{
            fontSize: 58, fontWeight: 900, lineHeight: 1.1,
            letterSpacing: '-1.5px', marginBottom: 14,
          }}>
            Smart Accounting<br />
            <span className="ah-gradient-text">for Ethiopia</span>
          </h1>

          <p style={{
            fontSize: 20, fontWeight: 700, color: C.gold,
            marginBottom: 16, fontFamily: 'Georgia, serif',
          }}>
            አሪፍ ሂሳብ — ለኢትዮጵያ ንግዶች
          </p>

          <p className="ah-hero-sub" style={{
            fontSize: 18, color: C.gray, lineHeight: 1.7,
            maxWidth: 520, marginBottom: 38,
          }}>
            The complete business finance platform built for Ethiopian entrepreneurs.
            Manage invoices, track expenses, and generate reports in{' '}
            <strong style={{ color: C.white }}>English & Amharic</strong>.
            <br />
            <span style={{ fontSize: 14, color: C.grayDim, fontFamily: 'Georgia, serif', marginTop: 6, display: 'block' }}>
              ለኢትዮጵያ ንግደኞች ሙሉ የፋይናንስ ማስተዳደሪያ — ደረሰኝ፣ ወጪ እና ሪፖርቶች።
            </span>
          </p>

          <div className="ah-hero-btns" style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <button className="ah-btn ah-btn-primary" style={{ fontSize: 16, padding: '15px 34px' }} onClick={() => openModal(false)}>
              🚀 Start Free · ነፃ ጀምር
            </button>
            <button className="ah-btn ah-btn-ghost"   style={{ fontSize: 16, padding: '15px 34px' }} onClick={() => openModal(true)}>
              Sign In · ግባ
            </button>
          </div>

          {/* Trust indicators */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, marginTop: 48 }}>
            {[
              { icon: '🔐', label: 'Secure & encrypted · ደህንነቱ የተጠበቀ' },
              { icon: '🇪🇹', label: 'ETB native · ብር ዘፍጥረታዊ' },
              { icon: '☁️', label: 'Cloud & offline · ደምና' },
            ].map((t) => (
              <div key={t.icon} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: C.grayDim }}>
                <span>{t.icon}</span><span>{t.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard visual (desktop only) */}
        <div className="ah-hero-visual" style={{ flex: '0 0 420px', position: 'relative', zIndex: 1 }}>
          <div style={{
            background: C.navyCard, border: `1px solid ${C.navyBorder}`,
            borderRadius: 22, padding: 26,
            boxShadow: '0 32px 96px rgba(0,0,0,0.55)',
          }}>
            {/* Mock header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
              <div style={{ fontSize: 13, color: C.gray }}>ሐምሌ 2017 · July 2025</div>
              <span style={{
                fontSize: 11, background: 'rgba(0,224,150,0.15)',
                color: C.green, padding: '3px 10px', borderRadius: 10, fontWeight: 600,
              }}>● Live</span>
            </div>

            {/* Stat grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 22 }}>
              {[
                { icon: '📊', label: 'Revenue · ገቢ',   val: 'ETB 84,200', color: C.blue  },
                { icon: '💳', label: 'Expenses · ወጪ',  val: 'ETB 31,500', color: C.gold  },
                { icon: '🧾', label: 'Invoices · ደረሰኝ', val: '47 active', color: C.green },
                { icon: '📈', label: 'Profit · ትርፍ',   val: 'ETB 52,700', color: C.green },
              ].map((s) => (
                <div key={s.label} style={{
                  background: C.navy, borderRadius: 12, padding: '14px 16px',
                  border: `1px solid ${s.color}22`,
                }}>
                  <div style={{ fontSize: 20, marginBottom: 7 }}>{s.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: C.gray, marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Mini bar chart */}
            <div style={{ borderTop: `1px solid ${C.navyBorder}`, paddingTop: 18 }}>
              <div style={{ fontSize: 12, color: C.gray, marginBottom: 10 }}>
                Monthly Revenue · ወርሃዊ ገቢ
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 56 }}>
                {[38, 62, 48, 78, 68, 88, 74].map((h, i) => (
                  <div key={i} style={{
                    flex: 1, height: `${h}%`,
                    background: i === 6
                      ? `linear-gradient(180deg, ${C.blue}, ${C.green})`
                      : C.navyBorder,
                    borderRadius: '3px 3px 0 0',
                  }} />
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                {['Jan','Feb','Mar','Apr','May','Jun','Jul'].map((m) => (
                  <span key={m} style={{ fontSize: 9, color: C.grayDim, flex: 1, textAlign: 'center' }}>{m}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Floating badges */}
          <div style={{
            position: 'absolute', top: -14, right: -14,
            background: C.green, color: C.navy,
            borderRadius: 12, padding: '9px 15px',
            fontSize: 12, fontWeight: 700,
            boxShadow: '0 8px 28px rgba(0,224,150,0.35)',
          }}>✓ 100% Cloud · ደምና</div>

          <div style={{
            position: 'absolute', bottom: -14, left: -14,
            background: C.navyCard, border: `1px solid ${C.navyBorder}`,
            borderRadius: 12, padding: '9px 15px',
            fontSize: 12, fontWeight: 600,
            boxShadow: '0 8px 28px rgba(0,0,0,0.3)',
          }}>🇪🇹 ለኢትዮጵያ ንግዶች</div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          FEATURES SECTION
      ════════════════════════════════════════════════════════ */}
      <section id="features" style={{
        background: 'linear-gradient(180deg, #0B1629 0%, #0d1c34 100%)',
        padding: '88px 0',
        borderTop: `1px solid ${C.navyBorder}`,
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }} className="ah-section-pad">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="ah-pill" style={{
              background: 'rgba(0,224,150,0.1)', border: `1px solid rgba(0,224,150,0.25)`,
              color: C.green, marginBottom: 18,
            }}>
              Features · ባህሪያት
            </span>
            <h2 className="ah-section-title">Everything your business needs</h2>
            <p style={{ fontSize: 16, color: C.gray, maxWidth: 480, margin: '0 auto', lineHeight: 1.65 }}>
              ንግድዎ የሚፈልጋቸው ሁሉም ባህሪያት —{' '}
              Complete tools for Ethiopian entrepreneurs.
            </p>
          </div>

          <div className="ah-features-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20,
          }}>
            {FEATURES.map((f) => (
              <div key={f.en} className="ah-feature-card">
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: `${f.accent}18`, border: `1px solid ${f.accent}2e`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, marginBottom: 20,
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{f.en}</h3>
                <p style={{ fontSize: 13, color: f.accent, fontWeight: 600, marginBottom: 12, fontFamily: 'Georgia, serif' }}>
                  {f.am}
                </p>
                <p style={{ fontSize: 14, color: C.gray, lineHeight: 1.65 }}>{f.descEn}</p>
                <p style={{ fontSize: 12, color: C.grayDim, marginTop: 8, fontFamily: 'Georgia, serif', lineHeight: 1.6 }}>
                  {f.descAm}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          PRICING SECTION
      ════════════════════════════════════════════════════════ */}
      <section id="pricing" style={{ padding: '88px 0', background: C.navy }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }} className="ah-section-pad">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="ah-pill" style={{
              background: 'rgba(245,200,66,0.1)', border: `1px solid rgba(245,200,66,0.25)`,
              color: C.gold, marginBottom: 18,
            }}>
              Pricing · ዋጋ
            </span>
            <h2 className="ah-section-title">Choose your plan</h2>
            <p style={{ fontSize: 16, color: C.gray, maxWidth: 440, margin: '0 auto', lineHeight: 1.65 }}>
              የዕቅድዎን ይምረጡ — Plans built for every stage of your growth.
            </p>
          </div>

          <div className="ah-plans-flex" style={{ display: 'flex', gap: 24, justifyContent: 'center', alignItems: 'flex-start' }}>
            {PLANS.map((plan) => (
              <div key={plan.en} className={`ah-plan-card${plan.popular ? ' popular' : ''}`}>
                {plan.popular && (
                  <div style={{
                    position: 'absolute', top: -15, left: '50%', transform: 'translateX(-50%)',
                    background: `linear-gradient(90deg, ${C.blue}, ${C.green})`,
                    color: C.white, borderRadius: 20, padding: '5px 22px',
                    fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap',
                  }}>
                    ★ Most Popular · ታዋቂ
                  </div>
                )}

                <div style={{ marginBottom: 4 }}>
                  <span style={{ fontSize: 24, fontWeight: 800 }}>{plan.en}</span>
                </div>
                <div style={{ fontSize: 15, color: plan.accent, fontWeight: 700, fontFamily: 'Georgia, serif', marginBottom: 10 }}>
                  {plan.am}
                </div>
                <p style={{ fontSize: 14, color: C.gray, marginBottom: 4, lineHeight: 1.5 }}>{plan.descEn}</p>
                <p style={{ fontSize: 12, color: C.grayDim, marginBottom: 28, fontFamily: 'Georgia, serif' }}>{plan.descAm}</p>

                <div style={{ borderTop: `1px solid ${C.navyBorder}`, borderBottom: `1px solid ${C.navyBorder}`, padding: '20px 0', marginBottom: 28 }}>
                  {plan.items.map((item, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: j < plan.items.length - 1 ? 12 : 0 }}>
                      <span style={{ color: plan.accent, flexShrink: 0, marginTop: 1, fontSize: 13 }}>✓</span>
                      <span style={{ fontSize: 13, color: '#c8d2e4', lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>

                <button
                  className={`ah-btn ${plan.btnClass}`}
                  style={{ width: '100%', fontSize: 15, padding: '13px' }}
                  onClick={() => {
                    if (plan.en === 'Enterprise') {
                      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      openModal(false);
                    }
                  }}
                >
                  {plan.ctaEn} · {plan.ctaAm}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          CONTACT / SUPPORT SECTION
      ════════════════════════════════════════════════════════ */}
      <section id="contact" style={{
        padding: '88px 0',
        background: 'linear-gradient(180deg, #0B1629 0%, #090f1e 100%)',
        borderTop: `1px solid ${C.navyBorder}`,
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }} className="ah-section-pad">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="ah-pill" style={{
              background: 'rgba(59,110,240,0.1)', border: `1px solid rgba(59,110,240,0.28)`,
              color: C.blue, marginBottom: 18,
            }}>
              Support · ድጋፍ
            </span>
            <h2 className="ah-section-title">We're here to help</h2>
            <p style={{ fontSize: 16, color: C.gray, maxWidth: 440, margin: '0 auto', lineHeight: 1.65 }}>
              ለመርዳት ዝግጁ ነን — Reach us in English or Amharic.
            </p>
          </div>

          <div className="ah-contact-cols" style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
            {/* Contact info card */}
            <div style={{
              background: C.navyCard, border: `1px solid ${C.navyBorder}`,
              borderRadius: 20, padding: '36px 32px',
              flex: '1 1 300px', maxWidth: 420,
            }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Contact Us · ያግኙን</h3>
              <p style={{ fontSize: 14, color: C.gray, marginBottom: 28 }}>
                We respond within 24 hours · በ24 ሰዓት ምላሽ
              </p>
              <a href="mailto:support@arifhissab.com" className="ah-contact-link">
                <span style={{ fontSize: 22, flexShrink: 0, marginTop: 1 }}>✉️</span>
                <span>
                  support@arifhissab.com
                  <span style={{ display: 'block', fontSize: 12, color: C.grayDim, fontFamily: 'Georgia, serif' }}>ኢሜይል ድጋፍ</span>
                </span>
              </a>
              <a href="tel:+251911000000" className="ah-contact-link">
                <span style={{ fontSize: 22, flexShrink: 0, marginTop: 1 }}>📞</span>
                <span>
                  +251 91 100 0000
                  <span style={{ display: 'block', fontSize: 12, color: C.grayDim, fontFamily: 'Georgia, serif' }}>ሰኞ–ዓርብ · 8am–6pm EAT</span>
                </span>
              </a>
              <a href="https://t.me/arifhissab" target="_blank" rel="noopener noreferrer" className="ah-contact-link">
                <span style={{ fontSize: 22, flexShrink: 0, marginTop: 1 }}>✈️</span>
                <span>
                  @arifhissab on Telegram
                  <span style={{ display: 'block', fontSize: 12, color: C.grayDim, fontFamily: 'Georgia, serif' }}>ቴሌግራም ድጋፍ</span>
                </span>
              </a>
              <div className="ah-contact-link" style={{ cursor: 'default' }}>
                <span style={{ fontSize: 22, flexShrink: 0, marginTop: 1 }}>📍</span>
                <span>
                  Addis Ababa, Ethiopia
                  <span style={{ display: 'block', fontSize: 12, color: C.grayDim, fontFamily: 'Georgia, serif' }}>አዲስ አበባ፣ ኢትዮጵያ</span>
                </span>
              </div>
            </div>

            {/* CTA card */}
            <div style={{
              background: 'linear-gradient(140deg, #152d52 0%, #1a3868 100%)',
              border: '1px solid #1e4272',
              borderRadius: 20, padding: '36px 32px',
              flex: '1 1 300px', maxWidth: 420,
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
            }}>
              <div style={{ fontSize: 44, marginBottom: 18 }}>🚀</div>
              <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Ready to get started?</h3>
              <p style={{ fontSize: 16, color: C.gold, fontWeight: 700, fontFamily: 'Georgia, serif', marginBottom: 12 }}>
                ለመጀመር ዝግጁ ነዎት?
              </p>
              <p style={{ fontSize: 14, color: C.gray, lineHeight: 1.65, marginBottom: 28 }}>
                Join hundreds of Ethiopian businesses already using Arif Hissab to manage their finances.
                <br />
                <span style={{ fontSize: 13, color: C.grayDim, fontFamily: 'Georgia, serif' }}>
                  ብዙ ኢትዮጵያዊ ንግዶች ቀድሞ ያሪፍ ሂሳብን ይጠቀማሉ።
                </span>
              </p>
              <button className="ah-btn ah-btn-primary" style={{ fontSize: 15, padding: '13px', marginBottom: 12, width: '100%' }} onClick={() => openModal(false)}>
                Create Free Account · ነፃ መለያ ፍጠር
              </button>
              <button className="ah-btn ah-btn-ghost" style={{ fontSize: 14, padding: '11px', width: '100%' }} onClick={() => openModal(true)}>
                Already have an account? · Sign In · ግባ
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════════════ */}
      <footer style={{ background: C.navyDeep, borderTop: `1px solid ${C.navyBorder}`, padding: '52px 0 28px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }} className="ah-section-pad">
          <div className="ah-footer-grid" style={{
            display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 44,
          }}>
            {/* Brand column */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{
                  width: 36, height: 36,
                  background: `linear-gradient(135deg, ${C.blue}, ${C.green})`,
                  borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 17, fontWeight: 800, color: C.white, flexShrink: 0,
                }}>ሀ</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: C.white }}>Arif Hissab</div>
                  <div style={{ fontSize: 11, color: C.gray }}>አሪፍ ሂሳብ</div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: C.gray, lineHeight: 1.7, maxWidth: 250 }}>
                The smart accounting platform for Ethiopian businesses — manage finances in English and Amharic.
              </p>
              <p style={{ fontSize: 12, color: C.grayDim, lineHeight: 1.6, maxWidth: 250, fontFamily: 'Georgia, serif', marginTop: 8 }}>
                ለኢትዮጵያ ንግዶች የሂሳብ ማስተዳደሪያ።
              </p>
              <div style={{ display: 'flex', gap: 5, marginTop: 18 }}>
                {['#078930','#FCDD09','#DA121A'].map((c) => (
                  <div key={c} style={{ width: 22, height: 9, background: c, borderRadius: 3 }} />
                ))}
              </div>
            </div>

            {/* Product */}
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: C.white, marginBottom: 16 }}>Product · ምርት</div>
              {['Features · ባህሪያት','Pricing · ዋጋ','Security · ደህንነት','Changelog · ዝማኔዎች'].map((l) => (
                <a key={l} href="#" className="ah-footer-link">{l}</a>
              ))}
            </div>

            {/* Company */}
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: C.white, marginBottom: 16 }}>Company · ድርጅት</div>
              {['About · ስለ እኛ','Blog · ጦማር','Careers · ሥራ','Press · ሚዲያ'].map((l) => (
                <a key={l} href="#" className="ah-footer-link">{l}</a>
              ))}
            </div>

            {/* Support */}
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: C.white, marginBottom: 16 }}>Support · ድጋፍ</div>
              {['Help Center · እርዳታ','Contact · ያግኙን','Privacy · ግላዊነት','Terms · ውሎች'].map((l) => (
                <a key={l} href="#" className="ah-footer-link">{l}</a>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{
            borderTop: `1px solid ${C.navyBorder}`, paddingTop: 24,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexWrap: 'wrap', gap: 12,
          }}>
            <p style={{ fontSize: 13, color: C.grayDim }}>
              © 2025 Arif Hissab · አሪፍ ሂሳብ. All rights reserved · መብቱ በህግ የተጠበቀ።
            </p>
            <div style={{ display: 'flex', gap: 20 }}>
              {['🇪🇹 Ethiopia','English','አማርኛ'].map((l) => (
                <span key={l} style={{ fontSize: 13, color: C.grayDim, cursor: 'pointer' }}>{l}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ════════════════════════════════════════════════════════
          AUTH MODAL OVERLAY
      ════════════════════════════════════════════════════════ */}
      {showModal && (
        <div
          className="ah-backdrop"
          onMouseDown={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className="ah-modal" role="dialog" aria-modal="true" aria-label="Authentication">

            {/* Close button */}
            <button
              onClick={closeModal}
              disabled={loading}
              aria-label="Close"
              style={{
                position: 'absolute', top: 16, right: 16,
                width: 32, height: 32, borderRadius: 8,
                background: C.navyBorder, border: 'none',
                color: C.gray, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = '#2a3f5e'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = C.navyBorder; }}
            >✕</button>

            {/* Modal logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
              <div style={{
                width: 36, height: 36,
                background: `linear-gradient(135deg, ${C.blue}, ${C.green})`,
                borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 17, fontWeight: 800, color: C.white,
              }}>ሀ</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>Arif Hissab</div>
                <div style={{ fontSize: 11, color: C.gray }}>አሪፍ ሂሳብ</div>
              </div>
            </div>

            {/* Login / Register tabs */}
            <div style={{ display: 'flex', borderBottom: `1px solid ${C.navyBorder}`, marginBottom: 26 }}>
              <button className={`ah-tab${isLogin ? ' active' : ''}`} onClick={() => switchTab(true)}>
                Sign In · ግባ
              </button>
              <button className={`ah-tab${!isLogin ? ' active' : ''}`} onClick={() => switchTab(false)}>
                Register · ተመዝገብ
              </button>
            </div>

            {/* Heading */}
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h2>
            <p style={{ fontSize: 14, color: C.gray, marginBottom: 24 }}>
              {isLogin ? 'ወደ አካውንትዎ ይግቡ' : 'አዲስ መለያ ይፍጠሩ'}
            </p>

            {/* Form */}
            <form onSubmit={handleAuth} noValidate>
              <label style={{ display: 'block', fontSize: 13, color: C.gray, marginBottom: 6 }}>
                Email · ኢሜይል
              </label>
              <input
                className="ah-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                disabled={loading}
                style={{ marginBottom: 16 }}
              />

              <label style={{ display: 'block', fontSize: 13, color: C.gray, marginBottom: 6 }}>
                Password · የይለፍ ቃል
              </label>
              <input
                className="ah-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                disabled={loading}
                style={{ marginBottom: isLogin ? 0 : 16 }}
              />

              {!isLogin && (
                <>
                  <label style={{ display: 'block', fontSize: 13, color: C.gray, marginBottom: 6 }}>
                    Confirm Password · ያረጋግጡ
                  </label>
                  <input
                    className="ah-input"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPw}
                    onChange={(e) => setConfirmPw(e.target.value)}
                    autoComplete="new-password"
                    disabled={loading}
                    style={{ marginBottom: 0 }}
                  />
                </>
              )}

              {/* Error message */}
              {authError && (
                <div style={{
                  background: 'rgba(218,18,26,0.1)',
                  border: '1px solid rgba(218,18,26,0.35)',
                  color: '#ff7070',
                  borderRadius: 10, padding: '10px 14px',
                  fontSize: 13, lineHeight: 1.55, marginTop: 16,
                }}>
                  ⚠️ {authError}
                </div>
              )}

              {/* Submit */}
              <button
                className="ah-btn ah-btn-primary"
                type="submit"
                disabled={loading}
                style={{ width: '100%', marginTop: 20, fontSize: 15, padding: '14px' }}
              >
                {loading ? (
                  <><span className="ah-spinner" />Processing · በማስኬድ ላይ...</>
                ) : isLogin ? (
                  'Sign In · ግባ'
                ) : (
                  'Create Account · ተመዝገብ'
                )}
              </button>
            </form>

            {/* Toggle link */}
            <p style={{ textAlign: 'center', fontSize: 13, color: C.gray, marginTop: 20 }}>
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                onClick={() => switchTab(!isLogin)}
                disabled={loading}
                style={{
                  background: 'none', border: 'none',
                  color: C.blue, cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: 13, fontWeight: 600, padding: 0,
                  fontFamily: 'inherit',
                }}
              >
                {isLogin ? 'Register · ተመዝገብ' : 'Sign In · ግባ'}
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
