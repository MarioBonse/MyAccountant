var statoattualeSLT = 0;
var pagineSLT;
var paginaattualeSLT;
var SLTvalutata = [];

function inserisciNuovaSpesaLungoTermine(){
    "use strict";
    var form = document.getElementById("SPESALT");
    var nome = form.Nome.value;
    var prezzo = form.Prezzo.value;
    var datainziale = form.datainizio.value;
    if (!contenitoreoggettidata["SPESALT"].giornoselezionatofine){
        MessaggiaErrore("Data finale non inserita");
        return false;
    }
    var datafinale = form.datafine.value;
    if(nome === ""){
        MessaggiaErrore("Nome non inserito");
        return false;
    }
    if(prezzo === ""){
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
                form.reset();
                form.datafine.className = "DataFineLungoTermine";
                contenitoreoggettidata["SPESALT"] = [];
                preparaformdata("SPESALT", true);
                AggiornaInputFormData("SPESALT");
            }
        };
        xmlhttp.open("GET", "php/InserisciSLT.php?nome=" + nome+ "&prezzo=" + prezzo+"&data1="+datainziale+"&data2="+datafinale, true);
        xmlhttp.send();
    }
}

function MostraSLT(val){
    "use strict";
    if(statoattualeSLT == 0){
        VediTabellaSLT(val);
        statoattualeSLT = 1;
    }else{
        var table = document.getElementsByClassName("classic")[1];
        var navigazione = document.getElementsByClassName("paginazione")[1];
        EliminaTabellaViasualizzazione(table, navigazione);
        statoattualeSLT = 0;
        espandi(val);
    }
}

function VediTabellaSLT(val){
    "use strict";
    var xmlhttp;
    if (xmlhttp = CreaRichiesta()) {
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var result = JSON.parse(this.responseText);
                disegnaslt(result);
                paginaattualeSLT = 0;
                if(pagineSLT > 1) {
                    creapaginazione(document.getElementsByClassName("paginazione")[1], pagineSLT, cambiapaginaSLT);
                    attiva(1, 1);
                }
                espandi(val);
            }
        };
        xmlhttp.open("GET", "php/VediSLT.php?pagina="+0, true);
        xmlhttp.send();
    }
}

function cambiapaginaSLT(pagina){
    "use strict";
    var vecchiapagina = paginaattualeSLT;
    paginaattualeSLT = aggiornapaginaattuale(paginaattualeSLT,pagina, pagineSLT);
    if(paginaattualeSLT === vecchiapagina){
        return;
    }
    var xmlhttp;
    if (xmlhttp = CreaRichiesta()) {
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var result = JSON.parse(this.responseText);
                disegnaslt(result);
                attiva(1,paginaattualeSLT+1, vecchiapagina+1);
            }
        };
        xmlhttp.open("GET", "php/VediSLT.php?pagina="+paginaattualeSLT, true);
        xmlhttp.send();
    }

}


function disegnaslt(result){
    "use strict";
    if (result.Error) {
        scrivirisultato(result.Error);
        Fallimento();
        return;
    }
    var nomi = JSON.parse(result.nome);
    var prezzi = JSON.parse(result.prezzo);
    var datainzio = JSON.parse(result.datainizio);
    var datafine = JSON.parse(result.datafine);
    pagineSLT = result.numeropagine;
    var table = document.getElementsByClassName("classic")[1];
    eliminaDOMfiglio(table);
    CreaTitolo(table, "nome", "prezzo", "datainizio", "datafine", "");
    CreaTabellaConBottone(table, ModificaSLT , nomi, prezzi , datainzio, datafine);
}

function  ModificaSLT(indice) {
    "use strict";
    var table = document.getElementById("TabellaVisualizzazioneSLT");
    var riga = table.getElementsByTagName("TR")[indice+1];
    RendiVisibileScheda("BoxSchedaSLT");
    var form = document.getElementById("MODIFICASLT");
    form.Prezzo.value = SLTvalutata.PrezzoOriginale = riga.childNodes[1].textContent;
    form.Nome.value = SLTvalutata.NomeOriginale = riga.childNodes[0].textContent;
    SLTvalutata.DataInizioOriginale = riga.childNodes[2].textContent;
    SLTvalutata.DataFineOriginale = riga.childNodes[3].textContent;
    var datainizio = new Date(SLTvalutata.DataInizioOriginale);
    var datafine = new Date(SLTvalutata.DataFineOriginale);
    contenitoreoggettidata["MODIFICASLT"] = {
        anno:datainizio.getFullYear(),
        mese:datainizio.getMonth(),
        giornoselezionatoinizio:datainizio.getDate(),
        meseselezionatoinizio:datainizio.getMonth(),
        annoselezionatoinizio:datainizio.getFullYear(),
        annoselezionatofine: datafine.getFullYear(),
        meseselezionatofine: datafine.getMonth(),
        giornoselezionatofine: datafine.getDate(),
        selezione:0};
    DisegnaTabellaFormData("MODIFICASLT");
    AggiornaInputFormData("MODIFICASLT");

}


function ChiudiSceda(){
    "use strict";
    NascondiScheda("BoxSchedaSLT");
}

function EseguiModificaSLT(){
    "use strict";
    var form = document.getElementById("MODIFICASLT");
    var nuovonome = form.Nome.value;
    var nuovoprezzo = form.Prezzo.value;
    var nuovadatainzio = form.datainizio.value;
    var nuovadatafine = form.datafine.value;
    if(nuovonome == SLTvalutata.NomeOriginale && nuovoprezzo == SLTvalutata.PrezzoOriginale &&
        nuovadatainzio == SLTvalutata.DataInizioOriginale && nuovadatafine == SLTvalutata.DataFineOriginale){
        MessaggiaErrore("nessuna modifica effettuata");
        return false;
    }
    if (nuovonome === "") {
        MessaggiaErrore("Nome non inserito");
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
                ChiudiSceda();
                MostraSLT(document.getElementsByClassName("accordion")[3]);
                MostraSLT(document.getElementsByClassName("accordion")[3]);

            }
        };
        xmlhttp.open("POST", "php/ModificaSLT.php", true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send("nuovonome="+nuovonome+"&vecchionome="+SLTvalutata.NomeOriginale+"&vecchiaDI="+SLTvalutata.DataInizioOriginale+
                "&nuovaDI="+nuovadatainzio+"&vecchiaDF="+SLTvalutata.DataFineOriginale+"&nuovaDF="+nuovadatafine+
                "&nuovoprezzo="+nuovoprezzo+"&vecchioprezzo="+SLTvalutata.PrezzoOriginale);
    }
}
