var selezionatoora = null;

function crealistasuggerimento(val, text, nome){
    var lista, br, tendina;
    tendina = val.nextElementSibling;
    tendina.style.width = val.offsetWidth+"px";
    lista = document.createElement("DIV");
    testo = document.createTextNode(text);
    br = document.createElement("BR");
    lista.appendChild(testo);
    lista.appendChild(br);
    lista.className = "Suggerisco";
    tendina.appendChild(lista);
    lista.onclick = (function (name, val) {
        return function () {
            val.value = name;
            var tendina = val.nextElementSibling;
            eliminaDOMfiglio(tendina);
            tendina.style.display = "hidden";
            selezionatoora = null;
        };

    })(nome, val);
    lista.onmouseover = function () {
        if(selezionatoora) {
            selezionatoora.className = "Suggerisco";
        }
        this.className = "selected";
        selezionatoora = this;
    };
}

function aggiornaingredienteselezionato(code, val) {
    "use strict";
    var tendina = val.nextElementSibling;
    var listaelementi = tendina.getElementsByTagName("DIV");
    if(!selezionatoora && code ===40){
        selezionatoora = listaelementi[0];
        listaelementi[0].className = "selected";
        return;
    }
    if(!selezionatoora){
        return;
    }
    if(code === 38){//freccia su
        if(!selezionatoora.previousSibling) {
            selezionatoora.className = "Suggerisco";
            selezionatoora = null;
            return;
        }
        selezionatoora.className = "Suggerisco";
        selezionatoora.previousSibling.className = "selected";
        selezionatoora = selezionatoora.previousSibling;
    }
    if(code === 40){//freccia giu
        if(!selezionatoora.nextSibling){
            selezionatoora.className = "Suggerisco";
            selezionatoora = null;
            return;
        }
        selezionatoora.className = "Suggerisco";
        selezionatoora.nextSibling.className = "selected";
        selezionatoora = selezionatoora.nextSibling;
    }
}

// ricerca dei gusti
function CercaSuggerimentoGusto(val, event) {
    "use strict";
    var code = event.which || event.keyCode;
    var tendina;
    tendina = val.nextElementSibling;
    if (code === 40 || code === 38) {
        aggiornaingredienteselezionato(code, val);
    } else if (code === 13) {
        val.value = selezionatoora.textContent;
        selezionatoora.className = "Suggerisco";
        selezionatoora = null;
        eliminaDOMfiglio(tendina);
        tendina.style.display = "hidden";
    } else {
        chiudialtretendine();
        var nome = val.value;
        if (nome == "") {
            document.getElementsByClassName("Tendina")[0].style.display = "none";
        } else {
            var xmlhttp;
            if (xmlhttp = CreaRichiesta()) {
                xmlhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        var nome = JSON.parse(this.response);
                        for (var j = 0; j < nome.length; j++) {
                            crealistasuggerimento(val, nome[j], nome[j]);
                        }
                        tendina.style.display = "inherit";
                    }
                };
                xmlhttp.open("GET", "php/suggerimentogusto.php?nome=" + nome, true);
                xmlhttp.send();
            }
        }
    }
}


//ricerca oggetto generico
function CercaSuggerimentoOggetto(val, event) {
    "use strict";
    var code = event.which || event.keyCode;
    var tendina;
    tendina = val.nextElementSibling;
    if (code === 40 || code === 38) {
        aggiornaingredienteselezionato(code, val);
    } else if (code === 13) {
        val.value = (selezionatoora.textContent).substr(0, (selezionatoora.textContent).indexOf("--"));
        selezionatoora.className = "Suggerisco";
        selezionatoora = null;
        eliminaDOMfiglio(tendina);
        tendina.style.display = "hidden";
    } else {
        chiudialtretendine();
        var nome = val.value;
        if (nome == "") {
            document.getElementsByClassName("Tendina")[1].style.display = "none";
        } else {
            var xmlhttp;
            if (xmlhttp = CreaRichiesta()) {
                xmlhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        var obj = JSON.parse(this.response);
                        var nome = JSON.parse(obj.nome);
                        var prezzo = JSON.parse(obj.prezzo);
                        for (var j = 0; j < nome.length; j++) {
                            crealistasuggerimento(val, nome[j] + "--" + prezzo[j] + " \u20ac", nome[j]);
                        }
                        tendina.style.display = "inherit";
                    }
                };
                xmlhttp.open("GET", "php/suggerimentooggetto.php?nome=" + nome, true);
                xmlhttp.send();
            }
        }
    }
}

//per l'ingrediente generico
function CercaSuggerimentoIngrediente(val, event) {
    "use strict";
    var code = event.which || event.keyCode;
    var tendina;
    tendina = val.nextElementSibling;
    if (code === 40 || code === 38) {
        aggiornaingredienteselezionato(code, val);
    } else if (code === 13) {
        val.value = (selezionatoora.textContent).substr(0, (selezionatoora.textContent).indexOf("--"));
        selezionatoora.className = "Suggerisco";
        selezionatoora = null;
        eliminaDOMfiglio(tendina);
        tendina.style.display = "hidden";
    } else {
        chiudialtretendine();
        var li, a, testo, br;
        var nome = val.value;
        if (nome == "") {
            tendina.style.display = "none";
        } else {
            var xmlhttp;
            if (xmlhttp = CreaRichiesta()) {
                xmlhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        var obj = JSON.parse(this.responseText);
                        var nome = JSON.parse(obj.nome);
                        var prezzo = JSON.parse(obj.prezzo);
                        var fornitore = JSON.parse(obj.fornitore);
                        var ID = JSON.parse(obj.ID);
                        for (var j = 0; j < nome.length; j++) {
                            crealistasuggerimento(val, nome[j] + "--" + fornitore[j] + "--" + prezzo[j] + " \u20ac", nome[j]);
                        }
                        tendina.style.display = "inherit";
                    }
                };
                xmlhttp.open("GET", "php/SuggerimentoIngrediente.php?nome=" + nome, true);
                xmlhttp.send();
            }
        }
    }
}

function  chiudialtretendine() {
    "use strict";
    var tendine = document.getElementsByClassName("Tendina");
    for(var i = 0; i< tendine.length; i++){
        var tendina = tendine[i];
        eliminaDOMfiglio(tendina);
        tendina.style.display = "none";
    }
}
