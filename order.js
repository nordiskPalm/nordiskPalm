/*
Function changeContent() skapad av Goran Milutinovic.
Jag har lagt till updatePrice() i den här funktionen eftersom det går bra att kombinera.
Jag har en bortkomenterad updatePrice() längst ner i js-filen.
*/
var total = 0;
function changeContent(boxElement, divToChange, innerDiv) {
    var i = boxElement.value.indexOf("|");
    var cleaned =boxElement.value.substring(0,i);
    var price = parseInt(boxElement.value.substring(i+1,boxElement.value.length))
    s = document.getElementById(divToChange).innerHTML;
    if(boxElement.checked) {
        s += "<div class="+innerDiv+">"+cleaned+"</div>";
        document.getElementById(divToChange).innerHTML = s;
        total += price;
    } else {
        toReplace = "<div class=\""+innerDiv+"\">"+cleaned+"</div>";
        s = s.replace(toReplace, "");
        document.getElementById(divToChange).innerHTML = s;
        if(total != 0){
            total -= price;
        } 
    }
    document.getElementById("demo").innerHTML = `Pris: ${total} SEK`;
}
function showAlert(element) {
    alert("Slutsåld, kan inte väljas.");
    return element.checked = false;
}
function test_sub() {
    namnFrm = document.frm.namn.value;
    lastName = document.frm.lastname.value;
    adressFrm = document.frm.adress.value;
    mailFrm = document.frm.mail.value;
    checkNamn = /^[A-ZÅÄÖ][a-zåäö]*-?[A-ZÅÄÖ]*[a-zåäö]+$/;
    checkAdress = /^[A-ZÅÄÖ][a-zåäö]+\s?[A-ZÅÄÖ]*[a-zåäö]*\s?\d{2,4}$/;
    checkMail = /^\w+-?\w*[@]{1}[A-ZÅÄÖa-zåäö]+[.]{1}[A-ZÅÄÖa-zåäö]+$/;
    if(checkNamn.test(namnFrm)) {
       if(checkNamn.test(lastName)) {
            if(checkAdress.test(adressFrm)) {
                if(checkMail.test(mailFrm)) {
                    if(total != 0){
                        return true;
                    } else {
                        alert("Du måste välja minst ett album");
                        return false;
                    }
                } else {
                    alert("Inte en giltlig mail");
                    return false;
                }
            } else {
                alert("Inte en giltlig adress");
                return false;
            }
        } else {
            alert("Inte giltligt efternamn");
            return false;
        }
    } else {
        alert("Inte giltligt förnamn");
        return false;
    }
}
