// Generated by CoffeeScript 1.3.3
(function() {

  $(function() {
    eur00t.template.compileTemplates();
    window.game = new eur00t.jewels.Game(null, 21, 10);
    ($(window.game)).on('refresh-scores', function(e, scores) {
      return console.log("Scores: " + scores);
    });
    return ($(window.game)).on('refresh-wave', function(e, wave) {
      return console.log("Wave: " + wave);
    });
  });

}).call(this);
