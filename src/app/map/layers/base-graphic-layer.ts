import Graphic from "@arcgis/core/Graphic";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Query from "@arcgis/core/rest/support/Query";
import Symbol from "@arcgis/core/symbols/Symbol.js";
import MapView from "@arcgis/core/views/MapView";
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel.js";
// import { AppInjector } from "../../app-injector";
import { AppInjector } from "src/app/app-injector";
import { EditAction } from "../../app-state/app-state";
import { MessageService } from "../../services/message.service";
import { SymbolService } from "../../services/symbol.service";

export abstract class BaseGraphicLayer extends GraphicsLayer {

    featureLayer: FeatureLayer;
    mapView: MapView;
    private message: MessageService;

    symbolServices: SymbolService;

    protected abstract layerName;

    protected definitionExpression = ''

    private sketchViewModel

    constructor(mapView: MapView) {
        super();
        this.mapView = mapView;
        const injector = AppInjector.getInjector();
        this.message = injector.get(MessageService)
        this.symbolServices = injector.get(SymbolService)

        this.initLayer();

        this.sketchViewModel = new SketchViewModel({
            view: this.mapView,
            layer: this,
            updateOnGraphicClick: false,
            defaultUpdateOptions: {
                // set the default options for the update operations
                toggleToolOnClick: false // only reshape operation will be enabled
            }
        });

        reactiveUtils.watch(
            () => this.mapView.stationary === true,
            () => {
                this.extentChange();
            }
        )

        // this.store.select(selector_editFeature).pipe(
        //     filter((data) => Boolean(data))
        // ).subscribe(res => {
        //     if (res.layerName == this.layerName) {
        //         this.applyEdit(res.action, res.feature).then((res) => {
        //             this.refresh()
        //         })
        //     }
        // })

        this.message.editGeo$.subscribe((res) => {
            if (res.feature.attributes.layer_name == this.layerName) {
                this.sketchViewModel.update([res.feature], { tool: res.action });
            }
        })

        this.message.editFeature$.subscribe(data => {
            if (data.layerName == this.layerName) {
                this.applyEdit(data.action, data.feature).then((res) => {
                    this.refresh()
                })
            }
        })
    }

    private initLayer() {
        this.featureLayer = new FeatureLayer({
            url: this.getUrl(),
            definitionExpression: this.definitionExpression
        })

        this.featureLayer.load().then(() => {
            this.refresh();
        })
    }

    protected abstract getUrl(): string

    public refresh() {
        const q: Query = this.featureLayer.createQuery();
        q.geometry = this.mapView.extent;

        this.featureLayer.queryFeatures(q).then(res => {
            // console.log(res.features.length)
            let newData = res.features;
            // this.processData(newData, this.markLayer.graphics);
            this.graphics.removeAll();
            // console.time('add graphic')
            newData.forEach(graphic => {
                graphic.symbol = this.getSymbol(graphic.attributes);
                this.add(graphic)
            })

            // console.timeEnd('add graphic')
        })
    }

    protected abstract getSymbol(data: any): Symbol

    protected abstract extentChange(): void;

    private applyEdit(action: EditAction, g: Graphic) {
        if (action == EditAction.del) {
            return this.featureLayer.applyEdits({ deleteFeatures: [g] })
        } else if (action == EditAction.add) {
            return this.featureLayer.applyEdits({ addFeatures: [g] })
        } else if (action == EditAction.update) {
            return this.featureLayer.applyEdits({ updateFeatures: [g] })
        } else {
            return Promise.resolve(null);
        }
    }
}