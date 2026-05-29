import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Lock, Wallet, Send, RefreshCw, LogOut, UserPlus, LogIn, ShieldAlert, History, UserCheck } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:5000/api';

export default function App() {
  const [authChoice, setAuthChoice] = useState(null); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({ username: '', account_number: '' });
  
  const [loginFields, setLoginFields] = useState({ username: '', password: '' });
  const [signUpFields, setSignUpFields] = useState({ username: '', password: '', name: '', age: '', city: '' });
  
  const [balance, setBalance] = useState(0);
  const [activeTab, setActiveTab] = useState('balance');
  const [amount, setAmount] = useState('');
  const [receiver, setReceiver] = useState('');
  const [passwordForm, setPasswordForm] = useState({ old: '', new: '', confirm: '' });
  
  const [history, setHistory] = useState([]);
  const [profile, setProfile] = useState({ name: '', age: '', city: '', account_number: '' });
  const [uiMessage, setUiMessage] = useState({ text: '', isError: false });

  const displayMsg = (text, isError = false) => {
    setUiMessage({ text, isError });
    setTimeout(() => setUiMessage({ text: '', isError: false }), 6000);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/signup`, signUpFields);
      if (res.data.success) {
        displayMsg(`Username Unique! Generated Account No: ${res.data.account_number}. Please SignIn.`, false);
        setAuthChoice('signin');
      }
    } catch (err) {
      displayMsg(err.response?.data?.message || "Registration halted.", true);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/login`, loginFields);
      if (res.data.success) {
        setUser({ username: res.data.username, account_number: res.data.account_number });
        setIsLoggedIn(true);
        displayMsg("Successfully Signed In!");
      }
    } catch (err) {
      displayMsg(err.response?.data?.message || "SignIn Failed.", true);
    }
  };

  const fetchBalance = async () => {
    if (!isLoggedIn) return;
    try {
      const res = await axios.post(`${API_BASE}/balance`, user);
      setBalance(res.data.balance);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.post(`${API_BASE}/history`, user);
      setHistory(res.data.history || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await axios.post(`${API_BASE}/profile`, user);
      setProfile(res.data.profile);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchBalance();
      if (activeTab === 'history') fetchHistory();
      if (activeTab === 'profile') fetchProfile();
    }
  }, [isLoggedIn, activeTab]);

  const handleAction = async (endpoint, payload) => {
    try {
      const res = await axios.post(`${API_BASE}/${endpoint}`, { ...user, ...payload });
      if (res.data.success) {
        displayMsg(res.data.message, false);
        setAmount('');
        setReceiver('');
        setPasswordForm({ old: '', new: '', confirm: '' });
        fetchBalance();
      } else {
        displayMsg(res.data.message, true);
      }
    } catch (err) {
      displayMsg(err.response?.data?.message || "Operation encountered an error.", true);
    }
  };

  if (!isLoggedIn && !authChoice) {
    return (
      <div style={{ maxWidth: '400px', margin: '100px auto', padding: '35px', border: '1px solid #e2e8f0', borderRadius: '16px', background: '#fff', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h1 style={{ color: '#1e3a8a', margin: '0 0 10px 0' }}>🏦 FinVault</h1>
        <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '30px' }}>Welcome to FinVault India Core Banking Portal</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <button onClick={() => setAuthChoice('signup')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '14px', background: '#1e3a8a', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
            <UserPlus size={18}/> 1. SignUp (New Account registration)
          </button>
          <button onClick={() => setAuthChoice('signin')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '14px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
            <LogIn size={18}/> 2. SignIn (Access Wallet)
          </button>
        </div>
      </div>
    );
  }

  if (!isLoggedIn && authChoice === 'signup') {
    return (
      <div style={{ maxWidth: '450px', margin: '50px auto', padding: '30px', border: '1px solid #e2e8f0', borderRadius: '16px', background: '#fff', fontFamily: 'sans-serif' }}>
        <h2 style={{ color: '#1e3a8a', marginBottom: '5px' }}>New Customer SignUp</h2>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '25px' }}>Fill all parameters required to register node</p>
        {uiMessage.text && <div style={{ padding: '10px', borderRadius: '6px', background: '#fef2f2', color: '#dc2626', marginBottom: '15px', fontWeight: 'bold' }}>{uiMessage.text}</div>}
        
        <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <input type="text" placeholder="Create Username" required onChange={e => setSignUpFields({...signUpFields, username: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
          <input type="password" placeholder="Enter Your Password" required onChange={e => setSignUpFields({...signUpFields, password: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
          <input type="text" placeholder="Enter Your Full Name" required onChange={e => setSignUpFields({...signUpFields, name: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
          <input type="number" placeholder="Enter Your Age" required onChange={e => setSignUpFields({...signUpFields, age: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
          <input type="text" placeholder="Enter Your City" required onChange={e => setSignUpFields({...signUpFields, city: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
          
          <button type="submit" style={{ padding: '12px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', marginTop: '5px' }}>Commit Details</button>
          <button type="button" onClick={() => setAuthChoice(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', textDecoration: 'underline' }}>Return to Options</button>
        </form>
      </div>
    );
  }

  if (!isLoggedIn && authChoice === 'signin') {
    return (
      <div style={{ maxWidth: '400px', margin: '100px auto', padding: '30px', border: '1px solid #e2e8f0', borderRadius: '16px', background: '#fff', fontFamily: 'sans-serif' }}>
        <h2 style={{ color: '#0284c7', marginBottom: '5px' }}>Customer SignIn</h2>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>Access registered ecosystem terminal instance</p>
        {uiMessage.text && <div style={{ padding: '10px', borderRadius: '6px', background: uiMessage.isError ? '#fef2f2' : '#f0fdf4', color: uiMessage.isError ? '#dc2626' : '#16a34a', marginBottom: '15px', fontWeight: 'bold' }}>{uiMessage.text}</div>}
        
        <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input type="text" placeholder="Enter username" required onChange={e => setLoginFields({...loginFields, username: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
          <input type="password" placeholder="Enter Your Password" required onChange={e => setLoginFields({...loginFields, password: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
          <button type="submit" style={{ padding: '12px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Access Vault</button>
          <button type="button" onClick={() => setAuthChoice(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', textDecoration: 'underline' }}>Return to Options</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '850px', margin: '40px auto', padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#0f172a' }}>Greetings! What banking service are you looking for?</h2>
          <span style={{ fontSize: '14px', color: '#64748b' }}>Ecosystem Token: <b>{user.username}</b> | Active Account Ref: <b>{user.account_number}</b></span>
        </div>
        <button onClick={() => { setIsLoggedIn(false); setAuthChoice(null); }} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}><LogOut size={16}/> 8. Sign Out</button>
      </header>

      {uiMessage.text && <div style={{ padding: '12px', borderRadius: '8px', background: uiMessage.isError ? '#fef2f2' : '#f0fdf4', color: uiMessage.isError ? '#dc2626' : '#16a34a', marginBottom: '20px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}><ShieldAlert size={18}/>{uiMessage.text}</div>}

      <div style={{ background: '#0f172a', color: '#fff', padding: '30px', borderRadius: '12px', marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ margin: 0, opacity: 0.7, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}><Wallet size={16}/> 1. Balance Enquiry</p>
          <h1 style={{ fontSize: '3rem', margin: '10px 0 0 0', fontWeight: '700' }}>₹{balance.toLocaleString('en-IN')}.00</h1>
        </div>
        <button onClick={fetchBalance} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', padding: '10px', borderRadius: '50%', color: '#fff', cursor: 'pointer' }}><RefreshCw size={20}/></button>
      </div>

      <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px', marginBottom: '20px', overflowX: 'auto' }}>
        {[
          { id: 'balance', label: '1. Balance Enquiry' },
          { id: 'deposit', label: '2. Deposit' },
          { id: 'withdraw', label: '3. Withdrawal' },
          { id: 'transfer', label: '4. Fund Transfer' },
          { id: 'history', label: '5. Transaction History' },
          { id: 'profile', label: '6. View My Profile' },
          { id: 'settings', label: '7. Reset Password' }
        ].map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '10px 16px', background: activeTab === tab.id ? '#0f172a' : 'transparent', color: activeTab === tab.id ? '#fff' : '#64748b', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', whiteSpace: 'nowrap' }}>{tab.label}</button>
        ))}
      </div>

      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '24px', borderRadius: '12px' }}>
        {activeTab === 'balance' && (
          <div>
            <h4>Liquid Account Allocation Metric</h4>
            <p style={{ color: '#475569', fontSize: '16px' }}>Database record clearing updates total current liquid asset values to: <b style={{color: '#16a34a'}}>₹{balance.toLocaleString('en-IN')}.00 INR</b></p>
          </div>
        )}

        {activeTab === 'deposit' && (
          <div>
            <h4 style={{ margin: '0 0 15px 0' }}>2. Deposit Capital</h4>
            <input type="number" placeholder="Enter amount in numbers ONLY" value={amount} onChange={e => setAmount(e.target.value)} style={{ padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', width: '250px', marginRight: '10px' }} />
            <button onClick={() => handleAction('deposit', { amount })} style={{ padding: '10px 20px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Deposit Amount</button>
          </div>
        )}

        {activeTab === 'withdraw' && (
          <div>
            <h4 style={{ margin: '0 0 15px 0' }}>3. Capital Withdrawal Request</h4>
            <input type="number" placeholder="Enter amount in numbers ONLY" value={amount} onChange={e => setAmount(e.target.value)} style={{ padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', width: '250px', marginRight: '10px' }} />
            <button onClick={() => handleAction('withdraw', { amount })} style={{ padding: '10px 20px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Withdraw Amount</button>
          </div>
        )}

        {activeTab === 'transfer' && (
          <div>
            <h4 style={{ margin: '0 0 15px 0' }}>4. Fund Transfer (Inter-Account)</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '350px' }}>
              <input type="number" placeholder="Enter Receiver's Account Number" value={receiver} onChange={e => setReceiver(e.target.value)} style={{ padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
              <input type="number" placeholder="Enter amount to transfer" value={amount} onChange={e => setAmount(e.target.value)} style={{ padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
              <button onClick={() => handleAction('transfer', { receiver, amount })} style={{ padding: '10px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', fontWeight: '600' }}><Send size={16}/> Execute Transfer</button>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            <h4 style={{ margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '6px' }}><History size={18}/> 5. Transaction History Journal</h4>
            {history.length === 0 ? <p style={{color: '#64748b'}}>No transaction tables returned for node layout instance.</p> : (
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', background: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
                <thead>
                  <tr style={{ background: '#0f172a', color: '#fff', textAlign: 'left' }}>
                    <th style={{ padding: '12px' }}>Timestamp</th>
                    <th style={{ padding: '12px' }}>Account Reference</th>
                    <th style={{ padding: '12px' }}>Remarks Log</th>
                    <th style={{ padding: '12px' }}>Value Delta</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '12px', fontSize: '13px' }}>{row[0]}</td>
                      <td style={{ padding: '12px' }}>{row[1]}</td>
                      <td style={{ padding: '12px', color: '#475569' }}>{row[2]}</td>
                      <td style={{ padding: '12px', fontWeight: '600', color: row[2].includes('withdrawn') || row[2].includes('to') ? '#dc2626' : '#16a34a' }}>
                        {row[2].includes('withdrawn') || row[2].includes('to') ? '-' : '+'}₹{Number(row[3]).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', maxWidth: '400px' }}>
            <h4 style={{ margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '6px', color: '#1e3a8a' }}><UserCheck size={18}/> 6. Customer Specification Profile</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '15px' }}>
              <div><span style={{ color: '#64748b' }}>Account Holder:</span> <b>{profile.name}</b></div>
              <div><span style={{ color: '#64748b' }}>User Identifier:</span> <code>{user.username}</code></div>
              <div><span style={{ color: '#64748b' }}>Age Metric:</span> <b>{profile.age} Years</b></div>
              <div><span style={{ color: '#64748b' }}>City Node:</span> <b>{profile.city}</b></div>
              <div><span style={{ color: '#64748b' }}>Assigned Routing No:</span> <b style={{ color: '#0284c7' }}>{profile.account_number}</b></div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h4 style={{ margin: '0 0 15px 0' }}>7. Reset Password Parameter</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '350px' }}>
              <input type="password" placeholder="Enter your current password" value={passwordForm.old} onChange={e => setPasswordForm({...passwordForm, old: e.target.value})} style={{ padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
              <input type="password" placeholder="Enter new password" value={passwordForm.new} onChange={e => setPasswordForm({...passwordForm, new: e.target.value})} style={{ padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
              <input type="password" placeholder="Confirm new password" value={passwordForm.confirm} onChange={e => setPasswordForm({...passwordForm, confirm: e.target.value})} style={{ padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px' }} />
              <button onClick={() => {
                if (passwordForm.new !== passwordForm.confirm) return displayMsg("Passwords do not match. Try again!", true);
                handleAction('reset-password', { old_password: passwordForm.old, new_password: passwordForm.new });
              }} style={{ padding: '10px', background: '#64748b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Update Credentials</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}