import { DEFINE_USER,REMOVE_USER,TAGSADD,TAGSDEL } from './type-name'
import {userInfo,menulist} from '../utils/storageUtils'
import {reqLogin,reqRoleSuper,reqEmailLogin} from '../api'
const setUser = (user) => ({type:DEFINE_USER,value:user});

export const setTags = (tags) => {
    menulist.saveList(tags);
    return (dispatch) => {
        dispatch(({type:TAGSADD,value:tags}))
    } 
};
export const delTags = (tags) => {
    menulist.removeList();
    menulist.saveList(tags);
    return (dispatch) => {
        dispatch(({type:TAGSDEL,value:tags}))
    }
};

export const login = (value) => {
    return async (dispatch) => {
        let {username,password} = value;
        let result = await reqLogin({username,password});
        if(result && result.status === 10014){
            let roles = await reqRoleSuper({_id:result.data[0].role});
            if(roles && roles.data){
                result.data[0].roleInfo = {...roles.data[0]};
                let user = result.data[0];
                userInfo.saveUser(user);
                dispatch(setUser(user));
            }else{
                result.data[0].roleInfo = {};
                let user = result.data[0];
                userInfo.saveUser(user);
                dispatch(setUser(user));
            }
        }
    }
}
export const emailLogin = (value) => {
    return async (dispatch) => {
        let {email} = value;
        let result = await reqEmailLogin({email});
        if(result && result.status === 10014){
            let roles = await reqRoleSuper({_id:result.data.role});
            if(roles && roles.data){
                result.data.roleInfo = {...roles.data[0]};
                let user = result.data;
                userInfo.saveUser(user);
                dispatch(setUser(user));
            }else{
                result.data.roleInfo = {};
                let user = result.data;
                userInfo.saveUser(user);
                dispatch(setUser(user));
            }
        }
    }
}
export const exit = () => {
    // 删除 local中的 user
    setTags([]);
    userInfo.removeUser();
    menulist.removeList();
    return {type:REMOVE_USER}
}