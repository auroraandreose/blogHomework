let processChart = null;

function generateRademacher() {
  return Math.random() < 0.5 ? -1 : 1;
}

function simulateScaledRandomWalk(n, T) {
  const times = [];
  const rwValues = [];
  let partialSum = 0;
  let plusCount = 0;
  let minusCount = 0;

  times.push(0);
  rwValues.push(0);

  for (let k = 1; k <= n; k++) {
    const step = generateRademacher();
    partialSum += step;

    if (step === 1) {
      plusCount++;
    } else {
      minusCount++;
    }

    const scaledRW = partialSum / Math.sqrt(n);

    times.push(parseFloat(((k * T) / n).toFixed(2)));
    rwValues.push(scaledRW);
  }

  return {
    times,
    rwValues,
    plusCount,
    minusCount
  };
}

function simulateProcess() {
  const n = parseInt(document.getElementById("nSteps").value);
  const T = parseFloat(document.getElementById("timeHorizon").value);

  if (isNaN(n) || isNaN(T) || n <= 0 || T <= 0) {
    alert("Inserisci valori validi per n e T.");
    return;
  }

  const result = simulateScaledRandomWalk(n, T);

  updateResults(n, T, result);
  updateChart(result.times, result.rwValues);
}

function simulateLargeN() {
  document.getElementById("nSteps").value = 1000;
  simulateProcess();
}

function updateResults(n, T, result) {
  document.getElementById("outN").textContent = n;
  document.getElementById("outT").textContent = T.toFixed(2);
  document.getElementById("finalRW").textContent =
    result.rwValues[result.rwValues.length - 1].toFixed(4);
  document.getElementById("plusCount").textContent = result.plusCount;
  document.getElementById("minusCount").textContent = result.minusCount;
}

function updateChart(times, rwValues) {
  const canvas = document.getElementById("processChart");
  if (!canvas) return;

  if (typeof Chart === "undefined") {
    console.error("Chart.js non è stato caricato.");
    return;
  }

  const ctx = canvas.getContext("2d");

  if (processChart) {
    processChart.destroy();
  }

  processChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: times,
      datasets: [
        {
          label: "Random Walk scalata",
          data: rwValues,
          borderColor: "#51b84d",
          backgroundColor: "transparent",
          tension: 0,
          borderWidth: 2,
          pointRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          labels: {
            font: {
              size: 14
            }
          }
        },
        title: {
          display: true,
          text: "Random Walk scalata su [0, T]",
          font: {
            size: 18,
            weight: "bold"
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Tempo"
          }
        },
        y: {
          title: {
            display: true,
            text: "Valore del processo"
          }
        }
      }
    }
  });
}

function resetChart() {
  if (processChart) {
    processChart.destroy();
    processChart = null;
  }

  document.getElementById("outN").textContent = "-";
  document.getElementById("outT").textContent = "-";
  document.getElementById("finalRW").textContent = "-";
  document.getElementById("plusCount").textContent = "-";
  document.getElementById("minusCount").textContent = "-";
}

window.onload = function () {
  simulateProcess();
};
