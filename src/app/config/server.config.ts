export class ServerConfig {

    static mapServerUrl = 'http://114.115.201.238:6080/arcgis/rest/services/mengjin/MapServer';
    static imageMapUrl = 'http://114.115.201.238:6080/arcgis/rest/services/mengjin_image/MapServer';
    static roadServerUrl = 'http://114.115.201.238:6080/arcgis/rest/services/mengjin_road/MapServer';

    static markFeasureUrl = "http://114.115.201.238:6080/arcgis/rest/services/mj/FeatureServer/0";
    static houseFeasureUrl = "http://114.115.201.238:6080/arcgis/rest/services/mj/FeatureServer/2";
    static buildingFeasureUrl = "http://114.115.201.238:6080/arcgis/rest/services/mj/FeatureServer/3";
    static rootPath = '/mjinfo/back/';
    static serverRoot = 'http://114.115.201.238';
    static imageDir = ServerConfig.serverRoot + '/mjmap/images/'
    static sqlPath = ServerConfig.rootPath + 'sql_1.php';
    // static uploadPath = ServerConfig.rootPath + 'upload.php';
    static uploadImagePath = ServerConfig.rootPath + 'uploadImage.php';
}