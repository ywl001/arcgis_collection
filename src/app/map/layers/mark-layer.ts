import MapView from "@arcgis/core/views/MapView";
import { LayerName } from "src/app/app-state/app-state";
import { ServerConfig } from "src/app/config/server.config";
import { BaseGraphicLayer } from "./base-graphic-layer";

export class MarkLayer extends BaseGraphicLayer {
    
    protected override layerName = LayerName.mark;

    constructor(mapView: MapView) {
        super(mapView);
        this.featureLayer.definitionExpression = `display_scale >= ${this.mapView.scale}`;
        console.log(this.definitionExpression);
    }

    protected override getUrl(): string {
        return ServerConfig.markFeasureUrl;
    }

    protected override getSymbol(data: any): any {
        var picName: string;
        if (data.symbol && data.symbol != ' ' && data.symbol != '通用') {
            picName = this.symbolServices.getPicName(data.symbol)
        } else {
            picName = 'qita.png'
        }

        const content = data.name
        return this.symbolServices.getSymbol(picName, content);
    }

    protected override extentChange(): void {
        this.featureLayer.definitionExpression = `display_scale >= ${this.mapView.scale}`
        this.refresh();
    }

}