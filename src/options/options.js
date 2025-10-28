// Options page functionality
let customEmojis = {};

// Load custom emojis on page load
document.addEventListener('DOMContentLoaded', () => {
  loadCustomEmojis();
  updateStats();

  // Add emoji button
  document.getElementById('addEmoji').addEventListener('click', addCustomEmoji);

  // Allow Enter key to add emoji
  document.getElementById('emojiName').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addCustomEmoji();
  });
  document.getElementById('emojiValue').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addCustomEmoji();
  });
});

// Load custom emojis from storage
function loadCustomEmojis() {
  chrome.storage.sync.get(['customEmojis'], (result) => {
    customEmojis = result.customEmojis || {};
    renderCustomEmojis();
    updateStats();
  });
}

// Render custom emoji list
function renderCustomEmojis() {
  const list = document.getElementById('customEmojiList');

  if (Object.keys(customEmojis).length === 0) {
    list.innerHTML = '<div class="empty-state">No custom emojis yet. Add one above to get started!</div>';
    return;
  }

  list.innerHTML = '';

  for (const [name, value] of Object.entries(customEmojis)) {
    const item = document.createElement('div');
    item.className = 'custom-emoji-item';

    item.innerHTML = `
      <div class="emoji-display">
        <span class="emoji-char">${value}</span>
        <span class="emoji-code">:${name}</span>
      </div>
      <button class="btn btn-danger" data-name="${name}">Delete</button>
    `;

    // Add delete handler
    const deleteBtn = item.querySelector('.btn-danger');
    deleteBtn.addEventListener('click', () => {
      deleteCustomEmoji(name);
    });

    list.appendChild(item);
  }
}

// Add a new custom emoji
function addCustomEmoji() {
  const nameInput = document.getElementById('emojiName');
  const valueInput = document.getElementById('emojiValue');

  const name = nameInput.value.trim();
  const value = valueInput.value.trim();

  // Validation
  if (!name || !value) {
    showMessage('Please enter both a shortcode and an emoji/text', 'error');
    return;
  }

  // Validate name format (alphanumeric, underscore, dash, plus only)
  if (!/^[a-zA-Z0-9_+-]+$/.test(name)) {
    showMessage('Shortcode can only contain letters, numbers, underscores, hyphens, and plus signs', 'error');
    return;
  }

  // Add to custom emojis
  customEmojis[name] = value;

  // Save to storage
  chrome.storage.sync.set({ customEmojis }, () => {
    if (chrome.runtime.lastError) {
      showMessage('Error saving emoji: ' + chrome.runtime.lastError.message, 'error');
      return;
    }

    showMessage(`Successfully added :${name} → ${value}`, 'success');
    nameInput.value = '';
    valueInput.value = '';
    nameInput.focus();

    renderCustomEmojis();
    updateStats();
  });
}

// Delete a custom emoji
function deleteCustomEmoji(name) {
  if (!confirm(`Delete :${name}?`)) {
    return;
  }

  delete customEmojis[name];

  chrome.storage.sync.set({ customEmojis }, () => {
    if (chrome.runtime.lastError) {
      showMessage('Error deleting emoji: ' + chrome.runtime.lastError.message, 'error');
      return;
    }

    showMessage(`Deleted :${name}`, 'success');
    renderCustomEmojis();
    updateStats();
  });
}

// Show message to user
function showMessage(text, type) {
  const messageDiv = document.getElementById('message');
  messageDiv.textContent = text;
  messageDiv.className = `message ${type}`;
  messageDiv.style.display = 'block';

  setTimeout(() => {
    messageDiv.style.display = 'none';
  }, 3000);
}

// Update statistics
function updateStats() {
  // Count total emojis (from emojiData.js if available)
  let totalCount = 0;
  if (typeof allEmojis !== 'undefined') {
    totalCount = Object.keys(allEmojis).length;
  }

  document.getElementById('totalEmojis').textContent = totalCount;
  document.getElementById('customEmojis').textContent = Object.keys(customEmojis).length;
}
