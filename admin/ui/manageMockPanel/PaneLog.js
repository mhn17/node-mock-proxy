var PaneLog = function() {

	this.$container = $('#PaneLog');
	this.$logSpace = this.$container.find('.consoleLog');
	this.apiBridge = new ApiBridge();

	this.bindEvents();
};

PaneLog.prototype.draw = function() {

};

PaneLog.prototype.addLog = function(type, arguments) {

	var log = '';
	log+= '<div class="logEntry '+type+'">';
	$.each(arguments, function(key, value) {
		if (typeof value === 'object') {
			value = JSON.stringify(value);
		}

		log+= '<pre>';
		log+= value;
		log+= '</pre>';
	});
	log+= '</div>';

	this.$logSpace.prepend(log);
};

PaneLog.prototype.bindEvents = function() {
	var that = this;

	this.apiBridge.webSocket('/admin/ws/logs', function(receive) {
		that.addLog(receive.type, receive.values);
	});
};

