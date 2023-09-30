import { Injectable, Type } from '@angular/core';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import { Subject } from 'rxjs';
import { BuildingPlan, EditFeature, EditGeo, ShowImage } from '../app-state/app-state';
import { KinshipNode } from '../app-state/model/kinship';




export enum MessageType {
  closeInfowindow = 'closeInfoWindow',
  startPickMapPoint = 'startMove',
  refreshMark = 'refreshMark',
  clickMap = 'clickMap',
  uploadFile = 'uploadFile',
  closePeoplePlanel = 'closePeoplePlanel',
  saveLocation = "saveLocation"
}

@Injectable({
  providedIn: 'root',
})
export class MessageService {

  constructor() {}

  private _showInfoWindow = new Subject<Type<unknown>>();
  showInfoWindow$ = this._showInfoWindow.asObservable();
  showInfoWindow<T>(p:Type<T>) {
    this._showInfoWindow.next(p);
  }

  private _message = new Subject<MessageType>();
  message$ = this._message.asObservable();
  sendMessage(m:MessageType) {
    this._message.next(m);
  }

  private _uploadImage = new Subject<any>();
  uploadImage$ = this._uploadImage.asObservable();
  uploadImage(uploadData:any) {
    this._uploadImage.next(uploadData);
  }

  private _showImage = new Subject<ShowImage>();
  showImage$ = this._showImage.asObservable();
  showImage(data:ShowImage) {
    this._showImage.next(data);
  }

  private _showBuildPlan = new Subject<BuildingPlan>();
  showBuildPlan$ = this._showBuildPlan.asObservable();
  showBuildPlan(data:BuildingPlan) {
    this._showBuildPlan.next(data);
  }

  private _editGeo = new Subject<EditGeo>();
  editGeo$ = this._editGeo.asObservable();
  editGeo(data:EditGeo) {
    this._editGeo.next(data);
  }

  private _getNodesSuccess = new Subject<KinshipNode[]>();
  getNodesSuccess$ = this._getNodesSuccess.asObservable();
  getNodesSuccess(data:KinshipNode[]) {
    this._getNodesSuccess.next(data);
  }

  private _reLayoutChart = new Subject();
  reLayoutChart$ = this._reLayoutChart.asObservable();
  reLayoutChart() {
    this._reLayoutChart.next(null);
  }

  private _changeLayer = new Subject();
  changeLayer$ = this._changeLayer.asObservable();
  changeLayer() {
    this._changeLayer.next(null);
  }

  private _getPoint = new Subject<Point>();
  pickMapPoint$ = this._getPoint.asObservable();
  pickMapPoint(p:Point) {
    this._getPoint.next(p);
  }

  private _isShowBusyIcon = new Subject<boolean>();
  isShowBusyIcon$ = this._isShowBusyIcon.asObservable();
  isShowBusyIcon(isShow:boolean) {
    this._isShowBusyIcon.next(isShow);
  }

  private _selectGraphic = new Subject<Graphic>();
  selectGraphic$ = this._selectGraphic.asObservable();
  selectGraphic(g:Graphic) {
    this._selectGraphic.next(g);
  }

  private _editFeature = new Subject<EditFeature>();
  editFeature$ = this._editFeature.asObservable();
  editFeature(data:EditFeature) {
    this._editFeature.next(data);
  }

  private _clearTopContainer = new Subject<null>();
  clearTopContainer$ = this._clearTopContainer.asObservable();
  clearTopContainer() {
    this._clearTopContainer.next(null);
  }

  private _delGraphic = new Subject<Graphic>();
  delGraphic$ = this._delGraphic.asObservable();
  delGraphic(g:Graphic) {
    this._delGraphic.next(g)
  }

}

