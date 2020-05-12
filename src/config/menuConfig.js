const menuList = [
    {
        title:'首页',
        key:'/home', // 对应的 path
        icon: 'home',// 图标
        isPubilc:true
    },
    {
        title:'文章操作',
        key:'/articles',
        icon:'container',
        isPubilc:true,
        children:[
            {
                title:'类型管理',
                key:'/article/category',
                icon:'unordered-list',
                isPubilc:true,
            },
            {
                title:'文章管理',
                key:'/article/manage',
                icon:'file',
                isPubilc:true,
            }
        ]
    },
    {
        title:'随笔',
        key:'/notes',
        icon:'edit',
        isPubilc:true
    },
    {
        title:'应用管理',
        key:'/application',
        icon:'appstore',
        isPubilc:true //不是公开的 只有特定角色才能访问
    },
    {
        title:'系统管理',
        key:'/system',
        icon:'setting',
        isPubilc:false, //不是公开的 只有特定角色才能访问 
        children:[
            {
                title:'角色管理',
                key:'/system/role',
                icon:'team',
                isPubilc:false,
            },
            {
                title:'用户管理',
                key:'/system/user',
                icon:'user',
                isPubilc:false,
            },
            {
                title:'系统公告',
                key:'/system/notifies',
                icon:'notification',
                isPubilc:false,
            },
            {
                title:'评论管理',
                key:'/system/comments',
                icon:'message',
                isPubilc:false, //不是公开的 只有特定角色才能访问 
            },
            {
                title:'日志管理',
                key:'/system/log2infor',
                icon:'calendar',
                isPubilc:false, //不是公开的 只有特定角色才能访问 
            },
        ]
    },
]

export default menuList