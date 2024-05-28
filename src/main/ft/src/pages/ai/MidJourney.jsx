import React, { useState } from 'react';
import axios from 'axios';

const MidJourney = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleClick = () => {
    const config = {
      method: 'post',
      url: 'https://api.mymidjourney.ai/api/v1/midjourney/imagine',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer <your-token>',
      },
      data: {
        prompt: `${imageUrl} ${prompt}`,
      },
    };

    axios(config)
      .then((response) => {
        setResponse(response.data);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Enter image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Enter prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>
      <button onClick={handleClick}>Generate Image</button>
      {response && <div>Response: {JSON.stringify(response)}</div>}
      {error && <div>Error: {error}</div>}
    </div>
  );
};

export default MidJourney;
