export declare const json: ({
    'tfOpName': string;
    'dlOpName': string;
    'category': string;
    'params': ({
        'tfInputIndex': number;
        'dlParamName': string;
        'type': string;
        tfParamName?: undefined;
    } | {
        'tfParamName': string;
        'dlParamName': string;
        'type': string;
        tfInputIndex?: undefined;
    })[];
} | {
    'tfOpName': string;
    'dlOpName': string;
    'category': string;
    'params': ({
        'tfInputIndex': number;
        'dlParamName': string;
        'type': string;
        tfParamName?: undefined;
        notSupported?: undefined;
        defaultValue?: undefined;
    } | {
        'tfParamName': string;
        'dlParamName': string;
        'type': string;
        'notSupported': boolean;
        tfInputIndex?: undefined;
        defaultValue?: undefined;
    } | {
        'dlParamName': string;
        'type': string;
        'defaultValue': number;
        tfInputIndex?: undefined;
        tfParamName?: undefined;
        notSupported?: undefined;
    })[];
} | {
    'tfOpName': string;
    'dlOpName': string;
    'category': string;
    'params': ({
        'tfInputIndex': number;
        'dlParamName': string;
        'type': string;
        tfParamName?: undefined;
        defaultValue?: undefined;
        notSupported?: undefined;
    } | {
        'tfParamName': string;
        'dlParamName': string;
        'type': string;
        'defaultValue': number;
        tfInputIndex?: undefined;
        notSupported?: undefined;
    } | {
        'tfParamName': string;
        'dlParamName': string;
        'type': string;
        'notSupported': boolean;
        tfInputIndex?: undefined;
        defaultValue?: undefined;
    })[];
})[];
