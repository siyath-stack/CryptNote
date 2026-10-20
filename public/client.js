// public/client.js - Connects directly to server.js
document.addEventListener("DOMContentLoaded", function () {
  let currentPassword = "";

  const unlockBtn = document.getElementById("unlock-btn");
  const masterPasswordInput = document.getElementById("master-password");
  const loginScreen = document.getElementById("login-screen");
  const dashboardScreen = document.getElementById("dashboard-screen");
  const errorAlert = document.getElementById("error-alert");
  const dismissAlertBtn = document.getElementById("dismiss-alert-btn");
  const tryAgainBtn = document.getElementById("try-again-btn");
  const closeModalX = document.getElementById("close-modal-x");
  const entriesDisplay = document.getElementById("entries-display");
  const submitEntryBtn = document.getElementById("submit-entry-btn");
  const entryText = document.getElementById("entry-text");
  const lockBtn = document.getElementById("lock-btn");
  const entryCountLabel = document.getElementById("entry-count");

  // 1. Handle Unlock
  unlockBtn.addEventListener("click", performLogin);

  function performLogin() {
    const passwordInput = masterPasswordInput.value;

    fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: passwordInput })
    })
      .then(response => {
        if (!response.ok) throw new Error("Access Denied");
        return response.json();
      })
      .then(data => {
        currentPassword = passwordInput;
        errorAlert.classList.add("hidden");
        loginScreen.classList.add("hidden");
        dashboardScreen.classList.remove("hidden");
        loadEntries();
      })
      .catch(err => {
        errorAlert.classList.remove("hidden");
      });
  }

  // 2. Hide Modal Handlers
  function hideModal() {
    errorAlert.classList.add("hidden");
    masterPasswordInput.value = "";
    masterPasswordInput.focus();
  }

  dismissAlertBtn.addEventListener("click", hideModal);
  tryAgainBtn.addEventListener("click", hideModal);
  closeModalX.addEventListener("click", hideModal);

  // 3. Load Entries & Update Entry Counter
  function loadEntries() {
    fetch("/api/entries", {
      method: "GET",
      headers: { "password": currentPassword }
    })
      .then(res => res.json())
      .then(data => {
        entriesDisplay.innerHTML = "";
        const entries = data.entries || [];
        
        // Update 5 entries counter label from wireframe
        entryCountLabel.textContent = `${entries.length} entries`;

        if (entries.length === 0) {
          entriesDisplay.innerHTML = '<div class="entry-card"><p>No entries yet. Write your first thought below!</p></div>';
        } else {
          entries.forEach(entry => {
            const card = document.createElement("div");
            card.className = "entry-card";
            card.innerHTML = `
              <span class="timestamp">${escapeHtml(entry.timestamp)}</span>
              <p>${escapeHtml(entry.content)}</p>
            `;
            entriesDisplay.appendChild(card);
          });
        }
      });
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // 4. Submit Entry
  submitEntryBtn.addEventListener("click", function () {
    const contentText = entryText.value;
    if (!contentText.trim()) return;

    fetch("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: currentPassword, content: contentText })
    })
      .then(res => res.json())
      .then(data => {
        entryText.value = "";
        loadEntries();
      });
  });

  // 5. Lock Diary
  lockBtn.addEventListener("click", function () {
    currentPassword = "";
    masterPasswordInput.value = "";
    entriesDisplay.innerHTML = "";
    dashboardScreen.classList.add("hidden");
    loginScreen.classList.remove("hidden");
  });
});