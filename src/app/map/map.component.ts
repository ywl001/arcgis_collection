import { Component, ElementRef, ViewChild } from '@angular/core';


import Basemap from "@arcgis/core/Basemap.js";
import Graphic from '@arcgis/core/Graphic';
import Map from "@arcgis/core/Map.js";
import esriConfig from "@arcgis/core/config";
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils';
import TileLayer from "@arcgis/core/layers/TileLayer.js";
import MapView from "@arcgis/core/views/MapView.js";
import FeatureLayerView from "@arcgis/core/views/layers/FeatureLayerView.js";
import { LayerName } from '../app-state/app-state';
import { ServerConfig } from '../config/server.config';
import { LocalStorgeService } from '../services/local-storge.service';
import { MessageService } from '../services/message.service';
import { BuildingLayer } from './layers/building-layer';
import { HouseLayer } from './layers/house-layer';
import { MarkLayer } from './layers/mark-layer';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent {

  @ViewChild('mapView', { static: true }) mapViewEl!: ElementRef;

  cursor: string = 'default';
  mapView!: MapView;
  tileLayer

  mapScale;
  private buildingLayer: BuildingLayer

  private houseLayer: HouseLayer;


  private highLightFeature: __esri.Handle;

  private currentGraphic: Graphic;

  private markLayer: MarkLayer;

  private isImageLayer:boolean;

  constructor(private message:MessageService,private local:LocalStorgeService){}

  ngOnInit(){
    esriConfig.assetsPath = 'assets';
    esriConfig.fontsUrl = 'assets/fonts';

    this.message.changeLayer$.subscribe(res=>{
      console.log('change layer')
      this.tileLayer.url = this.isImageLayer ? ServerConfig.mapServerUrl: ServerConfig.imageMapUrl 
      this.tileLayer.refresh();

      this.isImageLayer = !this.isImageLayer;
    })
  }

  ngAfterViewInit() {
    this.initializeMap().then(() => {
      console.log('The map is ready.');

      const l = this.local.getObject('location');
      if (l) {
        this.mapView.center = l.target;
        this.mapView.scale = l.scale;
      }


      this.buildingLayer = new BuildingLayer(this.mapView)
      this.houseLayer = new HouseLayer(this.mapView)
      // this.markLayer = new MarkLayer(this.mapView);
      
      this.mapView.map.add(this.houseLayer);
      // this.mapView.map.add(this.markLayer);
      this.mapView.map.add(this.buildingLayer);
    });
  }
  
  initializeMap(): Promise<any> {
    const container = this.mapViewEl.nativeElement;
    this.tileLayer = new TileLayer({
      url: ServerConfig.mapServerUrl
    });

    

    const basemap = new Basemap({
      baseLayers: [
        this.tileLayer,
        // this.roadLayer
      ],
      title: "basemap",
      id: "basemap"
    });

    const map = new Map({
      basemap: basemap
    })

    const view = new MapView({
      map: map,
      container: container,
      ui: {
        components: []
      }
    });

    this.mapView = view;

    reactiveUtils.watch(
      () => this.mapView.stationary === true,
      () => {
          this.mapScale = this.mapView.scale;
      }
    )

    view.on("click", e => { this.mapClick(e) });

    // view.on('double-click', e => { this.mapDoubleclick(e) })

    // view.on('pointer-move', e => { this.mapOver(e) })

    view.on('hold', e => { this.onHold(e) })

    return this.mapView.when();
  }


  async onHold(e: __esri.ViewHoldEvent) {
    console.log('hold....')

    if(this.mapScale > 1000){
      this.mapView.goTo({
        target:e.mapPoint,
        zoom:10
      })
    }else{
      const screenPoint = {x: e.x,y: e.y};
      const g = await this.identityMap(screenPoint);
      if(!g){
        //添加新房子
        let g = new Graphic();
        g.geometry = e.mapPoint;
        g.attributes = {layer_name:LayerName.house};
        this.message.selectGraphic(g);
      }
    }
  }

  // mapOver(e: __esri.ViewPointerMoveEvent) {
  //   throw new Error('Method not implemented.');
  // }
  
  // mapDoubleclick(e: __esri.ViewDoubleClickEvent) {
  //   console.log('db click')
  // }
  
  async mapClick(e: __esri.ViewClickEvent) {
    var screenPoint = {x: e.x,y: e.y};

    const g = await this.identityMap(screenPoint);
    console.log(g?.attributes)

    if (g) {
      // if (event.button == 0) {
      //   this.onClickGraphic(g);
      // } else if (event.button == 2) {
      //   console.log('right click');
      //   this.showMenu(g)
      // }
      this.message.selectGraphic(g);
      this.setLocationToLocal()
    } else {
      console.log('点到了地图空白处');
    }
  }

  private setLocationToLocal(){
    const location = {
      target: this.mapView.center,
      scale: this.mapView.scale
    }
    console.log(location)
    this.local.setObject('location', location)
  }

  private async identityMap(p) {
    return this.mapView.hitTest(p).then(
      res => {
        if (res.results.length == 0) {
          return null;
        }
        else {
          const g = this.viewHitToGraphic(res.results[0]);
          this.mapView.whenLayerView(g.layer).then(
            (layerView: FeatureLayerView) => {
              if (this.highLightFeature)
                this.highLightFeature.remove();
              this.highLightFeature = layerView.highlight(g)
            }
          )
          // this.store.dispatch(action_currentGraphic({ data: g }))
          // this.hightLightGraphic(g)
          return g;
        }
      }
    )
  }

  private viewHitToGraphic(viewHit: __esri.ViewHit) {
    if (viewHit.type === 'graphic')
      return viewHit.graphic
    return null
  }

}
