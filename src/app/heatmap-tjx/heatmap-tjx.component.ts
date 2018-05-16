import { Component, OnInit } from '@angular/core';
import { circle, geoJSON, icon, latLng, Layer, marker, polygon, tileLayer } from 'leaflet'
import '../../../node_modules/leaflet.heat/dist/leaflet-heat.js';
import { TjxHeatMapService } from '../services/tjx_heatmap.service';
import { TjxHeatMapData } from '../shared/model/tjxHeatMapData.model.js';
import { Options } from '../shared/model/options.model.js';
import { DatePipe } from '@angular/common';
import { TjxMinMaxDateService } from '../services/tjx_min_max_date.service';
import { TjxMinMaxDate } from '../shared/model/tjxMinMaxDate.model.js';
declare var L;
@Component({
  selector: 'app-heatmap-tjx',
  templateUrl: './heatmap-tjx.component.html',
  styleUrls: ['./heatmap-tjx.component.css']
})
export class HeatmapTjxComponent implements OnInit {

  public isOnChange:boolean = false;
  public tjxHeatmapDataRes:TjxHeatMapData[];
  public tjxMinMaxDateRes:TjxMinMaxDate = new TjxMinMaxDate();
  public options:Options = new Options();
  public gFloorMap:any;
  public bsValueStart: Date;
  public maxDateStart: Date; 
  public bsValueStrStart: string;
  public bsDateAPIStrStart: string;
  public minDateStart:Date;
  public minDateEnd:Date;
  public bsValueEnd: Date;
  public maxDateEnd: Date; 
  public bsValueStrEnd: string;
  public bsDateAPIStrEnd: string; 
  transformDate(date, format) {
   return this.datePipe.transform(date, format);
  }
  //gStoreDropdownMap = new Map();
  gStoreLocationMap = new Map();  
  gFloormapBounds = [];
  g_image_layer:any;  
  apPointsPlotted:any;  
  gApLocationsTJXM1299 = [ [50.67, 61.50], [55.65, 42.55], [27.60, 47.50], [25.65, 66.80]];
  gApLocationsTJXH0006 = [[72.90, 80], [47.50, 62], [47.65, 24]];
  gConfig = { heatmapLowerbound:0,
    heatmapUpperbound: 100,
    gradientDensity: {gradient: {0.1: 'lime', 0.7:'yellow',  0.8: 'orange', 1.0: '#E74C3C'}},
    gradientOptions: {max:10, radius:'', blur:'' },
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
    public selectedStore = this.gStoreDropdownMaps[0].storeId;

    gHeatmapData= [];
  
  constructor(private tjxHeatMapService: TjxHeatMapService, 
              private datePipe: DatePipe,
              private tjxMinMaxDateService:TjxMinMaxDateService){
              
  }



  ngOnInit() {
    this.getFromDateToEndDate(this.selectedStore, "");
     //this.getConfigureData();
  }
 
  /** ************************************************************** */
/** ********************** heatmap code ************************** */
/** ************************************************************** */
  hsc_lab = {    
    attributionControl: false,
    dragging: false,
    minZoom: 2,
    maxZoom: 3,
    crs: L.CRS.Simple
  };
  markerIcon = L.icon({
    iconUrl: '././assets/img/map_marker.png',   
    iconSize:     [32, 32], // size of the icon   
    iconAnchor:   [15, 18], // point of the icon which will correspond to marker's location
});
  onStoreChange(selectedStore:any){
    this.selectedStore = selectedStore;   
    //console.log(this.selectedStore);
    this.isOnChange = true;
    var selectedDate = {
      maxDate: this.bsDateAPIStrEnd, 
      minDate: this.bsDateAPIStrStart
    }
    
    this.getFromDateToEndDate(this.selectedStore, selectedDate);
  }
  onChangeStartdate(){
    this.bsValueStrStart = this.transformDate(this.bsValueStart, 'd/M/y');
     this.bsDateAPIStrStart = this.transformDate(this.bsValueStart, 'yyyy-MM-dd');
     this.minDateEnd = this.bsValueStart;
     //this.getAstroforcelogoutList(this.bsDateAPIStrStart, this.bsDateAPIStrEnd);
   }
   onChangeEnddate(){
    this.bsValueStrEnd = this.transformDate(this.bsValueEnd, 'd/M/y');
     this.bsDateAPIStrEnd = this.transformDate(this.bsValueEnd, 'yyyy-MM-dd');
     //this.getAstroforcelogoutList(this.bsDateAPIStrStart, this.bsDateAPIStrEnd);
   }

   onClickApply(){
    this.getTjxHeatMapData(this.selectedStore, this.bsDateAPIStrStart, this.bsDateAPIStrEnd);
   }
  removeAllMapLayers(hscFloormap) {
    hscFloormap.eachLayer(function (layer) {
      hscFloormap.removeLayer(layer);
  });
  }// removeAllMapLayers

  applyImageLayer(imageUrl, hscFloormap) {
    this.g_image_layer.setUrl(imageUrl);
    this.g_image_layer.addTo(hscFloormap);
  }// applyImageLayer

  drawHeatCircle(x, y, intensity, radiusStart, radiusEnd, radius_steps, angle_step){
    this.apPointsPlotted = 0;
    if( (x <= this.gConfig.heatmapUpperbound && x >= this.gConfig.heatmapLowerbound)
        && (y <= this.gConfig.heatmapUpperbound && y >= this.gConfig.heatmapLowerbound)
        && (radiusEnd <= this.gConfig.heatmapUpperbound)
        && (radius_steps > 0) && (angle_step > 0)
        && (radiusStart >= 0 && radiusStart <= 100) ){
          for(var rad=radiusStart; rad<=radiusEnd; rad+=radius_steps) {	
             for(var angle=1; angle<=360; angle+=angle_step) {
                var tmpX = x + rad * Math.cos(angle);
                var tmpY = y + rad * Math.sin(angle);	           
                if ((tmpX > this.gConfig.heatmapUpperbound) || (tmpX < this.gConfig.heatmapLowerbound) ||
                    (tmpY > this.gConfig.heatmapUpperbound) || (tmpY < this.gConfig.heatmapLowerbound)) {
                    continue;
                }// if
                this.gHeatmapData.push([tmpY, tmpX, intensity]);	
               
                this.apPointsPlotted++;
             }// angle	       
      }// rad
       //console.log(this.gHeatmapData);
      return this.apPointsPlotted;
     }
  }// drawHeatCircle
  avgDistanceBwAps(storeLocationMap){	
    var distance = [];
    var avgDistance:number;
     for (var i = 0; i < storeLocationMap.length; i++){
       var x1 = storeLocationMap[i][0];
       var y1 = storeLocationMap[i][1];    	   
       for(var j = i+1; j < storeLocationMap.length; j++ ){
         var x2 = storeLocationMap[j][0]; 
         var y2 = storeLocationMap[j][1];    		   
         var dist = Math.sqrt(Math.pow((x2-x1), 2) + Math.pow((y2-y1), 2) );
         distance.push(dist);
       }    	  
    } 	    
     const reducer = (accumulator, currentValue) => accumulator + currentValue;
     avgDistance = (distance.reduce(reducer)/distance.length);
     return avgDistance;
} //avgDistanceBwAps

abbreviateNumber(value) {
  var newValue = value;
  if (value >= 1000) {
      var suffixes = ["", "k", "m", "b","t"];
      var suffixNum = Math.floor( (""+value).length/3 );
      var shortValue:number;
      var shortNum:any;
      for (var precision = 2; precision >= 1; precision--) {
          shortValue = parseFloat( (suffixNum != 0 ? (value / Math.pow(1000,suffixNum) ) : value).toPrecision(precision));
          var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
          if (dotLessShortValue.length <= 2) { break; }
      }
      if (shortValue % 1 != 0)  shortNum = shortValue.toFixed(1);
      newValue = shortValue+suffixes[suffixNum];
  }
  return newValue;
}//abbreviateNumber

applyHeatLayer(hscFloormap) {
  var apHeatLayer = L.heatLayer();  
   apHeatLayer.setOptions(this.gConfig.gradientDensity);  
   apHeatLayer.setOptions(this.gConfig.gradientOptions);
   apHeatLayer.setLatLngs(this.gHeatmapData);
   apHeatLayer.addTo(hscFloormap);
}// applyHeatLayer

/** ************************************************************** */
/** ********************** source code *************************** */
/** ************************************************************** */

getTjxHeatMapData( storeId, storeDateStart, storeDateEnd){ 
    this.gStoreLocationMap['TJXM1299'] = this.gApLocationsTJXM1299;
    this.gStoreLocationMap['TJXH0006'] = this.gApLocationsTJXH0006;    
    this.tjxHeatMapService.getTjxHeatMapData(storeId, storeDateStart, storeDateEnd).subscribe(
 data => {
   this.tjxHeatmapDataRes = data;
   this.parseAndFillApData(this.tjxHeatmapDataRes, this.selectedStore, this.gFloorMap)
   //console.log(this.tjxHeatmapDataRes);
 }, error => {
   
 }
)
}//getTjxHeatMapData

getFromDateToEndDate(storeId, selectedDate){
   this.tjxMinMaxDateService.getTjxMinMaxDate(storeId).subscribe(data => {      
    console.log(data);
    this.configureDate(data, selectedDate);
    if(!this.isOnChange){
      this.getConfigureData();
    }    
  })
}//getFromDateToEndDate

configureDate(data, selectedDate){
  if(selectedDate != ""){
    var selectedStoreDateStart = new Date(selectedDate.minDate);
    var selectedStoreDateEnd = new Date(selectedDate.maxDate);
 }
  console.log(selectedDate);
  this.tjxMinMaxDateRes = data;
  this.maxDateStart = new Date(this.tjxMinMaxDateRes.maxDate);
  this.maxDateEnd = new Date(this.tjxMinMaxDateRes.maxDate); 
  this.minDateStart = new Date(this.tjxMinMaxDateRes.minDate);
  this.minDateEnd = new Date(this.tjxMinMaxDateRes.minDate);

  if(this.minDateStart <= selectedStoreDateStart && this.maxDateStart <= selectedStoreDateEnd){	
    this.bsValueStart = selectedStoreDateStart;
    this.bsValueEnd = selectedStoreDateEnd;
   
  }else {
    this.bsValueStart = this.bsValueEnd = this.maxDateStart;
  }
  this.bsValueStrStart = this.transformDate(this.bsValueStart, 'd/M/y');
  this.bsDateAPIStrStart = this.transformDate(this.bsValueStart, 'yyyy-MM-dd');

  this.bsValueStrEnd = this.transformDate(this.bsValueEnd, 'd/M/y');
  this.bsDateAPIStrEnd = this.transformDate(this.bsValueEnd, 'yyyy-MM-dd');
}



getConfigureData(){ 
  console.log("getConfigureData called !");
  this.getTjxHeatMapData(this.selectedStore, this.bsDateAPIStrStart,  this.bsDateAPIStrEnd);
  }

parseAndFillApData(apJsonData, storeId , hscFloormap) { 
  
  this.removeAllMapLayers(hscFloormap);
  this.gHeatmapData = [];
  var storeImgUrl = this.getImageUrlFromStoreId(storeId);   
  try{
      this.applyImageLayer(storeImgUrl, hscFloormap);
  } catch(e) {
      console.error("applyImageLayer exception: "+e);
  }
  
  var totalAp = [];
  var totalCount = 0;
  for (var eachApIndex = 0; eachApIndex < this.gStoreLocationMap[storeId].length;  eachApIndex++) {
      var thisApCount = parseInt(apJsonData[eachApIndex].footFall);
      totalCount += thisApCount; 
      totalAp.push(apJsonData[eachApIndex]);
  }
  var totalPointsPlotted = 0; 
  var avgDistance = this.avgDistanceBwAps(this.gStoreLocationMap[storeId]);
  var heatRadius, heatAngleStep, coverageRadius, coverageRadiusStep, coverageAngleStep, gradientBlur;
  
  if(totalAp.length < this.gConfig.mediumStoreApCountMin){
        if(avgDistance >= this.gConfig.lowApCountBucket.bucket1.apDistanceMin && avgDistance <= this.gConfig.lowApCountBucket.bucket1.apDistanceMax){ 
          this.options = this.gConfig.lowApCountBucket.bucket1;
        }else if(avgDistance >= this.gConfig.lowApCountBucket.bucket2.apDistanceMin && avgDistance <= this.gConfig.lowApCountBucket.bucket2.apDistanceMax){
          this.options = this.gConfig.lowApCountBucket.bucket2;
        }else {
          this.options = this.gConfig.lowApCountBucket.bucket3;
        }   
  }else if(totalAp.length > this.gConfig.mediumStoreApCountMax){
       if(avgDistance >= this.gConfig.largeApCountBucket.bucket1.apDistanceMin && avgDistance <= this.gConfig.largeApCountBucket.bucket1.apDistanceMax){
        this.options = this.gConfig.largeApCountBucket.bucket1;
        }else if(avgDistance >= this.gConfig.largeApCountBucket.bucket2.apDistanceMin && avgDistance <= this.gConfig.largeApCountBucket.bucket2.apDistanceMax){
          this.options = this.gConfig.largeApCountBucket.bucket2;
        }else {
          this.options = this.gConfig.largeApCountBucket.bucket3;
     }   
  }else{
    if(avgDistance >= this.gConfig.mediumApCountBucket.bucket1.apDistanceMin && avgDistance <= this.gConfig.mediumApCountBucket.bucket1.apDistanceMax){
      this.options = this.gConfig.mediumApCountBucket.bucket1;
        }else if(avgDistance >= this.gConfig.mediumApCountBucket.bucket2.apDistanceMin && avgDistance <= this.gConfig.mediumApCountBucket.bucket2.apDistanceMax){
          this.options = this.gConfig.mediumApCountBucket.bucket2;
        }else {
          this.options = this.gConfig.mediumApCountBucket.bucket3;
     }   
  }  
  //console.log(this.options);
  heatRadius = this.options.heatRadius;
  heatAngleStep = this.options.heatAngleStep; 
  coverageRadius = this.options.coverageRadius;
  coverageRadiusStep = this.options.coverageRadiusStep;
  coverageAngleStep = this.options.coverageAngleStep;
  gradientBlur = this.options.gradientBlur;
  
  this.gConfig.gradientOptions.radius = heatRadius;  //adding radius in gradient option
  this.gConfig.gradientOptions.blur = gradientBlur; //adding blur in gradient option

  for(var eachApIndex = 0; eachApIndex < this.gStoreLocationMap[storeId].length;  eachApIndex++){
      var x = this.gStoreLocationMap[storeId][eachApIndex][1];
      var y = this.gStoreLocationMap[storeId][eachApIndex][0];       
      var thisApCount = parseInt(apJsonData[eachApIndex].footFall);
      var percentageCount = ((100*thisApCount) / totalCount);
      // higher the percentage, lower the steps. so, lower the steps, more the
  // num of points plotted        
      var heatRadiusSteps = ((100 - percentageCount)/10);
      this.apPointsPlotted = 0;
                 // drawHeatCircle(x, y, intensity,                 radiusStart,                     radiusEnd                 radius_steps,     angle_step)
      //this is for heat
      this.apPointsPlotted = this.drawHeatCircle(x, y, this.gConfig.heatIntensity,     this.gConfig.heatmapLowerbound+1,     coverageRadius,          heatRadiusSteps,    heatAngleStep); // ap heat circle
      totalPointsPlotted += this.apPointsPlotted;
      
      //this is for coverage
      this.apPointsPlotted = this.drawHeatCircle(x, y, this.gConfig.coverageIntensity, coverageRadius,                 this.gConfig.heatmapUpperbound, coverageRadiusStep, coverageAngleStep); // ap coverage  circle
      totalPointsPlotted += this.apPointsPlotted; 
      /* tooltip code */
      var avgDwellTime = +(apJsonData[eachApIndex].averageTime/60).toFixed(2); // divide by 60 to convert in minute
      var totalFootFall =  this.abbreviateNumber(apJsonData[eachApIndex].footFall); // convert footFall number in to abbreviated Number(k, m, b, t)
      var tooltipData = "<b>"+apJsonData[eachApIndex].ap_name+"</b>";       
      tooltipData += "<br> Footfall: "+ totalFootFall;
      // tooltipData += "<br> Total Dwell Time (mins):
  // "+parseInt(apJsonData[eachApIndex].dwellTime * 10 / 60)/10;
      tooltipData += "<br> Average Dwell Time (mins): "+avgDwellTime; 
      var circle = L.circle([y,x], {
              radius: coverageRadius,
              // color: 'green',
              fillOpacity: 0,
              stroke: false,
          }).addTo(hscFloormap);
      circle.bindTooltip(tooltipData, {sticky: true }).addTo(hscFloormap);
      
      var marker = L.marker([y, x], {
        icon: this.markerIcon,        	
        }).addTo(hscFloormap);        
      marker.bindTooltip(tooltipData, {sticky: true }).addTo(hscFloormap);
      
      
     } // for eachApIndex
 
 
  this.applyHeatLayer(hscFloormap);
}// parseAndFillApData



getImageUrlFromStoreId(storeId) {	 
	return "././assets/img/"+storeId+".png";	
}// getImageUrlFromStoreId


  onMapReady(hscFloormap: L.Map) {     
    this.gFloorMap = hscFloormap;
    this.gFloormapBounds = [[this.gConfig.heatmapLowerbound, this.gConfig.heatmapLowerbound], [this.gConfig.heatmapUpperbound, this.gConfig.heatmapUpperbound]];
    this.g_image_layer = L.imageOverlay('', this.gFloormapBounds);   
    hscFloormap.fitBounds(this.gFloormapBounds);   
     
}

}
