import camelCase from 'camelcase';
import Papa from 'papaparse';

export const getEpisodes = async () => {
      return await fetch('/data/doctor-who-new-series.csv')
        .then(csvFile => {
            const reader = csvFile.body.getReader();
            return reader.read()
        }).then(result => {
            const decoder = new TextDecoder('utf-8');
            const data = decoder.decode(result.value);

            return Papa.parse(data, {
                header: true,
                transformHeader: header => camelCase(header),
            })
        });
}