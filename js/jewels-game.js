// Generated by CoffeeScript 1.3.3
(function() {

  if (window.eur00t == null) {
    window.eur00t = {};
  }

  if (window.eur00t.jewels == null) {
    window.eur00t.jewels = {};
  }

  /*
    Get random integer function.
    If supplied 2 arguments: result is in range [from, to]
    If 1 argument: [0, from]
  */


  window.eur00t.getRandomInt = function(from, to) {
    if (arguments.length === 2) {
      return from + Math.floor(Math.random() * (to - from + 1));
    } else if (arguments.length === 1) {
      return Math.floor(Math.random() * (from + 1));
    } else {
      return 0;
    }
  };

  /*
    Colors of gems. Each color has correspondent CSS class.
    To add new gem type put new color name here and CSS class into main.css.
  */


  window.eur00t.jewels.COLORS = ['orange', 'brown', 'yellow', 'blue', 'green', 'red'];

  /*
    Value of game speed.
  */


  window.eur00t.jewels.SPEED = 300;

  /*
    Main game constructor.
    
    jQueryContainer: append game to this container ($(document.body) default)
    boardW, boardH:  width and height of board in item units (8x8 default)
    size:            size of gem item (60 default)
    gap:             gap between gems (2 default)
    border:          value of gem's border
    
    NOTE: you should compile templates to use this constructor. Template module is located in 
    eur00t-templates.coffee file. Templates themselves are located in templates.coffee
    
    Example of usage:
    
      eur00t.template.compileTemplates()
      window.game = new eur00t.jewel.Game null, 21, 10
  */


  window.eur00t.jewels.Game = function(jQueryContainer, boardW, boardH, size, gap, border) {
    var i, j, _i, _item, _j;
    if (jQueryContainer == null) {
      jQueryContainer = $(document.body);
    }
    if (boardW == null) {
      boardW = 8;
    }
    if (boardH == null) {
      boardH = 8;
    }
    if (size == null) {
      size = 60;
    }
    if (gap == null) {
      gap = 2;
    }
    if (border == null) {
      border = 2;
    }
    this.jQueryContainer = jQueryContainer;
    this.board = this._generateGameBoard(eur00t.compiledTemplates.jewels.board, boardW, boardH, size, gap);
    this.scoresIndicator = $(eur00t.compiledTemplates.jewels.scores());
    this.matrix = [];
    this.size = size;
    this.gap = gap;
    this.border = border;
    this.waveNumber = 0;
    this.scores = 0;
    this.boardW = boardW;
    this.boardH = boardH;
    for (i = _i = 0; 0 <= boardH ? _i < boardH : _i > boardH; i = 0 <= boardH ? ++_i : --_i) {
      this.matrix.push([]);
      for (j = _j = 0; 0 <= boardW ? _j < boardW : _j > boardW; j = 0 <= boardW ? ++_j : --_j) {
        _item = this._generateItem(eur00t.compiledTemplates.jewels.item, size, gap, i, j, border);
        _item.elem.data({
          i: i,
          j: j,
          color: _item.data.color
        });
        this.matrix[i].push(_item.elem);
        this.board.append(_item.elem);
      }
    }
    this._initialize();
    this._initializeEvent();
    return this;
  };

  /*
    Generate DOM structure for game board.
    
    template:       compiled template function
    boardW, boardH: size of board in gem element units
    size:           size of gem element in pixels
    gap:            a gap value in pixels between gem elements
    
    return value:   jQuery wrapper for generated DOM element
  */


  window.eur00t.jewels.Game.prototype._generateGameBoard = function(template, boardW, boardH, size, gap) {
    return $(template({
      width: boardW * (size + 2 * gap),
      height: boardH * (size + 2 * gap)
    }));
  };

  /*
    Generate new gem item.
    
    template: compiled template function
    size:     size of gem element in pixels
    gap:      a gap value in pixels between gem elements
    i,j:      coordinates of element
    border:   a value of element's border in pixels
    
    return value: {
      elem: <jQuery wraper>,
      data: {
        color: <color value>
      }
    }
  */


  window.eur00t.jewels.Game.prototype._generateItem = function(template, size, gap, i, j, border) {
    var color;
    color = eur00t.jewels.COLORS[eur00t.getRandomInt(eur00t.jewels.COLORS.length - 1)];
    return {
      elem: $(template({
        color: color,
        size: size,
        gap: gap,
        i: i,
        j: j,
        border: border
      })),
      data: {
        color: color
      }
    };
  };

  window.eur00t.jewels.Game.prototype._cancelPreviousSelect = function() {
    if (this.selected.obj != null) {
      this.selected.obj.removeClass('selected');
      this.selected.obj = null;
      this.selected.i = -1;
      this.selected.j = -1;
      return true;
    } else {
      return false;
    }
  };

  window.eur00t.jewels.Game.prototype._selectItem = function(i, j) {
    if ((i !== this.selected.i) || (j !== this.selected.j)) {
      this._cancelPreviousSelect();
      this.selected.obj = this.matrix[i][j];
      this.selected.i = i;
      this.selected.j = j;
      return this.selected.obj.addClass('selected');
    } else {
      return this._cancelPreviousSelect();
    }
  };

  window.eur00t.jewels.Game.prototype._setPosition = function(elem, i, j) {
    if (elem !== null) {
      elem.css({
        left: this.gap + j * (this.size + 2 * this.gap) - this.border,
        top: this.gap + i * (this.size + 2 * this.gap) - this.border
      });
      return elem.data({
        i: i,
        j: j
      });
    }
  };

  window.eur00t.jewels.Game.prototype._swapItems = function(i0, j0, i, j) {
    var from, to, _ref;
    from = this.matrix[i0][j0];
    to = this.matrix[i][j];
    this._setPosition(from, i, j);
    this._setPosition(to, i0, j0);
    _ref = [to, from], this.matrix[i0][j0] = _ref[0], this.matrix[i][j] = _ref[1];
    return true;
  };

  window.eur00t.jewels.Game.prototype._ifEqualType = function(i0, j0, i, j) {
    return this.matrix[i0][j0].data('color') === this.matrix[i][j].data('color');
  };

  /*
    Destroy object at (i, j) position.
    
    i, j:      coordinates of element to be distroyed
    hidden:    destroy object without animation.
    nospecial: do not perform special actions if true
    
    return value:
      true  - if element is destroyed
      false - if not
  */


  window.eur00t.jewels.Game.prototype._destroyObj = function(i, j, hidden, nospecial) {
    if (((0 <= i && i < this.boardH)) && ((0 <= j && j < this.boardW)) && (this.matrix[i][j] !== null)) {
      if (!nospecial) {
        this._processSpecial(i, j);
      }
      if (this.matrix[i][j] !== null) {
        if (!hidden) {
          this.matrix[i][j].fadeOut(window.eur00t.jewels.SPEED);
          this.scores += 1;
        } else {
          this.matrix[i][j].remove();
        }
        this.matrix[i][j] = null;
      }
      return true;
    } else {
      return false;
    }
  };

  window.eur00t.jewels.Game.prototype._refreshScores = function() {
    return ($(this)).trigger('refresh-scores', this.scores);
  };

  /*
    Process elements that are queued for deletion.
    
    hidden: flag for silent mode without delays and effects
    
    return value: {
      destroyed: <true if elements were destroyed>,
      count: <a number of destroyed elements>
    }
  */


  window.eur00t.jewels.Game.prototype._processDestroyResult = function(hidden) {
    var destroyedCounter, obj, _i, _j, _len, _len1, _ref, _ref1;
    destroyedCounter = 0;
    if ((this.destroyH.length >= 2) || (this.destroyV.length >= 2)) {
      if (this.destroyH.length >= 2) {
        _ref = this.destroyH;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          obj = _ref[_i];
          this._destroyObj(obj.i, obj.j, hidden);
        }
        destroyedCounter += this.destroyH.length;
      }
      if (this.destroyV.length >= 2) {
        _ref1 = this.destroyV;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          obj = _ref1[_j];
          this._destroyObj(obj.i, obj.j, hidden);
        }
        destroyedCounter += this.destroyV.length;
      }
      return {
        destroyed: true,
        count: destroyedCounter
      };
    } else {
      return {
        destroyed: false,
        count: 0
      };
    }
  };

  /*
    Destroy iteration check function.
    
    destroyArr:           a collection of destroyed elements that are currently processing
    i, j:                 an elements that initiates deletion
    iteratorI, iteratorJ: the position of current element that is checked
    postIteration:        function, that calculates next value of iteratorI and iteratorJ
  */


  window.eur00t.jewels.Game.prototype._processDestroyDirection = function(destroyArr, i, j, iteratorI, iteratorJ, postIteration) {
    var newIterators;
    while (((0 <= iteratorI && iteratorI < this.boardH)) && ((0 <= iteratorJ && iteratorJ < this.boardW)) && (this.matrix[iteratorI][iteratorJ] !== null) && (this._ifEqualType(i, j, iteratorI, iteratorJ))) {
      destroyArr.push({
        i: iteratorI,
        j: iteratorJ
      });
      newIterators = postIteration(iteratorI, iteratorJ);
      iteratorI = newIterators.iteratorI;
      iteratorJ = newIterators.iteratorJ;
    }
    return true;
  };

  window.eur00t.jewels.Game.prototype._destroyLinearVertical = function(i, j, hidden) {
    this._processDestroyDirection(this.destroyV, i, j, i + 1, j, function(i, j) {
      return {
        iteratorI: i + 1,
        iteratorJ: j
      };
    });
    this._processDestroyDirection(this.destroyV, i, j, i - 1, j, function(i, j) {
      return {
        iteratorI: i - 1,
        iteratorJ: j
      };
    });
    return true;
  };

  window.eur00t.jewels.Game.prototype._destroyLinearHorizontal = function(i, j, hidden) {
    this._processDestroyDirection(this.destroyH, i, j, i, j + 1, function(i, j) {
      return {
        iteratorI: i,
        iteratorJ: j + 1
      };
    });
    this._processDestroyDirection(this.destroyH, i, j, i, j - 1, function(i, j) {
      return {
        iteratorI: i,
        iteratorJ: j - 1
      };
    });
    return true;
  };

  window.eur00t.jewels.Game.prototype._checkIfSelectable = function(i, j, hidden) {
    if (this.selected.obj === null) {
      return true;
    } else if (((this.selected.i === i) && (Math.abs(this.selected.j - j) < 2)) || ((this.selected.j === j) && (Math.abs(this.selected.i - i) < 2))) {
      if ((i === this.selected.i) && (j === this.selected.j)) {
        return true;
      } else {
        if (this._ifEqualType(i, j, this.selected.i, this.selected.j)) {
          return true;
        } else {
          return false;
        }
      }
    } else {
      return true;
    }
  };

  /*
    This method perform following actions:
    1. Place all available items donw in regard of empty cells.
    2. Generate new items to fill empty space.
  */


  window.eur00t.jewels.Game.prototype._compactizeBoard = function() {
    var i, iterator, j, newMatrix, _fn, _i, _item, _j, _k, _l, _m, _ref, _ref1, _ref2, _ref3, _ref4, _ref5,
      _this = this;
    newMatrix = [];
    for (j = _i = 0, _ref = this.boardW; 0 <= _ref ? _i < _ref : _i > _ref; j = 0 <= _ref ? ++_i : --_i) {
      newMatrix.push([]);
      for (i = _j = _ref1 = this.boardH - 1; _ref1 <= 0 ? _j <= 0 : _j >= 0; i = _ref1 <= 0 ? ++_j : --_j) {
        if (this.matrix[i][j] !== null) {
          newMatrix[j].push(this.matrix[i][j]);
        }
      }
    }
    for (j = _k = 0, _ref2 = this.boardW; 0 <= _ref2 ? _k < _ref2 : _k > _ref2; j = 0 <= _ref2 ? ++_k : --_k) {
      iterator = 0;
      for (i = _l = _ref3 = this.boardH - 1, _ref4 = this.boardH - 1 - newMatrix[j].length; _ref3 <= _ref4 ? _l < _ref4 : _l > _ref4; i = _ref3 <= _ref4 ? ++_l : --_l) {
        this.matrix[i][j] = newMatrix[j][iterator];
        this._setPosition(this.matrix[i][j], i, j);
        this.matrix[i][j].data({
          i: i,
          j: j
        });
        iterator += 1;
      }
      if ((this.boardH - 1 - newMatrix[j].length) >= 0) {
        iterator = 1;
        _fn = function(i, j) {
          return setTimeout((function() {
            return _this._setPosition(_this.matrix[i][j], i, j);
          }), 0);
        };
        for (i = _m = _ref5 = this.boardH - 1 - newMatrix[j].length; _ref5 <= 0 ? _m <= 0 : _m >= 0; i = _ref5 <= 0 ? ++_m : --_m) {
          _item = this._generateItem(eur00t.compiledTemplates.jewels.item, this.size, this.gap, -iterator, j, this.border);
          this.board.append(_item.elem);
          this.matrix[i][j] = _item.elem;
          _item.elem.data({
            color: _item.data.color
          });
          _fn(i, j);
          iterator += 1;
        }
      }
    }
    return true;
  };

  /*
    Initiate destruction process at (i, j)
    
    i, j:    coordinates of gem that initiates destruction
    hidden:  silent mode with no effects
    initial: if destruction is triggered by user or not
      
    return value: {
      destroyed: <true if elements were destroyed>,
      count: <a number of destroyed elements>
    }
  */


  window.eur00t.jewels.Game.prototype._destroyAt = function(i, j, hidden, initial) {
    var destroyObj, destroyedFlag;
    this.destroyV = [];
    this.destroyH = [];
    if (this.matrix[i][j] !== null) {
      this._destroyLinearVertical(i, j, hidden);
      this._destroyLinearHorizontal(i, j, hidden);
      destroyObj = this._processDestroyResult(hidden);
      destroyedFlag = destroyObj.destroyed;
      /*
            Item at (i, j) should be destroyed only if:
            - number of destroyed element are 3 (including current);
            OR
            - (i, j) is special object
      */

      if ((destroyedFlag && ((destroyObj.count < 3) || !initial)) || (destroyedFlag && (this.matrix[i][j] !== null) && (this._processSpecial(i, j)))) {
        this._destroyObj(i, j, hidden);
        /*
                In case (i, j) wasn't destroyed after previous check AND
                destruction process is initiated by user AND
                element were destroyed (in this case destroyObj.count is more than 2)
                
                (i, j) should be destroyed and should be transformed into special element
        */

      } else if ((this.matrix[i][j] !== null) && initial && destroyedFlag) {
        this.matrix[i][j].addClass('special');
        if (destroyObj.count === 3) {
          this.matrix[i][j].data({
            special: 'bomb'
          });
          this.matrix[i][j].addClass('bomb');
        } else {
          this.matrix[i][j].data({
            special: 'colorbomb'
          });
          this.matrix[i][j].addClass('colorbomb');
        }
      }
      if (!hidden && destroyedFlag) {
        this._refreshScores();
      }
      return {
        destroyed: destroyedFlag,
        count: destroyObj.count
      };
    } else {
      return {
        destroyed: false,
        count: 0
      };
    }
  };

  window.eur00t.jewels.Game.prototype._processWave = function(i) {
    if (i != null) {
      this.waveNumber = 0;
    } else {
      this.waveNumber += 1;
    }
    return ($(this)).trigger('refresh-wave', this.waveNumber);
  };

  window.eur00t.jewels.Game.prototype._clearBoard = function(hidden) {
    var destroyedFlag, i, j, _i, _j, _ref, _ref1,
      _this = this;
    destroyedFlag = false;
    for (i = _i = 0, _ref = this.boardH; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      for (j = _j = 0, _ref1 = this.boardW; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
        if (this.matrix[i][j] !== null) {
          destroyedFlag = (this._destroyAt(i, j, hidden)).destroyed || destroyedFlag;
        }
      }
    }
    if (destroyedFlag) {
      if (!hidden) {
        this._processWave();
        setTimeout((function() {
          return _this._compactizeBoard();
        }), window.eur00t.jewels.SPEED);
        return setTimeout((function() {
          return _this._clearBoard();
        }), window.eur00t.jewels.SPEED * 2);
      } else {
        this._compactizeBoard();
        return this._clearBoard(hidden);
      }
    }
  };

  window.eur00t.jewels.Game.prototype._cancelSpecial = function(i, j) {
    return this.matrix[i][j].data({
      special: null
    });
  };

  window.eur00t.jewels.Game.prototype._processSpecialBomb = function(i, j) {
    var i0, j0, _i, _j, _ref, _ref1;
    this._displayMessage('Booooom!', 48);
    for (j0 = _i = 0, _ref = this.boardW; 0 <= _ref ? _i < _ref : _i > _ref; j0 = 0 <= _ref ? ++_i : --_i) {
      if (j0 !== j) {
        this._destroyObj(i, j0);
      }
    }
    for (i0 = _j = 0, _ref1 = this.boardH; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i0 = 0 <= _ref1 ? ++_j : --_j) {
      if (i0 !== i) {
        this._destroyObj(i0, j);
      }
    }
    return true;
  };

  window.eur00t.jewels.Game.prototype._processSpecialColorBomb = function(i, j) {
    var color, i0, j0, _i, _j, _ref, _ref1;
    this._displayMessage('Color Bomb!', 48);
    color = this.matrix[i][j].data().color;
    for (j0 = _i = 0, _ref = this.boardW; 0 <= _ref ? _i < _ref : _i > _ref; j0 = 0 <= _ref ? ++_i : --_i) {
      for (i0 = _j = 0, _ref1 = this.boardH; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i0 = 0 <= _ref1 ? ++_j : --_j) {
        if (((j0 !== j) || (i0 !== i)) && (this.matrix[i0][j0] !== null) && (this.matrix[i0][j0].data().color === color)) {
          this._destroyObj(i0, j0);
        }
      }
    }
    return true;
  };

  window.eur00t.jewels.Game.prototype._processSpecial = function(i, j) {
    var data, specialValue;
    data = this.matrix[i][j].data();
    if (data.special != null) {
      specialValue = data.special;
      this._cancelSpecial(i, j);
      switch (specialValue) {
        case 'bomb':
          this._processSpecialBomb(i, j);
          break;
        case 'colorbomb':
          this._processSpecialColorBomb(i, j);
      }
      return true;
    } else {
      return false;
    }
  };

  window.eur00t.jewels.Game.prototype._displayMessage = function(text, size) {
    var waveMessage;
    waveMessage = $(eur00t.compiledTemplates.jewels.message({
      text: text,
      size: size
    }));
    this.jQueryContainer.append(waveMessage);
    return setTimeout((function() {
      return waveMessage.remove();
    }), 800);
  };

  /*
    Initialize system events. jQuery custom event is used.
    All events are triggered on instantiated Game object.
    
    'refresh-wave'   - fired every time wave value is changed
    'refresh-scores' - fired on scores change
  */


  window.eur00t.jewels.Game.prototype._initializeEvent = function() {
    ($(this)).on('refresh-wave', function(e, wave) {
      if (wave !== 0) {
        return this._displayMessage("Wave " + wave + "!", 12 + 6 * wave);
      }
    });
    return ($(this)).on('refresh-scores', function(e, scores) {
      return this.scoresIndicator.children('h2').text(scores);
    });
  };

  window.eur00t.jewels.Game.prototype._initialize = function() {
    var _this = this;
    this.jQueryContainer.append(this.scoresIndicator);
    this.jQueryContainer.append(this.board);
    this.selected = {
      obj: null,
      i: -1,
      j: -1
    };
    this._refreshScores();
    this._clearBoard(true);
    return this.board.on('click', '.jewel', function(e) {
      var data, destroyedFlag, destroyedFlag0, i, j;
      data = ($(e.target)).data();
      i = data.i;
      j = data.j;
      if (_this._checkIfSelectable(i, j)) {
        return _this._selectItem(i, j);
      } else {
        _this._swapItems(i, j, _this.selected.i, _this.selected.j);
        destroyedFlag0 = (_this._destroyAt(i, j, false, true)).destroyed;
        destroyedFlag = (_this._destroyAt(_this.selected.i, _this.selected.j, false, true)).destroyed;
        if ((!destroyedFlag0) && (!destroyedFlag)) {
          (function(selectedI, selectedJ) {
            return setTimeout((function() {
              return _this._swapItems(i, j, selectedI, selectedJ);
            }), 300);
          })(_this.selected.i, _this.selected.j);
          return _this._cancelPreviousSelect();
        } else {
          _this._processWave(0);
          setTimeout((function() {
            return _this._compactizeBoard();
          }), window.eur00t.jewels.SPEED);
          setTimeout((function() {
            return _this._clearBoard();
          }), window.eur00t.jewels.SPEED * 2);
          return _this._cancelPreviousSelect();
        }
      }
    });
  };

}).call(this);
