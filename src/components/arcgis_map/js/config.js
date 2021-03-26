/* 在线天地图切片地图地址环境 */
export const onlineTdtDigitalURL =
  "http://{subDomain}.tianditu.gov.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&FORMAT=tiles&tk=5003bc22120f9d66a3276a29bf4be1ed";
export const onlineTdtAnooMarkerURL =
  "http://{subDomain}.tianditu.gov.cn/cva_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=c&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&FORMAT=tiles&tk=5003bc22120f9d66a3276a29bf4be1ed";
export const onlineTdtSatelliteURL =
  "http://{subDomain}.tianditu.gov.cn/img_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=c&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&FORMAT=tiles&tk=5003bc22120f9d66a3276a29bf4be1ed";


/* 在线高德切片地图地址环境 */
export const onlineAMapDigitalURL =
  "http://webst01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}";
export const onlineAMapSatelliteURL =
  "http://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}";
export const onlineAMapAnooMarkerURL =
  "http://webst01.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}";
