export default function(state={}, action) {
    console.log(`state started as `, state);
    if (action.type == 'RECEIVE_USERS') {
        state = {
            ...state,
            users: action.users
        };
    }

    if (action.type == 'UNFRIEND_USERS') {
        const users = [
            ...state.users.filter(e =>
                action.id != e.id
            )];
        state = { ...state,users};
    }
    if (action.type == "GOT_MSG") {
        console.log("charMessac",state.chatMessages);
        console.log("action:", action.msg);
        state = {
            ...state,
            chatMessages: state.chatMessages.concat(action.msg)

        };}
    if (action.type == "ALL_MSGS") {
        state = {
            ...state,
            chatMessages: action.msgs   //<= this msgs is what is on the TYPE of actions
        };}
    //PrivateChat
    if (action.type == "GOTP_MSG") {
        console.log("pcharMessac",state.privateChatMessages);
        console.log("action:", action.pmsg);
        state = {
            ...state,
            privateChatMessages: state.privateChatMessages.concat(action.pmsg)

        };}
    if (action.type == "ALLP_MSGS") {
        state = {
            ...state,
            privateChatMessages: action.pmsgs   //<= this msgs is what is on the TYPE of actions
        };}

    if (action.type == 'FRIENDSWITH_USERS') {
        const users = [
            ...state.users.map(p =>{
                if (action.id == p.id){
                    p.accepted = action.accepted;
                    return p;
                }
            })
        ];
        state ={...state, users};
    }
    console.log(`state ended as `, state);
    return state;  // this will return the new state
}














//
// export default function reducer(state={}, action){
//     if(){
//        state = {...state.myArr, action.newValue}
//     }
//     return state;
// }




// //no me acuerdo del nombre
// let arr =[1,2,3]
// let newArr = [...arr,4]
// console.log();
//
// //map
// let arr =[1,2,3]
// let newArr = arr.map(elem =>{
//     return elem + 1;
// })
// console.log();
//
// //filter
// let arr =[1,2,3];
// let newArr = arr.filter(elem =>{
//     return elem !== 1;
// })
// console.log();
