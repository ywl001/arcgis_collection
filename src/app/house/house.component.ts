import { Component } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { EditAction, EditFeature, LayerName } from '../app-state/app-state';
import { PhpFunc } from '../config/phpFunc';
import { MessageService } from '../services/message.service';
import { SqlService } from '../services/sql.service';

@Component({
  selector: 'app-house',
  templateUrl: './house.component.html',
  styleUrls: ['./house.component.scss']
})
export class HouseComponent {
  data: any = {}
  towns = ['白鹤镇', '小浪底镇', '朝阳镇', '送庄镇', '会盟镇', '平乐镇', '城关镇', '麻屯镇', '常袋镇', '横水镇', '河阳街道', '吉利街道', '康乐街道', '西霞街道']

  names: any[];

  getHouseName(item: any) {
    if (item.community) {
      return item.name + ':' + item.community
    } else {
      return item.name + ':' + item.pid.substring(6, 10) + '-' + item.pid.substring(10, 12) + '-' + item.pid.substring(12, 14)
    }
  }

  private _houseName;
  public get houseName() {
    return this._houseName;
  }
  public set houseName(value) {
    this._houseName = value;
    this.data.name = value;
    console.log(this.houseName)
  }

  private _graphic;
  public get graphic() {
    return this._graphic;
  }
  public set graphic(value) {
    this._graphic = value;
    this.data = value.attributes;
    console.log(this.data)
  }

  constructor(private message: MessageService, private sql: SqlService) { }

  onSubmit() {
    console.log(this.data)
    const data: EditFeature = {
      action: EditAction.update,
      feature: this.graphic,
      layerName: LayerName.house
    }
    console.log(this.graphic.attributes);

    this.message.editFeature(data);

    this.message.clearTopContainer()
    // this.store.dispatch(action_editFeature({ data: data }))
  }

  onCancel() {
    this.message.clearTopContainer();
  }

  onNameChange() {
    if (this.houseName.length >= 2) {
      console.log(this.houseName);
      const data = {
        inputType: 6,
        input: this.houseName
      }
      if (this.isChinese(this.houseName)) {
        this.sql.exec(PhpFunc.selectPeoplesBySearch, data).subscribe(res => {
          this.names = res;
        })
      }
    }
  }

  onSelectName(e:MatAutocompleteSelectedEvent){
    console.log(e.option.value)
  }

  private isChinese(str: string) {
    const re = /^[\u4E00-\u9FA5]+$/g;
    if (!re.test(str)) return false;
    return true;
  }
}
