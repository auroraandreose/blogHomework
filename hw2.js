function generaNumeri() {
  const n = 100000;
  const dati = [];

  for (let i = 0; i < n; i++) {
    dati.push(Math.random());
  }

  const media = mediaNaive(dati);
  const varN = varianzaNaive(dati);
  const varW = varianzaWelford(dati);

  document.getElementById("media").textContent = media.toFixed(6);
  document.getElementById("varNaive").textContent = varN.toFixed(6);
  document.getElementById("varWelford").textContent = varW.toFixed(6);
  document.getElementById("listaRandom").textContent =
    dati.map(x => x.toFixed(6)).join(", ");
}

function mediaNaive(dati) {
  let somma = 0;
  for (let x of dati) {
    somma += x;
  }
  return somma / dati.length;
}

function varianzaNaive(dati) {
  const media = mediaNaive(dati);
  let sommaQuadrati = 0;

  for (let x of dati) {
    sommaQuadrati += x * x;
  }

  return sommaQuadrati / dati.length - media * media;
}

function varianzaWelford(dati) {
  let n = 0;
  let media = 0;
  let M2 = 0;

  for (let x of dati) {
    n++;
    const delta = x - media;
    media += delta / n;
    const delta2 = x - media;
    M2 += delta * delta2;
  }

  return M2 / n;
}

function casoPatologico() {
  const dati = [];
  const n = 10;

  // base cambia ogni volta
  const base = 1000000000 + Math.floor(Math.random() * 1000);

  for (let i = 0; i < n; i++) {
    dati.push(base + i + 1);
  }

  const media = mediaNaive(dati);
  const varN = varianzaNaive(dati);
  const varW = varianzaWelford(dati);

  document.getElementById("mediaPat").textContent = media.toFixed(6);
  document.getElementById("varNaivePat").textContent = varN.toFixed(6);
  document.getElementById("varWelfordPat").textContent = varW.toFixed(6);
  document.getElementById("listaPatologica").textContent = dati.join(", ");
}
function generaUniformeDistribuzione(n = 5000) {
  const dati = [];
  for (let i = 0; i < n; i++) {
    dati.push(Math.random());
  }
  return dati;
}

function generaEsponenziale(n = 5000, lambda = 1) {
  const dati = [];
  for (let i = 0; i < n; i++) {
    const u = Math.random();
    dati.push(-Math.log(1 - u) / lambda);
  }
  return dati;
}

function generaNormale(n = 5000) {
  const dati = [];

  while (dati.length < n) {
    const u1 = Math.random();
    const u2 = Math.random();

    const r = Math.sqrt(-2 * Math.log(1 - u1));
    const theta = 2 * Math.PI * u2;

    const z1 = r * Math.cos(theta);
    const z2 = r * Math.sin(theta);

    dati.push(z1);
    if (dati.length < n) {
      dati.push(z2);
    }
  }

  return dati;
}

function istogrammaTestuale(dati, bins = 20) {
  const min = Math.min(...dati);
  const max = Math.max(...dati);
  const ampiezza = (max - min) / bins;
  const frequenze = new Array(bins).fill(0);

  for (let x of dati) {
    let indice = Math.floor((x - min) / ampiezza);
    if (indice === bins) indice = bins - 1;
    frequenze[indice]++;
  }

  const freqMax = Math.max(...frequenze);
  let output = "";

  for (let i = 0; i < bins; i++) {
    const sinistra = (min + i * ampiezza).toFixed(2);
    const destra = (min + (i + 1) * ampiezza).toFixed(2);
    const lunghezza = Math.round((frequenze[i] / freqMax) * 40);
    const barra = "█".repeat(lunghezza);
    output += `[${sinistra}, ${destra}) ${barra} (${frequenze[i]})\n`;
  }

  return output;
}

function mostraDistribuzione(nome, dati) {
  const media = mediaNaive(dati);
  const varianza = varianzaWelford(dati);
  const istogramma = istogrammaTestuale(dati);

  document.getElementById("distNome").textContent = nome;
  document.getElementById("distCampione").textContent = dati.length;
  document.getElementById("distMedia").textContent = media.toFixed(6);
  document.getElementById("distVarianza").textContent = varianza.toFixed(6);
  document.getElementById("distOutput").textContent = istogramma;
}

function demoUniforme() {
  const dati = generaUniformeDistribuzione();
  mostraDistribuzione("Uniforme U[0,1)", dati);
}

function demoEsponenziale() {
  const dati = generaEsponenziale();
  mostraDistribuzione("Esponenziale", dati);
}

function demoNormale() {
  const dati = generaNormale();
  mostraDistribuzione("Normale standard", dati);
}
