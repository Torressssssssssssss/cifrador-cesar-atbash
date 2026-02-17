// ==================== CIFRADOR CESAR Y ATBASH ====================

let metodo = "cesar";

const btnCesar = document.getElementById("btnCesar");
const btnAtbash = document.getElementById("btnAtbash");
const shiftField = document.getElementById("shiftField");

const alphabetInput = document.getElementById("alphabet");
const shiftInput = document.getElementById("shift");
const messageEncryptInput = document.getElementById("messageEncrypt");
const messageDecryptInput = document.getElementById("messageDecrypt");

const outputEncryptBox = document.getElementById("outputEncrypt");
const outputDecryptBox = document.getElementById("outputDecrypt");
const outputBox = document.getElementById("output");

const editAlphabetBtn = document.getElementById("editAlphabetBtn");
const copyEncryptBtn = document.getElementById("copyEncryptBtn");
const copyDecryptBtn = document.getElementById("copyDecryptBtn");

document.getElementById("encryptBtn").addEventListener("click", cifrar);
document.getElementById("decryptBtn").addEventListener("click", descifrar);
document.getElementById("detectBtn").addEventListener("click", detectar);
document.getElementById("clearBtn").addEventListener("click", limpiar);

editAlphabetBtn.addEventListener("click", toggleEditAlphabet);
copyEncryptBtn.addEventListener("click", () => copiarResultado("encrypt"));
copyDecryptBtn.addEventListener("click", () => copiarResultado("decrypt"));

btnCesar.addEventListener("click", () => setMetodo("cesar"));
btnAtbash.addEventListener("click", () => setMetodo("atbash"));

function toUpperSafe(s){
  return (s || "").toUpperCase();
}

function normalizeAlphabet(alfabeto){
  let res = "";
  for (let c of alfabeto){
    if (!res.includes(c)) res += c;
  }
  return res;
}

function setMetodo(nuevo){
  metodo = nuevo;

  btnCesar.classList.toggle("is-active", metodo === "cesar");
  btnAtbash.classList.toggle("is-active", metodo === "atbash");

  shiftField.style.display = (metodo === "cesar") ? "block" : "none";

  outputBox.textContent = "Modulo activo: " + metodo.toUpperCase();
}

function toggleEditAlphabet(){
  const isReadonly = alphabetInput.hasAttribute("readonly");
  const editIcon = document.getElementById("editIcon");

  if (isReadonly){
    alphabetInput.removeAttribute("readonly");
    alphabetInput.focus();
    alphabetInput.select();
    editIcon.innerHTML = '<polyline points="20 6 9 17 4 12"></polyline>';
    editAlphabetBtn.title = "Guardar alfabeto";
  } else {
    let nuevo = toUpperSafe(alphabetInput.value);
    nuevo = normalizeAlphabet(nuevo);
    alphabetInput.value = nuevo;

    alphabetInput.setAttribute("readonly", "readonly");
    editIcon.innerHTML =
      '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>' +
      '<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>';
    editAlphabetBtn.title = "Editar alfabeto";

    outputBox.textContent = "Alfabeto actualizado: " + alphabetInput.value;
  }
}

function copiarResultado(tipo){
  let texto = "";

  if (tipo === "encrypt"){
    texto = outputEncryptBox.textContent.replace("Mensaje cifrado:\n", "");
  } else {
    texto = outputDecryptBox.textContent.replace("Mensaje descifrado:\n", "");
  }

  if (!texto) return;

  const invalidos = [
    "Esperando mensaje...",
    "Esperando mensaje cifrado..."
  ];

  for (const inv of invalidos){
    if (texto.trim() === inv) return;
  }

  if (texto.startsWith("Error")) return;

  navigator.clipboard.writeText(texto).then(() => {
    const btn = (tipo === "encrypt") ? copyEncryptBtn : copyDecryptBtn;
    const originalTitle = btn.title;

    btn.title = "Copiado";
    btn.style.color = "#7ac97a";

    setTimeout(() => {
      btn.title = originalTitle;
      btn.style.color = "";
    }, 1500);
  }).catch(() => {
    alert("No se pudo copiar al portapapeles");
  });
}

function cesar(texto, shift, alfabeto){
  let res = "";
  const m = alfabeto.length;

  for (let c of texto){
    const idx = alfabeto.indexOf(c);
    if (idx === -1){
      res += c;
    } else {
      const nuevo = (idx + (shift % m) + m) % m;
      res += alfabeto[nuevo];
    }
  }
  return res;
}

function atbash(texto, alfabeto){
  let res = "";
  const m = alfabeto.length;

  for (let c of texto){
    const idx = alfabeto.indexOf(c);
    if (idx === -1){
      res += c;
    } else {
      res += alfabeto[(m - 1) - idx];
    }
  }
  return res;
}

function cifrar(){
  const texto = toUpperSafe(messageEncryptInput.value);
  const alfabeto = normalizeAlphabet(toUpperSafe(alphabetInput.value));

  if (!texto){
    outputEncryptBox.textContent = "Error: Escribe un mensaje para cifrar.";
    return;
  }

  if (alfabeto.length < 2){
    outputEncryptBox.textContent = "Error: El alfabeto debe tener al menos 2 caracteres.";
    return;
  }

  let resultado = "";
  if (metodo === "cesar"){
    const shift = parseInt(shiftInput.value) || 0;
    resultado = cesar(texto, shift, alfabeto);
  } else {
    resultado = atbash(texto, alfabeto);
  }

  outputEncryptBox.textContent = "Mensaje cifrado:\n" + resultado;
}

function descifrar(){
  const texto = toUpperSafe(messageDecryptInput.value);
  const alfabeto = normalizeAlphabet(toUpperSafe(alphabetInput.value));

  if (!texto){
    outputDecryptBox.textContent = "Error: Escribe un mensaje cifrado para descifrar.";
    return;
  }

  if (alfabeto.length < 2){
    outputDecryptBox.textContent = "Error: El alfabeto debe tener al menos 2 caracteres.";
    return;
  }

  let resultado = "";
  if (metodo === "cesar"){
    const shift = parseInt(shiftInput.value) || 0;
    resultado = cesar(texto, -shift, alfabeto);
  } else {
    resultado = atbash(texto, alfabeto);
  }

  outputDecryptBox.textContent = "Mensaje descifrado:\n" + resultado;
}

function detectar(){
  const textoEncrypt = toUpperSafe(messageEncryptInput.value);
  const textoDecrypt = toUpperSafe(messageDecryptInput.value);
  const texto = textoEncrypt || textoDecrypt;

  const alfabeto = normalizeAlphabet(toUpperSafe(alphabetInput.value));

  if (!texto || alfabeto.length < 2){
    outputBox.textContent = "Error: Necesitas un texto y un alfabeto valido (min. 2 caracteres).";
    return;
  }

  let resultado = "Modulo seleccionado: " + metodo.toUpperCase() + "\n\n";

  let charFreq = {};
  let totalChars = 0;

  for (let c of texto){
    if (alfabeto.includes(c)){
      charFreq[c] = (charFreq[c] || 0) + 1;
      totalChars++;
    }
  }

  resultado += "Caracteres analizados: " + totalChars + "\n";
  resultado += "Top 5 mas frecuentes:\n";

  const sorted = Object.entries(charFreq).sort((a,b) => b[1] - a[1]).slice(0, 5);

  for (let [ch, count] of sorted){
    const pct = totalChars ? ((count/totalChars)*100).toFixed(1) : "0.0";
    resultado += "  '" + ch + "': " + count + " (" + pct + "%)\n";
  }

  outputBox.textContent = resultado;
}

function limpiar(){
  messageEncryptInput.value = "";
  messageDecryptInput.value = "";

  outputEncryptBox.textContent = "Esperando mensaje...";
  outputDecryptBox.textContent = "Esperando mensaje cifrado...";
  outputBox.textContent = "Listo.";
}

setMetodo("cesar");
