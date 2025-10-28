// Merge all emoji sources into one map
let emojiMap = { ...allEmojis };

// Load custom emojis from storage
chrome.storage.sync.get(['customEmojis'], (result) => {
  if (result.customEmojis) {
    emojiMap = { ...emojiMap, ...result.customEmojis };
  }
});

// Listen for storage changes to update custom emojis
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.customEmojis) {
    emojiMap = { ...allEmojis, ...changes.customEmojis.newValue };
  }
});
