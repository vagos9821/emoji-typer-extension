// Autocomplete dropdown state
let autocompleteDiv = null;
let currentInput = null;
let currentMatch = null;
let currentMatchPos = -1; // Store the exact position of the match
let selectedIndex = -1;
let suggestions = [];
let justInsertedEmoji = false; // Flag to prevent interference after insertion

// Helper function to count actual visible characters
function countVisibleCharacters(text) {
  // Use Array.from to properly handle multi-byte characters (emojis, etc.)
  const characters = Array.from(text);

  // Count how many are NOT emoji/special Unicode characters
  let visibleAsciiCount = 0;

  for (const char of characters) {
    const code = char.codePointAt(0);
    // Check if it's a regular ASCII printable character (not emoji)
    if (code < 0x1F300 || (code >= 0x0020 && code <= 0x007E)) {
      visibleAsciiCount++;
    }
  }

  // If mostly ASCII characters, it's likely text/ASCII art
  // Otherwise, it's likely a single emoji (even if multi-byte)
  if (visibleAsciiCount > 2) {
    return visibleAsciiCount; // Return ASCII count for text
  }

  // For emojis, return 1 regardless of byte length
  return 1;
}

// Create autocomplete dropdown
function createAutocomplete() {
  if (autocompleteDiv) return autocompleteDiv;

  autocompleteDiv = document.createElement('div');
  autocompleteDiv.className = 'emoji-autocomplete';
  autocompleteDiv.style.display = 'none';
  document.body.appendChild(autocompleteDiv);

  return autocompleteDiv;
}

// Position autocomplete near cursor
function positionAutocomplete(target) {
  if (!autocompleteDiv) return;

  const rect = target.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

  // Try to position below the input
  let top = rect.bottom + scrollTop + 5;
  let left = rect.left + scrollLeft;

  // Adjust if would go off screen
  if (top + 200 > window.innerHeight + scrollTop) {
    top = rect.top + scrollTop - 205; // Position above
  }

  autocompleteDiv.style.top = top + 'px';
  autocompleteDiv.style.left = left + 'px';
}

// Show autocomplete with suggestions
function showAutocomplete(target, query, matchText, matchPos) {
  createAutocomplete();

  // Find matching emojis with priority: exact > startsWith > contains
  const exactMatches = [];
  const startsWithMatches = [];
  const containsMatches = [];
  const lowerQuery = query.toLowerCase();

  for (const [name, emoji] of Object.entries(emojiMap)) {
    const lowerName = name.toLowerCase();

    if (lowerName === lowerQuery) {
      exactMatches.push({ name, emoji });
    } else if (lowerName.startsWith(lowerQuery)) {
      startsWithMatches.push({ name, emoji });
    } else if (lowerName.includes(lowerQuery)) {
      containsMatches.push({ name, emoji });
    }
  }

  // Sort each group alphabetically by name length (shorter first), then alphabetically
  const sortByLength = (a, b) => {
    if (a.name.length !== b.name.length) {
      return a.name.length - b.name.length;
    }
    return a.name.localeCompare(b.name);
  };

  exactMatches.sort(sortByLength);
  startsWithMatches.sort(sortByLength);
  containsMatches.sort(sortByLength);

  // Combine: exact first, then startsWith, then contains
  suggestions = [...exactMatches, ...startsWithMatches, ...containsMatches].slice(0, 10);

  if (suggestions.length === 0) {
    hideAutocomplete();
    return;
  }

  // Render suggestions
  autocompleteDiv.innerHTML = '';
  selectedIndex = -1;

  suggestions.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'emoji-suggestion';

    const emojiSpan = document.createElement('span');
    emojiSpan.className = 'emoji-char';

    // Add 'wide' class for text-based custom emojis (not regular emojis)
    const charCount = countVisibleCharacters(item.emoji);
    if (charCount > 3) {
      emojiSpan.classList.add('wide');
    }

    emojiSpan.textContent = item.emoji;

    const nameSpan = document.createElement('span');
    nameSpan.className = 'emoji-name';
    nameSpan.textContent = `:${item.name}`;

    div.appendChild(emojiSpan);
    div.appendChild(nameSpan);

    div.addEventListener('mouseenter', () => {
      selectedIndex = index;
      updateSelection();
    });

    div.addEventListener('click', () => {
      insertEmoji(target, matchText, item.emoji);
    });

    autocompleteDiv.appendChild(div);
  });

  currentInput = target;
  currentMatch = matchText;
  currentMatchPos = matchPos;
  positionAutocomplete(target);
  autocompleteDiv.style.display = 'block';
}

// Hide autocomplete
function hideAutocomplete() {
  if (autocompleteDiv) {
    autocompleteDiv.style.display = 'none';
  }
  currentInput = null;
  currentMatch = null;
  currentMatchPos = -1;
  selectedIndex = -1;
  suggestions = [];
}

// Update selected item in autocomplete
function updateSelection() {
  const items = autocompleteDiv?.querySelectorAll('.emoji-suggestion');
  if (!items) return;

  items.forEach((item, index) => {
    if (index === selectedIndex) {
      item.classList.add('selected');
    } else {
      item.classList.remove('selected');
    }
  });
}

// Insert emoji at cursor position
function insertEmoji(target, matchText, emoji) {
  const isContentEditable = target.isContentEditable;
  const value = isContentEditable ? target.innerText : target.value;

  // Use the stored match position for accuracy
  const matchPos = currentMatchPos;
  if (matchPos === -1) return;

  // Calculate the end position (where cursor currently is)
  const cursorPos = target.selectionStart || (matchPos + matchText.length);

  const newValue = value.slice(0, matchPos) + emoji + ' ' + value.slice(cursorPos);
  const newCursorPos = matchPos + emoji.length + 1;

  // Set flag to prevent input handler from interfering
  justInsertedEmoji = true;

  if (isContentEditable) {
    target.innerText = newValue;
    // Try to set cursor position for contentEditable
    const range = document.createRange();
    const sel = window.getSelection();
    if (target.firstChild) {
      range.setStart(target.firstChild, Math.min(newCursorPos, target.innerText.length));
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  } else {
    target.value = newValue;
    target.setSelectionRange(newCursorPos, newCursorPos);
  }

  // Trigger input event so the page knows the value changed
  target.dispatchEvent(new Event('input', { bubbles: true }));

  hideAutocomplete();
  target.focus();

  // Reset flag after a short delay
  setTimeout(() => {
    justInsertedEmoji = false;
  }, 100);
}

// Handle keyboard navigation in autocomplete
function handleKeyDown(e) {
  if (!autocompleteDiv || autocompleteDiv.style.display === 'none') {
    return;
  }

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    selectedIndex = Math.min(selectedIndex + 1, suggestions.length - 1);
    updateSelection();
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    selectedIndex = Math.max(selectedIndex - 1, 0);
    updateSelection();
  } else if (e.key === 'Enter' || e.key === 'Tab') {
    if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
      e.preventDefault();
      insertEmoji(currentInput, currentMatch, suggestions[selectedIndex].emoji);
    } else if (suggestions.length > 0) {
      // If no selection, use first suggestion
      e.preventDefault();
      insertEmoji(currentInput, currentMatch, suggestions[0].emoji);
    }
  } else if (e.key === ' ') {
    // Space key: auto-insert first/selected emoji
    if (suggestions.length > 0) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      const emojiToInsert = selectedIndex >= 0 ? suggestions[selectedIndex].emoji : suggestions[0].emoji;
      insertEmoji(currentInput, currentMatch, emojiToInsert);
    }
  } else if (e.key === 'Escape') {
    e.preventDefault();
    hideAutocomplete();
  }
}

// Main input handler
document.addEventListener("input", (e) => {
  // Skip if we just inserted an emoji to prevent interference
  if (justInsertedEmoji) {
    return;
  }

  const target = e.target;
  if (!target || !(target.tagName === "TEXTAREA" || target.tagName === "INPUT" || target.isContentEditable)) {
    return;
  }

  const cursorPos = target.selectionStart;
  const value = target.value ?? target.innerText;

  // Find a ":word" pattern near the cursor
  const beforeCursor = value.slice(0, cursorPos);
  const regex = /:([a-zA-Z0-9_+-]*)$/;
  const match = beforeCursor.match(regex);

  if (match) {
    const query = match[1];
    const matchText = match[0];
    const matchPos = beforeCursor.length - matchText.length;

    // If there's a query, show autocomplete
    if (query.length > 0) {
      showAutocomplete(target, query, matchText, matchPos);
    } else {
      // Just ":" typed, could show all emojis or hide
      hideAutocomplete();
    }

    // Check for exact match and auto-replace
    const emoji = emojiMap[query];
    if (emoji && query.length >= 2) {
      // Auto-complete on space or exact match
      // We'll let the user select from dropdown instead
    }
  } else {
    hideAutocomplete();
  }
});

// Handle keyboard events - use capture phase to intercept before other handlers
document.addEventListener('keydown', handleKeyDown, true);

// Hide autocomplete when clicking outside
document.addEventListener('click', (e) => {
  if (autocompleteDiv && !autocompleteDiv.contains(e.target) && e.target !== currentInput) {
    hideAutocomplete();
  }
});

// Hide autocomplete when scrolling
document.addEventListener('scroll', () => {
  if (currentInput) {
    positionAutocomplete(currentInput);
  }
}, true);

// Handle window resize
window.addEventListener('resize', () => {
  if (currentInput) {
    positionAutocomplete(currentInput);
  }
});
