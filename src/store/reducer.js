import { combineReducers } from 'redux'
import {DEFINE_USER,REMOVE_USER,TAGSADD,TAGSDEL} from './type-name'
import {userInfo,menulist} from '../utils/storageUtils'

const use = userInfo.getUser();

let tag = menulist.getList().length !== 0 ? menulist.getList() : [{name: "首页", keys: "/home"}];

// 设置的登录用户
function user (state=use,action){
    switch(action.type){
        case DEFINE_USER:
            return action.value
        case REMOVE_USER:
            return {}
        default:
            return state
    }
}
// 设置tags
function tags(state=tag,action){
    if(action.type === TAGSADD){
        return action.value;
    }else if(action.type === TAGSDEL){
        return action.value;
    }
    return state
}

//向外暴露的是合并产生的新的 reducer
export default combineReducers({
    user,
    tags,
})
