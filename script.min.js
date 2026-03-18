//1
let metodo = "cesar_94";

//2
const btnCesar94 = document.getElementById("btnCesar94");
const btnCesar27 = document.getElementById("btnCesar27");
const btnCesarASCII = document.getElementById("btnCesarASCII");
const btnAtbash = document.getElementById("btnAtbash");

const desplazamientoField = document.getElementById("desplazamientoField");
const alfabetoField = document.getElementById("alfabetoField");

const alfabetoInput = document.getElementById("alfabeto");
const desplazamientoInput = document.getElementById("desplazamiento");
const entradaInput = document.getElementById("entrada");
const salidaOutput = document.getElementById("salida");

const editAlphabetBtn = document.getElementById("editAlphabetBtn");
const btnCifrar = document.getElementById("btnCifrar");
const btnDescifrar = document.getElementById("btnDescifrar");
const btnDescifrarMasa = document.getElementById("btnDescifrarMasa");
const btnCopiar = document.getElementById("btnCopiar");
const btnLimpiar = document.getElementById("btnLimpiar");

//3
if (btnCifrar) btnCifrar.addEventListener("click", cifrar);
if (btnDescifrar) btnDescifrar.addEventListener("click", descifrar);
if (btnDescifrarMasa) btnDescifrarMasa.addEventListener("click", descifrarEnMasa);
if (btnCopiar) btnCopiar.addEventListener("click", copiarResultado);
if (btnLimpiar) btnLimpiar.addEventListener("click", limpiar);

if (editAlphabetBtn) editAlphabetBtn.addEventListener("click", toggleEditAlphabet);

if (btnCesar94) btnCesar94.addEventListener("click", () => setMetodo("cesar_94"));
if (btnCesar27) btnCesar27.addEventListener("click", () => setMetodo("cesar_27"));
if (btnCesarASCII) btnCesarASCII.addEventListener("click", () => setMetodo("cesar_ascii"));
if (btnAtbash) btnAtbash.addEventListener("click", () => setMetodo("atbash"));

//4
function setMetodo(nuevo) {
  metodo = nuevo;

  if (btnCesar94) {
    if (metodo === "cesar_94") btnCesar94.classList.add("is-active");
    else btnCesar94.classList.remove("is-active");
  }

  if (btnCesar27) {
    if (metodo === "cesar_27") btnCesar27.classList.add("is-active");
    else btnCesar27.classList.remove("is-active");
  }

  if (btnCesarASCII) {
    if (metodo === "cesar_ascii") btnCesarASCII.classList.add("is-active");
    else btnCesarASCII.classList.remove("is-active");
  }

  if (btnAtbash) {
    if (metodo === "atbash") btnAtbash.classList.add("is-active");
    else btnAtbash.classList.remove("is-active");
  }

  if (desplazamientoField) {
    desplazamientoField.style.display = (metodo !== "atbash") ? "block" : "none";
  }

  if (alfabetoField) {
    alfabetoField.style.display = (metodo === "cesar_94" || metodo === "atbash") ? "block" : "none";
  }
}

//5
function normalizeAlphabet(alfabeto) {
  let res = "";
  for (let c of (alfabeto || "")) {
    if (!res.includes(c)) res += c;
  }
  return res;
}

//6
function toggleEditAlphabet() {
  if (!alfabetoInput) return;

  const isReadonly = alfabetoInput.hasAttribute("readonly");
  const editIcon = document.getElementById("editIcon");

  if (isReadonly) {
    alfabetoInput.removeAttribute("readonly");
    alfabetoInput.focus();
    alfabetoInput.select();

    if (editIcon) editIcon.innerHTML = '<polyline points="20 6 9 17 4 12"></polyline>';
    if (editAlphabetBtn) editAlphabetBtn.title = "Guardar alfabeto";
  } else {
    let nuevo = normalizeAlphabet(alfabetoInput.value);
    alfabetoInput.value = nuevo;

    alfabetoInput.setAttribute("readonly", "readonly");

    if (editIcon) {
      editIcon.innerHTML =
        '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>' +
        '<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>';
    }

    if (editAlphabetBtn) editAlphabetBtn.title = "Editar alfabeto";
  }
}

//7
function copiarResultado() {
  let texto = (salidaOutput ? salidaOutput.textContent : "").replace("Esperando acción...", "");

  if (!texto || texto.includes("Esperando")) return;

  if (!navigator.clipboard) return;

  navigator.clipboard.writeText(texto).then(() => {
    if (!btnCopiar) return;

    const originalTitle = btnCopiar.title;
    btnCopiar.title = "Copiado";

    setTimeout(() => {
      btnCopiar.title = originalTitle;
    }, 1500);
  }).catch(() => {
    alert("No se pudo copiar al portapapeles");
  });
}

//8
function cesar94(texto, shift, alfabeto) {
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
function cesar27(texto, shift) {
  let res = "";
  const alf = "abcdefghijklmnñopqrstuvwxyz";
  const m = alf.length;

  for (let c of texto) {
    const charLower = c.toLowerCase();
    const idx = alf.indexOf(charLower);
    if (idx === -1) {
      res += c;
    } else {
      const nuevo = (idx + (shift % m) + m) % m;
      let nuevaLetra = alf[nuevo];
      res += (c === c.toUpperCase() && c !== charLower) ? nuevaLetra.toUpperCase() : nuevaLetra;
    }
  }
  return res;
}

//10
function cesarASCII(texto, shift) {
  let res = "";
  for (let i = 0; i < texto.length; i++) {
    if (texto[i] === " ") {
      res += " ";
    } else {
      res += String.fromCharCode(((texto.charCodeAt(i) + (shift % 256) + 256) % 256));
    }
  }
  return res;
}

//11
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

//12
function cifrar() {
  const texto = entradaInput ? entradaInput.value : "";

  if (!texto) {
    if (salidaOutput) salidaOutput.textContent = "Error: Escribe un mensaje para cifrar.";
    return;
  }

  let resultado = "";

  if (metodo === "cesar_94") {
    const alfabeto = normalizeAlphabet(alfabetoInput ? alfabetoInput.value : "");
    if (alfabeto.length < 2) {
      if (salidaOutput) salidaOutput.textContent = "Error: El alfabeto debe tener al menos 2 caracteres.";
      return;
    }
    const shift = parseInt(desplazamientoInput ? desplazamientoInput.value : "0", 10) || 0;
    resultado = cesar94(texto, shift, alfabeto);
  } else if (metodo === "cesar_27") {
    const shift = parseInt(desplazamientoInput ? desplazamientoInput.value : "0", 10) || 0;
    resultado = cesar27(texto, shift);
  } else if (metodo === "cesar_ascii") {
    const shift = parseInt(desplazamientoInput ? desplazamientoInput.value : "0", 10) || 0;
    resultado = cesarASCII(texto, shift);
  } else if (metodo === "atbash") {
    const alfabeto = normalizeAlphabet(alfabetoInput ? alfabetoInput.value : "");
    if (alfabeto.length < 2) {
      if (salidaOutput) salidaOutput.textContent = "Error: El alfabeto debe tener al menos 2 caracteres.";
      return;
    }
    resultado = atbash(texto, alfabeto);
  }

  if (salidaOutput) salidaOutput.textContent = resultado;
}

//13
function descifrar() {
  const texto = entradaInput ? entradaInput.value : "";

  if (!texto) {
    if (salidaOutput) salidaOutput.textContent = "Error: Escribe un mensaje cifrado para descifrar.";
    return;
  }

  let resultado = "";

  if (metodo === "cesar_94") {
    const alfabeto = normalizeAlphabet(alfabetoInput ? alfabetoInput.value : "");
    if (alfabeto.length < 2) {
      if (salidaOutput) salidaOutput.textContent = "Error: El alfabeto debe tener al menos 2 caracteres.";
      return;
    }
    const shift = parseInt(desplazamientoInput ? desplazamientoInput.value : "0", 10) || 0;
    resultado = cesar94(texto, -shift, alfabeto);
  } else if (metodo === "cesar_27") {
    const shift = parseInt(desplazamientoInput ? desplazamientoInput.value : "0", 10) || 0;
    resultado = cesar27(texto, -shift);
  } else if (metodo === "cesar_ascii") {
    const shift = parseInt(desplazamientoInput ? desplazamientoInput.value : "0", 10) || 0;
    resultado = cesarASCII(texto, -shift);
  } else if (metodo === "atbash") {
    const alfabeto = normalizeAlphabet(alfabetoInput ? alfabetoInput.value : "");
    if (alfabeto.length < 2) {
      if (salidaOutput) salidaOutput.textContent = "Error: El alfabeto debe tener al menos 2 caracteres.";
      return;
    }
    resultado = atbash(texto, alfabeto);
  }

  if (salidaOutput) salidaOutput.textContent = resultado;
}

//14
function descifrarEnMasa() {
  const texto = entradaInput ? entradaInput.value : "";

  if (!texto) {
    if (salidaOutput) salidaOutput.textContent = "Error: Escribe un mensaje cifrado para descifrar.";
    return;
  }

  let resultados = "";
  let limite = 1;

  if (metodo === "cesar_94") {
    const alfabeto = normalizeAlphabet(alfabetoInput ? alfabetoInput.value : "");
    if (alfabeto.length < 2) {
      if (salidaOutput) salidaOutput.textContent = "Error: El alfabeto debe tener al menos 2 caracteres.";
      return;
    }
    limite = alfabeto.length;
    for (let i = 0; i < limite; i++) {
      const resultado = cesar94(texto, i, alfabeto);
      resultados += `[${i}] ${resultado}\n`;
    }
  } else if (metodo === "cesar_27") {
    limite = 27;
    for (let i = 0; i < limite; i++) {
      const resultado = cesar27(texto, i);
      resultados += `[${i}] ${resultado}\n`;
    }
  } else if (metodo === "cesar_ascii") {
    limite = 256;
    for (let i = 0; i < limite; i++) {
      const resultado = cesarASCII(texto, i);
      resultados += `[${i}] ${resultado}\n`;
    }
  } else if (metodo === "atbash") {
    const alfabeto = normalizeAlphabet(alfabetoInput ? alfabetoInput.value : "");
    if (alfabeto.length < 2) {
      if (salidaOutput) salidaOutput.textContent = "Error: El alfabeto debe tener al menos 2 caracteres.";
      return;
    }
    resultados = atbash(texto, alfabeto);
  }

  if (salidaOutput) salidaOutput.textContent = resultados;
}

//15
function limpiar() {
  if (entradaInput) entradaInput.value = "";
  if (salidaOutput) salidaOutput.textContent = "Esperando acción...";
}

//16
setMetodo("cesar_94");
