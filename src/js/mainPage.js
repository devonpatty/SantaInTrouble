/* globals $ */
function init() {
  $('.dailyTab').click(function () {
    $('.weeklyTab').removeClass('active');
    $('#weekly').hide();
    $(this).addClass('active');
    $('#daily').show();
  });
  $('.weeklyTab').click(function () {
    $('.dailyTab').removeClass('active');
    $('#daily').hide();
    $(this).addClass('active');
    $('#weekly').show();
  });
  $('.dailyTab').click();
}

init();
