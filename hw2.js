// genera numeri casuali e calcola media + varianza
function generaNumeri() {
  let n = 1000;
  let dati = [];

  for (let i = 0; i < n; i++) {
    dati.push(Math.random());
  }

  let media = mediaNaive(dati);
  let varN = varianzaNaive(dati);
  let varW = varianzaWelford(dati);

  document.getElementById("media").innerText = media.toFixed(6);
  document.getElementById("varNaive").innerText = varN.toFixed(6);
  document.getElementById("varWelford").innerText = varW.toFixed(6);
}


// ---- MEDIA ----
function mediaNaive(dati) {
  let somma = 0;
  for (let x of dati) {
    somma += x;
  }
  return somma / dati.length;
}


// ---- VARIANZA NAIVE ----
function varianzaNaive(dati) {
  let media = mediaNaive(dati);
  let somma = 0;

  for (let x of dati) {
    somma += (x * x);
  }

  return somma / dati.length - media * media;
}


// ---- VARIANZA WELFORD ----
function varianzaWelford(dati) {
  let n = 0;
  let media = 0;
  let M2 = 0;

  for (let x of dati) {
    n++;
    let delta = x - media;
    media += delta / n;
    let delta2 = x - media;
    M2 += delta * delta2;
  }

  return M2 / n;
}


// ---- CASO PATOLOGICO ----
function casoPatologico() {
  let dati = [1000000, 1000001, 1000002, 1000003, 1000004];

  let varN = varianzaNaive(dati);
  let varW = varianzaWelford(dati);

  document.getElementById("varNaivePat").innerText = varN;
  document.getElementById("varWelfordPat").innerText = varW;
}
