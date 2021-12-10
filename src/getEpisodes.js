import camelCase from 'camelcase';
import Papa from 'papaparse';

import {multiValueFields} from './constants';

export const getEpisodes = async () => {
    const dynamicTyping = (header) => header === 'number';

    const transform = (value, header) => {
        if (!multiValueFields.includes(header)) {
            return value
        }

        if (!value) {
            return []
        }

        return value.split(', ')
    };

    const transformHeader = header => camelCase(header);

    return await fetch('/data/doctor-who-new-series.csv')
        .then(csvFile => {
            const reader = csvFile.body.getReader();
            return reader.read()
        }).then(result => {
            const decoder = new TextDecoder('utf-8');
            const data = decoder.decode(result.value);

            return Papa.parse(data, {
                dynamicTyping,
                header: true,
                transform,
                transformHeader,
            })
        }).then(result => {
            const {data, errors} = result;

            if (errors.length) {
                throw errors[0]
            }

            return data;
        });
}