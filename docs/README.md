# 🎨 Emoji Typer - Chrome Extension

A powerful Chrome/Edge extension that lets you type emojis using intuitive shortcodes like `:heart` → ❤️ with autocomplete, a popup emoji picker, and custom emoji support!

## ✨ Features

### 🎯 Quick Emoji Typing
- Type `:` followed by an emoji name anywhere on any website
- Real-time autocomplete dropdown with emoji suggestions
- Navigate with arrow keys, select with Enter or Tab
- Works in all text inputs, textareas, and contentEditable elements

### 🔍 Autocomplete Dropdown
- Shows up to 10 matching emojis as you type
- **Smart sorting**: Exact matches appear first (`:heart` before `:heart_eyes`)
- Search by emoji name (e.g., `:smile`, `:heart`, `:fire`)
- Visual preview of each emoji with its shortcode
- Keyboard navigation (↑↓ arrows, Enter/Tab/Space to select, Esc to close)
- **Auto-insert on Space**: Type `:heart` + Space to instantly insert ❤️

### 🎨 Popup Emoji Picker
- Click the extension icon to open a beautiful emoji picker
- Browse emojis by category (Smileys, Animals, Food, etc.)
- Search for emojis instantly
- Click any emoji to copy it to clipboard
- Over 500+ emojis included!

### ⚙️ Custom Emoji Sets
- Add your own custom emoji shortcuts
- Perfect for:
  - Text emoticons (`:shrug` → ¯\\_(ツ)_/¯)
  - Special characters (`:tm` → ™)
  - Branded emojis or company logos
  - Frequently used text snippets
  - Email signatures
- Manage all custom emojis from the options page

### 📚 Emoji Categories
- **Smileys & People**: 😀😍🤔👍👋
- **Hearts & Symbols**: ❤️💚⭐✨🔥
- **Animals & Nature**: 🐶🐱🌳🌸🦁
- **Food & Drink**: 🍕🍔🍰☕🍎
- **Activities & Objects**: ⚽🎮🎨💡🎁
- **Travel & Places**: 🚀✈️🏠🌍🗽
- **Tech & Office**: 💻📱⌨️📧📊
- **Flags & Symbols**: ✅❌🔄⬆️🆕

## 🚀 Installation

### From Chrome Web Store (Coming Soon)
1. Visit the Chrome Web Store
2. Search for "Emoji Typer"
3. Click "Add to Chrome"

### Manual Installation (For Development)
1. Download or clone this repository
2. Open Chrome/Edge and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right corner)
4. Click "Load unpacked"
5. Select the extension folder
6. The extension icon should appear in your toolbar!

## 📖 How to Use

### Basic Emoji Typing
1. Click in any text field on any website
2. Type `:` followed by an emoji name (e.g., `:heart`)
3. An autocomplete dropdown will appear with smart sorting (exact matches first!)
4. **Quick insert**: Just press Space to insert the first match
5. **Or navigate**: Use arrow keys to select, then press Enter/Tab/Space
6. The emoji is inserted! ❤️

### Examples
- `:smile` → 😄
- `:fire` → 🔥
- `:thumbs_up` → 👍
- `:rocket` → 🚀
- `:heart` → ❤️
- `:coffee` → ☕

### Using the Popup Picker
1. Click the Emoji Typer extension icon in your toolbar
2. Browse categories or use the search box
3. Click any emoji to copy it to clipboard
4. Paste anywhere!

### Adding Custom Emojis
1. Right-click the extension icon and select "Options"
2. Or navigate to `chrome://extensions/` and click "Options"
3. Enter a shortcode and the emoji/text you want
4. Click "Add Emoji"
5. Use it anywhere with `:yourshortcode`

### Custom Emoji Examples
- `:shrug` → ¯\\_(ツ)_/¯
- `:tableflip` → (╯°□°)╯︵ ┻━┻
- `:tm` → ™
- `:email` → your@email.com
- `:signature` → Best regards, Your Name

## 🎨 Emoji Shortcode Reference

### Popular Shortcuts
```
Smileys:
:smile :joy :heart_eyes :wink :thinking :cry :angry

Gestures:
:thumbs_up :thumbs_down :clap :wave :pray :muscle

Hearts:
:heart :blue_heart :green_heart :yellow_heart :purple_heart :broken_heart

Symbols:
:fire :star :sparkles :zap :100 :check :x :warning

Animals:
:dog :cat :monkey :fox :lion :panda :unicorn

Food:
:pizza :burger :cake :coffee :beer :apple :taco

Tech:
:computer :iphone :email :bulb :rocket :gear

Travel:
:car :airplane :house :earth :moon :sun
```

## 🔧 Technical Details

### Files Structure
```
emoji-typer-extension/
├── manifest.json              # Extension configuration
├── src/
│   ├── content/              # Content scripts (injected into pages)
│   │   ├── emojiData.js      # Comprehensive emoji database
│   │   ├── emojiMap.js       # Emoji mapping and storage sync
│   │   ├── content.js        # Main content script with autocomplete
│   │   └── content.css       # Autocomplete dropdown styles
│   ├── popup/                # Popup emoji picker
│   │   ├── popup.html        # Popup UI
│   │   └── popup.js          # Popup functionality
│   └── options/              # Options page
│       ├── options.html      # Options page UI
│       └── options.js        # Options page functionality
├── icons/                    # Extension icons
├── docs/                     # Documentation
└── test.html                 # Test page
```

### Permissions
- `activeTab`: To inject emoji functionality into web pages
- `scripting`: To run content scripts
- `storage`: To save custom emoji preferences

### Browser Compatibility
- ✅ Chrome (Manifest V3)
- ✅ Microsoft Edge (Chromium-based)
- ✅ Brave
- ✅ Opera
- ⚠️ Firefox (requires manifest modifications for V2)

## 🎯 Features Comparison

| Feature | Emoji Typer | Other Extensions |
|---------|-------------|------------------|
| Autocomplete Dropdown | ✅ | ❌ |
| Custom Emojis | ✅ | Limited |
| Popup Picker | ✅ | ✅ |
| Categories | ✅ | ✅ |
| Search | ✅ | ✅ |
| Keyboard Navigation | ✅ | ❌ |
| Works Everywhere | ✅ | Limited |
| Markdown/Slack Style | ✅ | ❌ |

## 🐛 Known Issues & Limitations

- Some websites with custom input handlers may interfere with emoji insertion
- ContentEditable elements may have inconsistent cursor positioning
- Chrome's storage.sync has a 100KB limit for custom emojis

## 🚧 Roadmap

- [ ] Import/Export custom emoji sets
- [ ] Emoji usage statistics
- [ ] Recently used emojis section
- [ ] Skin tone variations
- [ ] Emoji suggestions based on typing patterns
- [ ] Support for animated emojis/GIFs
- [ ] Keyboard shortcuts to open popup

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Add more emoji shortcuts

## 📄 License

MIT License - feel free to use and modify!

## 💖 Support

If you find this extension helpful:
- ⭐ Star the repository
- 🐛 Report bugs
- 💡 Suggest features
- 📢 Share with friends!

---

Made with ❤️ • Type `:` anywhere to start • Happy emoji typing! 😊🎉
