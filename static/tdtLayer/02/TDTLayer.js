// 切片线划图
define(["dojo/_base/declare", "esri/layers/TiledMapServiceLayer", "esri/geometry/Extent", "esri/SpatialReference", "esri/layers/TileInfo"],
  function (declare, TiledMapServiceLayer, Extent, SpatialReference, TileInfo) {
    return declare(esri.layers.TiledMapServiceLayer, {
      constructor: function () {
        this.spatialReference = new esri.SpatialReference({
          wkid: 102100
        });
        this.initialExtent = (this.fullExtent = new Extent(-1.9926188851995632E7, -3.0240971958377518E7, 1.9926188851995632E7, 3.0240971958377518E7, this.spatialReference));
        this.tileInfo = new esri.layers.TileInfo({
          "rows": 256,
          "cols": 256,
          "dpi": 90.71428571427429,
          "origin": {
            "x": -2.00375083427892E7,
            "y": 2.00375083427892E7,
            "spatialReference": {
              "wkid": 102100
            }

          },
          "spatialReference": {
            "wkid": 102100
          },
          "lods": [{
              "level": 1,
              "levelValue": "2",
              "resolution": 78271.51696401063,
              "scale": 2.958293554545284E8
            },
            {
              "level": 2,
              "levelValue": "3",
              "resolution": 39135.758482005316,
              "scale": 1.479146777272642E8
            },
            {
              "level": 3,
              "levelValue": "4",
              "resolution": 19567.879241002658,
              "scale": 7.39573388636321E7
            },
            {
              "level": 4,
              "levelValue": "5",
              "resolution": 9783.939620501329,
              "scale": 3.697866943181605E7
            },
            {
              "level": 5,
              "levelValue": "6",
              "resolution": 4891.9698102506645,
              "scale": 1.8489334715908024E7
            },
            {
              "level": 6,
              "levelValue": "7",
              "resolution": 2445.9849051253323,
              "scale": 9244667.357954012
            },
            {
              "level": 7,
              "levelValue": "8",
              "resolution": 1222.9924525626661,
              "scale": 4622333.678977006
            },
            {
              "level": 8,
              "levelValue": "9",
              "resolution": 611.4962262813331,
              "scale": 2311166.839488503
            },
            {
              "level": 9,
              "levelValue": "10",
              "resolution": 305.74811314066653,
              "scale": 1155583.4197442515
            },
            {
              "level": 10,
              "levelValue": "11",
              "resolution": 152.87405657033327,
              "scale": 577791.7098721258
            },
            {
              "level": 11,
              "levelValue": "10",
              "resolution": 76.43702828516663,
              "scale": 288895.8549360629
            },
            {
              "level": 12,
              "levelValue": "13",
              "resolution": 38.21851414258332,
              "scale": 144447.92746803144
            },
            {
              "level": 13,
              "levelValue": "14",
              "resolution": 19.10925707129166,
              "scale": 72223.96373401572
            },
            {
              "level": 14,
              "levelValue": "15",
              "resolution": 9.55462853564583,
              "scale": 36111.98186700786
            },
            {
              "level": 15,
              "levelValue": "16",
              "resolution": 4.777314267822915,
              "scale": 18055.99093350393
            },
            {
              "level": 16,
              "levelValue": "17",
              "resolution": 2.3886571339114573,
              "scale": 9027.995466751965
            },
            {
              "level": 17,
              "levelValue": "18",
              "resolution": 1.1943285669557286,
              "scale": 4513.9977333759825
            },
            {
              "level": 18,
              "levelValue": "19",
              "resolution": 0.5971642834778643,
              "scale": 2256.9988666879913
            },
            {
              "level": 19,
              "levelValue": "20",
              "resolution": 0.29858214173893216,
              "scale": 1128.4994333439956
            },
            {
              "level": 20,
              "levelValue": "21",
              "resolution": 0.13229193125052918,
              "scale": 500
            },
            {
              "level": 21,
              "levelValue": "22",
              "resolution": 0.06614596562526459,
              "scale": 250
            }
          ]
        });
        this.loaded = true;
        this.onLoad(this);
      },
      getTileUrl: function (level, row, col) {
        return "http://t" + col % 8 + ".tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&TILEMATRIX=" + level + "&TILEROW=" + row + "&TILECOL=" + col + "&FORMAT=tiles&tk=5003bc22120f9d66a3276a29bf4be1ed";
      }
    });
  });
