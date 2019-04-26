var ingredienti = [];
var gusti = [];
var ogg = [];

function crealistaDOM(text, father){
    var lista = document.createElement("LI");  //creo li
    lista.className = "ListIn";             //aggiungo alla classe
    lista.appendChild(document.createTextNode(text));
    father.appendChild(lista);
    var del = document.createElement("SPAN");//tasto di chiusura
    del.appendChild(document.createTextNode(" \u2718"));
    del.className = 'close';
    father.appendChild(del);
    return del;
}


//OK
//dato il nome di un form  e un indice(se ho più liste sotto il form) aggiunge alla lista l'ingrediente
function InserisciIngrediente(indice, pannello) {
        "use strict";
        chiudialtretendine();
        var panel = document.getElementById(pannello);
        var contenitorenome = document.getElementsByClassName("nomelista")[indice];
        var contenitorequanto = document.getElementsByClassName("quantolista")[indice];
        var contenitorediv = document.getElementsByClassName("WrapListaSotto")[indice];
        var nome = contenitorenome.value;
        var quanto = contenitorequanto.value;
    if(verificapresenza(ingredienti, nome)){
        scrivirisultato("ingrediente già inserito");
        Fallimento();
        contenitorenome.value = "";
        contenitorequanto.value = "";
        return false;
    }
    if (quanto < 0) {
        scrivirisultato("Attenzione, quantità negativa");
        Fallimento();
        contenitorequanto.value = "";
        return false;
    }
    if (quanto == "") {
        scrivirisultato("ingrediente quantità non inserita");
        Fallimento();
        return false;
    }
    if (nome == "") {
        scrivirisultato("Nome non inserito");
        Fallimento();
        return false;
    } else {
        var xmlhttp;
        if (xmlhttp = CreaRichiesta()) {
            xmlhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var result = JSON.parse(this.responseText);
                    if (result.Error) {
                        scrivirisultato(result.Error);
                        Fallimento();
                        contenitorenome.value = "";
                        contenitorequanto.value = "";
                        return false;
                    } else {
                        var ingr = {
                            nome: nome,
                            quanto: quanto,
                            id: result.id,
                            prezzo: result.prezzo
                        };
                        ingredienti.push(ingr);
                        var del = crealistaDOM(nome + ",   " + quanto, contenitorediv.firstElementChild );
                        del.onclick = function () {
                                TogliLista(ingredienti, ingredienti.length - 1, contenitorediv, panel);
                            }
                        contenitorenome.value = "";
                        contenitorequanto.value = "";
                        panel.style.maxHeight = panel.scrollHeight + "px";
                    }
                }
            };
            xmlhttp.open("GET", "php/VerificaIngrediente.php?nome=" + nome, true);
            xmlhttp.send();
        }
    }
}


function InserisciOggetto(indice, pannello) {
    "use strict";
    chiudialtretendine();
    var panel = document.getElementById(pannello);
    var contenitorenome = document.getElementsByClassName("nomelista")[indice];
    var contenitorequanto = document.getElementsByClassName("quantolista")[indice];
    var contenitorediv = document.getElementsByClassName("WrapListaSotto")[indice];
    var nome = contenitorenome.value;
    var quanto = contenitorequanto.value;
    if(verificapresenza(ogg, nome)){
        scrivirisultato("ingrediente già inserito");
        Fallimento();
        contenitorenome.value = "";
        contenitorequanto.value = "";
        return false;
    }
    if (quanto < 0) {
        scrivirisultato("Attenzione, quantità negativa");
        Fallimento();
        contenitorequanto.value = "";
        return false;
    }
    if (quanto == "") {
        scrivirisultato("quantità non inserita");
        Fallimento();
        return false;
    }
    if (nome == "") {
        scrivirisultato("Nome non inserito");
        Fallimento();
        return false;
    } else {
        var xmlhttp;
        if (xmlhttp = CreaRichiesta()) {
            xmlhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var response = JSON.parse(this.responseText);
                    if (response.Error) {
                        scrivirisultato(response.Error);
                        Fallimento();
                        return false;
                    } else {
                        var oggetto = {id: response.id, quanto: quanto, nome: nome};
                        ogg.push(oggetto);
                        var del = crealistaDOM(nome + ",    " + quanto + " Pezzi",contenitorediv.firstElementChild  );
                        del.onclick = function () {
                                TogliLista(ogg, ogg.length - 1, contenitorediv, panel, "Pezzi");
                        }
                        contenitorequanto.value = "";
                        contenitorenome.value = "";
                        panel.style.maxHeight = panel.scrollHeight + "px";
                    }
                }
            }
        };
        xmlhttp.open("GET", "php/verificaoggetto.php?nome=" + nome, true);
        xmlhttp.send();
    }
}

function InserisciGusto(indice, pannello) {
    "use strict";
    chiudialtretendine();
    var panel = document.getElementById(pannello);
    var contenitorenome = document.getElementsByClassName("nomelista")[indice];
    var contenitorequanto = document.getElementsByClassName("quantolista")[indice];
    var contenitorediv = document.getElementsByClassName("WrapListaSotto")[indice];
    var nome = contenitorenome.value;
    var quanto = contenitorequanto.value;
    if(verificapresenza(gusti, nome)){
        scrivirisultato("ingrediente già inserito");
        Fallimento();
        contenitorenome.value = "";
        contenitorequanto.value = "";
        return false;
    }
    if (quanto < 0) {
        scrivirisultato("Attenzione, quantità negativa");
        Fallimento();
        contenitorequanto.value = "";
        return false;
    }
    if (quanto == "") {
        scrivirisultato("quantità non inserita");
        Fallimento();
        return false;
    }
    if (nome == "") {
        scrivirisultato("Nome non inserito");
        Fallimento();
        return false;
    } else {
        var xmlhttp;
        if (xmlhttp = CreaRichiesta()) {
            xmlhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var response = JSON.parse(this.responseText);
                    if (response.Error) {
                        scrivirisultato(response.Error);
                        Fallimento();
                        return false;
                    } else {
                        var gust = {id: response.id, quanto: quanto, nome: nome};
                        gusti.push(gust);
                        var del = crealistaDOM(nome + ",    " + quanto + " Kg",contenitorediv.firstElementChild  );
                        del.onclick = function () {
                            TogliLista(gusti, gusti.length - 1, contenitorediv, panel, "Kg");
                        }
                        contenitorequanto.value = "";
                        contenitorenome.value = "";
                        panel.style.maxHeight = panel.scrollHeight + "px";
                    }
                }
            }
        };
        xmlhttp.open("GET", "php/verificagusto.php?nome=" + nome, true);
        xmlhttp.send();
    }
}



function TogliLista(vettore, id, contenitorediv, panel) {
    "use strict";
    var finescritta = "";
    if(arguments.length>4){
        finescritta = arguments[4];
    }
    var lis = contenitorediv.getElementsByClassName("ListIn");
    var numeroelementi = vettore.length - 1;
    for (var j = id; j < vettore.length - 1; j++) {
        vettore[j] = vettore[j + 1];
        var t = document.createTextNode(vettore[j].nome + ",   " + vettore[j].quanto+finescritta);
        lis[j].removeChild(lis[j].firstChild);
        lis[j].appendChild(t);
    }
    vettore.pop();
    var x = contenitorediv.getElementsByClassName("close");
    var ul = contenitorediv.firstElementChild;
    ul.removeChild(lis[numeroelementi]);
    ul.removeChild(x[numeroelementi]);
    panel.style.maxHeight = panel.scrollHeight + "px";
}



function verificapresenza(vettore, nome){
    "use strict";
    for(var j = 0 ; j<vettore.length; j++){
        if(nome === vettore[j].nome) {
            return true;
        }
    }
    return false;
}
