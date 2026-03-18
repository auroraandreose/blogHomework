function cambiaTesto() {
    const box = document.getElementById("box");
    const ora = new Date().toLocaleTimeString();
    
    // 1. Manipolazione del contenuto (HTML)
    box.innerHTML = "<h4>Contenuto Aggiornato!</h4><p>Ultima modifica alle: " + ora + "</p>";
    
    // 2. Manipolazione dello stile (CSS via JS)
    box.style.backgroundColor = "#e8f5e9";
    box.style.border = "2px solid #4CAF50";
    
    // 3. Log in console per verifica
    console.log("Il contenuto del DIV è stato modificato con successo alle " + ora);
}
