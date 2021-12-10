import React, {useCallback, useEffect, useState} from 'react';

import './App.css';

import {getEpisodes} from './getEpisodes';
import {transformEpisodes} from './transformEpisodes';

function App() {
  const [episodes, setEpisodes] = useState(null);
  const [selectedEpisode, setSelectedEpisode] = useState(null);

  useEffect(() => {
    getEpisodes().then(episodes => {
      setEpisodes(transformEpisodes(episodes));
    });
  }, []);

  const onClickHandler = useCallback(() => {
    if (!episodes) {
      return null
    }
    const episodeNumber = Math.floor(Math.random() * episodes.length)
    setSelectedEpisode(episodes[episodeNumber])
  }, [episodes])

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Welcome to the Doctor Who Randomizer!
        </p>
        <button onClick={onClickHandler}>
          Randomize!
        </button>
        {
          selectedEpisode && (<p>The Randomizer has selected {selectedEpisode.title} -- enjoy!</p>)
        }
      </header>
    </div>
  );
}

export default App;
