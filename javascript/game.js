// Generated by CoffeeScript 1.4.0
(function() {

  NAN.Game = (function() {

    function Game(music) {
      var i, _i, _ref;
      if (music == null) {
        music = true;
      }
      if (music) {
        $.audioPlayerA.playString("0123456789");
      }
      $.backgroundBlockId = 0;
      this.score = new NAN.Score;
      this.gridId = 0;
      this.init();
      this.gridMargin = 2;
      this.containerHeight = 670;
      this.containerWidth = 600;
      this.numGridRows = 5;
      this.numGridColumns = 5;
      this.numGrids = this.numGridColumns * this.numGridRows;
      this.gridWidth = (this.containerWidth - 100) / this.numGridRows;
      this.gridHeight = this.gridWidth;
      this.gridXOffset = 110;
      this.gridYOffset = (this.containerWidth - this.numGridColumns * this.gridWidth) / 2;
      setStyleRuleValue(".board", "width", "" + this.containerWidth + "px");
      setStyleRuleValue(".board", "height", "" + this.containerHeight + "px");
      setStyleRuleValue(".number", "line-height", "" + this.gridHeight + "px");
      setStyleRuleValue(".square", "height", "" + (this.gridHeight - this.gridMargin * 2) + "px");
      setStyleRuleValue(".square", "width", "" + (this.gridWidth - this.gridMargin * 2) + "px");
      this.gameOver = false;
      this.grids = [];
      this.mouse = new NAN.Mouse;
      this.paused = true;
      this.timeLeft = 60;
      this.timeTotal = 60;
      this.gridQueue = [];
      for (i = _i = 0, _ref = this.numGridRows; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        this.grids[i] = [];
      }
      this.startTime = getTime();
      this.gridsToShow = [];
    }

    Game.prototype.getEventPosition = function(e) {
      var x, y;
      y = e.originalEvent.targetTouches[0].pageX - $("#container").offset().left;
      x = e.originalEvent.targetTouches[0].pageY - $("#container").offset().top;
      return {
        x: x,
        y: y
      };
    };

    Game.prototype.getEventGrid = function(e) {
      var pos;
      pos = this.getEventPosition(e);
      return this.getGridAt(pos.x, pos.y);
    };

    Game.prototype.newGrid = function(x, y, show) {
      var grid;
      if (show == null) {
        show = true;
      }
      grid = new NAN.Grid(x, y, this, show);
      this.grids[x][y] = grid;
      return this.gridQueue.push(grid);
    };

    Game.prototype.getGridAt = function(x, y) {
      var grid, _i, _len, _ref;
      _ref = this.gridQueue;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        grid = _ref[_i];
        if (grid.testInside(x, y)) {
          return grid;
        }
      }
      return null;
    };

    Game.prototype.init = function() {
      return this.time = 0;
    };

    Game.prototype.movementEnd = function() {
      var grid, result, row, _i, _j, _len, _len1, _ref;
      result = true;
      _ref = this.grids;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        row = _ref[_i];
        for (_j = 0, _len1 = row.length; _j < _len1; _j++) {
          grid = row[_j];
          if (grid !== null && grid.deltaX !== 0) {
            result = false;
          }
        }
      }
      return result;
    };

    Game.prototype.nextFrame = function() {
      var x, y, _i, _j, _len, _ref, _ref1, _results, _results1;
      _ref1 = (function() {
        _results1 = [];
        for (var _j = 0, _ref = this.numGridRows; 0 <= _ref ? _j < _ref : _j > _ref; 0 <= _ref ? _j++ : _j--){ _results1.push(_j); }
        return _results1;
      }).apply(this).reverse();
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        x = _ref1[_i];
        _results.push((function() {
          var _k, _ref2, _results2;
          _results2 = [];
          for (y = _k = 0, _ref2 = this.numGridColumns; 0 <= _ref2 ? _k < _ref2 : _k > _ref2; y = 0 <= _ref2 ? ++_k : --_k) {
            if (this.grids[x][y] === null || !this.grids[x][y].exist) {
              if (x > 0 && this.grids[x - 1][y] !== null) {
                this.grids[x - 1][y].deltaX += this.gridHeight;
                this.grids[x][y] = this.grids[x - 1][y];
                this.grids[x - 1][y].moveTo(x, y);
                _results2.push(this.grids[x - 1][y] = null);
              } else if (x === 0) {
                this.newGrid(x, y, false);
                this.gridsToShow.push(this.grids[x][y]);
                this.grids[x][y].getElement().hide();
                _results2.push(this.grids[x][y].getElement().css("opacity", 0.0));
              } else {
                _results2.push(void 0);
              }
            } else {
              _results2.push(void 0);
            }
          }
          return _results2;
        }).call(this));
      }
      return _results;
    };

    Game.prototype.updateGrids = function() {
      var grid, newQueue, _i, _len, _ref;
      newQueue = [];
      _ref = this.gridQueue;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        grid = _ref[_i];
        if (grid === null || grid.exist === false) {
          0;

        } else {
          grid.update();
          newQueue.push(grid);
        }
      }
      return this.gridQueue = newQueue;
    };

    Game.prototype.getPaused = function() {
      if (this.gameOver) {
        return true;
      }
      if (this.time <= 60) {
        return true;
      }
      if ($.numberShow && !$.numberShow.finished) {
        return true;
      }
      if (!this.movementEnd()) {
        return true;
      }
      return false;
    };

    Game.prototype.update = function() {
      var grid, x, y, _i, _j, _len, _ref, _ref1;
      this.paused = this.getPaused();
      if (this.time < this.numGridRows * 5) {
        if (this.time % 5 === 0) {
          x = this.time / 5;
          for (y = _i = 0, _ref = this.numGridColumns; 0 <= _ref ? _i < _ref : _i > _ref; y = 0 <= _ref ? ++_i : --_i) {
            this.newGrid(x, y);
          }
        }
      } else {
        this.nextFrame();
      }
      if (this.movementEnd()) {
        _ref1 = this.gridsToShow;
        for (_j = 0, _len = _ref1.length; _j < _len; _j++) {
          grid = _ref1[_j];
          grid.show();
        }
        this.gridsToShow = [];
      }
      this.updateGrids();
      this.score.update();
      this.time += 1;
      if ($.numberShow) {
        $.numberShow.update();
        if ($.numberShow.finished) {
          $.numberShow = null;
        }
      }
      if (!this.paused) {
        this.timeLeft -= 0.02;
      }
      if (this.timeLeft < 5) {
        $("#game-count-down").css("color", "#a44");
      } else {
        $("#game-count-down").css("color", "#454");
      }
      $("#game-count-down").html(Math.max(0, Math.floor(this.timeLeft)));
      if (this.timeLeft < 0 && !this.gameOver) {
        this.over();
      }
      return $("#progressbar").attr("value", "" + (this.timeLeft / this.timeTotal * 100));
    };

    Game.prototype.over = function() {
      var delay,
        _this = this;
      $.audioPlayerA.playString("9876543210");
      delay = 2000;
      this.finalScore = this.score.value;
      this.score.addValue(-this.finalScore);
      this.gameOver = true;
      new NAN.RotateTask("#game-over-screen", -1);
      if (this.timeLeft >= 0) {
        $(".score").fadeOut(500);
      }
      setTimeout(function() {
        _this.score.addValue(_this.finalScore);
        return $(".score").fadeIn(500);
      }, delay);
      return setTimeout(function() {
        $.audioPlayerA.playString(_this.finalScore.toString());
        return $.audioPlayerB.playString(_this.finalScore.toString());
      }, delay * 1.5);
    };

    return Game;

  })();

  this.gameHint = function(text) {
    $("#game-area-hint").html(text);
    $("#game-area-hint").fadeIn(250);
    return setTimeout(function() {
      return $("#game-area-hint").fadeOut(250);
    }, 1500);
  };

  this.switchToNanScreen = function() {
    new NAN.RotateTask("#nan-screen");
    queryNumber(0, function(num) {
      return $.totalPlayers = num;
    }, 0);
    return queryNumber(-1, function(num) {
      return $.totalNumbers = num;
    }, 0);
  };

  this.newGame = function() {
    var timeStep;
    $("#number-show").hide(0);
    $("#game-area").hide(0);
    new NAN.RotateTask("#game-area");
    $.game = new NAN.Game;
    if ($.gameUpdater) {
      clearInterval($.gameUpdater);
    }
    timeStep = 0.7;
    setTimeout(function() {
      return gameHint("连出你认为特殊的数字");
    }, 2500);
    setTimeout(function() {
      return gameHint("数字性质越特殊, 分数越高");
    }, 4600);
    $(".square").remove();
    $("#number-show").hide();
    $("#number-show").css("opacity", "0.0");
    $("#how-to-play").slideUp(0);
    return setTimeout(function() {
      return $.gameUpdater = setInterval(function() {
        return $.game.update();
      }, 20);
    }, 2000 * timeStep);
  };

  $.dataServer = "http://4.getwb.sinaapp.com/counter/";

  this.queryNumber = function(number, func, inc) {
    var cmd;
    if (inc == null) {
      inc = 1;
    }
    cmd = "";
    console.log(inc);
    if (inc === 1) {
      cmd = "inc.php";
    } else {
      cmd = "check.php";
    }
    return $.ajax({
      type: "GET",
      url: "" + $.dataServer + cmd + "?num=" + number
    }).done(function(text) {
      if (func) {
        return func(text);
      }
    });
  };

  this.listenClick = function(ele, func) {
    var _this = this;
    ele.click(function() {
      return func();
    });
    return ele.on("touchstart", function() {
      return func();
    });
  };

  this.init = function() {
    var _this = this;
    $("#game-area-hint").hide(0);
    $("#container").css("opacity", 0.0);
    $("#container").css("visibility", "visible");
    $("#container").animate({
      opacity: 1.0
    }, 1000);
    $("#container").show();
    $.totalPlayers = "many";
    $.totalNumbers = "lots of";
    $("#nan-screen").hide(0);
    setInterval(function() {
      return $("#nan-player-count").html("and " + $.totalPlayers + " players with " + $.totalNumbers + " numbers");
    }, 100);
    queryNumber(0, function(text) {
      return $("#welcome-screen-user-count").html("你是第" + text + "个玩家");
    });
    $.currentScreen = "#welcome-screen";
    $.mobileMode = mobileMode();
    if ($.mobileMode) {
      setStyleRuleValue(".square:hover", "border-radius", "20%");
    }
    $.audioPlayerA = new NAN.AudioPlayer("a");
    $.audioPlayerB = new NAN.AudioPlayer("b");
    $.audioPlayerB.playString("02468");
    $.analyzer = new window.NAN.Analyzer;
    $.game = new NAN.Game(false);
    $.inTransition = false;
    listenClick($("#game-over-hint"), function() {
      if (!$.inTransition) {
        return newGame();
      }
    });
    listenClick($("#welcome-screen"), function() {
      if (!$.inTransition) {
        return newGame();
      }
    });
    listenClick($("#game-over-share"), function() {
      return window.open("http://share.renren.com/share/buttonshare.do?link=http%3A%2F%2Fiteratoradvance%2Egithub%2Eio%2F&title=http%3A%2F%2Fiteratoradvance%2Egithub%2Eio%2F");
    });
    listenClick($("#nan-screen"), function() {
      if (!$.inTransition) {
        return newGame();
      }
    });
    listenClick($("#game-over-nan"), function() {
      if (!$.inTransition) {
        return switchToNanScreen();
      }
    });
    $("body").mouseup(function() {
      return $.game.mouse.endPath();
    });
    $("#game-over-screen").hide(0);
    $("#container").on("touchstart", function(e) {
      var grid;
      grid = $.game.getEventGrid(e);
      if (grid) {
        grid.mouseDown();
      }
      return false;
    });
    $("#container").on("touchmove", function(e) {
      var grid;
      grid = $.game.getEventGrid(e);
      if (grid) {
        grid.mouseOver();
      }
      console.log(grid);
      return false;
    });
    return $("#container").on("touchend", function(e) {
      $.game.mouse.endPath();
      return false;
    });
  };

  $(document).ready(function() {
    return init();
  });

}).call(this);
