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

(function() {
	/**
	 * WaitForSeconds implementation of https://docs.unity3d.com/ScriptReference/WaitForSeconds.html
	 * @param {number} seconds [Time in seconds while Coroutine should be wait]
	 */
	window.WaitForSeconds = function(seconds) {
	   var error = typeof(seconds) != typeof(1);
	   this.seconds = seconds;

	   this.activate= () => {
	     return new Promise((resolve, reject) => {
	        if(error) {
	            console.log("Error while called WaitForSeconds typeof", this.seconds)
	        }else{
	            setTimeout(() => {
	                resolve();
	            }, this.seconds * 1000)
	        }

	    });
	   }

	   return this;
	}

	/**
	 * WaitWhile wait while function returned false https://docs.unity3d.com/ScriptReference/WaitWhile.html
	 * @param {function} func [Coroutine is wait while function returned true]
	 */
	window.WaitWhile = function(func) {
	   var error = typeof(func) != typeof(() => {});
	   this.func = func;

	   this.activate= () => {
	     return new Promise((resolve, reject) => {
	        if(error) {
	            console.log("Error while called WaitWhile typeof", this.func)
	        }else{
	            var interval = setInterval(() => {
	                if(this.func() === false) {
	                    clearInterval(interval);
	                    resolve();
	                }
	            }, 10)
	        }
	    });
	   }

	   return this;
	}

	/**
	 * WaitPromise wait while Promise finished
	 * @param {Promise} prom [Coroutine is wait Promise not finished]
	 */
	window.WaitPromise = function(prom) {
	    var error = typeof(prom) != typeof(() => {});
	    this.promise = prom;

	    this.activate = () => {
	     return new Promise((resolve, reject) => {
	        if(error) {
	            console.log("Error while called WaitPromise typeof", this.promise)
	        }else{
	            this.promise().then(() => {
	                resolve();           
	            })
	        }
	    });
	   }
	}

	/**
	 * Main Coroutine function https://docs.unity3d.com/ScriptReference/MonoBehaviour.StartCoroutine.html
	 * @param {Generator Function} func
	 * @return {Promise} resolved when coroutine is finished
	 */
	window.StartCoroutine = function(func) {
	    return new Promise((resolve) => {

	        /**
	         * Process next coroutine tick
	         */
	        let processCoroutine = () => {
	            var next = this.coroutine.next();

	            if(next.value == false || next.done)
	                resolve();
	            else
	                processReturn(next.value);

	        },
	        /**
	         * Process yields in generator functions
	         * @param  {any} value yield return data
	         */
	        processReturn = (value) => {
	            if(value && typeof(value) == "object" && value.hasOwnProperty("activate")) 
	                value.activate().then(() => processCoroutine());
	            else
	                processCoroutine();
	        }

	        this.coroutine = func();
	        processCoroutine();

	    })

	}
})(window)