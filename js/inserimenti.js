function InserisciNuovoIngrediente() {
    "use strict";
    var form = document.getElementById("INGR");
    var nome = form.NomeIngrediente.value;
    var fornitore = form.Nomefornitore.value;
    var prezzo = form.Prezzo.value;
    if (prezzo === "") {
        MessaggiaErrore("prezzo non inserito");
        return false;
    }
    if (fornitore === "") {
        MessaggiaErrore("fornitore non inserito");
        return false;
    }
    if (nome === "") {
        MessaggiaErrore("nome non inserito");
        return false;
    }
    var xmlhttp;
    if (xmlhttp = CreaRichiesta()) {
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {//se ho i risultati
                var response = JSON.parse(this.responseText);
                if (response.Error) {      //if an error occurred while uploading the items
                    scrivirisultato(response.Error);
                    Fallimento();
                } else {
                    scrivirisultato("ingrediente inserito correttamente!");
                    Successo(); //if no error occurred, should print a successful message

                }
                form.reset();
            }
        };
        xmlhttp.open("POST", "php/InserisciNuovoIngrediente.php", true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send("nome=" + nome + "&fornitore=" + fornitore + "&prezzo=" + prezzo);
    }
}


function InserisciNuovaRicetta(indice) {
    "use strict";
    var ul= document.getElementsByClassName("WrapListaSotto")[indice].firstElementChild;
    var form = document.getElementById("RIC");
    var response;
    var nome = form.NomeRicetta.value;
    var descrizione = form.Descrizione.value;
    if (isEmpty(ingredienti)) {
        MessaggiaErrore("Nessun ingrediente inserito");
        return false;
    }
    if (nome == "") {
        MessaggiaErrore("nome non inserito");
        return false;
    }
    if (descrizione == "") {
        MessaggiaErrore("descrizione non inserita");
        return false;
    }
    var ingre = JSON.stringify(ingredienti);
    var xmlhttp;
    if (xmlhttp = CreaRichiesta()) {
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                response = JSON.parse(this.responseText);
                if (response.Error) {
                    scrivirisultato(response.Error);
                    Fallimento();
                    return false;
                } else {
                    scrivirisultato("Inserimento avvenuto con successo");
                    ingredienti = [];
                    form.reset();
                    while (ul.hasChildNodes()) {
                        ul.lastElementChild.remove(false);
                    }
                    document.getElementById("pannelloricette").style.maxHeight = document.getElementById("pannelloricette").scrollHeight + "px";
                    Successo();
                }
            }
        };
        xmlhttp.open("POST", "php/NuovaRicetta.php", true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send("nome=" + nome + "&descrizione=" + descrizione + "&ingredienti=" + ingre);
    }
}



function InserisciProduzione(indice) {
    "use strict";
    var ul= document.getElementsByClassName("WrapListaSotto")[indice].firstElementChild;
    if (isEmpty(gusti)) {
        scrivirisultato("Nessun gusto inserito");
        Fallimento();
        return false;
    }
    var form = document.getElementById("RISU");
    var response, anno, mese, giorno;
    var data = new Date();
    if (form.GC.value == 1) { //se è settato allora ho inserito una data diversa
        data = new Date(form.Giornoinserimento.value);
    }
    giorno = data.getDate();
    mese = data.getMonth() + 1;
    anno = data.getFullYear();
    var gustijson = JSON.stringify(gusti);
    var xmlhttp;
    if (xmlhttp = CreaRichiesta()) {
        xmlhttp.onreadystatechange = function () {
            "use strict";
            if (this.readyState == 4 && this.status == 200) {
                response = JSON.parse(this.responseText);
                if (response.Error) {
                    scrivirisultato(response.Error);
                    Fallimento();
                } else {
                    gusti = [];
                    form.reset();
                    while (ul.hasChildNodes()) {
                        ul.lastElementChild.remove(false);
                    }
                    scrivirisultato(response.Status);
                    Successo();
                }
            }
        };
        xmlhttp.open("POST", "php/nuovaproduzione.php", true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send("anno=" + anno + "&mese=" + mese + "&giorno=" + giorno + "&gusti=" + gustijson);
    }
}




function InserisciNuovoOggetto() {
    "use strict";
    var response;
    var form = document.getElementById("OGG");
    var nome = form.NomeOggetto.value;
    var prezzo = form.Prezzo.value;
    var xmlhttp;
    if (xmlhttp = CreaRichiesta()) {
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                response = JSON.parse(this.responseText);
                if (response.Error) {      //if an error occurred while uploading the items
                    scrivirisultato(response.Error);
                    Fallimento();
                } else {
                    scrivirisultato(response.Status);
                    Successo();
                    form.reset();

                }
                form.reset();
            }
        };
        xmlhttp.open("POST", "php/InserisciNuovoOggetto.php", true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send("nome=" + nome + "&prezzo=" + prezzo);
    }
}
