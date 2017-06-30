/**
 * Create option pane object when the page is loaded.
 * **/
document.addEventListener('DOMContentLoaded', function() {
    new PaneOptions().draw();
});

/**
 * Constructor to initialize things.
 * **/
var PaneOptions = function() {
    this.$container = $('#optionPane');
    this.bindEvents();
    this.localStorageHandler = new LocalStorageHandler();
}

/**
 * Draw the options.
 * **/
PaneOptions.prototype.draw = function() {
    // Remove old content in order to add data to the already existing data and draw the table anew
    var $contentTableBody = this.$container.find('tbody');
    $contentTableBody.empty();

    // Load data from local storage
    var endpointArray = new LocalStorageHandler().getEndpoints();
    var tableContent = '';

    // Draw Options
    endpointArray.forEach(function (endpoint) {
        var rowContent = '';

        rowContent += '<td><input type="radio" ' + (endpoint.isActive() ? 'checked="checked"' : '') + ' data-action="activateEndpoint" name="activeEndpoint"/></td>';
        rowContent += '<td><input type="text" value="' + endpoint.getAddress() + '"/></td>';
        rowContent += '<td>';
        rowContent += '<button data-action="deleteEndpoint">Delete</button>';
        rowContent += '</td>';

        tableContent += '<tr>' + rowContent + '</tr>';
    });

    $contentTableBody.append($(tableContent));
}

/**
 * Bind events.
 * **/
PaneOptions.prototype.bindEvents = function(){
    var that = this;

    this.$container.on('click.PaneOptions', 'button[data-action=deleteEndpoint]', function () {
        $(this).closest('tr').remove();
        that._save();
    });

    this.$container.on('click.PaneOptions', 'input[data-action=activateEndpoint]', function () {
            that._save();
    });

    this.$container.on('click.PaneOptions', 'button[data-action=addEndpoint]', function () {
            that._add();
    });

    this.$container.on('click.PaneOptions', 'button[data-action=saveEndpoints]', function () {
        that._save();
    });
}

/**
 * Saves the data to the local storage.
 * **/
PaneOptions.prototype._save = function () {
    var resultArray = [];
    var that = this;
    var $contentTableBody = this.$container.find('tbody');

    $contentTableBody.find("tr").each(function () {
        var endpointAddress = $(this).find("input[type='text']").val();
        var endpointChecked = $(this).find("input[type='radio']").is(":checked");
        var endpoint = new Endpoint(endpointAddress, endpointChecked);

        resultArray.push(endpoint);
    });

    this.localStorageHandler.setEndpoints(resultArray);
};

/**
 * Adds another row for a new endpoint.
 * **/
PaneOptions.prototype._add = function () {
    var $contentTableBody = this.$container.find('tbody');
    var rowContent = '';

    rowContent += '<td><input type="radio" data-action="activateEndpoint" name="activeEndpoint"/></td>';
    rowContent += '<td><input type="text" /></td>';
    rowContent += '<td>';
    rowContent += '<button data-action="deleteEndpoint">Delete</button>';
    rowContent += '</td>';

    $contentTableBody.append($('<tr>' + rowContent + '</tr>'));
};