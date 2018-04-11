/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */,
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _DataTransformer = __webpack_require__(4);

var _DataTransformer2 = _interopRequireDefault(_DataTransformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TRANSPORT_TYPE = 'TRANSPORT';
var storage = browser.storage.local;

function getAndShowResults(callback) {
    storage.get('results').then(function (items) {
        var flightResults = items.results && items.results.flightResults;
        var combinationLink = items.results.data.search_request._links.combinations.replace('http://', 'https://');

        addInfoToResultsBoxes(flightResults, combinationLink);

        if (callback) {
            callback();
        }
    });
}

function addInfoToResultsBoxes(flightResults, combinationLink) {
    if (!flightResults) {
        alert('Atrapalo Flights: No Results found');
        return;
    }

    //Prevent unique boxes info.
    $('.chrome-flights__box').remove();

    //Set info in Combinations Boxes
    $('article[data-combination-id]').each(function () {
        var combinationId = $(this).data('combination-id');
        var data = flightResults[combinationId];

        if (data) {
            $(this).addClass('chrome-flights__' + data.type);
            $(this).prepend('<div class="chrome-flights__box hidden" style="background:' + getColor(data.type) + ';padding:4px 12px;">\n            ' + ('[' + data.type + '] [CombinationId:<a style="color:cornflowerblue" target="_blank" href="' + (combinationLink + '?identity=' + combinationId) + '">' + combinationId + '</a>]') + '\n        </div>');

            //Set info in Transports
            $(this).find('div.info-track').each(function () {
                var id = $(this).attr('id');
                var transportData = flightResults[combinationId][id];
                if (transportData) {
                    $(this).before('<div style="position:relative;">\n                        <div class="chrome-flights__box hidden"\n                             data-combination-id = "' + combinationId + '"\n                             data-id = "' + transportData.id + '"\n                             style="position:absolute; top:0; right:0; left:0; z-index:1;background:' + getColor(transportData.type) + ';padding:2px 12px;font-size:10px;">\n                            ' + ('[' + transportData.provider + '] [' + transportData.plating_carrier + '] <span class="chrome-flights-copy">' + (transportData.package_identity ? transportData.package_identity : transportData.id) + '</span>') + '\n                            <a href="#" class="chrome-flights__box-priceline" style="float:right;color:cornflowerblue;">[Price Lines]</a>\n                        </div>\n                    </div>');

                    $(this).parent().find('.chrome-flights__box-priceline').click(function (e) {
                        e.preventDefault();
                        showPriceLinesInfo($(this).parent().data('combination-id'), $(this).parent().data('id'));
                    });
                }
            });

            if (flightResults[combinationId].uniqueProviders.length === 1) {
                $(this).addClass('chrome-flights__' + flightResults[combinationId].uniqueProviders[0]);
            }

            $('.chrome-flights-copy').on('dblclick', function () {
                copyToClipboard($(this));
            }).css('color', 'cornflowerblue').css('cursor', 'pointer');
        }
    });
}

function getColor(transportType) {
    if (transportType === TRANSPORT_TYPE) {
        return 'rgba(100, 149, 237, 0.2)';
    }

    return 'rgba(46, 188, 30, 0.2)';
}

function showPriceLinesInfo(combinationId, transportId) {
    storage.get('results').then(function (items) {
        var flightResults = items.results && items.results.flightResults;
        var data = flightResults[combinationId][transportId];
        var priceLines = data.price_lines;

        var headers = '<tr style="padding:3px; font-weight: bold;">\n                              <td style="padding: 2px 5px;">Type</td>\n                              <td style="padding: 2px 5px;">Price</td>\n                              <td style="padding: 2px 5px;">Quantity</td>\n                              <td style="padding: 2px 5px;">Payment Method</td>\n                          </tr>';
        var rows = '';

        Object.keys(priceLines).forEach(function (type) {
            var lines = priceLines[type];

            rows += lines.reduce(function (prev, priceLine) {
                var _priceLine$split = priceLine.split('|'),
                    _priceLine$split2 = _slicedToArray(_priceLine$split, 4),
                    price = _priceLine$split2[0],
                    currency = _priceLine$split2[1],
                    quantity = _priceLine$split2[2],
                    paymentMethod = _priceLine$split2[3];

                return prev + '\n                    <tr>\n                        <td style="padding: 2px 5px;">' + type + '</td>\n                        <td style="padding: 2px 5px; white-space: nowrap;">' + price + ' ' + currency + '</td>\n                        <td style="padding: 2px 5px;">' + quantity + '</td>\n                        <td style="padding: 2px 5px;">' + paymentMethod + '</td>\n                    </tr>\n           ';
            }, '');
        });

        var info = '<table>' + headers + rows + '</table>';

        $.colorbox({ title: 'Price Lines ' + transportId, html: info });
    });
}

function toggleInfo() {
    var boxes = $('div.chrome-flights__box');

    if (boxes.length === 0) {
        getAndShowResults(function () {
            $('div.chrome-flights__box').removeClass('hidden');
        });
        storage.set({ 'infoShown': true });
    } else {
        boxes.toggleClass('hidden');
        storage.set({ 'infoShown': false });
    }
    $('#chrome-flights-menu-info').toggleClass('button-atrapalo--white-bg');
}

function showBoxesByType(type) {
    switch (type) {
        case 'packages':
            $('.chrome-flights__PACKAGE').removeClass('hidden');
            $('.chrome-flights__TRANSPORT').addClass('hidden');

            $('#chrome-flights-menu-packages').addClass('button-atrapalo--white-bg');
            $('#chrome-flights-menu-transports, #chrome-flights-menu-all').removeClass('button-atrapalo--white-bg');
            break;
        case 'transports':
            $('.chrome-flights__TRANSPORT').removeClass('hidden');
            $('.chrome-flights__PACKAGE').addClass('hidden');

            $('#chrome-flights-menu-transports').addClass('button-atrapalo--white-bg');
            $('#chrome-flights-menu-packages, #chrome-flights-menu-all').removeClass('button-atrapalo--white-bg');
            break;
        case 'all':
            $('.chrome-flights__TRANSPORT').removeClass('hidden');
            $('.chrome-flights__PACKAGE').removeClass('hidden');

            $('#chrome-flights-menu-all').addClass('button-atrapalo--white-bg');
            $('#chrome-flights-menu-packages, #chrome-flights-menu-transports').removeClass('button-atrapalo--white-bg');
            break;
        case 'provider':
            showBoxesByProvider();
            break;
    }
}

function showBoxesByProvider() {

    storage.get('showInfoActive').then(function (item) {
        if (item.showInfoActive === true) {
            storage.get('provider').then(function (element) {

                $('article[data-combination-id]').removeClass('hidden');

                if (element.provider !== '') {
                    $('article[data-combination-id]:not(.chrome-flights__' + element.provider + ')').addClass('hidden');
                }
            });
        }
    });
}

function initMenu() {
    //Reset menu
    $('#chrome-flights-menu').remove();

    $('header#header').append('<div id="chrome-flights-menu" class="hidden" style="position:fixed; top: 5px; left: 50%; transform: translateX(-50%); z-index:100">\n      <button style="height:25px; line-height: 0; margin:0" class="button-atrapalo" id="chrome-flights-menu-info">Info</button>\n      <button style="height:25px; line-height: 0; margin:0" class="button-atrapalo" id="chrome-flights-menu-packages">Packages</button>\n      <button style="height:25px; line-height: 0; margin:0" class="button-atrapalo" id="chrome-flights-menu-transports">Transports</button>\n      <button style="height:25px; line-height: 0; margin:0" class="button-atrapalo button-atrapalo--white-bg" id="chrome-flights-menu-all">All</button>\n  </div>');

    //Events
    $('header#header').off('dblclick').dblclick(function () {
        $('#chrome-flights-menu').toggleClass('hidden');
    });

    $('#chrome-flights-menu-info').click(function () {
        toggleInfo();
    });

    $('#chrome-flights-menu-packages').click(function () {
        showBoxesByType('packages');
    });

    $('#chrome-flights-menu-transports').click(function () {
        showBoxesByType('transports');
    });

    $('#chrome-flights-menu-all').click(function () {
        showBoxesByType('all');
    });
}

function copyToClipboard(element) {
    var $temp = $('<input>');
    $('body').append($temp);
    var text = $(element).text();
    $temp.val(text).select();
    document.execCommand('copy');
    $temp.remove();

    browser.runtime.sendMessage({ type: 'COPY', payload: text });
}

browser.runtime.onMessage.addListener(function (message) {
    switch (message.type) {
        case 'COMMAND':
            switch (message.payload) {
                case 'toggle-info':
                    toggleInfo();
                    break;
                case 'only-packages':
                    showBoxesByType('packages');
                    break;
                case 'only-transports':
                    showBoxesByType('transports');
                    break;
                case 'show-all':
                    showBoxesByType('all');
                    break;
                case 'show-provider':
                    showBoxesByType('provider');
                    break;
            }
    }
});

var s = document.createElement('script');
s.src = browser.extension.getURL('js/ajaxListener.js');
s.onload = function () {
    this.remove();
};

(document.head || document.documentElement).appendChild(s);

document.addEventListener('NEW_RESULTS', function (event) {
    var data = event.detail;

    data = new _DataTransformer2.default().transform(data);

    storage.set({ 'results': data }).then(function () {
        initMenu();

        storage.get('showInfoActive').then(function (item) {
            if (item.showInfoActive === true) {
                toggleInfo();
            }
        });

        storage.set({ 'provider': '' });
    });
});

/***/ }),
/* 3 */,
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TRANSPORT_TYPE = 'TRANSPORT';

var DataTransformer = function () {
    function DataTransformer() {
        _classCallCheck(this, DataTransformer);
    }

    _createClass(DataTransformer, [{
        key: 'transform',
        value: function transform(data) {
            var flightResults = function (combinations) {
                return combinations.reduce(function (prev, combination) {
                    var identity = combination.identity;
                    var type = combination.type === TRANSPORT_TYPE ? 'transports' : 'packages';
                    prev[identity] = {
                        type: combination.type,
                        uniqueProviders: {}
                    };

                    if (type === 'packages') {
                        combination[type].forEach(function (_package) {
                            var transports = _package.transports;
                            prev[identity].uniqueProviders[_package.provider] = true;

                            Object.keys(transports).forEach(function (key) {
                                transports[key].forEach(function (transport) {
                                    prev[identity][transport.id] = {
                                        provider: transport.provider,
                                        id: transport.id,
                                        package_identity: _package.identity,
                                        type: combination.type,
                                        plating_carrier: transport.plating_carrier,
                                        price_lines: transformPriceLines(_package.price_lines)
                                    };
                                });
                            });
                        });

                        prev[identity].uniqueProviders = Object.keys(prev[identity].uniqueProviders);

                        return prev;
                    }

                    Object.keys(combination[type]).forEach(function (key) {
                        combination[type][key].forEach(function (transport) {
                            prev[identity].uniqueProviders[transport.provider] = true;
                            prev[identity][transport.id] = {
                                provider: transport.provider,
                                id: transport.id,
                                type: combination.type,
                                plating_carrier: transport.plating_carrier,
                                price_lines: transformPriceLines(transport.price_lines)
                            };
                        });
                    });

                    prev[identity].uniqueProviders = Object.keys(prev[identity].uniqueProviders);

                    return prev;
                }, {});
            }(data.data.combinations);

            return _extends({}, data, { flightResults: flightResults });
        }
    }]);

    return DataTransformer;
}();

function reduceToUniquePriceLines(priceLines) {
    var uniqueLines = [];
    var tempLines = {};

    priceLines.forEach(function (priceLine) {
        var key = '' + priceLine.price.amount + priceLine.price.currency + priceLine.type + (priceLine.payment_method ? priceLine.payment_method : '');

        if (tempLines[key]) {
            tempLines[key] = _extends({}, priceLine, { quantity: tempLines[key].quantity += priceLine.quantity });
        } else {
            tempLines[key] = _extends({}, priceLine);
        }
    });

    Object.keys(tempLines).forEach(function (key) {
        uniqueLines.push(tempLines[key]);
    });

    return uniqueLines;
}

function transformPriceLines(priceLines) {
    var lines = {};

    reduceToUniquePriceLines(priceLines).forEach(function (line) {
        if (!lines[line.type]) {
            lines[line.type] = [];
        }

        lines[line.type].push(line.price.amount + '|' + line.price.currency + '|' + line.quantity + '|' + (line.payment_method ? line.payment_method : ''));
    });

    return lines;
}

exports.default = DataTransformer;

/***/ })
/******/ ]);