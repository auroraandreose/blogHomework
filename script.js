// 1. Manipolazione del CONTENUTO
function cambiaContenuto() {
    const testo = document.getElementById("testo-dinamico");
    testo.innerHTML = "<strong>Testo modificato!</strong> Ora il DIV contiene nuovi tag HTML.";
    console.log("Contenuto cambiato.");
}

// 2. Manipolazione dello STILE (CSS)
function cambiaColore() {
    const box = document.getElementById("box");
    // Generiamo un colore casuale per mostrare una manipolazione dinamica
    const randomColor = Math.floor(Math.random()*16777215).toString(16);
    box.style.backgroundColor = "#" + randomColor;
    box.style.border = "3px solid #1a1a1a";
    box.style.borderRadius = "20px";
}

// 3. Manipolazione della STRUTTURA (Aggiunta di nuovi nodi)
function aggiungiElemento() {
    const box = document.getElementById("box");
    const nuovoParagrafo = document.createElement("p");
    nuovoParagrafo.innerText = "✨ Nuovo elemento creato alle " + new Date().toLocaleTimeString();
    nuovoParagrafo.style.color = "#000000";
    box.appendChild(nuovoParagrafo);
}

// 4. RESET (Ripristino dello stato iniziale)
function resetBox() {
    const box = document.getElementById("box");
    box.innerHTML = '<p id="testo-dinamico">Elemento target per le manipolazioni.</p>';
    box.style.backgroundColor = "white";
    box.style.border = "1px solid #ddd";
    box.style.borderRadius = "8px";
    box.style.padding = "25px";
}
