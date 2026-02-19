//1
let metodo = "cesar";

//2
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
const copyDecryptBtn = document.getElementById("copyDecryptBtn"); // puede ser null si no existe en HTML

const encryptBtn = document.getElementById("encryptBtn");
const decryptBtn = document.getElementById("decryptBtn");
const detectBtn = document.getElementById("detectBtn");
const clearBtn = document.getElementById("clearBtn");

//3
if (encryptBtn) encryptBtn.addEventListener("click", cifrar);
if (decryptBtn) decryptBtn.addEventListener("click", descifrar);
if (detectBtn) detectBtn.addEventListener("click", detectar);
if (clearBtn) clearBtn.addEventListener("click", limpiar);

if (editAlphabetBtn) editAlphabetBtn.addEventListener("click", toggleEditAlphabet);
if (copyEncryptBtn) copyEncryptBtn.addEventListener("click", () => copiarResultado("encrypt"));
if (copyDecryptBtn) copyDecryptBtn.addEventListener("click", () => copiarResultado("decrypt"));

if (btnCesar) btnCesar.addEventListener("click", () => setMetodo("cesar"));
if (btnAtbash) btnAtbash.addEventListener("click", () => setMetodo("atbash"));

//4
function normalizeAlphabet(alfabeto) {
  let res = "";
  for (let c of (alfabeto || "")) {
    if (!res.includes(c)) res += c;
  }
  return res;
}

//5
function setMetodo(nuevo) {
  metodo = nuevo;

  if (btnCesar) {
    if (metodo === "cesar") btnCesar.classList.add("is-active");
    else btnCesar.classList.remove("is-active");
  }

  if (btnAtbash) {
    if (metodo === "atbash") btnAtbash.classList.add("is-active");
    else btnAtbash.classList.remove("is-active");
  }

  if (shiftField) {
    shiftField.style.display = (metodo === "cesar") ? "block" : "none";
  }

  if (outputBox) {
    outputBox.textContent = "Modulo activo: " + String(metodo).toUpperCase();
  }
}

//6
function toggleEditAlphabet() {
  if (!alphabetInput) return;

  const isReadonly = alphabetInput.hasAttribute("readonly");
  const editIcon = document.getElementById("editIcon");

  if (isReadonly) {
    alphabetInput.removeAttribute("readonly");
    alphabetInput.focus();
    alphabetInput.select();

    if (editIcon) editIcon.innerHTML = '<polyline points="20 6 9 17 4 12"></polyline>';
    if (editAlphabetBtn) editAlphabetBtn.title = "Guardar alfabeto";
  } else {
    let nuevo = normalizeAlphabet(alphabetInput.value);
    alphabetInput.value = nuevo;

    alphabetInput.setAttribute("readonly", "readonly");

    if (editIcon) {
      editIcon.innerHTML =
        '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>' +
        '<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>';
    }

    if (editAlphabetBtn) editAlphabetBtn.title = "Editar alfabeto";
    if (outputBox) outputBox.textContent = "Alfabeto actualizado: " + alphabetInput.value;
  }
}

//7
function copiarResultado(tipo) {
  let texto = "";

  if (tipo === "encrypt") {
    texto = (outputEncryptBox ? outputEncryptBox.textContent : "").replace("Mensaje cifrado:\n", "");
  } else {
    texto = (outputDecryptBox ? outputDecryptBox.textContent : "").replace("Mensaje descifrado:\n", "");
  }

  if (!texto) return;

  const invalidos = [
    "Esperando mensaje...",
    "Esperando mensaje cifrado..."
  ];

  for (const inv of invalidos) {
    if (texto.trim() === inv) return;
  }

  if (texto.startsWith("Error")) return;

  if (!navigator.clipboard) return;

  navigator.clipboard.writeText(texto).then(() => {
    const btn = (tipo === "encrypt") ? copyEncryptBtn : copyDecryptBtn;
    if (!btn) return;

    const originalTitle = btn.title;
    btn.title = "Copiado";

    setTimeout(() => {
      btn.title = originalTitle;
    }, 1500);
  }).catch(() => {
    alert("No se pudo copiar al portapapeles");
  });
}

//8
function cesar(texto, shift, alfabeto) {
  let res = "";
  const m = alfabeto.length;
  if (m === 0) return texto;

  for (let c of texto) {
    const idx = alfabeto.indexOf(c);
    if (idx === -1) {
      res += c;
    } else {
      const nuevo = (idx + (shift % m) + m) % m;
      res += alfabeto[nuevo];
    }
  }
  return res;
}

//9
function atbash(texto, alfabeto) {
  let res = "";
  const m = alfabeto.length;
  if (m === 0) return texto;

  for (let c of texto) {
    const idx = alfabeto.indexOf(c);
    if (idx === -1) {
      res += c;
    } else {
      res += alfabeto[(m - 1) - idx];
    }
  }
  return res;
}

//10
function cifrar() {
  const texto = messageEncryptInput ? messageEncryptInput.value : "";
  const alfabeto = normalizeAlphabet(alphabetInput ? alphabetInput.value : "");

  if (!texto) {
    if (outputEncryptBox) outputEncryptBox.textContent = "Error: Escribe un mensaje para cifrar.";
    return;
  }

  if (alfabeto.length < 2) {
    if (outputEncryptBox) outputEncryptBox.textContent = "Error: El alfabeto debe tener al menos 2 caracteres.";
    return;
  }

  let resultado = "";
  if (metodo === "cesar") {
    const shift = parseInt(shiftInput ? shiftInput.value : "0", 10) || 0;
    resultado = cesar(texto, shift, alfabeto);
  } else {
    resultado = atbash(texto, alfabeto);
  }

  if (outputEncryptBox) outputEncryptBox.textContent = "Mensaje cifrado:\n" + resultado;
}

//11
function descifrar() {
  const texto = messageDecryptInput ? messageDecryptInput.value : "";
  const alfabeto = normalizeAlphabet(alphabetInput ? alphabetInput.value : "");

  if (!texto) {
    if (outputDecryptBox) outputDecryptBox.textContent = "Error: Escribe un mensaje cifrado para descifrar.";
    return;
  }

  if (alfabeto.length < 2) {
    if (outputDecryptBox) outputDecryptBox.textContent = "Error: El alfabeto debe tener al menos 2 caracteres.";
    return;
  }

  let resultado = "";
  if (metodo === "cesar") {
    const shift = parseInt(shiftInput ? shiftInput.value : "0", 10) || 0;
    resultado = cesar(texto, -shift, alfabeto);
  } else {
    resultado = atbash(texto, alfabeto);
  }

  if (outputDecryptBox) outputDecryptBox.textContent = "Mensaje descifrado:\n" + resultado;
}

//12
function detectar() {
  const textoEncrypt = messageEncryptInput ? messageEncryptInput.value : "";
  const textoDecrypt = messageDecryptInput ? messageDecryptInput.value : "";
  const texto = textoEncrypt || textoDecrypt;

  const alfabeto = normalizeAlphabet(alphabetInput ? alphabetInput.value : "");

  if (!texto || alfabeto.length < 2) {
    if (outputBox) outputBox.textContent = "Error: Necesitas un texto y un alfabeto valido (min. 2 caracteres).";
    return;
  }

  let resultado = "Modulo seleccionado: " + String(metodo).toUpperCase() + "\n\n";

  let charFreq = {};
  let totalChars = 0;

  for (let c of texto) {
    if (alfabeto.includes(c)) {
      charFreq[c] = (charFreq[c] || 0) + 1;
      totalChars++;
    }
  }

  resultado += "Caracteres analizados: " + totalChars + "\n";
  resultado += "Top 5 mas frecuentes:\n";

  const sorted = Object.entries(charFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  for (let [ch, count] of sorted) {
    const pct = totalChars ? ((count / totalChars) * 100).toFixed(1) : "0.0";
    resultado += "  '" + ch + "': " + count + " (" + pct + "%)\n";
  }

  if (outputBox) outputBox.textContent = resultado;
}

//13
function limpiar() {
  if (messageEncryptInput) messageEncryptInput.value = "";
  if (messageDecryptInput) messageDecryptInput.value = "";

  if (outputEncryptBox) outputEncryptBox.textContent = "Esperando mensaje...";
  if (outputDecryptBox) outputDecryptBox.textContent = "Esperando mensaje cifrado...";
  if (outputBox) outputBox.textContent = "Listo.";
}

//14
setMetodo("cesar");
