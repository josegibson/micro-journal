import React, { useState } from 'react';

const BulletInput = ({ onAddBullet }) => {
    const [inputValue, setInputValue] = useState('');

    const handleChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            onAddBullet(inputValue);
            setInputValue('');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={inputValue}
                onChange={handleChange}
                placeholder="Enter your bullet point"
            />
            <button type="submit">Add</button>
        </form>
    );
};

export default BulletInput;