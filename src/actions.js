import axios from './axios';

export async function receiveUsers() {
    const { data } = await axios.get('/friend-wannabes.json');
    console.log("data in receiveUsers: ", data);
    return {
        type: 'RECEIVE_USERS',
        users: data
    };
}
export async function UnfriendUsers(id){
    await axios.post('/end-friendship/' + id);
    return {
        type: 'UNFRIEND_USERS',
        accepted: false
    };
}
export async function FriendsWithUsers(id){
    await axios.post('/accept-friend-request/' + id);
    return {
        type: 'FRIENDSWITH_USERS',
        accepted: true
    };
}

export async function chatMessages(msgs) {
    return {
        type: "ALL_MSGS",
        msgs: msgs
    };
}
export async function chatMessage(msg) {
    return {
        type: "GOT_MSG",
        msg: msg
    };
}
//PRIVATE
export async function privateChatMessages(pmsgs) {
    return {
        type: "ALLP_MSGS",
        pmsgs: pmsgs
    };
}
export async function privateChatMessage(pmsg) {
    return {
        type: "GOTP_MSG",
        pmsg: pmsg
    };
}
