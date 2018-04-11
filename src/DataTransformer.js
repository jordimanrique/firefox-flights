const TRANSPORT_TYPE = 'TRANSPORT';

class DataTransformer {
    transform(data) {
        let flightResults = ((combinations) => {
            return combinations.reduce((prev, combination) => {
                const identity = combination.identity;
                const type = combination.type === TRANSPORT_TYPE ? 'transports' : 'packages';
                prev[identity] = {
                    type: combination.type,
                    uniqueProviders: {}
                };

                if (type === 'packages') {
                    combination[type].forEach((_package) => {
                        let transports = _package.transports;
                        prev[identity].uniqueProviders[_package.provider] = true;

                        Object.keys(transports).forEach((key) => {
                            transports[key].forEach((transport) => {
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

                Object.keys(combination[type]).forEach((key) => {
                    combination[type][key].forEach((transport) => {
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
        })(data.data.combinations);

        return {...data, flightResults};
    }
}

function reduceToUniquePriceLines(priceLines) {
    let uniqueLines = [];
    let tempLines = {};

    priceLines.forEach((priceLine) => {
        let key = `${priceLine.price.amount}${priceLine.price.currency}${priceLine.type}${priceLine.payment_method ? priceLine.payment_method : ''}`;

        if (tempLines[key]) {
            tempLines[key] = {...priceLine, quantity: tempLines[key].quantity += priceLine.quantity};
        } else {
            tempLines[key] = {...priceLine};
        }
    });

    Object.keys(tempLines).forEach((key) => {
        uniqueLines.push(tempLines[key]);
    });

    return uniqueLines;
}

function transformPriceLines(priceLines) {
    let lines = {};

    reduceToUniquePriceLines(priceLines).forEach((line) => {
        if (!lines[line.type]) {
            lines[line.type] = [];
        }

        lines[line.type].push(`${line.price.amount}|${line.price.currency}|${line.quantity}|${line.payment_method ? line.payment_method : ''}`);
    });

    return lines;
}

export default DataTransformer;