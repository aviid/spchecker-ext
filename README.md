# SPChecker - Real-time Password Strength & Breach Checker

![SPChecker Banner](https://i.postimg.cc/59CVsshx/spchecker-ext-banner.jpg)


A Chrome extension that provides real-time password strength analysis and breach detection while users type their passwords.

## Features

- ** Real-time Strength Analysis** - Instant password strength feedback as you type
- ** Breach Detection** - Checks against known data breaches using Have I Been Pwned API
- ** Visual Feedback** - Color-coded strength indicators and progress bars
- ** Detailed Metrics** - Character analysis, common patterns, and entropy scoring
- ** Smart Warnings** - Alerts for compromised passwords and weak patterns
- ** Non-intrusive** - Works seamlessly in the background without disrupting user experience

## How It Works

### Password Strength Algorithm
- **Length Analysis** - Minimum 8 characters, optimal 12+
- **Character Diversity** - Upper/lowercase, numbers, symbols
- **Common Patterns** - Dictionary words, sequences, repeats
- **Entropy Scoring** - Mathematical strength calculation
- **Blacklist Check** - Common compromised passwords

### Breach Detection
- **k-Anonymity Model** - Secure API calls without sending full passwords
- **SHA-1 Hashing** - Passwords are hashed before checking
- **Have I Been Pwned API** - World's largest breach database
- **Real-time Validation** - Instant feedback while typing

## Installation

### From Chrome Web Store
1. Visit Chrome Web Store
2. Search for "SPChecker"
3. Click "Add to Chrome"
4. Confirm installation

### Manual Installation (Developer)
1. **Clone the repository**
```bash
git clone https://github.com/yourusername/spchecker.git
```

2. **Load unpacked extension**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right)
   - Click "Load unpacked"
   - Select the extension directory

3. **Start using**
   - The extension will automatically activate on password fields

## Usage

1. **Navigate to any login/registration form**
2. **Start typing your password**
3. **View real-time feedback:**
   - **Strong** - Meets all security criteria
   - **Medium** - Meets basic requirements
   - **Weak** - Fails multiple security checks
   - **Compromised** - Found in data breaches

4. **Follow recommendations** to improve password strength

## Technical Details

### Security Features
- **Zero Data Storage** - No passwords are stored locally
- **Secure API Communication** - Uses HTTPS and k-anonymity
- **Local Processing** - Strength analysis happens in-browser
- **Privacy-First** - No personal data collection

### Supported Password Fields
- `<input type="password">`
- Custom password inputs
- Registration and login forms
- Password change dialogs

## Strength Criteria

| Level | Requirements | Score |
|-------|-------------|--------|
| **Weak** | < 8 chars, no variety | 0-40% |
| **Medium** | 8+ chars, some variety | 41-70% |
| **Strong** | 12+ chars, full variety, no patterns | 71-100% |

### Strength Factors
- **Length** (8+ characters recommended)
- **Uppercase Letters** (A-Z)
- **Lowercase Letters** (a-z)  
- **Numbers** (0-9)
- **Symbols** (!@#$%^&*)
- **No Common Words**
- **No Sequential Patterns**
- **Not Previously Breached**

## Privacy & Security

### What We Do
- Analyze password strength locally
- Check breach status via secure API
- Provide visual feedback to users
- Respect user privacy

### What We Don't Do
- Store any passwords
- Collect personal information
- Send plaintext passwords over network
- Track user behavior
- Share data with third parties

## Troubleshooting

### Common Issues
- **Extension not loading**: Check Chrome version (88+ required)
- **No feedback on forms**: Refresh page or check console for errors
- **API errors**: Check internet connection

### Debug Mode
Enable debug logging in extension options for detailed feedback.

## Contributing

We welcome contributions from the security community!

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/improvement`)
3. **Commit changes** (`git commit -m 'Add new feature'`)
4. **Push to branch** (`git push origin feature/improvement`)
5. **Open a Pull Request**

### Areas for Contribution
- Additional password strength algorithms
- Support for more languages
- Enhanced UI/UX improvements
- Additional breach databases

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Troy Hunt** for the [Have I Been Pwned](https://haveibeenpwned.com/) API
- **Chrome Extensions Team** for development resources
- **Security researchers** for password strength algorithms

## 🔗 Links

- **Chrome Web Store**: [Install SPChecker](https://chrome.google.com/webstore)
- **GitHub Repository**: [Source Code](https://github.com/yourusername/spchecker)
- **Issue Tracker**: [Report Bugs](https://github.com/yourusername/spchecker/issues)
- **Security Issues**: [Security Policy](SECURITY.md)

---

<div align="center">

**Type with Confidence • Know Your Password's Security**

*Making the web safer, one password at a time*

</div>
