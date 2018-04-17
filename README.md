# firefox-flights

## Development

Initialize project

    npm install

Watch mode for webpack

    npm run build:watch
    yarn build:watch
    
Create dist files

    npm run build
    yarn build
    
Testing
    
    yarn test
    yarn test:watch
    
# Installation


In order to build the package you need to have installed web-ext:

    npm install --global web-ext

Once you have this package, you will be able to run the WebExtension easily:

    web-ext run -s dist

For any further information about web-ext, read [documentation](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/web-ext_command_reference)


In the case you need to build a new packed version of the WebExtension, you only need to build it:

    web-ext build -s dist

On the other hand, if you want to build a signed package, you need to have an active user in [firefox developers site](https://addons.mozilla.org/es/developers/).
For this add-on it has been used the user jordi.manrique@atrapalo.com with its API credentials. Then, you only has to execute the order:

    web-ext sign -s dist --api-key=user:13883156:919 --api-secret=5235ca3fe1ccdc0d3d8032d64a3376d583030a3bf07b118c5b23bd72519de117
    
    
The packages built are in web-ext-artifacts folder:

    - Regular build: atrapalo_flights-version.zip
    - Signed build:  atrapalo_flights-version.xpi
