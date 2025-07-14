import React, {memo} from 'react';
import { Link} from '../styles/StyledComponents';
import {Box, Stack, Typography} from './AvatarCard';
import { motion } from 'framer-motion';

const ChatItem = ({
    avatart = [],
    name,
    _id,
    groupChat = false,
    sameSender,
    isOnline,
    newMessageAlert,
    index = 0,
    handleDeleteChat,
}) =>{
    return(
        <Link
            sx={{
                padding: '0',
            }}
            to={`/chat/${_id}`}
            onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}
        >
            <motion.div
                initial={{
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'center',
                    backgroundColor: sameSender ? 'black' : 'unset',
                    color: sameSender ? 'white' : 'unset',
                    position: 'relative',
                    padding: '1rem',
                }}
            >

                


            </motion.div>
        </Link>
    )
}
