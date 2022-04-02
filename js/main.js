// declare the map variable here to give it a global scope
let myMap;
let mapStyle;

// we might as well declare our baselayer(s) here too
const CartoDB_Positron = L.tileLayer(
	'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', 
	{
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
	}
)
var OpenStreetMap_HOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
});
var Thunderforest_Pioneer = L.tileLayer('https://{s}.tile.thunderforest.com/pioneer/{z}/{x}/{y}.png?apikey={apikey}', {
	attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	apikey: '<your apikey>',
	maxZoom: 22
});
var NASAGIBS_ViirsEarthAtNight2012 = L.tileLayer('https://map1.vis.earthdata.nasa.gov/wmts-webmerc/VIIRS_CityLights_2012/default/{time}/{tilematrixset}{maxZoom}/{z}/{y}/{x}.{format}', {
	attribution: 'Imagery provided by services from the Global Imagery Browse Services (GIBS), operated by the NASA/GSFC/Earth Science Data and Information System (<a href="https://earthdata.nasa.gov">ESDIS</a>) with funding provided by NASA/HQ.',
	bounds: [[-85.0511287776, -179.999999975], [85.0511287776, 179.999999975]],
	minZoom: 1,
	maxZoom: 8,
	format: 'jpg',
	time: '',
	tilematrixset: 'GoogleMapsCompatible_Level'
});

function initialize(){
    loadMap();
};

function loadMap(mapid){
	try {
		myMap.remove()
	} catch(e) {
		console.log(e)
		console.log("no map to delete")
	} finally {
		//put your map loading code in here
		if(mapid == 'mapa'){
			mapStyle = "a";
	
		//now reassign the map variable by actually making it a useful object, this will load your leaflet map
		myMap = L.map('mapdiv', {
			center: [38.56915226668274, -97.695053082457148]
			,zoom: 4
			,maxZoom: 18
			,minZoom: 2
			,layers: CartoDB_Positron
		});
	
		//add the basemap style(s) to a JS object, to which you could also add other baselayers. This object is loaded as a basemap selector as seen further down
		let baseLayers = {
			"CartoDB": CartoDB_Positron,
			"OSM": OpenStreetMap_HOT,
			"Pioneer": Thunderforest_Pioneer,
			"Night": NASAGIBS_ViirsEarthAtNight2012
			//,...
		};
		
	
		
		//declare basemap selector widget
		let lcontrol = L.control.layers(baseLayers);
		//add it to the map
		lcontrol.addTo(myMap);
		
		
		fetchData();
		
		}
		if(mapid == 'mapb'){
			mapStyle = "b";
	
			//now reassign the map variable by actually making it a useful object, this will load your leaflet map
			myMap = L.map('mapdiv', {
				center: [10, 15]
				,zoom: 2.5
				,maxZoom: 18
				,minZoom: 2
				,layers: OpenStreetMap_HOT
			});
		
			//add the basemap style(s) to a JS object, to which you could also add other baselayers. This object is loaded as a basemap selector as seen further down
			let baseLayers = {
				"CartoDB": CartoDB_Positron,
				"OSM": OpenStreetMap_HOT,
				"Pioneer": Thunderforest_Pioneer,
				"Night": NASAGIBS_ViirsEarthAtNight2012
				//,...
			};
			
		
			
			//declare basemap selector widget
			let lcontrol = L.control.layers(baseLayers);
			//add it to the map
			lcontrol.addTo(myMap);
			
			
			fetchData();
	
		}
	}
	
	console.log(mapStyle)
	console.log(mapid)
};

function fetchData(){
    //load the data
	if(mapStyle == 'a'){
    fetch('https://raw.githubusercontent.com/geog-464/lab10/main/data/Amtrak_Stations.geojson')
        .then(function(response){
            return response.json();
        }) 	
        .then(function(json){
            //create a Leaflet GeoJSON layer and add it to the map
            L.geoJson(json,{style: styleAll, pointToLayer: generateCircles, onEachFeature: addPopups}).addTo(myMap);
        })
};
	if(mapStyle == 'b'){
	fetch('https://raw.githubusercontent.com/geog-464/lab10/main/data/megacities.geojson')
        .then(function(response){
            return response.json();
        }) 	
        .then(function(json){
            //create a Leaflet GeoJSON layer and add it to the map
            L.geoJson(json,{style: styleAll, pointToLayer: generateCircles, onEachFeature: addPopups}).addTo(myMap);
        })
}}

function generateCircles(feature, latlng) {
	return L.circleMarker(latlng);
}

function styleAll(feature, latlng) {
	
if(mapStyle == 'a'){
	console.log(feature.properties.ZipCode)
	var styles = {dashArray:null, dashOffset:null, lineJoin:null, lineCap:null, stroke:false, color:'#000', opacity:1, weight:1, fillColor:null, fillOpacity:0 };

	if (feature.geometry.type == "Point") {
		styles.fillColor = '#fff'
		,styles.fillOpacity = 0.5
		,styles.stroke=true
		,styles.radius=9
	}
	if (typeof feature.properties.ZipCode == 'string' ){
		styles.fillColor = 'cyan'
	}
	
	return styles;
}
if(mapStyle == 'b'){
	console.log(feature.properties.ZipCode)
	var styles = {dashArray:null, dashOffset:null, lineJoin:null, lineCap:null, stroke:false, color:'#000', opacity:1, weight:1, fillColor:null, fillOpacity:0 };

	if (feature.geometry.type == "Point") {
		styles.fillColor = 'gray'
		,styles.fillOpacity = 0.5
		,styles.stroke=true
		,styles.radius=9
	}
	if (typeof feature.properties.ZipCode == 'string' ){
		styles.fillColor = 'cyan'
	}
	
	return styles;
}
}
function addPopups(feature, layer){
	if(mapStyle == 'a'){
		layer.bindPopup(feature.properties.City + ", " + feature.properties.State);
	}
	if(mapStyle == 'b'){
		layer.bindPopup(feature.properties.city + ". Pop: " + feature.properties.pop_2018);
	}
}

//window.onload = initialize();