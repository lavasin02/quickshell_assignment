import React from 'react';
import TicketCard from './TicketCard';
import './KanbanBoard.css';
//import { getGroupedTickets, sortTickets } from '../utils/groupingUtils';
//import { PRIORITY_ORDER } from '../constants';

function groupTickets(tickets, grouping, users) {
    if (!Array.isArray(tickets)) {
        return {};
    }

    // Initialize empty groups based on grouping type
    let grouped = {};
    if (grouping === 'status') {
        grouped = {
            'Backlog': [],
            'Todo': [],
            'In progress': [],
            'Done': [],
            'Cancelled': []
        };
    } else if (grouping === 'priority') {
        grouped = {
            'No Priority': [],
            'Urgent': [],
            'High': [],
            'Medium': [],
            'Low': []
        };
    } else if (grouping === 'user') {
        // Pre-initialize user groups from the users array
        users.forEach(user => {
            grouped[user.name] = [];
        });
    }

    if (!tickets.length) {
        return grouped;
    }

    return tickets.reduce((groups, ticket) => {
        let key;
        if (grouping === 'user') {
            const user = users.find(user => user.id === ticket.userId);
            if (user) {
                key = user.name;
            }
        } else if (grouping === 'priority') {
            const priorityLabels = {
                0: 'No Priority',
                1: 'Low',
                2: 'Medium',
                3: 'High',
                4: 'Urgent'
            };
            key = priorityLabels[ticket.priority] || 'No Priority';
        } else if (grouping === 'status') {
            const statusOrder = {
                'Backlog': 'Backlog',
                'Todo': 'Todo',
                'In progress': 'In progress',
                'Done': 'Done',
                'Cancelled': 'Cancelled'
            };
            key = statusOrder[ticket.status] || ticket.status;
        } else {
            key = ticket[grouping] || 'Uncategorized';
        }

        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(ticket);
        return groups;
    }, grouped);
}

function KanbanBoard({ tickets, grouping, ordering, users }) {
    const groupedTickets = groupTickets(tickets, grouping, users);

    // Sort tickets within each group
    Object.keys(groupedTickets).forEach(group => {
        groupedTickets[group].sort((a, b) => {
            if (ordering === 'priority') {
                return b.priority - a.priority;
            } else if (ordering === 'title') {
                return a.title.localeCompare(b.title);
            }
            return 0;
        });
    });

    // Custom sort order for priority groups
    const priorityOrder = {
        'No Priority': 1,
        'Urgent': 2,
        'High': 3,
        'Medium': 4,
        'Low': 5
    };

    return (
        <div className="kanban-board">
            {Object.keys(groupedTickets)
                .sort((a, b) => {
                    if (grouping === 'priority') {
                        return (priorityOrder[a] || 99) - (priorityOrder[b] || 99);
                    } else if (grouping === 'user') {
                        return a.localeCompare(b);
                    }
                    return 0;
                })
                .map((group, index) => (
                <div className="kanban-column" key={index}>
                    <div className="column-header">
                        <h2>
                            {grouping === 'status' ? (
                                <img 
                                    src={require(`../assets/${
                                        group === 'In progress' ? 'in-progress' : 
                                        group === 'Todo' ? 'To-do' : 
                                        group === 'Backlog' ? 'Backlog' : 
                                        group === 'Done' ? 'Done' : 
                                        group === 'Cancelled' ? 'Cancelled' : 
                                        group
                                    }.svg`)} 
                                    alt={group} 
                                    className="group-icon"
                                />
                            ) : grouping === 'priority' ? (
                                <img 
                                    src={require(`../assets/${
                                        group === 'No Priority' ? 'No-priority' :
                                        group === 'Low' ? 'Img - Low Priority' :
                                        group === 'Medium' ? 'Img - Medium Priority' :
                                        group === 'High' ? 'Img - High Priority' :
                                        group === 'Urgent' ? 'SVG - Urgent Priority colour' :
                                        'No-priority'
                                    }.svg`)} 
                                    alt={group} 
                                    className="group-icon"
                                />
                            ) : null}
                            {grouping === 'user' ? (
                                <>
                                    <div className="user-avatar">
                                        {group.split(' ').map(word => word[0]).join('')}
                                    </div>
                                    <span>{group}</span>
                                </>
                            ) : (
                                <span>{group}</span>
                            )} 
                            <span>{groupedTickets[group].length}</span>
                        </h2>
                        <div className="header-icons">
                            <img src={require('../assets/add.svg').default} alt="add" className="header-icon" />
                            <img src={require('../assets/3 dot menu.svg').default} alt="menu" className="header-icon" />
                        </div>
                    </div>
                    {groupedTickets[group].map(ticket => (
                        <TicketCard key={ticket.id} ticket={ticket} users={users} grouping={grouping} />
                    ))}
                </div>
            ))}
        </div>
    );
}

export default KanbanBoard;
