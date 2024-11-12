import React from 'react';
import './DisplayOptions.css';

function DisplayOptions({ setGrouping, setOrdering }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const dropdownRef = React.useRef(null);

    React.useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="display-options" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="display-button">
                <img src={require('../assets/Display.svg').default} alt="display" className="icon" />
                Display
                <img src={require('../assets/down.svg').default} alt="dropdown" className="icon" />
            </button>
            {isOpen && (
                <div className="options-dropdown">
                    <label>
                        Grouping
                        <select onChange={e => setGrouping(e.target.value)}>
                            <option value="status">Status</option>
                            <option value="user">User</option>
                            <option value="priority">Priority</option>
                        </select>
                    </label>
                    <label>
                        Ordering
                        <select onChange={e => setOrdering(e.target.value)}>
                            <option value="priority">Priority</option>
                            <option value="title">Title</option>
                        </select>
                    </label>
                </div>
            )}
        </div>
    );
}

export default DisplayOptions;
