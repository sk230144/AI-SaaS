import React from 'react'
import { useLocation } from 'react-router'

const VisualizerId = () => {
    const location = useLocation();
    const { initialImage, name } = location.state || {};

    return (
        <div>
            <h1>{name || 'untitled name'}</h1>
            {initialImage && (
                <img src={initialImage} alt='test' />
            )}
        </div>
    )
}

export default VisualizerId