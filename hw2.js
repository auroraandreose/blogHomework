let histogramChart = null;
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

function calcolaIstogramma(dati, bins = 20) {
  const min = Math.min(...dati);
  const max = Math.max(...dati);
  const ampiezza = (max - min) / bins;
  const frequenze = new Array(bins).fill(0);
  const etichette = [];

  for (let i = 0; i < bins; i++) {
    const sinistra = min + i * ampiezza;
    const destra = min + (i + 1) * ampiezza;
    etichette.push(`${sinistra.toFixed(2)} - ${destra.toFixed(2)}`);
  }

  for (let x of dati) {
    let indice = Math.floor((x - min) / ampiezza);
    if (indice === bins) indice = bins - 1;
    frequenze[indice]++;
  }

  return { etichette, frequenze };
}

function disegnaIstogramma(dati, nome, coloreSfondo, coloreBordo) {
  const { etichette, frequenze } = calcolaIstogramma(dati, 20);
  const ctx = document.getElementById("histChart").getContext("2d");

  if (histogramChart) {
    histogramChart.destroy();
  }

  histogramChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: etichette,
      datasets: [{
        label: `Istogramma - ${nome}`,
        data: frequenze,
        backgroundColor: coloreSfondo,
        borderColor: coloreBordo,
        borderWidth: 1,
        barPercentage: 1.0,
        categoryPercentage: 1.0
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true
        },
        title: {
          display: true,
          text: `Distribuzione empirica: ${nome}`
        }
      },
      scales: {
        x: {
          ticks: {
            maxRotation: 90,
            minRotation: 45
          },
          title: {
            display: true,
            text: "Classi"
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Frequenza"
          }
        }
      }
    }
  });
}

function mostraDistribuzione(nome, dati, coloreSfondo, coloreBordo) {
  const media = mediaNaive(dati);
  const varianza = varianzaWelford(dati);

  document.getElementById("distNome").textContent = nome;
  document.getElementById("distCampione").textContent = dati.length;
  document.getElementById("distMedia").textContent = media.toFixed(6);
  document.getElementById("distVarianza").textContent = varianza.toFixed(6);

  disegnaIstogramma(dati, nome, coloreSfondo, coloreBordo);
}

function demoUniforme() {
  const dati = generaUniformeDistribuzione();
  mostraDistribuzione(
    "Uniforme U[0,1)",
    dati,
    "rgba(76, 175, 80, 0.6)",
    "rgba(76, 175, 80, 1)"
  );
}

function demoEsponenziale() {
  const dati = generaEsponenziale();
  mostraDistribuzione(
    "Esponenziale",
    dati,
    "rgba(255, 152, 0, 0.6)",
    "rgba(255, 152, 0, 1)"
  );
}

function demoNormale() {
  const dati = generaNormale();
  mostraDistribuzione(
    "Normale standard",
    dati,
    "rgba(33, 150, 243, 0.6)",
    "rgba(33, 150, 243, 1)"
  );
}
