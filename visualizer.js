$(function() {
  var csc_data;
  var log_data;
  function load_data() {
    $.get('infovis.csc', function(data) {
      csc_data = data;
      console.log(csc_data);
    });
    $.get('infovis_log.txt', function(data) {
      log_data = data;
      console.log(log_data);
    });
  }
  load_data();
});
