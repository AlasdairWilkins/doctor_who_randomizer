import {DefaultDict} from 'pycollections';

import {multiValueFields} from './constants';

export const transformEpisodes = (episodes) => {
    const episodeDict = new DefaultDict([].constructor)
    const storyNumbers = new Set();
    const multiPartStoryNumbers = new Set();

    for (const episode of episodes) {
        const {number} = episode;

        if (typeof number === 'number') {
            episodeDict.get(number).push(episode)
            storyNumbers.add(number);
        } else {
            const multiPartStoryNumber = parseInt(
                number.split('').filter(digit => !isNaN(digit)).join('')
            );
            episodeDict.get(multiPartStoryNumber).push(episode)
            multiPartStoryNumbers.add(multiPartStoryNumber)
            storyNumbers.add(multiPartStoryNumber);
        }
    }

    return Array.from(storyNumbers).map(storyNumber => {
        if (!multiPartStoryNumbers.has(storyNumber)) {
            return {
                ...episodeDict.get(storyNumber)[0],
                title: `"${episodeDict.get(storyNumber)[0].title}"`
            }
        }

        const multiPartStoryEpisodes = episodeDict.get(storyNumber);

        return {
            ...multiPartStoryEpisodes[0],
            ...Object.fromEntries(multiValueFields.map(field =>
                [
                    field,
                    Array.from(
                        new Set([].concat(...multiPartStoryEpisodes.map(episode => episode[field])))
                    ),
                ])
            ),
            number: storyNumber,
            title: multiPartStoryEpisodes.map(episode => `"${episode.title}"`).join('/')
        };
    })
}