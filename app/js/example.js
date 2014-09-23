$(document).ready(function () {
  var $container = $("#example");
  var $parent = $container.parent();
  var autosaveNotification;
  $container.handsontable({
    startRows: 8,
    startCols: 6,
    rowHeaders: true,
    colHeaders: true,
    minSpareRows: 1,
    contextMenu: true,
    afterChange: function (change, source) {
      if (source === 'loadData') {
        return; //don't save this change
      }
      if ($parent.find('input[name=autosave]').is(':checked')) {
        clearTimeout(autosaveNotification);
        $.ajax({
          url: "json/save.json",
          dataType: "json",
          type: "POST",
          data: JSON.stringify({data: change}) //contains changed cells' data
        });
      }
    }
  });
  var handsontable = $container.data('handsontable');

  $parent.find('button[name=load]').click(function () {
    $.ajax({
      url: "json/load.json",
      dataType: 'json',
      type: 'GET',
      success: function (res) {
        handsontable.loadData(res.data);
      }
    });
  });

  $parent.find('button[name=save]').click(function () {
    $.ajax({
      url: "json/save.json",
      data: JSON.stringify({"data": handsontable.getData()}), //returns all cells' data
      dataType: 'json',
      type: 'POST'
    });
  });

});