let priceChart = null;
let pnlChart = null;

function generateRademacher() {
  return Math.random() < 0.5 ? -1 : 1;
}

function simulateBrownianPath(n, T) {
  const times = [0];
  const brownian = [0];

  let partialSum = 0;

  for (let k = 1; k <= n; k++) {
    partialSum += generateRademacher();

    times.push(parseFloat(((k * T) / n).toFixed(2)));
    brownian.push(partialSum / Math.sqrt(n));
  }

  return { times, brownian };
}

function buildGBM(times, brownian, mu, sigma, s0) {
  const prices = [];

  for (let i = 0; i < times.length; i++) {
    const t = times[i];
    const w = brownian[i];

    const value = s0 * Math.exp((mu - 0.5 * sigma * sigma) * t + sigma * w);
    prices.push(value);
  }

  return prices;
}

function applyTradingStrategy(prices) {
  const pnl = [0];
  const positions = [0];

  let position = 0;
  let buyCount = 0;
  let sellCount = 0;

  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > prices[i - 1] && position === 0) {
      position = 1;
      buyCount++;
    } else if (prices[i] < prices[i - 1] && position === 1) {
      position = 0;
      sellCount++;
    }

    const stepPnL = position * (prices[i] - prices[i - 1]);
    pnl.push(pnl[i - 1] + stepPnL);
    positions.push(position);
  }

  return {
    pnl,
    positions,
    buyCount,
    sellCount
  };
}

function computeMaximumDrawdown(pnl) {
  let runningMax = pnl[0];
  let maxDrawdown = 0;

  for (let i = 1; i < pnl.length; i++) {
    if (pnl[i] > runningMax) {
      runningMax = pnl[i];
    }

    const drawdown = runningMax - pnl[i];

    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  }

  return maxDrawdown;
}

function simulateStrategy() {
  const n = parseInt(document.getElementById("nSteps").value);
  const T = parseFloat(document.getElementById("timeHorizon").value);
  const mu = parseFloat(document.getElementById("muValue").value);
  const sigma = parseFloat(document.getElementById("sigmaValue").value);
  const s0 = parseFloat(document.getElementById("s0Value").value);

  if (
    isNaN(n) || isNaN(T) || isNaN(mu) || isNaN(sigma) || isNaN(s0) ||
    n <= 0 || T <= 0 || sigma <= 0 || s0 <= 0
  ) {
    alert("Inserisci valori validi.");
    return;
  }

  const brownianResult = simulateBrownianPath(n, T);
  const prices = buildGBM(brownianResult.times, brownianResult.brownian, mu, sigma, s0);
  const strategyResult = applyTradingStrategy(prices);
  const maxDrawdown = computeMaximumDrawdown(strategyResult.pnl);

  updateResults(n, T, mu, sigma, s0, strategyResult, maxDrawdown);
  updatePriceChart(brownianResult.times, prices, strategyResult.positions);
  updatePnLChart(brownianResult.times, strategyResult.pnl);
}

function simulateLargeN() {
  document.getElementById("nSteps").value = 1000;
  simulateStrategy();
}

function updateResults(n, T, mu, sigma, s0, strategyResult, maxDrawdown) {
  const finalPnL = strategyResult.pnl[strategyResult.pnl.length - 1];

  document.getElementById("outN").textContent = n;
  document.getElementById("outT").textContent = T.toFixed(2);
  document.getElementById("outMu").textContent = mu.toFixed(2);
  document.getElementById("outSigma").textContent = sigma.toFixed(2);
  document.getElementById("outS0").textContent = s0.toFixed(2);

  document.getElementById("finalPnL").textContent = finalPnL.toFixed(4);
  document.getElementById("maxDrawdown").textContent = maxDrawdown.toFixed(4);
  document.getElementById("buyCount").textContent = strategyResult.buyCount;
  document.getElementById("sellCount").textContent = strategyResult.sellCount;
}

function updatePriceChart(times, prices, positions) {
  const canvas = document.getElementById("priceChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  if (priceChart) {
    priceChart.destroy();
  }

  const buyPoints = [];
  const sellPoints = [];

  for (let i = 1; i < prices.length; i++) {
    if (positions[i] === 1 && positions[i - 1] === 0) {
      buyPoints.push({ x: times[i], y: prices[i] });
    }

    if (positions[i] === 0 && positions[i - 1] === 1) {
      sellPoints.push({ x: times[i], y: prices[i] });
    }
  }

  priceChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: times,
      datasets: [
        {
          label: "Prezzo simulato tramite GBM",
          data: prices,
          borderColor: "#51b84d",
          backgroundColor: "transparent",
          tension: 0,
          borderWidth: 2,
          pointRadius: 0
        },
        {
          label: "Buy",
          data: buyPoints,
          showLine: false,
          pointRadius: 5,
          pointStyle: "triangle",
          backgroundColor: "#1f77b4",
          borderColor: "#1f77b4"
        },
        {
          label: "Sell",
          data: sellPoints,
          showLine: false,
          pointRadius: 5,
          pointStyle: "rectRot",
          backgroundColor: "#d62728",
          borderColor: "#d62728"
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      parsing: false,
      plugins: {
        legend: {
          labels: {
            font: { size: 14 }
          }
        },
        title: {
          display: true,
          text: "GBM con segnali Buy/Sell",
          font: {
            size: 18,
            weight: "bold"
          }
        }
      },
      scales: {
        x: {
          type: "linear",
          title: {
            display: true,
            text: "Tempo"
          },
          ticks: {
            maxTicksLimit: 10,
            callback: function(value) {
              return Number(value).toFixed(2);
            }
          }
        },
        y: {
          title: {
            display: true,
            text: "Prezzo"
          }
        }
      }
    }
  });
}

function updatePnLChart(times, pnl) {
  const canvas = document.getElementById("pnlChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  if (pnlChart) {
    pnlChart.destroy();
  }

  pnlChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: times,
      datasets: [
        {
          label: "PnL cumulato",
          data: pnl,
          borderColor: "#444",
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
            font: { size: 14 }
          }
        },
        title: {
          display: true,
          text: "Profit and Loss cumulato",
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
          },
          ticks: {
            maxTicksLimit: 10,
            callback: function(value) {
              const label = this.getLabelForValue(value);
              return Number(label).toFixed(2);
            }
          }
        },
        y: {
          title: {
            display: true,
            text: "PnL"
          }
        }
      }
    }
  });
}

function resetCharts() {
  if (priceChart) {
    priceChart.destroy();
    priceChart = null;
  }

  if (pnlChart) {
    pnlChart.destroy();
    pnlChart = null;
  }

  document.getElementById("outN").textContent = "-";
  document.getElementById("outT").textContent = "-";
  document.getElementById("outMu").textContent = "-";
  document.getElementById("outSigma").textContent = "-";
  document.getElementById("outS0").textContent = "-";
  document.getElementById("finalPnL").textContent = "-";
  document.getElementById("maxDrawdown").textContent = "-";
  document.getElementById("buyCount").textContent = "-";
  document.getElementById("sellCount").textContent = "-";
}

window.onload = function () {
  simulateStrategy();
};
