import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import '../styles/Dashboard.css';

function Dashboard({ user, userData }) {
  const [trialDaysLeft, setTrialDaysLeft] = useState(null);
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    if (userData && userData.trialStartDate) {
      const startDate = new Date(userData.trialStartDate.seconds * 1000);
      const today = new Date();
      const diffTime = userData.trialEndDate.seconds * 1000 - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      setTrialDaysLeft(Math.max(0, diffDays));
      
      // Show payment popup if trial is ending
      if (diffDays <= 0 && !userData.selectedPlan) {
        setShowPaymentInfo(true);
      }
    }
  }, [userData]);

  const handleSelectPlan = async (plan) => {
    setSelectedPlan(plan);
    setShowPaymentInfo(true);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        {/* Trial Banner */}
        <div className="trial-banner">
          <div className="trial-info">
            <h2 className="am">🎉 ነጻ ሙከራ ጊዜ</h2>
            <h2>Free Trial Active</h2>
            {trialDaysLeft !== null && (
              <p className="trial-days">
                ⏰ {trialDaysLeft} days left · {trialDaysLeft > 0 ? 'Enjoy full access!' : 'Choose a plan to continue'}
              </p>
            )}
          </div>
        </div>

        {/* User Info */}
        <div className="user-section">
          <h3>👤 My Account</h3>
          <div className="user-card">
            <p><strong>Name:</strong> {userData?.name}</p>
            <p><strong className="am">ব্যবসা:</strong> {userData?.businessName}</p>
            <p><strong>Email:</strong> {userData?.email}</p>
            {userData?.tin && <p><strong>TIN:</strong> {userData.tin}</p>}
            <p><strong>Status:</strong> {userData?.status === 'active_trial' ? '🎯 Trial' : '✅ Active'}</p>
          </div>
        </div>

        {/* Payment Section - Show if trial ending */}
        {showPaymentInfo && trialDaysLeft <= 0 && (
          <div className="payment-section">
            <h3 className="am">💳 ክፍያ ሂደት</h3>
            <h3>Payment Instructions</h3>
            
            <div className="payment-methods">
              <div className="method">
                <h4>📱 Telebirr</h4>
                <p className="am">ወደ ነጋዴ ቁጥር: [Merchant ID]</p>
                <p>Pay to Merchant ID: [Your ID]</p>
              </div>
              <div className="method">
                <h4>🏦 CBE Bank</h4>
                <p className="am">በሂሳብ: [Account Number]</p>
                <p>Account: [Your Account]</p>
              </div>
              <div className="method">
                <h4>🏦 Bank of Abyssinia</h4>
                <p className="am">በሂሳብ: [Account Number]</p>
                <p>Account: [Your Account]</p>
              </div>
            </div>

            <p className="am">⚠️ ደረሰኝ ከጫኑ በኋላ ከታች ያስቀምጡት</p>
            <p>⚠️ After payment, upload receipt below:</p>
            
            <input 
              type="file" 
              accept="image/*" 
              className="receipt-upload"
              placeholder="Upload receipt screenshot"
            />
            
            <button className="submit-receipt">
              ክፍያውን አሳውቅ / Submit Payment
            </button>
          </div>
        )}

        {/* Plan Selection - Show if no plan selected */}
        {!userData?.selectedPlan && trialDaysLeft <= 0 && (
          <div className="plan-section">
            <h3 className="am">እባክዎ እቅድ ይምረጡ</h3>
            <h3>Choose Your Plan</h3>

            <div className="plan-cards">
              <div className="plan-card">
                <h4>🌱 Basic</h4>
                <p className="price">499 ETB/month</p>
                <ul>
                  <li>1 Branch</li>
                  <li>Full Accounting</li>
                  <li>Invoices & Sales</li>
                </ul>
                <button onClick={() => handleSelectPlan('basic')}>
                  ይምረጡ / Choose
                </button>
              </div>

              <div className="plan-card featured">
                <h4>⭐ Business</h4>
                <p className="price">949 ETB/month</p>
                <ul>
                  <li>Up to 2 Branches</li>
                  <li>Multi-user Access</li>
                  <li>Staff Management</li>
                </ul>
                <button onClick={() => handleSelectPlan('business')}>
                  ይምረጡ / Choose
                </button>
              </div>

              <div className="plan-card">
                <h4>🚀 Enterprise</h4>
                <p className="price">1,449 ETB/month</p>
                <ul>
                  <li>Unlimited Branches</li>
                  <li>Unlimited Users</li>
                  <li>API Access</li>
                </ul>
                <button onClick={() => handleSelectPlan('enterprise')}>
                  ይምረጡ / Choose
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Dashboard Content */}
        {userData?.selectedPlan && (
          <div className="main-dashboard">
            <h3 className="am">📊 ዋና ዳሞ</h3>
            <h3>Main Dashboard</h3>
            
            <div className="dashboard-grid">
              <div className="dashboard-card">
                <h4 className="am">ሽያጭ</h4>
                <h4>Sales</h4>
                <p className="amount">ETB 0</p>
              </div>
              <div className="dashboard-card">
                <h4 className="am">ወጪዎች</h4>
                <h4>Expenses</h4>
                <p className="amount">ETB 0</p>
              </div>
              <div className="dashboard-card">
                <h4 className="am">ትርፍ</h4>
                <h4>Profit</h4>
                <p className="amount">ETB 0</p>
              </div>
              <div className="dashboard-card">
                <h4>Your Plan</h4>
                <p className="amount">{userData.selectedPlan.toUpperCase()}</p>
              </div>
            </div>

            <p className="note">
              <span className="am">💡 ሙሉ ሰሌዳ በ Arif Hissab App ይገኛሉ</span>
              <br/>
              Full dashboard available in Arif Hissab App
            </p>
          </div>
        )}

        {/* Link to App */}
        <div className="app-link">
          <p className="am">📱 ሙሉ መገናኛ ወደ Arif Hissab App ይሂዱ</p>
          <p>📱 Go to Arif Hissab App for full features</p>
          <a href="https://arif-hissab.vercel.app/app" target="_blank" rel="noopener noreferrer">
            ወደ ተግባር ሂደት / Open App →
          </a>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
