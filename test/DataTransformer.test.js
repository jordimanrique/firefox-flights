import DataTransformer from './../src/DataTransformer';

test('transform data transport', () => {
    let data = {
        data: {
            combinations: [{
                identity: 'combinationIdA',
                type: 'TRANSPORT',
                transports: {
                    'BCN|MAD': [
                        {
                            id: 'ES_1',
                            plating_carrier: 'IB',
                            provider: 'GALILEO',
                            price_lines: [{
                                price: {
                                    amount: '10',
                                    currency: 'EUR'
                                },
                                quantity: 1,
                                type: 'TICKET_BASE_PRICE_ADULT'
                            },
                            {
                                price: {
                                    amount: '11.34',
                                    currency: 'EUR'
                                },
                                quantity: 1,
                                type: 'SERVICE_FEE',
                                payment_method: 'MASTERCARD_CREDIT'
                            },
                            {
                                price: {
                                    amount: '12.34',
                                    currency: 'EUR'
                                },
                                quantity: 1,
                                type: 'SERVICE_FEE',
                                payment_method: 'MASTERCARD_DEBIT'
                            },
                            {
                                price: {
                                    amount: '12.34',
                                    currency: 'EUR'
                                },
                                quantity: 1,
                                type: 'SERVICE_FEE',
                                payment_method: 'MASTERCARD_DEBIT'
                            },
                            {
                                price: {
                                    amount: '12.35',
                                    currency: 'EUR'
                                },
                                quantity: 1,
                                type: 'SERVICE_FEE',
                                payment_method: 'MASTERCARD_DEBIT'
                            }]
                        },
                        {
                            id: 'ES_2',
                            plating_carrier: 'VY',
                            provider: 'VUELING',
                            price_lines: [{
                                price: {
                                    amount: '10',
                                    currency: 'EUR'
                                },
                                quantity: 1,
                                type: 'TICKET_BASE_PRICE_ADULT'
                            },
                            {
                                price: {
                                    amount: '11.34',
                                    currency: 'EUR'
                                },
                                quantity: 1,
                                type: 'SERVICE_FEE',
                                payment_method: 'MASTERCARD_CREDIT'
                            },
                            {
                                price: {
                                    amount: '12.34',
                                    currency: 'EUR'
                                },
                                quantity: 1,
                                type: 'SERVICE_FEE',
                                payment_method: 'MASTERCARD_DEBIT'
                            },
                            {
                                price: {
                                    amount: '12.34',
                                    currency: 'EUR'
                                },
                                quantity: 1,
                                type: 'SERVICE_FEE',
                                payment_method: 'MASTERCARD_DEBIT'
                            },
                            {
                                price: {
                                    amount: '12.35',
                                    currency: 'EUR'
                                },
                                quantity: 1,
                                type: 'SERVICE_FEE',
                                payment_method: 'MASTERCARD_DEBIT'
                            }]
                        }
                    ]
                }
            }]
        }
    };

    let expected = {
        combinationIdA: {
            ES_1: {
                id: 'ES_1',
                plating_carrier: 'IB',
                provider: 'GALILEO',
                type: 'TRANSPORT',
                price_lines: {
                    TICKET_BASE_PRICE_ADULT: [
                        '10|EUR|1|'
                    ],
                    SERVICE_FEE: [
                        '11.34|EUR|1|MASTERCARD_CREDIT',
                        '12.34|EUR|2|MASTERCARD_DEBIT',
                        '12.35|EUR|1|MASTERCARD_DEBIT'
                    ]
                }
            },
            ES_2: {
                id: 'ES_2',
                plating_carrier: 'VY',
                provider: 'VUELING',
                type: 'TRANSPORT',
                price_lines: {
                    TICKET_BASE_PRICE_ADULT: [
                        '10|EUR|1|'
                    ],
                    SERVICE_FEE: [
                        '11.34|EUR|1|MASTERCARD_CREDIT',
                        '12.34|EUR|2|MASTERCARD_DEBIT',
                        '12.35|EUR|1|MASTERCARD_DEBIT'
                    ]
                }
            },
            type: 'TRANSPORT',
            uniqueProviders: [
                'GALILEO', 'VUELING'
            ]
        }
    };

    expect((new DataTransformer()).transform(data).flightResults)
        .toEqual(expected);
});

test('transform data package', () => {
    let data = {
        data: {
            combinations: [{
                identity: 'combinationIdA',
                type: 'PACKAGE',
                packages: [
                    {
                        identity: 'PACKAGE_ID1',
                        price_lines: [
                            {
                                price: {
                                    amount: '10',
                                    currency: 'EUR'
                                },
                                quantity: 1,
                                type: 'TICKET_BASE_PRICE_ADULT'
                            },
                            {
                                price: {
                                    amount: '11.34',
                                    currency: 'EUR'
                                },
                                quantity: 1,
                                type: 'SERVICE_FEE',
                                payment_method: 'MASTERCARD_CREDIT'
                            },
                            {
                                price: {
                                    amount: '12.34',
                                    currency: 'EUR'
                                },
                                quantity: 1,
                                type: 'SERVICE_FEE',
                                payment_method: 'MASTERCARD_DEBIT'
                            },
                            {
                                price: {
                                    amount: '12.34',
                                    currency: 'EUR'
                                },
                                quantity: 1,
                                type: 'SERVICE_FEE',
                                payment_method: 'MASTERCARD_DEBIT'
                            },
                            {
                                price: {
                                    amount: '12.35',
                                    currency: 'EUR'
                                },
                                quantity: 1,
                                type: 'SERVICE_FEE',
                                payment_method: 'MASTERCARD_DEBIT'
                            }],
                        transports: {
                            'BCN|MAD': [
                                {
                                    id: 'TRANSPORT_ID_1',
                                    plating_carrier: 'IB',
                                    provider: 'GALILEO'
                                }
                            ],
                            'MAD|BCN': [
                                {
                                    id: 'TRANSPORT_ID_2',
                                    plating_carrier: 'IB',
                                    provider: 'GALILEO'
                                }
                            ]
                        },
                        provider: 'GALILEO'
                    },
                    {
                        identity: 'PACKAGE_ID2',
                        price_lines: [
                            {
                                price: {
                                    amount: '10',
                                    currency: 'EUR'
                                },
                                quantity: 1,
                                type: 'TICKET_BASE_PRICE_ADULT'
                            },
                            {
                                price: {
                                    amount: '11.34',
                                    currency: 'EUR'
                                },
                                quantity: 1,
                                type: 'SERVICE_FEE',
                                payment_method: 'MASTERCARD_CREDIT'
                            },
                            {
                                price: {
                                    amount: '12.34',
                                    currency: 'EUR'
                                },
                                quantity: 1,
                                type: 'SERVICE_FEE',
                                payment_method: 'MASTERCARD_DEBIT'
                            },
                            {
                                price: {
                                    amount: '12.34',
                                    currency: 'EUR'
                                },
                                quantity: 1,
                                type: 'SERVICE_FEE',
                                payment_method: 'MASTERCARD_DEBIT'
                            },
                            {
                                price: {
                                    amount: '12.35',
                                    currency: 'EUR'
                                },
                                quantity: 1,
                                type: 'SERVICE_FEE',
                                payment_method: 'MASTERCARD_DEBIT'
                            },
                            {
                                price: {
                                    amount: '12.35',
                                    currency: 'EUR'
                                },
                                quantity: 1,
                                type: 'SERVICE_FEE',
                                payment_method: 'MASTERCARD_DEBIT'
                            }],
                        transports: {
                            'BCN|MAD': [
                                {
                                    id: 'TRANSPORT_ID_3',
                                    plating_carrier: 'IB',
                                    provider: 'GALILEO'
                                }
                            ],
                            'MAD|BCN': [
                                {
                                    id: 'TRANSPORT_ID_4',
                                    plating_carrier: 'IB',
                                    provider: 'GALILEO'
                                }
                            ]
                        },
                        provider: 'GALILEO'
                    }
                ],
            }]
        }
    };

    let expected = {
        combinationIdA: {
            TRANSPORT_ID_2: {
                id: 'TRANSPORT_ID_2',
                package_identity: 'PACKAGE_ID1',
                plating_carrier: 'IB',
                provider: 'GALILEO',
                type: 'PACKAGE',
                price_lines: {
                    TICKET_BASE_PRICE_ADULT: [
                        '10|EUR|1|'
                    ],
                    SERVICE_FEE: [
                        '11.34|EUR|1|MASTERCARD_CREDIT',
                        '12.34|EUR|2|MASTERCARD_DEBIT',
                        '12.35|EUR|1|MASTERCARD_DEBIT'
                    ]
                }
            },
            TRANSPORT_ID_1: {
                id: 'TRANSPORT_ID_1',
                package_identity: 'PACKAGE_ID1',
                plating_carrier: 'IB',
                provider: 'GALILEO',
                type: 'PACKAGE',
                price_lines: {
                    TICKET_BASE_PRICE_ADULT: [
                        '10|EUR|1|'
                    ],
                    SERVICE_FEE: [
                        '11.34|EUR|1|MASTERCARD_CREDIT',
                        '12.34|EUR|2|MASTERCARD_DEBIT',
                        '12.35|EUR|1|MASTERCARD_DEBIT'
                    ]
                }
            },
            TRANSPORT_ID_3: {
                id: 'TRANSPORT_ID_3',
                package_identity: 'PACKAGE_ID2',
                plating_carrier: 'IB',
                provider: 'GALILEO',
                type: 'PACKAGE',
                price_lines: {
                    TICKET_BASE_PRICE_ADULT: [
                        '10|EUR|1|'
                    ],
                    SERVICE_FEE: [
                        '11.34|EUR|1|MASTERCARD_CREDIT',
                        '12.34|EUR|2|MASTERCARD_DEBIT',
                        '12.35|EUR|2|MASTERCARD_DEBIT'
                    ]
                }
            },
            TRANSPORT_ID_4: {
                id: 'TRANSPORT_ID_4',
                package_identity: 'PACKAGE_ID2',
                plating_carrier: 'IB',
                provider: 'GALILEO',
                type: 'PACKAGE',
                price_lines: {
                    TICKET_BASE_PRICE_ADULT: [
                        '10|EUR|1|'
                    ],
                    SERVICE_FEE: [
                        '11.34|EUR|1|MASTERCARD_CREDIT',
                        '12.34|EUR|2|MASTERCARD_DEBIT',
                        '12.35|EUR|2|MASTERCARD_DEBIT'
                    ]
                }
            },
            type: 'PACKAGE',
            uniqueProviders: [
                'GALILEO'
            ]
        }
    };

    expect((new DataTransformer()).transform(data).flightResults)
        .toEqual(expected);
});