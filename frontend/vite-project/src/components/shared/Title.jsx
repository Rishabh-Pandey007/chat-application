import React from 'react';
import {Healmet} from 'react-helmet-async';

const Title = ({
    title = 'Chat Application',
    description = 'This is chat app developed  using React, Redux, and Socket.IO and developed by Rishabh & Avdesh',
}) =>{
    return (
        <Healmet>
            <title>{title}</title>
            <meta name='description' content={description} />
        </Healmet>
    )
};

export default Title;