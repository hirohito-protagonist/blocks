import React from 'react';

export default function GameInformation({ information }) {

    return (
        <>
            <p>Score: {information.score}</p>
            <p>Lines: {information.lines}</p>
            <p>Level: {information.level}</p>
        </>
    );
};