import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase-config';
import './Home.css';

/* ─── Feature data ───────────────────────────────────────────── */
const FEATURES = [
  {
    icon: '📊', color: 'blue',
    en: 'Accounting',        am: 'ሂሳብ አስተዳደር',
    descEn: 'Complete double-entry bookkeeping tailored for Ethiopian business standards.',
    descAm: 'ለኢትዮጵያ ንግድ ደረጃዎች የተዘጋጀ ሙሉ ሂሳብ አስተዳደር።',
  },
  {
    icon: '🧾', color: 'green',
    en: 'Invoicing',          am: 'ደረሰኝ',
    descEn: 'Professional bilingual invoices in seconds — English & Amharic.',
    descAm: 'ሙያዊ ሁለት ቋንቋ ደረሰኞች በሰከንዶች ውስጥ።',
  },
  {
    icon: '💳', color: 'gold',
    en: 'Expense Tracking',   am: 'ወጪ ክትትል',
    descEn: 'Track every birr with categories, receipts, and smart rules.',
    descAm: 'እያንዳንዱ ብር በምድቦች እና ደረሰኞች ይከታተሉ።',
  },
  {
    icon: '📈', color: 'blue',
    en: 'Reports & Analytics', am: 'ሪፖርት እና ትንታኔ',
    descEn: 'Real-time P&L, cash flow, and balance sheet in both languages.',
    descAm: 'ሪልታይም ሪፖርቶች በሁለቱ ቋንቋዎች።',
  },
  {
    icon: '💱', color: 'green',
    en: 'Multi-Currency',      am: 'ብዙ ምንዛሬ',
    descEn: 'ETB, USD, EUR and 50+ currencies with live exchange rates.',
    descAm: 'ብር፣ ዶላር እና 50+ ምንዛሬዎች ቀጥታ ምንዛሬ።',
  },
  {
    icon: '☁️', color: 'gold',
    en: 'Cloud Sync',          am: 'ደመና ማስተባበሪያ',
    descEn: 'Access your data on any device, anywhere, any time.',
    descAm: 'ማንኛውም ጊዜ ማንኛውም ቦታ ይድረሱ።',
  },
];

/* ─── Pricing plan data ──────────────────────────────────────── */
const PLANS = [
  {
    color: 'blue',  btnCls: 'ah-btn-outline-blue', popular: false,
    en: 'Basic',    am: 'መሰረታዊ',
    ctaEn: 'Get Started', ctaAm: 'ጀምር',
    descEn: 'Perfect for freelancers & small shops',
    descAm: 'ለነጻ ሰራተኞች እና ትናንሽ ሱቆች',
    items: [
      '50 invoices / month · 50 ደረሰኝ/ወር',
      'Expense tracking · ወጪ ክትትል',
      'Standard reports · ደረጃ ሪፖርቶች',
      'Email support · ኢሜይል ድጋፍ',
      '1 user · 1 ተጠቃሚ',
    ],
  },
  {
    color: 'green', btnCls: 'ah-btn-green', popular: true,
    en: 'Business', am: 'ንግድ',
    ctaEn: 'Get Started', ctaAm: 'ጀምር',
    descEn: 'For growing businesses that need more power',
    descAm: 'ለሚያድጉ ንግዶች ተጨማሪ ባህሪያት',
    items: [
      'Unlimited invoices · ያልተወሰነ ደረሰኝ',
      'Advanced tracking · የተሻሻለ ክትትል',
      'Full analytics suite · ሙሉ ትንታኔ',
      'Priority support · ቅድሚያ ድጋፍ',
      'Up to 5 users · 5 ተጠቃሚዎች',
    ],
  },
  {
    color: 'gold',  btnCls: 'ah-btn-gold',  popular: false,
    en: 'Enterprise', am: 'ኢንተርፕራይዝ',
    ctaEn: 'Contact Us', ctaAm: 'ያግኙን',
    descEn: 'Custom solutions for large organizations',
    descAm: 'ለትልልቅ ድርጅቶች ብጁ መፍትሄዎች',
    items: [
      'Everything in Business · ሁሉም ባህሪያት',
      'Custom integrations · ብጁ ውህደቶች',
      'Dedicated account manager · አስተዳዳሪ',
      '24/7 phone support · ስልክ ድጋፍ',
      'Unlimited users · ያልተወሰነ ተጠቃሚ',
    ],
  },
];

/* ─── Firebase error → bilingual messages ────────────────────── */
const AUTH_ERRORS = {
  'auth/user-not-found':        'No account found with this email. / ይህ ኢሜይል ያለው መለያ አልተገኘም።',
  'auth/wrong-password':        'Incorrect password. / የይለፍ ቃሉ ትክክል አይደለም።',
  'auth/email-already-in-use':  'Email already registered. / ኢሜይሉ ቀድሞ ተመዝግቧል።',
  'auth/invalid-email':         'Invalid email address. / ልክ ያልሆነ ኢሜይል አድራሻ።',
  'auth/weak-password':         'Password too weak (min 6 chars). / ደካማ የይለፍ ቃል።',
  'auth/too-many-requests':     'Too many attempts — try later. / ብዙ ሙከራዎች — ቆይተው ይሞክሩ።',
  'auth/invalid-credential':    'Wrong email or password. / ኢሜይል ወይም የይለፍ ቃል ስህተት።',
  'auth/network-request-failed':'Network error. Check connection. / የኔትወርክ ስህተት።',
};

/* ─── Dashboard bar heights (%) ──────────────────────────────── */
const BAR_HEIGHTS = [38, 62, 48, 78, 68, 88, 74];
const MONTHS      = ['Jan','Feb','Mar','Apr','May','Jun','Jul'];

/* ════════════════════════════════════════════════════════════════
   COMPONENT
════════════════════════════════════════════════════════════════ */
export default function Home() {
  /* nav */
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  /* modal */
  const [showModal,  setShowModal]  = useState(false);
  const [isLogin,    setIsLogin]    = useState(true);
  const [email,      setEmail]      = useState('');
  const [password,   setPassword]   = useState('');
  const [confirmPw,  setConfirmPw]  = useState('');
  const [authError,  setAuthError]  = useState('');
  const [loading,    setLoading]    = useState(false);

  /* scroll → sticky header shadow */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ESC closes modal; lock body scroll */
  useEffect(() => {
    if (!showModal) { document.body.style.overflow = ''; return; }
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape' && !loading) closeModal(); };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [showModal, loading]);

  /* ── helpers ── */
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

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');

    if (!email.trim() || !password) {
      setAuthError('Please fill in all fields. / ሁሉንም መስኮች ይሙሉ።'); return;
    }
    if (!isLogin && password !== confirmPw) {
      setAuthError('Passwords do not match. / የይለፍ ቃሎቹ አይዛመዱም።'); return;
    }
    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters. / ቢያንስ 6 ቁምፊ ያስፈልጋል።'); return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      }
      closeModal();
    } catch (err) {
      setAuthError(AUTH_ERRORS[err.code] || err.message);
    } finally {
      setLoading(false);
    }
  };

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  /* ════════════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════════════ */
  return (
    <div className="ah-page">

      {/* ── Ethiopian flag stripe ── */}
      <div className="ah-flag-stripe" />

      {/* ════════════════════════════════════════════════════
          HEADER / NAV
      ════════════════════════════════════════════════════ */}
      <header className={`ah-header${scrolled ? ' scrolled' : ''}`}>
        <nav className="ah-nav-container">

          {/* Logo */}
          <a href="#home" className="ah-nav-logo">
            <div className="ah-nav-logo-icon">ሀ</div>
            <div>
              <div className="ah-nav-logo-name">Arif Hissab</div>
              <div className="ah-nav-logo-am">አሪፍ ሂሳብ</div>
            </div>
          </a>

          {/* Desktop links */}
          <div className="ah-nav-links-group">
            {[['#home','Home · መነሻ'],['#features','Features · ባህሪያት'],
              ['#pricing','Pricing · ዋጋ'],['#contact','Contact · ያግኙን']].map(([h, l]) => (
              <a key={h} href={h} className="ah-nav-link">{l}</a>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="ah-nav-actions">
            <button className="ah-btn ah-btn-ghost ah-btn-sm"   onClick={() => openModal(true)}>Sign In · ግባ</button>
            <button className="ah-btn ah-btn-primary ah-btn-sm" onClick={() => openModal(false)}>Get Started · ጀምር</button>
          </div>

          {/* Hamburger */}
          <button className="ah-hamburger" onClick={() => setMobileOpen(o => !o)} aria-label="Menu">
            <span style={{ transform: mobileOpen ? 'rotate(45deg) translate(5px,5px)'   : 'none' }} />
            <span style={{ opacity: mobileOpen ? 0 : 1 }} />
            <span style={{ transform: mobileOpen ? 'rotate(-45deg) translate(5px,-5px)' : 'none' }} />
          </button>
        </nav>

        {/* Mobile menu */}
        <div className={`ah-mobile-menu${mobileOpen ? ' open' : ''}`}>
          {[['#home','Home · መነሻ'],['#features','Features · ባህሪያት'],
            ['#pricing','Pricing · ዋጋ'],['#contact','Contact · ያግኙን']].map(([h, l]) => (
            <a key={h} href={h} className="ah-nav-link" onClick={() => setMobileOpen(false)}>{l}</a>
          ))}
          <div className="ah-mobile-menu-actions">
            <button className="ah-btn ah-btn-ghost"   onClick={() => openModal(true)}>Sign In · ግባ</button>
            <button className="ah-btn ah-btn-primary" onClick={() => openModal(false)}>Get Started · ጀምር</button>
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════ */}
      <section id="home">
        <div className="ah-hero">
          <div className="ah-hero-glow ah-hero-glow-1" />
          <div className="ah-hero-glow ah-hero-glow-2" />

          {/* Text */}
          <div className="ah-hero-content">
            <div className="ah-hero-eyebrow">🇪🇹 Built for Ethiopian Business · ለኢትዮጵያ ንግድ</div>

            <h1 className="ah-hero-title">
              Smart Accounting<br />
              <span className="ah-gradient-text">for Ethiopia</span>
            </h1>

            <p className="ah-hero-am-title">አሪፍ ሂሳብ — ለኢትዮጵያ ንግዶች</p>

            <p className="ah-hero-sub">
              The complete business finance platform built for Ethiopian entrepreneurs.
              Manage invoices, track expenses, and generate reports in{' '}
              <strong>English & Amharic</strong>.
              <span className="ah-hero-sub-am">
                ለኢትዮጵያ ንግደኞች ሙሉ የፋይናንስ ማስተዳደሪያ — ደረሰኝ፣ ወጪ እና ሪፖርቶች።
              </span>
            </p>

            <div className="ah-hero-btns">
              <button className="ah-btn ah-btn-primary ah-btn-lg" onClick={() => openModal(false)}>
                🚀 Start Free · ነፃ ጀምር
              </button>
              <button className="ah-btn ah-btn-ghost ah-btn-lg" onClick={() => openModal(true)}>
                Sign In · ግባ
              </button>
            </div>

            <div className="ah-hero-trust">
              {[['🔐','Secure & encrypted · ደህንነቱ የተጠበቀ'],
                ['🇪🇹','ETB native · ብር ዘፍጥረታዊ'],
                ['☁️','Cloud & offline · ደምና']].map(([icon, label]) => (
                <div key={label} className="ah-hero-trust-item"><span>{icon}</span><span>{label}</span></div>
              ))}
            </div>
          </div>

          {/* Dashboard visual */}
          <div className="ah-hero-visual">
            <div className="ah-dashboard">
              <div className="ah-dashboard-head">
                <span className="ah-dashboard-date">ሐምሌ 2017 · July 2025</span>
                <span className="ah-dashboard-live">● Live</span>
              </div>

              <div className="ah-stat-grid">
                {[
                  { c:'blue',  icon:'📊', val:'ETB 84,200', label:'Revenue · ገቢ' },
                  { c:'gold',  icon:'💳', val:'ETB 31,500', label:'Expenses · ወጪ' },
                  { c:'green', icon:'🧾', val:'47 active',  label:'Invoices · ደረሰኝ' },
                  { c:'green', icon:'📈', val:'ETB 52,700', label:'Profit · ትርፍ' },
                ].map((s) => (
                  <div key={s.label} className={`ah-stat-card ${s.c}`}>
                    <div className="ah-stat-icon">{s.icon}</div>
                    <div className="ah-stat-val">{s.val}</div>
                    <div className="ah-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="ah-chart-wrap">
                <div className="ah-chart-title">Monthly Revenue · ወርሃዊ ገቢ</div>
                <div className="ah-bars">
                  {BAR_HEIGHTS.map((h, i) => (
                    <div key={i} className={`ah-bar${i === 6 ? ' active' : ''}`} style={{ height: `${h}%` }} />
                  ))}
                </div>
                <div className="ah-month-labels">
                  {MONTHS.map((m) => <span key={m} className="ah-month-label">{m}</span>)}
                </div>
              </div>
            </div>

            <div className="ah-hero-badge ah-hero-badge-top">✓ 100% Cloud · ደምና</div>
            <div className="ah-hero-badge ah-hero-badge-bottom">🇪🇹 ለኢትዮጵያ ንግዶች</div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          FEATURES
      ════════════════════════════════════════════════════ */}
      <section id="features" className="ah-features">
        <div className="ah-container">
          <div className="ah-section-head">
            <span className="ah-pill ah-pill--green">Features · ባህሪያት</span>
            <h2 className="ah-section-title">Everything your business needs</h2>
            <p className="ah-section-sub">
              ንግድዎ የሚፈልጋቸው ሁሉም ባህሪያት — Complete tools for Ethiopian entrepreneurs.
            </p>
          </div>

          <div className="ah-features-grid">
            {FEATURES.map((f) => (
              <div key={f.en} className={`ah-feature-card ${f.color}`}>
                <div className="ah-feature-icon">{f.icon}</div>
                <h3 className="ah-feature-title">{f.en}</h3>
                <p className="ah-feature-am">{f.am}</p>
                <p className="ah-feature-desc">{f.descEn}</p>
                <p className="ah-feature-am-desc">{f.descAm}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          PRICING
      ════════════════════════════════════════════════════ */}
      <section id="pricing" className="ah-pricing">
        <div className="ah-container">
          <div className="ah-section-head">
            <span className="ah-pill ah-pill--gold">Pricing · ዋጋ</span>
            <h2 className="ah-section-title">Choose your plan</h2>
            <p className="ah-section-sub">
              የዕቅድዎን ይምረጡ — Plans built for every stage of your growth.
            </p>
          </div>

          <div className="ah-plans-flex">
            {PLANS.map((plan) => (
              <div key={plan.en} className={`ah-plan-card ${plan.color}${plan.popular ? ' popular' : ''}`}>
                {plan.popular && <div className="ah-plan-popular-tag">★ Most Popular · ታዋቂ</div>}

                <div className="ah-plan-name">{plan.en}</div>
                <div className="ah-plan-name-am">{plan.am}</div>
                <p className="ah-plan-desc">{plan.descEn}</p>
                <p className="ah-plan-am-desc">{plan.descAm}</p>

                <ul className="ah-plan-features-list" style={{ listStyle: 'none' }}>
                  {plan.items.map((item, j) => (
                    <li key={j} className="ah-plan-item">
                      <span className="ah-plan-check">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`ah-btn ${plan.btnCls} ah-btn-full`}
                  onClick={() => plan.en === 'Enterprise' ? scrollTo('contact') : openModal(false)}
                >
                  {plan.ctaEn} · {plan.ctaAm}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          CONTACT
      ════════════════════════════════════════════════════ */}
      <section id="contact" className="ah-contact">
        <div className="ah-container">
          <div className="ah-section-head">
            <span className="ah-pill ah-pill--blue">Support · ድጋፍ</span>
            <h2 className="ah-section-title">We're here to help</h2>
            <p className="ah-section-sub">ለመርዳት ዝግጁ ነን — Reach us in English or Amharic.</p>
          </div>

          <div className="ah-contact-cols">
            {/* Info card */}
            <div className="ah-contact-card">
              <h3 className="ah-contact-card-title">Contact Us · ያግኙን</h3>
              <p className="ah-contact-card-sub">We respond within 24 hours · በ24 ሰዓት ምላሽ</p>

              <a href="mailto:support@arifhissab.com" className="ah-contact-link">
                <span className="ah-contact-link-icon">✉️</span>
                <span>support@arifhissab.com<span className="ah-contact-link-am">ኢሜይል ድጋፍ</span></span>
              </a>
              <a href="tel:+251911000000" className="ah-contact-link">
                <span className="ah-contact-link-icon">📞</span>
                <span>+251 91 100 0000<span className="ah-contact-link-am">ሰኞ–ዓርብ · 8am–6pm EAT</span></span>
              </a>
              <a href="https://t.me/arifhissab" target="_blank" rel="noopener noreferrer" className="ah-contact-link">
                <span className="ah-contact-link-icon">✈️</span>
                <span>@arifhissab on Telegram<span className="ah-contact-link-am">ቴሌግራም ድጋፍ</span></span>
              </a>
              <div className="ah-contact-link static">
                <span className="ah-contact-link-icon">📍</span>
                <span>Addis Ababa, Ethiopia<span className="ah-contact-link-am">አዲስ አበባ፣ ኢትዮጵያ</span></span>
              </div>
            </div>

            {/* CTA card */}
            <div className="ah-cta-card">
              <div className="ah-cta-emoji">🚀</div>
              <h3 className="ah-cta-title">Ready to get started?</h3>
              <p className="ah-cta-am">ለመጀመር ዝግጁ ነዎት?</p>
              <p className="ah-cta-desc">
                Join hundreds of Ethiopian businesses already using Arif Hissab.
                <span className="ah-cta-am-desc">ብዙ ኢትዮጵያዊ ንግዶች ቀድሞ ያሪፍ ሂሳብን ይጠቀማሉ።</span>
              </p>
              <div className="ah-cta-btns">
                <button className="ah-btn ah-btn-primary ah-btn-full" onClick={() => openModal(false)}>
                  Create Free Account · ነፃ መለያ ፍጠር
                </button>
                <button className="ah-btn ah-btn-ghost ah-btn-full" onClick={() => openModal(true)}>
                  Already have an account? Sign In · ግባ
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════════ */}
      <footer className="ah-footer">
        <div className="ah-container">
          <div className="ah-footer-grid">
            {/* Brand */}
            <div>
              <div className="ah-footer-logo">
                <div className="ah-footer-logo-icon">ሀ</div>
                <div>
                  <div className="ah-footer-logo-name">Arif Hissab</div>
                  <div className="ah-footer-logo-am">አሪፍ ሂሳብ</div>
                </div>
              </div>
              <p className="ah-footer-desc">
                The smart accounting platform for Ethiopian businesses — manage finances in English and Amharic.
              </p>
              <p className="ah-footer-am-desc">ለኢትዮጵያ ንግዶች የሂሳብ ማስተዳደሪያ።</p>
              <div className="ah-footer-flag">
                {[['#078930','green'],['#FCDD09','yellow'],['#DA121A','red']].map(([c, k]) => (
                  <div key={k} className="ah-footer-flag-stripe" style={{ background: c }} />
                ))}
              </div>
            </div>

            {/* Links */}
            {[
              { title: 'Product · ምርት',  links: ['Features · ባህሪያት','Pricing · ዋጋ','Security · ደህንነት','Changelog · ዝማኔዎች'] },
              { title: 'Company · ድርጅት', links: ['About · ስለ እኛ','Blog · ጦማር','Careers · ሥራ','Press · ሚዲያ'] },
              { title: 'Support · ድጋፍ',  links: ['Help Center · እርዳታ','Contact · ያግኙን','Privacy · ግላዊነት','Terms · ውሎች'] },
            ].map((col) => (
              <div key={col.title}>
                <div className="ah-footer-col-title">{col.title}</div>
                {col.links.map((l) => <a key={l} href="#" className="ah-footer-link">{l}</a>)}
              </div>
            ))}
          </div>

          <div className="ah-footer-bottom">
            <p className="ah-footer-copy">
              © 2025 Arif Hissab · አሪፍ ሂሳብ. All rights reserved · መብቱ በህግ የተጠበቀ።
            </p>
            <div className="ah-footer-langs">
              {['🇪🇹 Ethiopia','English','አማርኛ'].map((l) => (
                <span key={l} className="ah-footer-lang">{l}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ════════════════════════════════════════════════════
          AUTH MODAL
      ════════════════════════════════════════════════════ */}
      {showModal && (
        <div className="ah-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="ah-modal" role="dialog" aria-modal="true">

            <button className="ah-modal-close" onClick={closeModal} disabled={loading} aria-label="Close">✕</button>

            <div className="ah-modal-logo">
              <div className="ah-modal-logo-icon">ሀ</div>
              <div>
                <div className="ah-modal-logo-name">Arif Hissab</div>
                <div className="ah-modal-logo-am">አሪፍ ሂሳብ</div>
              </div>
            </div>

            <div className="ah-modal-tabs">
              <button className={`ah-tab${isLogin ? ' active' : ''}`}  onClick={() => switchTab(true)}>Sign In · ግባ</button>
              <button className={`ah-tab${!isLogin ? ' active' : ''}`} onClick={() => switchTab(false)}>Register · ተመዝገብ</button>
            </div>

            <h2 className="ah-modal-title">{isLogin ? 'Welcome back' : 'Create your account'}</h2>
            <p className="ah-modal-sub">{isLogin ? 'ወደ አካውንትዎ ይግቡ' : 'አዲስ መለያ ይፍጠሩ'}</p>

            <form onSubmit={handleAuth} noValidate>
              <div className="ah-field">
                <label className="ah-field-label">Email · ኢሜይል</label>
                <input
                  className="ah-input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  disabled={loading}
                />
              </div>

              <div className="ah-field">
                <label className="ah-field-label">Password · የይለፍ ቃል</label>
                <input
                  className="ah-input"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  disabled={loading}
                />
              </div>

              {!isLogin && (
                <div className="ah-field">
                  <label className="ah-field-label">Confirm Password · ያረጋግጡ</label>
                  <input
                    className="ah-input"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPw}
                    onChange={(e) => setConfirmPw(e.target.value)}
                    autoComplete="new-password"
                    disabled={loading}
                  />
                </div>
              )}

              {authError && <div className="ah-auth-error">⚠️ {authError}</div>}

              <button className="ah-btn ah-btn-primary ah-modal-submit" type="submit" disabled={loading}>
                {loading
                  ? <><span className="ah-spinner" />Processing · በማስኬድ ላይ...</>
                  : isLogin ? 'Sign In · ግባ' : 'Create Account · ተመዝገብ'}
              </button>
            </form>

            <p className="ah-modal-switch">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button className="ah-modal-switch-btn" onClick={() => switchTab(!isLogin)} disabled={loading}>
                {isLogin ? 'Register · ተመዝገብ' : 'Sign In · ግባ'}
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
