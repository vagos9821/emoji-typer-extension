// Popup emoji picker functionality
let currentCategory = 'all';
let customEmojis = {};

// Load custom emojis from storage
chrome.storage.sync.get(['customEmojis'], (result) => {
  if (result.customEmojis) {
    customEmojis = result.customEmojis;
  }
  init();
});

function init() {
  createTabs();
  renderEmojis();

  // Search functionality
  document.getElementById('search').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    filterEmojis(query);
  });

  // Options link
  document.getElementById('optionsLink').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });
}

// Create category tabs
function createTabs() {
  const tabsContainer = document.getElementById('tabs');
  const categories = ['All', ...Object.keys(emojiData)];

  if (Object.keys(customEmojis).length > 0) {
    categories.push('Custom');
  }

  categories.forEach(category => {
    const button = document.createElement('button');
    button.className = 'tab';
    button.textContent = category;
    if (category === 'All') {
      button.classList.add('active');
    }

    button.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      button.classList.add('active');
      currentCategory = category.toLowerCase();
      renderEmojis();
      document.getElementById('search').value = '';
    });

    tabsContainer.appendChild(button);
  });
}

// Render emojis for current category
function renderEmojis() {
  const grid = document.getElementById('emojiGrid');
  grid.innerHTML = '';

  let emojisToRender = [];

  if (currentCategory === 'all') {
    // Show all emojis
    for (const category in emojiData) {
      for (const [name, emoji] of Object.entries(emojiData[category])) {
        emojisToRender.push({ name, emoji });
      }
    }
    // Add custom emojis
    for (const [name, emoji] of Object.entries(customEmojis)) {
      emojisToRender.push({ name, emoji });
    }
  } else if (currentCategory === 'custom') {
    for (const [name, emoji] of Object.entries(customEmojis)) {
      emojisToRender.push({ name, emoji });
    }
  } else {
    // Show specific category
    const categoryKey = Object.keys(emojiData).find(k => k.toLowerCase() === currentCategory);
    if (categoryKey && emojiData[categoryKey]) {
      for (const [name, emoji] of Object.entries(emojiData[categoryKey])) {
        emojisToRender.push({ name, emoji });
      }
    }
  }

  if (emojisToRender.length === 0) {
    grid.innerHTML = '<div class="no-results">No emojis found</div>';
    return;
  }

  emojisToRender.forEach(({ name, emoji }) => {
    const div = document.createElement('div');
    div.className = 'emoji-item';
    div.textContent = emoji;
    div.title = `:${name}`;

    div.addEventListener('click', () => {
      copyToClipboard(emoji);
    });

    grid.appendChild(div);
  });
}

// Filter emojis by search query
function filterEmojis(query) {
  const grid = document.getElementById('emojiGrid');
  grid.innerHTML = '';

  if (!query) {
    renderEmojis();
    return;
  }

  let matches = [];

  // Search in all emojis
  for (const category in emojiData) {
    for (const [name, emoji] of Object.entries(emojiData[category])) {
      if (name.toLowerCase().includes(query)) {
        matches.push({ name, emoji });
      }
    }
  }

  // Search in custom emojis
  for (const [name, emoji] of Object.entries(customEmojis)) {
    if (name.toLowerCase().includes(query)) {
      matches.push({ name, emoji });
    }
  }

  if (matches.length === 0) {
    grid.innerHTML = '<div class="no-results">No emojis found for "' + query + '"</div>';
    return;
  }

  matches.forEach(({ name, emoji }) => {
    const div = document.createElement('div');
    div.className = 'emoji-item';
    div.textContent = emoji;
    div.title = `:${name}`;

    div.addEventListener('click', () => {
      copyToClipboard(emoji);
    });

    grid.appendChild(div);
  });
}

// Copy emoji to clipboard
function copyToClipboard(emoji) {
  navigator.clipboard.writeText(emoji).then(() => {
    // Visual feedback
    const grid = document.getElementById('emojiGrid');
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0,0,0,0.8);
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 14px;
      z-index: 1000;
      pointer-events: none;
    `;
    notification.textContent = `${emoji} copied!`;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 1000);
  });
}
