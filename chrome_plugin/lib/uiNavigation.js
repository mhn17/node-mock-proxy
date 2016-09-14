// Constructor to init stuff
var UiNavigation = function() {

	this.buttonSelector = 'nav button';
	this.allContainer = [];

	this.init();
	this.bindEvents();

	// Create pane objects for later navigation
	this.panes = {
		'PaneMockList': new PaneMockList(),
		'PaneTrackMocks': new PaneTrackMocks(),
		'PaneCreateMock': new PaneCreateMock(),
		'PaneShowRequests': new PaneShowRequests()
	};

	this.switchPanel($('nav').data('defaultPane'));
};

// Init method to init more stuff
UiNavigation.prototype.init = function() {
	var that = this;

	// Get ids from pane buttons
	$(this.buttonSelector).each(function() {
		var paneId = $(this).data('pane');
		that.allContainer.push($('#' + paneId));
	});
};

// Hide all panes
UiNavigation.prototype.hideAllPanes = function() {
	console.log(this.allContainer);
	$.each(this.allContainer, function(idx, $pane) {
		$pane.hide();
	});
};

// Bind click event to enable pane switch
UiNavigation.prototype.bindEvents = function() {
	var that = this;
	$(this.buttonSelector).on('click', function() {
		that.switchPanel($(this).data('pane'));
	})
};

// Switch to another pane
// Id: paneId The pane to which should be switched
UiNavigation.prototype.switchPanel = function(paneId) {
	console.log('switchPanel', paneId);
	this.hideAllPanes();

	console.log(this.panes);
	var paneObj = this.panes[paneId];

	if (paneObj) {
		console.log(paneObj);
		if (typeof(paneObj.draw) !== 'function') {
			throw Error('Cant open pane ' + paneId);
		}
		paneObj.draw();
	}

	$('#' + paneId).show();
};
