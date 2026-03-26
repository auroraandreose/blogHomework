function generaRandomWalk() {
  const steps = parseInt(document.getElementById("steps").value);
  const startValue = parseInt(document.getElementById("startValue").value);

  if (isNaN(steps) || isNaN(startValue) || steps <= 0) {
    alert("Inserisci valori validi.");
    return;
  }

  let valori = [startValue];
  let x = startValue;
  let plus = 0;
  let minus = 0;

  for (let i = 1; i <= steps; i++) {
    const salto = Math.random() < 0.5 ? -1 : 1;

    if (salto === 1) {
      plus++;
    } else {
      minus++;
    }

    x += salto;
    valori.push(x);
  }

  document.getElementById("valoreIniziale").textContent = startValue;
  document.getElementById("valoreFinale").textContent = x;
  document.getElementById("numeroPassi").textContent = steps;
  document.getElementById("numPlus").textContent = plus;
  document.getElementById("numMinus").textContent = minus;

  disegnaGrafico(valori);
}

function disegnaGrafico(valori) {
  const canvas = document.getElementById("graficoRandomWalk");
  const ctx = canvas.getContext("2d");

  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;

  ctx.clearRect(0, 0, width, height);

  const minVal = Math.min(...valori);
  const maxVal = Math.max(...valori);
  const range = maxVal - minVal || 1;

  function scaleX(i) {
    return padding + (i / (valori.length - 1)) * (width - 2 * padding);
  }

  function scaleY(v) {
    return height - padding - ((v - minVal) / range) * (height - 2 * padding);
  }

  ctx.beginPath();
  ctx.strokeStyle = "#999";
  ctx.lineWidth = 1;
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = "#4caf50";
  ctx.lineWidth = 2.5;

  for (let i = 0; i < valori.length; i++) {
    const x = scaleX(i);
    const y = scaleY(valori[i]);

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.stroke();
}

window.onload = function () {
  generaRandomWalk();
};
}

window.onload = generaRandomWalk;
