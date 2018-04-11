// const URL_RULE_PATH = '/vuelos/resultados_ajax';
// const NOTIFICATION_ID = 'atrapalo-flights-';
//
// chrome.runtime.onInstalled.addListener(() => {
//     chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
//         chrome.declarativeContent.onPageChanged.addRules([
//             {
//                 conditions: [
//                     new chrome.declarativeContent.PageStateMatcher({
//                         pageUrl: {urlContains: URL_RULE_PATH},
//                     })
//                 ],
//                 actions: [new chrome.declarativeContent.ShowPageAction()]
//             }
//         ]);
//     });
// });
//
// chrome.commands.onCommand.addListener((command) => {
//     sendMessage({
//         type: 'COMMAND',
//         payload: command
//     });
// });
//
// function sendMessage(message) {
//     chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
//         let lastTabId = tabs[0].id;
//         if (lastTabId) {
//             chrome.tabs.sendMessage(lastTabId, message);
//         }
//     });
// }
//
// function sendNotification(type, message) {
//     chrome.notifications.create(
//         NOTIFICATION_ID + type,
//         {
//             type: 'basic',
//             title: 'Atrapalo Flights',
//             message: message,
//             iconUrl: 'icons/aeroplane_128.png'
//         }
//     );
// }
//
// function clearNotification(type, time = 2000) {
//     setTimeout(() => {
//         chrome.notifications.clear(NOTIFICATION_ID + type);
//     }, time);
// }
//
// chrome.runtime.onMessage.addListener((message) => {
//     switch (message.type) {
//     case 'COPY':
//         sendNotification('copy', message.payload + ' copied');
//         clearNotification('copy');
//         break;
//     }
// });
