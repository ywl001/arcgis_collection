import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { EditAction, EditFeature, LayerName } from '../app-state/app-state';
import { CompassComponent } from '../compass/compass.component';
import { PhpFunc } from '../config/phpFunc';
import { LocalStorgeService } from '../services/local-storge.service';
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

  title:string;

  housNameControl:FormControl = new FormControl('')

  getHouseName(item: any) {
    if (item.community) {
      return item.name + ':' + item.community
    } else {
      return item.name + ':' + item.pid.substring(6, 10) + '-' + item.pid.substring(10, 12) + '-' + item.pid.substring(12, 14)
    }
  }

  private _graphic;
  public get graphic() {
    return this._graphic;
  }
  public set graphic(value) {
    this._graphic = value;
    console.log('house set data',value.attributes)
    this.data = value.attributes;
    this.housNameControl.setValue(value.attributes.name);
    this.setInitValue()

    console.log(this.data)
  }

  constructor(private message: MessageService, 
    private sql: SqlService,
    private dialog:MatDialog,
    private local:LocalStorgeService) { }

  ngOnInit(){
    this.housNameControl.valueChanges.subscribe(val=>{
      if(val.name){
        this.data.name = val.name
      }else{
        this.data.name = val;
      }
      if (val.length >= 2) {
        const data = {
          inputType: 6,
          input: val
        }
        if (this.isChinese(val)) {
          this.sql.exec(PhpFunc.selectPeoplesBySearch, data).subscribe(res => {
            this.names = res;
          })
        }
      }
    })
  }

  onSubmit() {
    console.log(this.data)
    const action = this.data.objectid ? EditAction.update : EditAction.add;

    const data: EditFeature = {
      action: action,
      feature: this.graphic,
      layerName: LayerName.house
    }

    this.saveLocal()

    this.message.editFeature(data);
    this.message.clearTopContainer()
  }

  onCancel() {
    this.message.clearTopContainer();
  }

  displayFunc(p){
    console.log('display func ....')
    if(typeof p == 'string'){
      return p;
    }else{
      return p?.name
    }
  }

  onSelectName(e:MatAutocompleteSelectedEvent){
    this.data.home_number = e.option.value.pid
  }

  onDirectionFocus(){
    const dialogRef = this.dialog.open(CompassComponent);
    const compass = dialogRef.componentRef.instance;

    compass.inputAngle = -parseInt(this.data.angle);
    compass.angle.subscribe(value=>{
      this.data.angle = -value +'' ;
      dialogRef.close();
    })
  }

  private isChinese(str: string) {
    const re = /^[\u4E00-\u9FA5]+$/g;
    if (!re.test(str)) return false;
    return true;
  }

  private saveLocal(){
    this.local.set('town',this.data.town)
    this.local.set('community',this.data.community)
    this.local.set('angle',this.data.angle)
  }

  private setInitValue(){
    if(!this.data.community){
      this.data.community = this.local.get('community');
    }

    if(!this.data.town){
      this.data.town = this.local.get('town');
    }

    if(!this.data.angle){
      this.data.angle = this.local.get('angle');
    }
  }

}
