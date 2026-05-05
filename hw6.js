let strategyChart = null;

function generateRademacher() {
  return Math.random() < 0.5 ? -1 : 1;
}

function simulateBrownianPath(n, T) {
  const times = [0];
  const brownian = [0];

  let partialSum = 0;

  for (let k = 1; k <= n; k++) {
    partialSum += generateRademacher();

    times.push(parseFloat(((k * T) / n).toFixed(3)));
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
  let tradeCount = 0;

  for (let i = 1; i < prices.length; i++) {
    const stepPnL = position * (prices[i] - prices[i - 1]);
    pnl.push(pnl[i - 1] + stepPnL);

    if (prices[i] > prices[i - 1] && position === 0) {
      position = 1;
      tradeCount++;
    } else if (prices[i] < prices[i - 1] && position === 1) {
      position = 0;
      tradeCount++;
    }

    positions.push(position);
  }

  return {
    pnl,
    positions,
    tradeCount
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

  updateResults(prices, strategyResult, maxDrawdown);
  updateChart(brownianResult.times, prices, strategyResult.pnl);
}

function simulateLargeN() {
  document.getElementById("nSteps").value = 1000;
  simulateStrategy();
}

function updateResults(prices, strategyResult, maxDrawdown) {
  const finalGBM = prices[prices.length - 1];
  const finalPnL = strategyResult.pnl[strategyResult.pnl.length - 1];

  document.getElementById("finalGBM").textContent = finalGBM.toFixed(4);
  document.getElementById("finalPnL").textContent = finalPnL.toFixed(4);
  document.getElementById("maxDrawdown").textContent = maxDrawdown.toFixed(4);
  document.getElementById("tradeCount").textContent = strategyResult.tradeCount;
}

function updateChart(times, prices, pnl) {
  const canvas = document.getElementById("strategyChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  if (strategyChart) {
    strategyChart.destroy();
  }

  strategyChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: times,
      datasets: [
        {
          label: "Prezzo simulato con GBM",
          data: prices,
          borderColor: "#51b84d",
          backgroundColor: "transparent",
          yAxisID: "yPrice",
          tension: 0,
          borderWidth: 2,
          pointRadius: 0
        },
        {
          label: "PnL cumulato della strategia",
          data: pnl,
          borderColor: "#e67e22",
          backgroundColor: "transparent",
          yAxisID: "yPnL",
          tension: 0,
          borderWidth: 2,
          pointRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      interaction: {
        mode: "index",
        intersect: false
      },
      plugins: {
        legend: {
          labels: {
            font: { size: 14 }
          }
        },
        title: {
          display: true,
          text: "GBM e PnL cumulato della strategia Buy/Sell",
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
        yPrice: {
          type: "linear",
          position: "left",
          title: {
            display: true,
            text: "Prezzo GBM"
          }
        },
        yPnL: {
          type: "linear",
          position: "right",
          title: {
            display: true,
            text: "PnL cumulato"
          },
          grid: {
            drawOnChartArea: false
          }
        }
      }
    }
  });
}

function resetChart() {
  if (strategyChart) {
    strategyChart.destroy();
    strategyChart = null;
  }

  document.getElementById("finalGBM").textContent = "-";
  document.getElementById("finalPnL").textContent = "-";
  document.getElementById("maxDrawdown").textContent = "-";
  document.getElementById("tradeCount").textContent = "-";
}

window.onload = function () {
  simulateStrategy();
};
