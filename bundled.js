!function r(s,a,u){function l(e,t){if(!a[e]){if(!s[e]){var n="function"==typeof require&&require;if(!t&&n)return n(e,!0);if(h)return h(e,!0);var i=new Error("Cannot find module '"+e+"'");throw i.code="MODULE_NOT_FOUND",i}var o=a[e]={exports:{}};s[e][0].call(o.exports,function(t){return l(s[e][1][t]||t)},o,o.exports,r,s,a,u)}return a[e].exports}for(var h="function"==typeof require&&require,t=0;t<u.length;t++)l(u[t]);return l}({1:[function(t,e,n){"use strict";var i,g=this&&this.__extends||(i=function(t,e){return(i=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(t,e)},function(t,e){function n(){this.constructor=t}i(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)});Object.defineProperty(n,"__esModule",{value:!0});var o,r=t("fraction.js");!function(o){o.defaultNextItem=null,o.currentLevel=0;var t=(Object.defineProperty(e.prototype,"isDisplaying",{get:function(){return this._isDisplaying},enumerable:!0,configurable:!0}),e.prototype.display=function(){this._isDisplaying=!0},e.prototype.undisplay=function(){this._isDisplaying=!1},e.prototype.getNextItem=function(){if(null!=o.defaultNextItem)return o.defaultNextItem(this);throw new Error("No default next item provided")},e.prototype.displayNext=function(){this.undisplay();var t=this.getNextItem();null!==t&&t.display()},e.prototype.reset=function(){},e);function e(){this._isDisplaying=!1,this._isDisplaying=!1,this.reset()}o.DisplayedItem=t;var n=(Object.defineProperty(i.prototype,"question",{get:function(){return this._question},enumerable:!0,configurable:!0}),i);function i(t,e,n){void 0===n&&(n=!1),this.imgSrc=t,this.name=e,this.isCorrect=n}o.QuestionOption=n;var r,s=(g(a,r=t),a.prototype.answered=function(t){if(!this.canAnswerMultipleTimes()&&null!=this.answeredOption)throw"Cannot answer a question twice";console.log("correct: "+t.isCorrect),t.isCorrect?(this.answeredOption=t,this.correctHandler(t)):this.incorrectHandler(t)},a.prototype.correctHandler=function(t){this.displayNext()},a.prototype.incorrectHandler=function(t){this.answeredOption=null,$("#question-dialog").removeData(),$("#question-dialog").attr("data-backdrop","static"),$("#question-dialog .modal-title").text("Incorrect"),$("#question-dialog .modal-footer button").text("OK"),$("#question-dialog .modal-body").text("Sorry, that's not the right answer. Try again!"),$("#question-dialog").modal()},a.prototype.canAnswerMultipleTimes=function(){return!1},a);function a(t,e){var n=r.call(this)||this;return n.questionTitle=t,(e=u(n.options=e)).forEach(function(t){t._question=n}),n.answeredOption=null,n}function u(t){var e,n,i;for(i=t.length-1;0<i;i--)e=Math.floor(Math.random()*(i+1)),n=t[i],t[i]=t[e],t[e]=n;return t}o.Question=s,o.shuffle=u;var l,h=(g(c,l=t),c.prototype.dialogCreated=function(){},c.prototype.display=function(){var t=this;setTimeout(function(){$("#question-dialog").removeData(),$("#question-dialog .modal-title").text(t.title),$("#question-dialog .modal-body").text(t.text),null!=t.buttonText?($("#question-dialog .close").show(),$("#question-dialog .modal-footer").show(),$("#question-dialog .modal-footer button").text(t.buttonText)):($("#question-dialog .close").hide(),$("#question-dialog .modal-footer").hide()),t.dialogCreated(),$("#question-dialog").modal({backdrop:"static"}),$("#question-dialog").one("shown.bs.modal",function(){}),$("#question-dialog").one("hidden.bs.modal",function(){$("#question-dialog").modal("dispose"),t.displayNext()})},1e3)},c);function c(t,e,n){void 0===n&&(n="OK");var i=l.call(this)||this;return i.title=t,i.text=e,i.buttonText=n,i}o.InfoBox=h;var d,f=(g(p,d=t),p.prototype.display=function(){var t=this;setTimeout(function(){t.displayNext()},this.time)},p);function p(t){var e=d.call(this)||this;return e.time=t,e}o.Delay=f;var m,v=(g(y,m=h),y.prototype.dialogCreated=function(){$("#question-dialog .modal-body").text("");var i=$("<div></div>");i.addClass("level-buttons"),this.levelMarkups.forEach(function(t,e){var n=$("<button></button>");n.html(t),n.data("level-id",e),n.click(function(){o.currentLevel=n.data("level-id"),$("#question-dialog").modal("hide")}),i.append(n)}),$("#question-dialog .modal-body").append(i)},y);function y(t){var e=m.call(this,"Choose a level","",null)||this;return e.levelMarkups=t,e}o.LevelChoice=v,o.getRandomInt=function(t,e){return t=Math.ceil(t),e=Math.floor(e),Math.floor(Math.random()*(e-t+1))+t},o.getRandomArbitrary=function(t,e){return Math.random()*(e-t)+t}}(o=o||{});var s,a=(s=o.DisplayedItem,g(u,s),u.prototype.display=function(){var t=this;!function(t,e,n){void 0===e&&(e=!1);var i=$(window).height()-$(".canoer").height()/2,o=parseInt($(".canoer").css("bottom"));e&&(console.log("Current percent: "+o/i*100),t+=o/i*100),t<7&&(t=7),i*=t/100,console.log("target: "+i),console.log("target percent: "+t);var r=10*(i-o);$(".canoer").addClass("canoer-animated"),$(".canoer").animate({bottom:t+"%"},r,"linear",function(){$(".canoer-animated").removeClass("canoer-animated"),n&&n()})}(this.percent,this.relative,function(){t.displayNext()})},u);function u(t,e){void 0===e&&(e=!1);var n=s.call(this)||this;return n.percent=t,n.relative=e,n}var l,h=(l=o.DisplayedItem,g(c,l),c.prototype.display=function(){$(".canoer").css("bottom",this.percent+"%"),this.displayNext()},c);function c(t){var e=l.call(this)||this;return e.percent=t,e.percent<7&&(e.percent=7),e}var d,f=(d=o.LevelChoice,g(p,d),p.prototype.dialogCreated=function(){d.prototype.dialogCreated.call(this),MathJax.Hub.Queue(["Typeset",MathJax.Hub]),MathJax.Hub.Queue(function(){$(".MathJax_CHTML").css("font-size","inherit")})},p);function p(){return null!==d&&d.apply(this,arguments)||this}var m=o.getRandomInt;var v,y,w=0,N=[],b=(v=o.DisplayedItem,g(x,v),x.prototype.addLoop=function(){this.numLoops--,this.numLoops<-1&&(this.numLoops=-1)},x.prototype.getNumTimesLooped=function(){return this.numLoops},x.prototype.display=function(){this.numLoops<this.times&&(this.relative?w+=this.index:w=this.index,w-=1,this.numLoops++),this.displayNext()},x.prototype.reset=function(){this.numLoops=0},x);function x(t,e,n){void 0===e&&(e=!1),void 0===n&&(n=1);var i=v.call(this)||this;return i.index=t,i.relative=e,i.times=n,t<(i.numLoops=0)&&(i.relative=!0),i}var M,q=(M=o.DisplayedItem,g(C,M),C.prototype.display=function(){N.forEach(function(t){t.reset()}),this.displayNext()},C);function C(){return null!==M&&M.apply(this,arguments)||this}var L,_=(L=o.InfoBox,g(D,L),D.generateNumber=function(){var t=m(1,9);switch(o.currentLevel+1){default:throw"Unexpected level";case 1:return new r.default(m(0,9),1);case 2:return new r.default(m(10,99),1);case 3:return new r.default(m(100,999),1);case 4:return new r.default(m(1e3,9999),1);case 5:return new r.default(m(1,9),10);case 6:return new r.default(m(10,99),100);case 7:return new r.default(m(100,999),1e3);case 8:return new r.default(t,m(1,9));case 9:return new r.default(m(1,9),t);case 10:return new r.default(m(1,9).toString()+" "+new r.default(m(1,9),m(1,9)).toFraction())}},D.convertFraction=function(t){var e=o.currentLevel+1;return 5<=e&&e<=7?t.toString(e-5+1):t.toFraction(!0)},D.prototype.isCorrect=function(t){switch(t){case 0:return this.leftNum.compare(this.rightNum)<0;case 1:return 0==this.leftNum.compare(this.rightNum);case 2:return 0<this.leftNum.compare(this.rightNum);default:throw"Unexpected symbol"}},D.prototype.displayNext=function(){this.correct?L.prototype.displayNext.call(this):(w++,y.addLoop(),y.addLoop(),new a(-7,!0).display())},D.prototype.getCorrectSymNum=function(){var t=this.leftNum.compare(this.rightNum);return t<0?0:0<t?2:1},D.prototype.dialogCreated=function(){var i=this;$("#question-dialog .modal-title").text("Question "+(y.getNumTimesLooped()+1)+" of 10"),$("#question-dialog .modal-body").text(""),this.leftNum=D.generateNumber(),this.rightNum=D.generateNumber();var o=$("<div></div>");o.addClass("math-question"),$("#question-dialog .modal-body").append(o),o.html("Choose the symbol that best describes these numbers.<p></p><span>`"+D.convertFraction(this.leftNum)+"` <span class='question-mark'><i class='far fa-question-circle'></i></span> `"+D.convertFraction(this.rightNum)+"`</span><p></p><button class='less-than'>` < `</button><button class='equals'>` = `</button><button class='greater-than'>` > `</button>"),o.find("button").click(function(t){var e,n=$(t.target);if(n.hasClass("less-than"))e=0;else if(n.hasClass("equals"))e=1;else{if(!n.hasClass("greater-than"))throw"Unknown symbol";e=2}$(".math-question button").prop("disabled",!0),i.correct=i.isCorrect(e),i.correct?(function(t,e){if(e=e||function(){},Modernizr.audio){var n=new Audio(t);n.onerror=function(){e()},n.addEventListener("ended",e),n.play()}else e()}("correct.mp3"),o.find(".question-mark").css("color","green")):(e=i.getCorrectSymNum(),n.effect("shake"),o.find(".question-mark").css("color","red")),o.find(".question-mark").html("` "+["<","=",">"][e]+" `"),MathJax.Hub.Queue(["Typeset",MathJax.Hub]),MathJax.Hub.Queue(function(){setTimeout(function(){$("#question-dialog").modal("hide")},3e3)})}),MathJax.Hub.Queue(["Typeset",MathJax.Hub]),MathJax.Hub.Queue(function(){$(".math-question > span").children("span").css("font-size","inherit")})},D);function D(){return L.call(this,"","",null)||this}N=[new q,new o.InfoBox("Welcome!","Welcome to Comparison Canoeing! This game will teach you all about comparing numbers."),new a(7),new f(["Level 1<p>`6 < 7`","Level 2<p>`12 < 15`","Level 3<p>`325 > 199`","Level 4<p>`2500 > 1877`","Level 5<p>`0.2 < 0.5`","Level 6<p>`0.19 < 0.21`","Level 7<p>`0.234 > 0.168`","Level 8<p>`1/5 < 1/7`","Level 9<p>`2/4 < 3/4`","Level 10<p>`3 1/3 > 1 7/9`"]),new _,new a(7,!0),y=new b(-2,!0,9),new o.InfoBox("Congratulations!","You've crossed the river! Ready to try a different level?","Yes!"),new q,new h(0),new b(2,!1,1)],o.defaultNextItem=function(t){return w==N.length-1?(console.error("No next items"),null):(console.log("Get from index "+(w+1)),N[++w])},$(window).on("load",function(){r.default.REDUCE=!1,N[w].display()})},{"fraction.js":2}],2:[function(t,o,r){!function(t){"use strict";var m={s:1,n:0,d:1};function e(e){function t(){var t=Error.apply(this,arguments);t.name=this.name=e,this.stack=t.stack,this.message=t.message}function n(){}return n.prototype=Error.prototype,t.prototype=new n,t}var v=l.DivisionByZero=e("DivisionByZero"),n=l.InvalidParameter=e("InvalidParameter");function y(t,e){return isNaN(t=parseInt(t,10))&&g(),t*e}function g(){throw new n}var i=function(t,e){var n,i=0,o=1,r=1,s=0,a=0,u=0,l=1,h=1,c=0,d=1,f=1,p=1;if(null==t);else if(void 0!==e)r=(i=t)*(o=e);else switch(typeof t){case"object":"d"in t&&"n"in t?(i=t.n,o=t.d,"s"in t&&(i*=t.s)):0 in t?(i=t[0],1 in t&&(o=t[1])):g(),r=i*o;break;case"number":if(t<0&&(t=-(r=t)),t%1==0)i=t;else if(0<t){for(1<=t&&(t/=h=Math.pow(10,Math.floor(1+Math.log(t)/Math.LN10)));d<=1e7&&p<=1e7;){if(t===(n=(c+f)/(d+p))){o=d+p<=1e7?(i=c+f,d+p):d<p?(i=f,p):(i=c,d);break}n<t?(c+=f,d+=p):(f+=c,p+=d),o=1e7<d?(i=f,p):(i=c,d)}i*=h}else(isNaN(t)||isNaN(e))&&(o=i=NaN);break;case"string":if(null===(d=t.match(/\d+|./g))&&g(),"-"===d[c]?(r=-1,c++):"+"===d[c]&&c++,d.length===c+1?a=y(d[c++],r):"."===d[c+1]||"."===d[c]?("."!==d[c]&&(s=y(d[c++],r)),(++c+1===d.length||"("===d[c+1]&&")"===d[c+3]||"'"===d[c+1]&&"'"===d[c+3])&&(a=y(d[c],r),l=Math.pow(10,d[c].length),c++),("("===d[c]&&")"===d[c+2]||"'"===d[c]&&"'"===d[c+2])&&(u=y(d[c+1],r),h=Math.pow(10,d[c+1].length)-1,c+=3)):"/"===d[c+1]||":"===d[c+1]?(a=y(d[c],r),l=y(d[c+2],1),c+=3):"/"===d[c+3]&&" "===d[c+1]&&(s=y(d[c],r),a=y(d[c+2],r),l=y(d[c+4],1),c+=5),d.length<=c){r=i=u+(o=l*h)*s+h*a;break}default:g()}if(0===o)throw new v;m.s=r<0?-1:1,m.n=Math.abs(i),m.d=Math.abs(o)};function u(t,e){if(!t)return e;if(!e)return t;for(;;){if(!(t%=e))return e;if(!(e%=t))return t}}function l(t,e){if(!(this instanceof l))return new l(t,e);i(t,e),t=l.REDUCE?u(m.d,m.n):1,this.s=m.s,this.n=m.n/t,this.d=m.d/t}l.REDUCE=1,l.prototype={s:1,n:0,d:1,abs:function(){return new l(this.n,this.d)},neg:function(){return new l(-this.s*this.n,this.d)},add:function(t,e){return i(t,e),new l(this.s*this.n*m.d+m.s*this.d*m.n,this.d*m.d)},sub:function(t,e){return i(t,e),new l(this.s*this.n*m.d-m.s*this.d*m.n,this.d*m.d)},mul:function(t,e){return i(t,e),new l(this.s*m.s*this.n*m.n,this.d*m.d)},div:function(t,e){return i(t,e),new l(this.s*m.s*this.n*m.d,this.d*m.n)},clone:function(){return new l(this)},mod:function(t,e){return isNaN(this.n)||isNaN(this.d)?new l(NaN):void 0===t?new l(this.s*this.n%this.d,1):(i(t,e),0===m.n&&0===this.d&&l(0,0),new l(this.s*(m.d*this.n)%(m.n*this.d),m.d*this.d))},gcd:function(t,e){return i(t,e),new l(u(m.n,this.n)*u(m.d,this.d),m.d*this.d)},lcm:function(t,e){return i(t,e),0===m.n&&0===this.n?new l:new l(m.n*this.n,u(m.n,this.n)*u(m.d,this.d))},ceil:function(t){return t=Math.pow(10,t||0),isNaN(this.n)||isNaN(this.d)?new l(NaN):new l(Math.ceil(t*this.s*this.n/this.d),t)},floor:function(t){return t=Math.pow(10,t||0),isNaN(this.n)||isNaN(this.d)?new l(NaN):new l(Math.floor(t*this.s*this.n/this.d),t)},round:function(t){return t=Math.pow(10,t||0),isNaN(this.n)||isNaN(this.d)?new l(NaN):new l(Math.round(t*this.s*this.n/this.d),t)},inverse:function(){return new l(this.s*this.d,this.n)},pow:function(t){return t<0?new l(Math.pow(this.s*this.d,-t),Math.pow(this.n,-t)):new l(Math.pow(this.s*this.n,t),Math.pow(this.d,t))},equals:function(t,e){return i(t,e),this.s*this.n*m.d==m.s*m.n*this.d},compare:function(t,e){i(t,e);var n=this.s*this.n*m.d-m.s*m.n*this.d;return(0<n)-(n<0)},simplify:function(t){if(isNaN(this.n)||isNaN(this.d))return this;var e=this.abs().toContinued();function n(t){return 1===t.length?new l(t[0]):n(t.slice(1)).inverse().add(t[0])}t=t||.001;for(var i=0;i<e.length;i++){var o=n(e.slice(0,i+1));if(o.sub(this.abs()).abs().valueOf()<t)return o.mul(this.s)}return this},divisible:function(t,e){return i(t,e),!(!(m.n*this.d)||this.n*m.d%(m.n*this.d))},valueOf:function(){return this.s*this.n/this.d},toFraction:function(t){var e,n="",i=this.n,o=this.d;return this.s<0&&(n+="-"),1===o?n+=i:(t&&0<(e=Math.floor(i/o))&&(n+=e,n+=" ",i%=o),n+=i,n+="/",n+=o),n},toLatex:function(t){var e,n="",i=this.n,o=this.d;return this.s<0&&(n+="-"),1===o?n+=i:(t&&0<(e=Math.floor(i/o))&&(n+=e,i%=o),n+="\\frac{",n+=i,n+="}{",n+=o,n+="}"),n},toContinued:function(){var t,e=this.n,n=this.d,i=[];if(isNaN(this.n)||isNaN(this.d))return i;for(;i.push(Math.floor(e/n)),t=e%n,e=n,n=t,1!==e;);return i},toString:function(t){var e,n=this.n,i=this.d;if(isNaN(n)||isNaN(i))return"NaN";l.REDUCE||(n/=e=u(n,i),i/=e),t=t||15;var o=function(t,e){for(;e%2==0;e/=2);for(;e%5==0;e/=5);if(1===e)return 0;for(var n=10%e,i=1;1!==n;i++)if(n=10*n%e,2e3<i)return 0;return i}(0,i),r=function(t,e,n){for(var i=1,o=function(t,e,n){for(var i=1;0<e;t=t*t%n,e>>=1)1&e&&(i=i*t%n);return i}(10,n,e),r=0;r<300;r++){if(i===o)return r;i=10*i%e,o=10*o%e}return 0}(0,i,o),s=-1===this.s?"-":"";if(s+=n/i|0,n%=i,(n*=10)&&(s+="."),o){for(var a=r;a--;)s+=n/i|0,n%=i,n*=10;s+="(";for(a=o;a--;)s+=n/i|0,n%=i,n*=10;s+=")"}else for(a=t;n&&a--;)s+=n/i|0,n%=i,n*=10;return s}},"function"==typeof define&&define.amd?define([],function(){return l}):"object"==typeof r?(Object.defineProperty(r,"__esModule",{value:!0}),(l.default=l).Fraction=l,o.exports=l):t.Fraction=l}(this)},{}]},{},[1]);
