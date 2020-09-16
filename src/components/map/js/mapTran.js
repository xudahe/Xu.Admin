/* WKT与arcgis geometry转换
author: Yuankang 
*/

var WKTUtil = function (options) {
	this.initialize(options);
}

WKTUtil.prototype = {
  /** 
   * Constructor: OpenLayers.Format.WKT 
   * Create a new parser for WKT 
   * 
   * Parameters: 
   * options - {Object} An optional object whose properties will be set on 
   *           this instance 
   * 
   * Returns: 
   * {<OpenLayers.Format.WKT>} A new WKT parser. 
   */
	initialize: function (options) {
		this.regExes = {
			'typeStr': /^\s*(\w+)\s*\s*(.*)\s*\s*$/,
			'spaces': /\s+/,
			'parenComma': /\)\s*,\s*\(/,
			'doubleParenComma': /\)\s*\)\s*,\s*\(\s*\(/, // can't use {2} here  
			'trimParens': /^\s*?(.*?)?\s*$/
		};
		for (var i in options) {
			this[i] = options[i];
		}
	},

  /** 
   * APIMethod: read 
   * Deserialize a WKT string and return a vector feature or an 
   * array of vector features.  Supports WKT for POINT, MULTIPOINT, 
   * LINESTRING, MULTILINESTRING, POLYGON, MULTIPOLYGON, and 
   * GEOMETRYCOLLECTION. 
   * 
   * Parameters: 
   * wkt - {String} A WKT string 
   * 
   * Returns: 
   * {<OpenLayers.Feature.Vector>|Array} A feature or array of features for 
   * GEOMETRYCOLLECTION WKT. 
   */
	read: function (wkt) {
		var features, type, str;
		wkt = wkt.replace(/[\n\r]/g, '');
		var matches = this.regExes.typeStr.exec(wkt);

		if (matches) {
			 
			type = matches[1].toLowerCase();
			str = matches[2];
			if (type == 'multipolygon')
			{
			str = str.substr(3, str.length - 6);
		    }
			else{
				str=str.replace(new RegExp('^\\(*|\\)*$', 'g'), '').trim();
			}
			// if (type == 'multipolygon')
			// 	str = str.substr(3, str.length - 6);
			// else if (type == 'linestring'||type=='point')
			// {
			// 	str = str.substr(1, str.length -3);
			// }
			// else 
			// {
			// 	str = str.substr(2, str.length - 4);
			// }
			
			//str=str.trim('(').trim('(').trim('(').trim(')').trim(')').trim(')').trim();
		   str=str.trim();
			if (this.parse[type]) {
				features = this.parse[type].apply(this, [str]);
			}
		}
		return features;
	},

  /** 
   * Method: extractGeometry 
   * Entry point to construct the WKT for a single Geometry object. 
   * 
   * Parameters: 
   * geometry - {<OpenLayers.Geometry.Geometry>} 
   * 
   * Returns: 
   * {String} A WKT string of representing the geometry 
   */
	extractGeometry: function (geometry) {
		var type = geometry.CLASS_NAME.split('.')[2].toLowerCase();
		if (!this.extract[type]) {
			return null;
		}
		if (this.internalProjection && this.externalProjection) {
			geometry = geometry.clone();
			geometry.transform(this.internalProjection, this.externalProjection);
		}
		var wktType = type == 'collection' ? 'GEOMETRYCOLLECTION' : type.toUpperCase();
		var data = wktType + '(' + this.extract[type].apply(this, [geometry]) + ')';
		return data;
	},

	trim: function (str) {
		return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	},
  /** 
   * Object with properties corresponding to the geometry types. 
   * Property values are functions that do the actual parsing. 
   */
	parse: {
    /** 
     * Return point feature given a point WKT fragment. 
     * @param {String} str A WKT fragment representing the point 
     * @returns {OpenLayers.Feature.Vector} A point feature 
     * @private 
     */
		'point': function (str) {
			var coords = this.trim(str).split(this.regExes.spaces);
			return coords; //new esri.geometry.Point(coords[0], coords[1]);  
		},

    /** 
     * Return a multipoint feature given a multipoint WKT fragment. 
     * @param {String} str A WKT fragment representing the multipoint 
     * @returns {OpenLayers.Feature.Vector} A multipoint feature 
     * @private 
     */
		'multipoint': function (str) {
			var point;
			var points = this.trim(str).split(',');
			var components = [];
			for (var i = 0, len = points.length; i < len; ++i) {
				point = points[i].replace(this.regExes.trimParens, '$1');
				components.push(this.parse.point.apply(this, [point]).geometry);
			}
			return new OpenLayers.Feature.Vector(
				new OpenLayers.Geometry.MultiPoint(components)
			);
		},

    /** 
     * Return a linestring feature given a linestring WKT fragment. 
     * @param {String} str A WKT fragment representing the linestring 
     * @returns {OpenLayers.Feature.Vector} A linestring feature 
     * @private 
     */
		'linestring': function (str) {
			var points = this.trim(str).split(',');

			var components = [];
			for (var i = 0, len = points.length; i < len; ++i) {
				components.push(this.parse.point.apply(this, [points[i]]));
			}
			return components //new esri.geometry.Polyline(components);  
		},

    /** 
     * Return a multilinestring feature given a multilinestring WKT fragment. 
     * @param {String} str A WKT fragment representing the multilinestring 
     * @returns {OpenLayers.Feature.Vector} A multilinestring feature 
     * @private 
     */
		'multilinestring': function (str) {
			var line;
			var lines = this.trim(str).split(this.regExes.parenComma);
			var components = [];
			for (var i = 0, len = lines.length; i < len; ++i) {
				line = lines[i].replace(this.regExes.trimParens, '$1');
				components.push(this.parse.linestring.apply(this, [line]));
				// let points=line.split(',');
				// for(let j=0;j<points.length;j++)
				// {
				// 	let ring=points[i];
				// 	components.push(this.parse.point.apply(this, [ring]));
				// }
			}
			return components;
		},

    /** 
     * Return a polygon feature given a polygon WKT fragment. 
     * @param {String} str A WKT fragment representing the polygon 
     * @returns {OpenLayers.Feature.Vector} A polygon feature 
     * @private 
     */
		'polygon': function (str) {
			var ring, linestring, linearring;
			var rings = this.trim(str).split(this.regExes.parenComma);

			var components = [];
			for (var i = 0, len = rings.length; i < len; ++i) {
				ring = rings[i].replace(this.regExes.trimParens, '$1');
				linestring = this.parse.linestring.apply(this, [ring]);
				components.push(linestring);
			}
			return components;
		},

		'multipolygon': function (str) {
			var ring, linestring, linearring;
			var rings = this.trim(str).split(this.regExes.parenComma);

			var components = [];
			for (var i = 0, len = rings.length; i < len; ++i) {
				ring = rings[i].replace(this.regExes.trimParens, '$1');
				ring = ring.replace('(', ' ').replace(')', ' ');
				linestring = this.parse.linestring.apply(this, [ring]);
				components.push(linestring);
			}
			return components;
		}
	}
}

//wkt转化成arcgis的Point对象
export function WktToPoint(wkt, spatialreference) {
	var wktUtil = new WKTUtil();
	var pt = wktUtil.read(wkt);
	var json = {
		x: pt[0],
		y: pt[1],
		spatialReference: spatialreference
	}
	var point = new esri.geometry.Point(json);
	return point;
}

//wkt转化成arcgis的Polyline对象
export function WktToPolyline(wkt, spatialreference) {
	var wktUtil = new WKTUtil();
	var points = wktUtil.read(wkt);
	var json = {
		paths: [points],
		spatialReference: spatialreference
	}
	var polyline = new esri.geometry.Polyline(json);
	return polyline;
}

//wkt转化成arcgis的Polygon对象
export function WktToPolygon(wkt, spatialreference) {
	var wktUtil = new WKTUtil();
	var points = wktUtil.read(wkt);
	var json = {
		rings: points,
		spatialReference: spatialreference
	}
	var polygon = new esri.geometry.Polygon(json);
	return polygon;
}

//wkt转化成arcgis的Polyline对象
export function WktToMulyiPolyline(wkt, spatialreference) {
	var wktUtil = new WKTUtil();
	var points = wktUtil.read(wkt);
	var json = {
		rings: points,
		spatialReference: spatialreference
	}
	var polygon = new esri.geometry.Polygon(json);
	return polygon;
}

/** 
 * wkt转化成arcgis的MULTIPOLYGON对象 
 */
export function WktToMULTIPOLYGON(wkt, spatialreference) {
	var wktUtil = new WKTUtil();
	var points = wktUtil.read(wkt);
	var json = {
		rings: points,
		spatialReference: spatialreference
	}
	var polygon = new esri.geometry.Polygon(json);
	return polygon;
}

/** 
 * wkt转化成arcgis的MULTILINESTRING对象 
 */
export function WktToMULTILINESTRING(wkt, spatialreference) {
	var wktUtil = new WKTUtil();
	var points = wktUtil.read(wkt);
	var json = {
		rings: points,
		spatialReference: spatialreference
	}
	var polygon = new esri.geometry.Polygon(json);
	return polygon;
}

// ArcGIS - WKT Point
export function PointToWKT(geometry) {
	return "POINT  ( " + geometry.x + " " + geometry.y + ")";
}


// ArcGIS - WKT Polygon
export function PolygonToWKT(geometry) {
	var wkt = [];
	var rings = geometry.rings;
	for (var i in rings) {
		var ring = rings[i];
		for (var j in ring) {
			var p = ring[j];
			wkt.push(p.join(' '));
		}
	}
	return "POLYGON((" + wkt.join(",") + "))";
}

// ArcGIS - WKT Line
export function LineToWKT(geometry) {
	var wkt = [];
	var paths = geometry.paths;
	for (var i in paths) {
		var path = paths[i];
		for (var j in path) {
			var p = path[j];
			wkt.push(p.join(" "));
		}
	}
	return "LINESTRING(" + wkt.join(",") + ")";
}
