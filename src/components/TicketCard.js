import React from 'react';
import './TicketCard.css';

function TicketCard({ ticket, users, grouping }) {
  const assignedUser = users?.find(user => user.id === ticket.userId);
  
  const getPriorityIcon = React.useMemo(() => {
    const icons = {
      0: 'No-priority.svg',
      1: 'Img - Low Priority.svg',
      2: 'Img - Medium Priority.svg',
      3: 'Img - High Priority.svg',
      4: 'SVG - Urgent Priority colour.svg'
    };
    return (priority) => {
      try {
          return require(`../assets/${icons[priority]}`);
      } catch (error) {
          console.warn(`Failed to load priority icon for priority ${priority}`);
          return require('../assets/No-priority.svg').default;
      }
    };
  }, []);

  const getStatusIcon = (status) => {
    const icons = {
      'Backlog': 'Backlog.svg',
      'Todo': 'To-do.svg',
      'In progress': 'in-progress.svg',
      'Done': 'Done.svg',
      'Cancelled': 'Cancelled.svg'
    };
    try {
        return require(`../assets/${icons[status]}`);
    } catch (error) {
        console.warn(`Failed to load status icon for status ${status}`);
        return require('../assets/To-do.svg').default;
    }
  };

  return (
    <div className="ticket-card">
      <div className="card-header">
        <span className="cam-number">{ticket.id}</span>
        {(grouping === 'status' || grouping === 'priority') && assignedUser && (
          <div className="user-avatar">
            {assignedUser.name.split(' ').map(word => word[0]).join('')}
          </div>
        )}
      </div>
      <div className="title-row">
        {grouping !== 'status' && (
          <img src={getStatusIcon(ticket.status)} alt="status" className="icon" />
        )}
        <span>{ticket.title}</span>
      </div>
      <div className="priority-row">
        {grouping !== 'priority' && (
          <div className="priority-icon">
            <img src={getPriorityIcon(ticket.priority)} alt="priority" className="icon" />
          </div>
        )}
        <div className="feature-tag">
          <span>Feature Request</span>
        </div>
      </div>
    </div>
  );
}

export default TicketCard;
