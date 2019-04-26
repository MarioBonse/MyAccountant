var statoricettario = 0;

/*var numeropagine*/
var numeropagine;
var paginaattuale = 0;


function ricettario(val){
    "use strict";
    if(statoricettario == 0){
        VediRicette(val);
        statoricettario = 1;
    }else{
        var table = document.getElementsByClassName("classic")[0];
        var navigazione = document.getElementsByClassName("paginazione")[0];
        EliminaTabellaViasualizzazione(table, navigazione);
        statoricettario = 0;
        espandi(val); //infine devo espandere il blocco
    }

}


//funzione per visualizzare la tabella delle ricette
function VediRicette(pagina) {
    "use strict";
    var val = document.getElementsByClassName("accordion")[3];
    var xmlhttp;
    if (xmlhttp = CreaRichiesta()) {
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                componitabellaricettario(this.responseText);
                if(numeropagine > 1) {
                    creapaginazione(document.getElementsByClassName("paginazione")[0], numeropagine, cambiapaginaricetta);
                    attiva(0,1);
                }
                espandi(val);
            }
        };
        xmlhttp.open("GET", "php/caricaricettario.php?pagina="+pagina, true);
        xmlhttp.send();
    }
}

function cambiapaginaricetta(pagina){
    "use strict";
    var vecchiapagina = paginaattuale;
    paginaattuale = aggiornapaginaattuale(paginaattuale, pagina, numeropagine);
    if(paginaattuale === vecchiapagina){
        return;
    }
    var xmlhttp;
    if (xmlhttp = CreaRichiesta()) {
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                componitabellaricettario(this.responseText);
                attiva(0,paginaattuale+1, vecchiapagina+1);
            }
        };
        xmlhttp.open("GET", "php/caricaricettario.php?pagina="+paginaattuale, true);
        xmlhttp.send();
    }
}

function componitabellaricettario(risposta) {
    var result = JSON.parse(risposta);
    if(result.Error){
        scrivirisultato(result.Error);
        Fallimento();
        return;
    }
    var nomi = JSON.parse(result.nome);
    var prezzi = JSON.parse(result.prezzo);
    var id = JSON.parse(result.id);
    numeropagine = result.numeropagine;
    var descrizioni = JSON.parse(result.descrizione);
    var table = document.getElementsByClassName("classic")[0];
    eliminaDOMfiglio(table);
    CreaTitolo(table, "nome", "descrizione", "prezzo");
    CreaTabellaConBottone(table, mostrascheda , nomi, descrizioni , prezzi);

}
