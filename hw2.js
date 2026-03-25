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
