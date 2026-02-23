

const DEFAULT_PASSWORD = "MySuperSecretPasswordThatOnlyIKnow123!";


class EncryptionMethod {
  constructor(id, label, isLowSecurity) {
    this.id = id;
    this.label = label;
    this.isLowSecurity = isLowSecurity;
  }

  encrypt(text, password) {
    throw new Error("Not implemented");
  }
  decrypt(encryptedText, password) {
    throw new Error("Not implemented");
  }

  
  getFeedback(password) {
    if (this.isLowSecurity) {
      return {
        text: "Warning: This algorithm is easily reversible and is only for fun!",
        className: "strength-fun",
      };
    }

    if (!password) return null;

    const result = zxcvbn(password);
    let score = result.score;
    const crackTime = result.crack_times_seconds.offline_fast_hashing_1e10_per_second;

    if (crackTime < 3600) score = Math.min(score, 1);
    else if (crackTime < 86400) score = Math.min(score, 2);
    else if (crackTime < 2592000) score = Math.min(score, 3);

    const realisticTime = result.crack_times_display.offline_slow_hashing_1e4_per_second;
    const strengthLabels = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"];

    return {
      text: `Strength: ${strengthLabels[score]} (Crack time: ${realisticTime})`,
      className: `strength-${score}`,
    };
  }
}

class CryptoJSOption extends EncryptionMethod {
  encrypt(text, password) {
    return CryptoJS[this.id].encrypt(text, password).toString();
  }
  decrypt(encryptedText, password) {
    const decrypted = CryptoJS[this.id].decrypt(encryptedText, password);
    const originalText = decrypted.toString(CryptoJS.enc.Utf8);
    if (!originalText) throw new Error("Decryption failed");
    return originalText;
  }
}

let lettersArr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", " ", "!", '"', "#", "$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/", ":", ";", "<", "=", ">", "?", "@", "{", "|", "}", "~", "[", "\\", "]", "^", "_", "`", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];



class UVSO extends EncryptionMethod {
  static regexMap = {
    "\n": "\\n\\",
    "\t": "\\t\\",
  };
  
  static reverseRegexMap = Object.fromEntries(Object.entries(UVSO.regexMap).map(([k, v]) => [v, k]));
  static createRegex(map) {
    const keys = Object.keys(map)
      .map((v) => v.replace(/\\/g, "\\\\"))
      .join("|");
    return new RegExp(keys, "g");
  }
  static formatText(text) {
    return text.replace(UVSO.createRegex(UVSO.regexMap), (match) => UVSO.regexMap[match]);
  }
  static unFormatText(text) {
    return text.replace(UVSO.createRegex(UVSO.reverseRegexMap), (match) => UVSO.reverseRegexMap[match]);
  }

  static strToBigInt(string) {
    const base = BigInt(lettersArr.length);
    return string
      .split("")
      .reverse()
      
      .map((char, i) => BigInt(lettersArr.indexOf(char) + 1) * (base ** BigInt(i)))
      .reduce((acc, num) => acc + num, 0n);
  }

  static bigIntToStr(bigIntValue) {
    let value = BigInt(bigIntValue);
    const base = BigInt(lettersArr.length);
    
    
    
    if (value <= 0n) return ""; 

    let str = "";
    while (value > 0n) {
      
      
      value--; 
      
      const index = Number(value % base);
      str = lettersArr[index] + str;
      value = value / base;
    }
    return str;
  }

  static repeatAndSum(num, times, baseLen) {
    let total = 0n;
    const b = BigInt(baseLen);
    const val = BigInt(num);

    for (let i = 0; i < times; i++) {
      total += val * b ** BigInt(i);
    }

    return total;
  }

  static getPassInt(password) {
    if(regexType === "number") {
      return BigInt(password);
    } else {
      return UVSO.strToBigInt(password);
    }
  }

  static extractUnknowns(text) {
    let filteredText = "";
    const unknowns = [];

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (lettersArr.includes(char)) {
        filteredText += char;
      } else {
        unknowns.push({ index: i, char: char });
      }
    }

    return { filteredText, unknowns };
  }

  static insertUnknowns(text, unknowns) {
    const textArray = text.split("");

    for (const unk of unknowns) {
      textArray.splice(unk.index, 0, unk.char);
    }

    return textArray.join("");
  }

  
  encrypt(text, password) {
    const formattedText = UVSO.formatText(text);
    const { filteredText, unknowns } = UVSO.extractUnknowns(formattedText);

    const textInt = UVSO.strToBigInt(filteredText);
    const passInt = UVSO.getPassInt(password);

    const summed = textInt + UVSO.repeatAndSum(passInt, filteredText.length, lettersArr.length);
    const encryptedFiltered = UVSO.bigIntToStr(summed);

    return UVSO.insertUnknowns(encryptedFiltered, unknowns);
  }

  decrypt(encryptedText, password) {
    const { filteredText, unknowns } = UVSO.extractUnknowns(encryptedText);

    const encryptedTextInt = UVSO.strToBigInt(filteredText);
    const passInt = UVSO.getPassInt(password);

    let originalLength = encryptedText.length;
    let resultInt = encryptedTextInt - UVSO.repeatAndSum(passInt, originalLength, lettersArr.length);

    while (resultInt < 0n) {
      originalLength -= 1;
      resultInt = encryptedTextInt - UVSO.repeatAndSum(passInt, originalLength, lettersArr.length);
    }

    const decryptedFiltered = UVSO.bigIntToStr(resultInt);
    const formattedText = UVSO.insertUnknowns(decryptedFiltered, unknowns);

    return UVSO.unFormatText(formattedText);
  }
}


const methods = [
  new CryptoJSOption("AES", "AES (Advanced Encryption Standard)", false),
  new CryptoJSOption("TripleDES", "Triple DES", false),
  new CryptoJSOption("DES", "DES (Data Encryption Standard)", false),
  new CryptoJSOption("Rabbit", "Rabbit", false),
  new CryptoJSOption("RC4", "RC4", false),
  new UVSO("UniversalShift", "UniversalShift (For Fun)", true)
];


function populateMethods() {
  console.log("populateMethods")
  const select = document.getElementById("encryptionMethod");
  const showLowSec = document.getElementById("showLowSec").checked;
  const currentSelection = select.value;

  select.options.length = 0;

  methods.forEach((method) => {
    if (!method.isLowSecurity || showLowSec) {
      select.add(new Option(method.label, method.id));
    }
  });

  
  if (Array.from(select.options).some((opt) => opt.value === currentSelection)) {
    select.value = currentSelection;
  }

  updatePasswordFeedback();
}

function getSelectedMethod() {
  const selectedId = document.getElementById("encryptionMethod").value;
  return methods.find((m) => m.id === selectedId);
}

let regexType = "";
let cypherRegex = /^.*$/
function updateCypherRegex(newRegex=/^.*$/, newRegexType="") {
  cypherRegex = newRegex;
  regexType = newRegexType;
}
function toggleNumbersOnly() {
  const numbersOnly = /^0|[1-9]\d*$/
  const passwordInput = document.getElementById("cipherKey");
  const value = passwordInput.value;
  if(regexType === "number") {
    updateCypherRegex();
    if(value) passwordInput.value = UVSO.bigIntToStr(value);
  } else {
    updateCypherRegex(numbersOnly, "number");
    if(value) passwordInput.value = UVSO.strToBigInt(value);
  }
}

function createCheckbox(id, labelText, action, checked=false) {
  
  const container = document.createElement('div');
  container.classList.add("toggle-wrapper");

  
  const newBox = document.createElement('input');
  newBox.type = 'checkbox';
  newBox.id = id;
  newBox.addEventListener("change", action);

  
  const label = document.createElement('label');
  label.htmlFor = id;
  label.textContent = labelText;

  
  container.appendChild(newBox);
  container.appendChild(label);


  return container;
}

function populateCheckboxes() {
  const method = getSelectedMethod();
  const checkboxes = [];
  
  
  const charsetWrapper = document.getElementById("charsetWrapper");
  const charsetInput = document.getElementById("charsetInput");

  if(method.id === "UniversalShift") {
    updateCypherRegex();
    const checkbox = createCheckbox("shiftByNumbers", "Shift By Numbers", toggleNumbersOnly);
    checkboxes.push(checkbox);
    
    
    charsetWrapper.style.display = "flex";
    charsetInput.value = lettersArr.join("");
  } else {
    
    charsetWrapper.style.display = "none";
  }
  
  document.querySelector(".checkbox-container").replaceChildren(...checkboxes);
}

function updatePasswordFeedback() {
  const passwordInput = document.getElementById("cipherKey");
  const feedbackDiv = document.getElementById("passwordFeedback");
  const pwd = passwordInput.value;
  const method = getSelectedMethod();

  const feedback = method.getFeedback(pwd);

  if (feedback) {
    feedbackDiv.textContent = feedback.text;
    feedbackDiv.className = `password-feedback ${feedback.className}`;
  } else {
    feedbackDiv.textContent = "Key Strength";
    feedbackDiv.className = "password-feedback";
  }
}


const eyeIcon = `<svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
const eyeOffIcon = `<svg viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;

function togglePassword() {
  const passwordInput = document.getElementById("cipherKey");
  const toggleBtn = document.getElementById("toggleBtn");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    toggleBtn.innerHTML = eyeOffIcon;
  } else {
    passwordInput.type = "password";
    toggleBtn.innerHTML = eyeIcon;
  }
}

function getPassword() {
  const userPassword = document.getElementById("cipherKey").value;
  return userPassword ? userPassword : DEFAULT_PASSWORD;
}

function showMessage(msg, isError = false) {
  const msgDiv = document.getElementById("message");
  msgDiv.textContent = msg;
  msgDiv.className = isError ? "error" : "success";
  setTimeout(() => (msgDiv.textContent = ""), 3500);
}

function encryptData() {
  const text = document.getElementById("inputText").value;
  if (!text) return showMessage("Please enter text to encrypt.", true);

  const password = getPassword();
  const method = getSelectedMethod();

  try {
    const encrypted = method.encrypt(text, password);
    document.getElementById("outputText").value = encrypted;
    showMessage(`Text encrypted successfully using ${method.id}.`);
  } catch (error) {
    console.error(error);
    showMessage("Encryption failed.", true);
  }
}

function decryptData() {
  const encryptedText = document.getElementById("inputText").value;
  if (!encryptedText) return showMessage("Please enter data to decrypt.", true);

  const password = getPassword();
  const method = getSelectedMethod();

  try {
    const originalText = method.decrypt(encryptedText, password);
    document.getElementById("outputText").value = originalText;
    showMessage(`Text decrypted successfully using ${method.id}.`);
  } catch (error) {
    document.getElementById("outputText").value = "";
    showMessage("Authentication failed or corrupted data.", true);
  }
}


document.addEventListener("DOMContentLoaded", () => {
  populateMethods(); 

  const passwordInput = document.getElementById("cipherKey");
  const selectMethod = document.getElementById("encryptionMethod");

  

  passwordInput.addEventListener('beforeinput', (event) => {
    
    if (event.data !== null && !cypherRegex.test(event.data)) {
      event.preventDefault();
    }
  });
  passwordInput.addEventListener("input", updatePasswordFeedback);
  selectMethod.addEventListener("change", () => {
    updatePasswordFeedback();
    populateCheckboxes();
  });


  const charsetInput = document.getElementById("charsetInput");
  charsetInput.addEventListener("input", (e) => {
    
    const uniqueChars = [...new Set(e.target.value.split(""))];
    
    
    if (uniqueChars.length > 1) {
      lettersArr = uniqueChars;
    }
  });
});
