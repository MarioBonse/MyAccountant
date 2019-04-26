var contenitoreoggettidata = [];
var mesi = ["gen", "feb", "mar", "april", "magg", "giu", "lug", "ago", "sett","ott", "nov", "dic"];

function preparatabelle(id) {
    "use strict";
    preparaformdata(id, true);
    AggiornaInputFormData(id);
}

function CambiaDataInizio(idform){
    "use strict";
    contenitoreoggettidata[idform].selezione = 0;
    var form = document.getElementById(idform);
    form.getElementsByTagName("input")[0].className = "dataselezionata";
    form.getElementsByTagName("input")[1].className = "DataFineLungoTermine";
}

function CambiaDataFine(idform){
    "use strict";
    contenitoreoggettidata[idform].selezione = 1;
    var form = document.getElementById(idform);
    form.getElementsByTagName("input")[0].className = "DataInizioLungoTermine";
    form.getElementsByTagName("input")[1].className = "dataselezionata";
}

function AggiornaInputFormData(idform){
    "use strict";
    var form = document.getElementById(idform);
    var mese = contenitoreoggettidata[idform].meseselezionatoinizio+1;
    if(mese == -3){
        form.datainizio.value = "AAAA--MM--GG";
        form.datainizio.className = "DataInizioLungoTermine";
        return;
    }
    if(mese < 10){
        mese = "0"+mese;
    }
    var giorno = contenitoreoggettidata[idform].giornoselezionatoinizio;
    if(giorno<10){
        giorno = "0"+giorno;
    }
    form.datainizio.value = contenitoreoggettidata[idform].annoselezionatoinizio+"-"+mese+
                "-"+giorno;
    if(contenitoreoggettidata[idform].giornoselezionatofine){
        var mese = contenitoreoggettidata[idform].meseselezionatofine+1;
        if(mese < 10){
            mese = "0"+mese;
        }
        var giorno = contenitoreoggettidata[idform].giornoselezionatofine;
        if(giorno<10){
            giorno = "0"+giorno;
        }
        form.datafine.value = contenitoreoggettidata[idform].annoselezionatofine+"-"+mese+
            "-"+giorno;
    }
    var form = document.getElementById(idform);
    if (contenitoreoggettidata[idform].selezione === 0) {
        form.datainizio.className = "dataselezionata";
        if(form.datafine){
            form.datafine.className = "DataFineLungoTermine";
        }
    }else{
        form.datainizio.className = "DataFineLungoTermine";
        form.datafine.className = "dataselezionata";
    }

}


function preparaformdata(idform, type){
    var data = new Date();
    if(type === false){
        contenitoreoggettidata[idform] = {
          selezione:0,
          anno:data.getFullYear(),
          mese:data.getMonth(),
          meseselezionatoinizio:-4};
      DisegnaTabellaFormData2(idform);
    }else{
      contenitoreoggettidata[idform] = {
          selezione:0,
          anno:data.getFullYear(),
          mese:data.getMonth(),
          dataselezionatainizio: data,
          giornoselezionatoinizio:data.getDate(),
          meseselezionatoinizio:data.getMonth(),
          annoselezionatoinizio:data.getFullYear()};
      DisegnaTabellaFormData(idform);
    }
}

function mesesuccessivo(idform, type){
    var mese = contenitoreoggettidata[idform].mese;
    if(mese === 11){
      ++contenitoreoggettidata[idform].anno;
      contenitoreoggettidata[idform].mese = 0;
    }else {
       ++contenitoreoggettidata[idform].mese;
    }
    if(type === false){
      DisegnaTabellaFormData2(idform);
    }else{
      DisegnaTabellaFormData(idform);
    }
}

function meseprecedente(idform,  type){
    var mese = contenitoreoggettidata[idform].mese;
    if(mese === 0){
        --contenitoreoggettidata[idform].anno;
        contenitoreoggettidata[idform].mese = 11;
    }else {
        --contenitoreoggettidata[idform].mese;
    }
    if(type === false){
      DisegnaTabellaFormData2(idform);
    }else{
      DisegnaTabellaFormData(idform);
    }
}

function numerogiornimese(mese, anno){
    "use strict";
    return new Date(anno, (mese+1), 0).getDate();
}

function giornosettimanainiziomese(mese, anno){
    "use strict";
    return new Date(anno, mese, 0).getDay();
}



function DisegnaTabellaFormData(idform){
    "use strict";
    var anno = contenitoreoggettidata[idform].anno;
    var mese = contenitoreoggettidata[idform].mese;
    var form = document.getElementById(idform);
    var primogiorno = giornosettimanainiziomese(mese, anno);
    var giornimeseprecedente = numerogiornimese( mese-1, anno);
    var giornimeseattuale = numerogiornimese(mese, anno);
    var contenitoretitolo = form.getElementsByClassName("TitoloFormData")[0];
    var testo = document.createTextNode(mesi[mese]+" , "+anno);
    if(contenitoretitolo.firstChild) {
        contenitoretitolo.removeChild(contenitoretitolo.firstChild);
    }
    contenitoretitolo.appendChild(testo);
    var j = 0;
    var celle = form.getElementsByTagName("TD");
    /*creo celle del mese precedente*/
    for( j = 0; j< primogiorno; j++){
        celle[j].textContent = (giornimeseprecedente - (primogiorno -1) + j);
        celle[j].className = "nonselezionabile";
        celle[j].onclick = function(){};
    }
    /*creo celle dell'attuale mese*/
    if(contenitoreoggettidata[idform].giornoselezionatofine){//se esiste la data finale(comodo per i calendari a una sola data)
        for(var i = 1; i<= giornimeseattuale;i++, j++){
            celle[j].textContent = i;
            var result;
            if( result = sitrovainmezzo(idform, i)) {
                if(result == 1){
                    celle[j].className = "selezionatoiniziale";
                }
                if(result == 2){
                    celle[j].className = "periodo";
                    celle[j].onclick = function () {
                        selezionaquestogiorno(this, idform);
                    }
                }
                if(result == 3){
                    celle[j].className = "selezionefinale";
                }
            }else {
                celle[j].className = "selezionabile";
                celle[j].onclick = function () {
                    selezionaquestogiorno(this, idform);
                }
            }
        }
        for(var i=1, j; j<42; j++, i++){
            celle[j].textContent = i;
            celle[j].className = "nonselezionabile";
        }
    }else {
        for (var i = 1; i <= giornimeseattuale; i++, j++) {
            celle[j].textContent = i;
            celle[j].className = "selezionabile";
            celle[j].onclick = function () {
                selezionaquestogiorno(this, idform);
            }
        }
        for (var i = 1, j; j < 42; j++, i++) {
            celle[j].textContent = i;
            celle[j].className = "nonselezionabile";
            celle[j].onclick = function(){};
        }
        if(contenitoreoggettidata[idform].meseselezionatoinizio === contenitoreoggettidata[idform].mese &&
            contenitoreoggettidata[idform].annoselezionatoinizio === contenitoreoggettidata[idform].anno){
            celle[contenitoreoggettidata[idform].giornoselezionatoinizio + primogiorno - 1].className = "selezionato";
        }
    }
}

function DisegnaTabellaFormData2(idform){
  "use strict";
  var anno = contenitoreoggettidata[idform].anno;
  var mese = contenitoreoggettidata[idform].mese;
  var form = document.getElementById(idform);
  //prima in ajax chiedo i giorni in cui vi è effettivamente una produzione
  var xmlhttp;
  if (xmlhttp = CreaRichiesta()) {
      xmlhttp.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(this.responseText);
            if(response.Error){
                scrivirisultato(response.Error);
                Fallimento();
            }else{
              disegnatabellaparziale(idform, anno, mese, response);
          }
        }
      };
      xmlhttp.open("GET", "php/cercaproduzioni.php?anno=" + anno+"&mese="+(mese+1), true);
      xmlhttp.send();
    }
}

function disegnatabellaparziale(idform, anno, mese, result){
    "use strict";
    var form = document.getElementById(idform);
    var primogiorno = giornosettimanainiziomese(mese, anno);
    var giornimeseprecedente = numerogiornimese( mese-1, anno);
    var giornimeseattuale = numerogiornimese(mese, anno);
    var contenitoretitolo = form.getElementsByClassName("TitoloFormData")[0];
    var testo = document.createTextNode(mesi[mese]+" , "+anno);
    result.sort(function(a, b) {
      return a - b;
    });
    if(contenitoretitolo.firstChild) {
        contenitoretitolo.removeChild(contenitoretitolo.firstChild);
    }
    contenitoretitolo.appendChild(testo);
    var j = 0;
    var celle = form.getElementsByTagName("TD");
    /*creo celle del mese precedente*/
    for( j = 0; j< primogiorno; j++){
        celle[j].textContent = (giornimeseprecedente - (primogiorno -1) + j);
        celle[j].className = "nonselezionabile";
        celle[j].onclick = function(){};
    }
    /*creo celle dell'attuale mese*/
        for (var i = 1; i <= giornimeseattuale; i++, j++) {
            celle[j].textContent = i;
            if(result[0]==i){
              result.shift();
              celle[j].className = "selezionabile";
              celle[j].onclick = function () {
                  selezionagiorno2(this, idform);
              }
            }else{
                celle[j].className = "nonselezionabile";
                celle[j].onclick = function(){};
              }
        }
        for (var i = 1, j; j < 42; j++, i++) {
            celle[j].textContent = i;
            celle[j].className = "nonselezionabile";
            celle[j].onclick = function(){};
        }
        if(contenitoreoggettidata[idform].meseselezionatoinizio === contenitoreoggettidata[idform].mese &&
            contenitoreoggettidata[idform].annoselezionatoinizio === contenitoreoggettidata[idform].anno){
            celle[contenitoreoggettidata[idform].giornoselezionatoinizio + primogiorno - 1].className = "selezionato";
        }
}



function sitrovainmezzo(idform, giorno){
    "use strict";
    var  datainizio = new Date(contenitoreoggettidata[idform].annoselezionatoinizio, contenitoreoggettidata[idform].meseselezionatoinizio,
        contenitoreoggettidata[idform].giornoselezionatoinizio );
    var datafine = new Date(contenitoreoggettidata[idform].annoselezionatofine, contenitoreoggettidata[idform].meseselezionatofine,
        contenitoreoggettidata[idform].giornoselezionatofine);
    var dataj = new Date(contenitoreoggettidata[idform].anno, contenitoreoggettidata[idform].mese, giorno);
    if(stessogiorno(datainizio, dataj )){
        return 1;
    }
    if(stessogiorno(datafine, dataj ))
        return 3;
    if (datainizio < dataj && dataj < datafine)
        return 2;
    else
        return 0;
}


function stessogiorno(giorno1, giorno2){
    "use strict";
    if(giorno1.getDate() == giorno2.getDate() && giorno1.getMonth() == giorno2.getMonth() &&
    giorno1.getFullYear() == giorno2.getUTCFullYear())
        return true;
    return false;
}

function selezionagiorno2(selezionato, idform){
  "use strict";
  var nuovogiorno = Number(selezionato.textContent);
  togligiornoselezionatoiniziale(idform);
  selezionato.className = "selezionato";
  contenitoreoggettidata[idform].giornoselezionatoinizio = nuovogiorno;
  contenitoreoggettidata[idform].meseselezionatoinizio = contenitoreoggettidata[idform].mese;
  contenitoreoggettidata[idform].annoselezionatoinizio = contenitoreoggettidata[idform].anno;
  DisegnaTabellaFormData2(idform);
  AggiornaInputFormData(idform);
}

function  selezionaquestogiorno(selezionato, idform) {
    "use strict";
    var nuovogiorno = Number(selezionato.textContent);
    if(contenitoreoggettidata[idform].selezione == 0) {
        if(DataInizialeValida(idform, nuovogiorno)) {
            togligiornoselezionatoiniziale(idform);
            selezionato.className = "selezionato";
            contenitoreoggettidata[idform].giornoselezionatoinizio = nuovogiorno;
            contenitoreoggettidata[idform].meseselezionatoinizio = contenitoreoggettidata[idform].mese;
            contenitoreoggettidata[idform].annoselezionatoinizio = contenitoreoggettidata[idform].anno;
        }
    }else{
        if(DataFinaleValida(idform, nuovogiorno)){
            togligiornoselezionatofinale(idform);
            selezionato.className = "selezionato";
            contenitoreoggettidata[idform].giornoselezionatofine = nuovogiorno;
            contenitoreoggettidata[idform].meseselezionatofine = contenitoreoggettidata[idform].mese;
            contenitoreoggettidata[idform].annoselezionatofine = contenitoreoggettidata[idform].anno;
        }

    }
    DisegnaTabellaFormData(idform);
    AggiornaInputFormData(idform);
}

function togligiornoselezionatoiniziale(idform){
    "use strict";
    if(contenitoreoggettidata[idform].meseselezionatoinizio === contenitoreoggettidata[idform].mese &&
        contenitoreoggettidata[idform].annoselezionatoinizio === contenitoreoggettidata[idform].anno){
        var form = document.getElementById(idform);
        var celle = form.getElementsByTagName("TD");
        var primogiornomese = giornosettimanainiziomese(contenitoreoggettidata[idform].mese, contenitoreoggettidata[idform].anno);
        celle[primogiornomese+contenitoreoggettidata[idform].giornoselezionatoinizio-1].className = "selezionabile";
    }
}

function togligiornoselezionatofinale(idform){
    "use strict";
    if(contenitoreoggettidata[idform].meseselezionatofine === contenitoreoggettidata[idform].mese &&
        contenitoreoggettidata[idform].annoselezionatofine === contenitoreoggettidata[idform].anno){
        var form = document.getElementById(idform);
        var celle = form.getElementsByTagName("TD");
        var primogiornomese = giornosettimanainiziomese(contenitoreoggettidata[idform].mese, contenitoreoggettidata[idform].anno);
        celle[primogiornomese+contenitoreoggettidata[idform].giornoselezionatofine-1].className = "selezionabile";
    }
}

/*

Funzioni che accedono all'ogegtto delle date del form e verifica che la data inserita sia valida

 */
function DataInizialeValida(idform, nuovogiorno){
    "use strict";
    if(contenitoreoggettidata[idform].giornoselezionatofine) {
        var datainizio = new Date(contenitoreoggettidata[idform].anno, contenitoreoggettidata[idform].mese, nuovogiorno );
        var datafine = new Date(contenitoreoggettidata[idform].annoselezionatofine, contenitoreoggettidata[idform].meseselezionatofine,
            contenitoreoggettidata[idform].giornoselezionatofine);
        if (datainizio < datafine) {
            return true;
        }
        else {
            return false;
        }
    }
    return true;
}

function DataFinaleValida(idform, nuovogiorno){
    "use strict";
    var datainizio = new Date(contenitoreoggettidata[idform].annoselezionatoinizio, contenitoreoggettidata[idform].meseselezionatoinizio,
                                                                    contenitoreoggettidata[idform].giornoselezionatoinizio );
    var datafine = new Date (contenitoreoggettidata[idform].anno, contenitoreoggettidata[idform].mese, nuovogiorno);
    if(datainizio<datafine) {
        return true;
    }
    else{
        return false;
    }
}
