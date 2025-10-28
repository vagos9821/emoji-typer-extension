# Testing Guide for v2.1

## What Changed in v2.1

### 1. Smart Sorting (Priority: Exact > Starts With > Contains)
- **Exact matches** now appear first
- **Example**: Type `:heart` → `:heart` ❤️ appears first, not `:heart_eyes` 😍

### 2. Space Key Auto-Insert
- Press **Space** after typing emoji name to instantly insert it
- **Example**: Type `:heart` + Space → ❤️ inserted automatically

---

## Test Cases

### Test 1: Exact Match Sorting
**Steps**:
1. Open any website or `test.html`
2. Click in a text input
3. Type `:heart`

**Expected**:
- Dropdown appears
- **First item**: `:heart` ❤️
- Other items: `:heart_eyes`, `:heartbeat`, `:broken_heart`, etc.

**Pass**: ✅ / ❌

---

### Test 2: Space Key Auto-Insert
**Steps**:
1. Click in a text input
2. Type `:heart`
3. Press **Space** (don't use arrow keys)

**Expected**:
- `:heart` is replaced with ❤️
- One space appears after the emoji
- Cursor is positioned after the space
- Dropdown closes

**Pass**: ✅ / ❌

---

### Test 3: Arrow Key Selection + Space
**Steps**:
1. Click in a text input
2. Type `:heart`
3. Press **↓** arrow twice (to select third item)
4. Press **Space**

**Expected**:
- The **selected** emoji is inserted (not the first one)
- Dropdown closes

**Pass**: ✅ / ❌

---

### Test 4: Shorter Names First
**Steps**:
1. Type `:fire`

**Expected**:
- **First item**: `:fire` 🔥 (4 letters)
- Not `:fireworks` (9 letters) or `:firecracker` (11 letters)

**Pass**: ✅ / ❌

---

### Test 5: Enter Key Still Works
**Steps**:
1. Type `:smile`
2. Press **Enter**

**Expected**:
- First match (`:smile` 😄) is inserted
- Works the same as Space key

**Pass**: ✅ / ❌

---

### Test 6: Tab Key Still Works
**Steps**:
1. Type `:rocket`
2. Press **Tab**

**Expected**:
- First match (`:rocket` 🚀) is inserted
- Works the same as Space/Enter

**Pass**: ✅ / ❌

---

### Test 7: Typing Continues If No Match
**Steps**:
1. Type `:xyz`
2. Press **Space**

**Expected**:
- Dropdown doesn't appear (no matches)
- `:xyz ` appears in text (Space is typed normally)
- No emoji inserted

**Pass**: ✅ / ❌

---

### Test 8: Works in Different Input Types
**Test in each**:
- Regular `<input type="text">`
- `<textarea>`
- ContentEditable `<div>`

**Steps**:
1. Type `:thumbs_up` + Space in each

**Expected**:
- 👍 inserted in all three input types

**Pass**: ✅ / ❌

---

### Test 9: Exact Match Example `:dog`
**Steps**:
1. Type `:dog`

**Expected Dropdown Order**:
1. `:dog` 🐶 (exact match)
2. `:dog2` 🐕 (starts with)
3. Other dog-related emojis

**Pass**: ✅ / ❌

---

### Test 10: Contains Match Example
**Steps**:
1. Type `:purple`

**Expected**:
- `:purple_heart` 💜 appears
- `:purple_circle` 🟣 appears
- Results sorted by name length

**Pass**: ✅ / ❌

---

## Quick Reload Instructions

If you need to reload the extension after changes:

1. Go to `chrome://extensions/`
2. Find "Emoji Typer"
3. Click the **reload** icon (↻)
4. Refresh the test page
5. Test again

---

## Known Working Combinations

These should all insert ❤️:
- `:heart` + **Space**
- `:heart` + **Enter**
- `:heart` + **Tab**
- `:heart` + **↓** + **Space**
- `:heart` + **↓** + **Enter**
- `:heart` + **↓** + **Tab**

---

## Reporting Issues

If any test fails:
1. Note which test case failed
2. Describe what happened vs. what was expected
3. Check browser console for errors (F12)
4. Try reloading the extension

---

## Success Criteria

All 10 tests should pass ✅ for v2.1 to be considered working correctly.

**Your Score**: ___/10

---

Last Updated: October 28, 2025
Version Tested: 2.1
