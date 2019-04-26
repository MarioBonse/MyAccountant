var vecchionomeingrediente;
var vecchiofornitore;
var vecchioprezzo;

function modificaingrediente(indice){
    "use strict";
    RendiVisibileScheda("BoxSchedaPiccolo");
    var form = document.getElementById("MODINGR");
    var tabella = document.getElementById("TabellVisualizzazioneIngredienti");
    form.NomeIngrediente.value =  vecchionomeingrediente = tabella.getElementsByTagName("TR")[indice+1].childNodes[0].textContent;
    form.Nomefornitore.value = vecchiofornitore = tabella.getElementsByTagName("TR")[indice+1].childNodes[1].textContent;
    form.Prezzo.value = vecchioprezzo = tabella.getElementsByTagName("TR")[indice+1].childNodes[2].textContent;
}

function EseguiModificaIngredienite() {
    "use strict";
    var form = document.getElementById("MODINGR");
    var nuovonome = form.NomeIngrediente.value;
    var nuovofornitore = form.Nomefornitore.value;
    var nuovoprezzo = form.Prezzo.value;
    if (nuovonome === "") {
        MessaggiaErrore("nome non inserito");
        return false;
    }
    if (nuovofornitore === "") {
        MessaggiaErrore("fornitore non inserito");
        return false;
    }
    if (nuovoprezzo === "") {
        MessaggiaErrore("prezzo non inserito");
        return false;
    }
    if (nuovoprezzo === vecchioprezzo && nuovonome === vecchionomeingrediente && vecchiofornitore === nuovofornitore) {
        MessaggiaErrore("NEssuna modifica effettuata");
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
                    return false;
                }
                if(result.Alert){
                    alert(result.Alert);
                }else{
                    scrivirisultato(result.Status);
                    Successo();
                }
                NascondiScheda('BoxSchedaPiccolo');
                VediIngredienti(document.getElementsByClassName("accordion")[4]);
                VediIngredienti(document.getElementsByClassName("accordion")[4]);

            }
        };
        xmlhttp.open("GET", "php/modificaingrediente.php?nome="+nuovonome+"&prezzo="+nuovoprezzo+"&vecchioprezzo="+vecchioprezzo
            +"&nuovofornitore="+nuovofornitore+"&vecchionome="+vecchionomeingrediente, true);
        xmlhttp.send();
    }
}

function EliminaIngrediente() {
    "use strict";
    if(confirm("Sei sicuro di voler eliminare "+vecchionomeingrediente+" dal database?")){
        var xmlhttp;
        if (xmlhttp = CreaRichiesta()) {
            xmlhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    if (result.Error) {
                        scrivirisultato(result.Error);
                        Fallimento();
                        return false;
                    }else{
                        scrivirisultato(result.Status);
                        Successo();
                    }
                    NascondiScheda('BoxSchedaPiccolo');
                    VediIngredienti(document.getElementsByClassName("accordion")[4]);
                    VediIngredienti(document.getElementsByClassName("accordion")[4]);
                }
            };
            xmlhttp.open("GET", "php/eliminaingrediente.php?nome=" + vecchionomeingrediente, true);
            xmlhttp.send();
        }
    }
}
