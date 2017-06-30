// Constructor to init stuff
var UiNavigation = function() {

	if (window.uiNavigation) {
		return window.uiNavigation;
	}

	this.buttonSelector = 'nav button';
	this.allContainer = [];

	this.init();
	this.bindEvents();

	// Create pane objects for later navigation
	this.panes = {
		'PaneMockList': new PaneMockList(),
		'PaneTrackMocks': new PaneTrackMocks(),
		'PaneCreateMock': new PaneCreateMock(),
		'PaneShowRequests': new PaneShowRequests(),
		'PaneMockSetList': new PaneMockSetList(),
		'PaneCreateMockSet': new PaneCreateMockSet(),
		'PaneLog': new PaneLog(),
	};

	this.switchPanel($('nav.main').data('defaultPane'));

	// Assign singleton object
	window.uiNavigation = this;
	return this;
};

// Init method to init more stuff
UiNavigation.prototype.init = function() {
	var that = this;

	// Get ids from pane buttons
	$(this.buttonSelector+'[data-pane]').each(function() {
		var paneId = $(this).data('pane');
		that.allContainer.push($('#' + paneId));
	});


};

// Hide all panes
UiNavigation.prototype.hideAllPanes = function() {
	console.log("All container.", this.allContainer);
	$.each(this.allContainer, function(idx, $pane) {
		$pane.hide();
	});
};

// Bind click event to enable pane switch
UiNavigation.prototype.bindEvents = function() {
	var that = this;



	$(this.buttonSelector+'[data-pane]').on('click', function() {
		that.switchPanel($(this).data('pane'));
	});

	$(this.buttonSelector+'[data-tool="OpenWindow"]').on('click', function() {
		var href = $(this).data('href');
		chrome.tabs.create({ url: href });
	});
};

UiNavigation.prototype.switchSubNavigation = function(paneId) {

	$navSub = $('nav.sub');
	$navSub.hide();

	// remove all active states...
	$('nav').find('button').removeClass('active');

	$('nav.main').find('button[data-pane="' + paneId + '"]').addClass('active');

	var $activeSubpane = null;
	var activeSubpaneButtonTargets = [];

	$navSub.each(function() {
		var $nav = $(this);
		$nav.find('button').each(function() {
			if ($(this).data('pane') === paneId) {
				$('nav.main').find('button[data-pane="' + $(this).closest('nav').data('parent-nav') + '"]').addClass('active');
				$(this).addClass('active');
				$nav.show();
			}
		})
	});
};

// Switch to another pane
// Id: paneId The pane to which should be switched
UiNavigation.prototype.switchPanel = function(paneId, data) {

	this.switchSubNavigation(paneId);

	console.log('switchPanel', paneId);
	this.hideAllPanes();

	console.log(this.panes);
	var paneObj = this.panes[paneId];

	$('#' + paneId).show();

	if (paneObj) {
		console.log('Switch to panel: ', paneObj);
		if (typeof(paneObj.draw) !== 'function') {
			throw Error('Cant open pane ' + paneId);
		}

		paneObj.draw(data);
	}
};
