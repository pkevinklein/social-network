import * as io from 'socket.io-client';
import { chatMessages, chatMessage,privateChatMessages,privateChatMessage } from './actions';

export let socket;

export const init = store => {
    if (!socket) {
        socket = io.connect();
        //PRIVATE
        socket.on(
            'privateChatMessages',
            pmsgs => store.dispatch(
                privateChatMessages(pmsgs)
            )
        );
        socket.on(
            'privateChatMessage',
            pmsg => store.dispatch(
                privateChatMessage(pmsg)
            )
        );
        //chat
        socket.on(
            'chatMessages',
            msgs => store.dispatch(
                chatMessages(msgs)
            )
        );

        socket.on(
            'chatMessage',
            msg => store.dispatch(
                chatMessage(msg)
            )
        );
    }
};
