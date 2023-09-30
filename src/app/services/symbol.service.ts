import { Injectable } from '@angular/core';
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol.js";
import TextSymbol from "@arcgis/core/symbols/TextSymbol.js";

@Injectable({
  providedIn: 'root'
})
export class SymbolService {
  /**
   * 透明填空符号
   */
  public transparentFillSymbol = new SimpleFillSymbol({
    color: [0, 0, 0, 0],
    style: "solid",
    outline: {
      width: 1,
      color: [255, 255, 255, 1]
    }
  });


  private symbols = new Map(
    [
      ['厕所', 'cesuo.png'],
      ['超市', 'chaoshi.png'],
      ['宠物', 'chongwu.png'],
      ['蛋糕', 'dangao.png'],
      ['电影院', 'dianyingyuan.png'],
      ['度假村', 'dujiacun.png'],
      ['公园', 'gongyuan.png'],
      ['广场', 'guangchang.png'],
      ['加油站', 'jiayouzhan.png'],
      ['家政', 'jiazheng.png'],
      ['警察', 'jingchaju.png'],
      ['景区', 'jingqu.png'],
      ['金融', 'jinrong.png'],
      ['酒吧', 'jiuba.png'],
      ['酒店', 'jiudian.png'],
      ['歌厅', 'ktv.png'],
      ['理发', 'lifa.png'],
      ['美食', 'meishi.png'],
      ['其他', 'qita.png'],
      ['数码', 'shuma.png'],
      ['维修', 'weixiu.png'],
      ['物流', 'wuliu.png'],
      ['小区', 'xiaoqu.png'],
      ['写字楼', 'xiezilou.png'],
      ['洗浴按摩', 'xiyuanmo.png'],
      ['药店', 'yaodian.png'],
      ['医院', 'yiyuan.png'],
      ['幼儿园', 'youeryuan.png'],
      ['游泳馆', 'youyongguan.png'],
      ['照相馆', 'zhaoxiangguan.png'],
      ['政府', 'zhengfu.png'],
      ['诊所', 'zhensuo.png'],
      ['学校', 'zhongxiaoxue.png'],
      ['村庄', 'cunzhuang.svg'],
      ['饭店', 'meishi.png'],
      ['house', 'house_bg.png']
    ])

  constructor() {

  }


  getPicName(symboleName: string) {
    if (!this.symbols.get(symboleName))
      return 'qita.png'
    return this.symbols.get(symboleName)
  }

  getSymbol(picName: string, content: string) {
    return {
      type: "cim",
      data: {
        type: "CIMSymbolReference",
        symbol: {
          type: "CIMPointSymbol",
          symbolLayers: [
            this.getTextSymbol(content),
            this.getPicSymbol(picName)
          ]
        }
      }
    }
  }

  /**
   * 
   * @param content 文本内容
   * @param fontsize 文字大小
   * @param offsetX x偏移
   * @param offsetY y偏移
   * @param rotation 旋转角度
   * @param strokeWidth 线宽
   * @param colorPlan 配色方案，字符串
   * @returns 
   */
  getFillSymbol(
    content: string,
    fontsize = 10,
    offsetX = 0,
    offsetY = 0,
    rotation = 0,
    strokeWidth = 1,
    colorPlan: string = 'one') {

    let fillColor = this.getColor(colorPlan).fillColor;
    let strokeColor = this.getColor(colorPlan).strokeColor;

    return {
      type: "cim",
      data: {
        type: "CIMSymbolReference",
        symbol: {
          type: "CIMPointSymbol",
          symbolLayers: [
            this.getTextSymbol(content, fontsize, offsetX, offsetY, rotation),
            this.getFillSymbolLayer(fillColor),
            this.getStrokeSymbolLayer(strokeColor, strokeWidth)
          ]
        }
      }
    }
  }

  getHouseSymbol_1(content: string, fontsize = 10, offsetX = 0, offsetY = 0, rotation = 0) {
    return {
      type: "cim",
      data: {
        type: "CIMSymbolReference",
        symbol: {
          type: "CIMPointSymbol",
          symbolLayers: [
            this.getTextSymbol(content, fontsize, offsetX, offsetY, rotation),
          ]
        }
      }
    }
  }

  getHouseSymbol_2(content: string, fontsize = 10, rotation = 0, bgSize = 20) {
    return {
      type: "cim",
      data: {
        type: "CIMSymbolReference",
        symbol: {
          type: "CIMPointSymbol",
          symbolLayers: [
            this.getTextSymbol(content, fontsize, 0, 0, rotation, 'Center'),
            this.getPicSymbol('house_bg.png', bgSize, rotation)
            // this.getHouse(bgSize,rotation)
          ]
        }
      }
    }
  }

  private getPicSymbol(symbol: string, size = 14, angle = 0) {
    return {
      type: "CIMPictureMarker",
      enable: true,
      anchorPoint: {
        x: 0,
        y: 0
      },
      size: size,
      scaleX: 1,
      rotation: -angle,
      tintColor: [255, 255, 255, 255],
      url: `assets/symbol/${symbol}`
    }
  }

  public getTextSymbol(content: string, size = 10, offsetX = 8, offsetY = 0, rotation = 0, h_align = 'Left', color = [49, 49, 49, 255], fontFamily = "Microsoft Yahei") {
    return {
      type: "CIMVectorMarker",
      enable: true,
      size: size,
      colorLocked: true,
      anchorPointUnits: "Relative",
      frame: {
        xmin: -5,
        ymin: -5,
        xmax: 5,
        ymax: 5
      },
      markerGraphics: [{
        type: "CIMMarkerGraphic",
        geometry: {
          x: 0,
          y: 0
        },
        symbol: {
          type: "CIMTextSymbol",
          fontFamilyName: fontFamily,
          // fontStyleName: "Bold",
          height: size,
          horizontalAlignment: h_align,
          verticalAlignment: "Center",
          offsetX: offsetX,
          offsetY: offsetY,
          symbol: {
            type: "CIMPolygonSymbol",
            symbolLayers: [{
              type: "CIMSolidFill",
              enable: true,
              "color": color
            }]
          },
          angle: rotation
        },
        textString: content
      }],
      scaleSymbolsProportionally: true,
      respectFrame: true,
    }
  }

  getTextSymbol2() {
    return new TextSymbol({
      color: "white",
      haloColor: "black",
      haloSize: "1px",
      text: "You are here",
      xoffset: 3,
      yoffset: 3,
      font: {  // autocasts as new Font()
        size: 12,
        family: "Josefin Slab",
        // weight: "bold"
      }
    })
  }

  getFillSymbolLayer(color: number[] = [151, 219, 242, 255]) {
    return {
      "type": "CIMSolidFill",
      "enable": true,
      "color": color
    }
  }


  getStrokeSymbolLayer(color = [0, 0, 0, 255], width: number = 1) {
    return {
      "type": "CIMSolidStroke",
      "enable": true,
      "capStyle": "Round",
      "joinStyle": "Round",
      "lineStyle3D": "Strip",
      "miterLimit": 10,
      "width": width,
      "color": color
    }
  }

  getColor(colorPlan: string) {
    let fillColor = [227, 227, 227, 255];
    let strokeColor = [232, 204, 211, 255];

    if (colorPlan == 'two') {
      fillColor = [122, 254, 212, 255]
      strokeColor = [68, 226, 209, 255]
    } else if (colorPlan == 'three') {
      fillColor = [254, 250, 203, 128]
      strokeColor = [237, 236, 175, 255]
    }else if(colorPlan == 'pink'){
      fillColor = [250,18,178, 128]
      strokeColor = [250,18,178, 255]
    }

    return {
      fillColor: fillColor,
      strokeColor: strokeColor
    }

  }

  private getHouse(size=18,rotation=0) {
    return    {
      "type": "CIMVectorMarker",
      "enable": true,
      "anchorPointUnits": "Relative",
      "dominantSizeAxis3D": "Z",
      "size": size,
      "billboardMode3D": "FaceNearPlane",
      "frame": {
        "xmin": 0,
        "ymin": 0,
        "xmax": 421,
        "ymax": 285
      },
      "markerGraphics": [
        {
          "type": "CIMMarkerGraphic",
          "geometry": {
            "rings": [
              [
                [
                  55,
                  185
                ],
                [
                  211,
                  262
                ],
                [
                  364,
                  181
                ],
                [
                  364,
                  20
                ],
                [
                  364,
                  20
                ],
                [
                  55,
                  20
                ],
                [
                  55,
                  185
                ]
              ],
              [
                [
                  384,
                  0
                ],
                [
                  384,
                  170
                ],
                [
                  411,
                  156
                ],
                [
                  421,
                  173
                ],
                [
                  211,
                  285
                ],
                [
                  125,
                  242
                ],
                [
                  125,
                  278
                ],
                [
                  105,
                  278
                ],
                [
                  105,
                  232
                ],
                [
                  0,
                  179
                ],
                [
                  9,
                  161
                ],
                [
                  35,
                  175
                ],
                [
                  35,
                  0
                ],
                [
                  384,
                  0
                ]
              ]
            ]
          },
          "symbol": {
            "type": "CIMPolygonSymbol",
            "symbolLayers": [
              {
                "type": "CIMSolidFill",
                "enable": true,
                "color": [
                  245,
                  165,
                  25,
                  255
                ]
              }
            ]
          }
        }
      ],

      
      "rotation": -rotation
    }
  }
}

