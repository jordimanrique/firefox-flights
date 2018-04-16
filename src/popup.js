const storage = browser.storage.local;
const manifest = browser.runtime.getManifest();
const version = manifest.version;

let infoActive = false;
let infoShown = false;

storage.get(['results', 'showInfoActive', 'infoShown']).then((items) => {

  const data = items.results.data;
  window.data = items.results;
  infoActive = items.showInfoActive;
  infoShown = items.infoShown;
  renderView(data, infoActive);
});


browser.storage.onChanged.addListener((changes) => {

  // TODO

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
  storage.set({'showInfoActive': active});
}

function renderView(data, active = false) {
  if (!data) {
    return;
  }

  $(document).ready(function () {
    const {view, total, version} = generateViewFromData(data, active);
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

  $('.badge').on('click', function(event) {

    if (infoShown) {
      let currentTarget = event.currentTarget;

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
  const {search_request: searchRequest, application_request: applicationRequest} = data;
  const status = searchRequest.status;
  const _links = searchRequest._links;
  const total = data.aggregations.search_stats;

  const transportsLinks = Object.keys(_links['transports']).reduce((prev, next) => {
    return `${prev} &nbsp; <a target="_blank" href="${_links['transports'][next].replace('http://', 'https://')}">${next}</a>`;
  }, '');

  const searchRequestData = createProperties([
    'identity',
    'created',
    'agent',
    'channel',
    'country_context',
    'currency',
    'ages',
    'resident',
    'large_family',
    'combined',
    'platform'
  ], searchRequest);

  const journeys = searchRequest.journeys.reduce((prev, journey) => {
    return `${prev}
            <tr><td>${journey.departure}-${journey.arrival}</td><td>${journey.date}</td></tr>
        `;
  }, '');

  const applicationRequestData = createProperties(
    Object.keys(applicationRequest)
    , applicationRequest);

  const statusBox = generateStatusBoxTable(status);

  const providerConfig = renderHorizontalTable([
    'provider',
    'oneway',
    'roundtrip',
    'resident',
    'largeFamily',
    'occupation'
  ], searchRequest.provider_configurations);

  const providerJourneyConfig = renderHorizontalTable([
    'provider',
    'journeys'
  ], searchRequest.provider_configurations);

  const help = Object.keys(manifest.commands).reduce((prev, commandKey) => {
    let command = manifest.commands[commandKey];

    return `${prev}
            <li class="list-group-item">${command.suggested_key.default} - ${command.description}</li>
    `;
  }, '');

  const requestInfo = renderHorizontalTable(
    Object.keys(searchRequest.type_request),
    searchRequest.type_request);

  let view = `<div class="row" style="color:#444;font-size:10px;">
                  <div class="col">
                      <nav class="nav nav-tabs" id="myTab" role="tablist">
                        <a class="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" href="#nav-home" role="tab" aria-controls="nav-home" aria-expanded="true">
                          Search
                        </a>
                        <a class="nav-item nav-link" id="nav-profile-tab" data-toggle="tab" href="#nav-profile" role="tab" aria-controls="nav-profile">
                          Request
                        </a>
                        <a class="nav-item nav-link" id="nav-config-tab" data-toggle="tab" href="#nav-config" role="tab" aria-controls="nav-config">
                          Config
                        </a>
                        <a class="nav-item nav-link" id="nav-help-tab" data-toggle="tab" href="#nav-help" role="tab" aria-controls="nav-help">
                          Help
                        </a>
                      </nav>
                      <div class="tab-content" id="nav-tabContent">
                        <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                          <table class="table table-hover table-sm">
                              ${searchRequestData}
                              <tr>
                                  <td class="font-weight-bold">journeys</td>
                                  <td>
                                      ${renderHorizontalTable(['departure', 'arrival', 'date'], searchRequest.journeys)}
                                  </td>
                              </tr>
                          </table>
                          <table class="table table-hover table-sm">
                              <tr>
                                  <td>${transportsLinks}</td>
                                  <td><a target="_blank" href="${_links['packages'].replace('http://', 'https://')}">Packages</a></td>
                                  <td><a target="_blank" href="${_links['combinations'].replace('http://', 'https://')}">Combinations</a></td>
                              </tr>
                          </table>
                          ${statusBox}
                          <div class="form-check">
                            <label class="form-check-label">
                              <input type="checkbox" id="show-info-active" class="form-check-input" ${ active === true ? 'checked' : ''}/>
                              Active info in results page
                            </label>
                          </div>
                        </div>
                        <div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
                          <table class="table table-hover table-sm">
                              ${applicationRequestData}
                           </table>
                        </div>
                        <div class="tab-pane fade" id="nav-config" role="tabpanel" aria-labelledby="nav-config-tab">
                            ${providerConfig}
                            ${providerJourneyConfig}
                            ${requestInfo}
                        </div>
                        <div class="tab-pane fade" id="nav-help" role="tabpanel" aria-labelledby="nav-help-tab">
                            <ul class="list-group">${help}</ul>
                        </div>
                      </div>
                  </div>
              </div>`;

  return {
    view,
    version,
    total
  };
}

function saveProvider(provider) {

  storage.set({'provider': provider}).then(() => {
      sendMessage({
        type: 'COMMAND',
        payload: 'show-provider'
      })
    });
}

function enableSelectedProvider() {

  storage.get('provider').then((element) => {
    if (element.provider !== '') {

      var providerList = $('.badge:not(.badge-secondary)');

      $.each(providerList, function(index, providerElement) {
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

  $.each(providerList, function(index, providerElement) {
    if (isInfo(providerElement)) {
      changeCurrentProviderClass(providerElement);
    }
  })
}

function sendMessage(message) {
  browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
    let lastTabId = tabs[0].id;
    if (lastTabId) {
      browser.tabs.sendMessage(lastTabId, message);
    }
  });
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

  const statusBox = Object.keys(status.provider_status).reduce((prev, next) => {
    const statusCode = status.provider_status[next].status;
    const label = getLabelFromStatusCode(statusCode);

    return `
            ${prev}
            <td><span class="badge badge-${label}" style="padding:5px; font-size:10px;">${next}</span></td>
        `;
  }, '');

  return `<table class="table table-sm"><tr>${statusBox}</tr></table>`;
}

function createProperties(properties, data) {
  return properties.reduce((prev, next) => {
    let content = data[next];

    if (Array.isArray(content)) {
      content = content.reduce((prev, next) => {
        return `${prev}
                            <code>${next}</code>`;
      }, '');
    }

    return `${prev}
                    <tr>
                        <td class="font-weight-bold">${next.replace(/_/g, ' ').toLowerCase()}</td>
                        <td>${content}</td>
                    </tr>`;
  }, '');
}

function renderHorizontalTable(properties, object) {
  const headers = properties.reduce((prevProperty, nextProperty) => {
    return `${prevProperty}
                <td class="font-weight-bold">${nextProperty.replace(/_/g, ' ').toLowerCase()}</td>`;
  }, '');

  if (!Array.isArray(object)) {
    object = [object];
  }

  let rows = object.reduce((prevObject, nextObject) => {
    let values = properties.reduce((prevProperty, nextProperty) => {

      let content = nextObject[nextProperty];

      if (Array.isArray(content)) {
        content = content.reduce((prev, next) => {
          return `${prev} <code>${next}</code>`;
        }, '');
      }

      return `${prevProperty}
              <td>${content}</td>`;
    }, '');

    return `${prevObject}
                <tr>${values}</tr>`;
  }, '');

  return `<table class="table table-hover table-sm">
            <thead>
                ${headers}
            </thead>
            <tbody>
                ${rows}
            </tbody>
            </table>`;
}