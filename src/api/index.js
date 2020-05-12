import ajax from './ajax'

// 登录
export let reqLogin = (value) => {
    return ajax('/api/login',{...value},'POST')
}
// 邮箱登录
export const reqEmailLogin = (value) => {
    return ajax('/api/emailLogin',{...value},'POST')
}
// 邮件发送
export const reqSendEmail = (email) => {
    return ajax('/api/email/verification',{email},'POST')
}
// 注册(用户添加)
export const reqSignup = (value) => {
    return ajax('/api/user/add',{...value},'POST')
}
// 退出
export const reqExit = () => {
    return ajax('/api/exit',{},'GET')
}
// 文件删除
export const reqFileDel = (url) => {
    return ajax('/api/upload/delete',{url},'POST')
}
// 角色添加
export const reqRoleAdd = (value) => {
    // name power menus(权限列表) remarks(备注)
    return ajax('/api/roles/add',{...value},'POST')
}
// 角色删除
export const reqRoleDel = (_id) => {
    return ajax('/api/roles/del',{_id},'POST')
}
// 角色更新
export const reqRoleUpdate = (value) => {
    return ajax('/api/roles/update',{...value},'POST')
}
// 角色查询
export const reqRoleQuery = (value) => {
    return ajax('/api/roles/query',{...value},'POST')
}
// 超管查询
export const reqRoleSuper = (value) => {
    return ajax('/api/roles/super',{...value},'POST')
}
// 角色状态查询
export const reqRoleStatusFind = () => {
    return ajax('/api/roles/statusfind',{},'GET')
}
// 角色列表
export const reqRoleFind = () => {
    return ajax('/api/roles/find',{},'GET')
}
// 角色批量删除
export const reqRoleDelMany = (value) => {
    // 确保传递参数为数组
    return ajax('/api/roles/delMany',{...value},'POST')
}
// 用户删除
export const reqUserDel = (_id) => {
    return ajax('/api/user/del',{_id},'POST')
}
// 用户查询
export const reqUserQuery = (value) => {
    return ajax('/api/user/query',{...value},'POST')
}
// 用户列表
export const reqUserFind = () => {
    return ajax('/api/user/find',{},'GET')
}
// 用户更新
export const reqUserUpdate = (value) => {
    return ajax('/api/user/update',{...value},'POST')
}
// 用户作品
export const reqUserWorks = (value) => {
    return ajax('/api/user/works',{...value},'POST')
}
// 用户批量删除
export const reqUserDelMany = (value) => {
    return ajax('/api/user/delMany',{...value},'POST')
}
// 文章添加
export const reqArticleAdd = (value) => {
    return ajax('/api/articles/add',{...value},'POST')
}
// 文章删除
export const reqArticleDel = (_id,typeId) => {
    return ajax('/api/articles/del',{_id,typeId},'POST')
}
// 文章列表
export const reqArticleFind = () => {
    return ajax('/api/articles/find',{},'GET')
}
// 文章查询
export const reqArticleQuery = (value) => {
    return ajax('/api/articles/query',{...value},'POST')
}
// 文章更新
export const reqArticleUpdate = (value) => {
    return ajax('/api/articles/update',{...value},'POST')
}
// 文章类型添加
export const reqTypeAdd = (value) => {
    return ajax('/api/types/add',{...value},'POST')
}
// 文章类型删除
export const reqTypeDel = (_id) => {
    return ajax('/api/types/del',{_id},'POST')
}
// 文章类型列表
export const reqTypeFind = () => {
    return ajax('/api/types/find',{},'GET')
}
// 文章类型批量删除
export const reqTypeDelMany = (value) => {
    return ajax('/api/types/delMany',{...value},'POST')
}
// 文章类型更新
export const reqTypeUpdate = (value) => {
    return ajax('/api/types/update',{...value},'POST')
}
// 公告添加
export const reqNoticesAdd = (value) => {
    return ajax('/api/notices/add',{...value},'POST')
}
// 公告删除
export const reqNoticesDel = (_id) => {
    return ajax('/api/notices/del',{_id},'POST')
}
// 公告批量删除
export const reqNoticesDelMany = (value) => {
    return ajax('/api/notices/delMany',{...value},'POST')
}
// 公告列表
export const reqNoticesFind = () => {
    return ajax('/api/notices/find',{},'GET')
}

// 未读站内信列表
export const reqMsgNotRead = (value) => {
    return ajax('/api/message/noread',{...value},'POST')
}
// 未读站内信列表
export const reqMsgRead = (value) => {
    return ajax('/api/message/read',{...value},'POST')
}
// 修改读取状态
export const reqMsgStatus = (value) => {
    return ajax('/api/message/status',{...value},'POST')
}
// 删除消息
export const reqMsgDel = (value) => {
    return ajax('/api/message/del',{...value},'POST')
}

// 公告查询
export const reqNoticesQuery = (value) => {
    return ajax('/api/notices/query',{...value},'POST')
}
// 公告更新
export const reqNoticesUpdate = (value) =>{
    return ajax('/api/notices/update',{...value},'POST')
}
// 笔记添加
export const reqNotesAdd = (value) => {
    return ajax('/api/notes/add',{...value},'POST')
}
// 笔记删除
export const reqNotesDel = (_id) => {
    return ajax('/api/notes/del',{_id},'POST')
}
// 笔记批量删除
export const reqNotesDelMany = (value) => {
    return ajax('/api/notes/delMany',{...value},'POST')
}
// 笔记更新
export const reqNotesUpdate = (value) => {
    return ajax('/api/notes/update',{...value},'POST')
}
// 笔记列表
export const reqNotesFind = () => {
    return ajax('/api/notes/find',{},'GET')
}
// 日志(操作日志，登录日志)
// 日志列表
export const reqLogFind = (type) => {
    return ajax('/api/logs/find',{type},'POST')
}
// 日志删除
export const reqLogDel = (_id) => {
    return ajax('/api/logs/del',{_id},'POST')
}
// 日志批量删除
export const reqLogDelMany = (value) => {
    return ajax('/api/logs/delMany',{...value},'POST')
}
// 日志清空
export const reqLogEmpty = () => {
    return ajax('/api/logs/empty',{},'GET')
}
// 日志查询
export const reqLogQuery = (value) => {
    return ajax('/api/logs/query',{...value},'POST')
}
// 应用添加
export const reqAppAdd = (value) => {
    return ajax('/api/applications/add',{...value},'POST')
}
// 应用删除
export const reqAppDel = (_id) => {
    return ajax('/api/applications/del',{_id},'POST')
}
// 应用列表
export const reqAppFind = () => {
    return ajax('/api/applications/find',{},'GET')
}
// 应用更新
export const reqAppUpdate = (value) => {
    return ajax('/api/applications/update',{...value},'POST')
}
// 应用搜素
export const reqAppQuery = (value) => {
    return ajax('/api/applications/query',{...value},'POST')
}
// 获取首页相关数据
export const reqChartH = () => {
    return ajax('/api/chart',{},'GET');
}

// 评论相关
// 评论列表
export const reqCommentList = () =>{
    return ajax('/api/comments/list',{},'GET');
}
export const reqCommentDel = (value) => {
    return ajax('/api/comments/del',{...value},'POST');
}
export const reqCommentDelMany = (value) => {
    return ajax('/api/comments/delMany',{...value},'POST');
}
export const reqCommentQuery = (value) => {
    return ajax('/api/comments/query',{...value},'POST');
}
// 获取图片验证码
export const reqImageCode = () => {
    return ajax('/api/imgcode',{},'GET');
}