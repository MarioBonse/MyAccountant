

function CaricaProduzione(){
    "use strict";
    var form = document.getElementById("PROD");
    var response, anno, mese, giorno;
    var  data = new Date(form.Giornovisualizzazione.value);
    if(!data){
        return false;
    }
    giorno = data.getDate();
    mese = data.getMonth()+1;
    anno = data.getFullYear();
    var xmlhttp;
    try {
        xmlhttp = new XMLHttpRequest();
    } catch (e1) {
        try {
            xmlhttp = new window.ActiveXObject("Msxml2.XMLHTTP");
        } catch (e2) {
            try {
                xmlhttp = new window.ActiveXObject("Microsoft.XMLHTTP");
            } catch (e3) {
                scrivirisultato("Attenzione, browser non supporta ajax");
                Fallimento();
                return false;
            }
        }
    }
    xmlhttp.onreadystatechange = function() {
        "use strict";
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("VediIngredienti").innerHTML = this.responseText;
            var panel = document.getElementById("panel2");
            panel.style.maxHeight = panel.scrollHeight + "px";
        }
    };
    xmlhttp.open("POST", "php/visualizzaproduzione.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("anno=" +anno+"&mese="+mese+"&giorno="+giorno);
}
