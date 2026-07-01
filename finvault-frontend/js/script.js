/* FinVault — vanilla JS frontend
   No frameworks: plain fetch() calls against the Flask API,
   simple view-toggling for routing, no build step required. */


(function () {
  "use strict";

  const API_BASE = "http://127.0.0.1:5000/api";

  /** Current signed-in user session (kept in memory only). */
  let session = { username: null, account_number: null };

  
  const views = {
    choice: document.getElementById("view-choice"),
    signup: document.getElementById("view-signup"),
    signin: document.getElementById("view-signin"),
    dashboard: document.getElementById("view-dashboard"),
  };

  function showView(name) {
    Object.values(views).forEach((el) => el.classList.add("hidden"));
    views[name].classList.remove("hidden");
  }

  document.querySelectorAll("[data-nav]").forEach((el) => {
    el.addEventListener("click", () => showView(el.dataset.nav));
  });

  
  // Toast messages
  
  const toastEl = document.getElementById("toast");
  let toastTimer = null;

  function showToast(text, isError) {
    clearTimeout(toastTimer);
    toastEl.textContent = text;
    toastEl.classList.remove("is-error", "is-success");
    toastEl.classList.add(isError ? "is-error" : "is-success", "is-visible");
    toastTimer = setTimeout(() => toastEl.classList.remove("is-visible"), 4500);
  }

  
  // API helper
  
  async function apiPost(endpoint, payload) {
    const res = await fetch(`${API_BASE}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    let data;
    try {
      data = await res.json();
    } catch (e) {
      throw new Error("Unexpected response from server.");
    }
    if (!res.ok && data.message === undefined) {
      throw new Error("Something went wrong. Please try again.");
    }
    return data;
  }

  function formToObject(form) {
    const out = {};
    new FormData(form).forEach((value, key) => (out[key] = value));
    return out;
  }

  
  // Sign up
  
  document.getElementById("form-signup").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const fields = formToObject(form);
    try {
      const data = await apiPost("signup", fields);
      if (data.success) {
        showToast(`Account created! Your account number is ${data.account_number}. Please sign in.`, false);
        form.reset();
        showView("signin");
      } else {
        showToast(data.message || "Could not create account.", true);
      }
    } catch (err) {
      showToast(err.message, true);
    }
  });

  
  // Sign in
  
  document.getElementById("form-signin").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const fields = formToObject(form);
    try {
      const data = await apiPost("login", fields);
      if (data.success) {
        session = { username: data.username, account_number: data.account_number };
        form.reset();
        enterDashboard();
      } else {
        showToast(data.message || "Sign in failed.", true);
      }
    } catch (err) {
      showToast(err.message, true);
    }
  });

  
  // Dashboard entry / sign out
  
  function enterDashboard() {
    document.getElementById("topbar-username").textContent = session.username;
    document.getElementById("topbar-account").textContent = session.account_number;
    showView("dashboard");
    setActiveTab("balance");
    refreshBalance();
    showToast("Vault unlocked. Welcome back!", false);
  }

  document.getElementById("btn-signout").addEventListener("click", () => {
    session = { username: null, account_number: null };
    showView("choice");
  });

  
  // Tab navigation
  
  const navItems = document.querySelectorAll(".dial-nav__item");
  const panels = {
    balance: document.getElementById("panel-balance"),
    deposit: document.getElementById("panel-deposit"),
    withdraw: document.getElementById("panel-withdraw"),
    transfer: document.getElementById("panel-transfer"),
    history: document.getElementById("panel-history"),
    profile: document.getElementById("panel-profile"),
    settings: document.getElementById("panel-settings"),
  };

  function setActiveTab(tab) {
    navItems.forEach((item) => item.classList.toggle("is-active", item.dataset.tab === tab));
    Object.entries(panels).forEach(([key, el]) => el.classList.toggle("hidden", key !== tab));

    if (tab === "history") loadHistory();
    if (tab === "profile") loadProfile();
  }

  navItems.forEach((item) => {
    item.addEventListener("click", () => setActiveTab(item.dataset.tab));
  });

  
  // Balance
  
  const balanceAmountEl = document.getElementById("balance-amount");

  function formatINR(value) {
    const num = Number(value) || 0;
    return num.toLocaleString("en-IN", { maximumFractionDigits: 2 });
  }

  async function refreshBalance() {
    try {
      const data = await apiPost("balance", session);
      if (data.success) balanceAmountEl.textContent = formatINR(data.balance);
    } catch (err) {
      showToast(err.message, true);
    }
  }

  document.getElementById("btn-refresh").addEventListener("click", refreshBalance);

  
  // Deposit / withdraw / transfer
  
  async function runAction(endpoint, extraFields, onSuccess) {
    try {
      const data = await apiPost(endpoint, { ...session, ...extraFields });
      showToast(data.message, !data.success);
      if (data.success) {
        refreshBalance();
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      showToast(err.message, true);
    }
  }

  document.getElementById("form-deposit").addEventListener("submit", (e) => {
    e.preventDefault();
    const { amount } = formToObject(e.target);
    runAction("deposit", { amount }, () => e.target.reset());
  });

  document.getElementById("form-withdraw").addEventListener("submit", (e) => {
    e.preventDefault();
    const { amount } = formToObject(e.target);
    runAction("withdraw", { amount }, () => e.target.reset());
  });

  document.getElementById("form-transfer").addEventListener("submit", (e) => {
    e.preventDefault();
    const { receiver, amount } = formToObject(e.target);
    runAction("transfer", { receiver, amount }, () => e.target.reset());
  });

  
  // History
  
  const historyBody = document.getElementById("history-body");
  const historyEmpty = document.getElementById("history-empty");
  const historyTable = document.getElementById("history-table");

  async function loadHistory() {
    try {
      const data = await apiPost("history", session);
      const rows = data.history || [];
      historyBody.innerHTML = "";

      if (rows.length === 0) {
        historyEmpty.classList.remove("hidden");
        historyTable.classList.add("hidden");
        return;
      }

      historyEmpty.classList.add("hidden");
      historyTable.classList.remove("hidden");

      rows.forEach((row) => {
        const [timestamp, accountNo, remarks, amount] = row;
        const isDebit = /withdrawn|to /i.test(remarks);
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${escapeHtml(timestamp)}</td>
          <td class="mono">${escapeHtml(accountNo)}</td>
          <td>${escapeHtml(remarks)}</td>
          <td class="${isDebit ? "amount-debit" : "amount-credit"}">${isDebit ? "-" : "+"}&#8377;${formatINR(amount)}</td>
        `;
        historyBody.appendChild(tr);
      });
    } catch (err) {
      showToast(err.message, true);
    }
  }

  function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = String(value);
    return div.innerHTML;
  }

  
  // Profile
  
  async function loadProfile() {
    try {
      const data = await apiPost("profile", session);
      if (!data.success) return;
      const p = data.profile;
      document.getElementById("profile-name").textContent = p.name;
      document.getElementById("profile-username").textContent = session.username;
      document.getElementById("profile-age").textContent = p.age;
      document.getElementById("profile-city").textContent = p.city;
      document.getElementById("profile-account").textContent = p.account_number;
    } catch (err) {
      showToast(err.message, true);
    }
  }

  // Reset password 

  document.getElementById("form-settings").addEventListener("submit", (e) => {
    e.preventDefault();
    const { old, new: newPassword, confirm } = formToObject(e.target);
    if (newPassword !== confirm) {
      showToast("New password and confirmation do not match.", true);
      return;
    }
    runAction("reset-password", { old_password: old, new_password: newPassword }, () => e.target.reset());
  });
})();