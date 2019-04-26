var statoattuale = 0;
var paginaattualeIngredinti;
var pagineingredienti;


function VediIngredienti(val){
    "use strict";
    if(statoattuale == 0){
        VediIngredientitabella(val);
        statoattuale = 1;
    }else{
        var table = document.getElementsByClassName("classic")[1];
        var navigazione = document.getElementsByClassName("paginazione")[1];
        EliminaTabellaViasualizzazione(table, navigazione);
        statoattuale = 0;
        espandi(val); //infine devo espandere il blocco
    }
}

function VediIngredientitabella(val){
    "use strict";
    var xmlhttp;
    if (xmlhttp = CreaRichiesta()) {
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                creatabellaingredienti(this.responseText);
                paginaattualeIngredinti = 0;
                if(pagineingredienti > 1) {
                    creapaginazione(document.getElementsByClassName("paginazione")[1], pagineingredienti, cambiapaginaingredienti);
                    attiva(1, 1);
                }
                espandi(val); //infine devo espandere il blocco
            }
        };
        xmlhttp.open("GET", "php/MostraIngredienti.php?pagina="+0, true);
        xmlhttp.send();
    }
}

function cambiapaginaingredienti(pagina){
    "use strict";
    var vecchiapagina = paginaattualeIngredinti;
    paginaattualeIngredinti = aggiornapaginaattuale(paginaattualeIngredinti , pagina, pagineingredienti);
    if(paginaattualeIngredinti === vecchiapagina){
        return;
    }
    var xmlhttp;
    if (xmlhttp = CreaRichiesta()) {
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                creatabellaingredienti(this.responseText);
                attiva(1,paginaattualeIngredinti+1, vecchiapagina+1);
            }
        };
        xmlhttp.open("GET", "php/MostraIngredienti.php?pagina="+paginaattualeIngredinti, true);
        xmlhttp.send();
    }
}

function creatabellaingredienti(risposta){
    "use strict";
    var result = JSON.parse(risposta);
    if (result.Error) {
        scrivirisultato(result.Error);
        Fallimento();
        return;
    }
    pagineingredienti = result.numeropagine;
    var nomi = JSON.parse(result.nome);
    var prezzi = JSON.parse(result.prezzo);
    var fornitori = JSON.parse(result.fornitore);
    var table = document.getElementsByClassName("classic")[1];
    eliminaDOMfiglio(table);
    CreaTitolo(table, "nome", "descrizione", "prezzo");
    CreaTabellaConBottone(table, modificaingrediente , nomi, fornitori , prezzi);
}
