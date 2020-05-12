import React,{Component} from 'react'
import { Form, Row, Col, Card, Icon, Menu, Tabs, Input, Button, Avatar, Upload, message, Modal, Divider, Switch } from 'antd'
import {connect} from 'react-redux'
import { reqUserUpdate } from '../../api'
import {exit} from '../../store/action'
import {userInfo} from '../../utils/storageUtils'
import Attsetation from './attestation'
import md5 from 'blueimp-md5'
import './index.less'
import Update from './update'
import ChangePass from './changepass'

import QQ from '../../assets/image/QQ.png'
import Github from '../../assets/image/github.png'
import Wechat from '../../assets/image/wechat.png'
import Microblog from '../../assets/image/microblog.png'


const { TextArea } = Input;
const { TabPane } = Tabs;

class Setting extends Component{
    constructor(props){
        super(props);
        this.state={
            itemCount:"1",
            user:this.props.user,
            btnloading:false,
            visible:false, // 密码验证
            visibleMsg:false, // 修改电话与邮箱
            visiblePass:false,// 修改密码
            confirmLoading:false,
            updatetype:"",
        }
        this.menuItemClick.bind(this);
    }
    // 显示更新密码验证模态框
    showModal(type){
        this.setState({ visible: true,updatetype:type });
    }
    handleCancel = (form) => {
        this.setState({ visible: false,confirmLoading:false });
        form.resetFields();
    }
    // 显示更新电话号与邮箱模态框
    handleUpdateCancel = () => {
        this.setState({ visibleMsg: false });
    }
    // 密码验证
    handleOk = (form) =>{
        form.validateFields((err, values)=>{
            if(values.password&&md5(values.password) === this.state.user.password){
                this.setState({ visible: false,visibleMsg: true});
            }else{
                message.error("错误：密码不正确，请核对后输入");
            }
            form.setFieldsValue({"password":""});
        })
    };
    // 邮箱更新
    handleUpdateOk = async (values) => {
        this.setState({confirmLoading:true})
        values._id = this.state.user._id;
        this.setState({ visibleMsg: false,confirmLoading:false });
        const result = await reqUserUpdate(values);
        if(result&&result.status === 10013){
            this.setState({ visibleMsg: false,confirmLoading:false });
            let user = this.state.user;
            if(this.state.updatetype === "email"){
                user.email = values.email;   
                message.success("成功: 邮箱已更改 请刷新页面");
            }else if(this.state.updatetype === "phone"){
                user.phone = values.phone;
                message.success("成功: 手机号已更改 请刷新页面");
            }
            this.setState(user);
            userInfo.removeUser();
            userInfo.saveUser(user);
        }
    }
    // 密码修改模态框隐藏
    handleChangeCancel = () => {
        this.setState({visiblePass:false});
    }
    // 操作
    handleChangePass = async(values,form) => {
        this.setState({confirmLoading:true})
        values._id = this.state.user._id;
        const result = await reqUserUpdate(values);
        if(result && result.status === 10013){
            message.success(`成功: ${result.msg}`)
            this.setState({visiblePass:false,confirmLoading:false})
            form.resetFields();
            let user = this.state.user;
            user.password = md5(values.password);
            this.setState(user);
            userInfo.removeUser();
            userInfo.saveUser(user);
        }
    }
    // 更新数据
    UpdateUserInfo(){
        this.setState({btnloading:true})
        this.props.form.validateFields(async(err, values) => {
            values._id = this.state.user._id;
            let result = await reqUserUpdate(values)
            if(result&&result.status === 10013){
                this.setState({btnloading:false})
                Modal.success({
                    title: `提示：${result.msg}`,
                    content: (
                      <div>
                        <p>用户更新成功,请重新登录</p>
                      </div>
                    ),
                    onOk:() => {
                        message.info("用户已退出");
                        this.props.exit();
                        this.props.history.replace('/login')
                    }
                });
            }
        })
    }
    // 更新头像
    uploadImg = async (file) => {
        const result = file.file.response;
        if(result && result.status === 1001){
            let headImg = "/"+result.data.url;
            console.log(result);
            const data = await reqUserUpdate({_id:this.state.user,headImg})
            if(data && data.status === 10013){
                let user = this.state.user;
                user.headImg = headImg;
                this.setState(user);
                userInfo.removeUser();
                userInfo.saveUser(user);
            }
        }
    }
    // 侧边栏点击触发tabs
    menuItemClick(item){
        this.setState({itemCount:item.key})
    }
    render(){
        let { itemCount,user,btnloading,visible,confirmLoading,visibleMsg,updatetype,visiblePass } = this.state;
        const { getFieldDecorator } = this.props.form;
        return(
            <div className="setting">
                <Row span={24}>
                    <Col className="setting_wrap" span={6} md={0} lg={6}>
                        <Card title={<span><Icon type="setting" style={{marginRight:5}}/>个人设置</span>}>
                            <Menu defaultSelectedKeys={['1']} onClick={(item)=>{this.menuItemClick(item)}}>
                                <Menu.Item className="menuitem" key="1">
                                    <Icon type="control"/>
                                    基本设置
                                </Menu.Item>
                                <Menu.Item className="menuitem" key="2">
                                    <Icon type="security-scan"/>
                                    安全设置
                                </Menu.Item>
                                <Menu.Item className="menuitem" key="3">
                                    <Icon type="lock"/>
                                    账号绑定
                                </Menu.Item>
                                <Menu.Item className="menuitem" key="4">
                                    <Icon type="notification"/>
                                    消息通知
                                </Menu.Item>
                            </Menu>
                        </Card>
                    </Col>
                    <Col className="setting_wrap" span={18} md={24} lg={18}>
                        <Card
                            hoverable={true}
                        >
                            <Tabs tabBarStyle={{display:"none"}} activeKey={itemCount}>
                                <TabPane className="setting_pane" tab="基本设置" key="1">
                                    <h2>基本设置</h2>
                                    <Form>
                                        <Row span={24}>
                                            <Col span={12} className="setting_col">
                                                <Form.Item label="用户名">
                                                    {getFieldDecorator('username', {
                                                        initialValue:user.username
                                                    })(<Input disabled={true} autoComplete="off" type="text"/>)}
                                                </Form.Item>
                                                <Form.Item label="昵称">
                                                    {getFieldDecorator('name', {
                                                        initialValue:user.name,
                                                        rules: [
                                                            {
                                                                required: true,
                                                                message: '请输入你的昵称',
                                                            },
                                                        ],
                                                    })(<Input autoComplete="off"/>)}
                                                </Form.Item>
                                                <Form.Item label="邮箱">
                                                    {getFieldDecorator('email', {
                                                        initialValue:user.email,
                                                    })(<Input disabled={true} autoComplete="off" type="email"/>)}
                                                </Form.Item>
                                                <Form.Item label="手机号">
                                                    {getFieldDecorator('phone', {
                                                        initialValue:user.phone,
                                                    })(<Input disabled={true} autoComplete="off" type="tel"/>)}
                                                </Form.Item>
                                                <Form.Item label="个人介绍">
                                                    {getFieldDecorator('synopsis', {
                                                        initialValue:user.synopsis,
                                                    })(<TextArea autoComplete="off" rows={4} />)}
                                                </Form.Item>
                                                <Form.Item>
                                                    <Button type="primary" loading={btnloading} onClick={()=>{this.UpdateUserInfo()}}>更新基本信息</Button>
                                                </Form.Item>
                                            </Col>
                                            <Col span={11} className="setting_col">
                                                <Form.Item label="头像">
                                                    <Avatar size={100} shape="square" src={user.headImg}></Avatar>
                                                    <div style={{margin:"16px 0"}}>
                                                        <Upload
                                                            key = {Math.random()}
                                                            action="/api/upload/file" // 上传图片的地址
                                                            accept="image/*" // 允许 image图片的任何类型
                                                            name='file'
                                                            method="post"
                                                            onChange = {this.uploadImg}
                                                        >
                                                            <Button><Icon type="picture" />修改头像</Button>
                                                        </Upload>
                                                    </div>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Form>
                                </TabPane>
                                <TabPane className="setting_pane" tab="安全设置" key="2">
                                    <h2>安全设置</h2>
                                    <Row span={24} style={{padding:"0 16px"}}>
                                        <Col span={22}>
                                            <h4 style={{fontWeight:700}}>账户密码</h4>
                                            <p>绑定手机和邮箱，并设置密码，帐号更安全</p>
                                        </Col>
                                        <Col span={2} style={{height:50,lineHeight:"50px"}}>
                                            <a onClick={()=>{this.setState({visiblePass:true})}}>修改</a>
                                        </Col>
                                        <Divider/>
                                    </Row>
                                    <Row span={24} style={{padding:"0 16px"}}>
                                        <Col span={22}>
                                            <h4 style={{fontWeight:700}}>绑定手机</h4>
                                            <p>已绑定手机号：{user.phone}</p>
                                        </Col>
                                        <Col span={2} style={{height:50,lineHeight:"50px"}}>
                                            <a onClick={()=>{this.showModal("phone"); return false}}>修改</a>
                                        </Col>
                                        <Divider/>
                                    </Row>
                                    <Row span={24} style={{padding:"0 16px"}}>
                                        <Col span={22}>
                                            <h4 style={{fontWeight:700}}>绑定邮箱</h4>
                                            <p>已绑定邮箱：{user.email}</p>
                                        </Col>
                                        <Col span={2} style={{height:50,lineHeight:"50px"}}>
                                            <a onClick={()=>{this.showModal("email"); return false}}>修改</a>
                                        </Col>
                                        <Divider/>
                                    </Row>
                                    <Row span={24} style={{padding:"0 16px"}}>
                                        <Col span={22}>
                                            <h4 style={{fontWeight:700}}>密保问题</h4>
                                            <p>未设置密保问题，密保问题可有效保护账户安全</p>
                                        </Col>
                                        <Col span={2} style={{height:50,lineHeight:"50px"}}>
                                            <a >暂不支持设置</a>
                                        </Col>
                                        <Divider/>
                                    </Row>
                                    <Row span={24} style={{padding:"0 16px"}}>
                                        <Col span={22}>
                                            <h4 style={{fontWeight:700}}>个性域名</h4>
                                            <p>未设置个性域名，个性域名可快速访问个人网站</p>
                                        </Col>
                                        <Col span={2} style={{height:50,lineHeight:"50px"}}>
                                            <a href="">暂不支持设置</a>
                                        </Col>
                                    </Row>
                                </TabPane>
                                <TabPane className="setting_pane" tab="账号绑定" key="3">
                                    <h2>账号绑定</h2>
                                    <Row span={24} style={{padding:"0 16px"}}>
                                        <Col span={22}>
                                            <h4 style={{fontWeight:700}}>
                                                <span><Avatar size="small" src={Wechat}/><span style={{marginLeft:8}}>微信</span></span>
                                            </h4>
                                            <p>当前未绑定微信账号</p>
                                        </Col>
                                        <Col span={2} style={{height:50,lineHeight:"50px"}}>
                                            <a>暂不支持绑定</a>
                                        </Col>
                                        <Divider/>
                                    </Row>
                                    <Row span={24} style={{padding:"0 16px"}}>
                                        <Col span={22}>
                                            <h4 style={{fontWeight:700}}>
                                                <span><Avatar size="small" src={QQ}/><span style={{marginLeft:8}}>QQ</span></span>
                                            </h4>
                                            <p>当前未绑定QQ账号</p>
                                        </Col>
                                        <Col span={2} style={{height:50,lineHeight:"50px"}}>
                                            <a>暂不支持绑定</a>
                                        </Col>
                                        <Divider/>
                                    </Row>
                                    <Row span={24} style={{padding:"0 16px"}}>
                                        <Col span={22}>
                                            <h4 style={{fontWeight:700}}>
                                                <span><Avatar size="small" src={Github}/><span style={{marginLeft:8}}>Github</span></span>
                                            </h4>
                                            <p>当前未绑定Github账号</p>
                                        </Col>
                                        <Col span={2} style={{height:50,lineHeight:"50px"}}>
                                            <a>暂不支持绑定</a>
                                        </Col>
                                        <Divider/>
                                    </Row>
                                    <Row span={24} style={{padding:"0 16px"}}>
                                        <Col span={22}>
                                            <h4 style={{fontWeight:700}}>
                                                <span><Avatar size="small" src={Microblog}/><span style={{marginLeft:8}}>微博</span></span>
                                            </h4>
                                            <p>当前未绑定微博账号</p>
                                        </Col>
                                        <Col span={2} style={{height:50,lineHeight:"50px"}}>
                                            <a >暂不支持绑定</a>
                                        </Col>
                                        <Divider/>
                                    </Row>
                                </TabPane>
                                <TabPane className="setting_pane" tab="消息通知" key="4">
                                    <h2>消息通知</h2>
                                    <Row span={24} style={{padding:"0 16px"}}>
                                        <Col span={22}>
                                            <h4 style={{fontWeight:700}}>
                                                系统消息
                                            </h4>
                                            <p>系统消息将以站内信的形式通知</p>
                                        </Col>
                                        <Col span={2} style={{height:50,lineHeight:"50px"}}>
                                            <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked/>
                                        </Col>
                                        <Divider/>
                                    </Row>
                                </TabPane>
                            </Tabs>
                        </Card>
                    </Col>
                </Row>
                <Attsetation visible={visible} handleCancel={this.handleCancel} handleOk={this.handleOk}/>
                <Update visible={visibleMsg} type={updatetype} user={user} confirmLoading={confirmLoading} handleCancel={this.handleUpdateCancel} handleOk={this.handleUpdateOk}/>
                <ChangePass visible={visiblePass} handleCancel={this.handleChangeCancel} confirmLoading={confirmLoading} user={user} handleOk={this.handleChangePass}/>
            </div>
        )
    }
}
export default connect(
    state => ({user:state.user}),{exit}
)(Form.create()(Setting))