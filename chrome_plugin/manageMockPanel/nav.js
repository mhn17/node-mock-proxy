var Navigation = function() {

	this.buttonSelector = 'nav button';
	this.allContainer = [];

	this.init();
	this.bindEvents();

	this.switchPanel($('nav').data('defaultPane'));

	this.panes = {'PaneMockList': new PaneMockList() };
};

Navigation.prototype.init = function() {
	var that = this;
	$(this.buttonSelector).each(function() {
		var paneId = $(this).data('pane');
		that.allContainer.push($('#'+paneId));
	});
};

Navigation.prototype.hideAllPanes = function() {
	console.log(this.allContainer);
	$.each(this.allContainer, function(idx, $pane) {
		$pane.hide();
	});
};

Navigation.prototype.bindEvents = function() {
	var that = this;
	$(this.buttonSelector).on('click', function() {
		that.switchPanel($(this).data('pane'));
	})
};

Navigation.prototype.switchPanel = function(paneId) {
	console.log('switchPanel');
	this.hideAllPanes();

	$('#'+paneId).show();
};
