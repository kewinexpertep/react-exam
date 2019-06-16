import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { createStore } from 'redux';
import { Provider } from 'react-redux'
var users = JSON.parse(localStorage.getItem('users'));
const initalState = {
    users: users,
    editIndex: null,
    editUser: {},
    update: 0
}
const reducer = (state = initalState, action) => {
    switch (action.type) {
        case "ADD" :
            return {
                ...state,
                users: [
                    ...state.users,
                    action.payload
                ]}
        case "EDIT" :
            return {
                ...state,
                editIndex: action.index,
                editUser: state.users[action.index]
            }
        case "UPDATE" :
            let tmp = state.users
            tmp[state.editIndex] = action.payload
            return {
                ...state,
                editUser: {},
                editIndex: null,
                users: tmp
            }
        case "DELETE" :
            let tmp1 = state.users
            tmp1.splice(action.index,1)
            if (tmp1.length === 0)
                return {
                    ...state,
                    users: []
                }
            else 
                return {
                    ...state,
                    users: tmp1,
                    update: 1
                }
        case "DELETEMUL" :
            let tmp2 = state.users
            let literal = 0
            action.selecteds.sort()
            action.selecteds.map((index) => {
                tmp2.splice(index - literal, 1)
                literal++
                return 0
            })
            return {
                ...state,
                users: tmp2
            }
        default:
            return {
                ...state,
                update: 0
            };
    }
}
const store = createStore (reducer)
store.subscribe(() => {
    console.log("update", store.getState());
    localStorage.setItem("users", JSON.stringify(store.getState().users));
})

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
