import MapView from "@arcgis/core/views/MapView";
import { LayerName } from "../../app-state/app-state";
import { ServerConfig } from "../../config/server.config";
import { BaseGraphicLayer } from "./base-graphic-layer";

export class HouseLayer extends BaseGraphicLayer {

    //点图层house

    protected override layerName = LayerName.house;

    constructor(mapView: MapView) {
        super(mapView);
        this.layerName = LayerName.house;
        this.minScale = 2000;
    }

    protected override getUrl(): string {
        return ServerConfig.houseFeasureUrl;
    }

    protected override getSymbol(data: any): any {
        const fontsize = this.getFontsize();
        // console.log('house fontsize:',fontsize)
        const offsetX = -(data.name?.length * fontsize / 2) * Math.cos(data.angle * Math.PI / 180);
        const offsetY = -(data.name?.length * fontsize / 2) * Math.sin(data.angle * Math.PI / 180);
        if(data.zjddm){
            return this.symbolServices.getHouseSymbol_1(data.name, fontsize, offsetX, offsetY, -data.angle)
        }else{
            return this.symbolServices.getHouseSymbol_2(data.name,fontsize, 360-data.angle,this.getBgsize())
        }
    }

    protected override extentChange(): void {
        if (this.mapView.scale <= 2000) {
            this.refresh();
        } else {
            this.graphics.removeAll();
        }
    }

    private getFontsize(){
        const scale = this.mapView.scale;
        // console.log(scale)
        if(scale <=2000 && scale >=1000){
            return 7;
        }else if(scale <1000 && scale >=500){
            return 10;
        }else if(scale <500 && scale >=250){
            return 14;
        }
        return 10;
    }

    private getBgsize(){
        const scale = this.mapView.scale;
        // console.log(scale)
        if(scale <2000 && scale >=1000){
            return 14;
        }else if(scale <1000 && scale >=500){
            return 25;
        }else if(scale <500 && scale >=250){
            return 50;
        }
        return 10;
    }

}