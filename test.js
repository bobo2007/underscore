/**
 * File Name: test.js
 * Created By: bobo2007
 * Creation Date: 2017-04-30 11:30:36
 * Last Modified: 2017-05-23 15:49:02
 * Purpose: underscore.1.8.3.js 源码解读
 */

(function() {
  // 创建root object, 浏览器中表示window，node中表示export
  var root = this;

  // 保存之前已经存在的'_'变量
  var previousUnderscore = root._;

  // 保存引用，压缩优化
  var ArrayProto = Array.prototype,
    ObjProto = Object.prototype,
    FuncProto = Function.prototype;

  // 快速访问原型方法
  var push = ArrayProto.push,
    slice = ArrayProto.slice,
    toString = ObjProto.toString,
    hasOwnProperty = ObjProto.hasOwnProperty;

  // 一些es5自带的函数
  var nativeIsArray = Array.isArray,
    nativeKeys = Object.keys,
    nativeBind = FuncProto.bind,
    nativeCreate = Object.create;

  var Ctor = function() {};

  // 安全的创建underscore对象
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (this instanceof _) return new obj;
    this._wrapped = obj;
  };

  // 在Node.js中输出underscore对象，向后兼容 require() 借口，如果在浏览器中,把'_'赋给全局对象
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    // 浏览器中直接赋给全局对象
    root._ = _;
  }
  // 当前版本
  _.VERSION = '1.8.3';

  // 很重要的函数，用来改变函数执行的作用域
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1:
        return function(value) {
          return func.call(context, value);
        };
      case 2:
        return function(value, other) {
          return func.call(context, value, other);
        }
      case 3:
        return function(value, index, collection) {
          return func.call(context, value, index, collection);
        }
      case 4:
        return function(accumulator, value, index, collection) {
          return func.call(context, accumulator, value, index, collection);
        }
    }
    return function() {
      return func.apply(context, arguments);
    }
  };

  var cb = function(value, context, argCount) {
    if (value == null) {
      return _.identity;
    }
    if (_.isFunction(value)) {
      return optimizeCb(value, context, argCount);
    }
    if (_.isObject(value)) {
      return _.matcher(value);
    }
    return _.property(value);
  }

  _.iteratee = function(value, context) {
    return cb(value, context, Infinity);
  }

  // creating assigner functions
  // var createAssigner = function(keysFunc, undefinedOnly) {
  //   return function(obj) {
  //
  //   }
  // }

  var property = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    }
  };

  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = property('length');
  // 判断是否为类数组对象
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length  == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  }

  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (var i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  }

}.call(this);
