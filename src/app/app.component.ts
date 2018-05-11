import { Component, OnInit } from '@angular/core';
import { ConfigConstant } from './shared/model/configConstant.model';
declare var L;

declare var HeatmapOverlay;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  gStoreId:number;
  gStoreDateStart:string;
  gStoreDateEnd:string;
  gStoreDropdownMap = new Map();
  gStoreLocationMap = new Map();
  gHeatmapData = [];
  
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

    
  data = {
    data: []
  };
  constructor(){

  }

  ngOnInit(){
    console.log(this.heatmapLayer);
  }

heatmapLayer = new HeatmapOverlay({
    radius: 2,
    maxOpacity: 0.8,
    scaleRadius: true,
    useLocalExtrema: true,
    latField: 'lat',
    lngField: 'lng',
    valueField: 'count'
  });

  options = {
    layers: [
      L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        detectRetina: true
      }),
      this.heatmapLayer
    ],
    zoom: 4,
    center: L.latLng([ 46.879966, -121.726909 ])
  };

  onMapReady(map: L.Map) {
    map.on('mousemove', (event: L.LeafletMouseEvent) => {
      this.data.data.push({
        lat: event.latlng.lat,
        lng: event.latlng.lng,
        count: 1
      });
      this.heatmapLayer.setData(this.data);
      
    });
  }
}
