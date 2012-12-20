/**
 * Provides functionality for the handling of category axis data for a chart.
 *
 * @module charts
 * @submodule axis-category-base
 */

/**
 * CategoryImpl manages category data on an axis.
 *
 * @class CategoryImpl
 * @constructor
 * @submodule axis-category-base
 */
function CategoryImpl()
{
}

CategoryImpl.NAME = "categoryImpl";

CategoryImpl.prototype = {
    /**
     * Formats a label based on the axis type and optionally specified format.
     *
     * @method formatLabel
     * @param {Object} value
     * @param {Object} format Pattern used to format the value.
     * @return String
     */
    formatLabel: function(val, format)
    {
        return val;
    },

    /**
     * Object storing key data.
     *
     * @property _indices
     * @private
     */
    _indices: null,

    /**
     * Constant used to generate unique id.
     *
     * @property GUID
     * @type String
     * @private
     */
    GUID: "yuicategoryaxis",

    /**
     * Type of data used in `Data`.
     *
     * @property _dataType
     * @readOnly
     * @private
     */
    _type: "category",

    /**
     * Calculates the maximum and minimum values for the `Data`.
     *
     * @method _updateMinAndMax
     * @private
     */
    _updateMinAndMax: function()
    {
        this._dataMaximum = Math.max(this.get("data").length - 1, 0);
        this._dataMinimum = 0;
    },

    /**
     * Gets an array of values based on a key.
     *
     * @method _getKeyArray
     * @param {String} key Value key associated with the data array.
     * @param {Array} data Array in which the data resides.
     * @return Array
     * @private
     */
    _getKeyArray: function(key, data)
    {
        var i = 0,
            obj,
            keyArr = [],
            labels = [],
            len = data.length;
        if(!this._indices)
        {
            this._indices = {};
        }
        for(; i < len; ++i)
        {
            obj = data[i];
            keyArr[i] = i;
            labels[i] = obj[key];
        }
        this._indices[key] = keyArr;
        return labels;
    },

    /**
     * Sets data by key
     *
     * @method _setDataByKey
     * @param {String} key Key value to use.
     * @param {Array} data Array to use.
     * @private
     */
    _setDataByKey: function(key)
    {
        var i,
            obj,
            arr = [],
            labels = [],
            dv = this._dataClone.concat(),
            len = dv.length;
        if(!this._indices)
        {
            this._indices = {};
        }
        for(i = 0; i < len; ++i)
        {
            obj = dv[i];
            arr[i] = i;
            labels[i] = obj[key];
        }
        this._indices[key] = arr;
        this.get("keys")[key] = labels.concat();
        this._updateTotalDataFlag = true;
    },

    /**
     * Returns an array of values based on an identifier key.
     *
     * @method getDataByKey
     * @param {String} value value used to identify the array
     * @return Array
     */
    getDataByKey: function (value)
    {
        if(!this._indices)
        {
            this.get("keys");
        }
        var keys = this._indices;
        if(keys[value])
        {
            return keys[value];
        }
        return null;
    },

    /**
     * Returns the total number of majorUnits that will appear on an axis.
     *
     * @method getTotalMajorUnits
     * @param {Object} majorUnit Object containing properties related to the majorUnit.
     * @param {Number} len Length of the axis.
     * @return Number
     */
    getTotalMajorUnits: function(majorUnit, len)
    {
        return this.get("data").length;
    },

    /**
     * Returns the distance between major units on an axis.
     *
     * @method getMajorUnitDistance
     * @param {Number} len Number of ticks
     * @param {Number} uiLen Size of the axis.
     * @param {Object} majorUnit Hash of properties used to determine the majorUnit
     * @return Number
     */
    getMajorUnitDistance: function(len, uiLen, majorUnit)
    {
        var dist;
        if(majorUnit.determinant === "count")
        {
            dist = uiLen/len;
        }
        else if(majorUnit.determinant === "distance")
        {
            dist = majorUnit.distance;
        }
        return dist;
    },

    /**
     * Gets the distance that the first and last ticks are offset from there respective
     * edges.
     *
     * @method getEdgeOffset
     * @param {Number} ct Number of ticks on the axis.
     * @param {Number} l Length (in pixels) of the axis.
     * @return Number
     */
    getEdgeOffset: function(ct, l)
    {
        return l/ct;
    },

    /**
     * Returns a value based of a key value and an index.
     *
     * @method getKeyValueAt
     * @param {String} key value used to look up the correct array
     * @param {Number} index within the array
     * @return String
     */
    getKeyValueAt: function(key, index)
    {
        var value = NaN,
            keys = this.get("keys");
        if(keys[key] && keys[key][index])
        {
            value = keys[key][index];
        }
        return value;
    },

    /**
     * Calculates and returns a value based on the number of labels and the index of
     * the current label.
     *
     * @method _getLabelByIndex
     * @param {Number} i Index of the label.
     * @param {Number} l Total number of labels.
     * @param {String} direction The direction of the axis. (vertical or horizontal)
     * @return String
     * @private
     */
    _getLabelByIndex: function(i, l, direction)
    {
        var label,
            data = this.get("data");
        if(direction && direction == "vertical")
        {
            label = data[i];
        }
        else
        {
            label = data[l - (i + 1)];
        }
        return label;
    },

    /**
     * Returns a string corresponding to the first label on an
     * axis.
     *
     * @method getMinimumValue
     * @return String
     */
    getMinimumValue: function()
    {
        var data = this.get("data"),
            label = data[0];
        return label;
    },

    /**
     * Returns a string corresponding to the last label on an
     * axis.
     *
     * @method getMaximumValue
     * @return String
     */
    getMaximumValue: function()
    {
        var data = this.get("data"),
            len = data.length - 1,
            label = data[len];
        return label;
    }
};

Y.CategoryImpl = CategoryImpl;

