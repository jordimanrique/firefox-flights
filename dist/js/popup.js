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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var storage = browser.storage.local;
var manifest = browser.runtime.getManifest();
var version = manifest.version;

var infoActive = false;
var infoShown = false;

storage.get(['results', 'showInfoActive', 'infoShown']).then(function (items) {

  var data = items.results.data;
  window.data = items.results;
  infoActive = items.showInfoActive;
  infoShown = items.infoShown;
  renderView(data, infoActive);
});

browser.storage.onChanged.addListener(function (changes) {

  debugger;
  // if (changes.showInfoActive) {
  //   infoActive = changes.showInfoActive.newValue;
  // }
  //
  // if (changes.results) {
  //   const data = changes.results.newValue.data;
  //   window.data = changes.results.newValue;
  //   renderView(data, infoActive);
  // }
  //
  // if (changes.infoShown) {
  //   infoShown = changes.infoShown.newValue;
  // }
});

/*
 VIEWS
 */

function showInfoActive(active) {
  storage.set({ 'showInfoActive': active });
}

function renderView(data) {
  var active = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (!data) {
    return;
  }

  $(document).ready(function () {
    var _generateViewFromData = generateViewFromData(data, active),
        view = _generateViewFromData.view,
        total = _generateViewFromData.total,
        version = _generateViewFromData.version;

    $('#container').html(view);
    $('#total').html(total);
    $('#version').html(version);

    //Prevent chrome bug on resize popup
    setTimeout(function () {
      $('#container').css("border", "solid 1px transparent");
    }, 100);

    $('#show-info-active').change(function () {
      showInfoActive($(this).is(":checked"));
    });

    enableSelectedProvider();

    initEvents();
  });
}

function initEvents() {

  $('.badge').on('click', function (event) {

    if (infoShown) {
      var currentTarget = event.currentTarget;

      if (isSuccess(currentTarget)) {
        saveProvider(currentTarget.innerHTML);
        changeToSuccessAllProviders();
        changeCurrentProviderClass(currentTarget);
      } else if (isInfo(currentTarget)) {
        saveProvider('');
        changeCurrentProviderClass(currentTarget);
      }
    }
  });
}

function isSuccess(element) {
  return element.classList.contains('badge-success');
}

function isInfo(element) {
  return element.classList.contains('badge-info');
}

function generateViewFromData(data, active) {
  var searchRequest = data.search_request,
      applicationRequest = data.application_request;

  var status = searchRequest.status;
  var _links = searchRequest._links;
  var total = data.aggregations.search_stats;

  var transportsLinks = Object.keys(_links['transports']).reduce(function (prev, next) {
    return prev + ' &nbsp; <a target="_blank" href="' + _links['transports'][next].replace('http://', 'https://') + '">' + next + '</a>';
  }, '');

  var searchRequestData = createProperties(['identity', 'created', 'agent', 'channel', 'country_context', 'currency', 'ages', 'resident', 'large_family', 'combined', 'platform'], searchRequest);

  var journeys = searchRequest.journeys.reduce(function (prev, journey) {
    return prev + '\n            <tr><td>' + journey.departure + '-' + journey.arrival + '</td><td>' + journey.date + '</td></tr>\n        ';
  }, '');

  var applicationRequestData = createProperties(Object.keys(applicationRequest), applicationRequest);

  var statusBox = generateStatusBoxTable(status);

  var providerConfig = renderHorizontalTable(['provider', 'oneway', 'roundtrip', 'resident', 'largeFamily', 'occupation'], searchRequest.provider_configurations);

  var providerJourneyConfig = renderHorizontalTable(['provider', 'journeys'], searchRequest.provider_configurations);

  var help = Object.keys(manifest.commands).reduce(function (prev, commandKey) {
    var command = manifest.commands[commandKey];

    return prev + '\n            <li class="list-group-item">' + command.suggested_key.default + ' - ' + command.description + '</li>\n    ';
  }, '');

  var requestInfo = renderHorizontalTable(Object.keys(searchRequest.type_request), searchRequest.type_request);

  var view = '<div class="row" style="color:#444;font-size:10px;">\n                  <div class="col">\n                      <nav class="nav nav-tabs" id="myTab" role="tablist">\n                        <a class="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" href="#nav-home" role="tab" aria-controls="nav-home" aria-expanded="true">\n                          Search\n                        </a>\n                        <a class="nav-item nav-link" id="nav-profile-tab" data-toggle="tab" href="#nav-profile" role="tab" aria-controls="nav-profile">\n                          Request\n                        </a>\n                        <a class="nav-item nav-link" id="nav-config-tab" data-toggle="tab" href="#nav-config" role="tab" aria-controls="nav-config">\n                          Config\n                        </a>\n                        <a class="nav-item nav-link" id="nav-help-tab" data-toggle="tab" href="#nav-help" role="tab" aria-controls="nav-help">\n                          Help\n                        </a>\n                      </nav>\n                      <div class="tab-content" id="nav-tabContent">\n                        <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">\n                          <table class="table table-hover table-sm">\n                              ' + searchRequestData + '\n                              <tr>\n                                  <td class="font-weight-bold">journeys</td>\n                                  <td>\n                                      ' + renderHorizontalTable(['departure', 'arrival', 'date'], searchRequest.journeys) + '\n                                  </td>\n                              </tr>\n                          </table>\n                          <table class="table table-hover table-sm">\n                              <tr>\n                                  <td>' + transportsLinks + '</td>\n                                  <td><a target="_blank" href="' + _links['packages'].replace('http://', 'https://') + '">Packages</a></td>\n                                  <td><a target="_blank" href="' + _links['combinations'].replace('http://', 'https://') + '">Combinations</a></td>\n                              </tr>\n                          </table>\n                          ' + statusBox + '\n                          <div class="form-check">\n                            <label class="form-check-label">\n                              <input type="checkbox" id="show-info-active" class="form-check-input" ' + (active === true ? 'checked' : '') + '/>\n                              Active info in results page\n                            </label>\n                          </div>\n                        </div>\n                        <div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">\n                          <table class="table table-hover table-sm">\n                              ' + applicationRequestData + '\n                           </table>\n                        </div>\n                        <div class="tab-pane fade" id="nav-config" role="tabpanel" aria-labelledby="nav-config-tab">\n                            ' + providerConfig + '\n                            ' + providerJourneyConfig + '\n                            ' + requestInfo + '\n                        </div>\n                        <div class="tab-pane fade" id="nav-help" role="tabpanel" aria-labelledby="nav-help-tab">\n                            <ul class="list-group">' + help + '</ul>\n                        </div>\n                      </div>\n                  </div>\n              </div>';

  return {
    view: view,
    version: version,
    total: total
  };
}

function saveProvider(provider) {

  storage.set({ 'provider': provider }).then(function () {
    sendMessage({
      type: 'COMMAND',
      payload: 'show-provider'
    });
  });
}

function enableSelectedProvider() {

  storage.get('provider').then(function (element) {
    if (element.provider !== '') {

      var providerList = $('.badge:not(.badge-secondary)');

      $.each(providerList, function (index, providerElement) {
        if (providerElement.innerHTML === element.provider) {
          changeCurrentProviderClass(providerElement);
        }
      });
    }
  });
}

function changeCurrentProviderClass(providerElement) {

  providerElement.classList.toggle('badge-info');
  providerElement.classList.toggle('badge-success');
}

function changeToSuccessAllProviders() {

  var providerList = $('.badge:not(.badge-secondary)');

  $.each(providerList, function (index, providerElement) {
    if (isInfo(providerElement)) {
      changeCurrentProviderClass(providerElement);
    }
  });
}

function sendMessage(message) {

  alert('send message!!');

  // chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
  //   let lastTabId = tabs[0].id;
  //   if (lastTabId) {
  //     chrome.tabs.sendMessage(lastTabId, message);
  //   }
  // });
}

function generateStatusBoxTable(status) {

  function getLabelFromStatusCode(statusCode) {
    switch (statusCode) {
      case 'COMPLETED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'ERROR':
        return 'danger';
    }
  }

  var statusBox = Object.keys(status.provider_status).reduce(function (prev, next) {
    var statusCode = status.provider_status[next].status;
    var label = getLabelFromStatusCode(statusCode);

    return '\n            ' + prev + '\n            <td><span class="badge badge-' + label + '" style="padding:5px; font-size:10px;">' + next + '</span></td>\n        ';
  }, '');

  return '<table class="table table-sm"><tr>' + statusBox + '</tr></table>';
}

function createProperties(properties, data) {
  return properties.reduce(function (prev, next) {
    var content = data[next];

    if (Array.isArray(content)) {
      content = content.reduce(function (prev, next) {
        return prev + '\n                            <code>' + next + '</code>';
      }, '');
    }

    return prev + '\n                    <tr>\n                        <td class="font-weight-bold">' + next.replace(/_/g, ' ').toLowerCase() + '</td>\n                        <td>' + content + '</td>\n                    </tr>';
  }, '');
}

function renderHorizontalTable(properties, object) {
  var headers = properties.reduce(function (prevProperty, nextProperty) {
    return prevProperty + '\n                <td class="font-weight-bold">' + nextProperty.replace(/_/g, ' ').toLowerCase() + '</td>';
  }, '');

  if (!Array.isArray(object)) {
    object = [object];
  }

  var rows = object.reduce(function (prevObject, nextObject) {
    var values = properties.reduce(function (prevProperty, nextProperty) {

      var content = nextObject[nextProperty];

      if (Array.isArray(content)) {
        content = content.reduce(function (prev, next) {
          return prev + ' <code>' + next + '</code>';
        }, '');
      }

      return prevProperty + '\n              <td>' + content + '</td>';
    }, '');

    return prevObject + '\n                <tr>' + values + '</tr>';
  }, '');

  return '<table class="table table-hover table-sm">\n            <thead>\n                ' + headers + '\n            </thead>\n            <tbody>\n                ' + rows + '\n            </tbody>\n            </table>';
}

/***/ })
/******/ ]);