let optionPayoffChart = null;

function computePayoff(strategy, s, k) {
  const callPayoff = Math.max(s - k, 0);
  const putPayoff = Math.max(k - s, 0);

  if (strategy === "call") {
    return callPayoff;
  }

  if (strategy === "put") {
    return putPayoff;
  }

  if (strategy === "straddle") {
    return callPayoff + putPayoff;
  }

  return 0;
}

function getStrategyLabel(strategy) {
  if (strategy === "call") {
    return "Payoff Long Call";
  }

  if (strategy === "put") {
    return "Payoff Long Put";
  }

  if (strategy === "straddle") {
    return "Payoff Long Straddle";
  }

  return "Payoff";
}

function updateOptionChart() {
  const strikeInput = document.getElementById("strikeValue");
  const strategyInput = document.getElementById("strategyType");

  const k = parseFloat(strikeInput.value);
  const strategy = strategyInput.value;

  if (isNaN(k) || k <= 0) {
    alert("Inserisci uno strike price valido.");
    return;
  }

  const prices = [];
  const payoff = [];

  const minPrice = 0;
  const maxPrice = 2 * k;
  const step = maxPrice / 50;

  for (let s = minPrice; s <= maxPrice; s += step) {
    const roundedPrice = parseFloat(s.toFixed(2));
    prices.push(roundedPrice);
    payoff.push(computePayoff(strategy, roundedPrice, k));
  }

  drawOptionChart(prices, payoff, strategy);
}

function drawOptionChart(prices, payoff, strategy) {
  const canvas = document.getElementById("optionPayoffChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  if (optionPayoffChart) {
    optionPayoffChart.destroy();
  }

  optionPayoffChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: prices,
      datasets: [
        {
          label: getStrategyLabel(strategy),
          data: payoff,
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
            font: { size: 14 }
          }
        },
        title: {
          display: true,
          text: "Payoff della strategia opzionale",
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
            text: "Prezzo finale del sottostante"
          },
          ticks: {
            maxTicksLimit: 10
          }
        },
        y: {
          title: {
            display: true,
            text: "Payoff"
          }
        }
      }
    }
  });
}

window.onload = function () {
  updateOptionChart();
};
