import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState([]);  // Store video games data
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);  // Error handling
  const [newGame, setNewGame] = useState({
    title: '',
    platform: '',
    developer: '',
    publisher: ''
  });  // State for new game form
  const [isEditing, setIsEditing] = useState(false);  // To track if we are editing
  const [editingGameId, setEditingGameId] = useState(null);  // Store the ID of the game being edited

  // Fetch video games data when the component mounts
  useEffect(() => {
    axios.get('http://localhost:5156/api/VideoGame')
      .then(res => {
        setData(res.data);  // Assuming the API directly returns an array of video games
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch data');
        setLoading(false);
        console.log(err);
      });
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewGame({
      ...newGame,
      [name]: value
    });
  };

  // Handle form submission (POST request)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      // PUT request to update the game
      axios.put(`http://localhost:5156/api/VideoGame/${editingGameId}`, newGame)
        .then((res) => {
          // Update the data in the state to reflect the edited game
          setData(data.map(game => game.id === editingGameId ? res.data : game));
          resetForm();  // Reset the form and editing state
        })
        .catch((err) => {
          console.log(err);
          setError('Failed to edit game');
        });
    } else {
      // POST request to add a new game
      axios.post('http://localhost:5156/api/VideoGame', newGame)
        .then((res) => {
          setData([...data, res.data]);  // Add the new game to the data array
          resetForm();  // Reset the form after submitting
        })
        .catch((err) => {
          console.log(err);
          setError('Failed to add new game');
        });
    }
  };

  // Reset form fields
  const resetForm = () => {
    setNewGame({
      title: '',
      platform: '',
      developer: '',
      publisher: ''
    });
    setIsEditing(false);
    setEditingGameId(null);
  };

  // Handle delete request (DELETE request)
  const handleDelete = (id) => {
    axios.delete(`http://localhost:5156/api/VideoGame/${id}`)
      .then(() => {
        // Remove the deleted game from the state
        setData(data.filter(game => game.id !== id));
      })
      .catch((err) => {
        console.log(err);
        setError('Failed to delete game');
      });
  };

  // Handle edit request (populate form with the current game details)
  const handleEdit = (game) => {
    setNewGame({
      title: game.title,
      platform: game.platform,
      developer: game.developer,
      publisher: game.publisher
    });
    setIsEditing(true);
    setEditingGameId(game.id);
  };

  return (
    <div>
      <h2>Video Games List</h2>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {/* Table to display video games */}
      <table border="1" cellPadding="10" style={{ marginTop: '20px', width: '100%' }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Platform</th>
            <th>Developer</th>
            <th>Publisher</th>
            <th>Actions</th> {/* New column for actions (Edit and Delete) */}
          </tr>
        </thead>
        <tbody>
          {
            data.map((d, i) => (
              <tr key={i}>
                <td>{d.title}</td>
                <td>{d.platform}</td>
                <td>{d.developer}</td>
                <td>{d.publisher}</td>
                <td>
                  {/* Edit and Delete Buttons */}
                  <button onClick={() => handleEdit(d)}>Edit</button>
                  <button onClick={() => handleDelete(d.id)}>Delete</button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>

      {/* Form to submit a new game or edit an existing game */}
      <h3>{isEditing ? 'Edit Video Game' : 'Add New Video Game'}</h3>
      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        <input
          type="text"
          name="title"
          value={newGame.title}
          onChange={handleChange}
          placeholder="Title"
          required
        />
        <input
          type="text"
          name="platform"
          value={newGame.platform}
          onChange={handleChange}
          placeholder="Platform"
          required
        />
        <input
          type="text"
          name="developer"
          value={newGame.developer}
          onChange={handleChange}
          placeholder="Developer"
          required
        />
        <input
          type="text"
          name="publisher"
          value={newGame.publisher}
          onChange={handleChange}
          placeholder="Publisher"
          required
        />
        <button type="submit" style={{ marginLeft: '10px' }}>
          {isEditing ? 'Save Changes' : 'Add Game'}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={resetForm}
            style={{ marginLeft: '10px', backgroundColor: '#f44336', color: 'white' }}
          >
            Cancel
          </button>
        )}
      </form>
    </div>
  );
}

export default App;
