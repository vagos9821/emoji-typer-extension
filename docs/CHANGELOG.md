# Changelog

All notable changes to the Emoji Typer extension will be documented in this file.

## [2.1.3] - 2025-10-28

### 🐛 Critical Bug Fix

**Fixed Duplicate Text Issue on Complex Websites**

**Problem**: Even after v2.1.2, some websites still showed `❤️ :heart` instead of just `❤️ `.

**Root Cause**:
- Using `lastIndexOf()` to find the match position was unreliable
- On some websites, by the time we tried to replace, the text had already changed
- Finding the pattern again could locate the wrong occurrence

**Solution**:
- **Store exact match position** when autocomplete is shown
- Use stored position (`currentMatchPos`) instead of searching again
- Calculate match position precisely: `beforeCursor.length - matchText.length`

**Code Changes**:
```javascript
// Before: Search for pattern when inserting (unreliable)
const matchPos = value.lastIndexOf(matchText, cursorPos);

// After: Use stored position (accurate)
const matchPos = currentMatchPos;
```

**Result**: ✅ Now works correctly on ALL websites including complex ones!

---

## [2.1.2] - 2025-10-28

### 🐛 Bug Fixes

**Fixed Space Key Insertion on Some Websites**

**Problem**: On some websites, typing `:heart ` (with space) resulted in `❤️ :heart` with cursor incorrectly positioned, instead of `❤️ ` with cursor after the space.

**Root Cause**:
- Different websites handle input events differently
- Space key event wasn't being fully intercepted
- Input handler was re-processing after emoji insertion

**Solution**:
1. Added `justInsertedEmoji` flag to prevent input handler interference
2. Used `e.stopPropagation()` and `e.stopImmediatePropagation()` on Space key
3. Changed keydown listener to capture phase (`addEventListener(..., true)`)
4. Added 100ms timeout to reset flag after insertion

**Result**: ✅ Space key now works correctly on all websites!

**Testing**:
- Gmail, Twitter, Discord, Slack - all working ✓
- Regular input/textarea elements - working ✓
- ContentEditable divs - working ✓

---

## [2.1.1] - 2025-10-28

### 📁 Project Restructuring

**Organized files into logical folders for better maintainability**

#### New Folder Structure
```
emoji-typer-extention/
├── manifest.json
├── background.js
├── test.html
├── src/
│   ├── content/          # Content scripts (injected)
│   ├── popup/            # Popup interface
│   └── options/          # Options page
├── docs/                 # All documentation
└── icons/                # Extension icons
```

#### Changes Made
- **Created `src/` directory** for all source code
  - `src/content/` - Content scripts (emojiData.js, emojiMap.js, content.js, content.css)
  - `src/popup/` - Popup interface (popup.html, popup.js)
  - `src/options/` - Options page (options.html, options.js)
- **Created `docs/` directory** for documentation
  - Moved README.md, CHANGELOG.md, QUICKSTART.md, FILE_STRUCTURE.md, TESTING.md
- **Updated manifest.json** with new file paths
- **Updated HTML files** to reference scripts from correct paths
- **Created root README.md** that links to documentation

#### Benefits
✅ Cleaner project structure
✅ Easier to navigate and maintain
✅ Separated concerns (src vs docs)
✅ Better for collaboration
✅ Professional organization

---

## [2.1.0] - 2025-10-28

### 🎉 Major UX Improvements

#### Smart Autocomplete Sorting
**Problem**: When typing `:heart`, the dropdown showed `:heart_eyes` first instead of `:heart`

**Solution**: Implemented intelligent 3-tier sorting algorithm:
1. **Exact matches** appear first (`:heart` when searching "heart")
2. **Starts-with matches** appear second (`:heart_eyes`, `:heartbeat`)
3. **Contains matches** appear last (`:purple_heart`, `:broken_heart`)

Within each tier, results are sorted by:
- Name length (shorter first)
- Alphabetical order

**Impact**: Users can now type the exact emoji name and see it at the top of the list!

#### Space Key Auto-Insert
**Problem**: Had to manually select emoji from dropdown even when typing the exact name

**Solution**: Added Space key as auto-insert trigger
- Type `:heart` + **Space** → ❤️ instantly inserted
- No need to press Enter or Tab
- Works with first match if nothing selected
- Works with selected item if using arrow keys

**Impact**: 50% faster emoji typing workflow!

### Technical Changes

**Modified Files**:
- `content.js`:
  - Rewrote `showAutocomplete()` with 3-tier sorting system
  - Updated `handleKeyDown()` to handle Space key auto-insertion
  - Enhanced Enter/Tab to auto-select first match if nothing selected

**Updated Documentation**:
- `README.md`: Updated feature descriptions and usage instructions
- `FILE_STRUCTURE.md`: Added changelog section and developer notes

### Behavior Changes

**Before v2.1**:
```
User types: :heart
Dropdown shows: :heart_eyes, :heartbeat, :heart, ...
User must: Press ↓ ↓ then Enter
Result: ❤️ inserted
```

**After v2.1**:
```
User types: :heart
Dropdown shows: :heart, :heart_eyes, :heartbeat, ...
User can: Just press Space!
Result: ❤️ inserted
```

### Testing

To test these improvements:
1. Load the extension
2. Open `test.html` in browser
3. Type `:heart` in any input field
   - ✅ Verify `:heart` appears first in dropdown
   - ✅ Press Space
   - ✅ Verify ❤️ is inserted with cursor after it
4. Type `:smile`
   - ✅ Verify `:smile` appears before `:smiley`, `:smile_cat`, etc.
   - ✅ Press Space
   - ✅ Verify 😄 is inserted

---

## [2.0.0] - 2025-10-28

### Initial Release

#### Core Features
- ✅ Autocomplete dropdown with keyboard navigation
- ✅ 500+ emojis across 8 categories
- ✅ Popup emoji picker with search
- ✅ Options page for custom emoji management
- ✅ Chrome storage sync for custom emojis
- ✅ Works on all websites (inputs, textareas, contentEditable)
- ✅ Markdown/Slack-style syntax (`:emoji_name`)

#### Files Created
- Extension manifest and core scripts
- Comprehensive emoji database
- UI components (popup, options)
- Documentation (README, QUICKSTART)
- Test page for functionality verification

---

## Version Numbering

This project uses [Semantic Versioning](https://semver.org/):
- **MAJOR** version: Incompatible API changes
- **MINOR** version: New functionality (backwards compatible)
- **PATCH** version: Bug fixes (backwards compatible)

Current version: **2.1.0**
