import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  return (
    <div className="home">
      {/* Flag stripe */}
      <div className="flag-stripe">
        <div className="fs-g"></div>
        <div className="fs-y"></div>
        <div className="fs-r"></div>
      </div>

      {/* Header */}
      <header className="header">
        <div className="header-container">
          <div className="logo">
            <div className="logo-icon">AH</div>
            <div>
              <div>ARIF HISSAB</div>
              <div className="am">አሪፍ ሂሳብ</div>
            </div>
          </div>
          <nav className="nav-links">
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#contact">Contact</a>
          </nav>
          <Link to="/login" className="cta-button">
            አሁኑኑ ይመዝገቡ / Sign Up
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <h1>🎉 አሪፍ ሂሳብ</h1>
        <div className="am">ለኢትዮጵያ ንግዶች የተዘጋጀ ዘመናዊ የሂሳብ አያያዝ</div>
        <p>Manage your business finances with ease. Track sales, expenses, inventory, and taxes — all in one app. Compatible with ERCA regulations.</p>
        
        <div className="hero-buttons">
          <Link to="/register" className="btn-primary">
            📱 መተግበሪያውን ይክፈቱ / Open App
          </Link>
          <a href="#features" className="btn-secondary">
            🎥 Demo ይመልከቱ / Watch Demo
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="section-title">
          <h2>ዋና ዋና አገልግሎቶች / Key Features</h2>
          <div className="am">እንደ ይህ ማዉቁ</div>
          <p>Everything you need to run your business</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🧾</div>
            <h3>ሽያጭ & ፋክቱር</h3>
            <div className="am">Invoices & Sales</div>
            <p>Create professional invoices with automatic VAT 15% calculation</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>ሪፖርቶች</h3>
            <div className="am">Reports & Analytics</div>
            <p>Get insights with profit/loss reports and tax summaries</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>ደሞዝ</h3>
            <div className="am">Payroll & Tax</div>
            <p>Calculate salaries with PIT, WHT, and pension deductions</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI Assistant</h3>
            <div className="am">ብቁ አለ</div>
            <p>Ask tax questions in Amharic and get instant answers</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing">
        <div className="section-title">
          <h2>የዋጋ ዝርዝር / Simple Pricing</h2>
          <div className="am">ለሁሉም ንግዶች መፍትሄ</div>
        </div>
        
        <div className="pricing-grid">
          {/* Basic */}
          <div className="pricing-card">
            <div className="plan-name">🌱 Basic</div>
            <div className="plan-price">499<small> ETB/month</small></div>
            <ul className="plan-features">
              <li>✅ 1 Branch</li>
              <li>✅ Full Accounting</li>
              <li>✅ Invoices & Sales</li>
              <li>✅ Expense Tracking</li>
              <li>✅ VAT Reports</li>
            </ul>
            <Link to="/register" className="plan-button">ይምረጡ / Choose</Link>
          </div>
          
          {/* Business (Featured) */}
          <div className="pricing-card featured">
            <div className="plan-name">⭐ Business</div>
            <div className="plan-price">949<small> ETB/month</small></div>
            <ul className="plan-features">
              <li>✅ Up to 2 Branches</li>
              <li>✅ Multi-user Access</li>
              <li>✅ Full Accounting</li>
              <li>✅ Staff Management</li>
              <li>✅ Advanced Reports</li>
              <li>✅ Priority Support</li>
            </ul>
            <Link to="/register" className="plan-button">ይምረጡ / Choose</Link>
          </div>
          
          {/* Enterprise */}
          <div className="pricing-card">
            <div className="plan-name">🚀 Enterprise</div>
            <div className="plan-price">1,449<small> ETB/month</small></div>
            <ul className="plan-features">
              <li>✅ Unlimited Branches</li>
              <li>✅ Unlimited Users</li>
              <li>✅ Custom Integrations</li>
              <li>✅ API Access</li>
              <li>✅ Dedicated Support</li>
              <li>✅ Training Included</li>
            </ul>
            <Link to="/register" className="plan-button">ይምረጡ / Choose</Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="features">
        <div className="section-title">
          <h2>ያግኙን / Get Support</h2>
          <div className="am">ሁሉም ጊዜ እንደገና ተገናኘናል</div>
          <p>We're here to help you succeed with Arif Hissab</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>Telegram Bot</h3>
            <div className="am">ቦት ሩዝምሮ</div>
            <p><a href="https://t.me/Arifhissabbot" style={{color: 'var(--green)', textDecoration: 'none'}}>@Arifhissabbot</a> - Get instant help & tutorials</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Community</h3>
            <div className="am">ማህበረሰብ</div>
            <p><a href="https://t.me/arifhissab" style={{color: 'var(--green)', textDecoration: 'none'}}>Join Telegram Group</a> - Connect with other users</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📧</div>
            <h3>Email Support</h3>
            <div className="am">ኢሜይል ድጋፍ</div>
            <p><a href="mailto:support@arifhissab.com" style={{color: 'var(--green)', textDecoration: 'none'}}>support@arifhissab.com</a> - 24/7 assistance</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>WhatsApp</h3>
            <div className="am">ዋትስአፕ</div>
            <p><a href="https://wa.me/message/N4ACJHXPNPCYD1" style={{color: 'var(--green)', textDecoration: 'none'}}>Chat on WhatsApp</a> - Quick support</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-links">
            <a href="https://t.me/Arifhissabbot">🤖 Telegram Bot</a>
            <a href="https://t.me/arifhissab">💬 Telegram Group</a>
            <a href="https://instagram.com/arifhissab">📸 Instagram</a>
            <a href="https://youtube.com/@arifhissab">🎥 YouTube</a>
            <a href="/privacy">🔒 Privacy Policy</a>
            <a href="/terms">📋 Terms & Conditions</a>
            <a href="mailto:support@arifhissab.com">📧 Support</a>
            <a href="https://wa.me/message/N4ACJHXPNPCYD1">💬 WhatsApp</a>
          </div>
          <p>🇪🇹 Arif Hissab · Made for Ethiopia · ለኢትዮጵያ የተሰራ · v1.0</p>
          <p>© 2026 Ethio Digital Solutions. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
