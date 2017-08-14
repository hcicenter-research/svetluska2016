var myApp = new Framework7({   
  modalTitle: 'My App',  
  pushState: true,    
  onAjaxStart: function (xhr) {
    myApp.showIndicator();
  },
  onAjaxComplete: function (xhr) {
    myApp.hideIndicator();
  }
});

var $$ = Dom7;  

var mainView = myApp.addView('.view-main',
{
  domCache: true
});


var mapStyle = loadJSON("data/mapstyle.json");
var homepageMap;

function initMap() {        

 homepageMap = new google.maps.Map(document.getElementById('map'), {
  zoom: 17,
  center: {lat: 50.077845, lng: 14.418859},
  disableDefaultUI: true,
  styles: mapStyle
  });

  getCurrentPosition(homepageMap);
  setPolylines(homepageMap);      
  addObstacles(homepageMap);
  setCrosswalks(homepageMap);  
  setCorners(homepageMap);
  localStorage.setItem("gamePointsCollection", JSON.stringify(0)); 
}

var HomepageHandler = function(){

  var locationButton = document.getElementById("link-location");
  var buttonRestart = document.getElementById("restart-button");
  var buttonAbout = document.getElementById("about-button");
  var buttonStart = document.getElementById("button-about-start");
  var buttonGame = document.getElementById("link-game");

  if(buttonGame != null){
  buttonGame.addEventListener("click", function(){
    window.location.href = "game.html";    
  });
  }

  if(buttonStart != null){
   buttonStart.addEventListener('click', this._initIndex.bind(this), false);
 }

  if(buttonRestart != null){
   buttonRestart.addEventListener('click', this._clearLocalstorage.bind(this), false);
 }

 if(buttonAbout != null){
   buttonAbout.addEventListener('click', this._initSlider.bind(this), false);
 }

 if(locationButton != null){
  locationButton.addEventListener('click', this._handleLocation.bind(this), false);
}

}

var currentLocationMarkers = [];

HomepageHandler.prototype._initSlider = function() {
  
  window.location.href = "about.html";
}

HomepageHandler.prototype._initIndex = function() {
  
  window.location.href = "index.html";
}


HomepageHandler.prototype._clearLocalstorage = function() {
  localStorage.clear();
  window.location.href = "index.html";
}


HomepageHandler.prototype._handleLocation = function() {

  getCurrentPosition(homepageMap);  

}

var mySwiper = myApp.swiper('.swiper-container', {
    pagination:'.swiper-pagination'
  });

function getCurrentPosition(currentMap){
  var image = {
    url: 'img/location2.png',
    size: new google.maps.Size(70, 70),    
    origin: new google.maps.Point(0, 0),    
    anchor: new google.maps.Point(35, 35)
  };  

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };      

      currentLocationMarkers.forEach(function(marker) {
        marker.setMap(null);
      });
      currentLocationMarkers = [];

      currentLocationMarkers.push(new google.maps.Marker({
        position: pos,
        map: currentMap,
        icon: image
      })); 
      currentMap.setCenter(pos);
    });
  }

}

var homepageH = new HomepageHandler();

function setCrosswalks(map) {
  var image_gray = {
    url: 'img/crosspin_gray.png',
    size: new google.maps.Size(44, 68),    
    origin: new google.maps.Point(0, 0),    
    anchor: new google.maps.Point(22, 68)
  };

  var image_red = {
    url: 'img/crosspin_red.png',
    size: new google.maps.Size(44, 68),    
    origin: new google.maps.Point(0, 0),    
    anchor: new google.maps.Point(22, 68)
  };

  var image_orange = {
    url: 'img/crosspin_orange.png',
    size: new google.maps.Size(44, 68),    
    origin: new google.maps.Point(0, 0),    
    anchor: new google.maps.Point(22, 68)
  };

  var image_green = {
    url: 'img/crosspin_green.png',
    size: new google.maps.Size(44, 68),    
    origin: new google.maps.Point(0, 0),    
    anchor: new google.maps.Point(22, 68)
  };

  var shape = {
    coords: [1, 1, 1, 44, 68, 44, 68, 1],
    type: 'poly'
  };

  for (var i = 0; i < crosswalks.length; i++) {

    let crosswalk = crosswalks[i];
    
    if (crosswalk.color==="green"){
      var marker = new google.maps.Marker({
        position: crosswalk.points,
        map: map,
        icon: image_green,
        shape: shape,      
        zIndex: crosswalk.zindex        
      });
      google.maps.event.addListener(marker, 'click', function() {
        
        localStorage.setItem("currentClickedCrosswalkId", crosswalk.id);
        localStorage.setItem("currentClickedCrosswalkPosition", JSON.stringify(crosswalk.points));
        localStorage.setItem("currentClickedCrosswalk", JSON.stringify(crosswalk));
        localStorage.setItem("crosswalkStatus", "validation");

        window.location.href = "crosswalkVal_template.html";
        
      });
    }    
    else if (crosswalk.color==="red"){
      var marker = new google.maps.Marker({
        position: crosswalk.points,
        map: map,
        icon: image_red,
        shape: shape,      
        zIndex: crosswalk.zindex        
      });
      google.maps.event.addListener(marker, 'click', function() {
        
        localStorage.setItem("currentClickedCrosswalkId", crosswalk.id);
        localStorage.setItem("currentClickedCrosswalkPosition", JSON.stringify(crosswalk.points));
        localStorage.setItem("currentClickedCrosswalk", JSON.stringify(crosswalk));

        localStorage.setItem("crosswalkStatus", "validation");

        window.location.href = "crosswalkVal_template.html";
        
      });
    }
    else if (crosswalk.color==="orange"){
      var marker = new google.maps.Marker({
        position: crosswalk.points,
        map: map,
        icon: image_orange,
        shape: shape,      
        zIndex: crosswalk.zindex,        
      });

      google.maps.event.addListener(marker, 'click', function() {

        localStorage.setItem("currentClickedCrosswalkId", crosswalk.id);
        localStorage.setItem("currentClickedCrosswalkPosition", JSON.stringify(crosswalk.points));
        localStorage.setItem("currentClickedCrosswalk", JSON.stringify(crosswalk));

        localStorage.setItem("crosswalkStatus", "validation");

        window.location.href = "crosswalkVal_template.html";
        
      });
    }
    else {
      var marker = new google.maps.Marker({
        position: crosswalk.points,
        map: map,
        icon: image_gray,
        shape: shape,      
        zIndex: crosswalk.zindex
      });

      google.maps.event.addListener(marker, 'click', function() {

        localStorage.setItem("currentClickedCrosswalkId", crosswalk.id);
        localStorage.setItem("currentClickedCrosswalkPosition", JSON.stringify(crosswalk.points));
        localStorage.setItem("currentClickedCrosswalk", JSON.stringify(crosswalk));

        localStorage.setItem("crosswalkStatus", "collection");        
        window.location.href = "crosswalk.html";

      });

    }
  }  
}


function setPolylines(map){
  for (var i = 0; i < sidewalks.length; i++) {

    let sidewalk = sidewalks[i];
    var sidewalkPath = new google.maps.Polyline({
      path: sidewalk.points,
      geodesic: true,
      strokeColor: sidewalk.color,
      strokeOpacity: 0.5,
      strokeWeight: 6,
      clickable: true,
      zIndex: 1
    });
    sidewalkPath.setMap(map);
    
    google.maps.event.addListener(sidewalkPath, 'click', function() {

      localStorage.setItem("currentClickedSidewalk", JSON.stringify(sidewalk));        

      if(this.strokeColor === "#424242"){
        localStorage.setItem("sidewalkStatus", "collection");       
        window.location.href = "sidewalk.html";        
      } else {
        localStorage.setItem("sidewalkStatus", "validation");
        window.location.href = "sidewalkVal_template.html";
      }
    });
  }
}



function setCorners(map) {
  var image_gray = {
    url: 'img/cornerpin_gray.png',
    size: new google.maps.Size(44, 68),    
    origin: new google.maps.Point(0, 0),   
    anchor: new google.maps.Point(22, 68)
  };

  var image_red = {
    url: 'img/cornerpin_red.png',
    size: new google.maps.Size(44, 68),    
    origin: new google.maps.Point(0, 0),    
    anchor: new google.maps.Point(22, 68)
  };

  var image_orange = {
    url: 'img/cornerpin_orange.png',
    size: new google.maps.Size(44, 68),    
    origin: new google.maps.Point(0, 0),    
    anchor: new google.maps.Point(22, 68)
  };

  var image_green = {
    url: 'img/cornerpin_green.png',
    size: new google.maps.Size(44, 68),    
    origin: new google.maps.Point(0, 0),    
    anchor: new google.maps.Point(22, 68)
  };

  var shape = {
    coords: [1, 1, 1, 44, 68, 44, 68, 1],
    type: 'poly'
  };

  for (var i = 0; i < corners.length; i++) {

    var corner = corners[i];    

    if (corner.color==="green"){
      var marker = new google.maps.Marker({
        position: corner.points[0],
        map: map,
        icon: image_green,
        shape: shape,      
        zIndex: corner.zindex,
        url: "cornerVal_template.html",
        internalId: corner.id,
        cornerShape: corner.shape
      });

      google.maps.event.addListener(marker, 'click', function() {

        localStorage.setItem("currentClickedCornerId", this.internalId);
        localStorage.setItem("currentClickedCornerShape", this.cornerShape);

        localStorage.setItem("cornerStatus", "validation");

        window.location.href = this.url;
      });
    }    
    else if (corner.color==="red"){
      var marker = new google.maps.Marker({
        position: corner.points[0],
        map: map,
        icon: image_red,
        shape: shape,      
        zIndex: corner.zindex,
        url: "cornerVal_template.html",
        internalId: corner.id,
        cornerShape: corner.shape
      });

      google.maps.event.addListener(marker, 'click', function() {

        localStorage.setItem("currentClickedCornerId", this.internalId);
        localStorage.setItem("currentClickedCornerShape", this.cornerShape);

        localStorage.setItem("cornerStatus", "validation");

        window.location.href = this.url;
        
      });
    }
    else if (corner.color==="orange"){
      var marker = new google.maps.Marker({
        position: corner.points[0],
        map: map,
        icon: image_orange,
        shape: shape,      
        zIndex: corner.zindex,
        url: "cornerVal_template.html",
        internalId: corner.id,
        cornerShape: corner.shape
      });

      google.maps.event.addListener(marker, 'click', function() {

        localStorage.setItem("currentClickedCornerId", this.internalId);
        localStorage.setItem("currentClickedCornerShape", this.cornerShape);

        localStorage.setItem("cornerStatus", "validation");

        window.location.href = this.url;

      });
    }
    else {
      var marker = new google.maps.Marker({
        position: corner.points[0],
        map: map,
        icon: image_gray,
        shape: shape,      
        zIndex: corner.zindex,
        url: "corner.html",
        internalId: corner.id,
        cornerShape: corner.shape
      });

      google.maps.event.addListener(marker, 'click', function() {

        localStorage.setItem("currentClickedCornerId", this.internalId);
        localStorage.setItem("currentClickedCornerShape", this.cornerShape);

        localStorage.setItem("cornerStatus", "collection");

        window.location.href = this.url;
      });
    } 
  }
}

function addObstacles(map) {
  var image = {
    url: 'img/obstacle_pin.png',
    size: new google.maps.Size(43, 68),    
    origin: new google.maps.Point(0, 0),    
    anchor: new google.maps.Point(21.5, 68)
  };

  var shape = {
    coords: [1, 1, 1, 44, 68, 44, 68, 1],
    type: 'poly'
  };

  for (var i = 0; i < obstacles.length; i++) {
    let obstacle = obstacles[i];
    var marker = new google.maps.Marker({
      position: obstacle.points,
      map: map,
      icon: image,
      shape: shape,      
      zIndex: obstacle.zIndex
    });

    if(obstacle.id === localStorage.obstacleDropId){
      marker.setAnimation(google.maps.Animation.DROP);
      localStorage.removeItem("obstacleDropId");
    }

    if(obstacle.isTemporary === "true" && Number(obstacle.durability) <= 1){
      marker.setAnimation(google.maps.Animation.BOUNCE);

      google.maps.event.addListener(marker, 'click', function() {

        localStorage.setItem("currentClickedObstacle", JSON.stringify(obstacle));
       
        localStorage.setItem("obstacleStatus", "check");

        window.location.href = "obstacleVal_template.html";
      });

    } else {

      google.maps.event.addListener(marker, 'click', function() {

        localStorage.setItem("obstacleStatus", "validation");

        window.location.href = "obstacleVal_template2.html";
      });      
    }
  }
}


function setCrosswalkRamps(map){

  var button = document.getElementById("button-crosswalk-select-ramp");
    

  var image1 = {
    url: 'img/zebra3.png',
    size: new google.maps.Size(60, 60),    
    origin: new google.maps.Point(0, 0),    
    anchor: new google.maps.Point(30, 60)
  };

  var shape = {
    coords: [1, 1, 1, 60, 93, 60, 93, 1],
    type: 'poly'
  };

  var image2 = {
    url: 'img/ramp1.png',
    size: new google.maps.Size(60, 93),    
    origin: new google.maps.Point(0, 0),    
    anchor: new google.maps.Point(30, 93)
  };

  var image3 = {
    url: 'img/ramp2.png',
    size: new google.maps.Size(60, 93),    
    origin: new google.maps.Point(0, 0),    
    anchor: new google.maps.Point(30, 93)
  };

  var image2_selected = {
    url: 'img/ramp_selected01.png',
    size: new google.maps.Size(60, 93),    
    origin: new google.maps.Point(0, 0),    
    anchor: new google.maps.Point(30, 93)
  };

  var image3_selected = {
    url: 'img/ramp_selected02.png',
    size: new google.maps.Size(60, 93),    
    origin: new google.maps.Point(0, 0),    
    anchor: new google.maps.Point(30, 93)
  };
  

  var markers = JSON.parse(localStorage.crosswalkMarkers);  

  markers.forEach( function (marker) {
    if (marker.id === localStorage.currentClickedCrosswalkId) {


      var rampMarker1 = new google.maps.Marker({
        position: marker.ramp1.points,
        map: map,
        icon: image2,
        shape: shape,      
        zIndex: 1
      });


      var rampMarker2 = new google.maps.Marker({
        position: marker.ramp2.points,
        map: map,
        icon: image3,
        shape: shape,      
        zIndex: 3
      });


      var zebraMarker = new google.maps.Marker({
        position: marker.points,
        map: map,
        icon: image1,
        shape: shape,      
        zIndex: 2
      });

      rampMarker1.addListener('click', function (){
        rampMarker2.setIcon(image3);
        this.setIcon(image2_selected);              
        localStorage.setItem("currentClickedCrosswalkRampId", marker.ramp1.id);
        button.classList.remove("disabled"); 
      }
      );

      rampMarker2.addListener('click', function (){
        rampMarker1.setIcon(image2);
        this.setIcon(image3_selected);             
        localStorage.setItem("currentClickedCrosswalkRampId", marker.ramp2.id);
        button.classList.remove("disabled"); 
      }

      );
    }            
  });
}


function setCrosswalkRampLeft(map){

  var image1 = {
    url: 'img/zebra3.png',
    size: new google.maps.Size(60, 60),    
    origin: new google.maps.Point(0, 0),    
    anchor: new google.maps.Point(30, 60)
  };

  var shape = {
    coords: [1, 1, 1, 60, 93, 60, 93, 1],
    type: 'poly'
  };
 

  var image3 = {
    url: 'img/ramp2_02.png',
    size: new google.maps.Size(60, 93),    
    origin: new google.maps.Point(0, 0),    
    anchor: new google.maps.Point(30, 93)
  };

  var image2_selected = {
    url: 'img/ramp_selected01.png',
    size: new google.maps.Size(60, 93),    
    origin: new google.maps.Point(0, 0),    
    anchor: new google.maps.Point(30, 93)
  };

  var markers = JSON.parse(localStorage.crosswalkMarkers);  

  markers.forEach( function (marker) {
    if (marker.id === localStorage.currentClickedCrosswalkId) {


      var rampMarker1 = new google.maps.Marker({
        position: marker.ramp1.points,
        map: map,
        icon: image2_selected,
        shape: shape,      
        zIndex: 1
      });


      var rampMarker2 = new google.maps.Marker({
        position: marker.ramp2.points,
        map: map,
        icon: image3,
        shape: shape,      
        zIndex: 3
      });


      var zebraMarker = new google.maps.Marker({
        position: marker.points,
        map: map,
        icon: image1,
        shape: shape,      
        zIndex: 2
      });
      
    }            
  });
}

function setCrosswalkRampRight(map){

  var image1 = {
    url: 'img/zebra3.png',
    size: new google.maps.Size(60, 60),    
    origin: new google.maps.Point(0, 0),    
    anchor: new google.maps.Point(30, 60)
  };

  var shape = {
    coords: [1, 1, 1, 60, 93, 60, 93, 1],
    type: 'poly'
  };

  var image2 = {
    url: 'img/ramp1_02.png',
    size: new google.maps.Size(60, 93),    
    origin: new google.maps.Point(0, 0),    
    anchor: new google.maps.Point(30, 93)
  }; 


  var image3_selected = {
    url: 'img/ramp_selected02.png',
    size: new google.maps.Size(60, 93),    
    origin: new google.maps.Point(0, 0),    
    anchor: new google.maps.Point(30, 93)
  };
  

  var markers = JSON.parse(localStorage.crosswalkMarkers);  

  markers.forEach( function (marker) {
    if (marker.id === localStorage.currentClickedCrosswalkId) {


      var rampMarker1 = new google.maps.Marker({
        position: marker.ramp1.points,
        map: map,
        icon: image2,
        shape: shape,      
        zIndex: 1
      });


      var rampMarker2 = new google.maps.Marker({
        position: marker.ramp2.points,
        map: map,
        icon: image3_selected,
        shape: shape,      
        zIndex: 3
      });


      var zebraMarker = new google.maps.Marker({
        position: marker.points,
        map: map,
        icon: image1,
        shape: shape,      
        zIndex: 2
      });
      
    }            
  });
}

function setCrosswalkRampZebra(map){

  var button = document.getElementById("button-crosswalk-select-ramp");
    

  var image1 = {
    url: 'img/zebra3_02.png',
    size: new google.maps.Size(60, 60),    
    origin: new google.maps.Point(0, 0),    
    anchor: new google.maps.Point(30, 60)
  };

  var shape = {
    coords: [1, 1, 1, 60, 93, 60, 93, 1],
    type: 'poly'
  };

  var image2 = {
    url: 'img/ramp1_02.png',
    size: new google.maps.Size(60, 93),    
    origin: new google.maps.Point(0, 0),    
    anchor: new google.maps.Point(30, 93)
  };

  var image3 = {
    url: 'img/ramp2_02.png',
    size: new google.maps.Size(60, 93),    
    origin: new google.maps.Point(0, 0),    
    anchor: new google.maps.Point(30, 93)
  };  
  

  var markers = JSON.parse(localStorage.crosswalkMarkers);  

  markers.forEach( function (marker) {
    if (marker.id === localStorage.currentClickedCrosswalkId) {


      var rampMarker1 = new google.maps.Marker({
        position: marker.ramp1.points,
        map: map,
        icon: image2,
        shape: shape,      
        zIndex: 1
      });


      var rampMarker2 = new google.maps.Marker({
        position: marker.ramp2.points,
        map: map,
        icon: image3,
        shape: shape,      
        zIndex: 3
      });


      var zebraMarker = new google.maps.Marker({
        position: marker.points,
        map: map,
        icon: image1,
        shape: shape,      
        zIndex: 2
      });

      
    }            
  });
}


function setFrame(map){

  var image = {
    url: 'img/zoom_frame.png',
    size: new google.maps.Size(55, 75),    
    origin: new google.maps.Point(0, 0),    
    anchor: new google.maps.Point(27.5, 37.5)
  };

  var center = JSON.parse(localStorage.currentClickedCrosswalkPosition);
  
  var frameMarker = new google.maps.Marker({
    position: {lat: Number(center.lat) + 0.00002, lng: center.lng},
    map: map,
    icon: image,        
    zIndex: 2
  });


}

function setBorder(map){

  var image = {
    url: 'img/map_border.png',
    size: new google.maps.Size(186, 196),    
    origin: new google.maps.Point(0, 0),    
    anchor: new google.maps.Point(93, 98)
  };

  var center = JSON.parse(localStorage.currentClickedCrosswalkPosition);
  
  var frameMarker = new google.maps.Marker({
    position: {lat: Number(center.lat) + 0.00002, lng: center.lng},
    map: map,
    icon: image,        
    zIndex: 2
  });

  
}


function loadJSON(filePath) {
  var json = loadTextFileAjaxSync(filePath, "application/json");
  return JSON.parse(json);
}  

function loadTextFileAjaxSync(filePath, mimeType)
{
  var xmlhttp=new XMLHttpRequest();
  xmlhttp.open("GET",filePath,false);
  if (mimeType != null) {
    if (xmlhttp.overrideMimeType) {
      xmlhttp.overrideMimeType(mimeType);
    }
  }
  xmlhttp.send();
  if (xmlhttp.status==200)
  {
    return xmlhttp.responseText;
  }
  else {
    return null;
  }
}

////////////////////////////////////////////////// DATA ///////////////////////////////////////////////////////////


if (localStorage.length == 0) {
  var json_corners = loadJSON("data/corners.json");
  var json_sidewalks = loadJSON("data/sidewalks.json");
  var json_crosswalks = loadJSON("data/crosswalks.json");
  var json_obstacles = loadJSON("data/obstacles.json");

  var string_corners = JSON.stringify(json_corners);
  var string_sidewalks = JSON.stringify(json_sidewalks);
  var string_crosswalks = JSON.stringify(json_crosswalks);
  var string_obstacles = JSON.stringify(json_obstacles);

  localStorage.setItem("cornerMarkers", string_corners);
  localStorage.setItem("sidewalkMarkers", string_sidewalks);
  localStorage.setItem("crosswalkMarkers", string_crosswalks);
  localStorage.setItem("obstacleMarkers", string_obstacles);

  var corners = JSON.parse(localStorage.cornerMarkers);
  var sidewalks = JSON.parse(localStorage.sidewalkMarkers);
  var crosswalks = JSON.parse(localStorage.crosswalkMarkers);
  var obstacles = JSON.parse(localStorage.obstacleMarkers);

  localStorage.setItem("gamePointsOverall", "50");
  localStorage.setItem("gamePointsMonthly", "25");
  localStorage.setItem("gamePointsCollection", "0");

  localStorage.setItem("crosswalkCollected", "false");
  localStorage.setItem("obstacleAdded", "false");
  localStorage.setItem("sidewalkCollected", "false");
  localStorage.setItem("obstacleChecked", "false");
  localStorage.setItem("cornerValidated", "false");

} else {
  var corners = JSON.parse(localStorage.cornerMarkers);
  var sidewalks = JSON.parse(localStorage.sidewalkMarkers);
  var crosswalks = JSON.parse(localStorage.crosswalkMarkers);
  var obstacles = JSON.parse(localStorage.obstacleMarkers);
}


function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}

var CornerHandler = function() {
  var cards = document.getElementsByClassName("card-corner");  
  var buttonConfirm = document.getElementById("button-confirm-corner");
  var radioButtons = document.getElementsByName("corner-shape-radio");
  var validationPage = document.getElementById("validation-body");

  var buttonEditVal = document.getElementById("button-edit-corner-val");
  var buttonConfirmVal = document.getElementById("button-confirm-corner-val");
  var backArrows = document.getElementsByClassName("back-to-index");


  if (validationPage != null) {
    window.addEventListener('load', this._loadIcon.bind(this), false);
  }
  

  if (buttonConfirm != null) {
    buttonConfirm.addEventListener("click", this._showModal.bind(this), false);
  }

  for (var i = 0; i < radioButtons.length; i++){
    radioButtons[i].addEventListener('change', this._enableConfirmButton, false);
  }

  if (buttonEditVal != null) {
    buttonEditVal.addEventListener("click", this._editData.bind(this), false);
  }

  if (buttonConfirmVal != null) {
    buttonConfirmVal.addEventListener("click", this._showModal.bind(this), false);
  }


  for (var i = 0; i < backArrows.length; i++){
    backArrows[i].addEventListener("click", function(){window.location.href = "index.html";});
  }
  

}


CornerHandler.prototype._enableConfirmButton = function() {

  if (this.checked) {          
    var button = document.getElementById("button-confirm-corner");
    button.classList.remove("disabled");    
    localStorage.setItem("currentClickedCornerShape", this.value);    
  }

}

CornerHandler.prototype._editData = function() {
  window.location.href = "corner.html";
}

CornerHandler.prototype._loadIcon = function() {

  var image = document.createElement("img");
  var markers = JSON.parse(localStorage.cornerMarkers);
  var footer = document.getElementById("corner-shape-footer");

  markers.forEach( function (marker)
  {
    if (marker.id === localStorage.currentClickedCornerId) {    
      if (marker.shape === "round"){
        image.src = 'img/corner_round.png';
        footer.innerHTML = "kulatý (x > 0.5m)";
      } else if (marker.shape === "sharp"){
        image.src = 'img/corner_sharp.png';
        footer.innerHTML = "ostrý";
      } else {
        image.src = 'img/corner_refracted.png';
        footer.innerHTML = "lomený (x > 1m)";
      }

      var r_cornerValidationNumber = document.getElementById("rec-corner-validation-status");
      var r_cornerValidationNumberColor = document.getElementById("cornerValidationNumber-color");
        
      if(r_cornerValidationNumber != null){
        switch (marker.validationNumber) {
        case 1:
        r_cornerValidationNumber.innerHTML = "červená";
        setValidationLevel(r_cornerValidationNumberColor, "červená");
        break; 
        case 2:
        r_cornerValidationNumber.innerHTML = "červená";
        setValidationLevel(r_cornerValidationNumberColor, "červená");
        break;
        case 3:
        r_cornerValidationNumber.innerHTML = "oranžová";
        setValidationLevel(r_cornerValidationNumberColor, "oranžová");
        break;
        case 4:
        r_cornerValidationNumber.innerHTML = "oranžová";
        setValidationLevel(r_cornerValidationNumberColor, "oranžová");
        break;
        case 5:
        r_cornerValidationNumber.innerHTML = "zelená";
        setValidationLevel(r_cornerValidationNumberColor, "zelená");
        break;
        default:
        r_cornerValidationNumber.innerHTML = "zelená";
        setValidationLevel(r_cornerValidationNumberColor, "zelená");
        break;     
      }
      }

    }
  });        
  
  document.getElementById("card-corner-shape-icon").appendChild(image);
}

function setValidationLevel (div, color){
  if(color === "červená"){
    div.classList.add("validationLabel-red");
    div.classList.remove("validationLabel-orange");
    div.classList.remove("validationLabel-green");
  }

    else if (color === "oranžová"){
      div.classList.add("validationLabel-orange");
    div.classList.remove("validationLabel-red");
    div.classList.remove("validationLabel-green");

    }

    else if (color === "zelená"){
      div.classList.add("validationLabel-green");
    div.classList.remove("validationLabel-orange");
    div.classList.remove("validationLabel-red");

    }

}

function showCornerData(){
  var markers = JSON.parse(localStorage.cornerMarkers);

        markers.forEach( function (marker)
        {
          if (marker.id === localStorage.currentClickedCornerId) {

            marker.validationNumber = Number(marker.validationNumber) + 1;
            marker.shape=localStorage.currentClickedCornerShape;         
            

            if(marker.validationNumber == 1 || marker.validationNumber == 2){
              marker.color="red";
            }
            else if (marker.validationNumber == 3 || marker.validationNumber == 4) {
              marker.color="orange";
            }
            else if (marker.validationNumber > 4){
              marker.color="green";
            } else {
              marker.color="gray";
            }

          }
        });

        var string_markers = JSON.stringify(markers);  
        localStorage.setItem("cornerMarkers", string_markers);

        if(localStorage.cornerStatus === "validation"){
          localStorage.setItem("cornerValidated", "true");
        }
}

CornerHandler.prototype._showModal = function() {

  myApp.modal({
    title:  '<span class="modal-title">Nahráli jste <br><span id="corner-gained-points" class="modal-points"></span><br><span id="corner-gained-points-unit"></span></span>',
    text: '<span class="modal-thank">a pomohli jste hendikepovaným<br>lidem s bezpečnou navigací.<br><br>Ďekujeme.</span>',
    verticalButtons: true,
    buttons: [
    {
      text: 'Sdílet',
      onClick: function() {
        
        showCornerData();
        writePoints();

        window.location.href = "https://www.facebook.com/sharer/sharer.php?u=example.org";
      }
    },
    {
      text: 'Pokračovat',
      onClick: function() {
        
        showCornerData();
        writePoints();

        window.location.href = "index.html";
      }
    },
    {
      text: '<span class="modal-exit">Zrušit</span>',
      onClick: function() {
        handlepoints(-3);
        mainView.router.back("corner-shape");
      }
    },      
    ]
  })

  
  handlepoints(3);
  
  var showPoints = document.getElementById("corner-gained-points");
  var pointUnits = document.getElementById("corner-gained-points-unit");

  var gainedPoints = JSON.parse(localStorage.gamePointsCollection);

  showPoints.innerHTML = gainedPoints;

  if(Number(gainedPoints) > 4){
    pointUnits.innerHTML = "bodů";
  } else {
    pointUnits.innerHTML = "body";
  }

}

CornerHandler.prototype._saveData = function() {
  var markers = JSON.parse(localStorage.cornerMarkers);

  markers.forEach( function (marker)
  {
    if (marker.id === localStorage.currentClickedCornerId) {

      marker.validationNumber = Number(marker.validationNumber) + 1;

      if(marker.validationNumber == 1){
        marker.color="red";
      }
      else if (marker.validationNumber == 2 || marker.validationNumber == 3) {
        marker.color="orange";
      }
      else {
        marker.color="green";
      }


      marker.shape=localStorage.currentClickedCornerShape;

    }
  });

  var string_markers = JSON.stringify(markers);  
  localStorage.setItem("cornerMarkers", string_markers);
}




var ih = new CornerHandler();



function initialize() {

  var center = JSON.parse(localStorage.currentClickedCrosswalkPosition)

  var map1 = new google.maps.Map(document.getElementById('map-canvas1'), {
    zoom: 18,
    center: {lat: Number(center.lat) + 0.00002, lng: center.lng},
    disableDefaultUI: true,
    styles: mapStyle
  });

   

  var map2 = new google.maps.Map(document.getElementById('map-canvas2'), {
    zoom: 22,
    center: {lat: Number(center.lat) + 0.00002, lng: center.lng},
    disableDefaultUI: true,
    styles: mapStyle
  });

  setCrosswalkRamps(map2);
  setFrame(map1);
  setBorder(map1);


  map2.addListener('zoom_changed', function() {      
    map1.setZoom(map2.getZoom()-4);

  })

  map2.addListener('center_changed', function() {

    window.setTimeout(function() {
      map2.panTo({lat: Number(center.lat) + 0.00002, lng: center.lng});      
    }, 3000);
  });


  map1.addListener('center_changed', function() {

    window.setTimeout(function() {
      map1.panTo(JSON.parse(localStorage.currentClickedCrosswalkPosition));      
    }, 2000);
  });
}


function initMapHeader1() {

  var center = JSON.parse(localStorage.currentClickedCrosswalkPosition)

  var map2 = new google.maps.Map(document.getElementById('map-canvas3'), {
    zoom: 22,
    center: {lat: Number(center.lat) + 0.00001, lng: center.lng},
    disableDefaultUI: true,
    styles: mapStyle,
    draggable: false,
    zoomControl: false,
    scaleControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true
  });


  setCrosswalkRampLeft(map2);

}

function initMapHeader2() { 

  var center = JSON.parse(localStorage.currentClickedCrosswalkPosition)

  var map2 = new google.maps.Map(document.getElementById('map-canvas4'), {
    zoom: 22,
    center: {lat: Number(center.lat) + 0.00001, lng: center.lng},
    disableDefaultUI: true,
    styles: mapStyle,
    draggable: false,
    zoomControl: false,
    scaleControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true
  });

  setCrosswalkRampRight(map2);

}

function initMapHeader3() {

  var center = JSON.parse(localStorage.currentClickedCrosswalkPosition) 

  var map2 = new google.maps.Map(document.getElementById('map-canvas5'), {
    zoom: 22,
    center: {lat: Number(center.lat) + 0.00001, lng: center.lng},
    disableDefaultUI: true,
    styles: mapStyle,
    draggable: false,
    zoomControl: false,
    scaleControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true
  });

  setCrosswalkRampZebra(map2);

}


var CrosswalkHandler = function() {
  var buttonRamp = document.getElementById("button-crosswalk-select-ramp");
  var buttonRampType = document.getElementById("button-crosswalk-select-rampType");


  var radioButtonsRampType = document.getElementsByName("crosswalk-rampType-radio");
  
  var radioButtonsSurface = document.getElementsByName("crosswalk-surface-radio");
  var radioButtonsType = document.getElementsByName("crosswalk-menu-radio");

  var radioButtonMeter = document.getElementById("crosswalk_card_meter");
  var radioButtonCreditcard = document.getElementById("crosswalk_card_creditcard");
  var radioButtonFeet = document.getElementById("crosswalk_card_feet");

  var radioButtonsCurb = document.getElementsByName("crosswalk-curb-radio");
  var radioButtonsZebraType = document.getElementsByName("crosswalk-zebraType-radio");
  var radioButtonsZebraSurface = document.getElementsByName("crosswalk-zebra-surface-radio");
  
  var buttonCurb = document.getElementById("button-crosswalk-select-curb");
  var buttonStrip = document.getElementById("button-crosswalk-select-strip");
  var buttonSurface = document.getElementById("button-crosswalk-select-surface");

  var buttonSecondRampNo = document.getElementById("button-second-ramp-no");
  var buttonSecondRampYes = document.getElementById("button-second-ramp-yes");

  var buttonZebraType = document.getElementById("button-crosswalk-select-zebraType");
  var buttonZebraProperties = document.getElementById("button-crosswalk-select-properties");

  var buttonZebraSurface = document.getElementById("button-crosswalk-zebra-select-surface");  
  var buttonDrivingLines = document.getElementById("button-crosswalk-select-drivingLines");
  var buttonConfirm = document.getElementById("button-crosswalk-recapitulation");
  var buttonConfirmType = document.getElementById("button-crosswalk-menu");
  var buttonSurfaceSkip = document.getElementById("button-crosswalk-select-surface-skip");
  var buttonSurfaceZebraSkip = document.getElementById("button-crosswalk-zebra-select-surface-skip");

  var buttonValidationConfirm = document.getElementById("button-crosswalk-validation-confirm");
 

  if(buttonValidationConfirm != null){
    buttonValidationConfirm.addEventListener('click', this._handleModal, false);
  }

  if (buttonSurfaceZebraSkip != null){
    buttonSurfaceZebraSkip.addEventListener('click', this._showRecapitulPage, false);
  }

  if (buttonSurfaceSkip != null){
    buttonSurfaceSkip.addEventListener('click', this._handleSurfaceSkip, false);
  }

  if (buttonConfirmType != null){
    buttonConfirmType.addEventListener('click', this._handleTypeSelection, false);
  }

  if (buttonConfirm != null){
    buttonConfirm.addEventListener('click', this._handleModal, false);
  }

  if (buttonDrivingLines != null){
    buttonDrivingLines.addEventListener('click', this._handleDrivingLinesSelection, false);
  } 

  if (buttonZebraSurface != null){
    buttonZebraSurface.addEventListener('click', this._handleZebraSurfaceSelection, false);
  }

  if (buttonZebraProperties != null){
    buttonZebraProperties.addEventListener('click', this._handleZebraPropertiesSelection, false);
  }

  if (buttonZebraType != null){
    buttonZebraType.addEventListener('click', this._handleZebraTypeSelection, false);
  }
  

  for (var i = 0; i < radioButtonsRampType.length; i++){
    radioButtonsRampType[i].addEventListener('change', this._handleRampTypeSelection, false);
  }

  for (var i = 0; i < radioButtonsZebraSurface.length; i++){
    radioButtonsZebraSurface[i].addEventListener('change', this._enableZebraSurfaceButton, false);
  }

  for (var i = 0; i < radioButtonsZebraType.length; i++){
    radioButtonsZebraType[i].addEventListener('change', this._enableContinueButton, false);
  }

  if(buttonStrip != null){
    buttonStrip.addEventListener('click', this._handleStripSelection, false);
  }

  for (var i = 0; i < radioButtonsType.length; i++){
    radioButtonsType[i].addEventListener('change', this._enableTypeButton, false);
  }

  for (var i = 0; i < radioButtonsSurface.length; i++){
    radioButtonsSurface[i].addEventListener('change', this._enableSurfaceButton, false);
  }

  for (var i = 0; i < radioButtonsCurb.length; i++){
    radioButtonsCurb[i].addEventListener('change', this._handleMeasureTypeSelection, false);
  }

  if (buttonRampType != null) {
    buttonRampType.addEventListener('click', this._continueToNextPage.bind(this), false);
  }

  if (radioButtonMeter != null) {
    radioButtonMeter.addEventListener('change', this._showMeterDiv, false);
  }


  if (radioButtonCreditcard != null) {
    radioButtonCreditcard.addEventListener('change', this._showCreditcardDiv, false);
  }

  if (radioButtonFeet != null) {
    radioButtonFeet.addEventListener('change', this._showFeetDiv, false);
  }

  if (buttonCurb != null) {
    buttonCurb.addEventListener('click', this._saveCurbHeight, false);

  }

  if (buttonSurface != null) {
    buttonSurface.addEventListener('click', this._handleSurfaceSelection, false);

  }

  if (buttonSecondRampYes != null){
    buttonSecondRampYes.addEventListener('click', this._saveSecondRampProperties, false);
  }

  if (buttonSecondRampNo != null){
    buttonSecondRampNo.addEventListener('click', this._handleSecondRampProperties, false);
  }


  myApp.onPageInit('crosswalk-recapitulation', function (page) {
    initMapHeader1();
    initMapHeader2();
    initMapHeader3();
  })


  myApp.onPageInit('crosswalk-map', function (page) {
    initialize();  
  })
}

var isTypeSelected = false;

function validateCrosswalkForm () {
  var meter =document.getElementById("crosswalk-curb-input-meter").value;
  var credit =document.getElementById("crosswalk-curb-input-creditcard").value;
  var feet =document.getElementById("crosswalk-curb-input-feet").value;


  if(localStorage.currentClickedCrosswalkCurbMeasureType === "meter"){

    if (meter !=null && meter !="")
    {   
     if(isTypeSelected === true){
        mainView.router.load({pageName: 'crosswalk-surface'});
      } else {
        mainView.router.load({pageName: 'crosswalk-strip'});
      }
   } else {        
    alert("Vyplnte prosím pole pro zadání výšky obrubníku.");
  }

} else if (localStorage.currentClickedCrosswalkCurbMeasureType === "creditcard"){

  if (credit !=null && credit !="")
  {   
   if(isTypeSelected === true){
      mainView.router.load({pageName: 'crosswalk-surface'});
    } else {
      mainView.router.load({pageName: 'crosswalk-strip'});
    }
 } else {        
  alert("Vyplnte prosím pole pro zadání počtu kreditek.");
}

} else if (localStorage.currentClickedCrosswalkCurbMeasureType === "feet"){

  if (feet !=null && feet !="")
  {   
   if(isTypeSelected === true){
      mainView.router.load({pageName: 'crosswalk-surface'});
    } else {
      mainView.router.load({pageName: 'crosswalk-strip'});
    }
  } else {
  alert("Vyplnte prosím pole pro zadání počtu stop.");
  }

  }    
}

CrosswalkHandler.prototype._showRecapitulPage = function(){  
  showCrosswalkData();
}


CrosswalkHandler.prototype._handleSurfaceSkip = function() {
  if (isTypeSelected === true){
    mainView.router.load({pageName: 'crosswalk-zebra-drivingLines'});
  } else if(localStorage.rampsAreTheSame === "false"){
    mainView.router.load({pageName: 'crosswalk-zebra-type'});
  } else {      
    mainView.router.load({pageName: 'crosswalk-ramp2'});            
  }
}




CrosswalkHandler.prototype._handleTypeSelection = function() {  
  var radioButtons = document.getElementsByName("crosswalk-menu-radio");
  var crosswalk = JSON.parse(localStorage.currentClickedCrosswalk);
  var type;

  for (var i = 0; i < radioButtons.length; i++){
    if(radioButtons[i].checked) {             
      type = radioButtons[i].value;
    }
  }

  var t1_isLeading = document.getElementById("crosswalk-type1-leadingLine").checked;
  var t1_isSemafor = document.getElementById("crosswalk-type1-semafor").checked;
  var t1_isAudio = document.getElementById("crosswalk-type1-audio").checked;
  var t1_isSignalButton = document.getElementById("crosswalk-type1-signalButton").checked;
  var t1_isSignal = document.getElementById("crosswalk-type1-signalLine").checked;
  var t1_isWarning = document.getElementById("crosswalk-type1-warningLine").checked;


  var t2_isLeading = document.getElementById("crosswalk-type2-leadingLine").checked;
  var t2_isSemafor = document.getElementById("crosswalk-type2-semafor").checked;
  var t2_isAudio = document.getElementById("crosswalk-type2-audio").checked;
  var t2_isSignalButton = document.getElementById("crosswalk-type2-signalButton").checked;
  var t2_isSignal = document.getElementById("crosswalk-type2-signalLine").checked;
  var t2_isWarning = document.getElementById("crosswalk-type2-warningLine").checked;

 switch (type) {
    case "type1":
    crosswalk.zebraType = "classic";
    crosswalk.isLeading = t1_isLeading;
    crosswalk.isSemafor = t1_isSemafor;
    crosswalk.isAudio = t1_isAudio;
    crosswalk.isSignal = t1_isSignalButton;
    crosswalk.ramp1.type = "barrierFree";
    crosswalk.ramp1.isSignal = t1_isSignal;
    crosswalk.ramp1.isWarning = t1_isWarning;
    crosswalk.ramp2.type = "barrierFree";
    crosswalk.ramp2.isSignal = t1_isSignal;
    crosswalk.ramp2.isWarning = t1_isWarning;    
    break; 
    case "type2":
    crosswalk.zebraType = "classic";
    crosswalk.isLeading = t2_isLeading;
    crosswalk.isSemafor = t2_isSemafor;
    crosswalk.isAudio = t2_isAudio;
    crosswalk.isSignal = t2_isSignalButton;
    crosswalk.ramp1.type = "barrier";
    crosswalk.ramp1.isSignal = t2_isSignal;
    crosswalk.ramp1.isWarning = t2_isWarning;
    crosswalk.ramp2.type = "barrier";
    crosswalk.ramp2.isSignal = t2_isSignal;
    crosswalk.ramp2.isWarning = t2_isWarning;    
    break;
  } 


  localStorage.setItem("rampsAreTheSame", "true");
  localStorage.setItem("currentClickedCrosswalk", JSON.stringify(crosswalk));
  
  isTypeSelected = true;

  if(crosswalk.ramp1.type === "barrier"){
    mainView.router.load({pageName: 'crosswalk-curb'});
  } else {
    mainView.router.load({pageName: 'crosswalk-surface'});
  }

  handlepoints(20);
}


CrosswalkHandler.prototype._handleModal = function() {

  if(localStorage.crosswalkStatus === "validation"){
          handlepoints(4);
  }

  myApp.modal({
    title:  '<span class="modal-title">Nahráli jste <br><span id="crosswalk-gained-points" class="modal-points"></span><br><span id="crosswalk-gained-points-unit"></span></span>',
    text: '<span class="modal-thank">a pomohli jste hendikepovaným<br>lidem s bezpečnou navigací.<br><br>Ďekujeme.</span>',
    verticalButtons: true,
    buttons: [
    {
      text: 'Sdílet',
      onClick: function() {
        
        saveCrosswalk();
        writePoints();

        if(localStorage.crosswalkStatus === "collection"){
          localStorage.setItem("crosswalkCollected", "true");
        }

        window.location.href = "https://www.facebook.com/sharer/sharer.php?u=example.org";

      }
    },
    {
      text: 'Pokračovat',
      onClick: function() {

        saveCrosswalk();
        writePoints();

        if(localStorage.crosswalkStatus === "collection"){
          localStorage.setItem("crosswalkCollected", "true");
        }      

        window.location.href = "index.html";
      }
    },
    {
      text: '<span class="modal-exit">Zrušit</span>',
      onClick: function() {
        if(localStorage.crosswalkStatus === "validation"){
          handlepoints(-4);
        }
        mainView.router.back("sidewalk-recapitul");
        
      }
    },      
    ]
  })

  
  var showPoints = document.getElementById("crosswalk-gained-points");
  var pointUnits = document.getElementById("crosswalk-gained-points-unit");

  var gainedPoints = JSON.parse(localStorage.gamePointsCollection);

  showPoints.innerHTML = gainedPoints;

  if(Number(gainedPoints) > 4){
    pointUnits.innerHTML = "bodů";
  } else {
    pointUnits.innerHTML = "body";
  }

}

 function saveCrosswalk(){
    var crosswalks = JSON.parse(localStorage.crosswalkMarkers);
        var crosswalk = JSON.parse(localStorage.currentClickedCrosswalk);
        

        crosswalks.forEach( function (marker)
        {
          if (marker.id === crosswalk.id) {                              

            marker.zebraType = crosswalk.zebraType;
            marker.isLeading = crosswalk.isLeading;
            marker.isSemafor = crosswalk.isSemafor;
            marker.isAudio = crosswalk.isAudio;
            marker.isSignal = crosswalk.isSignal;
            marker.surface = crosswalk.surface;
            marker.surfQuality = crosswalk.surfQuality;
            marker.drivingLines = crosswalk.drivingLines;
            
            marker.ramp1.type = crosswalk.ramp1.type;
            marker.ramp1.curbHeight = crosswalk.ramp1.curbHeight;
            marker.ramp1.isSignal = crosswalk.ramp1.isSignal;
            marker.ramp1.isWarning = crosswalk.ramp1.isWarning;
            marker.ramp1.surface = crosswalk.ramp1.surface;
            marker.ramp1.surfQuality = crosswalk.ramp1.surfQuality;

            marker.ramp2.type = crosswalk.ramp2.type;
            marker.ramp2.curbHeight = crosswalk.ramp2.curbHeight;
            marker.ramp2.isSignal = crosswalk.ramp2.isSignal;
            marker.ramp2.isWarning = crosswalk.ramp2.isWarning;
            marker.ramp2.surface = crosswalk.ramp2.surface;
            marker.ramp2.surfQuality = crosswalk.ramp2.surfQuality;


            marker.validationNumber = Number(marker.validationNumber) + 1;            


            if(marker.validationNumber == 1 || marker.validationNumber == 2){
              marker.color="red";
            }
            else if (marker.validationNumber == 3 || marker.validationNumber == 4) {
              marker.color="orange";
            }
            else if (marker.validationNumber > 4){
              marker.color="green";
            } else {
              marker.color="gray";
            } 
          }
        });

        localStorage.setItem("crosswalkMarkers", JSON.stringify(crosswalks));
 }

var imageSignalStrip1 = document.createElement("img");
var imageWarningStrip1 = document.createElement("img");
var imageSignalStrip2 = document.createElement("img");
var imageWarningStrip2 = document.createElement("img");
var imageLeadingStrip = document.createElement("img");
var imageSemafor = document.createElement("img");
var imageAudio = document.createElement("img");
var imageSignal = document.createElement("img");

function showCrosswalkData(){
  var r1_crosswalkType = document.getElementById("rec-crosswalk-curbType1");
  var r1_crosswalkCurbHeight = document.getElementById("rec-crosswalk-curbHeight1");
  var r1_crosswalkSurface = document.getElementById("rec-crosswalk-surface1");
  var r1_crosswalkSurfQuality = document.getElementById("rec-crosswalk-surfQuality1");
  var r1_crosswalkSignalStrip = document.getElementById("rec-crosswalk-signal-strip1");
  var r1_crosswalkWarningStrip = document.getElementById("rec-crosswalk-warning-strip1");
  

  var r2_crosswalkType = document.getElementById("rec-crosswalk-curbType2");
  var r2_crosswalkCurbHeight = document.getElementById("rec-crosswalk-curbHeight2");
  var r2_crosswalkSurface = document.getElementById("rec-crosswalk-surface2");
  var r2_crosswalkSurfQuality = document.getElementById("rec-crosswalk-surfQuality2");
  var r2_crosswalkSignalStrip = document.getElementById("rec-crosswalk-signal-strip2");
  var r2_crosswalkWarningStrip = document.getElementById("rec-crosswalk-warning-strip2");
  

  var zebraType = document.getElementById("rec-crosswalk-zebra-type");
  var zebraSurface = document.getElementById("rec-crosswalk-zebra-surface");
  var zebraSurfQuality = document.getElementById("rec-crosswalk-zebra-surfQuality");
  var zebraDrivingLines = document.getElementById("rec-crosswalk-zebra-drivingLines");
  var zebraLeadingStrip = document.getElementById("rec-crosswalk-zebra-leading");
  var zebraSemafor = document.getElementById("rec-crosswalk-zebra-semafor");
  var zebraAudio = document.getElementById("rec-crosswalk-zebra-audio");
  var zebraSignal = document.getElementById("rec-crosswalk-zebra-signal");
  

  var crosswalk = JSON.parse(localStorage.currentClickedCrosswalk);

  var r_crosswalkValidationNumber = document.getElementById("rec-crosswalk-validation-status");
  var r_crosswalkValidationNumberColor = document.getElementById("crosswalkValidationNumber-color");


  
  if(r_crosswalkValidationNumber != null){
    switch (crosswalk.validationNumber) {
    case 1:
    r_crosswalkValidationNumber.innerHTML = "červená";
    setValidationLevel(r_crosswalkValidationNumberColor, "červená");
    break; 
    case 2:
    r_crosswalkValidationNumber.innerHTML = "červená";
    setValidationLevel(r_crosswalkValidationNumberColor, "červená");
    break;
    case 3:
    r_crosswalkValidationNumber.innerHTML = "oranžová";
    setValidationLevel(r_crosswalkValidationNumberColor, "oranžová");
    break;
    case 4:
    r_crosswalkValidationNumber.innerHTML = "oranžová";
    setValidationLevel(r_crosswalkValidationNumberColor, "oranžová");
    break;
    case 5:
    r_crosswalkValidationNumber.innerHTML = "zelená";
    setValidationLevel(r_crosswalkValidationNumberColor, "zelená");
    break;
    default:
    r_crosswalkValidationNumber.innerHTML = "zelená";
    setValidationLevel(r_crosswalkValidationNumberColor, "zelená");
    break;      
  }
  }
  
  switch (crosswalk.ramp1.type) {
    case "barrierFree":
    r1_crosswalkType.innerHTML = "bezbariérový";
    break; 
    case "barrier":
    r1_crosswalkType.innerHTML = "obrubník s výškou";
    break;     
  }  
  
  if(crosswalk.ramp1.curbHeight != null) {
    r1_crosswalkCurbHeight.innerHTML = crosswalk.ramp1.curbHeight + " cm";
  }

  switch (crosswalk.ramp1.surface) {
    case "asphalt":
    r1_crosswalkSurface.innerHTML = "asfalt";
    break; 
    case "stones":
    r1_crosswalkSurface.innerHTML = "kamínky";
    break;
    case "smallCubes":
    r1_crosswalkSurface.innerHTML = "malé kostky";
    break;
    case "bigCubes":
    r1_crosswalkSurface.innerHTML = "velké kostky";
    break;
    case null:
    r1_crosswalkSurface.innerHTML = "-";
    break;
  }

  switch (crosswalk.ramp1.surfQuality) {
    case "1":
    r1_crosswalkSurfQuality.innerHTML = "velmi dobrá";
    break; 
    case "2":
    r1_crosswalkSurfQuality.innerHTML = "dobrá";
    break;
    case "3":
    r1_crosswalkSurfQuality.innerHTML = "špatná";
    break;
    case null:
    r1_crosswalkSurfQuality.innerHTML = "-";
    break;  
  }  

  if(crosswalk.ramp1.isSignal === true) {
    imageSignalStrip1.src = 'img/signal_strip.png';
  } else {
    imageSignalStrip1.src = 'img/signal_strip2.png';
  }

  if(crosswalk.ramp1.isWarning === true) {
    imageWarningStrip1.src = 'img/warning_strip.png';
  } else {
   imageWarningStrip1.src = 'img/warning_strip2.png';
 }

 r1_crosswalkSignalStrip.appendChild(imageSignalStrip1);
 r1_crosswalkWarningStrip.appendChild(imageWarningStrip1);
  /////////////////////////////////////////////////////////////////////////////////

  switch (crosswalk.ramp2.type) {
    case "barrierFree":
    r2_crosswalkType.innerHTML = "bezbariérový";
    break; 
    case "barrier":
    r2_crosswalkType.innerHTML = "obrubník s výškou";
    break;     
  }  
  
  if(crosswalk.ramp2.curbHeight != null) {
    r2_crosswalkCurbHeight.innerHTML = crosswalk.ramp2.curbHeight + " cm";
  }

  switch (crosswalk.ramp2.surface) {
    case "asphalt":
    r2_crosswalkSurface.innerHTML = "asfalt";
    break; 
    case "stones":
    r2_crosswalkSurface.innerHTML = "kamínky";
    break;
    case "smallCubes":
    r2_crosswalkSurface.innerHTML = "malé kostky";
    break;
    case "bigCubes":
    r2_crosswalkSurface.innerHTML = "velké kostky";
    break;
    case null:
    r2_crosswalkSurface.innerHTML = "-";
    break;
  }

  switch (crosswalk.ramp2.surfQuality) {
    case "1":
    r2_crosswalkSurfQuality.innerHTML = "velmi dobrá";
    break; 
    case "2":
    r2_crosswalkSurfQuality.innerHTML = "dobrá";
    break;
    case "3":
    r2_crosswalkSurfQuality.innerHTML = "špatná";
    break;
    case null:
    r2_crosswalkSurfQuality.innerHTML = "-";
    break;  
  }
  

  if(crosswalk.ramp2.isSignal === true) {
    imageSignalStrip2.src = 'img/signal_strip.png';
  } else {
    imageSignalStrip2.src = 'img/signal_strip2.png';
  }

  if(crosswalk.ramp2.isWarning  === true) {
    imageWarningStrip2.src = 'img/warning_strip.png';
  } else {
    imageWarningStrip2.src = 'img/warning_strip2.png';
  }

  r2_crosswalkSignalStrip.appendChild(imageSignalStrip2);
  r2_crosswalkWarningStrip.appendChild(imageWarningStrip2);
  ////////////////////////////////////////////////////////////////////////////////////

  switch (crosswalk.zebraType) {
    case "classic":
    zebraType.innerHTML = "souvislý přechod";
    break; 
    case "island":
    zebraType.innerHTML = "ostrůvek";
    break;
    case "strip":
    zebraType.innerHTML = "delíci pás";
    break;     
  }  
  
  switch (crosswalk.surface) {
    case "asphalt":
    zebraSurface.innerHTML = "asfalt";
    break; 
    case "stones":
    zebraSurface.innerHTML = "kamínky";
    break;
    case "smallCubes":
    zebraSurface.innerHTML = "malé kostky";
    break;
    case "bigCubes":
    zebraSurface.innerHTML = "velké kostky";
    break;
    case null:
    zebraSurface.innerHTML = "-";
    break;
  }

  switch (crosswalk.surfQuality) {
    case "1":
    zebraSurfQuality.innerHTML = "velmi dobrá";
    break; 
    case "2":
    zebraSurfQuality.innerHTML = "dobrá";
    break;
    case "3":
    zebraSurfQuality.innerHTML = "špatná";
    break;
    case null:
    zebraSurfQuality.innerHTML = "-";
    break;  
  }

  switch (crosswalk.drivingLines) {
    case "1":
    zebraDrivingLines.innerHTML = "1";
    break; 
    case "2":
    zebraDrivingLines.innerHTML = "2";
    break;
    case "3":
    zebraDrivingLines.innerHTML = "3";
    break;
    case "4":
    zebraDrivingLines.innerHTML = "4";
    break;
    case "5":
    zebraDrivingLines.innerHTML = "5";
    break;
    case "6":
    zebraDrivingLines.innerHTML = "6";
    break; 
  }
  

  if(crosswalk.isLeading === true) {
    imageLeadingStrip.src = 'img/leading_strip.png';
  } else {
    imageLeadingStrip.src = 'img/leading_strip2.png';
  }

  if(crosswalk.isSemafor === true) {
    imageSemafor.src = 'img/semafor.png';
  } else {
   imageSemafor.src = 'img/semafor2.png';
 }

 if(crosswalk.isAudio === true) {
  imageAudio.src = 'img/audio.png';
} else {
 imageAudio.src = 'img/audio2.png';
}

if(crosswalk.isSignal === true) {
  imageSignal.src = 'img/signal.png';
} else {
 imageSignal.src = 'img/signal2.png';
}

localStorage.setItem("rampsAreTheSame", null);

zebraLeadingStrip.appendChild(imageLeadingStrip);
zebraSemafor.appendChild(imageSemafor);
zebraAudio.appendChild(imageAudio);
zebraSignal.appendChild(imageSignal);
}

CrosswalkHandler.prototype._handleZebraSurfaceSelection = function() {
  var radioButtons = document.getElementsByName("crosswalk-zebra-surface-radio");
  var crosswalk = JSON.parse(localStorage.currentClickedCrosswalk);
  var options = document.getElementsByClassName("crosswalk-zebra-quality-option");

  for (var i = 0; i < radioButtons.length; i++){
    if(radioButtons[i].checked) {             
      crosswalk.surface = radioButtons[i].value;
    }
  }


  for (var i = 0; i < options.length; i++){

    if(options[i].selected){               
      crosswalk.surfQuality = options[i].value;        
    }
  }

  localStorage.setItem("currentClickedCrosswalk", JSON.stringify(crosswalk));
  showCrosswalkData();
  handlepoints(3);
}

CrosswalkHandler.prototype._handleDrivingLinesSelection = function() {

  var options = document.getElementsByClassName("crosswalk-zebra-drivingLines");
  var crosswalk = JSON.parse(localStorage.currentClickedCrosswalk);

  for (var i = 0; i < options.length; i++){
    if(options[i].selected){
      crosswalk.drivingLines = options[i].value;
    }
  }

  localStorage.setItem("currentClickedCrosswalk", JSON.stringify(crosswalk));
  
  handlepoints(2);
}

CrosswalkHandler.prototype._handleZebraPropertiesSelection = function() {

  var checkboxButtonLeadingStrip = document.getElementById("crosswalk-input-zebra-leading");
  var checkboxButtonSemafor = document.getElementById("crosswalk-input-zebra-semafor");
  var checkboxButtonAudio = document.getElementById("crosswalk-input-zebra-audio");
  var checkboxButtonSignal = document.getElementById("crosswalk-input-zebra-signal");
  var options = document.getElementsByClassName("crosswalk-zebra-drivingLines");
  var crosswalk = JSON.parse(localStorage.currentClickedCrosswalk);

  if(checkboxButtonLeadingStrip.checked){
    crosswalk.isLeading = true;
  } else {
    crosswalk.isLeading = false;
  }

  if(checkboxButtonSemafor.checked){      
    crosswalk.isSemafor = true;          
  } else {
    crosswalk.isSemafor = false;
  }

  if(checkboxButtonAudio.checked){      
    crosswalk.isAudio = true;          
  } else {
    crosswalk.isAudio = false;
  }

  if(checkboxButtonSignal.checked){      
    crosswalk.isSignal = true;          
  } else {
    crosswalk.isSignal = false;
  }

  localStorage.setItem("currentClickedCrosswalk", JSON.stringify(crosswalk));
  
  handlepoints(4);
}



CrosswalkHandler.prototype._handleZebraTypeSelection = function() {
  var radioButtons = document.getElementsByName("crosswalk-zebraType-radio");
  var crosswalk = JSON.parse(localStorage.currentClickedCrosswalk);
  

  for (var i = 0; i < radioButtons.length; i++){
    if(radioButtons[i].checked) {         
      crosswalk.zebraType = radioButtons[i].value;     

    }
  }

  localStorage.setItem("currentClickedCrosswalk", JSON.stringify(crosswalk));
  
  handlepoints(2);

}

CrosswalkHandler.prototype._enableTypeButton = function() {

  if (this.checked) {
    var button = document.getElementById("button-crosswalk-menu");
    button.classList.remove("disabled"); 

  } 
  
}

CrosswalkHandler.prototype._enableContinueButton = function() {

  if (this.checked) {
    var button = document.getElementById("button-crosswalk-select-zebraType");
    button.classList.remove("disabled");
  }   
}

CrosswalkHandler.prototype._enableZebraSurfaceButton = function() {

  if (this.checked) {
    var button = document.getElementById("button-crosswalk-zebra-select-surface");
    button.classList.remove("disabled");
  }   
}


CrosswalkHandler.prototype._handleSecondRampProperties = function() {
  var crosswalk = JSON.parse(localStorage.currentClickedCrosswalk);
  
  if(localStorage.currentClickedCrosswalkRampId === crosswalk.ramp1.id){ 
    
    localStorage.currentClickedCrosswalkRampId = crosswalk.ramp2.id;
   
  } else if (localStorage.currentClickedCrosswalkRampId === crosswalk.ramp2.id) {
         
    localStorage.setItem("currentClickedCrosswalkRampId", crosswalk.ramp1.id);
  }

  localStorage.setItem("rampsAreTheSame", false);

}

CrosswalkHandler.prototype._saveSecondRampProperties = function() {


  var crosswalk = JSON.parse(localStorage.currentClickedCrosswalk);

  if(localStorage.currentClickedCrosswalkRampId === crosswalk.ramp1.id){      
    crosswalk.ramp2.type = crosswalk.ramp1.type;
    crosswalk.ramp2.curbHeight = crosswalk.ramp1.curbHeight;
    crosswalk.ramp2.isSignal = crosswalk.ramp1.isSignal;
    crosswalk.ramp2.isWarning = crosswalk.ramp1.isWarning;
    crosswalk.ramp2.surface = crosswalk.ramp1.surface;
    crosswalk.ramp2.surfQuality = crosswalk.ramp1.surfQuality;

  } else if (localStorage.currentClickedCrosswalkRampId === crosswalk.ramp2.id) {        
    crosswalk.ramp1.type = crosswalk.ramp2.type;
    crosswalk.ramp1.curbHeight = crosswalk.ramp2.curbHeight;
    crosswalk.ramp1.isSignal = crosswalk.ramp2.isSignal;
    crosswalk.ramp1.isWarning = crosswalk.ramp2.isWarning;
    crosswalk.ramp1.surface = crosswalk.ramp2.surface;
    crosswalk.ramp1.surfQuality = crosswalk.ramp2.surfQuality;
  }

  localStorage.setItem("currentClickedCrosswalk", JSON.stringify(crosswalk));
  localStorage.setItem("rampsAreTheSame", true);

  handlepoints(5);
}

CrosswalkHandler.prototype._handleSurfaceSelection = function() {
  var radioButtons = document.getElementsByName("crosswalk-surface-radio");
  var crosswalk = JSON.parse(localStorage.currentClickedCrosswalk);
  var options = document.getElementsByClassName("crosswalk-quality-option");
  
  if(localStorage.rampsAreTheSame === "true"){

    for (var i = 0; i < radioButtons.length; i++){
    if(radioButtons[i].checked) {            
        crosswalk.ramp1.surface = radioButtons[i].value;             
        crosswalk.ramp2.surface = radioButtons[i].value;      
    }  
  }

  for (var i = 0; i < options.length; i++){

    if(options[i].selected){           
        crosswalk.ramp1.surfQuality = options[i].value;             
        crosswalk.ramp2.surfQuality = options[i].value;
    }
  }

  } else {

  for (var i = 0; i < radioButtons.length; i++){
    if(radioButtons[i].checked) {

      if(localStorage.currentClickedCrosswalkRampId === crosswalk.ramp1.id){      
        crosswalk.ramp1.surface = radioButtons[i].value;
      } else if (localStorage.currentClickedCrosswalkRampId === crosswalk.ramp2.id) {        
        crosswalk.ramp2.surface = radioButtons[i].value;
      }
    }  
  }

  for (var i = 0; i < options.length; i++){

    if(options[i].selected){

      if(localStorage.currentClickedCrosswalkRampId === crosswalk.ramp1.id){      
        crosswalk.ramp1.surfQuality = options[i].value;
      } else if (localStorage.currentClickedCrosswalkRampId === crosswalk.ramp2.id) {        
        crosswalk.ramp2.surfQuality = options[i].value;
      }
    }
  }

  }

  localStorage.setItem("currentClickedCrosswalk", JSON.stringify(crosswalk));
  
  if (isTypeSelected === true){
    mainView.router.load({pageName: 'crosswalk-zebra-drivingLines'});
  } else if(localStorage.rampsAreTheSame === "false"){
    mainView.router.load({pageName: 'crosswalk-zebra-type'});
  } else {      
    mainView.router.load({pageName: 'crosswalk-ramp2'});            
  }

  handlepoints(3);
}

CrosswalkHandler.prototype._handleStripSelection = function() {

  var checkboxButtonSignalStrip = document.getElementById("crosswalk-input-signal-strip");
  var checkboxButtonWarningStrip = document.getElementById("crosswalk-input-warning-strip");
  var crosswalk = JSON.parse(localStorage.currentClickedCrosswalk);

  if(checkboxButtonSignalStrip.checked){

    if(localStorage.currentClickedCrosswalkRampId === crosswalk.ramp1.id){

      crosswalk.ramp1.isSignal = true;
    } else if (localStorage.currentClickedCrosswalkRampId === crosswalk.ramp2.id) {

      crosswalk.ramp2.isSignal = true;
    }

  } else {
    if(localStorage.currentClickedCrosswalkRampId === crosswalk.ramp1.id){

      crosswalk.ramp1.isSignal = false;
    } else if (localStorage.currentClickedCrosswalkRampId === crosswalk.ramp2.id) {

      crosswalk.ramp2.isSignal = false;
    }
  }

  if(checkboxButtonWarningStrip.checked){

    if(localStorage.currentClickedCrosswalkRampId === crosswalk.ramp1.id){

      crosswalk.ramp1.isWarning = true;
    } else if (localStorage.currentClickedCrosswalkRampId === crosswalk.ramp2.id) {

      crosswalk.ramp2.isWarning = true;
    }    
  } else {
    if(localStorage.currentClickedCrosswalkRampId === crosswalk.ramp1.id){

      crosswalk.ramp1.isWarning = false;
    } else if (localStorage.currentClickedCrosswalkRampId === crosswalk.ramp2.id) {

      crosswalk.ramp2.isWarning = false;
    }
  }

  localStorage.setItem("currentClickedCrosswalk", JSON.stringify(crosswalk));
  handlepoints(4);    

}


CrosswalkHandler.prototype._handleMeasureTypeSelection = function() {

  if (this.checked) {
    var button = document.getElementById("button-crosswalk-select-curb");
    button.classList.remove("disabled");    

    localStorage.setItem("currentClickedCrosswalkCurbMeasureType", this.value);

  } 
  
}

CrosswalkHandler.prototype._saveCurbHeight = function() {

  var optionsMeter = document.getElementsByClassName("crosswalk-curb-option-meter");
  var optionsCreditcard = document.getElementsByClassName("crosswalk-curb-option-creditcard");
  var optionsFeet = document.getElementsByClassName("crosswalk-curb-option-feet");
  var value;
  var unit;


  if(localStorage.currentClickedCrosswalkCurbMeasureType === "meter"){

    for (var i = 0; i < optionsMeter.length; i++){

      if(optionsMeter[i].selected){
        unit = optionsMeter[i].value;
      }
    }

    value = document.getElementById("crosswalk-curb-input-meter").value;

  } else if (localStorage.currentClickedCrosswalkCurbMeasureType === "creditcard") {

    for (var i = 0; i < optionsCreditcard.length; i++){

      if(optionsCreditcard[i].selected){
        unit = optionsCreditcard[i].value;
      }
    }

    value = document.getElementById("crosswalk-curb-input-creditcard").value;


  } else if (localStorage.currentClickedCrosswalkCurbMeasureType === "feet") {

    for (var i = 0; i < optionsFeet.length; i++){

      if(optionsFeet[i].selected){
        unit = optionsFeet[i].value;
      }
    }

    value = document.getElementById("crosswalk-curb-input-feet").value;

  }

  var curbHeight = value*unit;
  
  var crosswalk = JSON.parse(localStorage.currentClickedCrosswalk);

  if(localStorage.currentClickedCrosswalkRampId === crosswalk.ramp1.id){
    crosswalk.ramp1.curbHeight = Math.round(curbHeight);
  } else if (localStorage.currentClickedCrosswalkRampId === crosswalk.ramp2.id) {
    crosswalk.ramp2.curbHeight = Math.round(curbHeight);
  }

  localStorage.setItem("currentClickedCrosswalk", JSON.stringify(crosswalk));
 
  validateCrosswalkForm();
  handlepoints(5);

}

CrosswalkHandler.prototype._showMeterDiv = function() {

  var div1 = document.getElementById("crosswalk_meter_div");
  var div2 = document.getElementById("crosswalk_creditcard_div");
  var div3 = document.getElementById("crosswalk_feet_div");
  
  if (this.checked) {

    div1.style.display = 'block';
    div2.style.display = 'none';
    div3.style.display = 'none';
  }
  
}

CrosswalkHandler.prototype._showCreditcardDiv = function() {

  var div1 = document.getElementById("crosswalk_meter_div");
  var div2 = document.getElementById("crosswalk_creditcard_div");
  var div3 = document.getElementById("crosswalk_feet_div");
  
  if (this.checked) {

    div1.style.display = 'none';
    div2.style.display = 'block';
    div3.style.display = 'none';
  }
}

CrosswalkHandler.prototype._showFeetDiv = function() {

  var div1 = document.getElementById("crosswalk_meter_div");
  var div2 = document.getElementById("crosswalk_creditcard_div");
  var div3 = document.getElementById("crosswalk_feet_div");
  
  if (this.checked) {

    div1.style.display = 'none';
    div2.style.display = 'none';
    div3.style.display = 'block';
  }
}


CrosswalkHandler.prototype._handleRampTypeSelection = function() {
 if (this.checked) {
  var button = document.getElementById("button-crosswalk-select-rampType");
  button.classList.remove("disabled");    
  
  localStorage.setItem("currentClickedCrosswalkRampType", this.value);

  var crosswalk = JSON.parse(localStorage.currentClickedCrosswalk);

  if(localStorage.currentClickedCrosswalkRampId === crosswalk.ramp1.id){
    crosswalk.ramp1.type = this.value;
  } else if (localStorage.currentClickedCrosswalkRampId === crosswalk.ramp2.id) {
    crosswalk.ramp2.type = this.value;
  }

  localStorage.setItem("currentClickedCrosswalk", JSON.stringify(crosswalk));
  localStorage.setItem("rampsAreTheSame", true);
  isTypeSelected = false;
  handlepoints(2);
  
}
}

CrosswalkHandler.prototype._continueToNextPage = function() {


  if(localStorage.currentClickedCrosswalkRampType === "barrier"){

    mainView.router.load({pageName: 'crosswalk-curb'});
    
  }

}


CrosswalkHandler.prototype._enableSurfaceButton = function() {

 if (this.checked) {  
  var button = document.getElementById("button-crosswalk-select-surface");
  button.classList.remove("disabled");    
    //localStorage.setItem("currentClickedCornerShape", this.value);
  }
}



var crossH = new CrosswalkHandler();


var ObstacleHandler = function() {

  var buttonMapPosition = document.getElementById("button-obstacle-select-map-position");
  var buttonPosition = document.getElementById("button-obstacle-select-position");
  var buttonPassableWidth = document.getElementById("button-obstacle-select-passable-width");
  var buttonType = document.getElementById("button-obstacle-select-type");
  var buttonDimensions = document.getElementById("button-obstacle-select-dimensions");

  var radioButtonsType = document.getElementsByName("obstacle-type-radio");
  var radioButtonsMeasureType = document.getElementsByName("obstacle-dimensions-radio");

  var radioButtonMeter = document.getElementById("obstacle_card_meter");
  var radioButtonCreditcard = document.getElementById("obstacle_card_creditcard");
  var radioButtonFeet = document.getElementById("obstacle_card_feet");

  var buttonTemporaryNo = document.getElementById("button-obstacle-durability-no");
  var buttonTemporaryYes = document.getElementById("button-obstacle-durability-yes");
  var buttonDurability = document.getElementById("button-obstacle-select-durability");
  var buttonCamera = document.getElementById("button-obstacle-camera");
  var buttonConfirm = document.getElementById("button-obstacle-confirm");

  for (var i = 0; i < radioButtonsType.length; i++){
    radioButtonsType[i].addEventListener('change', this._enableContinueButton1, false);
  }

  for (var i = 0; i < radioButtonsMeasureType.length; i++){
    radioButtonsMeasureType[i].addEventListener('change', this._enableContinueButton2, false);
  }

  if(buttonCamera != null){
    buttonCamera.addEventListener('click', this._handleCameraImage.bind(this), false);
  }

  if(buttonConfirm != null){
    buttonConfirm.addEventListener('click', this._handleModal.bind(this), false);
  }

  if(buttonDurability!= null){
    buttonDurability.addEventListener('click', this._handleDurability.bind(this), false);
  }

  if(buttonTemporaryYes != null){
    buttonTemporaryYes.addEventListener('click', this._handleTemporaryObstacle.bind(this), false);
  }

  if(buttonTemporaryNo != null){
    buttonTemporaryNo.addEventListener('click', this._handlePermanentObstacle.bind(this), false);
  }

  if(buttonMapPosition != null){
    buttonMapPosition.addEventListener('click', this._handleMapPosition.bind(this), false);
  }

  if(buttonPosition != null){
    buttonPosition.addEventListener('click', this._handlePosition.bind(this), false);
  }

  if(buttonPassableWidth != null){
    buttonPassableWidth.addEventListener('click', this._handlePassableWidth.bind(this), false);
  }

  if(buttonType != null){
    buttonType.addEventListener('click', this._handleType.bind(this), false);
  }

  if(buttonDimensions != null){
    buttonDimensions.addEventListener('click', this._handleDimensions.bind(this), false);
  }


  if (radioButtonMeter != null) {
    radioButtonMeter.addEventListener('change', this._showMeterDiv, false);
  }


  if (radioButtonCreditcard != null) {
    radioButtonCreditcard.addEventListener('change', this._showCreditcardDiv, false);
  }

  if (radioButtonFeet != null) {
    radioButtonFeet.addEventListener('change', this._showFeetDiv, false);

  }

  rangeSlider();

  myApp.onPageInit('obstacle-recapitul', function (page) {
    initMapObstaclePosition();    
    //showObstacleEnteredData();
    //fetchObstaclePhoto();
  })

  var obstaclePhoto= document.getElementById("obstacle-photo-input");

  if(obstaclePhoto != null){
    obstaclePhoto.addEventListener('change', this._handlePhotoSaving, false);
  }

}

var obstacleMap;

ObstacleHandler.prototype._handleCameraImage = function() {

  var obstacle = JSON.parse(localStorage.currentClickedObstacle);
  
  if(obstacle.imageUrl === null){

    alert("Vyfoťte nebo nahrajte fotku překážky.");      

  } else {
    mainView.router.load({pageName: 'obstacles-dimensions'});
  }

  handlepoints(5);
}

ObstacleHandler.prototype._handleModal = function() {
  myApp.modal({
    title:  '<span class="modal-title">Nahráli jste <br><span id="obstacle-gained-points" class="modal-points"></span><br><span id="obstacle-gained-points-unit"></span></span>',
    text: '<span class="modal-thank">a pomohli jste hendikepovaným<br>lidem s bezpečnou navigací.<br><br>Ďekujeme.</span>',
    verticalButtons: true,
    buttons: [
    {
      text: 'Sdílet',
      onClick: function() {
        var obstacles = JSON.parse(localStorage.obstacleMarkers);
        var obstacle = JSON.parse(localStorage.currentClickedObstacle);
        var firstTimeObstacle = true;

        obstacles.forEach( function (marker)
        {
          if (marker.id === obstacle.id) {
            marker = obstacle;
            marker.validationNumber = Number(marker.validationNumber) + 1;
            firstTimeObstacle = false; 
          }
        });

        if (firstTimeObstacle === true){
          obstacle.validationNumber = Number(obstacle.validationNumber) + 1;
          obstacles.push(obstacle)
        }


        localStorage.setItem("obstacleMarkers", JSON.stringify(obstacles));
        localStorage.setItem("obstacleDropId", obstacle.id);

        if(localStorage.obstacleStatus === "check"){
          localStorage.setItem("obstacleChecked", "true");
        } else if (localStorage.obstacleStatus === "collection"){
          localStorage.setItem("obstacleAdded", "true");
        }

        writePoints();
        window.location.href = "https://www.facebook.com/sharer/sharer.php?u=example.org";
      }
    },
    {
      text: 'Pokračovat',
      onClick: function() {

        var obstacles = JSON.parse(localStorage.obstacleMarkers);
        var obstacle = JSON.parse(localStorage.currentClickedObstacle);
        var firstTimeObstacle = true;

        if (firstTimeObstacle === true){
          obstacle.validationNumber = Number(obstacle.validationNumber) + 1;
          obstacles.push(obstacle);
        }


        localStorage.setItem("obstacleMarkers", JSON.stringify(obstacles));
        localStorage.setItem("obstacleDropId", obstacle.id);

        if(localStorage.obstacleStatus === "check"){
          localStorage.setItem("obstacleChecked", "true");
        } else if (localStorage.obstacleStatus === "collection"){
          localStorage.setItem("obstacleAdded", "true");
        }    
        
        writePoints();
        window.location.href = "index.html";
      }
    },
    {
      text: '<span class="modal-exit">Zrušit</span>',
      onClick: function() {
        mainView.router.back("obstacle-recapitul");
      }
    },      
    ]
  })

  var showPoints = document.getElementById("obstacle-gained-points");
  var pointUnits = document.getElementById("obstacle-gained-points-unit");

  var gainedPoints = JSON.parse(localStorage.gamePointsCollection);

  showPoints.innerHTML = gainedPoints;

  if(Number(gainedPoints) > 4){
    pointUnits.innerHTML = "bodů";
  } else {
    pointUnits.innerHTML = "body";
  }
}


ObstacleHandler.prototype._handlePhotoSaving = function() {
  var obstacle = JSON.parse(localStorage.currentClickedObstacle);
  var result = document.getElementById('obstacle-res');
  var img = document.getElementById('obstacle-photo');


  var file = this.files[0];
  if (file.type.indexOf('image') < 0) {
    result.innerHTML = 'invalid type';
    return;
  }
  var fReader = new FileReader();
  fReader.onload = function() {
    img.src = fReader.result;
    obstacle.imageUrl = fReader.result;
    localStorage.setItem("currentClickedObstacle", JSON.stringify(obstacle));       
  };

  fReader.readAsDataURL(file); 

};



function fetchObstaclePhoto () {

  var obstacle = JSON.parse(localStorage.currentClickedObstacle);  
  var bg_image = document.getElementsByClassName('fit-image');
  
  if(obstacle.imageUrl === null){
    bg_image[0].style.backgroundImage = 'url(img/camera.png)';
  } else {
    bg_image[0].style.backgroundImage = 'url(' + obstacle.imageUrl + ')';
  }
  
}


function initMapObstaclePosition() {

  var obstacle = JSON.parse(localStorage.currentClickedObstacle);

  var map = new google.maps.Map(document.getElementById('map-canvas-obstacle-position'), {
    zoom: 17,
    center: obstacle.points,
    disableDefaultUI: true,
    styles: mapStyle
  });

  var image = {
    url: 'img/obstacle_pin.png',
    size: new google.maps.Size(43, 68),    
    origin: new google.maps.Point(0, 0),    
    anchor: new google.maps.Point(21.5, 68)
  };

  var shape = {
    coords: [1, 1, 1, 20, 18, 20, 18, 1],
    type: 'poly'
  };

  
  var marker = new google.maps.Marker({
    position: obstacle.points,
    map: map,
    icon: image,
    shape: shape,      
    zIndex: 2
  });  

}

function showObstacleEnteredData() {

  var r_obstacleType = document.getElementById("rec-obstacle-type");
  var r_obstaclePosition = document.getElementById("rec-obstacle-position");
  var r_obstaclePassableWidth = document.getElementById("rec-obstacle-passableWidth");
  var r_obstacleDimensionsWidth = document.getElementById("rec-obstacle-dimensions-width");
  var r_obstacleDimensionsLength = document.getElementById("rec-obstacle-dimensions-length");
  var r_obstacleIsTemporary = document.getElementById("rec-obstacle-istemporary");
  var r_obstacleDurability = document.getElementById("rec-obstacle-durability-label");
  var r_obstacleDurabilityValue = document.getElementById("rec-obstacle-durability-value");
  
  var obstacle = JSON.parse(localStorage.currentClickedObstacle);

  var r_obstacleValidationNumber = document.getElementById("rec-obstacle-validation-status");
  var r_obstacleValidationNumberColor = document.getElementById("obstacleValidationNumber-color");

  
  if(r_obstacleValidationNumber != null){
    switch (obstacle.validationNumber) {
    case 1:
    r_obstacleValidationNumber.innerHTML = "červená";
    setValidationLevel(r_obstacleValidationNumberColor, "červená");
    break; 
    case 2:
    r_obstacleValidationNumber.innerHTML = "červená";
    setValidationLevel(r_obstacleValidationNumberColor, "červená");
    break;
    case 3:
    r_obstacleValidationNumber.innerHTML = "oranžová";
    setValidationLevel(r_obstacleValidationNumberColor, "oranžová");
    break;
    case 4:
    r_obstacleValidationNumber.innerHTML = "oranžová";
    setValidationLevel(r_obstacleValidationNumberColor, "oranžová");
    break;
    case 5:
    r_obstacleValidationNumber.innerHTML = "zelená";
    setValidationLevel(r_obstacleValidationNumberColor, "zelená");
    break;
    default:
    r_obstacleValidationNumber.innerHTML = "zelená";
    setValidationLevel(r_obstacleValidationNumberColor, "zelená");
    break;   
  }
  }

  switch (obstacle.type) {
    case "hole":
    r_obstacleType.innerHTML = "díra v chodníku";
    break; 
    case "pit":
    r_obstacleType.innerHTML = "výkopové práce";
    break;
    case "terrace":
    r_obstacleType.innerHTML = "terasa";
    break; 
    case "trashbin":
    r_obstacleType.innerHTML = "odpadkový koš";
    break;
    case "tree":
    r_obstacleType.innerHTML = "strom";
    break; 
    case "bench":
    r_obstacleType.innerHTML = "lavička";
    break;
    case "light":
    r_obstacleType.innerHTML = "osvětlení";
    break; 
    case "sign":
    r_obstacleType.innerHTML = "dopravní značení";
    break;
    case "pole":
    r_obstacleType.innerHTML = "sloup";
    break; 
    case "fence":
    r_obstacleType.innerHTML = "oplocení / zábradlí";
    break;
    case "station":
    r_obstacleType.innerHTML = "zastávka";
    break;
    case "machine":
    r_obstacleType.innerHTML = "automat";
    break;
    default:
    r_obstacleType.innerHTML = obstacle.type;      
  }
  

  switch (obstacle.position) {
    case "left":
    r_obstaclePosition.innerHTML = "nalevo";
    break; 
    case "right":
    r_obstaclePosition.innerHTML = "napravo";
    break;
    case "center":
    r_obstaclePosition.innerHTML = "uprostřed";
    break;    
  }


  if(obstacle.width === null && obstacle.length === null){
    r_obstacleDimensionsWidth.innerHTML = "";
    r_obstacleDimensionsLength.innerHTML = "-";

  } else {    

    r_obstacleDimensionsWidth.innerHTML = obstacle.width + " x ";
    r_obstacleDimensionsLength.innerHTML = obstacle.length + " cm";
  }

  r_obstaclePassableWidth.innerHTML = obstacle.passableWidth + "%";


  switch (obstacle.isTemporary) {
    case false:
    r_obstacleIsTemporary.innerHTML = "trvalá překážka";
    break; 
    case true:
    r_obstacleIsTemporary.innerHTML = "dočasná překážka";      
    break;        
  }

  switch (obstacle.durability) {
    case "3":        
    r_obstacleDurability.innerHTML = "Zkontrolovat o: ";
    r_obstacleDurabilityValue.innerHTML = "3 dny";
    break; 
    case "7":
    r_obstacleDurability.innerHTML = "Zkontrolovat o: ";
    r_obstacleDurabilityValue.innerHTML = "týden";
    break;
    case "30":
    r_obstacleDurability.innerHTML = "Zkontrolovat o: ";
    r_obstacleDurabilityValue.innerHTML = "měsíc";
    break;
    case "90":
    r_obstacleDurability.innerHTML = "Zkontrolovat o: ";
    r_obstacleDurabilityValue.innerHTML = "tři měsíce";
    break;
    case "180":
    r_obstacleDurability.innerHTML = "Zkontrolovat o: ";
    r_obstacleDurabilityValue.innerHTML = "půl roku";
    break;
    case "360":
    r_obstacleDurability.innerHTML = "Zkontrolovat o: ";
    r_obstacleDurabilityValue.innerHTML = "rok";
    break;
    case "365":
    r_obstacleDurability.innerHTML = "Zkontrolovat o: ";
    r_obstacleDurabilityValue.innerHTML = "více než rok";
    break;
    case null:
    r_obstacleDurability.innerHTML = "";
    r_obstacleDurabilityValue.innerHTML = "";
    break;        
  }
  
}

ObstacleHandler.prototype._handleDurability = function() {

  var obstacle = JSON.parse(localStorage.currentClickedObstacle);

  var options = document.getElementsByClassName("obstacle-durability");
  
  for (var i = 0; i < options.length; i++){

    if(options[i].selected){
      obstacle.durability = options[i].value;
    }
  }  

  localStorage.setItem("currentClickedObstacle", JSON.stringify(obstacle));

  showObstacleEnteredData();
  fetchObstaclePhoto();
  handlepoints(3);
  
};

ObstacleHandler.prototype._handleTemporaryObstacle = function() {

  var obstacle = JSON.parse(localStorage.currentClickedObstacle);
  obstacle.isTemporary = true;  
  localStorage.setItem("currentClickedObstacle", JSON.stringify(obstacle));  
  handlepoints(2);
  
};

ObstacleHandler.prototype._handlePermanentObstacle = function() {

  var obstacle = JSON.parse(localStorage.currentClickedObstacle);
  obstacle.isTemporary = false;
  obstacle.durability = null;
  
  localStorage.setItem("currentClickedObstacle", JSON.stringify(obstacle));
  
  showObstacleEnteredData();
  fetchObstaclePhoto();
  handlepoints(2);
  
};

function validateObstacleForm () {
  var aMeter =document.getElementById("obstacle-dimensions-input-meter-length").value;
  var bMeter =document.getElementById("obstacle-dimensions-input-meter-width").value;


  var aCredit =document.getElementById("obstacle-dimensions-input-creditcard-length").value;
  var bCredit =document.getElementById("obstacle-dimensions-input-creditcard-width").value;


  var aFeet =document.getElementById("obstacle-dimensions-input-feet-length").value;
  var bFeet =document.getElementById("obstacle-dimensions-input-feet-width").value;   


  var button = document.getElementById("button-obstacle-select-dimensions");



  if(localStorage.currentClickedObstacleDimensionsMeasureType === "meter"){

    if (aMeter !=null && aMeter !="" && bMeter !=null && bMeter !="")
    {   
     mainView.router.load({pageName: 'obstacle-durability'});
   } else {        
    alert("Zadejte prosím šířku a délku překážky.");
  }

} else if (localStorage.currentClickedObstacleDimensionsMeasureType === "creditcard"){

  if (aCredit !=null && aCredit !="" && bCredit !=null && bCredit !="")
  {   
   mainView.router.load({pageName: 'obstacle-durability'});
 } else {        
  alert("Zadejte prosím šířku a délku překážky.");
}

} else if (localStorage.currentClickedObstacleDimensionsMeasureType === "feet"){

  if (aFeet !=null && aFeet !="" && bFeet !=null && bFeet !="")
  {   
   mainView.router.load({pageName: 'obstacle-durability'});
 } else {
  alert("Zadejte prosím šířku a délku překážky.");
}

}   

}

ObstacleHandler.prototype._handleDimensions = function() {

  var optionsMeterWidth = document.getElementsByClassName("obstacle-dimensions-option-meter-width");
  var optionsMeterLength = document.getElementsByClassName("obstacle-dimensions-option-meter-length");
  var optionsCreditcardWidth = document.getElementsByClassName("obstacle-dimensions-option-creditcard-width");
  var optionsCreditcardLength = document.getElementsByClassName("obstacle-dimensions-option-creditcard-length");
  var optionsFeetWidth = document.getElementsByClassName("obstacle-dimensions-option-feet-width");
  var optionsFeetLegth = document.getElementsByClassName("obstacle-dimensions-option-feet-length");
  var valueWidth;
  var valueLength;
  var unitWidth;
  var unitLength;


  if(localStorage.currentClickedObstacleDimensionsMeasureType === "meter"){

    for (var i = 0; i < optionsMeterWidth.length; i++){

      if(optionsMeterWidth[i].selected){
        unitWidth = optionsMeterWidth[i].value;
      }
    }

    for (var i = 0; i < optionsMeterLength.length; i++){

      if(optionsMeterLength[i].selected){
        unitLength = optionsMeterLength[i].value;
      }
    }

    valueWidth = document.getElementById("obstacle-dimensions-input-meter-width").value;
    valueLength = document.getElementById("obstacle-dimensions-input-meter-length").value;


  } else if (localStorage.currentClickedObstacleDimensionsMeasureType === "creditcard") {

    for (var i = 0; i < optionsCreditcardWidth.length; i++){

      if(optionsCreditcardWidth[i].selected){
        unitWidth = optionsCreditcardWidth[i].value;
      }
    }

    for (var i = 0; i < optionsCreditcardLength.length; i++){

      if(optionsCreditcardLength[i].selected){
        unitLength = optionsCreditcardLength[i].value;
      }
    }

    valueWidth = document.getElementById("obstacle-dimensions-input-creditcard-width").value;
    valueLength = document.getElementById("obstacle-dimensions-input-creditcard-length").value;


  } else if (localStorage.currentClickedObstacleDimensionsMeasureType === "feet") {

    for (var i = 0; i < optionsFeetWidth.length; i++){

      if(optionsFeetWidth[i].selected){
        unitWidth = optionsFeetWidth[i].value;
      }
    }

    for (var i = 0; i < optionsFeetLegth.length; i++){

      if(optionsFeetLegth[i].selected){
        unitLength = optionsFeetLegth[i].value;
      }
    }

    valueWidth = document.getElementById("obstacle-dimensions-input-feet-width").value;
    valueLength = document.getElementById("obstacle-dimensions-input-feet-length").value;

  }

  var width = valueWidth*unitWidth;
  var length = valueLength*unitLength;  
  
  var obstacle = JSON.parse(localStorage.currentClickedObstacle);

  obstacle.width = Math.round(width);
  obstacle.length = Math.round(length);  

  localStorage.setItem("currentClickedObstacle", JSON.stringify(obstacle));
  
  validateObstacleForm();

  handlepoints(8); 

}

ObstacleHandler.prototype._showMeterDiv = function() {

  var div1 = document.getElementById("obstacle_meter_div");
  var div2 = document.getElementById("obstacle_creditcard_div");
  var div3 = document.getElementById("obstacle_feet_div");
  
  if (this.checked) {

    div1.style.display = 'block';
    div2.style.display = 'none';
    div3.style.display = 'none';
  }
  
}

ObstacleHandler.prototype._showCreditcardDiv = function() {

  var div1 = document.getElementById("obstacle_meter_div");
  var div2 = document.getElementById("obstacle_creditcard_div");
  var div3 = document.getElementById("obstacle_feet_div");
  
  if (this.checked) {

    div1.style.display = 'none';
    div2.style.display = 'block';
    div3.style.display = 'none';
  }
}

ObstacleHandler.prototype._showFeetDiv = function() {

  var div1 = document.getElementById("obstacle_meter_div");
  var div2 = document.getElementById("obstacle_creditcard_div");
  var div3 = document.getElementById("obstacle_feet_div");
  
  if (this.checked) {

    div1.style.display = 'none';
    div2.style.display = 'none';
    div3.style.display = 'block';
  }
}


ObstacleHandler.prototype._enableContinueButton2 = function(){

  localStorage.setItem("currentClickedObstacleDimensionsMeasureType", this.value);
  var button = document.getElementById("button-obstacle-select-dimensions");
  button.classList.remove("disabled");

}

ObstacleHandler.prototype._enableContinueButton1 = function(){

  var button = document.getElementById("button-obstacle-select-type");
  button.classList.remove("disabled"); 

}

ObstacleHandler.prototype._handleType = function() {

  var obstacle = JSON.parse(localStorage.currentClickedObstacle);
  var radios = document.getElementsByName("obstacle-type-radio");
  var input = document.getElementById("obstacle-type-input").value;
  
  for (var i = 0; i < radios.length; i++){

    if(radios[i].checked){
      if(radios[i].value === "other"){
        obstacle.type = document.getElementById("obstacle-type-input").value;
        if(input == null || input ==""){
          alert("Vyplnte prosím pole pro zadání typu překážky.");
        } else {
          mainView.router.load({pageName: 'obstacle-camera'});
        }
      } else {          
        obstacle.type = radios[i].value;
        mainView.router.load({pageName: 'obstacle-camera'});
      }        
    }
  }   

  localStorage.setItem("currentClickedObstacle", JSON.stringify(obstacle));
  handlepoints(2);
  
};

ObstacleHandler.prototype._handlePassableWidth = function() {

  var obstacle = JSON.parse(localStorage.currentClickedObstacle);
  var slider = document.getElementById("range-slider-actualValue");
  obstacle.passableWidth = slider.innerText;
  localStorage.setItem("currentClickedObstacle", JSON.stringify(obstacle));

  handlepoints(3); 

};

ObstacleHandler.prototype._handlePosition = function() {

  var obstacle = JSON.parse(localStorage.currentClickedObstacle);
  var options = document.getElementsByClassName("obstacle-position-option");
  var image= document.getElementById("obstacle-passable-width-image");
  //var image = document.createElement('img');
  
  for (var i = 0; i < options.length; i++){

    if(options[i].selected){               
      obstacle.position = options[i].value;
      if(options[i].value === "left"){
        image.src ="img/slider_image2.png";
      } else if (options[i].value === "right"){
        image.src ="img/slider_image.png";
      } else {
        image.src ="img/slider_image3.png";
      }        
    }

  }

  handlepoints(3);

  localStorage.setItem("currentClickedObstacle", JSON.stringify(obstacle));
  
};


ObstacleHandler.prototype._handleMapPosition = function() {

  var obstacle = JSON.parse(localStorage.currentClickedObstacle);

  obstacle.id = ""+obstacleMap.getCenter().lat()+obstacleMap.getCenter().lng();
  obstacle.points = {lat: obstacleMap.getCenter().lat(), lng: obstacleMap.getCenter().lng()},

  localStorage.setItem("currentClickedObstacle", JSON.stringify(obstacle));

  handlepoints(4);
};



function initObstacleMap() {

  obstacleMap = new google.maps.Map(document.getElementById('map-canvas-obstacle'), {
    zoom: 18,
    center: {lat: 50.077845, lng: 14.418859},
    disableDefaultUI: true,
    styles: mapStyle
  });


  for (var i = 0; i < sidewalks.length; i++) {

    let sidewalk = sidewalks[i];
    var sidewalkPath = new google.maps.Polyline({
      path: sidewalk.points,
      geodesic: true,
      strokeColor: "#7f7f7f",
      strokeOpacity: 0.5,
      strokeWeight: 6,
      clickable: true,
      zIndex: 1
    });
    sidewalkPath.setMap(obstacleMap);   
    
  } 

  getCurrentPosition(obstacleMap);

}

var rangeSlider = function(){
  var slider = $$('.range-slider'),
  range = $$('.range-slider-range'),
  value = $$('.range-slider-value');

  slider.each(function(){

    value.each(function(){
      var value = $$(this).prev().attr('value');
      $$(this).html(value);
    });

    range.on('input', function(){
      $$(this).next(value).html(this.value);
    });
  });
};


var obstacleH = new ObstacleHandler();
///////////////////////////////////////////////////////////////////////////////////////////////////////

var MenuHandler = function (){
  var linkObstacle = document.getElementById("link-obstacle");

  if(linkObstacle != null){
    linkObstacle.addEventListener('click', this._linkObstacleWizard.bind(this), false);
  }

  
}

MenuHandler.prototype._linkObstacleWizard = function() {
  var obstacle = {  
    "id": null,
    "zindex": null,
    "validationNumber": 0,
    "points": null,
    "position": null,
    "passableWidth": null,
    "type": null,
    "imageUrl": null,
    "width": null,
    "length": null,
    "isTemporary": null,
    "durability": null,                
  } 

  localStorage.setItem("currentClickedObstacle", JSON.stringify(obstacle));
  localStorage.setItem("obstacleStatus", "collection");
  window.location.href = "obstacle.html";
};

var menuH = new MenuHandler();

var SidewalkHandler = function (){

  var radioButtonMeter = document.getElementById("sidewalk_card_meter");
  var radioButtonCreditcard = document.getElementById("sidewalk_card_creditcard");
  var radioButtonFeet = document.getElementById("sidewalk_card_feet");
  var radioButtonsWidth = document.getElementsByName("sidewalk-width-radio");
  var radioButtonsLongiSlope = document.getElementsByName("sidewalk-longiSlope-radio");
  var radioButtonsLongiUpSlope = document.getElementsByName("sidewalk-longiSlope-up-radio");
  var radioButtonsSideSlope = document.getElementsByName("sidewalk-sideSlope-radio");
  var radioButtonsSurface = document.getElementsByName("sidewalk-surface-radio");
  var radioButtonsRightVicinity = document.getElementsByName("sidewalk-vicinityRight-radio");
  var radioButtonsLeftVicinity = document.getElementsByName("sidewalk-vicinityLeft-radio");
  
  var buttonSlope = document.getElementById("button-sidewalk-select-slope");
  var radioButtons = document.getElementsByName("corner-shape-radio");
  var buttonWidth = document.getElementById("button-sidewalk-select-width");
  var buttonLongiSlope = document.getElementById("button-sidewalk-select-longiSlope-size");
  var buttonLongiUpSlope = document.getElementById("button-sidewalk-select-longiSlope-size-up");
  var buttonSideSlope = document.getElementById("button-sidewalk-select-sideSlope-size");
  var buttonSurface = document.getElementById("button-sidewalk-select-surface");
  var buttonVicinity = document.getElementById("button-sidewalk-select-vicinity");
  var buttonConfirm = document.getElementById("button-sidewalk-confirm");
  var buttonVicinitySkip = document.getElementById("button-sidewalk-select-vicinity-skip");
  var buttonConfirmValidation = document.getElementById("button-sidewalk-validation-confirm");
  
  if (buttonConfirmValidation != null) {
    buttonConfirmValidation.addEventListener('click', this._showModal, false);
  }


  if (buttonConfirm != null) {
    buttonConfirm.addEventListener('click', this._showModal, false);
  }

  if (buttonVicinitySkip != null) {
    buttonVicinitySkip.addEventListener('click', this._handleData, false);
  }

  if (buttonVicinity != null) {
    buttonVicinity.addEventListener('click', this._handleVicinitySelection, false);
  }

  if (buttonSurface != null) {
    buttonSurface.addEventListener('click', this._handleSurfaceSelection, false);
  }

  if (buttonWidth != null) {
    buttonWidth.addEventListener('click', this._handleWidthMeasurement, false);
  }

  if (radioButtonCreditcard != null) {
    radioButtonCreditcard.addEventListener('change', this._showCreditcardDiv, false);
  }

  if (radioButtonFeet != null) {
    radioButtonFeet.addEventListener('change', this._showFeetDiv, false);

  }

  if (radioButtonMeter != null) {
    radioButtonMeter.addEventListener('change', this._showMeterDiv, false);
  }

  if(buttonSlope != null){
    buttonSlope.addEventListener('click', this._handleSlopeSelection, false);
  }

  if(buttonLongiSlope != null){
    buttonLongiSlope.addEventListener('click', this._handleLongiSlopeSelection, false);
  }

  if(buttonLongiUpSlope != null){
    buttonLongiUpSlope.addEventListener('click', this._handleLongiUpSlopeSelection, false);
  }

  if(buttonSideSlope != null){
    buttonSideSlope.addEventListener('click', this._handleSideSlopeSelection, false);
  }

  for (var i = 0; i < radioButtonsWidth.length; i++){
    radioButtonsWidth[i].addEventListener('change', this._enableContinueButton, false);
  }

  for (var i = 0; i < radioButtonsLongiSlope.length; i++){
    radioButtonsLongiSlope[i].addEventListener('change', this._enableLongiSlopeButton, false);
  }

  for (var i = 0; i < radioButtonsLongiUpSlope.length; i++){
    radioButtonsLongiUpSlope[i].addEventListener('change', this._enableLongiUpSlopeButton, false);
  }

  for (var i = 0; i < radioButtonsSideSlope.length; i++){
    radioButtonsSideSlope[i].addEventListener('change', this._enableSideSlopeButton, false);
  }

  for (var i = 0; i < radioButtonsSurface.length; i++){
    radioButtonsSurface[i].addEventListener('change', this._enableSurfaceButton, false);
  }

  for (var i = 0; i < radioButtonsRightVicinity.length; i++){
    radioButtonsRightVicinity[i].addEventListener('change', this._enableVicinityButton, false);
  }

  for (var i = 0; i < radioButtonsLeftVicinity.length; i++){
    radioButtonsLeftVicinity[i].addEventListener('change', this._enableVicinityButton, false);
  }

  myApp.onPageInit('sidewalk-recapitul', function (page) {       
    //showSideWalkEnteredData();    
  })

}


function validateSidewalkForm () {
  var meter =document.getElementById("sidewalk-width-input-meter").value;
  var credit =document.getElementById("sidewalk-width-input-creditcard").value;
  var feet =document.getElementById("sidewalk-width-input-feet").value;


  if(localStorage.currentClickedSidewalkWidthMeasureType === "meter"){

    if (meter !=null && meter !="")
    {   
     mainView.router.load({pageName: 'sidewalk-slope'});
   } else {        
    alert("Vyplnte prosím pole pro zadání šířky chodníku.");
  }

} else if (localStorage.currentClickedSidewalkWidthMeasureType === "creditcard"){

  if (credit !=null && credit !="")
  {   
   mainView.router.load({pageName: 'sidewalk-slope'});
 } else {        
  alert("Vyplnte prosím pole pro zadání počtu kreditek.");
}

} else if (localStorage.currentClickedSidewalkWidthMeasureType === "feet"){

  if (feet !=null && feet !="")
  {   
   mainView.router.load({pageName: 'sidewalk-slope'});
 } else {
  alert("Vyplnte prosím pole pro zadání počtu stop.");
}

}    
}

SidewalkHandler.prototype._handleData = function() {
  showSideWalkEnteredData();
}

function saveSidewalk() {
  var sidewalks = JSON.parse(localStorage.sidewalkMarkers);
  var sidewalk = JSON.parse(localStorage.currentClickedSidewalk);


  sidewalks.forEach( function (polyline)
  {
    if (polyline.id === sidewalk.id) {                              

      polyline.width = sidewalk.width;
      polyline.isLongi = sidewalk.isLongi;
      polyline.isSide = sidewalk.isSide;
      polyline.isLongiUp = sidewalk.isLongiUp;
      polyline.longiSize = sidewalk.longiSize;
      polyline.longiUpSize = sidewalk.longiUpSize;
      polyline.sideSize = sidewalk.sideSize;
      polyline.surface = sidewalk.surface;
      polyline.surfQuality = sidewalk.surfQuality;
      polyline.vicinityRight = sidewalk.vicinityRight;
      polyline.vicinityLeft = sidewalk.vicinityLeft;

      polyline.validationNumber = Number(polyline.validationNumber) + 1;            


      if(polyline.validationNumber == 1 || polyline.validationNumber == 2){
        polyline.color="#ec4345";
      }
      else if (polyline.validationNumber == 3 || polyline.validationNumber == 4) {
        polyline.color="#f3b01a";
      }
      else if (polyline.validationNumber > 4){
        polyline.color="#55ba47";
      } else {
        polyline.color="#424242";
      } 
    }
  });

  localStorage.setItem("sidewalkMarkers", JSON.stringify(sidewalks));
}

SidewalkHandler.prototype._showModal = function() {

  if(localStorage.sidewalkStatus === "validation"){
         handlepoints(4);
  }

  myApp.modal({
    title:  '<span class="modal-title">Nahráli jste <br><span id="sidewalk-gained-points" class="modal-points"></span><br><span id="sidewalk-gained-points-unit"></span></span>',
    text: '<span class="modal-thank">a pomohli jste hendikepovaným<br>lidem s bezpečnou navigací.<br><br>Ďekujeme.</span>',
    verticalButtons: true,
    buttons: [
    {
      text: 'Sdílet',
      onClick: function() {

        if(localStorage.sidewalkStatus === "collection"){
          localStorage.setItem("sidewalkCollected", "true");
        }

        saveSidewalk();
        writePoints();
        window.location.href = "https://www.facebook.com/sharer/sharer.php?u=example.org";

      }
    },
    {
      text: 'Pokračovat',
      onClick: function() {

        if(localStorage.sidewalkStatus === "collection"){
          localStorage.setItem("sidewalkCollected", "true");
        }

        saveSidewalk();
        writePoints();
        window.location.href = "index.html";

      }
    },
    {
      text: '<span class="modal-exit">Zrušit</span>',
      onClick: function() {
        if(localStorage.sidewalkStatus === "validation"){
         handlepoints(-4);
        }
        mainView.router.back("sidewalk-recapitul");
      }
    },      
    ]
  })

  var showPoints = document.getElementById("sidewalk-gained-points");
  var pointUnits = document.getElementById("sidewalk-gained-points-unit");

  var gainedPoints = JSON.parse(localStorage.gamePointsCollection);

  showPoints.innerHTML = gainedPoints;

  if(Number(gainedPoints) > 4){
    pointUnits.innerHTML = "bodů";
  } else {
    pointUnits.innerHTML = "body";
  }
}


var imageLongiSlope = document.createElement("img");
var imageSideSlope = document.createElement("img");
var imageLongiUpSlope = document.createElement("img");


function showSideWalkEnteredData() {

  var r_sidewalkWidth = document.getElementById("rec-sidewalk-width");
  var r_sidewalkLongiSlopeSize = document.getElementById("rec-sidewalk-longiSlope-size");
  var r_sidewalkLongiUpSlopeSize = document.getElementById("rec-sidewalk-longiUpSlope-size");
  var r_sidewalkSideSlopeSize = document.getElementById("rec-sidewalk-sideSlope-size");
  var r_sidewalkLongiSlopeCard = document.getElementById("rec-sidewalk-longiSlope");
  var r_sidewalkLongiUpSlopeCard = document.getElementById("rec-sidewalk-longiUpSlope");
  var r_sidewalkSideSlopeCard = document.getElementById("rec-sidewalk-sideSlope");
  var r_sidewalkSurface = document.getElementById("rec-sidewalk-surface");
  var r_sidewalkSurfQuality = document.getElementById("rec-sidewalk-surfQuality");
  var r_sidewalkVicinityRight = document.getElementById("rec-sidewalk-vicinityRight");
  var r_sidewalkVicinityLeft = document.getElementById("rec-sidewalk-vicinityLeft");
  var r_sidewalkValidationNumber = document.getElementById("rec-sidewalk-validation-status");

  var sidewalk = JSON.parse(localStorage.currentClickedSidewalk);

  var r_sidewalkValidationNumberColor = document.getElementById("sidewalkValidationNumber-color");

  
  

  if(r_sidewalkValidationNumber != null){
    switch (sidewalk.validationNumber) {
    case 1:
    r_sidewalkValidationNumber.innerHTML = "červená";
    setValidationLevel(r_sidewalkValidationNumberColor, "červená");
    break; 
    case 2:
    r_sidewalkValidationNumber.innerHTML = "červená";
    setValidationLevel(r_sidewalkValidationNumberColor, "červená");
    break;
    case 3:
    r_sidewalkValidationNumber.innerHTML = "oranžová";
    setValidationLevel(r_sidewalkValidationNumberColor, "oranžová");
    break;
    case 4:
    r_sidewalkValidationNumber.innerHTML = "oranžová";
    setValidationLevel(r_sidewalkValidationNumberColor, "oranžová");
    break;
    case 5:
    r_sidewalkValidationNumber.innerHTML = "zelená";
    setValidationLevel(r_sidewalkValidationNumberColor, "zelená");
    break;
    default:
    r_sidewalkValidationNumber.innerHTML = "zelená";
    setValidationLevel(r_sidewalkValidationNumberColor, "zelená");
    break;      
  }
  }

  

  r_sidewalkWidth.innerHTML = sidewalk.width + " cm";

  if(sidewalk.isLongi === true) {
    imageLongiSlope.src = 'img/slope_long_m.png';    
  } else {
    imageLongiSlope.src = 'img/slope_long_m2.png';
  }

  if(sidewalk.isLongiUp === true) {
    imageLongiUpSlope.src = 'img/slope_long_m_2.png';
  } else {
    imageLongiUpSlope.src = 'img/slope_long_m_22.png';
  }

  if(sidewalk.isSide === true) {
    imageSideSlope.src = 'img/slope_side_m.png';
  } else {
    imageSideSlope.src = 'img/slope_side_m2.png';
  }

  r_sidewalkLongiSlopeCard.appendChild(imageLongiSlope);
  r_sidewalkLongiUpSlopeCard.appendChild(imageLongiUpSlope);
  r_sidewalkSideSlopeCard.appendChild(imageSideSlope);


  switch (sidewalk.longiSize) {
    case "small":
    r_sidewalkLongiSlopeSize.innerHTML = "malý";
    break; 
    case "medium":
    r_sidewalkLongiSlopeSize.innerHTML = "střední";
    break;
    case "large":
    r_sidewalkLongiSlopeSize.innerHTML = "velký";
    default:
    r_sidewalkLongiSlopeSize.innerHTML = "-";      
  }
  
  switch (sidewalk.sideSize) {
    case "small":
    r_sidewalkSideSlopeSize.innerHTML = "malý";
    break; 
    case "medium":
    r_sidewalkSideSlopeSize.innerHTML = "střední";
    break;
    case "large":
    r_sidewalkSideSlopeSize.innerHTML = "velký";
    break;
    default:
    r_sidewalkSideSlopeSize.innerHTML = "-";      
  }

  switch (sidewalk.longiUpSize) {
    case "small":
    r_sidewalkLongiUpSlopeSize.innerHTML = "malý";
    break; 
    case "medium":
    r_sidewalkLongiUpSlopeSize.innerHTML = "střední";
    break;
    case "large":
    r_sidewalkLongiUpSlopeSize.innerHTML = "velký";
    break;
    default:
    r_sidewalkLongiUpSlopeSize.innerHTML = "-";      
  }

  switch (sidewalk.surface) {
    case "asphalt":
    r_sidewalkSurface.innerHTML = "asfalt";
    break; 
    case "smallCubes":
    r_sidewalkSurface.innerHTML = "malé kostky";
    break;
    case "bigCubes":
    r_sidewalkSurface.innerHTML = "velké kostky";
    break;
    case "stones":
    r_sidewalkSurface.innerHTML = "kamínky";
    break;
    case null:
    r_sidewalkSurface.innerHTML = "-";
    break;   
  }

  switch (sidewalk.surfQuality) {
    case "1":
    r_sidewalkSurfQuality.innerHTML = "velmi dobrá";
    break; 
    case "2":
    r_sidewalkSurfQuality.innerHTML = "dobrá";
    break;
    case "3":
    r_sidewalkSurfQuality.innerHTML = "špatná";
    break;
    case null:
    r_sidewalkSurfQuality.innerHTML = "-";
    break;       
  }


  switch (sidewalk.vicinityRight) {
    case "buildings":
    r_sidewalkVicinityRight.innerHTML = "budovy";
    break; 
    case "road":
    r_sidewalkVicinityRight.innerHTML = "vozovka";
    break;
    case "greenery":
    r_sidewalkVicinityRight.innerHTML = "zeleň";
    break;
    case null:
    r_sidewalkVicinityRight.innerHTML = "-";
    break;
    default:
    r_sidewalkVicinityRight.innerHTML = sidewalk.vicinityRight;
    break;

  }

  switch (sidewalk.vicinityLeft) {
    case "buildings":
    r_sidewalkVicinityLeft.innerHTML = "budovy";
    break; 
    case "road":
    r_sidewalkVicinityLeft.innerHTML = "vozovka";
    break;
    case "greenery":
    r_sidewalkVicinityLeft.innerHTML = "zeleň";
    break;
    case null:
    r_sidewalkVicinityLeft.innerHTML = "-";
    break;
    default :
    r_sidewalkVicinityLeft.innerHTML = sidewalk.vicinityLeft;
    break;       
  }  
  
  
}


var sidewalkVicinityRight;
var sidewalkVicinityLeft;

SidewalkHandler.prototype._enableVicinityButton = function() {  

  if(this.name === "sidewalk-vicinityRight-radio"){
    if (this.checked) {
      sidewalkVicinityRight = true;
    }
  } else if (this.name === "sidewalk-vicinityLeft-radio"){
    if (this.checked) {
      sidewalkVicinityLeft = true;
    }
  }

  if (sidewalkVicinityRight === true && sidewalkVicinityLeft === true){
    var button = document.getElementById("button-sidewalk-select-vicinity");
    button.classList.remove("disabled");
  }  
}


SidewalkHandler.prototype._handleVicinitySelection = function() {

  var sidewalk = JSON.parse(localStorage.currentClickedSidewalk);
  var radiosRight = document.getElementsByName("sidewalk-vicinityRight-radio");
  var radiosLeft = document.getElementsByName("sidewalk-vicinityLeft-radio");
  
  for (var i = 0; i < radiosRight.length; i++){

    if(radiosRight[i].checked){
      if(radiosRight[i].value === "other"){
        sidewalk.vicinityRight = document.getElementById("sidewalk-vicinityRight-input").value;
      } else {          
        sidewalk.vicinityRight = radiosRight[i].value;
      }        
    }
  }

  for (var i = 0; i < radiosLeft.length; i++){

    if(radiosLeft[i].checked){
      if(radiosLeft[i].value === "other"){
        sidewalk.vicinityLeft = document.getElementById("sidewalk-vicinityLeft-input").value;
      } else {          
        sidewalk.vicinityLeft = radiosLeft[i].value;
      }        
    }
  }  

  localStorage.setItem("currentClickedSidewalk", JSON.stringify(sidewalk));  
  showSideWalkEnteredData();

  handlepoints(4);
};

SidewalkHandler.prototype._handleSurfaceSelection = function() {
  var radioButtons = document.getElementsByName("sidewalk-surface-radio");
  var sidewalk = JSON.parse(localStorage.currentClickedSidewalk);
  var options = document.getElementsByClassName("sidewalk-quality-option");

  for (var i = 0; i < radioButtons.length; i++){
    if(radioButtons[i].checked) {
      sidewalk.surface = radioButtons[i].value;
    }
  }


  for (var i = 0; i < options.length; i++){
    if(options[i].selected){              
      sidewalk.surfQuality = options[i].value;      
    }
  }

  localStorage.setItem("currentClickedSidewalk", JSON.stringify(sidewalk));
  
  handlepoints(3);
}

SidewalkHandler.prototype._handleSideSlopeSelection = function() {

  var sidewalk = JSON.parse(localStorage.currentClickedSidewalk);
  var radios = document.getElementsByName("sidewalk-sideSlope-radio");
  
  for (var i = 0; i < radios.length; i++){

    if(radios[i].checked){                 
      sidewalk.sideSize = radios[i].value;               
    }
  }   

  localStorage.setItem("currentClickedSidewalk", JSON.stringify(sidewalk));
 
  handlepoints(2);
  
};

SidewalkHandler.prototype._handleLongiSlopeSelection = function() {

  var sidewalk = JSON.parse(localStorage.currentClickedSidewalk);
  var radios = document.getElementsByName("sidewalk-longiSlope-radio");
  
  for (var i = 0; i < radios.length; i++){

    if(radios[i].checked){
      sidewalk.longiSize = radios[i].value;        
    }
  }   

  localStorage.setItem("currentClickedSidewalk", JSON.stringify(sidewalk));
  

  if (sidewalk.isLongiUp === true){
    mainView.router.load({pageName: 'crosswalk-longiSlopeUp'});
  } else if (sidewalk.isSide === true){
    mainView.router.load({pageName: 'crosswalk-sideSlope'});
  } else {
    mainView.router.load({pageName: 'sidewalk-surface'});
  }

  handlepoints(2);

};

SidewalkHandler.prototype._handleLongiUpSlopeSelection = function() {

  var sidewalk = JSON.parse(localStorage.currentClickedSidewalk);
  var radios = document.getElementsByName("sidewalk-longiSlope-up-radio");
  
  for (var i = 0; i < radios.length; i++){

    if(radios[i].checked){
      sidewalk.longiUpSize = radios[i].value;        
    }
  }   

  localStorage.setItem("currentClickedSidewalk", JSON.stringify(sidewalk));
 
  if (sidewalk.isSide === true){
    mainView.router.load({pageName: 'crosswalk-sideSlope'});
  } else {
    mainView.router.load({pageName: 'sidewalk-surface'});
  }

  handlepoints(2);

};

SidewalkHandler.prototype._enableSurfaceButton = function() {
  if (this.checked) {
    var button = document.getElementById("button-sidewalk-select-surface");
    button.classList.remove("disabled");
  }
}

SidewalkHandler.prototype._enableSideSlopeButton = function() {
  if (this.checked) {
    var button = document.getElementById("button-sidewalk-select-sideSlope-size");
    button.classList.remove("disabled");
  }
}

SidewalkHandler.prototype._enableLongiSlopeButton = function() {
  if (this.checked) {
    var button = document.getElementById("button-sidewalk-select-longiSlope-size");
    button.classList.remove("disabled");
  }
}

SidewalkHandler.prototype._enableLongiUpSlopeButton = function() {
  if (this.checked) {
    var button = document.getElementById("button-sidewalk-select-longiSlope-size-up");
    button.classList.remove("disabled");
  }
}

SidewalkHandler.prototype._handleWidthMeasurement = function() {

  var optionsMeter = document.getElementsByClassName("sidewalk-width-option-meter");
  var optionsCreditcard = document.getElementsByClassName("sidewalk-width-option-creditcard");
  var optionsFeet = document.getElementsByClassName("sidewalk-width-option-feet");
  var value;
  var unit;


  if(localStorage.currentClickedSidewalkWidthMeasureType === "meter"){

    for (var i = 0; i < optionsMeter.length; i++){

      if(optionsMeter[i].selected){
        unit = optionsMeter[i].value;
      }
    }

    value = document.getElementById("sidewalk-width-input-meter").value;

  } else if (localStorage.currentClickedSidewalkWidthMeasureType === "creditcard") {

    for (var i = 0; i < optionsCreditcard.length; i++){

      if(optionsCreditcard[i].selected){
        unit = optionsCreditcard[i].value;
      }
    }

    value = document.getElementById("sidewalk-width-input-creditcard").value;


  } else if (localStorage.currentClickedSidewalkWidthMeasureType === "feet") {

    for (var i = 0; i < optionsFeet.length; i++){

      if(optionsFeet[i].selected){
        unit = optionsFeet[i].value;
      }
    }

    value = document.getElementById("sidewalk-width-input-feet").value;

  }

  var width = value*unit;
  
  var sidewalk = JSON.parse(localStorage.currentClickedSidewalk);

  sidewalk.width = Math.round(width);

  localStorage.setItem("currentClickedSidewalk", JSON.stringify(sidewalk));  

  validateSidewalkForm();
  handlepoints(5);
}


SidewalkHandler.prototype._handleSlopeSelection = function() {

  var checkboxButtonLongiSlope = document.getElementById("sidewalk-input-longi-slope");
  var checkboxButtonSideSlope = document.getElementById("sidewalk-input-side-slope");
  var checkboxButtonLongiSlopeUp = document.getElementById("sidewalk-input-longi-up-slope");
  var sidewalk = JSON.parse(localStorage.currentClickedSidewalk);

  if(checkboxButtonLongiSlope.checked){    
    sidewalk.isLongi = true;
  } else {
    sidewalk.isLongi = false;
  }

  if(checkboxButtonSideSlope.checked){
    sidewalk.isSide = true;      
  } else {
    sidewalk.isSide = false;
  }

  if(checkboxButtonLongiSlopeUp.checked){
    sidewalk.isLongiUp = true;      
  } else {
    sidewalk.isLongiUp = false;
  }

  if (sidewalk.isLongi === true){
    mainView.router.load({pageName: 'crosswalk-longiSlopeDown'});
  } else if (sidewalk.isLongiUp === true){
    mainView.router.load({pageName: 'crosswalk-longiSlopeUp'});
  } else if (sidewalk.isSide === true){
    mainView.router.load({pageName: 'crosswalk-sideSlope'});
  } else {
    mainView.router.load({pageName: 'sidewalk-surface'});
  }

  localStorage.setItem("currentClickedSidewalk", JSON.stringify(sidewalk));
  handlepoints(3);
}


SidewalkHandler.prototype._enableContinueButton = function() {

  if (this.checked) {          
    var button = document.getElementById("button-sidewalk-select-width");
    button.classList.remove("disabled");
    localStorage.setItem("currentClickedSidewalkWidthMeasureType", this.value);
  }

}

SidewalkHandler.prototype._showMeterDiv = function() {

  var div1 = document.getElementById("sidewalk_meter_div");
  var div2 = document.getElementById("sidewalk_creditcard_div");
  var div3 = document.getElementById("sidewalk_feet_div");
  
  if (this.checked) {

    div1.style.display = 'block';
    div2.style.display = 'none';
    div3.style.display = 'none';
  }
  
}

SidewalkHandler.prototype._showCreditcardDiv = function() {

  var div1 = document.getElementById("sidewalk_meter_div");
  var div2 = document.getElementById("sidewalk_creditcard_div");
  var div3 = document.getElementById("sidewalk_feet_div");
  
  if (this.checked) {

    div1.style.display = 'none';
    div2.style.display = 'block';
    div3.style.display = 'none';
  }
}

SidewalkHandler.prototype._showFeetDiv = function() {

  var div1 = document.getElementById("sidewalk_meter_div");
  var div2 = document.getElementById("sidewalk_creditcard_div");
  var div3 = document.getElementById("sidewalk_feet_div");
  
  if (this.checked) {

    div1.style.display = 'none';
    div2.style.display = 'none';
    div3.style.display = 'block';
  }
}




sidewalkH = new SidewalkHandler();



var ObstacleValidationHandler = function(){
  var bodyVal = document.getElementById("obstacle-val");  
  var buttonYes = document.getElementById("button-obstacle-validation-yes");
  var buttonConfirm = document.getElementById("button-obstacle-val-durability");

  if(buttonYes != null){
    buttonYes.addEventListener('click', this._showModalDelete.bind(this), false);
  }

  if(buttonConfirm != null){
    buttonConfirm.addEventListener('click', this._showModalSave.bind(this), false);
  }


  if(bodyVal != null){
    bodyVal.onload = function(){
      showObstacleEnteredData();
      fetchObstaclePhoto();
    };
  } 

}

function deleteObstacle (){
  var obstacle = JSON.parse(localStorage.currentClickedObstacle);
  var obstacles = JSON.parse(localStorage.obstacleMarkers);


  obstacles = obstacles.filter(function(el) {
    return el.id !== obstacle.id;
  });

  localStorage.setItem("obstacleMarkers", JSON.stringify(obstacles));
  
}

function saveObstacle (){
  var obstacle = JSON.parse(localStorage.currentClickedObstacle);
  var obstacles = JSON.parse(localStorage.obstacleMarkers);
  var options = document.getElementsByClassName("obstacle-val-durability");

  
  for (var i = 0; i < options.length; i++){

    if(options[i].selected){
      obstacle.durability = options[i].value;
    }
  }
  
  obstacles.forEach( function (marker)
  {
    if (marker.id === obstacle.id) {
      marker.durability = obstacle.durability;
      marker.validationNumber = Number(marker.validationNumber) + 1;            
    }
  });

  localStorage.setItem("obstacleMarkers", JSON.stringify(obstacles));  
}


ObstacleValidationHandler.prototype._showModalSave = function() {

  handlepoints(7);

  myApp.modal({
    title:  '<span class="modal-title">Nahráli jste <br><span id="obstacle-val-gained-points" class="modal-points"></span><br><span id="obstacle-val-gained-points-unit"></span></span>',
    text: '<span class="modal-thank">a pomohli jste hendikepovaným<br>lidem s bezpečnou navigací.<br><br>Ďekujeme.</span>',
    verticalButtons: true,
    buttons: [
    {
      text: 'Sdílet',
      onClick: function() {

        
        localStorage.setItem("obstacleChecked", "true");          

        saveObstacle();
        writePoints();        

        window.location.href = "https://www.facebook.com/sharer/sharer.php?u=example.org";
      }
    },
    {
      text: 'Pokračovat',
      onClick: function() {

        
        localStorage.setItem("obstacleChecked", "true");        

        saveObstacle();
        writePoints();
        
        window.location.href = "index.html";
      }
    },
    {
      text: '<span class="modal-exit">Zrušit</span>',
      onClick: function() {
        handlepoints(-7);
        mainView.router.back("obstacle-val-durability");
      }
    },      
    ]
  })

  var showPoints = document.getElementById("obstacle-val-gained-points");
  var pointUnits = document.getElementById("obstacle-val-gained-points-unit");

  var gainedPoints = JSON.parse(localStorage.gamePointsCollection);

  showPoints.innerHTML = gainedPoints;

  if(Number(gainedPoints) > 4){
    pointUnits.innerHTML = "bodů";
  } else {
    pointUnits.innerHTML = "body";
  }

}

ObstacleValidationHandler.prototype._showModalDelete = function() {

  handlepoints(4);

  myApp.modal({
    title:  '<span class="modal-title">Nahráli jste <br><span id="obstacle-val2-gained-points" class="modal-points"></span><br><span id="obstacle-val2-gained-points-unit"></span></span>',
    text: '<span class="modal-thank">a pomohli jste hendikepovaným<br>lidem s bezpečnou navigací.<br><br>Ďekujeme.</span>',
    verticalButtons: true,
    buttons: [
    {
      text: 'Sdílet',
      onClick: function() {

        localStorage.setItem("obstacleChecked", "true"); 

        writePoints();
        deleteObstacle();        

        window.location.href = "https://www.facebook.com/sharer/sharer.php?u=example.org";
      }
    },
    {
      text: 'Pokračovat',
      onClick: function() {

        localStorage.setItem("obstacleChecked", "true"); 

        writePoints();
        deleteObstacle();

        window.location.href = "index.html";
      }
    },
    {
      text: '<span class="modal-exit">Zrušit</span>',
      onClick: function() {
        handlepoints(-4);
        mainView.router.back("obstacle-val-durability");
      }
    },      
    ]
  })

  var showPoints = document.getElementById("obstacle-val2-gained-points");
  var pointUnits = document.getElementById("obstacle-val2-gained-points-unit");

  var gainedPoints = JSON.parse(localStorage.gamePointsCollection);

  showPoints.innerHTML = gainedPoints;

  if(Number(gainedPoints) > 4){
    pointUnits.innerHTML = "bodů";
  } else {
    pointUnits.innerHTML = "body";
  }
}

var obstacleVal = new ObstacleValidationHandler();

var SidewalkValidationHandler = function(){
  var bodyVal = document.getElementById("sidewalk-val");  
  
  if(bodyVal != null){
    bodyVal.onload = function(){
      showSideWalkEnteredData();      
    };
  } 

}

var sidewalkVal = new SidewalkValidationHandler();


var CrosswalkValidationHandler = function(){
  var bodyVal = document.getElementById("crosswalk-val");  
  
  if(bodyVal != null){
    bodyVal.onload = function(){
      initMapHeader1();
      initMapHeader2();
      initMapHeader3();
      showCrosswalkData();     
    };
  } 

}

var crosswalkVal = new CrosswalkValidationHandler();


function handlepoints(points){
  var actualpoints = JSON.parse(localStorage.gamePointsCollection);
  actualpoints = Number(actualpoints) + Number(points);
  
  localStorage.setItem("gamePointsCollection", JSON.stringify(actualpoints));

}

function writePoints (){
  var monthlyPoints = JSON.parse(localStorage.gamePointsMonthly);
  var overallPoints = JSON.parse(localStorage.gamePointsOverall);
  var actualpoints = JSON.parse(localStorage.gamePointsCollection);

  monthlypoints = Number(monthlyPoints) + Number(actualpoints);
  overallpoints = Number(overallPoints) + Number(actualpoints);

  localStorage.setItem("gamePointsCollection", "0");
  localStorage.setItem("gamePointsMonthly", JSON.stringify(monthlypoints));
  localStorage.setItem("gamePointsOverall", JSON.stringify(overallpoints));

}

var GameHandler = function(){

  var gamePage = document.getElementById("game-body");
  var buttonContinue = document.getElementById("button-continue-challenge");


  if(buttonContinue != null){
    buttonContinue.addEventListener('click', this._continueCollecting, false);
  }

  if(gamePage != null){
    gamePage.onload = function(){
      setGameProfile();
    };
  } 

}

GameHandler.prototype._continueCollecting = function() {
  window.location.href = "index.html";
}



function setGameProfile(){

  var pointsMonthly = document.getElementById("points-monthly");
  var pointsOverall = document.getElementById("points-overall");
  var percentage = document.getElementById("game-challenge-percentage");

  pointsMonthly.innerHTML = localStorage.gamePointsMonthly;
  pointsOverall.innerHTML = localStorage.gamePointsOverall;

  var taskCrosswalk = document.getElementById("task-crosswalk");
  var taskObstacle = document.getElementById("task-newobstacle");
  var taskObstacleVal = document.getElementById("task-valobstacle");
  var taskSidewalk = document.getElementById("task-sidewalk");
  var taskCorner = document.getElementById("task-corner");

  var circle = document.getElementsByClassName("circle-front");
  var button = document.getElementById("button-continue-challenge");
  var addPoints;

  if(localStorage.crosswalkCollected === "true"){
    taskCrosswalk.classList.add("task-done");
  }
  if(localStorage.obstacleAdded === "true"){
    taskObstacle.classList.add("task-done");
  }
  if(localStorage.sidewalkCollected === "true"){
    taskSidewalk.classList.add("task-done");
  }
  if(localStorage.obstacleChecked === "true"){
    taskObstacleVal.classList.add("task-done");
  }
  if(localStorage.cornerValidated === "true"){
    taskCorner.classList.add("task-done");
  }  


  var tasksAchieved = 0;

  if(localStorage.crosswalkCollected === "true"){
    tasksAchieved = tasksAchieved + 1;
  }
  if(localStorage.obstacleAdded === "true"){
    tasksAchieved = tasksAchieved + 1;
  }
  if(localStorage.sidewalkCollected === "true"){
    tasksAchieved = tasksAchieved + 1;
  }
  if(localStorage.obstacleChecked === "true"){
    tasksAchieved = tasksAchieved + 1;
  }
  if(localStorage.cornerValidated === "true"){
    tasksAchieved = tasksAchieved + 1;
  }

 

  switch (tasksAchieved) {
    case 0:    
      circle[0].style["stroke-dashoffset"] = "630";
      percentage.innerHTML = "0%";
      button.innerHTML = "Začít";
    break;
    case 1:
      circle[0].style["stroke-dashoffset"] = "504";
      percentage.innerHTML = "20%";
      button.innerHTML = "Pokračovat";
    break; 
    case 2:
      circle[0].style["stroke-dashoffset"] = "378";
      percentage.innerHTML = "40%";
      button.innerHTML = "Pokračovat";
    break;
    case 3:
      circle[0].style["stroke-dashoffset"] = "252";
      percentage.innerHTML = "60%";
      button.innerHTML = "Pokračovat";
    break;
    case 4:
      circle[0].style["stroke-dashoffset"] = "126";
      percentage.innerHTML = "80%";
      button.innerHTML = "Pokračovat";
    break;
    case 5:
      circle[0].style["stroke-dashoffset"] = "0";
      percentage.innerHTML = "100%";
      if(addPoints==undefined){
        addPoints = 1;
      } else {
        addPoints = addPoints + 1;
      }      
      button.innerHTML = "Gratulujeme";
      button.classList.add("disabled");
    break;
  }

  
  if(addPoints === 1){
    handlepoints(80);
    writePoints();
  }

}

var gameH = new GameHandler();