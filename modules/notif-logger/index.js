(function(win) {
  // check runtime
  if (!win) throw new Error("Not in Browser env");

	// check browser support for notificatios
	if (!("Notification" in window)) throw new Error("This browser does not support desktop notification");

	var log = function(body, title, icon) {
  	// request for notification access
		Notification.requestPermission().then(function(result) {
		  if (result === 'denied') {
        logger.detach();
		    console.log('Permission wasn\'t granted. Allow a retry.');
		    return;
		  }
		  if (result === 'default') {
        logger.detach();
		    console.log('The permission request was dismissed.');
		    return;
		  }
		  // Do something with the granted permission.
      var options = {
	        body: body,
	        icon: icon 
	    }
	    return new Notification(title, options);
		});
	}

	// new interface for console.log and logger
  var _log = console.log;
	window.logger = {
		log: log,
		detach: function() {
			console.log = _log;
		}
  }
  console.log = function() {
		window.logger.log.apply(window.logger, arguments);
		_log.apply(console, arguments);
  }; 
})(window);
