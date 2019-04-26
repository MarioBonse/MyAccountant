function attiva(indicepaginazione ,nuovoindice, vecchioindice){
    "use strict";
    var vecchio = document.getElementsByClassName("paginazione")[indicepaginazione].childNodes[vecchioindice];
    var nuovo = document.getElementsByClassName("paginazione")[indicepaginazione].childNodes[nuovoindice];
    if(vecchioindice){
        vecchio.className = vecchio.className.replace("paginazionescelta", "");
    }
    nuovo.className = "paginazionescelta";
}



function creapaginazione(contenitorelista, numeropagine, funzione){
    "use strict";
    var a = document.createElement("A");
    a.textContent = "←"
    a.onclick = function(){ funzione("meno");};
    contenitorelista.appendChild(a);
    for(var j = 0 ; j< numeropagine; j++){
        a = document.createElement("A");
        a.textContent = j;
        a.onclick = function(){ funzione(this);};
        contenitorelista.appendChild(a);
    }
    a = document.createElement("A");
    a.textContent = "→"
    a.onclick = function(){ funzione("piu");};
    contenitorelista.appendChild(a);

}

function aggiornapaginaattuale(paginaattuale, risposta, pagine) {
    "use strict";
    if(risposta === "meno"){
        if(paginaattuale > 0){
            paginaattuale --;
        }
    }
    else if(risposta === "piu"){
        if(paginaattuale < pagine-1) {
            paginaattuale++;
        }
    }else{
        paginaattuale = Number(risposta.textContent);
    }
    return paginaattuale;
}
