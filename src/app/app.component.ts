import { Component, OnInit } from '@angular/core';
import { circle, geoJSON, icon, latLng, Layer, marker, polygon, tileLayer } from 'leaflet'
import '../../node_modules/leaflet.heat/dist/leaflet-heat.js';
declare var L;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  gStoreId:number;
  gStoreDateStart:string;
  gStoreDateEnd:string;
  //gStoreDropdownMap = new Map();
  gStoreLocationMap = new Map();  
  gFloormapBounds = [];
  g_image_layer:any;
  markerIcon:any;
  gConfig = { heatmapLowerbound:0,
    heatmapUpperbound: 100,
    gradientDensity: {gradient: {0.1: 'lime', 0.7:'yellow',  0.8: 'orange', 1.0: '#E74C3C'}},
    gradientOptions: {max: 10 },
    heatIntensity:2,	         
    coverageIntensity:0.2,	 
    mediumStoreApCountMin:5,
    mediumStoreApCountMax:8,
    lowApCountBucket:{	            	
        bucket1:{apDistanceMin: 0, apDistanceMax: 15, gradientBlur: 65, coverageRadius: 7, coverageRadiusStep: 13, coverageAngleStep: 13, heatRadius: 30, heatAngleStep: 17},
         bucket2:{apDistanceMin: 16, apDistanceMax: 80, gradientBlur: 85, coverageRadius: 9, coverageRadiusStep: 5, coverageAngleStep: 5, heatRadius: 50, heatAngleStep: 20 },
         bucket3:{apDistanceMin: 81, apDistanceMax: 150, gradientBlur:64, coverageRadius: 9, coverageRadiusStep: 7, coverageAngleStep: 7, heatRadius: 80, heatAngleStep: 20}
     },
    mediumApCountBucket:{
            bucket1:{apDistanceMin: 0, apDistanceMax: 15, gradientBlur: 65, coverageRadius: 7, coverageRadiusStep: 5, coverageAngleStep: 5, heatRadius: 30, heatAngleStep: 17},
             bucket2:{apDistanceMin: 16, apDistanceMax: 80, gradientBlur: 85, coverageRadius: 5, coverageRadiusStep: 9, coverageAngleStep: 9, heatRadius: 60, heatAngleStep: 20 },
             bucket3:{apDistanceMin: 81, apDistanceMax: 150, gradientBlur:64, coverageRadius: 9, coverageRadiusStep: 15, coverageAngleStep: 15, heatRadius: 80, heatAngleStep: 20}
        },
    largeApCountBucket:{
        bucket1:{apDistanceMin: 0, apDistanceMax: 15, gradientBlur: 65, coverageRadius: 7, coverageRadiusStep: 5, coverageAngleStep: 5, heatRadius: 30, heatAngleStep: 17},
          bucket2:{apDistanceMin: 16, apDistanceMax: 80, gradientBlur: 85, coverageRadius: 8, coverageRadiusStep: 13, coverageAngleStep: 13, heatRadius: 50, heatAngleStep: 20 },
          bucket3:{apDistanceMin: 81, apDistanceMax: 150, gradientBlur:64, coverageRadius: 9, coverageRadiusStep: 15, coverageAngleStep: 15, heatRadius: 80, heatAngleStep: 20}
     }	           
    
    };
  gStoreDropdownMaps = [
      {name: "Marshalls 1299", storeId: 'TJXM1299' },
      {name: "HomeSense 6", storeId: 'TJXH0006' }     
    ]
    public selectedStore:any = this.gStoreDropdownMaps[0].storeId;

    gHeatmapData= [];
  
  constructor(){

  }

  ngOnInit(){
    
  }
  
  options = {    
    attributionControl: false,
    dragging: false,
    minZoom: 2,
    maxZoom: 3,
    crs: L.CRS.Simple,
    //center: L.latLng([ 46.879966, -121.726909 ])

   
  };
  
  onStoreChange(selectedStore:any){
    this.selectedStore = selectedStore;
    console.log(this.selectedStore);
  }
  removeAllMapLayers(hscFloormap) {
    hscFloormap.eachLayer(function (layer) {
      hscFloormap.removeLayer(layer);
  });
  }
  applyImageLayer(imageUrl, hscFloormap) {
    this.g_image_layer.setUrl(imageUrl);
    this.g_image_layer.addTo(hscFloormap);
}// applyImageLayer

applyHeatLayer(hscFloormap) {
  var apHeatLayer = L.heatLayer();  
   apHeatLayer.setOptions(this.gConfig.gradientDensity);  
   apHeatLayer.setOptions(this.gConfig.gradientOptions);
   apHeatLayer.setLatLngs(this.gHeatmapData);
   apHeatLayer.addTo(hscFloormap);
}// applyHeatLayer



  onMapReady(hscFloormap: L.Map) {
    this.markerIcon = L.icon({
      iconUrl: './assets/img/map_marker.png',   
      iconSize:     [32, 32], // size of the icon   
      iconAnchor:   [15, 18], // point of the icon which will correspond to marker's location
  });
  this.removeAllMapLayers(hscFloormap);
    var x = 50;
    var y = 50;    
   
    this.gFloormapBounds = [[this.gConfig.heatmapLowerbound, this.gConfig.heatmapLowerbound], [this.gConfig.heatmapUpperbound, this.gConfig.heatmapUpperbound]];
    this.g_image_layer = L.imageOverlay('', this.gFloormapBounds);
    this.applyImageLayer('./assets/img/TJXH0006.png', hscFloormap);    
    hscFloormap.fitBounds(this.gFloormapBounds);   
    var tooltipData = "<b>"+"ap1"+"</b>";
    var circle = L.circle([y,x], {
            radius: 10,
            // color: 'green',
            fillOpacity: 0,
            stroke: false,
        }).addTo(hscFloormap);
    circle.bindTooltip(tooltipData, {sticky: true }).addTo(hscFloormap);
    var marker = L.marker([y, x], {
      icon: this.markerIcon,        	
      }).addTo(hscFloormap);        
    marker.bindTooltip(tooltipData, {sticky: true }).addTo(hscFloormap);
    
    this.gHeatmapData = [
      [51.5114709848079, 62.04030230586814, 2],
      [51.50665563853606, 60.952270739775734, 2],
      [50.51137733119529, 60.51266072247618, 2],
      [49.703882229991606, 61.24189836406173, 2],
      [50.04011200572555, 62.27668598202163, 2],
      [51.12202578717835, 62.39200486978816, 2],
      [51.66881522472358, 61.451336390799845, 2],
      [51.03317136537326, 60.56827763825648, 2],
      [49.96759221442263, 60.78822524436428, 2],
      [49.733548599882354, 61.850797342090424, 2],
      [50.60810974928128, 62.49808296091356, 2],
      [51.55593879787876, 61.96380216301042, 2],
      [51.454961713276404, 60.88045572499605, 2],
      [50.42471879091806, 60.53054802673299, 2],
      [49.68484856367112, 61.32831235484423, 2],
      [50.111235950410915, 62.329326676820905, 2],
      [51.199108265481854, 62.34855432554362, 2],
      [51.66060323338978, 61.36323292063612, 2],
      [56.56029689365528, 65.28211614107698, 2],
      [56.526589469752395, 57.66589517843012, 2],
      [49.55964131836704, 54.58862505733322, 2]
    ]
  //   L.heatLayer = function (latlngs, options) {
  //     return new L.HeatLayer(latlngs, options);
  // };
  //testData = testData.map(function (p) { return [p[0], p[1]]; });
   this.applyHeatLayer(hscFloormap);
   
  
}
}
