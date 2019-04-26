var statooggetto = 0;
var paginaattualeOggetti;
var vecchionomeoggetto;
var vecchioprezzooggetto;

function VediListaOggetti(val){
    "use strict";
    if(statooggetto == 0){
        VediOggetti(val);
        statooggetto = 1;
    }else{
        var table = document.getElementsByClassName("classic")[0];
        var navigazione = document.getElementsByClassName("paginazione")[0];
        EliminaTabellaViasualizzazione(table, navigazione);
        statooggetto = 0;
        espandi(val); //infine devo espandere il blocco
    }
}

function VediOggetti(val){
    "use strict";
    var xmlhttp;
    if (xmlhttp = CreaRichiesta()) {
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var result = JSON.parse(this.responseText);
                var pagineOggetti = creatabellaoggetti(result);
                paginaattualeOggetti = 0;
                if(pagineOggetti > 1) {
                    creapaginazione(document.getElementsByClassName("paginazione")[0], pagineOggetti, cambiapaginaoggetti);
                    attiva(0, 1);
                }
                espandi(val); //infine devo espandere il blocco
            }
        };
        xmlhttp.open("GET", "php/MostraOggetti.php?pagina="+0, true);
        xmlhttp.send();
    }
}

function cambiapaginaoggetti(pagina){
    "use strict";
    var vecchiapagina = paginaattualeOggetti;
    paginaattualeOggetti = aggiornapaginaattuale(paginaattualeOggetti , pagina, paginaattualeOggetti);
    if(paginaattualeOggetti === vecchiapagina){
        return;
    }
    var xmlhttp;
    if (xmlhttp = CreaRichiesta()) {
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var result = JSON.parse(this.responseText);
                var table = document.getElementsByClassName("classic")[1];
                eliminaDOMfiglio(table);
                creatabellaoggetti(result);
                attiva(0,paginaattualeOggetti+1, vecchiapagina+1);
            }
        };
        xmlhttp.open("GET", "php/MostraOggetti.php?pagina="+paginaattualeOggetti, true);
        xmlhttp.send();
    }
}

function modificaoggetto(indice){
    "use strict";
    RendiVisibileScheda("BoxSchedaPiccolo");
    var tabella = document.getElementById("TabellaVisualizzazioneOggetti");
    var form = document.getElementById("MODOGG");
    form.NomeOggetto.value =  vecchionomeoggetto = tabella.getElementsByTagName("TR")[indice+1].childNodes[0].textContent;
    form.Prezzo.value = vecchioprezzooggetto = tabella.getElementsByTagName("TR")[indice+1].childNodes[1].textContent;

}


function creatabellaoggetti(result){
    "use strict";
    if (result.Error) {
        scrivirisultato(result.Error);
        Fallimento();
        statooggetto = 0;
        espandi(val);
        return;
    }
    var nomi = JSON.parse(result.nome);
    var prezzi = JSON.parse(result.prezzo);
    var table = document.getElementById("TabellaVisualizzazioneOggetti");
    CreaTitolo(table, "nome", "prezzo", "");
    CreaTabellaConBottone(table, modificaoggetto , nomi,  prezzi);
    return result.numeropagine;
}

function EseguiModificaOggetto(){
    "use strict";
    var form = document.getElementById("MODOGG");
    var nome = form.NomeOggetto.value;
    var prezzo = form.Prezzo.value;
    if (nome === "") {
        MessaggiaErrore("nome non inserito");
        return false;
    }
    if (prezzo === "") {
        MessaggiaErrore("prezzo non inserito");
        return false;
    }
    if (prezzo === vecchioprezzooggetto && nome === vecchionomeoggetto) {
        MessaggiaErrore("Nessuna modifica effettuata");
        return false;
    }
    var xmlhttp;
    if (xmlhttp = CreaRichiesta()) {
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                handlerpostajaxoggetto(this.responseText);
            }
        };
        xmlhttp.open("GET", "php/modificaoggetto.php?nome="+nome+"&prezzo="+prezzo+"&vecchionome="+vecchionomeoggetto+"&vecchioprezzo="+vecchioprezzooggetto, true);
        xmlhttp.send();
    }
}

function EliminaOggetto() {
    "use strict";
    if(confirm("Sei sicuro di voler eliminare "+vecchionomeoggetto+" dal database?")){
        var xmlhttp;
        if (xmlhttp = CreaRichiesta()) {
            xmlhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    handlerpostajaxoggetto(this.responseText);
                }
            };
            xmlhttp.open("GET", "php/eliminaoggetto.php?nome=" + vecchionomeoggetto, true);
            xmlhttp.send();
        }
    }
}


function handlerpostajaxoggetto(risposta) {
    "use strict";
    var result = JSON.parse(risposta);
    if (result.Error) {
        scrivirisultato(result.Error);
        Fallimento();
        return false;
    }else if(result.Alert){
        alert(result.Alert);
      }else{
        scrivirisultato(result.Status);
        Successo();
    }
    NascondiScheda('BoxSchedaPiccolo');
    VediListaOggetti(document.getElementsByClassName("accordion")[1]);
    VediListaOggetti(document.getElementsByClassName("accordion")[1]);
}
