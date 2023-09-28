import { Component } from '@angular/core';
import { EditAction, EditFeature, LayerName } from '../app-state/app-state';
import { LocalStorgeService } from '../services/local-storge.service';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-building',
  templateUrl: './building.component.html',
  styleUrls: ['./building.component.scss']
})
export class BuildingComponent {
  data:any={};

  towns=['白鹤镇','小浪底镇','朝阳镇','送庄镇','会盟镇','平乐镇','城关镇','麻屯镇','常袋镇','横水镇','河阳街道','吉利街道','康乐街道','西霞街道']

  private _graphic;
  public get graphic() {
    return this._graphic;
  }
  public set graphic(value) {
    this._graphic = value;
    this.data = value.attributes;
    console.log(this.data)
    this.setInitValue();
  }

  private _xiaoqu: string;
  public get xiaoqu(): string {
    return this._xiaoqu;
  }
  public set xiaoqu(value: string) {
    this._xiaoqu = value;
    this.data.xiaoqu = value;
    this.data.building_name = value + this.louhao + '号楼'
  }

  private _louhao: string;
  public get louhao(): string {
    return this._louhao;
  }
  public set louhao(value: string) {
    this._louhao = value;
    this.data.name = value;
    this.data.building_name = this.xiaoqu + value + '号楼'
  }

  constructor(private message:MessageService,private local:LocalStorgeService){}

  onSubmit(){
    console.log(this.data)
    const data: EditFeature = {
      action: EditAction.update,
      feature: this.graphic,
      layerName: LayerName.building
    }
    console.log(this.graphic.attributes);
    this.saveLocal();
    
    this.message.editFeature(data);

    this.message.clearTopContainer()
    // this.store.dispatch(action_editFeature({ data: data }))
  }

  private saveLocal(){
    this.local.set('town',this.data.town)
    this.local.set('community',this.data.community)
    this.local.set('xiaoqu',this.data.xiaoqu)
  }

  private setInitValue(){
    if(!this.data.community){
      this.data.community = this.local.get('community');
    }

    if(!this.data.town){
      this.data.town = this.local.get('town');
    }

    if(this.data.xiaoqu){
      this.xiaoqu = this.data.xiaoqu
    }else{
      this.xiaoqu = this.local.get('xiaoqu')
    }

    if(this.data.name){
      this.louhao = this.data.name
    }
  }

  onCancel(){
    this.message.clearTopContainer();
  }
}
