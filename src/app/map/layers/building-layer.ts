import MapView from "@arcgis/core/views/MapView";
import { LayerName } from "../../app-state/app-state";
import { ServerConfig } from "../../config/server.config";
import { BaseGraphicLayer } from "./base-graphic-layer";

export class BuildingLayer extends BaseGraphicLayer {

    protected override layerName = LayerName.building

    constructor(mapView: MapView) {
        super(mapView);
        this.minScale = 8000;
    }

    protected override getUrl(): string {
        return ServerConfig.buildingFeasureUrl;
    }

    protected override getSymbol(data: any): any {
        const fontsize = this.getFontsize();
        // console.log('building fontsize:',fontsize)
        const offsetX = -(data.name?.length * fontsize / 2) * Math.cos(data.angle * Math.PI / 180);
        const offsetY = -(data.name?.length * fontsize / 2) * Math.sin(data.angle * Math.PI / 180);
        return this.symbolServices.getFillSymbol(data.name, fontsize, offsetX, offsetY, data.angle, 1, 'one')
    }

    protected override extentChange(): void {
        // console.log("building layer extent change")
        if (this.mapView.scale <= 8000) {
            this.refresh();
        } else {
            this.graphics.removeAll();
        }
    }

    private getFontsize() {
        const scale = this.mapView.scale;
        // console.log(scale)
        if (scale >= 4000) {
            return 7;
        } else if (scale < 4000 && scale >= 2000) {
            return 10;
        } else if (scale < 2000 && scale >= 1000) {
            return 14;
        } else if (scale < 1000 && scale >= 500) {
            return 18;
        } else if (scale < 500 && scale >= 250) {
            return 22;
        }
        return 10;
    }
}