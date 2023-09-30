import { Component, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import Graphic from '@arcgis/core/Graphic';
import { LayerName } from './app-state/app-state';
import { BuildingComponent } from './building/building.component';
import { HouseComponent } from './house/house.component';
import { MessageService } from './services/message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'arcgis_collection';

  @ViewChild('topContainer', { static: false, read: ViewContainerRef }) topContainer: ViewContainerRef;

  constructor(private message: MessageService, private readonly renderer: Renderer2) { }

  ngOnInit() {
    console.log('app init');
    this.message.selectGraphic$.subscribe(res => {
      const objid = res.attributes.objectid;
      const layerName = res.attributes.layer_name;
      if (layerName == LayerName.building) {
        this.editBuilding(res)
      } else if (layerName == LayerName.house) {
        this.editHouse(res)
      }
    })

    this.message.clearTopContainer$.subscribe(res => {
      this.topContainer.clear();
    })
  }


  private editBuilding(g: Graphic) {
    const building = this.topContainer.createComponent(BuildingComponent);
    building.instance.graphic = g;
  }

  private editHouse(g: Graphic) {
    const building = this.topContainer.createComponent(HouseComponent);
    building.instance.graphic = g;
  }

  onChangeLayer() {
    console.log('click layer')
    this.message.changeLayer()
  }



  // private setTopContainerContent(component:any){
  //   const compontRef = this.topContainer.createComponent(component);
  //   compontRef.data
  // }
}
