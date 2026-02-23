# [Text Encryptor](https://ahmedsuperdev.github.io/Encryptor)


A lightweight, client-side web application for encrypting and decrypting text. It supports industry-standard encryption algorithms as well as a custom, mathematically-based cipher called **UniversalShift** designed for fun and experimentation.

## 🚀 Features

* **Multiple Encryption Algorithms:** Choose from standard algorithms like AES or low-security/legacy options like DES and RC4.
* **Custom UniversalShift Cipher:** A unique, base-conversion shifting algorithm that allows for:
    * Numerical-only shifting.
    * Real-time customization of the base character set (`lettersArr`).
* **Password Strength Feedback:** Integrates `zxcvbn` to provide realistic estimates on password crack times and overall strength.
* **Client-Side Processing:** All encryption and decryption happen entirely in the browser. No text or passwords are sent to a server.
* **Low-Security Toggle:** Hides easily reversible or outdated algorithms by default to prevent accidental misuse for sensitive data.

## 🛠️ Built With

* **HTML/CSS/Vanilla JavaScript:** No build steps or heavy frameworks required.
* **[CryptoJS](https://cryptojs.gitbook.io/docs/) (v4.1.1):** Powers the standard cryptographic algorithms (AES, TripleDES, DES, Rabbit, RC4).
* **[zxcvbn](https://github.com/dropbox/zxcvbn) (v4.4.2):** A realistic password strength estimator.

## 💻 Usage

Since this is a vanilla frontend application, no installation or local server is required.

1.  Clone or download the repository.
2.  Open `index.html` in any modern web browser.
3.  Paste your text into the **Input Data** field.
4.  Select your desired **Encryption Algorithm**. *(Check "Enable low encryption methods" to see the full list).*
5.  (Optional) Enter an **Encryption Key**. If left blank, the app falls back to a default internal key.
6.  Click **Encrypt** or **Decrypt**. 

## 🔍 About UniversalShift (UVSO)

UniversalShift is a custom, low-security cipher included for fun. It works by converting the input text and the password into `BigInt` values based on a predefined array of characters (`lettersArr`). 

**Key features of UniversalShift:**
* **Base Math Engine:** It converts strings into large numbers based on the length of the character set, mathematically adds the password's numeric value (repeated for length), and converts it back into a string.
* **Customizable Character Set:** Users can dynamically modify the character array used for the base math directly from the UI.
* **Unknown Character Handling:** Characters not found in the custom array are extracted before mathematical shifting and re-inserted at their original indexes afterward.

> **⚠️ Warning:** UniversalShift, DES, TripleDES, Rabbit, and RC4 are considered low-security or easily reversible. Do not use them to secure highly sensitive personal data. Use AES for actual security needs.

## 📄 License

This project is open-source and available for educational and personal use.