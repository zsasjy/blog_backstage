import React,{Component} from 'react'
import { Layout } from 'antd'
import { Switch,Route,Redirect } from 'react-router-dom'
import {connect} from 'react-redux'
// 非路由组件
import Header from '../../component/Header'
import Slider from '../../component/Slider'
// 路由组件
import Home from '../home'
import Roles from '../roles'
import Users from '../users'
import Articles from '../articles'
import Types from '../types'
import Notes from '../notes'
import Notices from '../notices'
import Applications from '../applications'
import Logininfo from '../logs'
import Message from '../message'
import Ownspace from '../ownspace'
import Setting from '../setting'
import Comments from '../comments'
import './layout.less'
import Logo from '../../assets/image/logo.png'
import Page_404 from '../404'
import Api from '../api'

const { Sider } = Layout;

class Layouts extends Component{
    state = {
        collapsed: false,
    };
    
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };
    componentDidMount(){
        window.addEventListener('resize', this.handleResize.bind(this))
    }
    handleResize = e => {
        if( e.target.innerWidth <= 930 ){
            this.setState({collapsed:true})
        }else{
            this.setState({collapsed:false})
        }
    }
    render(){
        let {collapsed} = this.state;
        const user = this.props.user;
        if(!user.username || !user._id){
            return <Redirect to='/login'/>
        }
        return (
            <Layout className='wrapper'>
                <Sider width={250} trigger={null} collapsible collapsed={this.state.collapsed}>
                    <div className="logo" >
                        <a href="/home">
                            <img src={Logo} alt="LOGO"/>
                            { collapsed===false?<h1>后台管理系统</h1>:'' }
                        </a>
                    </div>
                    <Slider/>
                </Sider>
                <Layout>
                    <Header toggle={this.toggle} collapsed={collapsed} />
                    <div className="content">
                        <Switch>
                            <Route exact path='/home' component={Home}/>
                            <Route exact path='/article/manage' component={Articles}/>
                            <Route exact path='/article/category' component={Types}/>
                            <Route exact path='/system/role' component={Roles}/>
                            <Route exact path='/system/user' component={Users}/>
                            <Route exact path='/notes' component={Notes}/>
                            <Route exact path='/system/notifies' component={Notices}/>
                            <Route exact path='/application' component={Applications}/>
                            <Route exact path='/system/log2infor' component={Logininfo}/>
                            <Route exact path='/system/comments' component={Comments}/>
                            <Route exact path='/messages' component={Message}/>
                            <Route exact path='/ownspace' component={Ownspace}/>
                            <Route exact path='/setting' component={Setting}/>
                            <Route exact path='/apis' component={Api}/>
                            <Route exact path='/' component={Home}/>   
                            <Route component={Page_404} />
                        </Switch>
                    </div>
                </Layout>
            </Layout>
        )
    }
}
export default connect(
    state => ({user:state.user})
)(Layouts)