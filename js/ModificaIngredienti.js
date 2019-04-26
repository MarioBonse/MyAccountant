
var ingredientedamodificare;
var vecchioprezzo;

function modifica() {
    "use strict";
    var val = document.getElementById("modbutton");
    var form = document.getElementById("MOD");
    var nomeingrediente = form.Nomeingr.value;
    var xmlhttp;
    if (xmlhttp = CreaRichiesta()) {
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var result = JSON.parse(this.responseText);
                if (result.Error) {
                    scrivirisultato(result.Error);
                    Fallimento();
                    ritornanormale();
                } else {
                    val.textContent = "esegui";
                    val.onclick = eseguimodifica;
                    form.Nomeingr.disabled = true;
                    var divsinistro = document.getElementById("WrapTabellaIngredienteModifica");
                    var divedestro = document.getElementById("WrapTastoAnnullaModificaIngrediente");
                    var table = document.createElement("TABLE");
                    table.className = "modifica-table";
                    CreaTitolo(table, "Nome", "Vecchio Prezzo", "NuovoPrezzo");
                    var riga = document.createElement("TR");
                    var cella = document.createElement("TD");
                    ingredientedamodificare = nomeingrediente;
                    vecchioprezzo = result.prezzo;
                    var euro = document.createElement("SPAN");
                    euro.className = "euro";
                    euro.id = "nuovoprezzo";
                    var input = document.createElement("INPUT");
                    input.name = "newprezzo";
                    input.type = "number";
                    euro.appendChild(input);
                    CreaRiga(table, document.createTextNode(nomeingrediente), document.createTextNode(result.prezzo + " \u20AC") , input);
                    divsinistro.appendChild(table);
                    var button = document.createElement("BUTTON");
                    button.appendChild(document.createTextNode("Annulla"));
                    button.className = "annulla";
                    button.type = "button";
                    button.onclick = ritornanormale;
                    divedestro.appendChild(button);
                    document.getElementById("PannelloModifica").style.maxHeight = document.getElementById("PannelloModifica").scrollHeight + "px";
                }

            }
        };
        xmlhttp.open("GET", "php/VerificaIngrediente.php?nome=" + nomeingrediente, true);
        xmlhttp.send();
    }
}


function eseguimodifica() {
    "use strict";
    var val = document.getElementById("modbutton");
    var form = document.getElementById("MOD");
    var nuovoprezzo = form.newprezzo.value;
    if(nuovoprezzo === vecchioprezzo){
        MessaggiaErrore("prezzo non modificato");
        return false;
    }
    if (nuovoprezzo === "") {
        MessaggiaErrore("prezzo non inserito");
        return false;
    }
    var xmlhttp;
    if (xmlhttp = CreaRichiesta()) {
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var result = JSON.parse(this.responseText);
                if (result.Error) {
                    scrivirisultato(result.Error);
                    Fallimento();
                } else {
                    scrivirisultato(result.Status);
                    Successo();
                }
                ritornanormale();

            }
        };
        xmlhttp.open("GET", "php/ModificaPrezzoIngrediente.php?nome=" + ingredientedamodificare + "&prezzo=" + nuovoprezzo+"&vecchioprezzo="+vecchioprezzo, true);
        xmlhttp.send();
    }
}

function ritornanormale(){
    "use strict";
    var val = document.getElementById("modbutton");
    var form = document.getElementById("MOD");
    form.reset();
    form.Nomeingr.disabled = false;
    val.textContent = "Modifica";
    val.onclick = modifica;
    var divsinistro = document.getElementById("WrapTabellaIngredienteModifica");
    var divedestro = document.getElementById("WrapTastoAnnullaModificaIngrediente");
    eliminaDOMfiglio(divsinistro);
    eliminaDOMfiglio(divedestro);
    document.getElementById("PannelloModifica").style.maxHeight = document.getElementById("PannelloModifica").scrollHeight + "px";
}
