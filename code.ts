/// <reference path="node_modules/@types/jquery/index.d.ts" />
/// <reference path="node_modules/@types/jqueryui/index.d.ts" />
/// <reference path="node_modules/@types/bootstrap/index.d.ts" />
/// <reference path="node_modules/@types/browserify/index.d.ts" />
/// <reference path="node_modules/@types/mathjax/index.d.ts" />
/// <reference path="node_modules/@types/modernizr/index.d.ts" />
/// <reference path="node_modules/fraction.js/fraction.d.ts" />

import Fraction from "fraction.js";

namespace GameTools {
    export let defaultNextItem: (current: DisplayedItem) => DisplayedItem = null;
    export let currentLevel = 0;
    export abstract class DisplayedItem {
        private _isDisplaying = false;
        public get isDisplaying(): boolean {
            return this._isDisplaying;
        }
        constructor() {
            this._isDisplaying = false;
            this.reset();
        }
        display(): void {
            this._isDisplaying = true;
        }
        undisplay(): void {
            this._isDisplaying = false;
        }
        getNextItem(): DisplayedItem {
            if (defaultNextItem != null)
                return defaultNextItem(this);
            else
                throw new Error("No default next item provided");
        }
        public displayNext(): void {
            this.undisplay();
            let item = this.getNextItem();
            if(item !== null)
                item.display();
        }
        reset(): void {

        }
    }

    export class QuestionOption {
        _question: Question;
        public get question(): Question {
            return this._question;
        }
        constructor(public imgSrc: string, public name: string, public isCorrect = false) {
        }
    }

    export abstract class Question extends DisplayedItem {
        protected answeredOption: QuestionOption;
        constructor(protected questionTitle: string, protected options: QuestionOption[]) {
            super();
            options = shuffle(options);
            options.forEach((option: QuestionOption) => {
                option._question = this;
            });
            this.answeredOption = null;
        }
        protected answered(option: QuestionOption): void {
            if (!this.canAnswerMultipleTimes() && this.answeredOption != null)
                throw "Cannot answer a question twice";
            console.log("correct: " + option.isCorrect);
            if(!option.isCorrect) {
                this.incorrectHandler(option);
                return;
            }
            this.answeredOption = option;
            this.correctHandler(option);
        }
        protected correctHandler(option: QuestionOption): void {
            this.displayNext();
        }
        protected incorrectHandler(option: QuestionOption): void {
            this.answeredOption = null;
            $('#question-dialog').removeData();
            $("#question-dialog").attr("data-backdrop", "static");
            $("#question-dialog .modal-title").text("Incorrect");
            $("#question-dialog .modal-footer button").text("OK");
            $("#question-dialog .modal-body").text("Sorry, that's not the right answer. Try again!");
            $("#question-dialog").modal();
        }
        protected canAnswerMultipleTimes(): boolean {
            return false;
        }
        abstract display(): void;
    }

    /**
    * Shuffles array in place.
    * @param {Array} a items An array containing the items.
    */
    export function shuffle<T>(a: T[]): T[] {
        let j: number, x: T, i: number;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    }

    export class InfoBox extends DisplayedItem {
        constructor(protected title: string, protected text: string, protected buttonText = "OK") {
            super();
        }
        protected dialogCreated(): void {

        }
        display(): void {
            setTimeout(() => {
                $('#question-dialog').removeData();
                $("#question-dialog .modal-title").text(this.title);
                $("#question-dialog .modal-body").text(this.text);
                if(this.buttonText != null) {
                    $("#question-dialog .close").show();
                    $("#question-dialog .modal-footer").show();
                    $("#question-dialog .modal-footer button").text(this.buttonText);
                } else {
                    $("#question-dialog .close").hide();
                    $("#question-dialog .modal-footer").hide();
                }
                this.dialogCreated();
                $("#question-dialog").modal( { backdrop: "static" });
                $("#question-dialog").one("shown.bs.modal", (): void => {
                    
                });
                $("#question-dialog").one("hidden.bs.modal", (): void => {
                        $("#question-dialog").modal('dispose');
                        this.displayNext();
                });
                
           }, 1000);
        }
    }
    export class Delay extends DisplayedItem {
        constructor(protected time: number) {
            super();
        }
        display(): void {
            setTimeout(() => {
                this.displayNext();
            }, this.time);
        }
    }
    export class LevelChoice extends InfoBox {
        constructor(protected levelMarkups: string[]) {
            super("Choose a level", "", null);
        }
        protected dialogCreated(): void {
            $("#question-dialog .modal-body").text("");
            let $container = $("<div></div>");
            $container.addClass("level-buttons");
            this.levelMarkups.forEach((element, index) => {
                
                let $button = $("<button></button>");
                $button.html(element);
                $button.data("level-id", index);
                $button.click(() => {
                    GameTools.currentLevel = $button.data("level-id");
                    $("#question-dialog").modal('hide');
                });
                $container.append($button);
            });
            $("#question-dialog .modal-body").append($container);
        }
    }
    export function getRandomInt(min : number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    export function getRandomArbitrary(min: number, max: number): number {
        let val = Math.random() * (max - min) + min;
        return val;
    }
}

class AnimateCanoer extends GameTools.DisplayedItem {
    constructor(public percent: number, public relative = false) { super(); }
    display(): void {
        animateCanoer(this.percent, this.relative, () => {
            this.displayNext();
        });
    }
}

class MoveCanoer extends GameTools.DisplayedItem {
    constructor(public percent: number) { super(); if(this.percent < 7) this.percent = 7; }
    display(): void {
        $(".canoer").css("bottom", this.percent + "%");
        this.displayNext();
    }
}

class MathLevelChoice extends GameTools.LevelChoice {
    dialogCreated(): void {
        super.dialogCreated();
        MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
        MathJax.Hub.Queue(() => {
            $(".MathJax_CHTML").css("font-size", "inherit");
        });
    }
}
import getRandomInt = GameTools.getRandomInt;
import getRandomFloat = GameTools.getRandomArbitrary;

function playAudioIfSupported(audioFile: string, cb?: () => void): void {
    if(!cb)
        cb = function() {};
    if(Modernizr.audio) {
        var audio = new Audio(audioFile);
        audio.onerror = function() {
            cb();
        }
        audio.addEventListener("ended", cb);
        audio.play();
    } else
        cb();
}

let contentsIndex = 0;
let gameContents: GameTools.DisplayedItem[] = [];
const numQuestions = 10;
const amountPerQuestion = (70/numQuestions);

class Loop extends GameTools.DisplayedItem {
    private numLoops = 0;
    constructor(public index: number, public relative = false, public times = 1) {
        super();
        if(index < 0)
            this.relative = true;
    }
    /* Restore a previous loop */
    addLoop(): void {
        this.numLoops--;
        if(this.numLoops < -1)
            this.numLoops = -1;
    }
    getNumTimesLooped(): number {
        return this.numLoops;
    }
    display(): void {
        if(this.numLoops < this.times) {
            
            if(!this.relative)
                contentsIndex = this.index;
            else
                contentsIndex += this.index;

            contentsIndex -= 1;
            this.numLoops++;
        }
        this.displayNext();
    }
    reset(): void {
        this.numLoops = 0;
    }
}

let questionLoop: Loop;

class SystemReset extends GameTools.DisplayedItem {
    display(): void {
        gameContents.forEach(element => {
            element.reset();
        });
        this.displayNext();
    }
}


class MathQuestion extends GameTools.InfoBox {
    private leftNum: Fraction;
    private rightNum: Fraction;
    private correct: boolean;
    private forced_num: number;
    constructor() {
        super("", "", null);
    }
    public generateNumber(): Fraction {
        switch(GameTools.currentLevel + 1) {
            default:
                throw "Unexpected level";
            case 1:
                return new Fraction(getRandomInt(0, 9), 1);
            case 2:
                return new Fraction(getRandomInt(10, 99), 1);
            case 3:
                return new Fraction(getRandomInt(100, 999), 1);
            case 4:
                return new Fraction(getRandomInt(1000, 9999), 1);
            case 5:
                return new Fraction(getRandomInt(1, 9), 10);
            case 6:
                return new Fraction(getRandomInt(10, 99), 100);
            case 7:
                return new Fraction(getRandomInt(1, 99), 100).add(new Fraction(getRandomInt(1, 20), 1));
            case 8:
                return new Fraction(this.forced_num, getRandomInt(this.forced_num, 9));
            case 9:
                return new Fraction(getRandomInt(1, this.forced_num), this.forced_num);
            case 10:
                let forced_denom = getRandomInt(2, 25);
                return new Fraction(getRandomInt(1, forced_denom - 1), forced_denom);
        }
    }
    public static convertFraction(fraction: Fraction): string {
        const level = (GameTools.currentLevel + 1);
        if(level >= 5 && level <= 7) {
            let decimalPlaces: number;
            if(level != 7)
                decimalPlaces = 1+(level-5);
            else
                decimalPlaces = 2;
            let str = fraction.valueOf().toFixed(decimalPlaces);
            if(level == 7) {
                str = "$" + str;
            }
            return str;
        } else
            return fraction.toFraction(false);
    }
    isCorrect(symNum: number): boolean {
        switch(symNum) {
            case 0:
                return this.leftNum.compare(this.rightNum) < 0;
            case 1:
                return this.leftNum.compare(this.rightNum) == 0;
            case 2:
                return this.leftNum.compare(this.rightNum) > 0;
            default:
                throw "Unexpected symbol";
        }
    }
    displayNext(): void {
        if(this.correct)
            super.displayNext();
        else {
            contentsIndex++;
            questionLoop.addLoop();
            questionLoop.addLoop();
            new AnimateCanoer(-amountPerQuestion, true).display();
        }
    }
    getCorrectSymNum(): number {
        const comparison =  this.leftNum.compare(this.rightNum);
        if(comparison < 0)
            return 0;
        else if(comparison > 0)
            return 2;
        else
            return 1;
    }
    dialogCreated(): void {
        $("#question-dialog .modal-title").text("Question " + (questionLoop.getNumTimesLooped() + 1) + " of " + 10);
        $("#question-dialog .modal-body").text("");
        this.forced_num = getRandomInt(1, 9);
        this.leftNum = this.generateNumber();
        this.rightNum = this.generateNumber();
        let $div = $("<div></div>");
        $div.addClass("math-question");
        $("#question-dialog .modal-body").append($div);
        $div.html("Choose the symbol that best describes these numbers.<p></p><span>`" + MathQuestion.convertFraction(this.leftNum) + "` <span class='question-mark'><i class='far fa-question-circle'></i></span> " + "`" + MathQuestion.convertFraction(this.rightNum) + "`"
            + "</span><p></p><button class='less-than'>` < `</button><button class='equals'>` = `</button><button class='greater-than'>` > `</button>");
        if((GameTools.currentLevel + 1) == 7)
            $div.find(".question-mark").css("display", "block");
        $div.find("button").click((event) => {
            
            var symNum;
            var $button = $(event.target);
            if($button.hasClass("less-than"))
                symNum = 0;
            else if($button.hasClass("equals"))
                symNum = 1;
            else if($button.hasClass("greater-than"))
                symNum = 2;
            else
                throw "Unknown symbol";
            const symbols = [ "<", "=", ">" ];
            $(".math-question button").prop("disabled", true);
            this.correct = this.isCorrect(symNum);
            if(this.correct) {
                playAudioIfSupported("correct.mp3");
                $div.find(".question-mark").css("color", "green");
            } else {
                symNum = this.getCorrectSymNum();
                $button.effect("shake");
                $div.find(".question-mark").css("color", "red");
            }
            $div.find(".question-mark").html("` " + symbols[symNum] + " `");
            
            MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
            MathJax.Hub.Queue(() => {
                setTimeout(() => {
                    $("#question-dialog").modal('hide');
                }, 3000);
            });
        });
        MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
        MathJax.Hub.Queue(() => {
            $(".math-question > span").children("span").css("font-size", "inherit");
        });
    }
}



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
    questionLoop = new Loop(-2, true, numQuestions-1),
    new GameTools.InfoBox("Congratulations!", "You've crossed the river! Ready to try a different level?", "Yes!"),
    new SystemReset(),
    new MoveCanoer(0),
    new Loop(2, false, 1)
];






GameTools.defaultNextItem = function(current: GameTools.DisplayedItem): GameTools.DisplayedItem {
    if(contentsIndex == gameContents.length - 1) {
        console.error("No next items");
        return null;
    }
    console.log("Get from index " + (contentsIndex + 1));
    return gameContents[++contentsIndex];
}

function animateCanoer(percent: number, relative = false, cb?: () => void): void {
    var target: number = ($(window).height() - ($(".canoer").height() / 2));
    var current: number = parseInt($(".canoer").css("bottom"));

    if(relative) {
        console.log("Current percent: " + ((current/target)*100));
        percent += (current/target)*100;
    }

    if(percent < 7)
        percent = 7;

    target *= (percent/100);
    console.log("target: " + target);
    console.log("target percent: " + percent);
    var duration: number = (target-current)*10;

    

    $(".canoer").addClass("canoer-animated");
    $(".canoer").animate({ bottom: percent + "%" }, duration, 'linear', function() {
        $(".canoer-animated").removeClass("canoer-animated");
        if(cb)
            cb();
    });
}
$(window).on("load", function() {
    /*
    MathJax.Hub.Config({
        "HTML-CSS": {
          scale: 200
        }
    });
    */
    (Fraction as any).REDUCE = false;
    gameContents[contentsIndex].display();
});