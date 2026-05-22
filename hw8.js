let portfolio = [];
let portfolioChart = null;

function addOption() {

  const type =
    document.getElementById("optionType").value;

  const position =
    document.getElementById("positionType").value;

  const strike = parseFloat(
    document.getElementById("strikeValue").value
  );

  let quantity = parseFloat(
    document.getElementById("quantityValue").value
  );

  if (isNaN(strike) || strike <= 0) {
    alert("Inserisci uno strike price valido.");
    return;
  }

  if (isNaN(quantity) || quantity <= 0) {
    alert("Inserisci una quantità positiva.");
    return;
  }

  if (position === "short") {
    quantity = -Math.abs(quantity);
  } else {
    quantity = Math.abs(quantity);
  }

  portfolio.push({
    type: type,
    position: position,
    strike: strike,
    quantity: quantity
  });

  updatePortfolioList();
  updatePortfolioChart();
}

function clearPortfolio() {

  portfolio = [];

  updatePortfolioList();
  updatePortfolioChart();
}

function updatePortfolioList() {

  const list =
    document.getElementById("portfolioList");

  list.innerHTML = "";

  if (portfolio.length === 0) {

    const li = document.createElement("li");

    li.textContent =
      "Nessuna opzione inserita.";

    list.appendChild(li);

    return;
  }

  portfolio.forEach((option, index) => {

    const li = document.createElement("li");

    li.textContent =
      `${index + 1}) ` +
      `${option.position.toUpperCase()} ` +
      `${option.type.toUpperCase()} | ` +
      `Strike = ${option.strike} | ` +
      `Quantità = ${Math.abs(option.quantity)}`;

    list.appendChild(li);
  });
}

function computeOptionPayoff(type, s, k) {

  if (type === "call") {
    return Math.max(s - k, 0);
  }

  if (type === "put") {
    return Math.max(k - s, 0);
  }

  return 0;
}

function updatePortfolioChart() {

  const canvas =
    document.getElementById("portfolioChart");

  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  if (portfolioChart) {
    portfolioChart.destroy();
  }

  if (portfolio.length === 0) {
    return;
  }

  const prices = [];
  const totalPayoff = [];

  const minPrice = 0;
  const maxPrice = 200;
  const step = 4;

  for (let s = minPrice; s <= maxPrice; s += step) {

    prices.push(s);

    let payoff = 0;

    portfolio.forEach(option => {

      payoff +=
        option.quantity *
        computeOptionPayoff(
          option.type,
          s,
          option.strike
        );
    });

    totalPayoff.push(payoff);
  }

  portfolioChart = new Chart(ctx, {

    type: "line",

    data: {

      labels: prices,

      datasets: [
        {
          label:
            "Payoff totale del portafoglio",

          data: totalPayoff,

          borderColor: "#51b84d",

          backgroundColor:
            "rgba(81,184,77,0.12)",

          fill: true,

          tension: 0,

          borderWidth: 2.5,

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

          text:
            "Payoff globale della strategia",

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
            text:
              "Prezzo finale del sottostante"
          },

          ticks: {
            maxTicksLimit: 10
          }
        },

        y: {

          title: {
            display: true,
            text: "Payoff totale"
          }
        }
      }
    }
  });
}

window.onload = function () {

  updatePortfolioList();
};
