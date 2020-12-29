import React from 'react';

export function Img(props) {
    return (
        <div style={{ width: props.width || props.height, overflow: 'hidden', display: 'inline-block', textAlign: 'center' }}>
            <img src={`images/${props.id}.jpg`} height={props.height}/>
        </div>
    );
}