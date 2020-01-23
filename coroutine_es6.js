"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/** 
 ********* Unity Coroutine implementation for JavaScript ***********
 *******************************************************************
 ******* Copyright Konstantin Ostrovsky [ska_live@mail.ru] *********
 *******************************************************************
 *******************************************************************
 *******************************************************************
 **** Writen for article https://web-panda.ru/post/coroutine-js ****
 *******************************************************************
 */
(function () {
  /**
   * WaitForSeconds implementation of https://docs.unity3d.com/ScriptReference/WaitForSeconds.html
   * @param {number} seconds [Time in seconds while Coroutine should be wait]
   */
  window.WaitForSeconds = function (seconds) {
    var _this = this;

    var error = _typeof(seconds) != _typeof(1);

    this.seconds = seconds;

    this.activate = function () {
      return new Promise(function (resolve, reject) {
        if (error) {
          console.log("Error while called WaitForSeconds typeof", _this.seconds);
        } else {
          setTimeout(function () {
            resolve();
          }, _this.seconds * 1000);
        }
      });
    };

    return this;
  };
  /**
   * WaitWhile wait while function returned false https://docs.unity3d.com/ScriptReference/WaitWhile.html
   * @param {function} func [Coroutine is wait while function returned true]
   */


  window.WaitWhile = function (func) {
    var _this2 = this;

    var error = _typeof(func) != _typeof(function () {});

    this.func = func;

    this.activate = function () {
      return new Promise(function (resolve, reject) {
        if (error) {
          console.log("Error while called WaitWhile typeof", _this2.func);
        } else {
          var interval = setInterval(function () {
            if (_this2.func() === false) {
              clearInterval(interval);
              resolve();
            }
          }, 10);
        }
      });
    };

    return this;
  };
  /**
   * WaitPromise wait while Promise finished
   * @param {Promise} prom [Coroutine is wait Promise not finished]
   */


  window.WaitPromise = function (prom) {
    var _this3 = this;

    var error = _typeof(prom) != _typeof(function () {});

    this.promise = prom;

    this.activate = function () {
      return new Promise(function (resolve, reject) {
        if (error) {
          console.log("Error while called WaitPromise typeof", _this3.promise);
        } else {
          _this3.promise().then(function () {
            resolve();
          });
        }
      });
    };
  };
  /**
   * Main Coroutine function https://docs.unity3d.com/ScriptReference/MonoBehaviour.StartCoroutine.html
   * @param {Generator Function} func
   * @return {Promise} resolved when coroutine is finished
   */


  window.StartCoroutine = function (func) {
    var _this4 = this;

    return new Promise(function (resolve) {
      /**
       * Process next coroutine tick
       */
      var processCoroutine = function processCoroutine() {
        var next = _this4.coroutine.next();

        if (next.value == false || next.done) resolve();else processReturn(next.value);
      },

      /**
       * Process yields in generator functions
       * @param  {any} value yield return data
       */
      processReturn = function processReturn(value) {
        if (value && _typeof(value) == "object" && value.hasOwnProperty("activate")) value.activate().then(function () {
          return processCoroutine();
        });else processCoroutine();
      };

      _this4.coroutine = func();
      processCoroutine();
    });
  };
})(window);