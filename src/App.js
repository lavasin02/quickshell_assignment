import React, { useState, useEffect } from 'react';
import KanbanBoard from './components/KanbanBoard';
import DisplayOptions from './components/DisplayOptions';
import './components/App.css';

function App() {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]); // New state for users
  const [grouping, setGrouping] = useState(() => {
    return localStorage.getItem('viewGrouping') || 'status';
  });
  const [ordering, setOrdering] = useState(() => {
    return localStorage.getItem('viewOrdering') || 'priority';
  });

  // Save preferences whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('viewGrouping', grouping);
      localStorage.setItem('viewOrdering', ordering);
    } catch (error) {
      console.warn('Failed to save view preferences:', error);
    }
  }, [grouping, ordering]);

  useEffect(() => {
    fetch('https://api.quicksell.co/v1/internal/frontend-assignment')
      .then(response => response.json())
      .then(data => {
        if (data && Array.isArray(data.tickets) && Array.isArray(data.users)) {
          setTickets(data.tickets);
          setUsers(data.users);
        } else {
          console.error('API response is not in the expected format:', data);
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="App">
      <div className="top-section">
        <DisplayOptions setGrouping={setGrouping} setOrdering={setOrdering} />
      </div>
      <KanbanBoard tickets={tickets} grouping={grouping} ordering={ordering} users={users} />
    </div>
  );
}

export default App;
