import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';


export enum FeatureKey {
    appState = 'appState',
    peopleState = 'peopleState',
    nodeState = 'nodeState'
}

/**
 * 编辑要素的数据
 */
export interface EditFeature {
    action: EditAction;
    layerName: string;
    feature: Graphic
}

/**
 * 编辑要素的类型
 */
export enum EditAction {
    del, add, update
}

export interface EditGeo {
    action: EditGeoAction;
    feature: Graphic
}

export enum EditGeoAction {
    transform = 'transform',
    reshape = 'reshape',
    move = 'move'
}

export interface AppState {
    editFeature?: EditFeature;
    currentBuilding?: Building;
    currentGraphic?: Graphic;
}


export interface Building {
    objectid: number;
    name: string
    community: string
    count_floor: number
    count_unit: number
    count_home: number
    display_name: string
    id: number
    building_name: string
    layer_name: string
    sort_type: number
}

export interface BuildingPlan {
    building: Building,
    peoples: People[]
}
export enum SortType {
    lianxu = 1,
    danyuan = 2
}

export enum LayerName {
    mark = 'mark',
    building = 'building',
    house = 'house',
    road = 'road'
}

export interface MapClickEvent {
    mapPoint: Point,
    x: Number,
    y: Number,
    button: Number,
    type: 'click',
}

export interface UploadImage {
    imageDir: string;
    objectid: number;
}

export interface Mark {
    objectid?: number;
    name?: string,
    display_scale?: number,
    angle?: number
    symbol?: string,
    telephone?: string,
    describe?: string
}

export interface MarkImage {
    id: number;
    mark_id: number,
    image_url: string,
    thumb_url: string,
    insert_user: string,
    insert_time: string
}

export interface ShowImage {
    images: MarkImage[];
    index: number;
    ownerId: number;
    table: string;
}

export enum MarkField {
    displayScale = 'display_scale'
}

export interface People {
    id?: number
    pid?: string
    name?: string
    name_pinyin?: string
    sex?: string
    birthday?: string
    nation?: string
    telephone?: string
    is_dead?: string
    father_id?: string
    mother_id?: string
    station?: string
    community?: string
    workplace?: string

    photos?:string[]

    thumb_url?:string;

    room_number?: string
    building_id?: number
    is_delete?: number
}

