//地图服务配置
const mapconfig = {
	jsapi: 'http://58.213.48.106/arcgis_js_api/library/3.27/3.27/init.js', //ArcGIS js API地址
	esricss: 'http://58.213.48.106/arcgis_js_api/library/3.27/3.27/esri/css/esri.css', //ArcGIS js API样式地址
    clarocss: 'http://58.213.48.106/arcgis_js_api/library/3.27/3.27/dijit/themes/claro/claro.css', //ArcGIS js API样式地址
	
	lsbasemap: 'http://58.213.48.104/arcgis/rest/services/NJ08/LS081/MapServer', //溧水
	tzbasemap:'http://58.213.48.106/arcgis/rest/services/TZPS/TZDXT/MapServer', //通州
	jnbasemap:'http://58.213.48.106/arcgis/rest/services/NJ08/JNDXT/MapServer', //江宁
	
	basemap: 'http://58.213.48.106:6080/arcgis/rest/services/NJ08/NJDXT20180830/MapServer', //南京市基础底图
	basemapview: 'http://58.213.48.106:6080/arcgis/rest/services/NJ08/NJ08dom1M/MapServer', //基础影像图
	GeometryService: 'http://58.213.48.106:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer', //ArcGIS Server空间服务
	extent: {
		spatialReference: { // 鼓楼区初始化定位
			wkid: 0,
			latestWkid: 0
		},
		type: 'extent',
		xmin: 323510.2165000001,
		ymin: 345299.5855999999,
		xmax: 331744.7149,
		ymax: 356750.94739999995
	},// 初始化定位
	extent_lyg: { // 连云港初始化定位  --天地图
		spatialReference: {
			wkid: 0,
			latestWkid: 0
		},
		type: 'extent',
		xmax: 13311022.447,
		xmin: 13245171.947,
		ymax: 4139941.759,
		ymin: 4108946.544
	},
};

export default mapconfig
