import React,{Component} from 'react'
import {Menu,Icon} from 'antd'
import { Link,withRouter } from 'react-router-dom'
import './index.less'
import menuList from '../../config/menuConfig'
import {connect} from 'react-redux'
import {setTags} from '../../store/action'
const { SubMenu } = Menu

class Slider extends Component{
    constructor(props){
        super(props);
        this.state = {
            user:this.props.user
        }
        this.getMenuNodes.bind(this)
    }
    hasAuthor(item){
        let user = this.state.user;
        item.isPublic = item.isPubilc?true:false;
        if(user&&user.roleInfo){
            if(user.roleInfo.power === "ROLE_ADMIN" || (user.roleInfo.menus.length!==0&&user.roleInfo.menus.indexOf(item.key)!==-1)|| item.isPublic){
                return true
            }else{
                return false;
            }
        }else{
            return false
        }
    }
    addTags(value){
        this.setTitle(value.name);
        let tags = this.props.tags;
        for(let index in tags){
            if(tags[index].name === value.name){
                return;
            }
        }
        tags.push(value);
        setTags(tags);
    }
    setTitle = (title) => {
        if(title === '首页'){
            return document.title = "网站后台管理系统"
        }
        document.title = `${title} - 网站后台管理系统`
    }
    UNSAFE_componentWillMount(){
        this.menuList = this.getMenuNodes(menuList);
    }
    getMenuNodes(menuList){
        return menuList.map((item)=>{
            if(this.hasAuthor(item)){
                if(!item.children){
                    return (
                        <Menu.Item className='menu_item' key={item.key}>
                            <Link to={item.key} onClick={()=>{this.addTags({name:item.title,keys:item.key})}}>
                                <Icon type={item.icon}/>
                                <span>{item.title}</span>
                            </Link>
                        </Menu.Item>
                    )
                }else{
                    let path = this.props.location.pathname
                    let show = item.children.find(cItem => path.indexOf(cItem.key)===0)
                    if(show){
                        this.openKey = item.key
                    }
                    return (
                        <SubMenu key={item.key} popupClassName=""
                            title={
                                <span>
                                    <Icon type={item.icon}/>
                                    <span>{item.title}</span>
                                </span>
                            }>
                            {this.getMenuNodes(item.children)}
                        </SubMenu>
                    )
                }
            }
            return undefined;
        })
    }
    render(){
        let path = this.props.location.pathname === '/' ? this.props.location.pathname='/home':this.props.location.pathname;
        return (
            <Menu className='slider' theme="dark" defaultOpenKeys={[this.openKey]} selectedKeys={[path]} mode="inline">
                {this.menuList}
            </Menu>
        )
    }
}
export default connect(
    state => ({tags:state.tags,user:state.user}),{setTags}
)(withRouter(Slider))