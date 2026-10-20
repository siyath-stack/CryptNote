// public/client.js - CryptNote Frontend Logic
\$(document).ready(function () {
  let currentPassword = "";

  // 1. Handle Unlock Button Click
  \$("#unlock-btn").click(function () {
    const passwordInput = \$("#master-password").val();

    \$.ajax({
      url: "/api/login",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ password: passwordInput }),
      success: function (response) {
        currentPassword = passwordInput;
        \$("#error-alert").addClass("hidden");
        \$("#login-screen").addClass("hidden");
        \$("#dashboard-screen").removeClass("hidden");
        loadEntries();
      },
      error: function () {
        \$("#error-alert").removeClass("hidden");
      }
    });
  });

  // 2. Hide Error Alert
  \$("#dismiss-alert-btn").click(function () {
    \$("#error-alert").addClass("hidden");
    \$("#master-password").val("").focus();
  });

  // 3. Load Diary Entries from Backend Server
  function loadEntries() {
    \$.ajax({
      url: "/api/entries",
      method: "GET",
      headers: { password: currentPassword },
      success: function (response) {
        const display = \$("#entries-display").empty();
        if (response.entries.length === 0) {
          display.append('<p class="subtitle">No diary entries yet. Write your first note below!</p>');
        } else {
          response.entries.forEach(entry => {
            display.append(`
              <div class="entry-card">
                <span class="timestamp">${entry.timestamp}</span>
                <p>${escapeHtml(entry.content)}</p>
              </div>
            `);
          });
        }
      }
    });
  }

  // Helper function to prevent HTML injection in entries
  function escapeHtml(text) {
    return \$('<div>').text(text).html();
  }

  // 4. Submit New Entry
  \$("#submit-entry-btn").click(function () {
    const contentText = \$("#entry-text").val();
    if (!contentText.trim()) return;

    \$.ajax({
      url: "/api/entries",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ password: currentPassword, content: contentText }),
      success: function () {
        \$("#entry-text").val("");
        loadEntries();
      }
    });
  });

  // 5. Lock Diary Functionality (Clears DOM data for privacy)
  \$("#lock-btn").click(function () {
    currentPassword = "";
    \$("#master-password").val("");
    \$("#entries-display").empty();
    \$("#dashboard-screen").addClass("hidden");
    \$("#login-screen").removeClass("hidden");
  });
});