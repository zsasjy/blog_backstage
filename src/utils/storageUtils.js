import store from 'store'


const USERKEY = 'user-key';
const OpenMenuList = 'OPENMENULIST';
/*
    用于存储 登录信息数据的 例如使用 localStorage
*/

export const userInfo = {
    // 保存user
    saveUser(user,expiration){
        store.set(USERKEY,user,new Date().getTime() + 1440000)
    },
    // 查看user
    getUser(){
        return store.get(USERKEY) || {}
    },
    // 删除user
    removeUser(){
        // localStorage.removeItem(USERKEY)
        store.remove(USERKEY)
    }
};
export const menulist = {
    // 保存user
    saveList(list,expiration){
        store.set(OpenMenuList,list,new Date().getTime() + 1440000)
    },
    // 查看user
    getList(){
        return store.get(OpenMenuList) || []
    },
    // 删除user
    removeList(){
        store.remove(OpenMenuList)
    }
}