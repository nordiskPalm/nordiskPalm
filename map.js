
var map;
var polyLine;
var POIX;
var POIY;
var POIXdistance;
var POIYdistance;
var POIPoint;
var checkPOI = 1;
var checkPermaPOI = 1;
var checkDistance = 1;
var positionsEtapp = [];
var positionsKanot = [];
var polyLineGraphicKanot = [];
var polylineGraphicEtapp = [];
var positionsElevation = [];
var polylineGraphicElevation = [];
var POIGraphic = [];
var toggle;
var pointers = [];
var ownPOIGraphic = [];
var POIdistance;
var distanceLayer = [];
var distanceCounter = 0;

require(["esri/map", "esri/layers/GraphicsLayer", "esri/symbols/SimpleLineSymbol", "esri/InfoTemplate", "esri/symbols/SimpleMarkerSymbol", "esri/geometry/Point", "esri/geometry/Polyline", "esri/symbols/PictureMarkerSymbol", "esri/graphic", "esri/Color", "esri/geometry/Circle", "esri/dijit/BasemapToggle","esri/geometry/Circle", "dojo/domReady!"],
function(Map, GraphicLayer, SimpleLineSymbol, InfoTemp, SimpleMarkerSymbol, Point, PolyLine, PictureMarkerSymbol, Graphic, Color, Circle, BasemapToggle, Circle) {
    map = new Map('mapDiv', {
    basemap: "satellite",
    center: [17.129189, 60.198245],
    zoom: 9,
    });
    toggle = new BasemapToggle({map: map,basemap: "topo-vector" }, "BasemapToggle");
    toggle.startup();
    var graphics = new GraphicLayer();
    map.addLayer(graphics);
    getLedData();
    getPOIData();
    map.on("click", function (evt) {
        var mapPoint = esri.geometry.webMercatorToGeographic(evt.mapPoint);
        openFormDistance(mapPoint.x, mapPoint.y);
        openForm(mapPoint.x, mapPoint.y);
        openPermaForm(mapPoint.x, mapPoint.y);
      });
    
});
function getLedData() {
    var ledData = {url:"allaEtapper.json", handleAs:"json", content:{}, sync:"false", load:setLedPositionEtapp};
    dojo.xhrGet(ledData);
    var ledData2 = {url:"WalkingAndBiking.jsonc", handleAs:"json", content:{}, sync:"false", load:setLedPositionElevation};
    dojo.xhrGet(ledData2);
    var kledData = {url:"Kanotleder.json", handleAs:"json", content:{}, sync:"false", load:setLedPositionKanot};
    dojo.xhrGet(kledData);
};
function setLedPositionKanot(data) {
    positionsKanot = new Array(3);
    for(let i = 0; i < positionsKanot.length; i++){
        positionsKanot[i] = [];
    }
    dojo.forEach(data.posts, function(datan) {
        index = datan.kled - 1;
        lng = datan.longitude;
        lat = datan.latitude;
        positionsKanot[index].push([lng, lat]);
    });
    visaKanot();
}
function visaKanot(){
    var kanotLayer = new esri.layers.GraphicsLayer();
    map.addLayer(kanotLayer);
    var simpleLineString = new esri.symbol.SimpleLineSymbol().setColor(new esri.Color([255,0,0]));
    simpleLineString.setWidth(2);
    var polyLiners;
    for(i = 0; i < positionsKanot.length; i++){
        polyLiners = new esri.geometry.Polyline(positionsKanot[i]);
        polyLineGraphicKanot[i] = new esri.Graphic(polyLiners, simpleLineString);
        kanotLayer.add(polyLineGraphicKanot[i]);
    }
}
function setLedPositionEtapp(data) {
    positionsEtapp = new Array(15);
    for (let i = 0; i < positionsEtapp.length; i++) {
        positionsEtapp[i] = [];
    }
    dojo.forEach(data.posts, function(datan) {
        index = datan.etapp - 1;
        lng = datan.longitude;
        lat = datan.latitude;
        positionsEtapp[index].push([lng, lat]);
    });
    visaLed();
}
function visaLed() {
    var ledLayer = new esri.layers.GraphicsLayer();
    map.addLayer(ledLayer);
    var simpleLineSlinga = new esri.symbol.SimpleLineSymbol().setColor(new esri.Color([26,140,232,]));
    simpleLineSlinga.setWidth(2);
    var simpleLineEtapp = new esri.symbol.SimpleLineSymbol().setColor(new esri.Color([26,140,232]));
    simpleLineEtapp.setStyle("dash").setWidth(2);
    var polyLine;
    for(i = 0; i < positionsEtapp.length; i++){
        polyLine = new esri.geometry.Polyline(positionsEtapp[i]);
        if(i<11){
            polylineGraphicEtapp[i] = new esri.Graphic(polyLine, simpleLineSlinga);
        } else {
            polylineGraphicEtapp[i] = new esri.Graphic(polyLine, simpleLineEtapp);
        }
        ledLayer.add(polylineGraphicEtapp[i]);
    }
}
function setLedPositionElevation(data){
    positionsElevation = new Array(3);
    for(let i = 0; i < positionsElevation.length; i++){
        positionsElevation[i] = [];
    }
    dojo.forEach(data.posts, function(datan){
        index = datan.etapp - 1;
        lng = datan.longitude;
        lat = datan.latitude;
        elv = datan.elevation;
        positionsElevation[index].push([lng, lat]);
    });
    visaLedElevation();
}
function visaLedElevation() {
    var ledLayerElevation = new esri.layers.GraphicsLayer();
    map.addLayer(ledLayerElevation);
    var simpleLineElevation = new esri.symbol.SimpleLineSymbol().setColor(new esri.Color([200,140,232 ]));
    simpleLineElevation.setWidth(2);
    var polyLine;
    for(i = 0; i < positionsElevation.length; i++) {
        polyLine = new esri.geometry.Polyline(positionsElevation[i]);
        polylineGraphicElevation[i] = new esri.Graphic(polyLine, simpleLineElevation);
        ledLayerElevation.add(polylineGraphicElevation[i]);
    }
}
function poiDistance(POIPoint, nummer) {
    var punkt = POIPoint;
    var radie = nummer;
    var grafiklager = new esri.layers.GraphicsLayer();
    map.addLayer(grafiklager);
    var simpleGrej = new esri.symbol.SimpleLineSymbol().setColor(new esri.Color([200, 140, 232, 0]));
    var cirkel = new esri.geometry.Circle(punkt, { "radius": radie });
    var cirkelLager = new esri.Graphic(cirkel, simpleGrej);
    grafiklager.add(cirkelLager);
    for (i = 0; i < pointers.length; i++) {
        if (cirkel.contains(pointers[i])){
            ownPOIGraphic[i].show();
        } else {
            ownPOIGraphic[i].hide();
        }
    }
}
function getPOIData() {
    POIData = { url: "POI_JSON.json", handleAs: "json", content: {}, sync: "false", load: showPOI };
    dojo.xhrGet(POIData);
    ownPOI = {url:"pahittadePOI.json", handleAs:"json", content:{}, sync:"false", load:showOwnPOI};
    dojo.xhrGet(ownPOI);
}
function showPOI(data) {
    var POILayer = new esri.layers.GraphicsLayer();
    map.addLayer(POILayer);
    var i = 0;
    dojo.forEach(data.post, function(datan){
        var info = new esri.InfoTemplate();
        var lng = datan.longitude;
        var lat = datan.latitude;
        var symbol = new esri.symbol.PictureMarkerSymbol("Bilder/" + datan.typ + ".png", 15, 15);
        var name = datan.namn;
        var point = new esri.geometry.Point(lng, lat);
        POIGraphic[i] = new esri.Graphic(point, symbol);
        info.setTitle(name);
        info.setContent("<b>" + datan.typ + "</b></br><img src='POI_xtra/" + name +".png' style: width='100%' >");
        POIGraphic[i].setInfoTemplate(info);
        POILayer.add(POIGraphic[i]);
        i++;
    });
}
function showOwnPOI(data) {
    var POILayer = new esri.layers.GraphicsLayer();
    map.addLayer(POILayer);
    var i = 0;
    dojo.forEach(data.post, function (datan) {
        var info = new esri.InfoTemplate();
        var lng = datan.longitude;
        var lat = datan.latitude;
        var symbol = new esri.symbol.PictureMarkerSymbol("Bilder/" + datan.typ + ".png", 15, 15);
        var name = datan.namn;
        var point = new esri.geometry.Point(lng, lat);
        pointers[i] = new esri.geometry.Point(lng, lat);
        ownPOIGraphic[i] = new esri.Graphic(point, symbol);
        info.setTitle(name);
        info.setContent("<b>" + datan.typ + "</b></br><img src='POI_xtra_pohitt/" + name + ".png' style: width='100%' >");
        ownPOIGraphic[i].setInfoTemplate(info);
        POILayer.add(ownPOIGraphic[i]);
        i++;
    });
}
function filterFuncKanot(box) {
    var kanotNr = parseInt(box.value);
    if(box.checked) {
        polyLineGraphicKanot[kanotNr].show();
    } else {
        polyLineGraphicKanot[kanotNr].hide();
    }
}
function filterFuncLed(box) {
    var etappNr = parseInt(box.value);
    if(box.checked) {
        polylineGraphicEtapp[etappNr].show();
    } else {
        polylineGraphicEtapp[etappNr].hide();
    }
}
function filterFuncElevation(box){
    var etappNr = parseInt(box.value);
    if(box.checked) {
        polylineGraphicElevation[etappNr].show();
    } else {
        polylineGraphicElevation[etappNr].hide();
    }
}
function filterPOI(box){
    switch(box.value){
        case 'Rastplats': 
            if (box.checked) {
                for ( i = 0; i < 11; i++) {
                    POIGraphic[i].show();
                }
                for ( j = 11; j < 13; j++) {
                    ownPOIGraphic[j].show();
                }
            }else{
                for ( i = 0; i < 11; i++) {
                    POIGraphic[i].hide();
                }
                for ( j = 11; j < 13; j++) {
                    ownPOIGraphic[j].hide();
                }
            }
            break;
        case 'Matplats':
            if(box.checked){
                for ( i = 11; i < 12; i++) {
                    POIGraphic[i].show();
                }
                for ( j = 8; j < 11; j++) {
                    ownPOIGraphic[j].show();
                }
            }else{
                for ( i = 11; i < 12; i++) {
                    POIGraphic[i].hide();
                }
                for ( j = 8; j < 11; j++) {
                    ownPOIGraphic[j].hide();
                }
            }
            break;
        case 'Strand':
            if(box.checked){
                for ( i = 12; i < 26; i++) {
                    POIGraphic[i].show();
                }
            }else{
                for ( i = 12; i < 26; i++) {
                    POIGraphic[i].hide();
                }
            }
            break;
        case 'Brygga':
            if(box.checked){
                for ( i = 26; i < 27; i++) {
                    POIGraphic[i].show();
                }
                for ( j = 13; j < 14; j++) {
                    ownPOIGraphic[j].show();
                }
            }else{
                for ( i = 26; i < 27; i++) {
                    POIGraphic[i].hide();
                }
                for ( j = 13; j < 14; j++) {
                    ownPOIGraphic[j].hide();
                }
            }
            break;
        case 'Stenstrand':
            if(box.checked){
                for ( i = 27; i < 29; i++){
                    POIGraphic[i].show();
                }
            }else{
                for (i = 27; i < 29; i++){
                    POIGraphic[i].hide();
                }
            }
            break;
        case 'Sevärdhet':
            if(box.checked){
                for ( i = 0; i < 4; i++){
                    ownPOIGraphic[i].show();
                }
            }else{
                for ( i = 0; i < 4; i++){
                    ownPOIGraphic[i].hide();
                }
            }
            break;
        case 'Info':
            if(box.checked){
                for ( i = 4; i < 8; i++){
                    ownPOIGraphic[i].show();
                }
            }else{
                for ( i = 4; i < 8; i++){
                    ownPOIGraphic[i].hide();
                }
            }
            break;
    }
}
function activatePOI(){
    var test = document.getElementById("POIPin");
    if(checkPOI % 2 == 0){
        test.style.opacity = "0.3";
        checkPOI ++;
    } else {
        test.style.opacity = "1";
        checkPOI --;
    }
}
function activatePermaPOI() {
    var test = document.getElementById("PermaPOIPin");
    if(checkPermaPOI % 2 == 0){
        test.style.opacity = "0.3";
        checkPermaPOI ++;
    } else {
        test.style.opacity = "1";
        checkPermaPOI --;
    }
}
function activatePOIdistance(){
    var test = document.getElementById("DistancePin");
    if(checkDistance % 2 == 0){
        test.style.opacity = "0.3";
        checkDistance ++;
    } else {
        test.style.opacity = "1";
        checkDistance --;
    }
}
function openForm(x, y) {
    if(checkPOI % 2 == 0 && checkPermaPOI % 2 == 0 || checkPOI % 2 == 0 && checkDistance % 2 == 0){
        alert("Endast en funktion kan vara aktiverad åt gången");
        exit;
    }
    if(checkPOI % 2 == 0) {
        POIX = x;
        POIY = y;
        document.getElementById("popupForm").style.display = "block";
    } 
}
function openPermaForm(x, y) {
    if(checkPermaPOI % 2 == 0 && checkPOI % 2 == 0 || checkPermaPOI % 2 == 0 && checkDistance % 2 == 0){
        alert("Endast en funktion kan vara aktiverad åt gången");
        exit;
    }
    if(checkPermaPOI % 2 == 0) { 
        var myElementX = document.getElementById("permaLongitude");
        myElementX.value = x;
        var myElementY = document.getElementById("permaLatitude");
        myElementY.value = y;
        document.getElementById("permaPopupForm").style.display = "block";
    }
}
function openFormDistance(x, y) {
    if(checkDistance % 2 == 0 && checkPOI % 2 == 0 || checkDistance % 2 == 0 && checkPermaPOI % 2 == 0){
        alert("Endast en funktion kan vara aktiverad åt gången");
        exit;
    }
    if(checkDistance % 2 == 0) {
        POIXdistance = x;
        POIYdistance = y;
        document.getElementById("popupFormDistance").style.display = "block";
    }
}
function placePOI() { 
    const form = document.forms.formName;
    const checked = form.querySelector('input[name=typPOI]:checked');
    let namn = document.formName.infoName.value;
    let extra = document.formName.infoExtra.value;
    if(namn.length == 0) {
        alert("Du måste ange ett namn på platsen");
        exit;
    }
    let x = POIX;
    let y = POIY;
    var egenPOILayer = new esri.layers.GraphicsLayer();
    map.addLayer(egenPOILayer);
    var info = new esri.InfoTemplate();
    var symbol = new esri.symbol.PictureMarkerSymbol("Bilder/" + checked.value + ".png", 15, 15);
    var point = new esri.geometry.Point(x, y);
    var graphic = new esri.Graphic(point, symbol);
    info.setTitle(namn);
    info.setContent("<b>" + checked.value + "</b>" + "</p>" + extra );
    graphic.setInfoTemplate(info);
    egenPOILayer.add(graphic);
    document.getElementById("popupForm").style.display = "none";
}
function placePOIdistance() { 
    let nummer = document.MeterForm.Meter.value;
    if(nummer.length == 0) {
        alert("Du måste ange minst 1 meter");
        exit;
    }
    if (distanceCounter > 0) {
        distanceLayer[distanceCounter-1].hide();
    }
    let x = POIXdistance;
    let y = POIYdistance;
    POIPoint = new esri.geometry.Point(x, y);
    var symbol = new esri.symbol.PictureMarkerSymbol("Bilder/pin.png", 10,20);
    distanceLayer[distanceCounter] = new esri.layers.GraphicsLayer();
    map.addLayer(distanceLayer[distanceCounter]);
    var graphic = new esri.Graphic(POIPoint, symbol);
    distanceLayer[distanceCounter].add(graphic);
    poiDistance(POIPoint, nummer);
    document.getElementById("popupFormDistance").style.display = "none";
    distanceCounter++;
}
function closeForm() {
    document.getElementById("popupForm").style.display = "none";
}
function closePermaForm() {
    document.getElementById("permaPopupForm").style.display = "none";
}
function closeFormDistance() {
    document.getElementById("popupFormDistance").style.display = "none";
}
function rotate_arrow(element) {
    if (element.checked == true) {
    document.getElementById("arrow"+element.value).style.transform = "rotate(45deg)";
    }
    else {
    document.getElementById("arrow"+element.value).style.transform = "rotate(135deg)";
    }
}