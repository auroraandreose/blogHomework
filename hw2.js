function generaNumeri() {
  const n = 30;
  const dati = [];

  for (let i = 0; i < n; i++) {
    dati.push(Math.random());
  }

  const media = mediaNaive(dati);
  const varN = varianzaNaive(dati);
  const varW = varianzaWelford(dati);

  document.getElementById("media").innerText = media.toFixed(6);
  document.getElementById("varNaive").innerText = varN.toFixed(6);
  document.getElementById("varWelford").innerText = varW.toFixed(6);
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
  const dati = [
    1000000001,
    1000000002,
    1000000003,
    1000000004,
    1000000005
  ];

  const varN = varianzaNaive(dati);
  const varW = varianzaWelford(dati);

  document.getElementById("varNaivePat").textContent = varN;
  document.getElementById("varWelfordPat").textContent = varW;

  document.getElementById("listaPatologica").textContent =
    dati.join(", ");
}
