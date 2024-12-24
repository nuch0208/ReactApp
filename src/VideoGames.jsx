import React, { useState, useEffect } from 'react';
import axios from 'axios';

function VideoGames() {
    const [videoGames, setVideoGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch video games data from API when the component is mounted
    useEffect(() => {
        axios.get('http://localhost:5000/api/VideoGame') // Adjust URL based on your API URL
            .then((response) => {
                setVideoGames(response.data); // Set the video games data in the state
                setLoading(false); // Set loading to false after data is fetched
            })
            .catch((err) => {
                setError(err.message); // If there is an error, store the error message
                setLoading(false); // Set loading to false
            });
    }, []); // Empty dependency array means this effect runs once when the component mounts

    // Render the UI
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Video Games List</h1>
            <ul>
                {videoGames.map((game) => (
                    <li key={game.id}>
                        <strong>{game.title}</strong> - {game.platform} <br />
                        Developer: {game.developer} <br />
                        Publisher: {game.publisher}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default VideoGames;