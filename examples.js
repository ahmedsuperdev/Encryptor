const textExamples = [
  "Hello, World!",
  "My Top Secret Password!",
  "Newton Law"
]

const passExamples = [
  "p@ssword",
  "Monkey123",
  "Hello World",
  "123456",
  "87A17z2",
  "123456Ze",

  "09282394",
  "45935018",
  "52623149",

  "8797386548",
  "9871873949",
  "4984562389",

  "bOIJL3SDi-oijakdsLKJ9jadS",
  "KLmasfk(jl9dsf0L>j alk'as",
  
  "11292747591102482195798657324014756214130845400336257409287144682551519091",
  "79842134879941256446765905273652876415572703723295197578627325322197954977",
  "98746132132468975121321064879875313213212360467987843212318977984232168948",
];
function updateCypher(newCypher) {
  const cypherKeyInput = document.getElementById("cipherKey");
  cypherKeyInput.value = newCypher;
  cypherKeyInput.dispatchEvent(new Event('input', { bubbles: true }));
}

function randomEncryptExample(randomMethod=false) {
  const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const randomMethodIndex = randomMethod ? Math.floor(Math.random() * selectElement.options.length) : undefined;
  return encryptExample(randomItem(textExamples), randomItem(passExamples), randomMethodIndex);
}

function encryptExample(text, cypherKey, encryptAlgorithmIndex=undefined) {
  document.getElementById("inputText").value = text;
  updateCypher(cypherKey);
  if(encryptAlgorithmIndex >= 0) {
    select.selectedIndex = encryptAlgorithmIndex % selectElement.options.length;
    select.dispatchEvent(new Event('change'));
  }

  encryptData();
  return document.getElementById("outputText").value;
}

function encryptResult() {
  result = document.getElementById("outputText").value
  if(result === "") return;
  document.getElementById("inputText").value = result;
  encryptData();
  return document.getElementById("outputText").value;
}
function decryptResult() {
  result = document.getElementById("outputText").value
  if(result === "") return;
  document.getElementById("inputText").value = result;
  decryptData();
  return document.getElementById("outputText").value;
}

function decryptExample(encryptedMsg, cypherKey) {
  document.getElementById("inputText").value = encryptedMsg;
  updateCypher(cypherKey);
  decryptData();
  return document.getElementById("outputText").value;
}