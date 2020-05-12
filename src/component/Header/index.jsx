import React, { Component } from 'react'
import {Icon,Menu,Tooltip,Dropdown,message,Modal,Badge,Popover,List,Row,Col} from 'antd'
import {Link,withRouter} from 'react-router-dom'
import Tags from './tags'
import './index.less'
import {connect} from 'react-redux'
import {exit,setTags} from '../../store/action'
import {reqMsgNotRead} from '../../api'
import moment from 'moment'

const { confirm } = Modal;
class Header extends Component{
    constructor(){
        super();
        this.state = {
            global:false,
            username:'',
            imgs:'',
            msglist:[],
        }
    }
    fullScreen(){
        let global = this.state.global;
        if(global){
            // 退出全屏
            (document.exitFullscreen&&document.exitFullscreen())||(document.mozCancelFullScreen&&document.mozCancelFullScreen())||(document.webkitCancelFullScreen&&document.webkitCancelFullScreen())
            this.setState({global:!global})
        }else{
            // 全屏显示
            var documentElement = document.documentElement;
           (documentElement.requestFullscreen&&documentElement.requestFullscreen())||(documentElement.mozRequestFullScreen && documentElement.mozRequestFullScreen())||(documentElement.webkitRequestFullScreen && documentElement.webkitRequestFullScreen())
            this.setState({global:!global})
        }
    }
    addTags(value){
        let tags = this.props.tags;
        for(let index in tags){
            if(tags[index].name === value.name){
                return;
            }
        }
        tags.push(value);
        setTags(tags);
    }
    exit = ()=>{
        confirm({
            title: '提示',
            content: '确定注销并退出系统吗?',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk : () => {
                message.success('已成功退出')
                this.props.exit()
                this.props.history.replace('/login')
            },
            onCancel : () => {
                message.info('已取消退出')   
            },
        });
    }
    
    initContent(){
        if(this.state.msglist.length === 0){
            return 
        }else{
            return (
            <List
                style={{width:300}}
                itemLayout="horizontal"
                dataSource={this.state.msglist}
                renderItem={item => (
                <List.Item>
                    <List.Item.Meta
                        title={item.name}
                        description={item.createTime}
                    />
                </List.Item>
                )}
            />)
        }
    }
    async initNotice(){
        const result = await reqMsgNotRead({_id:this.props.user._id});
        if(result && result.status === 10014){
            for(let i in result.data){
                result.data[i].createTime = moment(result.data[i].createTime).format('YYYY-MM-DD HH:mm:ss');
            }
            this.setState({msglist:result.data})
        }
    }

    componentDidMount(){
        this.initNotice();
    }
    UNSAFE_componentWillMount(){
        let user = this.props.user;
        if(user.username && user._id){
            this.setState({username:user.username,imgs:user.headImg})
        }
    }
    render(){
        const menu = (
            <Menu style={{textAlign:'center',width:'100px'}}>
                <Menu.Item className='user_item'>
                    <Link to='/ownspace' onClick={()=>{this.addTags({name:'个人中心',keys:'/ownspace'})}}>个人中心</Link>
                </Menu.Item>
                <Menu.Item className='user_item'>
                    <Link to='/setting' onClick={()=>{this.addTags({name:'个人设置',keys:'/setting'})}}>设置</Link>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item className='user_item'onClick={this.exit} >
                    退出登录
                </Menu.Item>
            </Menu>
        );
        const {global,username,imgs,msglist} = this.state
        const content = this.initContent()
        return (
            <div className='header'>
                <Row span={24} className='navbar'>
                    <Icon
                        className="trigger navbar-toggle"
                        type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
                        onClick={this.props.toggle}
                    />
                    <Col xs={0} sm={0} md={12}>
                        <Menu className='navbar-menu-left' mode="horizontal">
                            <Menu.Item key="laptop">
                                <Icon type="laptop" />
                                网站后台管理系统
                            </Menu.Item>
                            <Menu.Item key="desktop">
                                <a href="https://supernatant.cn">
                                    <Icon type="desktop" />
                                    博客网站
                                </a>
                            </Menu.Item>
                            <Menu.Item key="api">
                                <Link to="/apis">
                                    <Icon type="api" />
                                    API文档
                                </Link>
                            </Menu.Item>
                        </Menu>
                    </Col>
                    <div className='navbar-menu-right'>
                        <Tooltip onClick={()=>{this.fullScreen()}} placement="top" title={global===true?'退出全屏':'全屏'}>
                            <div className='tool_icon_item'>
                                {
                                    global===true?(<Icon className='icon' type="fullscreen-exit" />):(<Icon className='icon' type="fullscreen" />)
                                }
                            </div>
                        </Tooltip>
                        <Tooltip  placement="top" title={'下载源码'}>
                            <div className='tool_icon_item'>
                                <Icon className='icon' type="cloud-download" /> 
                            </div>
                        </Tooltip>
                        <Link to='/messages'> 
                            {
                                msglist.length === 0?
                                <Tooltip  placement="bottom" onClick={()=>{ this.addTags({name:'消息中心',keys:'/messages'})}} title={'无未读消息'}>
                                    <div className='tool_icon_item'>
                                        <Icon className='icon' type="notification" />
                                    </div>
                                </Tooltip>:
                                <Popover onClick={()=>{ this.addTags({name:'消息中心',keys:'/messages'}); this.setState({msglist:[]})}} style={{width:300}} content={content} title="通知">
                                    <div className='tool_icon_item'>
                                        <Badge count={msglist.length}>
                                            <Icon className='icon' type="sound" />
                                        </Badge>
                                    </div>
                                </Popover>
                            }
                        </Link>
                        <Dropdown overlay={menu} placement="bottomRight">
                            <div className='user_dropdown'>
                                <span className='user_name'>{username}</span>
                                <Icon type='caret-down' className='user_icon'/>
                                <span className='user_img'>
                                    <img src={imgs} alt="头像"/>
                                </span>
                            </div>
                        </Dropdown>
                    </div>
                </Row>
                <div className='tags'>
                    <Tags/>
                </div>
            </div>
        )
    }
} 
export default connect(
    state => ({user:state.user,tags:state.tags}),{exit}
)(withRouter(Header))