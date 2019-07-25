(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
/// <reference path="node_modules/@types/jquery/index.d.ts" />
/// <reference path="node_modules/@types/jqueryui/index.d.ts" />
/// <reference path="node_modules/@types/bootstrap/index.d.ts" />
/// <reference path="node_modules/@types/browserify/index.d.ts" />
/// <reference path="node_modules/@types/mathjax/index.d.ts" />
/// <reference path="node_modules/@types/modernizr/index.d.ts" />
/// <reference path="node_modules/fraction.js/fraction.d.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var fraction_js_1 = require("fraction.js");
var GameTools;
(function (GameTools) {
    GameTools.defaultNextItem = null;
    GameTools.currentLevel = 0;
    var DisplayedItem = /** @class */ (function () {
        function DisplayedItem() {
            this._isDisplaying = false;
            this._isDisplaying = false;
            this.reset();
        }
        Object.defineProperty(DisplayedItem.prototype, "isDisplaying", {
            get: function () {
                return this._isDisplaying;
            },
            enumerable: true,
            configurable: true
        });
        DisplayedItem.prototype.display = function () {
            this._isDisplaying = true;
        };
        DisplayedItem.prototype.undisplay = function () {
            this._isDisplaying = false;
        };
        DisplayedItem.prototype.getNextItem = function () {
            if (GameTools.defaultNextItem != null)
                return GameTools.defaultNextItem(this);
            else
                throw new Error("No default next item provided");
        };
        DisplayedItem.prototype.displayNext = function () {
            this.undisplay();
            var item = this.getNextItem();
            if (item !== null)
                item.display();
        };
        DisplayedItem.prototype.reset = function () {
        };
        return DisplayedItem;
    }());
    GameTools.DisplayedItem = DisplayedItem;
    var QuestionOption = /** @class */ (function () {
        function QuestionOption(imgSrc, name, isCorrect) {
            if (isCorrect === void 0) { isCorrect = false; }
            this.imgSrc = imgSrc;
            this.name = name;
            this.isCorrect = isCorrect;
        }
        Object.defineProperty(QuestionOption.prototype, "question", {
            get: function () {
                return this._question;
            },
            enumerable: true,
            configurable: true
        });
        return QuestionOption;
    }());
    GameTools.QuestionOption = QuestionOption;
    var Question = /** @class */ (function (_super) {
        __extends(Question, _super);
        function Question(questionTitle, options) {
            var _this = _super.call(this) || this;
            _this.questionTitle = questionTitle;
            _this.options = options;
            options = shuffle(options);
            options.forEach(function (option) {
                option._question = _this;
            });
            _this.answeredOption = null;
            return _this;
        }
        Question.prototype.answered = function (option) {
            if (!this.canAnswerMultipleTimes() && this.answeredOption != null)
                throw "Cannot answer a question twice";
            console.log("correct: " + option.isCorrect);
            if (!option.isCorrect) {
                this.incorrectHandler(option);
                return;
            }
            this.answeredOption = option;
            this.correctHandler(option);
        };
        Question.prototype.correctHandler = function (option) {
            this.displayNext();
        };
        Question.prototype.incorrectHandler = function (option) {
            this.answeredOption = null;
            $('#question-dialog').removeData();
            $("#question-dialog").attr("data-backdrop", "static");
            $("#question-dialog .modal-title").text("Incorrect");
            $("#question-dialog .modal-footer button").text("OK");
            $("#question-dialog .modal-body").text("Sorry, that's not the right answer. Try again!");
            $("#question-dialog").modal();
        };
        Question.prototype.canAnswerMultipleTimes = function () {
            return false;
        };
        return Question;
    }(DisplayedItem));
    GameTools.Question = Question;
    /**
    * Shuffles array in place.
    * @param {Array} a items An array containing the items.
    */
    function shuffle(a) {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    }
    GameTools.shuffle = shuffle;
    var InfoBox = /** @class */ (function (_super) {
        __extends(InfoBox, _super);
        function InfoBox(title, text, buttonText) {
            if (buttonText === void 0) { buttonText = "OK"; }
            var _this = _super.call(this) || this;
            _this.title = title;
            _this.text = text;
            _this.buttonText = buttonText;
            return _this;
        }
        InfoBox.prototype.dialogCreated = function () {
        };
        InfoBox.prototype.display = function () {
            var _this = this;
            setTimeout(function () {
                $('#question-dialog').removeData();
                $("#question-dialog .modal-title").text(_this.title);
                $("#question-dialog .modal-body").text(_this.text);
                if (_this.buttonText != null) {
                    $("#question-dialog .close").show();
                    $("#question-dialog .modal-footer").show();
                    $("#question-dialog .modal-footer button").text(_this.buttonText);
                }
                else {
                    $("#question-dialog .close").hide();
                    $("#question-dialog .modal-footer").hide();
                }
                _this.dialogCreated();
                $("#question-dialog").modal({ backdrop: "static" });
                $("#question-dialog").one("shown.bs.modal", function () {
                });
                $("#question-dialog").one("hidden.bs.modal", function () {
                    $("#question-dialog").modal('dispose');
                    _this.displayNext();
                });
            }, 1000);
        };
        return InfoBox;
    }(DisplayedItem));
    GameTools.InfoBox = InfoBox;
    var Delay = /** @class */ (function (_super) {
        __extends(Delay, _super);
        function Delay(time) {
            var _this = _super.call(this) || this;
            _this.time = time;
            return _this;
        }
        Delay.prototype.display = function () {
            var _this = this;
            setTimeout(function () {
                _this.displayNext();
            }, this.time);
        };
        return Delay;
    }(DisplayedItem));
    GameTools.Delay = Delay;
    var LevelChoice = /** @class */ (function (_super) {
        __extends(LevelChoice, _super);
        function LevelChoice(levelMarkups) {
            var _this = _super.call(this, "Choose a level", "", null) || this;
            _this.levelMarkups = levelMarkups;
            return _this;
        }
        LevelChoice.prototype.dialogCreated = function () {
            $("#question-dialog .modal-body").text("");
            var $container = $("<div></div>");
            $container.addClass("level-buttons");
            this.levelMarkups.forEach(function (element, index) {
                var $button = $("<button></button>");
                $button.html(element);
                $button.data("level-id", index);
                $button.click(function () {
                    GameTools.currentLevel = $button.data("level-id");
                    $("#question-dialog").modal('hide');
                });
                $container.append($button);
            });
            $("#question-dialog .modal-body").append($container);
        };
        return LevelChoice;
    }(InfoBox));
    GameTools.LevelChoice = LevelChoice;
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    GameTools.getRandomInt = getRandomInt;
    function getRandomArbitrary(min, max) {
        var val = Math.random() * (max - min) + min;
        return val;
    }
    GameTools.getRandomArbitrary = getRandomArbitrary;
})(GameTools || (GameTools = {}));
var AnimateCanoer = /** @class */ (function (_super) {
    __extends(AnimateCanoer, _super);
    function AnimateCanoer(percent, relative) {
        if (relative === void 0) { relative = false; }
        var _this = _super.call(this) || this;
        _this.percent = percent;
        _this.relative = relative;
        return _this;
    }
    AnimateCanoer.prototype.display = function () {
        var _this = this;
        animateCanoer(this.percent, this.relative, function () {
            _this.displayNext();
        });
    };
    return AnimateCanoer;
}(GameTools.DisplayedItem));
var MoveCanoer = /** @class */ (function (_super) {
    __extends(MoveCanoer, _super);
    function MoveCanoer(percent) {
        var _this = _super.call(this) || this;
        _this.percent = percent;
        if (_this.percent < 7)
            _this.percent = 7;
        return _this;
    }
    MoveCanoer.prototype.display = function () {
        $(".canoer").css("bottom", this.percent + "%");
        this.displayNext();
    };
    return MoveCanoer;
}(GameTools.DisplayedItem));
var MathLevelChoice = /** @class */ (function (_super) {
    __extends(MathLevelChoice, _super);
    function MathLevelChoice() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MathLevelChoice.prototype.dialogCreated = function () {
        _super.prototype.dialogCreated.call(this);
        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
        MathJax.Hub.Queue(function () {
            $(".MathJax_CHTML").css("font-size", "inherit");
        });
    };
    return MathLevelChoice;
}(GameTools.LevelChoice));
var getRandomInt = GameTools.getRandomInt;
function playAudioIfSupported(audioFile, cb) {
    if (!cb)
        cb = function () { };
    if (Modernizr.audio) {
        var audio = new Audio(audioFile);
        audio.onerror = function () {
            cb();
        };
        audio.addEventListener("ended", cb);
        audio.play();
    }
    else
        cb();
}
var contentsIndex = 0;
var gameContents = [];
var numQuestions = 10;
var amountPerQuestion = (70 / numQuestions);
var Loop = /** @class */ (function (_super) {
    __extends(Loop, _super);
    function Loop(index, relative, times) {
        if (relative === void 0) { relative = false; }
        if (times === void 0) { times = 1; }
        var _this = _super.call(this) || this;
        _this.index = index;
        _this.relative = relative;
        _this.times = times;
        _this.numLoops = 0;
        if (index < 0)
            _this.relative = true;
        return _this;
    }
    /* Restore a previous loop */
    Loop.prototype.addLoop = function () {
        this.numLoops--;
        if (this.numLoops < -1)
            this.numLoops = -1;
    };
    Loop.prototype.getNumTimesLooped = function () {
        return this.numLoops;
    };
    Loop.prototype.display = function () {
        if (this.numLoops < this.times) {
            if (!this.relative)
                contentsIndex = this.index;
            else
                contentsIndex += this.index;
            contentsIndex -= 1;
            this.numLoops++;
        }
        this.displayNext();
    };
    Loop.prototype.reset = function () {
        this.numLoops = 0;
    };
    return Loop;
}(GameTools.DisplayedItem));
var questionLoop;
var SystemReset = /** @class */ (function (_super) {
    __extends(SystemReset, _super);
    function SystemReset() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SystemReset.prototype.display = function () {
        gameContents.forEach(function (element) {
            element.reset();
        });
        this.displayNext();
    };
    return SystemReset;
}(GameTools.DisplayedItem));
var MathQuestion = /** @class */ (function (_super) {
    __extends(MathQuestion, _super);
    function MathQuestion() {
        return _super.call(this, "", "", null) || this;
    }
    MathQuestion.prototype.generateNumber = function () {
        switch (GameTools.currentLevel + 1) {
            default:
                throw "Unexpected level";
            case 1:
                return new fraction_js_1.default(getRandomInt(0, 9), 1);
            case 2:
                return new fraction_js_1.default(getRandomInt(10, 99), 1);
            case 3:
                return new fraction_js_1.default(getRandomInt(100, 999), 1);
            case 4:
                return new fraction_js_1.default(getRandomInt(1000, 9999), 1);
            case 5:
                return new fraction_js_1.default(getRandomInt(1, 9), 10);
            case 6:
                return new fraction_js_1.default(getRandomInt(10, 99), 100);
            case 7:
                return new fraction_js_1.default(getRandomInt(1, 99), 100).add(new fraction_js_1.default(getRandomInt(1, 20), 1));
            case 8:
                return new fraction_js_1.default(this.forced_num, getRandomInt(this.forced_num, 9));
            case 9:
                return new fraction_js_1.default(getRandomInt(1, this.forced_num), this.forced_num);
            case 10:
                var forced_denom = getRandomInt(2, 25);
                return new fraction_js_1.default(getRandomInt(1, forced_denom - 1), forced_denom);
        }
    };
    MathQuestion.convertFraction = function (fraction) {
        var level = (GameTools.currentLevel + 1);
        if (level >= 5 && level <= 7) {
            var decimalPlaces = void 0;
            if (level != 7)
                decimalPlaces = 1 + (level - 5);
            else
                decimalPlaces = 2;
            var str = fraction.valueOf().toFixed(decimalPlaces);
            if (level == 7) {
                str = "$" + str;
            }
            return str;
        }
        else
            return fraction.toFraction(false);
    };
    MathQuestion.prototype.isCorrect = function (symNum) {
        switch (symNum) {
            case 0:
                return this.leftNum.compare(this.rightNum) < 0;
            case 1:
                return this.leftNum.compare(this.rightNum) == 0;
            case 2:
                return this.leftNum.compare(this.rightNum) > 0;
            default:
                throw "Unexpected symbol";
        }
    };
    MathQuestion.prototype.displayNext = function () {
        if (this.correct)
            _super.prototype.displayNext.call(this);
        else {
            contentsIndex++;
            questionLoop.addLoop();
            questionLoop.addLoop();
            new AnimateCanoer(-amountPerQuestion, true).display();
        }
    };
    MathQuestion.prototype.getCorrectSymNum = function () {
        var comparison = this.leftNum.compare(this.rightNum);
        if (comparison < 0)
            return 0;
        else if (comparison > 0)
            return 2;
        else
            return 1;
    };
    MathQuestion.prototype.dialogCreated = function () {
        var _this = this;
        $("#question-dialog .modal-title").text("Question " + (questionLoop.getNumTimesLooped() + 1) + " of " + 10);
        $("#question-dialog .modal-body").text("");
        this.forced_num = getRandomInt(1, 9);
        this.leftNum = this.generateNumber();
        this.rightNum = this.generateNumber();
        var $div = $("<div></div>");
        $div.addClass("math-question");
        $("#question-dialog .modal-body").append($div);
        $div.html("Choose the symbol that best describes these numbers.<p></p><span>`" + MathQuestion.convertFraction(this.leftNum) + "` <span class='question-mark'><i class='far fa-question-circle'></i></span> " + "`" + MathQuestion.convertFraction(this.rightNum) + "`"
            + "</span><p></p><button class='less-than'>` < `</button><button class='equals'>` = `</button><button class='greater-than'>` > `</button>");
        if ((GameTools.currentLevel + 1) == 7)
            $div.find(".question-mark").css("display", "block");
        $div.find("button").click(function (event) {
            var symNum;
            var $button = $(event.target);
            if ($button.hasClass("less-than"))
                symNum = 0;
            else if ($button.hasClass("equals"))
                symNum = 1;
            else if ($button.hasClass("greater-than"))
                symNum = 2;
            else
                throw "Unknown symbol";
            var symbols = ["<", "=", ">"];
            $(".math-question button").prop("disabled", true);
            _this.correct = _this.isCorrect(symNum);
            if (_this.correct) {
                playAudioIfSupported("correct.mp3");
                $div.find(".question-mark").css("color", "green");
            }
            else {
                symNum = _this.getCorrectSymNum();
                $button.effect("shake");
                $div.find(".question-mark").css("color", "red");
            }
            $div.find(".question-mark").html("` " + symbols[symNum] + " `");
            MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
            MathJax.Hub.Queue(function () {
                setTimeout(function () {
                    $("#question-dialog").modal('hide');
                }, 3000);
            });
        });
        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
        MathJax.Hub.Queue(function () {
            $(".math-question > span").children("span").css("font-size", "inherit");
        });
    };
    return MathQuestion;
}(GameTools.InfoBox));
gameContents = [
    new SystemReset(),
    new GameTools.InfoBox("Welcome!", "Welcome to Comparison Canoeing! This game will teach you all about comparing numbers."),
    new AnimateCanoer(7),
    new MathLevelChoice([
        "Level 1<p>`6 < 7`",
        "Level 2<p>`12 < 15`",
        "Level 3<p>`325 > 199`",
        "Level 4<p>`2500 > 1877`",
        "Level 5<p>`0.2 < 0.5`",
        "Level 6<p>`0.19 < 0.21`",
        "Level 7<p>`$1.23 < $4.56`",
        "Level 8<p>`1/5 < 1/7`",
        "Level 9<p>`2/4 < 3/4`",
        "Level 10<p>`7/9 > 2/3`"
    ]),
    new MathQuestion(),
    new AnimateCanoer(amountPerQuestion, true),
    questionLoop = new Loop(-2, true, numQuestions - 1),
    new GameTools.InfoBox("Congratulations!", "You've crossed the river! Ready to try a different level?", "Yes!"),
    new SystemReset(),
    new MoveCanoer(0),
    new Loop(2, false, 1)
];
GameTools.defaultNextItem = function (current) {
    if (contentsIndex == gameContents.length - 1) {
        console.error("No next items");
        return null;
    }
    console.log("Get from index " + (contentsIndex + 1));
    return gameContents[++contentsIndex];
};
function animateCanoer(percent, relative, cb) {
    if (relative === void 0) { relative = false; }
    var target = ($(window).height() - ($(".canoer").height() / 2));
    var current = parseInt($(".canoer").css("bottom"));
    if (relative) {
        console.log("Current percent: " + ((current / target) * 100));
        percent += (current / target) * 100;
    }
    if (percent < 7)
        percent = 7;
    target *= (percent / 100);
    console.log("target: " + target);
    console.log("target percent: " + percent);
    var duration = (target - current) * 10;
    $(".canoer").addClass("canoer-animated");
    $(".canoer").animate({ bottom: percent + "%" }, duration, 'linear', function () {
        $(".canoer-animated").removeClass("canoer-animated");
        if (cb)
            cb();
    });
}
$(window).on("load", function () {
    /*
    MathJax.Hub.Config({
        "HTML-CSS": {
          scale: 200
        }
    });
    */
    fraction_js_1.default.REDUCE = false;
    gameContents[contentsIndex].display();
});

},{"fraction.js":2}],2:[function(require,module,exports){
/**
 * @license Fraction.js v4.0.12 09/09/2015
 * http://www.xarg.org/2014/03/rational-numbers-in-javascript/
 *
 * Copyright (c) 2015, Robert Eisele (robert@xarg.org)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 **/


/**
 *
 * This class offers the possibility to calculate fractions.
 * You can pass a fraction in different formats. Either as array, as double, as string or as an integer.
 *
 * Array/Object form
 * [ 0 => <nominator>, 1 => <denominator> ]
 * [ n => <nominator>, d => <denominator> ]
 *
 * Integer form
 * - Single integer value
 *
 * Double form
 * - Single double value
 *
 * String form
 * 123.456 - a simple double
 * 123/456 - a string fraction
 * 123.'456' - a double with repeating decimal places
 * 123.(456) - synonym
 * 123.45'6' - a double with repeating last place
 * 123.45(6) - synonym
 *
 * Example:
 *
 * var f = new Fraction("9.4'31'");
 * f.mul([-4, 3]).div(4.9);
 *
 */

(function(root) {

  "use strict";

  // Maximum search depth for cyclic rational numbers. 2000 should be more than enough.
  // Example: 1/7 = 0.(142857) has 6 repeating decimal places.
  // If MAX_CYCLE_LEN gets reduced, long cycles will not be detected and toString() only gets the first 10 digits
  var MAX_CYCLE_LEN = 2000;

  // Parsed data to avoid calling "new" all the time
  var P = {
    "s": 1,
    "n": 0,
    "d": 1
  };

  function createError(name) {

    function errorConstructor() {
      var temp = Error.apply(this, arguments);
      temp['name'] = this['name'] = name;
      this['stack'] = temp['stack'];
      this['message'] = temp['message'];
    }

    /**
     * Error constructor
     *
     * @constructor
     */
    function IntermediateInheritor() {}
    IntermediateInheritor.prototype = Error.prototype;
    errorConstructor.prototype = new IntermediateInheritor();

    return errorConstructor;
  }

  var DivisionByZero = Fraction['DivisionByZero'] = createError('DivisionByZero');
  var InvalidParameter = Fraction['InvalidParameter'] = createError('InvalidParameter');

  function assign(n, s) {

    if (isNaN(n = parseInt(n, 10))) {
      throwInvalidParam();
    }
    return n * s;
  }

  function throwInvalidParam() {
    throw new InvalidParameter();
  }

  var parse = function(p1, p2) {

    var n = 0, d = 1, s = 1;
    var v = 0, w = 0, x = 0, y = 1, z = 1;

    var A = 0, B = 1;
    var C = 1, D = 1;

    var N = 10000000;
    var M;

    if (p1 === undefined || p1 === null) {
      /* void */
    } else if (p2 !== undefined) {
      n = p1;
      d = p2;
      s = n * d;
    } else
      switch (typeof p1) {

        case "object":
        {
          if ("d" in p1 && "n" in p1) {
            n = p1["n"];
            d = p1["d"];
            if ("s" in p1)
              n *= p1["s"];
          } else if (0 in p1) {
            n = p1[0];
            if (1 in p1)
              d = p1[1];
          } else {
            throwInvalidParam();
          }
          s = n * d;
          break;
        }
        case "number":
        {
          if (p1 < 0) {
            s = p1;
            p1 = -p1;
          }

          if (p1 % 1 === 0) {
            n = p1;
          } else if (p1 > 0) { // check for != 0, scale would become NaN (log(0)), which converges really slow

            if (p1 >= 1) {
              z = Math.pow(10, Math.floor(1 + Math.log(p1) / Math.LN10));
              p1 /= z;
            }

            // Using Farey Sequences
            // http://www.johndcook.com/blog/2010/10/20/best-rational-approximation/

            while (B <= N && D <= N) {
              M = (A + C) / (B + D);

              if (p1 === M) {
                if (B + D <= N) {
                  n = A + C;
                  d = B + D;
                } else if (D > B) {
                  n = C;
                  d = D;
                } else {
                  n = A;
                  d = B;
                }
                break;

              } else {

                if (p1 > M) {
                  A += C;
                  B += D;
                } else {
                  C += A;
                  D += B;
                }

                if (B > N) {
                  n = C;
                  d = D;
                } else {
                  n = A;
                  d = B;
                }
              }
            }
            n *= z;
          } else if (isNaN(p1) || isNaN(p2)) {
            d = n = NaN;
          }
          break;
        }
        case "string":
        {
          B = p1.match(/\d+|./g);

          if (B === null)
            throwInvalidParam();

          if (B[A] === '-') {// Check for minus sign at the beginning
            s = -1;
            A++;
          } else if (B[A] === '+') {// Check for plus sign at the beginning
            A++;
          }

          if (B.length === A + 1) { // Check if it's just a simple number "1234"
            w = assign(B[A++], s);
          } else if (B[A + 1] === '.' || B[A] === '.') { // Check if it's a decimal number

            if (B[A] !== '.') { // Handle 0.5 and .5
              v = assign(B[A++], s);
            }
            A++;

            // Check for decimal places
            if (A + 1 === B.length || B[A + 1] === '(' && B[A + 3] === ')' || B[A + 1] === "'" && B[A + 3] === "'") {
              w = assign(B[A], s);
              y = Math.pow(10, B[A].length);
              A++;
            }

            // Check for repeating places
            if (B[A] === '(' && B[A + 2] === ')' || B[A] === "'" && B[A + 2] === "'") {
              x = assign(B[A + 1], s);
              z = Math.pow(10, B[A + 1].length) - 1;
              A += 3;
            }

          } else if (B[A + 1] === '/' || B[A + 1] === ':') { // Check for a simple fraction "123/456" or "123:456"
            w = assign(B[A], s);
            y = assign(B[A + 2], 1);
            A += 3;
          } else if (B[A + 3] === '/' && B[A + 1] === ' ') { // Check for a complex fraction "123 1/2"
            v = assign(B[A], s);
            w = assign(B[A + 2], s);
            y = assign(B[A + 4], 1);
            A += 5;
          }

          if (B.length <= A) { // Check for more tokens on the stack
            d = y * z;
            s = /* void */
                    n = x + d * v + z * w;
            break;
          }

          /* Fall through on error */
        }
        default:
          throwInvalidParam();
      }

    if (d === 0) {
      throw new DivisionByZero();
    }

    P["s"] = s < 0 ? -1 : 1;
    P["n"] = Math.abs(n);
    P["d"] = Math.abs(d);
  };

  function modpow(b, e, m) {

    var r = 1;
    for (; e > 0; b = (b * b) % m, e >>= 1) {

      if (e & 1) {
        r = (r * b) % m;
      }
    }
    return r;
  }


  function cycleLen(n, d) {

    for (; d % 2 === 0;
            d /= 2) {
    }

    for (; d % 5 === 0;
            d /= 5) {
    }

    if (d === 1) // Catch non-cyclic numbers
      return 0;

    // If we would like to compute really large numbers quicker, we could make use of Fermat's little theorem:
    // 10^(d-1) % d == 1
    // However, we don't need such large numbers and MAX_CYCLE_LEN should be the capstone,
    // as we want to translate the numbers to strings.

    var rem = 10 % d;
    var t = 1;

    for (; rem !== 1; t++) {
      rem = rem * 10 % d;

      if (t > MAX_CYCLE_LEN)
        return 0; // Returning 0 here means that we don't print it as a cyclic number. It's likely that the answer is `d-1`
    }
    return t;
  }


     function cycleStart(n, d, len) {

    var rem1 = 1;
    var rem2 = modpow(10, len, d);

    for (var t = 0; t < 300; t++) { // s < ~log10(Number.MAX_VALUE)
      // Solve 10^s == 10^(s+t) (mod d)

      if (rem1 === rem2)
        return t;

      rem1 = rem1 * 10 % d;
      rem2 = rem2 * 10 % d;
    }
    return 0;
  }

  function gcd(a, b) {

    if (!a)
      return b;
    if (!b)
      return a;

    while (1) {
      a %= b;
      if (!a)
        return b;
      b %= a;
      if (!b)
        return a;
    }
  };

  /**
   * Module constructor
   *
   * @constructor
   * @param {number|Fraction=} a
   * @param {number=} b
   */
  function Fraction(a, b) {

    if (!(this instanceof Fraction)) {
      return new Fraction(a, b);
    }

    parse(a, b);

    if (Fraction['REDUCE']) {
      a = gcd(P["d"], P["n"]); // Abuse a
    } else {
      a = 1;
    }

    this["s"] = P["s"];
    this["n"] = P["n"] / a;
    this["d"] = P["d"] / a;
  }

  /**
   * Boolean global variable to be able to disable automatic reduction of the fraction
   *
   */
  Fraction['REDUCE'] = 1;

  Fraction.prototype = {

    "s": 1,
    "n": 0,
    "d": 1,

    /**
     * Calculates the absolute value
     *
     * Ex: new Fraction(-4).abs() => 4
     **/
    "abs": function() {

      return new Fraction(this["n"], this["d"]);
    },

    /**
     * Inverts the sign of the current fraction
     *
     * Ex: new Fraction(-4).neg() => 4
     **/
    "neg": function() {

      return new Fraction(-this["s"] * this["n"], this["d"]);
    },

    /**
     * Adds two rational numbers
     *
     * Ex: new Fraction({n: 2, d: 3}).add("14.9") => 467 / 30
     **/
    "add": function(a, b) {

      parse(a, b);
      return new Fraction(
              this["s"] * this["n"] * P["d"] + P["s"] * this["d"] * P["n"],
              this["d"] * P["d"]
              );
    },

    /**
     * Subtracts two rational numbers
     *
     * Ex: new Fraction({n: 2, d: 3}).add("14.9") => -427 / 30
     **/
    "sub": function(a, b) {

      parse(a, b);
      return new Fraction(
              this["s"] * this["n"] * P["d"] - P["s"] * this["d"] * P["n"],
              this["d"] * P["d"]
              );
    },

    /**
     * Multiplies two rational numbers
     *
     * Ex: new Fraction("-17.(345)").mul(3) => 5776 / 111
     **/
    "mul": function(a, b) {

      parse(a, b);
      return new Fraction(
              this["s"] * P["s"] * this["n"] * P["n"],
              this["d"] * P["d"]
              );
    },

    /**
     * Divides two rational numbers
     *
     * Ex: new Fraction("-17.(345)").inverse().div(3)
     **/
    "div": function(a, b) {

      parse(a, b);
      return new Fraction(
              this["s"] * P["s"] * this["n"] * P["d"],
              this["d"] * P["n"]
              );
    },

    /**
     * Clones the actual object
     *
     * Ex: new Fraction("-17.(345)").clone()
     **/
    "clone": function() {
      return new Fraction(this);
    },

    /**
     * Calculates the modulo of two rational numbers - a more precise fmod
     *
     * Ex: new Fraction('4.(3)').mod([7, 8]) => (13/3) % (7/8) = (5/6)
     **/
    "mod": function(a, b) {

      if (isNaN(this['n']) || isNaN(this['d'])) {
        return new Fraction(NaN);
      }

      if (a === undefined) {
        return new Fraction(this["s"] * this["n"] % this["d"], 1);
      }

      parse(a, b);
      if (0 === P["n"] && 0 === this["d"]) {
        Fraction(0, 0); // Throw DivisionByZero
      }

      /*
       * First silly attempt, kinda slow
       *
       return that["sub"]({
       "n": num["n"] * Math.floor((this.n / this.d) / (num.n / num.d)),
       "d": num["d"],
       "s": this["s"]
       });*/

      /*
       * New attempt: a1 / b1 = a2 / b2 * q + r
       * => b2 * a1 = a2 * b1 * q + b1 * b2 * r
       * => (b2 * a1 % a2 * b1) / (b1 * b2)
       */
      return new Fraction(
              this["s"] * (P["d"] * this["n"]) % (P["n"] * this["d"]),
              P["d"] * this["d"]
              );
    },

    /**
     * Calculates the fractional gcd of two rational numbers
     *
     * Ex: new Fraction(5,8).gcd(3,7) => 1/56
     */
    "gcd": function(a, b) {

      parse(a, b);

      // gcd(a / b, c / d) = gcd(a, c) / lcm(b, d)

      return new Fraction(gcd(P["n"], this["n"]) * gcd(P["d"], this["d"]), P["d"] * this["d"]);
    },

    /**
     * Calculates the fractional lcm of two rational numbers
     *
     * Ex: new Fraction(5,8).lcm(3,7) => 15
     */
    "lcm": function(a, b) {

      parse(a, b);

      // lcm(a / b, c / d) = lcm(a, c) / gcd(b, d)

      if (P["n"] === 0 && this["n"] === 0) {
        return new Fraction;
      }
      return new Fraction(P["n"] * this["n"], gcd(P["n"], this["n"]) * gcd(P["d"], this["d"]));
    },

    /**
     * Calculates the ceil of a rational number
     *
     * Ex: new Fraction('4.(3)').ceil() => (5 / 1)
     **/
    "ceil": function(places) {

      places = Math.pow(10, places || 0);

      if (isNaN(this["n"]) || isNaN(this["d"])) {
        return new Fraction(NaN);
      }
      return new Fraction(Math.ceil(places * this["s"] * this["n"] / this["d"]), places);
    },

    /**
     * Calculates the floor of a rational number
     *
     * Ex: new Fraction('4.(3)').floor() => (4 / 1)
     **/
    "floor": function(places) {

      places = Math.pow(10, places || 0);

      if (isNaN(this["n"]) || isNaN(this["d"])) {
        return new Fraction(NaN);
      }
      return new Fraction(Math.floor(places * this["s"] * this["n"] / this["d"]), places);
    },

    /**
     * Rounds a rational numbers
     *
     * Ex: new Fraction('4.(3)').round() => (4 / 1)
     **/
    "round": function(places) {

      places = Math.pow(10, places || 0);

      if (isNaN(this["n"]) || isNaN(this["d"])) {
        return new Fraction(NaN);
      }
      return new Fraction(Math.round(places * this["s"] * this["n"] / this["d"]), places);
    },

    /**
     * Gets the inverse of the fraction, means numerator and denumerator are exchanged
     *
     * Ex: new Fraction([-3, 4]).inverse() => -4 / 3
     **/
    "inverse": function() {

      return new Fraction(this["s"] * this["d"], this["n"]);
    },

    /**
     * Calculates the fraction to some integer exponent
     *
     * Ex: new Fraction(-1,2).pow(-3) => -8
     */
    "pow": function(m) {

      if (m < 0) {
        return new Fraction(Math.pow(this['s'] * this["d"], -m), Math.pow(this["n"], -m));
      } else {
        return new Fraction(Math.pow(this['s'] * this["n"], m), Math.pow(this["d"], m));
      }
    },

    /**
     * Check if two rational numbers are the same
     *
     * Ex: new Fraction(19.6).equals([98, 5]);
     **/
    "equals": function(a, b) {

      parse(a, b);
      return this["s"] * this["n"] * P["d"] === P["s"] * P["n"] * this["d"]; // Same as compare() === 0
    },

    /**
     * Check if two rational numbers are the same
     *
     * Ex: new Fraction(19.6).equals([98, 5]);
     **/
    "compare": function(a, b) {

      parse(a, b);
      var t = (this["s"] * this["n"] * P["d"] - P["s"] * P["n"] * this["d"]);
      return (0 < t) - (t < 0);
    },

    "simplify": function(eps) {

      // First naive implementation, needs improvement

      if (isNaN(this['n']) || isNaN(this['d'])) {
        return this;
      }

      var cont = this['abs']()['toContinued']();

      eps = eps || 0.001;

      function rec(a) {
        if (a.length === 1)
          return new Fraction(a[0]);
        return rec(a.slice(1))['inverse']()['add'](a[0]);
      }

      for (var i = 0; i < cont.length; i++) {
        var tmp = rec(cont.slice(0, i + 1));
        if (tmp['sub'](this['abs']())['abs']().valueOf() < eps) {
          return tmp['mul'](this['s']);
        }
      }
      return this;
    },

    /**
     * Check if two rational numbers are divisible
     *
     * Ex: new Fraction(19.6).divisible(1.5);
     */
    "divisible": function(a, b) {

      parse(a, b);
      return !(!(P["n"] * this["d"]) || ((this["n"] * P["d"]) % (P["n"] * this["d"])));
    },

    /**
     * Returns a decimal representation of the fraction
     *
     * Ex: new Fraction("100.'91823'").valueOf() => 100.91823918239183
     **/
    'valueOf': function() {

      return this["s"] * this["n"] / this["d"];
    },

    /**
     * Returns a string-fraction representation of a Fraction object
     *
     * Ex: new Fraction("1.'3'").toFraction() => "4 1/3"
     **/
    'toFraction': function(excludeWhole) {

      var whole, str = "";
      var n = this["n"];
      var d = this["d"];
      if (this["s"] < 0) {
        str += '-';
      }

      if (d === 1) {
        str += n;
      } else {

        if (excludeWhole && (whole = Math.floor(n / d)) > 0) {
          str += whole;
          str += " ";
          n %= d;
        }

        str += n;
        str += '/';
        str += d;
      }
      return str;
    },

    /**
     * Returns a latex representation of a Fraction object
     *
     * Ex: new Fraction("1.'3'").toLatex() => "\frac{4}{3}"
     **/
    'toLatex': function(excludeWhole) {

      var whole, str = "";
      var n = this["n"];
      var d = this["d"];
      if (this["s"] < 0) {
        str += '-';
      }

      if (d === 1) {
        str += n;
      } else {

        if (excludeWhole && (whole = Math.floor(n / d)) > 0) {
          str += whole;
          n %= d;
        }

        str += "\\frac{";
        str += n;
        str += '}{';
        str += d;
        str += '}';
      }
      return str;
    },

    /**
     * Returns an array of continued fraction elements
     *
     * Ex: new Fraction("7/8").toContinued() => [0,1,7]
     */
    'toContinued': function() {

      var t;
      var a = this['n'];
      var b = this['d'];
      var res = [];

      if (isNaN(this['n']) || isNaN(this['d'])) {
        return res;
      }

      do {
        res.push(Math.floor(a / b));
        t = a % b;
        a = b;
        b = t;
      } while (a !== 1);

      return res;
    },

    /**
     * Creates a string representation of a fraction with all digits
     *
     * Ex: new Fraction("100.'91823'").toString() => "100.(91823)"
     **/
    'toString': function(dec) {

      var g;
      var N = this["n"];
      var D = this["d"];

      if (isNaN(N) || isNaN(D)) {
        return "NaN";
      }

      if (!Fraction['REDUCE']) {
        g = gcd(N, D);
        N /= g;
        D /= g;
      }

      dec = dec || 15; // 15 = decimal places when no repitation

      var cycLen = cycleLen(N, D); // Cycle length
      var cycOff = cycleStart(N, D, cycLen); // Cycle start

      var str = this['s'] === -1 ? "-" : "";

      str += N / D | 0;

      N %= D;
      N *= 10;

      if (N)
        str += ".";

      if (cycLen) {

        for (var i = cycOff; i--; ) {
          str += N / D | 0;
          N %= D;
          N *= 10;
        }
        str += "(";
        for (var i = cycLen; i--; ) {
          str += N / D | 0;
          N %= D;
          N *= 10;
        }
        str += ")";
      } else {
        for (var i = dec; N && i--; ) {
          str += N / D | 0;
          N %= D;
          N *= 10;
        }
      }
      return str;
    }
  };

  if (typeof define === "function" && define["amd"]) {
    define([], function() {
      return Fraction;
    });
  } else if (typeof exports === "object") {
    Object.defineProperty(exports, "__esModule", {'value': true});
    Fraction['default'] = Fraction;
    Fraction['Fraction'] = Fraction;
    module['exports'] = Fraction;
  } else {
    root['Fraction'] = Fraction;
  }

})(this);

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL2hvbWUvdHQvLm5wbS1wYWNrYWdlcy9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjb2RlLnRzIiwibm9kZV9tb2R1bGVzL2ZyYWN0aW9uLmpzL2ZyYWN0aW9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBLDhEQUE4RDtBQUM5RCxnRUFBZ0U7QUFDaEUsaUVBQWlFO0FBQ2pFLGtFQUFrRTtBQUNsRSwrREFBK0Q7QUFDL0QsaUVBQWlFO0FBQ2pFLCtEQUErRDs7Ozs7Ozs7Ozs7Ozs7O0FBRS9ELDJDQUFtQztBQUVuQyxJQUFVLFNBQVMsQ0E0S2xCO0FBNUtELFdBQVUsU0FBUztJQUNKLHlCQUFlLEdBQThDLElBQUksQ0FBQztJQUNsRSxzQkFBWSxHQUFHLENBQUMsQ0FBQztJQUM1QjtRQUtJO1lBSlEsa0JBQWEsR0FBRyxLQUFLLENBQUM7WUFLMUIsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7WUFDM0IsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2pCLENBQUM7UUFORCxzQkFBVyx1Q0FBWTtpQkFBdkI7Z0JBQ0ksT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDO1lBQzlCLENBQUM7OztXQUFBO1FBS0QsK0JBQU8sR0FBUDtZQUNJLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1FBQzlCLENBQUM7UUFDRCxpQ0FBUyxHQUFUO1lBQ0ksSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7UUFDL0IsQ0FBQztRQUNELG1DQUFXLEdBQVg7WUFDSSxJQUFJLFVBQUEsZUFBZSxJQUFJLElBQUk7Z0JBQ3ZCLE9BQU8sVUFBQSxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7O2dCQUU3QixNQUFNLElBQUksS0FBSyxDQUFDLCtCQUErQixDQUFDLENBQUM7UUFDekQsQ0FBQztRQUNNLG1DQUFXLEdBQWxCO1lBQ0ksSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ2pCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUM5QixJQUFHLElBQUksS0FBSyxJQUFJO2dCQUNaLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUN2QixDQUFDO1FBQ0QsNkJBQUssR0FBTDtRQUVBLENBQUM7UUFDTCxvQkFBQztJQUFELENBOUJBLEFBOEJDLElBQUE7SUE5QnFCLHVCQUFhLGdCQThCbEMsQ0FBQTtJQUVEO1FBS0ksd0JBQW1CLE1BQWMsRUFBUyxJQUFZLEVBQVMsU0FBaUI7WUFBakIsMEJBQUEsRUFBQSxpQkFBaUI7WUFBN0QsV0FBTSxHQUFOLE1BQU0sQ0FBUTtZQUFTLFNBQUksR0FBSixJQUFJLENBQVE7WUFBUyxjQUFTLEdBQVQsU0FBUyxDQUFRO1FBQ2hGLENBQUM7UUFKRCxzQkFBVyxvQ0FBUTtpQkFBbkI7Z0JBQ0ksT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO1lBQzFCLENBQUM7OztXQUFBO1FBR0wscUJBQUM7SUFBRCxDQVBBLEFBT0MsSUFBQTtJQVBZLHdCQUFjLGlCQU8xQixDQUFBO0lBRUQ7UUFBdUMsNEJBQWE7UUFFaEQsa0JBQXNCLGFBQXFCLEVBQVksT0FBeUI7WUFBaEYsWUFDSSxpQkFBTyxTQU1WO1lBUHFCLG1CQUFhLEdBQWIsYUFBYSxDQUFRO1lBQVksYUFBTyxHQUFQLE9BQU8sQ0FBa0I7WUFFNUUsT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUMzQixPQUFPLENBQUMsT0FBTyxDQUFDLFVBQUMsTUFBc0I7Z0JBQ25DLE1BQU0sQ0FBQyxTQUFTLEdBQUcsS0FBSSxDQUFDO1lBQzVCLENBQUMsQ0FBQyxDQUFDO1lBQ0gsS0FBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7O1FBQy9CLENBQUM7UUFDUywyQkFBUSxHQUFsQixVQUFtQixNQUFzQjtZQUNyQyxJQUFJLENBQUMsSUFBSSxDQUFDLHNCQUFzQixFQUFFLElBQUksSUFBSSxDQUFDLGNBQWMsSUFBSSxJQUFJO2dCQUM3RCxNQUFNLGdDQUFnQyxDQUFDO1lBQzNDLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUM1QyxJQUFHLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRTtnQkFDbEIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUM5QixPQUFPO2FBQ1Y7WUFDRCxJQUFJLENBQUMsY0FBYyxHQUFHLE1BQU0sQ0FBQztZQUM3QixJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2hDLENBQUM7UUFDUyxpQ0FBYyxHQUF4QixVQUF5QixNQUFzQjtZQUMzQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDdkIsQ0FBQztRQUNTLG1DQUFnQixHQUExQixVQUEyQixNQUFzQjtZQUM3QyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztZQUMzQixDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUNuQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ3RELENBQUMsQ0FBQywrQkFBK0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNyRCxDQUFDLENBQUMsdUNBQXVDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdEQsQ0FBQyxDQUFDLDhCQUE4QixDQUFDLENBQUMsSUFBSSxDQUFDLGdEQUFnRCxDQUFDLENBQUM7WUFDekYsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDbEMsQ0FBQztRQUNTLHlDQUFzQixHQUFoQztZQUNJLE9BQU8sS0FBSyxDQUFDO1FBQ2pCLENBQUM7UUFFTCxlQUFDO0lBQUQsQ0FyQ0EsQUFxQ0MsQ0FyQ3NDLGFBQWEsR0FxQ25EO0lBckNxQixrQkFBUSxXQXFDN0IsQ0FBQTtJQUVEOzs7TUFHRTtJQUNGLFNBQWdCLE9BQU8sQ0FBSSxDQUFNO1FBQzdCLElBQUksQ0FBUyxFQUFFLENBQUksRUFBRSxDQUFTLENBQUM7UUFDL0IsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMvQixDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4QyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1QsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNaLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDWjtRQUNELE9BQU8sQ0FBQyxDQUFDO0lBQ2IsQ0FBQztJQVRlLGlCQUFPLFVBU3RCLENBQUE7SUFFRDtRQUE2QiwyQkFBYTtRQUN0QyxpQkFBc0IsS0FBYSxFQUFZLElBQVksRUFBWSxVQUFpQjtZQUFqQiwyQkFBQSxFQUFBLGlCQUFpQjtZQUF4RixZQUNJLGlCQUFPLFNBQ1Y7WUFGcUIsV0FBSyxHQUFMLEtBQUssQ0FBUTtZQUFZLFVBQUksR0FBSixJQUFJLENBQVE7WUFBWSxnQkFBVSxHQUFWLFVBQVUsQ0FBTzs7UUFFeEYsQ0FBQztRQUNTLCtCQUFhLEdBQXZCO1FBRUEsQ0FBQztRQUNELHlCQUFPLEdBQVA7WUFBQSxpQkF3QkM7WUF2QkcsVUFBVSxDQUFDO2dCQUNQLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDO2dCQUNuQyxDQUFDLENBQUMsK0JBQStCLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNwRCxDQUFDLENBQUMsOEJBQThCLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNsRCxJQUFHLEtBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxFQUFFO29CQUN4QixDQUFDLENBQUMseUJBQXlCLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDcEMsQ0FBQyxDQUFDLGdDQUFnQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQzNDLENBQUMsQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7aUJBQ3BFO3FCQUFNO29CQUNILENBQUMsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO29CQUNwQyxDQUFDLENBQUMsZ0NBQWdDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztpQkFDOUM7Z0JBQ0QsS0FBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUNyQixDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxLQUFLLENBQUUsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztnQkFDckQsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFO2dCQUU1QyxDQUFDLENBQUMsQ0FBQztnQkFDSCxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUU7b0JBQ3JDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztvQkFDdkMsS0FBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO2dCQUMzQixDQUFDLENBQUMsQ0FBQztZQUVSLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNaLENBQUM7UUFDTCxjQUFDO0lBQUQsQ0FoQ0EsQUFnQ0MsQ0FoQzRCLGFBQWEsR0FnQ3pDO0lBaENZLGlCQUFPLFVBZ0NuQixDQUFBO0lBQ0Q7UUFBMkIseUJBQWE7UUFDcEMsZUFBc0IsSUFBWTtZQUFsQyxZQUNJLGlCQUFPLFNBQ1Y7WUFGcUIsVUFBSSxHQUFKLElBQUksQ0FBUTs7UUFFbEMsQ0FBQztRQUNELHVCQUFPLEdBQVA7WUFBQSxpQkFJQztZQUhHLFVBQVUsQ0FBQztnQkFDUCxLQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDdkIsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQixDQUFDO1FBQ0wsWUFBQztJQUFELENBVEEsQUFTQyxDQVQwQixhQUFhLEdBU3ZDO0lBVFksZUFBSyxRQVNqQixDQUFBO0lBQ0Q7UUFBaUMsK0JBQU87UUFDcEMscUJBQXNCLFlBQXNCO1lBQTVDLFlBQ0ksa0JBQU0sZ0JBQWdCLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxTQUNwQztZQUZxQixrQkFBWSxHQUFaLFlBQVksQ0FBVTs7UUFFNUMsQ0FBQztRQUNTLG1DQUFhLEdBQXZCO1lBQ0ksQ0FBQyxDQUFDLDhCQUE4QixDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzNDLElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUNsQyxVQUFVLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQ3JDLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLEtBQUs7Z0JBRXJDLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO2dCQUNyQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUN0QixPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDaEMsT0FBTyxDQUFDLEtBQUssQ0FBQztvQkFDVixTQUFTLENBQUMsWUFBWSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7b0JBQ2xELENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDeEMsQ0FBQyxDQUFDLENBQUM7Z0JBQ0gsVUFBVSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUMvQixDQUFDLENBQUMsQ0FBQztZQUNILENBQUMsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN6RCxDQUFDO1FBQ0wsa0JBQUM7SUFBRCxDQXJCQSxBQXFCQyxDQXJCZ0MsT0FBTyxHQXFCdkM7SUFyQlkscUJBQVcsY0FxQnZCLENBQUE7SUFDRCxTQUFnQixZQUFZLENBQUMsR0FBWSxFQUFFLEdBQVc7UUFDbEQsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDckIsR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdEIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7SUFDN0QsQ0FBQztJQUplLHNCQUFZLGVBSTNCLENBQUE7SUFDRCxTQUFnQixrQkFBa0IsQ0FBQyxHQUFXLEVBQUUsR0FBVztRQUN2RCxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBQzVDLE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQztJQUhlLDRCQUFrQixxQkFHakMsQ0FBQTtBQUNMLENBQUMsRUE1S1MsU0FBUyxLQUFULFNBQVMsUUE0S2xCO0FBRUQ7SUFBNEIsaUNBQXVCO0lBQy9DLHVCQUFtQixPQUFlLEVBQVMsUUFBZ0I7UUFBaEIseUJBQUEsRUFBQSxnQkFBZ0I7UUFBM0QsWUFBK0QsaUJBQU8sU0FBRztRQUF0RCxhQUFPLEdBQVAsT0FBTyxDQUFRO1FBQVMsY0FBUSxHQUFSLFFBQVEsQ0FBUTs7SUFBYSxDQUFDO0lBQ3pFLCtCQUFPLEdBQVA7UUFBQSxpQkFJQztRQUhHLGFBQWEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDdkMsS0FBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUNMLG9CQUFDO0FBQUQsQ0FQQSxBQU9DLENBUDJCLFNBQVMsQ0FBQyxhQUFhLEdBT2xEO0FBRUQ7SUFBeUIsOEJBQXVCO0lBQzVDLG9CQUFtQixPQUFlO1FBQWxDLFlBQXNDLGlCQUFPLFNBQTBDO1FBQXBFLGFBQU8sR0FBUCxPQUFPLENBQVE7UUFBYSxJQUFHLEtBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQztZQUFFLEtBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDOztJQUFDLENBQUM7SUFDdkYsNEJBQU8sR0FBUDtRQUNJLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDL0MsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3ZCLENBQUM7SUFDTCxpQkFBQztBQUFELENBTkEsQUFNQyxDQU53QixTQUFTLENBQUMsYUFBYSxHQU0vQztBQUVEO0lBQThCLG1DQUFxQjtJQUFuRDs7SUFRQSxDQUFDO0lBUEcsdUNBQWEsR0FBYjtRQUNJLGlCQUFNLGFBQWEsV0FBRSxDQUFDO1FBQ3RCLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxFQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzNDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDO1lBQ2QsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNwRCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFDTCxzQkFBQztBQUFELENBUkEsQUFRQyxDQVI2QixTQUFTLENBQUMsV0FBVyxHQVFsRDtBQUNELElBQU8sWUFBWSxHQUFHLFNBQVMsQ0FBQyxZQUFZLENBQUM7QUFHN0MsU0FBUyxvQkFBb0IsQ0FBQyxTQUFpQixFQUFFLEVBQWU7SUFDNUQsSUFBRyxDQUFDLEVBQUU7UUFDRixFQUFFLEdBQUcsY0FBWSxDQUFDLENBQUM7SUFDdkIsSUFBRyxTQUFTLENBQUMsS0FBSyxFQUFFO1FBQ2hCLElBQUksS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2pDLEtBQUssQ0FBQyxPQUFPLEdBQUc7WUFDWixFQUFFLEVBQUUsQ0FBQztRQUNULENBQUMsQ0FBQTtRQUNELEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDcEMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ2hCOztRQUNHLEVBQUUsRUFBRSxDQUFDO0FBQ2IsQ0FBQztBQUVELElBQUksYUFBYSxHQUFHLENBQUMsQ0FBQztBQUN0QixJQUFJLFlBQVksR0FBOEIsRUFBRSxDQUFDO0FBQ2pELElBQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQztBQUN4QixJQUFNLGlCQUFpQixHQUFHLENBQUMsRUFBRSxHQUFDLFlBQVksQ0FBQyxDQUFDO0FBRTVDO0lBQW1CLHdCQUF1QjtJQUV0QyxjQUFtQixLQUFhLEVBQVMsUUFBZ0IsRUFBUyxLQUFTO1FBQWxDLHlCQUFBLEVBQUEsZ0JBQWdCO1FBQVMsc0JBQUEsRUFBQSxTQUFTO1FBQTNFLFlBQ0ksaUJBQU8sU0FHVjtRQUprQixXQUFLLEdBQUwsS0FBSyxDQUFRO1FBQVMsY0FBUSxHQUFSLFFBQVEsQ0FBUTtRQUFTLFdBQUssR0FBTCxLQUFLLENBQUk7UUFEbkUsY0FBUSxHQUFHLENBQUMsQ0FBQztRQUdqQixJQUFHLEtBQUssR0FBRyxDQUFDO1lBQ1IsS0FBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7O0lBQzdCLENBQUM7SUFDRCw2QkFBNkI7SUFDN0Isc0JBQU8sR0FBUDtRQUNJLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNoQixJQUFHLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1lBQ2pCLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDM0IsQ0FBQztJQUNELGdDQUFpQixHQUFqQjtRQUNJLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN6QixDQUFDO0lBQ0Qsc0JBQU8sR0FBUDtRQUNJLElBQUcsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBRTNCLElBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUTtnQkFDYixhQUFhLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQzs7Z0JBRTNCLGFBQWEsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDO1lBRWhDLGFBQWEsSUFBSSxDQUFDLENBQUM7WUFDbkIsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ25CO1FBQ0QsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3ZCLENBQUM7SUFDRCxvQkFBSyxHQUFMO1FBQ0ksSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7SUFDdEIsQ0FBQztJQUNMLFdBQUM7QUFBRCxDQWhDQSxBQWdDQyxDQWhDa0IsU0FBUyxDQUFDLGFBQWEsR0FnQ3pDO0FBRUQsSUFBSSxZQUFrQixDQUFDO0FBRXZCO0lBQTBCLCtCQUF1QjtJQUFqRDs7SUFPQSxDQUFDO0lBTkcsNkJBQU8sR0FBUDtRQUNJLFlBQVksQ0FBQyxPQUFPLENBQUMsVUFBQSxPQUFPO1lBQ3hCLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNwQixDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUN2QixDQUFDO0lBQ0wsa0JBQUM7QUFBRCxDQVBBLEFBT0MsQ0FQeUIsU0FBUyxDQUFDLGFBQWEsR0FPaEQ7QUFHRDtJQUEyQixnQ0FBaUI7SUFLeEM7ZUFDSSxrQkFBTSxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQztJQUN2QixDQUFDO0lBQ00scUNBQWMsR0FBckI7UUFDSSxRQUFPLFNBQVMsQ0FBQyxZQUFZLEdBQUcsQ0FBQyxFQUFFO1lBQy9CO2dCQUNJLE1BQU0sa0JBQWtCLENBQUM7WUFDN0IsS0FBSyxDQUFDO2dCQUNGLE9BQU8sSUFBSSxxQkFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDL0MsS0FBSyxDQUFDO2dCQUNGLE9BQU8sSUFBSSxxQkFBUSxDQUFDLFlBQVksQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDakQsS0FBSyxDQUFDO2dCQUNGLE9BQU8sSUFBSSxxQkFBUSxDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDbkQsS0FBSyxDQUFDO2dCQUNGLE9BQU8sSUFBSSxxQkFBUSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDckQsS0FBSyxDQUFDO2dCQUNGLE9BQU8sSUFBSSxxQkFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDaEQsS0FBSyxDQUFDO2dCQUNGLE9BQU8sSUFBSSxxQkFBUSxDQUFDLFlBQVksQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDbkQsS0FBSyxDQUFDO2dCQUNGLE9BQU8sSUFBSSxxQkFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUkscUJBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUYsS0FBSyxDQUFDO2dCQUNGLE9BQU8sSUFBSSxxQkFBUSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsWUFBWSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzRSxLQUFLLENBQUM7Z0JBQ0YsT0FBTyxJQUFJLHFCQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzNF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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwibm9kZV9tb2R1bGVzL0B0eXBlcy9qcXVlcnkvaW5kZXguZC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwibm9kZV9tb2R1bGVzL0B0eXBlcy9qcXVlcnl1aS9pbmRleC5kLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJub2RlX21vZHVsZXMvQHR5cGVzL2Jvb3RzdHJhcC9pbmRleC5kLnRzXCIgLz5cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJub2RlX21vZHVsZXMvQHR5cGVzL2Jyb3dzZXJpZnkvaW5kZXguZC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwibm9kZV9tb2R1bGVzL0B0eXBlcy9tYXRoamF4L2luZGV4LmQudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIm5vZGVfbW9kdWxlcy9AdHlwZXMvbW9kZXJuaXpyL2luZGV4LmQudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIm5vZGVfbW9kdWxlcy9mcmFjdGlvbi5qcy9mcmFjdGlvbi5kLnRzXCIgLz5cblxuaW1wb3J0IEZyYWN0aW9uIGZyb20gXCJmcmFjdGlvbi5qc1wiO1xuXG5uYW1lc3BhY2UgR2FtZVRvb2xzIHtcbiAgICBleHBvcnQgbGV0IGRlZmF1bHROZXh0SXRlbTogKGN1cnJlbnQ6IERpc3BsYXllZEl0ZW0pID0+IERpc3BsYXllZEl0ZW0gPSBudWxsO1xuICAgIGV4cG9ydCBsZXQgY3VycmVudExldmVsID0gMDtcbiAgICBleHBvcnQgYWJzdHJhY3QgY2xhc3MgRGlzcGxheWVkSXRlbSB7XG4gICAgICAgIHByaXZhdGUgX2lzRGlzcGxheWluZyA9IGZhbHNlO1xuICAgICAgICBwdWJsaWMgZ2V0IGlzRGlzcGxheWluZygpOiBib29sZWFuIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9pc0Rpc3BsYXlpbmc7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICB0aGlzLl9pc0Rpc3BsYXlpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgfVxuICAgICAgICBkaXNwbGF5KCk6IHZvaWQge1xuICAgICAgICAgICAgdGhpcy5faXNEaXNwbGF5aW5nID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICB1bmRpc3BsYXkoKTogdm9pZCB7XG4gICAgICAgICAgICB0aGlzLl9pc0Rpc3BsYXlpbmcgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBnZXROZXh0SXRlbSgpOiBEaXNwbGF5ZWRJdGVtIHtcbiAgICAgICAgICAgIGlmIChkZWZhdWx0TmV4dEl0ZW0gIT0gbnVsbClcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVmYXVsdE5leHRJdGVtKHRoaXMpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIGRlZmF1bHQgbmV4dCBpdGVtIHByb3ZpZGVkXCIpO1xuICAgICAgICB9XG4gICAgICAgIHB1YmxpYyBkaXNwbGF5TmV4dCgpOiB2b2lkIHtcbiAgICAgICAgICAgIHRoaXMudW5kaXNwbGF5KCk7XG4gICAgICAgICAgICBsZXQgaXRlbSA9IHRoaXMuZ2V0TmV4dEl0ZW0oKTtcbiAgICAgICAgICAgIGlmKGl0ZW0gIT09IG51bGwpXG4gICAgICAgICAgICAgICAgaXRlbS5kaXNwbGF5KCk7XG4gICAgICAgIH1cbiAgICAgICAgcmVzZXQoKTogdm9pZCB7XG5cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvbk9wdGlvbiB7XG4gICAgICAgIF9xdWVzdGlvbjogUXVlc3Rpb247XG4gICAgICAgIHB1YmxpYyBnZXQgcXVlc3Rpb24oKTogUXVlc3Rpb24ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3F1ZXN0aW9uO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBpbWdTcmM6IHN0cmluZywgcHVibGljIG5hbWU6IHN0cmluZywgcHVibGljIGlzQ29ycmVjdCA9IGZhbHNlKSB7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBleHBvcnQgYWJzdHJhY3QgY2xhc3MgUXVlc3Rpb24gZXh0ZW5kcyBEaXNwbGF5ZWRJdGVtIHtcbiAgICAgICAgcHJvdGVjdGVkIGFuc3dlcmVkT3B0aW9uOiBRdWVzdGlvbk9wdGlvbjtcbiAgICAgICAgY29uc3RydWN0b3IocHJvdGVjdGVkIHF1ZXN0aW9uVGl0bGU6IHN0cmluZywgcHJvdGVjdGVkIG9wdGlvbnM6IFF1ZXN0aW9uT3B0aW9uW10pIHtcbiAgICAgICAgICAgIHN1cGVyKCk7XG4gICAgICAgICAgICBvcHRpb25zID0gc2h1ZmZsZShvcHRpb25zKTtcbiAgICAgICAgICAgIG9wdGlvbnMuZm9yRWFjaCgob3B0aW9uOiBRdWVzdGlvbk9wdGlvbikgPT4ge1xuICAgICAgICAgICAgICAgIG9wdGlvbi5fcXVlc3Rpb24gPSB0aGlzO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmFuc3dlcmVkT3B0aW9uID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBwcm90ZWN0ZWQgYW5zd2VyZWQob3B0aW9uOiBRdWVzdGlvbk9wdGlvbik6IHZvaWQge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmNhbkFuc3dlck11bHRpcGxlVGltZXMoKSAmJiB0aGlzLmFuc3dlcmVkT3B0aW9uICE9IG51bGwpXG4gICAgICAgICAgICAgICAgdGhyb3cgXCJDYW5ub3QgYW5zd2VyIGEgcXVlc3Rpb24gdHdpY2VcIjtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY29ycmVjdDogXCIgKyBvcHRpb24uaXNDb3JyZWN0KTtcbiAgICAgICAgICAgIGlmKCFvcHRpb24uaXNDb3JyZWN0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmNvcnJlY3RIYW5kbGVyKG9wdGlvbik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5hbnN3ZXJlZE9wdGlvbiA9IG9wdGlvbjtcbiAgICAgICAgICAgIHRoaXMuY29ycmVjdEhhbmRsZXIob3B0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICBwcm90ZWN0ZWQgY29ycmVjdEhhbmRsZXIob3B0aW9uOiBRdWVzdGlvbk9wdGlvbik6IHZvaWQge1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5TmV4dCgpO1xuICAgICAgICB9XG4gICAgICAgIHByb3RlY3RlZCBpbmNvcnJlY3RIYW5kbGVyKG9wdGlvbjogUXVlc3Rpb25PcHRpb24pOiB2b2lkIHtcbiAgICAgICAgICAgIHRoaXMuYW5zd2VyZWRPcHRpb24gPSBudWxsO1xuICAgICAgICAgICAgJCgnI3F1ZXN0aW9uLWRpYWxvZycpLnJlbW92ZURhdGEoKTtcbiAgICAgICAgICAgICQoXCIjcXVlc3Rpb24tZGlhbG9nXCIpLmF0dHIoXCJkYXRhLWJhY2tkcm9wXCIsIFwic3RhdGljXCIpO1xuICAgICAgICAgICAgJChcIiNxdWVzdGlvbi1kaWFsb2cgLm1vZGFsLXRpdGxlXCIpLnRleHQoXCJJbmNvcnJlY3RcIik7XG4gICAgICAgICAgICAkKFwiI3F1ZXN0aW9uLWRpYWxvZyAubW9kYWwtZm9vdGVyIGJ1dHRvblwiKS50ZXh0KFwiT0tcIik7XG4gICAgICAgICAgICAkKFwiI3F1ZXN0aW9uLWRpYWxvZyAubW9kYWwtYm9keVwiKS50ZXh0KFwiU29ycnksIHRoYXQncyBub3QgdGhlIHJpZ2h0IGFuc3dlci4gVHJ5IGFnYWluIVwiKTtcbiAgICAgICAgICAgICQoXCIjcXVlc3Rpb24tZGlhbG9nXCIpLm1vZGFsKCk7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIGNhbkFuc3dlck11bHRpcGxlVGltZXMoKTogYm9vbGVhbiB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgYWJzdHJhY3QgZGlzcGxheSgpOiB2b2lkO1xuICAgIH1cblxuICAgIC8qKlxuICAgICogU2h1ZmZsZXMgYXJyYXkgaW4gcGxhY2UuXG4gICAgKiBAcGFyYW0ge0FycmF5fSBhIGl0ZW1zIEFuIGFycmF5IGNvbnRhaW5pbmcgdGhlIGl0ZW1zLlxuICAgICovXG4gICAgZXhwb3J0IGZ1bmN0aW9uIHNodWZmbGU8VD4oYTogVFtdKTogVFtdIHtcbiAgICAgICAgbGV0IGo6IG51bWJlciwgeDogVCwgaTogbnVtYmVyO1xuICAgICAgICBmb3IgKGkgPSBhLmxlbmd0aCAtIDE7IGkgPiAwOyBpLS0pIHtcbiAgICAgICAgICAgIGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKTtcbiAgICAgICAgICAgIHggPSBhW2ldO1xuICAgICAgICAgICAgYVtpXSA9IGFbal07XG4gICAgICAgICAgICBhW2pdID0geDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYTtcbiAgICB9XG5cbiAgICBleHBvcnQgY2xhc3MgSW5mb0JveCBleHRlbmRzIERpc3BsYXllZEl0ZW0ge1xuICAgICAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgdGl0bGU6IHN0cmluZywgcHJvdGVjdGVkIHRleHQ6IHN0cmluZywgcHJvdGVjdGVkIGJ1dHRvblRleHQgPSBcIk9LXCIpIHtcbiAgICAgICAgICAgIHN1cGVyKCk7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdGVjdGVkIGRpYWxvZ0NyZWF0ZWQoKTogdm9pZCB7XG5cbiAgICAgICAgfVxuICAgICAgICBkaXNwbGF5KCk6IHZvaWQge1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgJCgnI3F1ZXN0aW9uLWRpYWxvZycpLnJlbW92ZURhdGEoKTtcbiAgICAgICAgICAgICAgICAkKFwiI3F1ZXN0aW9uLWRpYWxvZyAubW9kYWwtdGl0bGVcIikudGV4dCh0aGlzLnRpdGxlKTtcbiAgICAgICAgICAgICAgICAkKFwiI3F1ZXN0aW9uLWRpYWxvZyAubW9kYWwtYm9keVwiKS50ZXh0KHRoaXMudGV4dCk7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5idXR0b25UZXh0ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgJChcIiNxdWVzdGlvbi1kaWFsb2cgLmNsb3NlXCIpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgJChcIiNxdWVzdGlvbi1kaWFsb2cgLm1vZGFsLWZvb3RlclwiKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICQoXCIjcXVlc3Rpb24tZGlhbG9nIC5tb2RhbC1mb290ZXIgYnV0dG9uXCIpLnRleHQodGhpcy5idXR0b25UZXh0KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkKFwiI3F1ZXN0aW9uLWRpYWxvZyAuY2xvc2VcIikuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAkKFwiI3F1ZXN0aW9uLWRpYWxvZyAubW9kYWwtZm9vdGVyXCIpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5kaWFsb2dDcmVhdGVkKCk7XG4gICAgICAgICAgICAgICAgJChcIiNxdWVzdGlvbi1kaWFsb2dcIikubW9kYWwoIHsgYmFja2Ryb3A6IFwic3RhdGljXCIgfSk7XG4gICAgICAgICAgICAgICAgJChcIiNxdWVzdGlvbi1kaWFsb2dcIikub25lKFwic2hvd24uYnMubW9kYWxcIiwgKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAkKFwiI3F1ZXN0aW9uLWRpYWxvZ1wiKS5vbmUoXCJoaWRkZW4uYnMubW9kYWxcIiwgKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgJChcIiNxdWVzdGlvbi1kaWFsb2dcIikubW9kYWwoJ2Rpc3Bvc2UnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheU5leHQoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZXhwb3J0IGNsYXNzIERlbGF5IGV4dGVuZHMgRGlzcGxheWVkSXRlbSB7XG4gICAgICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCB0aW1lOiBudW1iZXIpIHtcbiAgICAgICAgICAgIHN1cGVyKCk7XG4gICAgICAgIH1cbiAgICAgICAgZGlzcGxheSgpOiB2b2lkIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheU5leHQoKTtcbiAgICAgICAgICAgIH0sIHRoaXMudGltZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZXhwb3J0IGNsYXNzIExldmVsQ2hvaWNlIGV4dGVuZHMgSW5mb0JveCB7XG4gICAgICAgIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBsZXZlbE1hcmt1cHM6IHN0cmluZ1tdKSB7XG4gICAgICAgICAgICBzdXBlcihcIkNob29zZSBhIGxldmVsXCIsIFwiXCIsIG51bGwpO1xuICAgICAgICB9XG4gICAgICAgIHByb3RlY3RlZCBkaWFsb2dDcmVhdGVkKCk6IHZvaWQge1xuICAgICAgICAgICAgJChcIiNxdWVzdGlvbi1kaWFsb2cgLm1vZGFsLWJvZHlcIikudGV4dChcIlwiKTtcbiAgICAgICAgICAgIGxldCAkY29udGFpbmVyID0gJChcIjxkaXY+PC9kaXY+XCIpO1xuICAgICAgICAgICAgJGNvbnRhaW5lci5hZGRDbGFzcyhcImxldmVsLWJ1dHRvbnNcIik7XG4gICAgICAgICAgICB0aGlzLmxldmVsTWFya3Vwcy5mb3JFYWNoKChlbGVtZW50LCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGxldCAkYnV0dG9uID0gJChcIjxidXR0b24+PC9idXR0b24+XCIpO1xuICAgICAgICAgICAgICAgICRidXR0b24uaHRtbChlbGVtZW50KTtcbiAgICAgICAgICAgICAgICAkYnV0dG9uLmRhdGEoXCJsZXZlbC1pZFwiLCBpbmRleCk7XG4gICAgICAgICAgICAgICAgJGJ1dHRvbi5jbGljaygoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIEdhbWVUb29scy5jdXJyZW50TGV2ZWwgPSAkYnV0dG9uLmRhdGEoXCJsZXZlbC1pZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgJChcIiNxdWVzdGlvbi1kaWFsb2dcIikubW9kYWwoJ2hpZGUnKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAkY29udGFpbmVyLmFwcGVuZCgkYnV0dG9uKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJChcIiNxdWVzdGlvbi1kaWFsb2cgLm1vZGFsLWJvZHlcIikuYXBwZW5kKCRjb250YWluZXIpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGV4cG9ydCBmdW5jdGlvbiBnZXRSYW5kb21JbnQobWluIDogbnVtYmVyLCBtYXg6IG51bWJlcik6IG51bWJlciB7XG4gICAgICAgIG1pbiA9IE1hdGguY2VpbChtaW4pO1xuICAgICAgICBtYXggPSBNYXRoLmZsb29yKG1heCk7XG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluO1xuICAgIH1cbiAgICBleHBvcnQgZnVuY3Rpb24gZ2V0UmFuZG9tQXJiaXRyYXJ5KG1pbjogbnVtYmVyLCBtYXg6IG51bWJlcik6IG51bWJlciB7XG4gICAgICAgIGxldCB2YWwgPSBNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikgKyBtaW47XG4gICAgICAgIHJldHVybiB2YWw7XG4gICAgfVxufVxuXG5jbGFzcyBBbmltYXRlQ2Fub2VyIGV4dGVuZHMgR2FtZVRvb2xzLkRpc3BsYXllZEl0ZW0ge1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBwZXJjZW50OiBudW1iZXIsIHB1YmxpYyByZWxhdGl2ZSA9IGZhbHNlKSB7IHN1cGVyKCk7IH1cbiAgICBkaXNwbGF5KCk6IHZvaWQge1xuICAgICAgICBhbmltYXRlQ2Fub2VyKHRoaXMucGVyY2VudCwgdGhpcy5yZWxhdGl2ZSwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5TmV4dCgpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmNsYXNzIE1vdmVDYW5vZXIgZXh0ZW5kcyBHYW1lVG9vbHMuRGlzcGxheWVkSXRlbSB7XG4gICAgY29uc3RydWN0b3IocHVibGljIHBlcmNlbnQ6IG51bWJlcikgeyBzdXBlcigpOyBpZih0aGlzLnBlcmNlbnQgPCA3KSB0aGlzLnBlcmNlbnQgPSA3OyB9XG4gICAgZGlzcGxheSgpOiB2b2lkIHtcbiAgICAgICAgJChcIi5jYW5vZXJcIikuY3NzKFwiYm90dG9tXCIsIHRoaXMucGVyY2VudCArIFwiJVwiKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5TmV4dCgpO1xuICAgIH1cbn1cblxuY2xhc3MgTWF0aExldmVsQ2hvaWNlIGV4dGVuZHMgR2FtZVRvb2xzLkxldmVsQ2hvaWNlIHtcbiAgICBkaWFsb2dDcmVhdGVkKCk6IHZvaWQge1xuICAgICAgICBzdXBlci5kaWFsb2dDcmVhdGVkKCk7XG4gICAgICAgIE1hdGhKYXguSHViLlF1ZXVlKFtcIlR5cGVzZXRcIixNYXRoSmF4Lkh1Yl0pO1xuICAgICAgICBNYXRoSmF4Lkh1Yi5RdWV1ZSgoKSA9PiB7XG4gICAgICAgICAgICAkKFwiLk1hdGhKYXhfQ0hUTUxcIikuY3NzKFwiZm9udC1zaXplXCIsIFwiaW5oZXJpdFwiKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuaW1wb3J0IGdldFJhbmRvbUludCA9IEdhbWVUb29scy5nZXRSYW5kb21JbnQ7XG5pbXBvcnQgZ2V0UmFuZG9tRmxvYXQgPSBHYW1lVG9vbHMuZ2V0UmFuZG9tQXJiaXRyYXJ5O1xuXG5mdW5jdGlvbiBwbGF5QXVkaW9JZlN1cHBvcnRlZChhdWRpb0ZpbGU6IHN0cmluZywgY2I/OiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgaWYoIWNiKVxuICAgICAgICBjYiA9IGZ1bmN0aW9uKCkge307XG4gICAgaWYoTW9kZXJuaXpyLmF1ZGlvKSB7XG4gICAgICAgIHZhciBhdWRpbyA9IG5ldyBBdWRpbyhhdWRpb0ZpbGUpO1xuICAgICAgICBhdWRpby5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjYigpO1xuICAgICAgICB9XG4gICAgICAgIGF1ZGlvLmFkZEV2ZW50TGlzdGVuZXIoXCJlbmRlZFwiLCBjYik7XG4gICAgICAgIGF1ZGlvLnBsYXkoKTtcbiAgICB9IGVsc2VcbiAgICAgICAgY2IoKTtcbn1cblxubGV0IGNvbnRlbnRzSW5kZXggPSAwO1xubGV0IGdhbWVDb250ZW50czogR2FtZVRvb2xzLkRpc3BsYXllZEl0ZW1bXSA9IFtdO1xuY29uc3QgbnVtUXVlc3Rpb25zID0gMTA7XG5jb25zdCBhbW91bnRQZXJRdWVzdGlvbiA9ICg3MC9udW1RdWVzdGlvbnMpO1xuXG5jbGFzcyBMb29wIGV4dGVuZHMgR2FtZVRvb2xzLkRpc3BsYXllZEl0ZW0ge1xuICAgIHByaXZhdGUgbnVtTG9vcHMgPSAwO1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBpbmRleDogbnVtYmVyLCBwdWJsaWMgcmVsYXRpdmUgPSBmYWxzZSwgcHVibGljIHRpbWVzID0gMSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICBpZihpbmRleCA8IDApXG4gICAgICAgICAgICB0aGlzLnJlbGF0aXZlID0gdHJ1ZTtcbiAgICB9XG4gICAgLyogUmVzdG9yZSBhIHByZXZpb3VzIGxvb3AgKi9cbiAgICBhZGRMb29wKCk6IHZvaWQge1xuICAgICAgICB0aGlzLm51bUxvb3BzLS07XG4gICAgICAgIGlmKHRoaXMubnVtTG9vcHMgPCAtMSlcbiAgICAgICAgICAgIHRoaXMubnVtTG9vcHMgPSAtMTtcbiAgICB9XG4gICAgZ2V0TnVtVGltZXNMb29wZWQoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubnVtTG9vcHM7XG4gICAgfVxuICAgIGRpc3BsYXkoKTogdm9pZCB7XG4gICAgICAgIGlmKHRoaXMubnVtTG9vcHMgPCB0aGlzLnRpbWVzKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmKCF0aGlzLnJlbGF0aXZlKVxuICAgICAgICAgICAgICAgIGNvbnRlbnRzSW5kZXggPSB0aGlzLmluZGV4O1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGNvbnRlbnRzSW5kZXggKz0gdGhpcy5pbmRleDtcblxuICAgICAgICAgICAgY29udGVudHNJbmRleCAtPSAxO1xuICAgICAgICAgICAgdGhpcy5udW1Mb29wcysrO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGlzcGxheU5leHQoKTtcbiAgICB9XG4gICAgcmVzZXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMubnVtTG9vcHMgPSAwO1xuICAgIH1cbn1cblxubGV0IHF1ZXN0aW9uTG9vcDogTG9vcDtcblxuY2xhc3MgU3lzdGVtUmVzZXQgZXh0ZW5kcyBHYW1lVG9vbHMuRGlzcGxheWVkSXRlbSB7XG4gICAgZGlzcGxheSgpOiB2b2lkIHtcbiAgICAgICAgZ2FtZUNvbnRlbnRzLmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICAgICAgICBlbGVtZW50LnJlc2V0KCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmRpc3BsYXlOZXh0KCk7XG4gICAgfVxufVxuXG5cbmNsYXNzIE1hdGhRdWVzdGlvbiBleHRlbmRzIEdhbWVUb29scy5JbmZvQm94IHtcbiAgICBwcml2YXRlIGxlZnROdW06IEZyYWN0aW9uO1xuICAgIHByaXZhdGUgcmlnaHROdW06IEZyYWN0aW9uO1xuICAgIHByaXZhdGUgY29ycmVjdDogYm9vbGVhbjtcbiAgICBwcml2YXRlIGZvcmNlZF9udW06IG51bWJlcjtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoXCJcIiwgXCJcIiwgbnVsbCk7XG4gICAgfVxuICAgIHB1YmxpYyBnZW5lcmF0ZU51bWJlcigpOiBGcmFjdGlvbiB7XG4gICAgICAgIHN3aXRjaChHYW1lVG9vbHMuY3VycmVudExldmVsICsgMSkge1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aHJvdyBcIlVuZXhwZWN0ZWQgbGV2ZWxcIjtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEZyYWN0aW9uKGdldFJhbmRvbUludCgwLCA5KSwgMSk7XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBGcmFjdGlvbihnZXRSYW5kb21JbnQoMTAsIDk5KSwgMSk7XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBGcmFjdGlvbihnZXRSYW5kb21JbnQoMTAwLCA5OTkpLCAxKTtcbiAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEZyYWN0aW9uKGdldFJhbmRvbUludCgxMDAwLCA5OTk5KSwgMSk7XG4gICAgICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBGcmFjdGlvbihnZXRSYW5kb21JbnQoMSwgOSksIDEwKTtcbiAgICAgICAgICAgIGNhc2UgNjpcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEZyYWN0aW9uKGdldFJhbmRvbUludCgxMCwgOTkpLCAxMDApO1xuICAgICAgICAgICAgY2FzZSA3OlxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRnJhY3Rpb24oZ2V0UmFuZG9tSW50KDEsIDk5KSwgMTAwKS5hZGQobmV3IEZyYWN0aW9uKGdldFJhbmRvbUludCgxLCAyMCksIDEpKTtcbiAgICAgICAgICAgIGNhc2UgODpcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEZyYWN0aW9uKHRoaXMuZm9yY2VkX251bSwgZ2V0UmFuZG9tSW50KHRoaXMuZm9yY2VkX251bSwgOSkpO1xuICAgICAgICAgICAgY2FzZSA5OlxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRnJhY3Rpb24oZ2V0UmFuZG9tSW50KDEsIHRoaXMuZm9yY2VkX251bSksIHRoaXMuZm9yY2VkX251bSk7XG4gICAgICAgICAgICBjYXNlIDEwOlxuICAgICAgICAgICAgICAgIGxldCBmb3JjZWRfZGVub20gPSBnZXRSYW5kb21JbnQoMiwgMjUpO1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRnJhY3Rpb24oZ2V0UmFuZG9tSW50KDEsIGZvcmNlZF9kZW5vbSAtIDEpLCBmb3JjZWRfZGVub20pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHB1YmxpYyBzdGF0aWMgY29udmVydEZyYWN0aW9uKGZyYWN0aW9uOiBGcmFjdGlvbik6IHN0cmluZyB7XG4gICAgICAgIGNvbnN0IGxldmVsID0gKEdhbWVUb29scy5jdXJyZW50TGV2ZWwgKyAxKTtcbiAgICAgICAgaWYobGV2ZWwgPj0gNSAmJiBsZXZlbCA8PSA3KSB7XG4gICAgICAgICAgICBsZXQgZGVjaW1hbFBsYWNlczogbnVtYmVyO1xuICAgICAgICAgICAgaWYobGV2ZWwgIT0gNylcbiAgICAgICAgICAgICAgICBkZWNpbWFsUGxhY2VzID0gMSsobGV2ZWwtNSk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgZGVjaW1hbFBsYWNlcyA9IDI7XG4gICAgICAgICAgICBsZXQgc3RyID0gZnJhY3Rpb24udmFsdWVPZigpLnRvRml4ZWQoZGVjaW1hbFBsYWNlcyk7XG4gICAgICAgICAgICBpZihsZXZlbCA9PSA3KSB7XG4gICAgICAgICAgICAgICAgc3RyID0gXCIkXCIgKyBzdHI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc3RyO1xuICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgIHJldHVybiBmcmFjdGlvbi50b0ZyYWN0aW9uKGZhbHNlKTtcbiAgICB9XG4gICAgaXNDb3JyZWN0KHN5bU51bTogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgICAgIHN3aXRjaChzeW1OdW0pIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sZWZ0TnVtLmNvbXBhcmUodGhpcy5yaWdodE51bSkgPCAwO1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxlZnROdW0uY29tcGFyZSh0aGlzLnJpZ2h0TnVtKSA9PSAwO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxlZnROdW0uY29tcGFyZSh0aGlzLnJpZ2h0TnVtKSA+IDA7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRocm93IFwiVW5leHBlY3RlZCBzeW1ib2xcIjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBkaXNwbGF5TmV4dCgpOiB2b2lkIHtcbiAgICAgICAgaWYodGhpcy5jb3JyZWN0KVxuICAgICAgICAgICAgc3VwZXIuZGlzcGxheU5leHQoKTtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb250ZW50c0luZGV4Kys7XG4gICAgICAgICAgICBxdWVzdGlvbkxvb3AuYWRkTG9vcCgpO1xuICAgICAgICAgICAgcXVlc3Rpb25Mb29wLmFkZExvb3AoKTtcbiAgICAgICAgICAgIG5ldyBBbmltYXRlQ2Fub2VyKC1hbW91bnRQZXJRdWVzdGlvbiwgdHJ1ZSkuZGlzcGxheSgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGdldENvcnJlY3RTeW1OdW0oKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3QgY29tcGFyaXNvbiA9ICB0aGlzLmxlZnROdW0uY29tcGFyZSh0aGlzLnJpZ2h0TnVtKTtcbiAgICAgICAgaWYoY29tcGFyaXNvbiA8IDApXG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgZWxzZSBpZihjb21wYXJpc29uID4gMClcbiAgICAgICAgICAgIHJldHVybiAyO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICB9XG4gICAgZGlhbG9nQ3JlYXRlZCgpOiB2b2lkIHtcbiAgICAgICAgJChcIiNxdWVzdGlvbi1kaWFsb2cgLm1vZGFsLXRpdGxlXCIpLnRleHQoXCJRdWVzdGlvbiBcIiArIChxdWVzdGlvbkxvb3AuZ2V0TnVtVGltZXNMb29wZWQoKSArIDEpICsgXCIgb2YgXCIgKyAxMCk7XG4gICAgICAgICQoXCIjcXVlc3Rpb24tZGlhbG9nIC5tb2RhbC1ib2R5XCIpLnRleHQoXCJcIik7XG4gICAgICAgIHRoaXMuZm9yY2VkX251bSA9IGdldFJhbmRvbUludCgxLCA5KTtcbiAgICAgICAgdGhpcy5sZWZ0TnVtID0gdGhpcy5nZW5lcmF0ZU51bWJlcigpO1xuICAgICAgICB0aGlzLnJpZ2h0TnVtID0gdGhpcy5nZW5lcmF0ZU51bWJlcigpO1xuICAgICAgICBsZXQgJGRpdiA9ICQoXCI8ZGl2PjwvZGl2PlwiKTtcbiAgICAgICAgJGRpdi5hZGRDbGFzcyhcIm1hdGgtcXVlc3Rpb25cIik7XG4gICAgICAgICQoXCIjcXVlc3Rpb24tZGlhbG9nIC5tb2RhbC1ib2R5XCIpLmFwcGVuZCgkZGl2KTtcbiAgICAgICAgJGRpdi5odG1sKFwiQ2hvb3NlIHRoZSBzeW1ib2wgdGhhdCBiZXN0IGRlc2NyaWJlcyB0aGVzZSBudW1iZXJzLjxwPjwvcD48c3Bhbj5gXCIgKyBNYXRoUXVlc3Rpb24uY29udmVydEZyYWN0aW9uKHRoaXMubGVmdE51bSkgKyBcImAgPHNwYW4gY2xhc3M9J3F1ZXN0aW9uLW1hcmsnPjxpIGNsYXNzPSdmYXIgZmEtcXVlc3Rpb24tY2lyY2xlJz48L2k+PC9zcGFuPiBcIiArIFwiYFwiICsgTWF0aFF1ZXN0aW9uLmNvbnZlcnRGcmFjdGlvbih0aGlzLnJpZ2h0TnVtKSArIFwiYFwiXG4gICAgICAgICAgICArIFwiPC9zcGFuPjxwPjwvcD48YnV0dG9uIGNsYXNzPSdsZXNzLXRoYW4nPmAgPCBgPC9idXR0b24+PGJ1dHRvbiBjbGFzcz0nZXF1YWxzJz5gID0gYDwvYnV0dG9uPjxidXR0b24gY2xhc3M9J2dyZWF0ZXItdGhhbic+YCA+IGA8L2J1dHRvbj5cIik7XG4gICAgICAgIGlmKChHYW1lVG9vbHMuY3VycmVudExldmVsICsgMSkgPT0gNylcbiAgICAgICAgICAgICRkaXYuZmluZChcIi5xdWVzdGlvbi1tYXJrXCIpLmNzcyhcImRpc3BsYXlcIiwgXCJibG9ja1wiKTtcbiAgICAgICAgJGRpdi5maW5kKFwiYnV0dG9uXCIpLmNsaWNrKChldmVudCkgPT4ge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgc3ltTnVtO1xuICAgICAgICAgICAgdmFyICRidXR0b24gPSAkKGV2ZW50LnRhcmdldCk7XG4gICAgICAgICAgICBpZigkYnV0dG9uLmhhc0NsYXNzKFwibGVzcy10aGFuXCIpKVxuICAgICAgICAgICAgICAgIHN5bU51bSA9IDA7XG4gICAgICAgICAgICBlbHNlIGlmKCRidXR0b24uaGFzQ2xhc3MoXCJlcXVhbHNcIikpXG4gICAgICAgICAgICAgICAgc3ltTnVtID0gMTtcbiAgICAgICAgICAgIGVsc2UgaWYoJGJ1dHRvbi5oYXNDbGFzcyhcImdyZWF0ZXItdGhhblwiKSlcbiAgICAgICAgICAgICAgICBzeW1OdW0gPSAyO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHRocm93IFwiVW5rbm93biBzeW1ib2xcIjtcbiAgICAgICAgICAgIGNvbnN0IHN5bWJvbHMgPSBbIFwiPFwiLCBcIj1cIiwgXCI+XCIgXTtcbiAgICAgICAgICAgICQoXCIubWF0aC1xdWVzdGlvbiBidXR0b25cIikucHJvcChcImRpc2FibGVkXCIsIHRydWUpO1xuICAgICAgICAgICAgdGhpcy5jb3JyZWN0ID0gdGhpcy5pc0NvcnJlY3Qoc3ltTnVtKTtcbiAgICAgICAgICAgIGlmKHRoaXMuY29ycmVjdCkge1xuICAgICAgICAgICAgICAgIHBsYXlBdWRpb0lmU3VwcG9ydGVkKFwiY29ycmVjdC5tcDNcIik7XG4gICAgICAgICAgICAgICAgJGRpdi5maW5kKFwiLnF1ZXN0aW9uLW1hcmtcIikuY3NzKFwiY29sb3JcIiwgXCJncmVlblwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3ltTnVtID0gdGhpcy5nZXRDb3JyZWN0U3ltTnVtKCk7XG4gICAgICAgICAgICAgICAgJGJ1dHRvbi5lZmZlY3QoXCJzaGFrZVwiKTtcbiAgICAgICAgICAgICAgICAkZGl2LmZpbmQoXCIucXVlc3Rpb24tbWFya1wiKS5jc3MoXCJjb2xvclwiLCBcInJlZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICRkaXYuZmluZChcIi5xdWVzdGlvbi1tYXJrXCIpLmh0bWwoXCJgIFwiICsgc3ltYm9sc1tzeW1OdW1dICsgXCIgYFwiKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgTWF0aEpheC5IdWIuUXVldWUoW1wiVHlwZXNldFwiLE1hdGhKYXguSHViXSk7XG4gICAgICAgICAgICBNYXRoSmF4Lkh1Yi5RdWV1ZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICQoXCIjcXVlc3Rpb24tZGlhbG9nXCIpLm1vZGFsKCdoaWRlJyk7XG4gICAgICAgICAgICAgICAgfSwgMzAwMCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIE1hdGhKYXguSHViLlF1ZXVlKFtcIlR5cGVzZXRcIixNYXRoSmF4Lkh1Yl0pO1xuICAgICAgICBNYXRoSmF4Lkh1Yi5RdWV1ZSgoKSA9PiB7XG4gICAgICAgICAgICAkKFwiLm1hdGgtcXVlc3Rpb24gPiBzcGFuXCIpLmNoaWxkcmVuKFwic3BhblwiKS5jc3MoXCJmb250LXNpemVcIiwgXCJpbmhlcml0XCIpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cblxuXG5nYW1lQ29udGVudHMgPSBbXG4gICAgbmV3IFN5c3RlbVJlc2V0KCksXG4gICAgbmV3IEdhbWVUb29scy5JbmZvQm94KFwiV2VsY29tZSFcIiwgXCJXZWxjb21lIHRvIENvbXBhcmlzb24gQ2Fub2VpbmchIFRoaXMgZ2FtZSB3aWxsIHRlYWNoIHlvdSBhbGwgYWJvdXQgY29tcGFyaW5nIG51bWJlcnMuXCIpLFxuICAgIG5ldyBBbmltYXRlQ2Fub2VyKDcpLFxuICAgIG5ldyBNYXRoTGV2ZWxDaG9pY2UoW1xuICAgICAgICBcIkxldmVsIDE8cD5gNiA8IDdgXCIsXG4gICAgICAgIFwiTGV2ZWwgMjxwPmAxMiA8IDE1YFwiLFxuICAgICAgICBcIkxldmVsIDM8cD5gMzI1ID4gMTk5YFwiLFxuICAgICAgICBcIkxldmVsIDQ8cD5gMjUwMCA+IDE4NzdgXCIsXG4gICAgICAgIFwiTGV2ZWwgNTxwPmAwLjIgPCAwLjVgXCIsXG4gICAgICAgIFwiTGV2ZWwgNjxwPmAwLjE5IDwgMC4yMWBcIixcbiAgICAgICAgXCJMZXZlbCA3PHA+YCQxLjIzIDwgJDQuNTZgXCIsXG4gICAgICAgIFwiTGV2ZWwgODxwPmAxLzUgPCAxLzdgXCIsXG4gICAgICAgIFwiTGV2ZWwgOTxwPmAyLzQgPCAzLzRgXCIsXG4gICAgICAgIFwiTGV2ZWwgMTA8cD5gNy85ID4gMi8zYFwiXG4gICAgXSksXG4gICAgXG4gICAgbmV3IE1hdGhRdWVzdGlvbigpLFxuICAgIG5ldyBBbmltYXRlQ2Fub2VyKGFtb3VudFBlclF1ZXN0aW9uLCB0cnVlKSxcbiAgICBxdWVzdGlvbkxvb3AgPSBuZXcgTG9vcCgtMiwgdHJ1ZSwgbnVtUXVlc3Rpb25zLTEpLFxuICAgIG5ldyBHYW1lVG9vbHMuSW5mb0JveChcIkNvbmdyYXR1bGF0aW9ucyFcIiwgXCJZb3UndmUgY3Jvc3NlZCB0aGUgcml2ZXIhIFJlYWR5IHRvIHRyeSBhIGRpZmZlcmVudCBsZXZlbD9cIiwgXCJZZXMhXCIpLFxuICAgIG5ldyBTeXN0ZW1SZXNldCgpLFxuICAgIG5ldyBNb3ZlQ2Fub2VyKDApLFxuICAgIG5ldyBMb29wKDIsIGZhbHNlLCAxKVxuXTtcblxuXG5cblxuXG5cbkdhbWVUb29scy5kZWZhdWx0TmV4dEl0ZW0gPSBmdW5jdGlvbihjdXJyZW50OiBHYW1lVG9vbHMuRGlzcGxheWVkSXRlbSk6IEdhbWVUb29scy5EaXNwbGF5ZWRJdGVtIHtcbiAgICBpZihjb250ZW50c0luZGV4ID09IGdhbWVDb250ZW50cy5sZW5ndGggLSAxKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJObyBuZXh0IGl0ZW1zXCIpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc29sZS5sb2coXCJHZXQgZnJvbSBpbmRleCBcIiArIChjb250ZW50c0luZGV4ICsgMSkpO1xuICAgIHJldHVybiBnYW1lQ29udGVudHNbKytjb250ZW50c0luZGV4XTtcbn1cblxuZnVuY3Rpb24gYW5pbWF0ZUNhbm9lcihwZXJjZW50OiBudW1iZXIsIHJlbGF0aXZlID0gZmFsc2UsIGNiPzogKCkgPT4gdm9pZCk6IHZvaWQge1xuICAgIHZhciB0YXJnZXQ6IG51bWJlciA9ICgkKHdpbmRvdykuaGVpZ2h0KCkgLSAoJChcIi5jYW5vZXJcIikuaGVpZ2h0KCkgLyAyKSk7XG4gICAgdmFyIGN1cnJlbnQ6IG51bWJlciA9IHBhcnNlSW50KCQoXCIuY2Fub2VyXCIpLmNzcyhcImJvdHRvbVwiKSk7XG5cbiAgICBpZihyZWxhdGl2ZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkN1cnJlbnQgcGVyY2VudDogXCIgKyAoKGN1cnJlbnQvdGFyZ2V0KSoxMDApKTtcbiAgICAgICAgcGVyY2VudCArPSAoY3VycmVudC90YXJnZXQpKjEwMDtcbiAgICB9XG5cbiAgICBpZihwZXJjZW50IDwgNylcbiAgICAgICAgcGVyY2VudCA9IDc7XG5cbiAgICB0YXJnZXQgKj0gKHBlcmNlbnQvMTAwKTtcbiAgICBjb25zb2xlLmxvZyhcInRhcmdldDogXCIgKyB0YXJnZXQpO1xuICAgIGNvbnNvbGUubG9nKFwidGFyZ2V0IHBlcmNlbnQ6IFwiICsgcGVyY2VudCk7XG4gICAgdmFyIGR1cmF0aW9uOiBudW1iZXIgPSAodGFyZ2V0LWN1cnJlbnQpKjEwO1xuXG4gICAgXG5cbiAgICAkKFwiLmNhbm9lclwiKS5hZGRDbGFzcyhcImNhbm9lci1hbmltYXRlZFwiKTtcbiAgICAkKFwiLmNhbm9lclwiKS5hbmltYXRlKHsgYm90dG9tOiBwZXJjZW50ICsgXCIlXCIgfSwgZHVyYXRpb24sICdsaW5lYXInLCBmdW5jdGlvbigpIHtcbiAgICAgICAgJChcIi5jYW5vZXItYW5pbWF0ZWRcIikucmVtb3ZlQ2xhc3MoXCJjYW5vZXItYW5pbWF0ZWRcIik7XG4gICAgICAgIGlmKGNiKVxuICAgICAgICAgICAgY2IoKTtcbiAgICB9KTtcbn1cbiQod2luZG93KS5vbihcImxvYWRcIiwgZnVuY3Rpb24oKSB7XG4gICAgLypcbiAgICBNYXRoSmF4Lkh1Yi5Db25maWcoe1xuICAgICAgICBcIkhUTUwtQ1NTXCI6IHtcbiAgICAgICAgICBzY2FsZTogMjAwXG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAqL1xuICAgIChGcmFjdGlvbiBhcyBhbnkpLlJFRFVDRSA9IGZhbHNlO1xuICAgIGdhbWVDb250ZW50c1tjb250ZW50c0luZGV4XS5kaXNwbGF5KCk7XG59KTsiLCIvKipcbiAqIEBsaWNlbnNlIEZyYWN0aW9uLmpzIHY0LjAuMTIgMDkvMDkvMjAxNVxuICogaHR0cDovL3d3dy54YXJnLm9yZy8yMDE0LzAzL3JhdGlvbmFsLW51bWJlcnMtaW4tamF2YXNjcmlwdC9cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUsIFJvYmVydCBFaXNlbGUgKHJvYmVydEB4YXJnLm9yZylcbiAqIER1YWwgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBvciBHUEwgVmVyc2lvbiAyIGxpY2Vuc2VzLlxuICoqL1xuXG5cbi8qKlxuICpcbiAqIFRoaXMgY2xhc3Mgb2ZmZXJzIHRoZSBwb3NzaWJpbGl0eSB0byBjYWxjdWxhdGUgZnJhY3Rpb25zLlxuICogWW91IGNhbiBwYXNzIGEgZnJhY3Rpb24gaW4gZGlmZmVyZW50IGZvcm1hdHMuIEVpdGhlciBhcyBhcnJheSwgYXMgZG91YmxlLCBhcyBzdHJpbmcgb3IgYXMgYW4gaW50ZWdlci5cbiAqXG4gKiBBcnJheS9PYmplY3QgZm9ybVxuICogWyAwID0+IDxub21pbmF0b3I+LCAxID0+IDxkZW5vbWluYXRvcj4gXVxuICogWyBuID0+IDxub21pbmF0b3I+LCBkID0+IDxkZW5vbWluYXRvcj4gXVxuICpcbiAqIEludGVnZXIgZm9ybVxuICogLSBTaW5nbGUgaW50ZWdlciB2YWx1ZVxuICpcbiAqIERvdWJsZSBmb3JtXG4gKiAtIFNpbmdsZSBkb3VibGUgdmFsdWVcbiAqXG4gKiBTdHJpbmcgZm9ybVxuICogMTIzLjQ1NiAtIGEgc2ltcGxlIGRvdWJsZVxuICogMTIzLzQ1NiAtIGEgc3RyaW5nIGZyYWN0aW9uXG4gKiAxMjMuJzQ1NicgLSBhIGRvdWJsZSB3aXRoIHJlcGVhdGluZyBkZWNpbWFsIHBsYWNlc1xuICogMTIzLig0NTYpIC0gc3lub255bVxuICogMTIzLjQ1JzYnIC0gYSBkb3VibGUgd2l0aCByZXBlYXRpbmcgbGFzdCBwbGFjZVxuICogMTIzLjQ1KDYpIC0gc3lub255bVxuICpcbiAqIEV4YW1wbGU6XG4gKlxuICogdmFyIGYgPSBuZXcgRnJhY3Rpb24oXCI5LjQnMzEnXCIpO1xuICogZi5tdWwoWy00LCAzXSkuZGl2KDQuOSk7XG4gKlxuICovXG5cbihmdW5jdGlvbihyb290KSB7XG5cbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgLy8gTWF4aW11bSBzZWFyY2ggZGVwdGggZm9yIGN5Y2xpYyByYXRpb25hbCBudW1iZXJzLiAyMDAwIHNob3VsZCBiZSBtb3JlIHRoYW4gZW5vdWdoLlxuICAvLyBFeGFtcGxlOiAxLzcgPSAwLigxNDI4NTcpIGhhcyA2IHJlcGVhdGluZyBkZWNpbWFsIHBsYWNlcy5cbiAgLy8gSWYgTUFYX0NZQ0xFX0xFTiBnZXRzIHJlZHVjZWQsIGxvbmcgY3ljbGVzIHdpbGwgbm90IGJlIGRldGVjdGVkIGFuZCB0b1N0cmluZygpIG9ubHkgZ2V0cyB0aGUgZmlyc3QgMTAgZGlnaXRzXG4gIHZhciBNQVhfQ1lDTEVfTEVOID0gMjAwMDtcblxuICAvLyBQYXJzZWQgZGF0YSB0byBhdm9pZCBjYWxsaW5nIFwibmV3XCIgYWxsIHRoZSB0aW1lXG4gIHZhciBQID0ge1xuICAgIFwic1wiOiAxLFxuICAgIFwiblwiOiAwLFxuICAgIFwiZFwiOiAxXG4gIH07XG5cbiAgZnVuY3Rpb24gY3JlYXRlRXJyb3IobmFtZSkge1xuXG4gICAgZnVuY3Rpb24gZXJyb3JDb25zdHJ1Y3RvcigpIHtcbiAgICAgIHZhciB0ZW1wID0gRXJyb3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIHRlbXBbJ25hbWUnXSA9IHRoaXNbJ25hbWUnXSA9IG5hbWU7XG4gICAgICB0aGlzWydzdGFjayddID0gdGVtcFsnc3RhY2snXTtcbiAgICAgIHRoaXNbJ21lc3NhZ2UnXSA9IHRlbXBbJ21lc3NhZ2UnXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFcnJvciBjb25zdHJ1Y3RvclxuICAgICAqXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgZnVuY3Rpb24gSW50ZXJtZWRpYXRlSW5oZXJpdG9yKCkge31cbiAgICBJbnRlcm1lZGlhdGVJbmhlcml0b3IucHJvdG90eXBlID0gRXJyb3IucHJvdG90eXBlO1xuICAgIGVycm9yQ29uc3RydWN0b3IucHJvdG90eXBlID0gbmV3IEludGVybWVkaWF0ZUluaGVyaXRvcigpO1xuXG4gICAgcmV0dXJuIGVycm9yQ29uc3RydWN0b3I7XG4gIH1cblxuICB2YXIgRGl2aXNpb25CeVplcm8gPSBGcmFjdGlvblsnRGl2aXNpb25CeVplcm8nXSA9IGNyZWF0ZUVycm9yKCdEaXZpc2lvbkJ5WmVybycpO1xuICB2YXIgSW52YWxpZFBhcmFtZXRlciA9IEZyYWN0aW9uWydJbnZhbGlkUGFyYW1ldGVyJ10gPSBjcmVhdGVFcnJvcignSW52YWxpZFBhcmFtZXRlcicpO1xuXG4gIGZ1bmN0aW9uIGFzc2lnbihuLCBzKSB7XG5cbiAgICBpZiAoaXNOYU4obiA9IHBhcnNlSW50KG4sIDEwKSkpIHtcbiAgICAgIHRocm93SW52YWxpZFBhcmFtKCk7XG4gICAgfVxuICAgIHJldHVybiBuICogcztcbiAgfVxuXG4gIGZ1bmN0aW9uIHRocm93SW52YWxpZFBhcmFtKCkge1xuICAgIHRocm93IG5ldyBJbnZhbGlkUGFyYW1ldGVyKCk7XG4gIH1cblxuICB2YXIgcGFyc2UgPSBmdW5jdGlvbihwMSwgcDIpIHtcblxuICAgIHZhciBuID0gMCwgZCA9IDEsIHMgPSAxO1xuICAgIHZhciB2ID0gMCwgdyA9IDAsIHggPSAwLCB5ID0gMSwgeiA9IDE7XG5cbiAgICB2YXIgQSA9IDAsIEIgPSAxO1xuICAgIHZhciBDID0gMSwgRCA9IDE7XG5cbiAgICB2YXIgTiA9IDEwMDAwMDAwO1xuICAgIHZhciBNO1xuXG4gICAgaWYgKHAxID09PSB1bmRlZmluZWQgfHwgcDEgPT09IG51bGwpIHtcbiAgICAgIC8qIHZvaWQgKi9cbiAgICB9IGVsc2UgaWYgKHAyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIG4gPSBwMTtcbiAgICAgIGQgPSBwMjtcbiAgICAgIHMgPSBuICogZDtcbiAgICB9IGVsc2VcbiAgICAgIHN3aXRjaCAodHlwZW9mIHAxKSB7XG5cbiAgICAgICAgY2FzZSBcIm9iamVjdFwiOlxuICAgICAgICB7XG4gICAgICAgICAgaWYgKFwiZFwiIGluIHAxICYmIFwiblwiIGluIHAxKSB7XG4gICAgICAgICAgICBuID0gcDFbXCJuXCJdO1xuICAgICAgICAgICAgZCA9IHAxW1wiZFwiXTtcbiAgICAgICAgICAgIGlmIChcInNcIiBpbiBwMSlcbiAgICAgICAgICAgICAgbiAqPSBwMVtcInNcIl07XG4gICAgICAgICAgfSBlbHNlIGlmICgwIGluIHAxKSB7XG4gICAgICAgICAgICBuID0gcDFbMF07XG4gICAgICAgICAgICBpZiAoMSBpbiBwMSlcbiAgICAgICAgICAgICAgZCA9IHAxWzFdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvd0ludmFsaWRQYXJhbSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzID0gbiAqIGQ7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSBcIm51bWJlclwiOlxuICAgICAgICB7XG4gICAgICAgICAgaWYgKHAxIDwgMCkge1xuICAgICAgICAgICAgcyA9IHAxO1xuICAgICAgICAgICAgcDEgPSAtcDE7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHAxICUgMSA9PT0gMCkge1xuICAgICAgICAgICAgbiA9IHAxO1xuICAgICAgICAgIH0gZWxzZSBpZiAocDEgPiAwKSB7IC8vIGNoZWNrIGZvciAhPSAwLCBzY2FsZSB3b3VsZCBiZWNvbWUgTmFOIChsb2coMCkpLCB3aGljaCBjb252ZXJnZXMgcmVhbGx5IHNsb3dcblxuICAgICAgICAgICAgaWYgKHAxID49IDEpIHtcbiAgICAgICAgICAgICAgeiA9IE1hdGgucG93KDEwLCBNYXRoLmZsb29yKDEgKyBNYXRoLmxvZyhwMSkgLyBNYXRoLkxOMTApKTtcbiAgICAgICAgICAgICAgcDEgLz0gejtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gVXNpbmcgRmFyZXkgU2VxdWVuY2VzXG4gICAgICAgICAgICAvLyBodHRwOi8vd3d3LmpvaG5kY29vay5jb20vYmxvZy8yMDEwLzEwLzIwL2Jlc3QtcmF0aW9uYWwtYXBwcm94aW1hdGlvbi9cblxuICAgICAgICAgICAgd2hpbGUgKEIgPD0gTiAmJiBEIDw9IE4pIHtcbiAgICAgICAgICAgICAgTSA9IChBICsgQykgLyAoQiArIEQpO1xuXG4gICAgICAgICAgICAgIGlmIChwMSA9PT0gTSkge1xuICAgICAgICAgICAgICAgIGlmIChCICsgRCA8PSBOKSB7XG4gICAgICAgICAgICAgICAgICBuID0gQSArIEM7XG4gICAgICAgICAgICAgICAgICBkID0gQiArIEQ7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChEID4gQikge1xuICAgICAgICAgICAgICAgICAgbiA9IEM7XG4gICAgICAgICAgICAgICAgICBkID0gRDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgbiA9IEE7XG4gICAgICAgICAgICAgICAgICBkID0gQjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgIGlmIChwMSA+IE0pIHtcbiAgICAgICAgICAgICAgICAgIEEgKz0gQztcbiAgICAgICAgICAgICAgICAgIEIgKz0gRDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgQyArPSBBO1xuICAgICAgICAgICAgICAgICAgRCArPSBCO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChCID4gTikge1xuICAgICAgICAgICAgICAgICAgbiA9IEM7XG4gICAgICAgICAgICAgICAgICBkID0gRDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgbiA9IEE7XG4gICAgICAgICAgICAgICAgICBkID0gQjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG4gKj0gejtcbiAgICAgICAgICB9IGVsc2UgaWYgKGlzTmFOKHAxKSB8fCBpc05hTihwMikpIHtcbiAgICAgICAgICAgIGQgPSBuID0gTmFOO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgICAgIHtcbiAgICAgICAgICBCID0gcDEubWF0Y2goL1xcZCt8Li9nKTtcblxuICAgICAgICAgIGlmIChCID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3dJbnZhbGlkUGFyYW0oKTtcblxuICAgICAgICAgIGlmIChCW0FdID09PSAnLScpIHsvLyBDaGVjayBmb3IgbWludXMgc2lnbiBhdCB0aGUgYmVnaW5uaW5nXG4gICAgICAgICAgICBzID0gLTE7XG4gICAgICAgICAgICBBKys7XG4gICAgICAgICAgfSBlbHNlIGlmIChCW0FdID09PSAnKycpIHsvLyBDaGVjayBmb3IgcGx1cyBzaWduIGF0IHRoZSBiZWdpbm5pbmdcbiAgICAgICAgICAgIEErKztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoQi5sZW5ndGggPT09IEEgKyAxKSB7IC8vIENoZWNrIGlmIGl0J3MganVzdCBhIHNpbXBsZSBudW1iZXIgXCIxMjM0XCJcbiAgICAgICAgICAgIHcgPSBhc3NpZ24oQltBKytdLCBzKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKEJbQSArIDFdID09PSAnLicgfHwgQltBXSA9PT0gJy4nKSB7IC8vIENoZWNrIGlmIGl0J3MgYSBkZWNpbWFsIG51bWJlclxuXG4gICAgICAgICAgICBpZiAoQltBXSAhPT0gJy4nKSB7IC8vIEhhbmRsZSAwLjUgYW5kIC41XG4gICAgICAgICAgICAgIHYgPSBhc3NpZ24oQltBKytdLCBzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIEErKztcblxuICAgICAgICAgICAgLy8gQ2hlY2sgZm9yIGRlY2ltYWwgcGxhY2VzXG4gICAgICAgICAgICBpZiAoQSArIDEgPT09IEIubGVuZ3RoIHx8IEJbQSArIDFdID09PSAnKCcgJiYgQltBICsgM10gPT09ICcpJyB8fCBCW0EgKyAxXSA9PT0gXCInXCIgJiYgQltBICsgM10gPT09IFwiJ1wiKSB7XG4gICAgICAgICAgICAgIHcgPSBhc3NpZ24oQltBXSwgcyk7XG4gICAgICAgICAgICAgIHkgPSBNYXRoLnBvdygxMCwgQltBXS5sZW5ndGgpO1xuICAgICAgICAgICAgICBBKys7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIENoZWNrIGZvciByZXBlYXRpbmcgcGxhY2VzXG4gICAgICAgICAgICBpZiAoQltBXSA9PT0gJygnICYmIEJbQSArIDJdID09PSAnKScgfHwgQltBXSA9PT0gXCInXCIgJiYgQltBICsgMl0gPT09IFwiJ1wiKSB7XG4gICAgICAgICAgICAgIHggPSBhc3NpZ24oQltBICsgMV0sIHMpO1xuICAgICAgICAgICAgICB6ID0gTWF0aC5wb3coMTAsIEJbQSArIDFdLmxlbmd0aCkgLSAxO1xuICAgICAgICAgICAgICBBICs9IDM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICB9IGVsc2UgaWYgKEJbQSArIDFdID09PSAnLycgfHwgQltBICsgMV0gPT09ICc6JykgeyAvLyBDaGVjayBmb3IgYSBzaW1wbGUgZnJhY3Rpb24gXCIxMjMvNDU2XCIgb3IgXCIxMjM6NDU2XCJcbiAgICAgICAgICAgIHcgPSBhc3NpZ24oQltBXSwgcyk7XG4gICAgICAgICAgICB5ID0gYXNzaWduKEJbQSArIDJdLCAxKTtcbiAgICAgICAgICAgIEEgKz0gMztcbiAgICAgICAgICB9IGVsc2UgaWYgKEJbQSArIDNdID09PSAnLycgJiYgQltBICsgMV0gPT09ICcgJykgeyAvLyBDaGVjayBmb3IgYSBjb21wbGV4IGZyYWN0aW9uIFwiMTIzIDEvMlwiXG4gICAgICAgICAgICB2ID0gYXNzaWduKEJbQV0sIHMpO1xuICAgICAgICAgICAgdyA9IGFzc2lnbihCW0EgKyAyXSwgcyk7XG4gICAgICAgICAgICB5ID0gYXNzaWduKEJbQSArIDRdLCAxKTtcbiAgICAgICAgICAgIEEgKz0gNTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoQi5sZW5ndGggPD0gQSkgeyAvLyBDaGVjayBmb3IgbW9yZSB0b2tlbnMgb24gdGhlIHN0YWNrXG4gICAgICAgICAgICBkID0geSAqIHo7XG4gICAgICAgICAgICBzID0gLyogdm9pZCAqL1xuICAgICAgICAgICAgICAgICAgICBuID0geCArIGQgKiB2ICsgeiAqIHc7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvKiBGYWxsIHRocm91Z2ggb24gZXJyb3IgKi9cbiAgICAgICAgfVxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRocm93SW52YWxpZFBhcmFtKCk7XG4gICAgICB9XG5cbiAgICBpZiAoZCA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IERpdmlzaW9uQnlaZXJvKCk7XG4gICAgfVxuXG4gICAgUFtcInNcIl0gPSBzIDwgMCA/IC0xIDogMTtcbiAgICBQW1wiblwiXSA9IE1hdGguYWJzKG4pO1xuICAgIFBbXCJkXCJdID0gTWF0aC5hYnMoZCk7XG4gIH07XG5cbiAgZnVuY3Rpb24gbW9kcG93KGIsIGUsIG0pIHtcblxuICAgIHZhciByID0gMTtcbiAgICBmb3IgKDsgZSA+IDA7IGIgPSAoYiAqIGIpICUgbSwgZSA+Pj0gMSkge1xuXG4gICAgICBpZiAoZSAmIDEpIHtcbiAgICAgICAgciA9IChyICogYikgJSBtO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcjtcbiAgfVxuXG5cbiAgZnVuY3Rpb24gY3ljbGVMZW4obiwgZCkge1xuXG4gICAgZm9yICg7IGQgJSAyID09PSAwO1xuICAgICAgICAgICAgZCAvPSAyKSB7XG4gICAgfVxuXG4gICAgZm9yICg7IGQgJSA1ID09PSAwO1xuICAgICAgICAgICAgZCAvPSA1KSB7XG4gICAgfVxuXG4gICAgaWYgKGQgPT09IDEpIC8vIENhdGNoIG5vbi1jeWNsaWMgbnVtYmVyc1xuICAgICAgcmV0dXJuIDA7XG5cbiAgICAvLyBJZiB3ZSB3b3VsZCBsaWtlIHRvIGNvbXB1dGUgcmVhbGx5IGxhcmdlIG51bWJlcnMgcXVpY2tlciwgd2UgY291bGQgbWFrZSB1c2Ugb2YgRmVybWF0J3MgbGl0dGxlIHRoZW9yZW06XG4gICAgLy8gMTBeKGQtMSkgJSBkID09IDFcbiAgICAvLyBIb3dldmVyLCB3ZSBkb24ndCBuZWVkIHN1Y2ggbGFyZ2UgbnVtYmVycyBhbmQgTUFYX0NZQ0xFX0xFTiBzaG91bGQgYmUgdGhlIGNhcHN0b25lLFxuICAgIC8vIGFzIHdlIHdhbnQgdG8gdHJhbnNsYXRlIHRoZSBudW1iZXJzIHRvIHN0cmluZ3MuXG5cbiAgICB2YXIgcmVtID0gMTAgJSBkO1xuICAgIHZhciB0ID0gMTtcblxuICAgIGZvciAoOyByZW0gIT09IDE7IHQrKykge1xuICAgICAgcmVtID0gcmVtICogMTAgJSBkO1xuXG4gICAgICBpZiAodCA+IE1BWF9DWUNMRV9MRU4pXG4gICAgICAgIHJldHVybiAwOyAvLyBSZXR1cm5pbmcgMCBoZXJlIG1lYW5zIHRoYXQgd2UgZG9uJ3QgcHJpbnQgaXQgYXMgYSBjeWNsaWMgbnVtYmVyLiBJdCdzIGxpa2VseSB0aGF0IHRoZSBhbnN3ZXIgaXMgYGQtMWBcbiAgICB9XG4gICAgcmV0dXJuIHQ7XG4gIH1cblxuXG4gICAgIGZ1bmN0aW9uIGN5Y2xlU3RhcnQobiwgZCwgbGVuKSB7XG5cbiAgICB2YXIgcmVtMSA9IDE7XG4gICAgdmFyIHJlbTIgPSBtb2Rwb3coMTAsIGxlbiwgZCk7XG5cbiAgICBmb3IgKHZhciB0ID0gMDsgdCA8IDMwMDsgdCsrKSB7IC8vIHMgPCB+bG9nMTAoTnVtYmVyLk1BWF9WQUxVRSlcbiAgICAgIC8vIFNvbHZlIDEwXnMgPT0gMTBeKHMrdCkgKG1vZCBkKVxuXG4gICAgICBpZiAocmVtMSA9PT0gcmVtMilcbiAgICAgICAgcmV0dXJuIHQ7XG5cbiAgICAgIHJlbTEgPSByZW0xICogMTAgJSBkO1xuICAgICAgcmVtMiA9IHJlbTIgKiAxMCAlIGQ7XG4gICAgfVxuICAgIHJldHVybiAwO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2NkKGEsIGIpIHtcblxuICAgIGlmICghYSlcbiAgICAgIHJldHVybiBiO1xuICAgIGlmICghYilcbiAgICAgIHJldHVybiBhO1xuXG4gICAgd2hpbGUgKDEpIHtcbiAgICAgIGEgJT0gYjtcbiAgICAgIGlmICghYSlcbiAgICAgICAgcmV0dXJuIGI7XG4gICAgICBiICU9IGE7XG4gICAgICBpZiAoIWIpXG4gICAgICAgIHJldHVybiBhO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogTW9kdWxlIGNvbnN0cnVjdG9yXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge251bWJlcnxGcmFjdGlvbj19IGFcbiAgICogQHBhcmFtIHtudW1iZXI9fSBiXG4gICAqL1xuICBmdW5jdGlvbiBGcmFjdGlvbihhLCBiKSB7XG5cbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgRnJhY3Rpb24pKSB7XG4gICAgICByZXR1cm4gbmV3IEZyYWN0aW9uKGEsIGIpO1xuICAgIH1cblxuICAgIHBhcnNlKGEsIGIpO1xuXG4gICAgaWYgKEZyYWN0aW9uWydSRURVQ0UnXSkge1xuICAgICAgYSA9IGdjZChQW1wiZFwiXSwgUFtcIm5cIl0pOyAvLyBBYnVzZSBhXG4gICAgfSBlbHNlIHtcbiAgICAgIGEgPSAxO1xuICAgIH1cblxuICAgIHRoaXNbXCJzXCJdID0gUFtcInNcIl07XG4gICAgdGhpc1tcIm5cIl0gPSBQW1wiblwiXSAvIGE7XG4gICAgdGhpc1tcImRcIl0gPSBQW1wiZFwiXSAvIGE7XG4gIH1cblxuICAvKipcbiAgICogQm9vbGVhbiBnbG9iYWwgdmFyaWFibGUgdG8gYmUgYWJsZSB0byBkaXNhYmxlIGF1dG9tYXRpYyByZWR1Y3Rpb24gb2YgdGhlIGZyYWN0aW9uXG4gICAqXG4gICAqL1xuICBGcmFjdGlvblsnUkVEVUNFJ10gPSAxO1xuXG4gIEZyYWN0aW9uLnByb3RvdHlwZSA9IHtcblxuICAgIFwic1wiOiAxLFxuICAgIFwiblwiOiAwLFxuICAgIFwiZFwiOiAxLFxuXG4gICAgLyoqXG4gICAgICogQ2FsY3VsYXRlcyB0aGUgYWJzb2x1dGUgdmFsdWVcbiAgICAgKlxuICAgICAqIEV4OiBuZXcgRnJhY3Rpb24oLTQpLmFicygpID0+IDRcbiAgICAgKiovXG4gICAgXCJhYnNcIjogZnVuY3Rpb24oKSB7XG5cbiAgICAgIHJldHVybiBuZXcgRnJhY3Rpb24odGhpc1tcIm5cIl0sIHRoaXNbXCJkXCJdKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogSW52ZXJ0cyB0aGUgc2lnbiBvZiB0aGUgY3VycmVudCBmcmFjdGlvblxuICAgICAqXG4gICAgICogRXg6IG5ldyBGcmFjdGlvbigtNCkubmVnKCkgPT4gNFxuICAgICAqKi9cbiAgICBcIm5lZ1wiOiBmdW5jdGlvbigpIHtcblxuICAgICAgcmV0dXJuIG5ldyBGcmFjdGlvbigtdGhpc1tcInNcIl0gKiB0aGlzW1wiblwiXSwgdGhpc1tcImRcIl0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBBZGRzIHR3byByYXRpb25hbCBudW1iZXJzXG4gICAgICpcbiAgICAgKiBFeDogbmV3IEZyYWN0aW9uKHtuOiAyLCBkOiAzfSkuYWRkKFwiMTQuOVwiKSA9PiA0NjcgLyAzMFxuICAgICAqKi9cbiAgICBcImFkZFwiOiBmdW5jdGlvbihhLCBiKSB7XG5cbiAgICAgIHBhcnNlKGEsIGIpO1xuICAgICAgcmV0dXJuIG5ldyBGcmFjdGlvbihcbiAgICAgICAgICAgICAgdGhpc1tcInNcIl0gKiB0aGlzW1wiblwiXSAqIFBbXCJkXCJdICsgUFtcInNcIl0gKiB0aGlzW1wiZFwiXSAqIFBbXCJuXCJdLFxuICAgICAgICAgICAgICB0aGlzW1wiZFwiXSAqIFBbXCJkXCJdXG4gICAgICAgICAgICAgICk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFN1YnRyYWN0cyB0d28gcmF0aW9uYWwgbnVtYmVyc1xuICAgICAqXG4gICAgICogRXg6IG5ldyBGcmFjdGlvbih7bjogMiwgZDogM30pLmFkZChcIjE0LjlcIikgPT4gLTQyNyAvIDMwXG4gICAgICoqL1xuICAgIFwic3ViXCI6IGZ1bmN0aW9uKGEsIGIpIHtcblxuICAgICAgcGFyc2UoYSwgYik7XG4gICAgICByZXR1cm4gbmV3IEZyYWN0aW9uKFxuICAgICAgICAgICAgICB0aGlzW1wic1wiXSAqIHRoaXNbXCJuXCJdICogUFtcImRcIl0gLSBQW1wic1wiXSAqIHRoaXNbXCJkXCJdICogUFtcIm5cIl0sXG4gICAgICAgICAgICAgIHRoaXNbXCJkXCJdICogUFtcImRcIl1cbiAgICAgICAgICAgICAgKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogTXVsdGlwbGllcyB0d28gcmF0aW9uYWwgbnVtYmVyc1xuICAgICAqXG4gICAgICogRXg6IG5ldyBGcmFjdGlvbihcIi0xNy4oMzQ1KVwiKS5tdWwoMykgPT4gNTc3NiAvIDExMVxuICAgICAqKi9cbiAgICBcIm11bFwiOiBmdW5jdGlvbihhLCBiKSB7XG5cbiAgICAgIHBhcnNlKGEsIGIpO1xuICAgICAgcmV0dXJuIG5ldyBGcmFjdGlvbihcbiAgICAgICAgICAgICAgdGhpc1tcInNcIl0gKiBQW1wic1wiXSAqIHRoaXNbXCJuXCJdICogUFtcIm5cIl0sXG4gICAgICAgICAgICAgIHRoaXNbXCJkXCJdICogUFtcImRcIl1cbiAgICAgICAgICAgICAgKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogRGl2aWRlcyB0d28gcmF0aW9uYWwgbnVtYmVyc1xuICAgICAqXG4gICAgICogRXg6IG5ldyBGcmFjdGlvbihcIi0xNy4oMzQ1KVwiKS5pbnZlcnNlKCkuZGl2KDMpXG4gICAgICoqL1xuICAgIFwiZGl2XCI6IGZ1bmN0aW9uKGEsIGIpIHtcblxuICAgICAgcGFyc2UoYSwgYik7XG4gICAgICByZXR1cm4gbmV3IEZyYWN0aW9uKFxuICAgICAgICAgICAgICB0aGlzW1wic1wiXSAqIFBbXCJzXCJdICogdGhpc1tcIm5cIl0gKiBQW1wiZFwiXSxcbiAgICAgICAgICAgICAgdGhpc1tcImRcIl0gKiBQW1wiblwiXVxuICAgICAgICAgICAgICApO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDbG9uZXMgdGhlIGFjdHVhbCBvYmplY3RcbiAgICAgKlxuICAgICAqIEV4OiBuZXcgRnJhY3Rpb24oXCItMTcuKDM0NSlcIikuY2xvbmUoKVxuICAgICAqKi9cbiAgICBcImNsb25lXCI6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ldyBGcmFjdGlvbih0aGlzKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2FsY3VsYXRlcyB0aGUgbW9kdWxvIG9mIHR3byByYXRpb25hbCBudW1iZXJzIC0gYSBtb3JlIHByZWNpc2UgZm1vZFxuICAgICAqXG4gICAgICogRXg6IG5ldyBGcmFjdGlvbignNC4oMyknKS5tb2QoWzcsIDhdKSA9PiAoMTMvMykgJSAoNy84KSA9ICg1LzYpXG4gICAgICoqL1xuICAgIFwibW9kXCI6IGZ1bmN0aW9uKGEsIGIpIHtcblxuICAgICAgaWYgKGlzTmFOKHRoaXNbJ24nXSkgfHwgaXNOYU4odGhpc1snZCddKSkge1xuICAgICAgICByZXR1cm4gbmV3IEZyYWN0aW9uKE5hTik7XG4gICAgICB9XG5cbiAgICAgIGlmIChhID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGcmFjdGlvbih0aGlzW1wic1wiXSAqIHRoaXNbXCJuXCJdICUgdGhpc1tcImRcIl0sIDEpO1xuICAgICAgfVxuXG4gICAgICBwYXJzZShhLCBiKTtcbiAgICAgIGlmICgwID09PSBQW1wiblwiXSAmJiAwID09PSB0aGlzW1wiZFwiXSkge1xuICAgICAgICBGcmFjdGlvbigwLCAwKTsgLy8gVGhyb3cgRGl2aXNpb25CeVplcm9cbiAgICAgIH1cblxuICAgICAgLypcbiAgICAgICAqIEZpcnN0IHNpbGx5IGF0dGVtcHQsIGtpbmRhIHNsb3dcbiAgICAgICAqXG4gICAgICAgcmV0dXJuIHRoYXRbXCJzdWJcIl0oe1xuICAgICAgIFwiblwiOiBudW1bXCJuXCJdICogTWF0aC5mbG9vcigodGhpcy5uIC8gdGhpcy5kKSAvIChudW0ubiAvIG51bS5kKSksXG4gICAgICAgXCJkXCI6IG51bVtcImRcIl0sXG4gICAgICAgXCJzXCI6IHRoaXNbXCJzXCJdXG4gICAgICAgfSk7Ki9cblxuICAgICAgLypcbiAgICAgICAqIE5ldyBhdHRlbXB0OiBhMSAvIGIxID0gYTIgLyBiMiAqIHEgKyByXG4gICAgICAgKiA9PiBiMiAqIGExID0gYTIgKiBiMSAqIHEgKyBiMSAqIGIyICogclxuICAgICAgICogPT4gKGIyICogYTEgJSBhMiAqIGIxKSAvIChiMSAqIGIyKVxuICAgICAgICovXG4gICAgICByZXR1cm4gbmV3IEZyYWN0aW9uKFxuICAgICAgICAgICAgICB0aGlzW1wic1wiXSAqIChQW1wiZFwiXSAqIHRoaXNbXCJuXCJdKSAlIChQW1wiblwiXSAqIHRoaXNbXCJkXCJdKSxcbiAgICAgICAgICAgICAgUFtcImRcIl0gKiB0aGlzW1wiZFwiXVxuICAgICAgICAgICAgICApO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDYWxjdWxhdGVzIHRoZSBmcmFjdGlvbmFsIGdjZCBvZiB0d28gcmF0aW9uYWwgbnVtYmVyc1xuICAgICAqXG4gICAgICogRXg6IG5ldyBGcmFjdGlvbig1LDgpLmdjZCgzLDcpID0+IDEvNTZcbiAgICAgKi9cbiAgICBcImdjZFwiOiBmdW5jdGlvbihhLCBiKSB7XG5cbiAgICAgIHBhcnNlKGEsIGIpO1xuXG4gICAgICAvLyBnY2QoYSAvIGIsIGMgLyBkKSA9IGdjZChhLCBjKSAvIGxjbShiLCBkKVxuXG4gICAgICByZXR1cm4gbmV3IEZyYWN0aW9uKGdjZChQW1wiblwiXSwgdGhpc1tcIm5cIl0pICogZ2NkKFBbXCJkXCJdLCB0aGlzW1wiZFwiXSksIFBbXCJkXCJdICogdGhpc1tcImRcIl0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDYWxjdWxhdGVzIHRoZSBmcmFjdGlvbmFsIGxjbSBvZiB0d28gcmF0aW9uYWwgbnVtYmVyc1xuICAgICAqXG4gICAgICogRXg6IG5ldyBGcmFjdGlvbig1LDgpLmxjbSgzLDcpID0+IDE1XG4gICAgICovXG4gICAgXCJsY21cIjogZnVuY3Rpb24oYSwgYikge1xuXG4gICAgICBwYXJzZShhLCBiKTtcblxuICAgICAgLy8gbGNtKGEgLyBiLCBjIC8gZCkgPSBsY20oYSwgYykgLyBnY2QoYiwgZClcblxuICAgICAgaWYgKFBbXCJuXCJdID09PSAwICYmIHRoaXNbXCJuXCJdID09PSAwKSB7XG4gICAgICAgIHJldHVybiBuZXcgRnJhY3Rpb247XG4gICAgICB9XG4gICAgICByZXR1cm4gbmV3IEZyYWN0aW9uKFBbXCJuXCJdICogdGhpc1tcIm5cIl0sIGdjZChQW1wiblwiXSwgdGhpc1tcIm5cIl0pICogZ2NkKFBbXCJkXCJdLCB0aGlzW1wiZFwiXSkpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDYWxjdWxhdGVzIHRoZSBjZWlsIG9mIGEgcmF0aW9uYWwgbnVtYmVyXG4gICAgICpcbiAgICAgKiBFeDogbmV3IEZyYWN0aW9uKCc0LigzKScpLmNlaWwoKSA9PiAoNSAvIDEpXG4gICAgICoqL1xuICAgIFwiY2VpbFwiOiBmdW5jdGlvbihwbGFjZXMpIHtcblxuICAgICAgcGxhY2VzID0gTWF0aC5wb3coMTAsIHBsYWNlcyB8fCAwKTtcblxuICAgICAgaWYgKGlzTmFOKHRoaXNbXCJuXCJdKSB8fCBpc05hTih0aGlzW1wiZFwiXSkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGcmFjdGlvbihOYU4pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5ldyBGcmFjdGlvbihNYXRoLmNlaWwocGxhY2VzICogdGhpc1tcInNcIl0gKiB0aGlzW1wiblwiXSAvIHRoaXNbXCJkXCJdKSwgcGxhY2VzKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2FsY3VsYXRlcyB0aGUgZmxvb3Igb2YgYSByYXRpb25hbCBudW1iZXJcbiAgICAgKlxuICAgICAqIEV4OiBuZXcgRnJhY3Rpb24oJzQuKDMpJykuZmxvb3IoKSA9PiAoNCAvIDEpXG4gICAgICoqL1xuICAgIFwiZmxvb3JcIjogZnVuY3Rpb24ocGxhY2VzKSB7XG5cbiAgICAgIHBsYWNlcyA9IE1hdGgucG93KDEwLCBwbGFjZXMgfHwgMCk7XG5cbiAgICAgIGlmIChpc05hTih0aGlzW1wiblwiXSkgfHwgaXNOYU4odGhpc1tcImRcIl0pKSB7XG4gICAgICAgIHJldHVybiBuZXcgRnJhY3Rpb24oTmFOKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXcgRnJhY3Rpb24oTWF0aC5mbG9vcihwbGFjZXMgKiB0aGlzW1wic1wiXSAqIHRoaXNbXCJuXCJdIC8gdGhpc1tcImRcIl0pLCBwbGFjZXMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSb3VuZHMgYSByYXRpb25hbCBudW1iZXJzXG4gICAgICpcbiAgICAgKiBFeDogbmV3IEZyYWN0aW9uKCc0LigzKScpLnJvdW5kKCkgPT4gKDQgLyAxKVxuICAgICAqKi9cbiAgICBcInJvdW5kXCI6IGZ1bmN0aW9uKHBsYWNlcykge1xuXG4gICAgICBwbGFjZXMgPSBNYXRoLnBvdygxMCwgcGxhY2VzIHx8IDApO1xuXG4gICAgICBpZiAoaXNOYU4odGhpc1tcIm5cIl0pIHx8IGlzTmFOKHRoaXNbXCJkXCJdKSkge1xuICAgICAgICByZXR1cm4gbmV3IEZyYWN0aW9uKE5hTik7XG4gICAgICB9XG4gICAgICByZXR1cm4gbmV3IEZyYWN0aW9uKE1hdGgucm91bmQocGxhY2VzICogdGhpc1tcInNcIl0gKiB0aGlzW1wiblwiXSAvIHRoaXNbXCJkXCJdKSwgcGxhY2VzKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgaW52ZXJzZSBvZiB0aGUgZnJhY3Rpb24sIG1lYW5zIG51bWVyYXRvciBhbmQgZGVudW1lcmF0b3IgYXJlIGV4Y2hhbmdlZFxuICAgICAqXG4gICAgICogRXg6IG5ldyBGcmFjdGlvbihbLTMsIDRdKS5pbnZlcnNlKCkgPT4gLTQgLyAzXG4gICAgICoqL1xuICAgIFwiaW52ZXJzZVwiOiBmdW5jdGlvbigpIHtcblxuICAgICAgcmV0dXJuIG5ldyBGcmFjdGlvbih0aGlzW1wic1wiXSAqIHRoaXNbXCJkXCJdLCB0aGlzW1wiblwiXSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIENhbGN1bGF0ZXMgdGhlIGZyYWN0aW9uIHRvIHNvbWUgaW50ZWdlciBleHBvbmVudFxuICAgICAqXG4gICAgICogRXg6IG5ldyBGcmFjdGlvbigtMSwyKS5wb3coLTMpID0+IC04XG4gICAgICovXG4gICAgXCJwb3dcIjogZnVuY3Rpb24obSkge1xuXG4gICAgICBpZiAobSA8IDApIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGcmFjdGlvbihNYXRoLnBvdyh0aGlzWydzJ10gKiB0aGlzW1wiZFwiXSwgLW0pLCBNYXRoLnBvdyh0aGlzW1wiblwiXSwgLW0pKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBuZXcgRnJhY3Rpb24oTWF0aC5wb3codGhpc1sncyddICogdGhpc1tcIm5cIl0sIG0pLCBNYXRoLnBvdyh0aGlzW1wiZFwiXSwgbSkpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiB0d28gcmF0aW9uYWwgbnVtYmVycyBhcmUgdGhlIHNhbWVcbiAgICAgKlxuICAgICAqIEV4OiBuZXcgRnJhY3Rpb24oMTkuNikuZXF1YWxzKFs5OCwgNV0pO1xuICAgICAqKi9cbiAgICBcImVxdWFsc1wiOiBmdW5jdGlvbihhLCBiKSB7XG5cbiAgICAgIHBhcnNlKGEsIGIpO1xuICAgICAgcmV0dXJuIHRoaXNbXCJzXCJdICogdGhpc1tcIm5cIl0gKiBQW1wiZFwiXSA9PT0gUFtcInNcIl0gKiBQW1wiblwiXSAqIHRoaXNbXCJkXCJdOyAvLyBTYW1lIGFzIGNvbXBhcmUoKSA9PT0gMFxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiB0d28gcmF0aW9uYWwgbnVtYmVycyBhcmUgdGhlIHNhbWVcbiAgICAgKlxuICAgICAqIEV4OiBuZXcgRnJhY3Rpb24oMTkuNikuZXF1YWxzKFs5OCwgNV0pO1xuICAgICAqKi9cbiAgICBcImNvbXBhcmVcIjogZnVuY3Rpb24oYSwgYikge1xuXG4gICAgICBwYXJzZShhLCBiKTtcbiAgICAgIHZhciB0ID0gKHRoaXNbXCJzXCJdICogdGhpc1tcIm5cIl0gKiBQW1wiZFwiXSAtIFBbXCJzXCJdICogUFtcIm5cIl0gKiB0aGlzW1wiZFwiXSk7XG4gICAgICByZXR1cm4gKDAgPCB0KSAtICh0IDwgMCk7XG4gICAgfSxcblxuICAgIFwic2ltcGxpZnlcIjogZnVuY3Rpb24oZXBzKSB7XG5cbiAgICAgIC8vIEZpcnN0IG5haXZlIGltcGxlbWVudGF0aW9uLCBuZWVkcyBpbXByb3ZlbWVudFxuXG4gICAgICBpZiAoaXNOYU4odGhpc1snbiddKSB8fCBpc05hTih0aGlzWydkJ10pKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuXG4gICAgICB2YXIgY29udCA9IHRoaXNbJ2FicyddKClbJ3RvQ29udGludWVkJ10oKTtcblxuICAgICAgZXBzID0gZXBzIHx8IDAuMDAxO1xuXG4gICAgICBmdW5jdGlvbiByZWMoYSkge1xuICAgICAgICBpZiAoYS5sZW5ndGggPT09IDEpXG4gICAgICAgICAgcmV0dXJuIG5ldyBGcmFjdGlvbihhWzBdKTtcbiAgICAgICAgcmV0dXJuIHJlYyhhLnNsaWNlKDEpKVsnaW52ZXJzZSddKClbJ2FkZCddKGFbMF0pO1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbnQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHRtcCA9IHJlYyhjb250LnNsaWNlKDAsIGkgKyAxKSk7XG4gICAgICAgIGlmICh0bXBbJ3N1YiddKHRoaXNbJ2FicyddKCkpWydhYnMnXSgpLnZhbHVlT2YoKSA8IGVwcykge1xuICAgICAgICAgIHJldHVybiB0bXBbJ211bCddKHRoaXNbJ3MnXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiB0d28gcmF0aW9uYWwgbnVtYmVycyBhcmUgZGl2aXNpYmxlXG4gICAgICpcbiAgICAgKiBFeDogbmV3IEZyYWN0aW9uKDE5LjYpLmRpdmlzaWJsZSgxLjUpO1xuICAgICAqL1xuICAgIFwiZGl2aXNpYmxlXCI6IGZ1bmN0aW9uKGEsIGIpIHtcblxuICAgICAgcGFyc2UoYSwgYik7XG4gICAgICByZXR1cm4gISghKFBbXCJuXCJdICogdGhpc1tcImRcIl0pIHx8ICgodGhpc1tcIm5cIl0gKiBQW1wiZFwiXSkgJSAoUFtcIm5cIl0gKiB0aGlzW1wiZFwiXSkpKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIGRlY2ltYWwgcmVwcmVzZW50YXRpb24gb2YgdGhlIGZyYWN0aW9uXG4gICAgICpcbiAgICAgKiBFeDogbmV3IEZyYWN0aW9uKFwiMTAwLic5MTgyMydcIikudmFsdWVPZigpID0+IDEwMC45MTgyMzkxODIzOTE4M1xuICAgICAqKi9cbiAgICAndmFsdWVPZic6IGZ1bmN0aW9uKCkge1xuXG4gICAgICByZXR1cm4gdGhpc1tcInNcIl0gKiB0aGlzW1wiblwiXSAvIHRoaXNbXCJkXCJdO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nLWZyYWN0aW9uIHJlcHJlc2VudGF0aW9uIG9mIGEgRnJhY3Rpb24gb2JqZWN0XG4gICAgICpcbiAgICAgKiBFeDogbmV3IEZyYWN0aW9uKFwiMS4nMydcIikudG9GcmFjdGlvbigpID0+IFwiNCAxLzNcIlxuICAgICAqKi9cbiAgICAndG9GcmFjdGlvbic6IGZ1bmN0aW9uKGV4Y2x1ZGVXaG9sZSkge1xuXG4gICAgICB2YXIgd2hvbGUsIHN0ciA9IFwiXCI7XG4gICAgICB2YXIgbiA9IHRoaXNbXCJuXCJdO1xuICAgICAgdmFyIGQgPSB0aGlzW1wiZFwiXTtcbiAgICAgIGlmICh0aGlzW1wic1wiXSA8IDApIHtcbiAgICAgICAgc3RyICs9ICctJztcbiAgICAgIH1cblxuICAgICAgaWYgKGQgPT09IDEpIHtcbiAgICAgICAgc3RyICs9IG47XG4gICAgICB9IGVsc2Uge1xuXG4gICAgICAgIGlmIChleGNsdWRlV2hvbGUgJiYgKHdob2xlID0gTWF0aC5mbG9vcihuIC8gZCkpID4gMCkge1xuICAgICAgICAgIHN0ciArPSB3aG9sZTtcbiAgICAgICAgICBzdHIgKz0gXCIgXCI7XG4gICAgICAgICAgbiAlPSBkO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RyICs9IG47XG4gICAgICAgIHN0ciArPSAnLyc7XG4gICAgICAgIHN0ciArPSBkO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIGxhdGV4IHJlcHJlc2VudGF0aW9uIG9mIGEgRnJhY3Rpb24gb2JqZWN0XG4gICAgICpcbiAgICAgKiBFeDogbmV3IEZyYWN0aW9uKFwiMS4nMydcIikudG9MYXRleCgpID0+IFwiXFxmcmFjezR9ezN9XCJcbiAgICAgKiovXG4gICAgJ3RvTGF0ZXgnOiBmdW5jdGlvbihleGNsdWRlV2hvbGUpIHtcblxuICAgICAgdmFyIHdob2xlLCBzdHIgPSBcIlwiO1xuICAgICAgdmFyIG4gPSB0aGlzW1wiblwiXTtcbiAgICAgIHZhciBkID0gdGhpc1tcImRcIl07XG4gICAgICBpZiAodGhpc1tcInNcIl0gPCAwKSB7XG4gICAgICAgIHN0ciArPSAnLSc7XG4gICAgICB9XG5cbiAgICAgIGlmIChkID09PSAxKSB7XG4gICAgICAgIHN0ciArPSBuO1xuICAgICAgfSBlbHNlIHtcblxuICAgICAgICBpZiAoZXhjbHVkZVdob2xlICYmICh3aG9sZSA9IE1hdGguZmxvb3IobiAvIGQpKSA+IDApIHtcbiAgICAgICAgICBzdHIgKz0gd2hvbGU7XG4gICAgICAgICAgbiAlPSBkO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RyICs9IFwiXFxcXGZyYWN7XCI7XG4gICAgICAgIHN0ciArPSBuO1xuICAgICAgICBzdHIgKz0gJ317JztcbiAgICAgICAgc3RyICs9IGQ7XG4gICAgICAgIHN0ciArPSAnfSc7XG4gICAgICB9XG4gICAgICByZXR1cm4gc3RyO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGFuIGFycmF5IG9mIGNvbnRpbnVlZCBmcmFjdGlvbiBlbGVtZW50c1xuICAgICAqXG4gICAgICogRXg6IG5ldyBGcmFjdGlvbihcIjcvOFwiKS50b0NvbnRpbnVlZCgpID0+IFswLDEsN11cbiAgICAgKi9cbiAgICAndG9Db250aW51ZWQnOiBmdW5jdGlvbigpIHtcblxuICAgICAgdmFyIHQ7XG4gICAgICB2YXIgYSA9IHRoaXNbJ24nXTtcbiAgICAgIHZhciBiID0gdGhpc1snZCddO1xuICAgICAgdmFyIHJlcyA9IFtdO1xuXG4gICAgICBpZiAoaXNOYU4odGhpc1snbiddKSB8fCBpc05hTih0aGlzWydkJ10pKSB7XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgICB9XG5cbiAgICAgIGRvIHtcbiAgICAgICAgcmVzLnB1c2goTWF0aC5mbG9vcihhIC8gYikpO1xuICAgICAgICB0ID0gYSAlIGI7XG4gICAgICAgIGEgPSBiO1xuICAgICAgICBiID0gdDtcbiAgICAgIH0gd2hpbGUgKGEgIT09IDEpO1xuXG4gICAgICByZXR1cm4gcmVzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIGEgZnJhY3Rpb24gd2l0aCBhbGwgZGlnaXRzXG4gICAgICpcbiAgICAgKiBFeDogbmV3IEZyYWN0aW9uKFwiMTAwLic5MTgyMydcIikudG9TdHJpbmcoKSA9PiBcIjEwMC4oOTE4MjMpXCJcbiAgICAgKiovXG4gICAgJ3RvU3RyaW5nJzogZnVuY3Rpb24oZGVjKSB7XG5cbiAgICAgIHZhciBnO1xuICAgICAgdmFyIE4gPSB0aGlzW1wiblwiXTtcbiAgICAgIHZhciBEID0gdGhpc1tcImRcIl07XG5cbiAgICAgIGlmIChpc05hTihOKSB8fCBpc05hTihEKSkge1xuICAgICAgICByZXR1cm4gXCJOYU5cIjtcbiAgICAgIH1cblxuICAgICAgaWYgKCFGcmFjdGlvblsnUkVEVUNFJ10pIHtcbiAgICAgICAgZyA9IGdjZChOLCBEKTtcbiAgICAgICAgTiAvPSBnO1xuICAgICAgICBEIC89IGc7XG4gICAgICB9XG5cbiAgICAgIGRlYyA9IGRlYyB8fCAxNTsgLy8gMTUgPSBkZWNpbWFsIHBsYWNlcyB3aGVuIG5vIHJlcGl0YXRpb25cblxuICAgICAgdmFyIGN5Y0xlbiA9IGN5Y2xlTGVuKE4sIEQpOyAvLyBDeWNsZSBsZW5ndGhcbiAgICAgIHZhciBjeWNPZmYgPSBjeWNsZVN0YXJ0KE4sIEQsIGN5Y0xlbik7IC8vIEN5Y2xlIHN0YXJ0XG5cbiAgICAgIHZhciBzdHIgPSB0aGlzWydzJ10gPT09IC0xID8gXCItXCIgOiBcIlwiO1xuXG4gICAgICBzdHIgKz0gTiAvIEQgfCAwO1xuXG4gICAgICBOICU9IEQ7XG4gICAgICBOICo9IDEwO1xuXG4gICAgICBpZiAoTilcbiAgICAgICAgc3RyICs9IFwiLlwiO1xuXG4gICAgICBpZiAoY3ljTGVuKSB7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IGN5Y09mZjsgaS0tOyApIHtcbiAgICAgICAgICBzdHIgKz0gTiAvIEQgfCAwO1xuICAgICAgICAgIE4gJT0gRDtcbiAgICAgICAgICBOICo9IDEwO1xuICAgICAgICB9XG4gICAgICAgIHN0ciArPSBcIihcIjtcbiAgICAgICAgZm9yICh2YXIgaSA9IGN5Y0xlbjsgaS0tOyApIHtcbiAgICAgICAgICBzdHIgKz0gTiAvIEQgfCAwO1xuICAgICAgICAgIE4gJT0gRDtcbiAgICAgICAgICBOICo9IDEwO1xuICAgICAgICB9XG4gICAgICAgIHN0ciArPSBcIilcIjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAodmFyIGkgPSBkZWM7IE4gJiYgaS0tOyApIHtcbiAgICAgICAgICBzdHIgKz0gTiAvIEQgfCAwO1xuICAgICAgICAgIE4gJT0gRDtcbiAgICAgICAgICBOICo9IDEwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gc3RyO1xuICAgIH1cbiAgfTtcblxuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZVtcImFtZFwiXSkge1xuICAgIGRlZmluZShbXSwgZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gRnJhY3Rpb247XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09IFwib2JqZWN0XCIpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsndmFsdWUnOiB0cnVlfSk7XG4gICAgRnJhY3Rpb25bJ2RlZmF1bHQnXSA9IEZyYWN0aW9uO1xuICAgIEZyYWN0aW9uWydGcmFjdGlvbiddID0gRnJhY3Rpb247XG4gICAgbW9kdWxlWydleHBvcnRzJ10gPSBGcmFjdGlvbjtcbiAgfSBlbHNlIHtcbiAgICByb290WydGcmFjdGlvbiddID0gRnJhY3Rpb247XG4gIH1cblxufSkodGhpcyk7XG4iXX0=
