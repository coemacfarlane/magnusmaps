import * as data from './archives.js'
let d = data.a;

// ------------- CREATE GOOGLE MAP ------------- 
var map;
var infowindow;
var styleArray = [
    {
        elementType: "geometry",
        stylers: [{ color: "#1F3C4D" }],
      },
      {
        elementType: "labels.icon",
        stylers: [{ visibility: "off" }],
      },
      {
        elementType: "labels.text.fill",
        stylers: [{ color: "#f5f5f5" }],
      },
      {
        elementType: "labels.text.stroke",
        stylers: [{ color: "#1C3A3D" }],
      },
      {
        featureType: "administrative.land_parcel",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f5f5f5" }],
      },
      {
        featureType: "poi",
        elementType: "geometry",
        stylers: [{ color: "#25485C" }],
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9e9e9e" }],
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#25485C" }],
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#DEDEDE" }],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#255C52" }],
      },
      {
        featureType: "road.arterial",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9e9e9e" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#2F7568" }],
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9e9e9e" }],
      },
      {
        featureType: "road.local",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9e9e9e" }],
      },
      {
        featureType: "transit.line",
        elementType: "geometry",
        stylers: [{ color: "#e5e5e5" }],
      },
      {
        featureType: "transit.station",
        elementType: "geometry",
        stylers: [{ color: "#eeeeee" }],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#205D9E" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#ffffff" }],
      },  
]


function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 51.483898 , lng: -0.162590 },
        zoom: 5,
    });
    map.setOptions({ styles: styleArray});

    infowindow = new google.maps.InfoWindow();
    infowindow.setOptions({maxWidth:250}); 
}

function addMarkers() {
    d.forEach(e => {
        const latlng = new google.maps.LatLng(e.location.position[0], e.location.position[1])
        const image = {
            url: "imgs/icon.png",
            size: new google.maps.Size(25, 36)
        }
        const marker = new google.maps.Marker({
            position: latlng,
            map: map,
            icon: image
        });
        marker.addListener("click", () => {
            map.setZoom(10);
            map.setCenter(marker.getPosition());

            infowindow.close()
            infowindow.setContent(createContent(e));
            infowindow.open(map, marker);
            google.maps.event.addListener(infowindow, 'domready', function() {
                $('.modal-btn').on('click', function (e) {
                    renderModal(e);
                 });
            });
        });        
    })
}


function createContent(e) {
    let windowHtml = "<div class='infowindow-img' style='background-image: url(\"imgs/";
    if (e.entities[0] == "N/A") {
        windowHtml += "Books.jpg\")'></div>";
    }
    else {
        windowHtml += e.entities[0].slice(4) + ".jpg\")'></div>";
    }
    windowHtml += "<h5><strong>" + e.title + "</strong></h5><p>" + e.location.name + "</p>";
    windowHtml += '<button type="button" class="btn btn-primary w-100 modal-btn my-2" data-toggle="modal" data-target="#modal" id="' + e.case + '">More Information</button>'
    return windowHtml;
}

// -------------  CREATE LIST VIEW ------------- 
function initList() {
    var list = "";
    d.forEach(e => {
        list += createListCard(e);
    });
    document.getElementById("list").innerHTML = list;
}

function createListCard(e) {
    let cardHtml = "<div class='card row my-4'>";
    cardHtml += "<div class='col-md-4 px-0 d-flex flex-row justify-content-center'><div class='infowindow-img' style='background-image: url(\"imgs/";
    if (e.entities[0] == "N/A") {
        cardHtml += "Books.jpg\")'></div></div>";
    }
    else {
        cardHtml += e.entities[0].slice(4) + ".jpg\")'></div></div>";
    }
    cardHtml += "<div class='col-md-8 py-2'><div class='mb-3'><h1>" + e.title + "</h1><h4>" + e.case + "</h4></div>";
    cardHtml += "<div><p>Location: " + e.location.name + 
        "</p><p>Statement given by: " + e.author + "</p>" +
        "<p>Entities: ";
    for (var i = 0; i < e.entities.length; i++) {
        cardHtml += e.entities[i];
        if (i+1 !== e.entities.length) {
            cardHtml += ", "
        }
    }
    cardHtml += '</p><button type="button" class="btn btn-primary float-right modal-btn" data-toggle="modal" data-target="#modal" id="' + e.case + '">More Information</button>'
    cardHtml += "</div></div></div>";
    return cardHtml;
}

// MODAL
function renderModal(e) {
    console.log(e)
    e.preventDefault();
    let obj = d.find(c => c.case === e.target.id);

    let imgHtml = "<div style='background-image: url(\"imgs/";
    if (obj.entities[0] == "N/A") {
        imgHtml += "Books.jpg\")'></div>";
    }
    else {
        imgHtml += obj.entities[0].slice(4) + ".jpg\")'></div>";
    }
    document.getElementById('modal-img').innerHTML = imgHtml;
    document.getElementById('modal-title').innerText = obj.title;
    document.getElementById('case-num').innerText = obj.case;
    document.getElementById('author').innerHTML = "Statement given by: " + obj.author;
    document.getElementById('audio').innerHTML = "Recorded by: " + obj.audio;
    document.getElementById('date').innerHTML = "Statement given: " + obj['statement date'];
    document.getElementById('event').innerHTML = "Date of event: " + obj['event date'];
    document.getElementById('location').innerHTML = "Took place: " + obj.location.name;
    let entityList = "Entities: ";
    for (var i = 0; i < obj.entities.length; i++) {
        entityList += obj.entities[i];
        if (i+1 !== obj.entities.length) {
            entityList += ", "
        }
    }
    document.getElementById('entities').innerHTML = entityList;
    document.getElementById('statement').innerHTML = "<h5 class='pt-3'>Excerpt of statement summary:</h5><p>" + obj.statement + "</p>";
    document.getElementById('modal-footer').innerHTML = "<a target='_blank' href='" + obj.link + "'>Read more</a>";
}
  

$(document).ready( function() {
    if (document.getElementById('map')) {
        try {
            initMap();
        }
        finally {
            addMarkers();
        }
    }

    if (document.getElementById('list')) {
        initList();
    }

    console.log(document.getElementsByClassName(".modal-btn")[0])

    $('.modal-btn').on('click', function (e) {
       renderModal(e);
    });
})
