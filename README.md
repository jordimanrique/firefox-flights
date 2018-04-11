# chrome-flights

## API
    https://developer.chrome.com/extensions/api_index

## Examples
    https://chromium.googlesource.com/chromium/src/+/master/chrome/common/extensions/docs/examples
    
## Development

Watch mode for webpack

    npm run build:watch
    yarn build:watch
    
Create dist files

    npm run build
    yarn build
    
Testing
    
    yarn test
    yarn test:watch
    
## Install the extension

- Visit [chrome://extensions](chrome://extensions) in your browser
- [Remove previous version if exists]
- Ensure that the _Developer mode_ checkbox in the top right-hand corner is checked.
- Click Load unpacked extension? to pop up a file-selection dialog.
- Navigate to the directory in which your extension files live, and select it.
