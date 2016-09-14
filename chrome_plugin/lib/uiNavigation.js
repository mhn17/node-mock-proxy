var UiNavigation = function() {

	this.buttonSelector = 'nav button';
	this.allContainer = [];

	this.init();
	this.bindEvents();

	this.panes = {
		'PaneMockList': new PaneMockList(),
		'PaneTrackMocks': new PaneTrackMocks(),
		'PaneCreateMock': new PaneCreateMock(),
		'PaneShowRequests': new PaneShowRequests()
	};

	console.log('My Panes', this.panes);

	this.switchPanel($('nav').data('defaultPane'));
};

UiNavigation.prototype.init = function() {
	var that = this;
	$(this.buttonSelector).each(function() {
		var paneId = $(this).data('pane');
		that.allContainer.push($('#'+paneId));
	});
};

UiNavigation.prototype.hideAllPanes = function() {
	console.log(this.allContainer);
	$.each(this.allContainer, function(idx, $pane) {
		$pane.hide();
	});
};

UiNavigation.prototype.bindEvents = function() {
	var that = this;
	$(this.buttonSelector).on('click', function() {
		that.switchPanel($(this).data('pane'));
	})
};

UiNavigation.prototype.switchPanel = function(paneId) {
	console.log('switchPanel', paneId);
	this.hideAllPanes();

	console.log(this.panes);
	var paneObj = this.panes[paneId];

	if (paneObj) {
		console.log(paneObj);
		if (typeof(paneObj.draw) !== 'function') {
			throw Error('Cant open pane '+paneId);
		}
		paneObj.draw();
	}

	$('#'+paneId).show();
};
