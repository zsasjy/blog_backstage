import React, { Component } from 'react';
import { Redirect,Link } from 'react-router-dom'
import { Icon,Form, Input, Button, Card ,Checkbox ,message ,Row, Col ,Tabs} from 'antd'
import {login,emailLogin} from '../../store/action'
import {connect} from 'react-redux'
import {reqSendEmail,reqImageCode} from '../../api'
// 图片
import './index.less'

const {TabPane} = Tabs;
class Login extends Component{
    constructor(){
        super()
        this.state = {
            code:1,
            visiblehelp: false,
            visibleabout: false,
            confirmLoading: false,
            viewCode: false,// 按钮失效
            loginLoad:false, // 登录loading
            codeImg:"",//图形验证码
            Img:"", // 图形
        }
    }
    // 登陆
    handleSubmit = async () => {
        let {codeImg} = this.state;
        this.setState({loginLoad:true});
        const { validateFields } = this.props.form;
        validateFields(['username','password','codeImg'],(err,values)=>{
            if(codeImg){
                if(values.codeImg.toUpperCase() === codeImg.toUpperCase()){
                    this.props.login(values);
                    setTimeout(()=>{
                        this.setState({loginLoad:false});
                    },2000)
                }else{
                    message.warning("验证码不正确,请核对后填写");
                    this.setState({loginLoad:false});
                }
            }else{
                message.warning("请输入验证码");
            }
            this.initImageCode();
        });
    };
    loginEmail = () => {
        this.setState({loginLoad:true});
        const { validateFields } = this.props.form;
        const {code} = this.state;
        validateFields(['email','code'],(err,values)=>{
            if(code){
                if(values.code === code.toString()){
                    this.props.emailLogin(values);
                    setTimeout(()=>{
                        this.setState({loginLoad:false});
                    },2000)
                }else{
                    message.warning("验证码不正确,请核对后填写");
                    this.setState({loginLoad:false});
                }
            }else{
                message.warning("请输入验证码");
            }
        });
    }
    // 邮箱
    handleCode = e => {
        let timer = null;
        let time = 60;
        const target = e.target;
        let email = this.props.form.getFieldValue('email');
        let reg = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9])+.)+([a-zA-Z0-9]{2,4})+$/;
        if(reg.test(email)){
            this.setState({viewCode:true});
            this.getEmailCode(email);
            clearInterval(timer);
            timer = setInterval(()=>{
                target.innerText = time +'s后获取';
                if(time <= 0){
                    target.innerText = '获取验证码';
                    this.setState({viewCode:false})
                    clearInterval(timer);
                }
                time--;
            },1000)
        }else{
            message.error("请输入正确的邮箱地址");
        }
    }
    async initImageCode(){
        const result = await reqImageCode();
        if(result && result.status === 10011){
            this.setState({Img:result.data,codeImg:result.text})
        }
    }
    async getEmailCode(email){
        const result = await reqSendEmail(email);
        if(result && result.status === 1001){
            this.setState({code:result.code})
        }
    }
    UNSAFE_componentWillMount(){
        document.title = `登录 - 网站后台管理系统`;
    }
    componentDidMount(){
        this.initImageCode();
    }
    render(){
        let user = this.props.user;
        if(user.username || user._id){
            return <Redirect to='/'/>
        }
        const { getFieldDecorator } = this.props.form;
        const { Img, viewCode, loginLoad } = this.state;
        return(
            <div className='login'>
                <div className="login_wrap">
                    <Card>
                        <h2 className="login_title">网站后台管理系统</h2>
                        <Tabs defaultActiveKey="1">
                            <TabPane tab={<span><Icon type="mobile" />账号密码登录</span>} key="1">
                            <Form className="login-form">
                                <Form.Item>
                                {getFieldDecorator('username', {
                                    rules: [{ required: true, message: '请输入你的用户名!' }],
                                })(
                                    <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="用户名"
                                    autoComplete="off"
                                    />,
                                )}
                                </Form.Item>
                                <Form.Item>
                                {getFieldDecorator('password', {
                                    
                                    rules: [{ required: true, message: '请输入你的密码!' }],
                                })(
                                    <Input.Password
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="密码"
                                    autoComplete="off"
                                    />,
                                )}
                                </Form.Item>
                                <Form.Item>
                                    <Row span={24}>
                                        <Col span={15}>
                                        {
                                            getFieldDecorator("codeImg",{
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请输入验证码',
                                                    }
                                                ],
                                            })(<Input placeholder="验证码" allowClear autoComplete="off"/>)
                                        }
                                        </Col>
                                        <Col span={8} style={{cursor:"pointer",height:50}} onClick={()=>{this.initImageCode()}} dangerouslySetInnerHTML={{__html: Img}}>
                                        </Col>
                                    </Row>
                                </Form.Item>
                                <Form.Item style={{margin:"-20px 0"}}>
                                    <Checkbox>记住我</Checkbox>
                                    <Link style={{float:"right"}} to='/signup'> > 注册用户</Link>
                                </Form.Item>
                                <Form.Item>
                                    <Button loading={loginLoad} onClick={()=>{this.handleSubmit()}} style={{width:"100%"}} type="primary" htmlType="submit">
                                        登录
                                    </Button>
                                </Form.Item>
                            </Form>
                            </TabPane>
                            <TabPane tab={<span><Icon type="mail" />邮箱地址登录</span>} key="2">
                                <Form>
                                    <Form.Item >
                                        {
                                            getFieldDecorator("email",{
                                                initialValue:"",
                                                rules: [
                                                    {
                                                        type: 'email',
                                                        message: '请输入正确的邮箱地址',
                                                    },
                                                    {
                                                        required: true,
                                                        message: '请输入您的邮箱地址',
                                                    },

                                                ],
                                            })(<Input allowClear placeholder="请输入您的邮箱地址" autoComplete="off"/>)
                                        }
                                    </Form.Item>
                                    <Form.Item>
                                        <Row span={24}>
                                            <Col span={15}>
                                            {
                                                getFieldDecorator("code",{
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: '请输入验证码',
                                                        }
                                                    ],
                                                })(<Input placeholder="点击获取邮箱验证码" allowClear autoComplete="off"/>)
                                            }
                                            </Col>
                                            <Col span={8} style={{marginLeft:14}}>
                                                <Button style={{height:38,width:"100%"}} disabled={viewCode} onClick={(e)=>{this.handleCode(e)}}>获取验证码</Button>
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                    <Form.Item style={{margin:"-20px 0"}}>
                                        <Checkbox>记住我</Checkbox>
                                        <Link style={{float:"right"}} to='/signup'> > 注册用户</Link>
                                    </Form.Item>
                                    <Form.Item>
                                        <Button loading={loginLoad} style={{width:"100%"}} type="primary" onClick={()=>{this.loginEmail()}}>
                                            登录
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </TabPane>
                        </Tabs>
                    </Card>
                </div>
                <footer>
                    <p>
                        <a href='http://www.beian.miit.gov.cn/'>冀ICP备19032012号</a>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
                        Copyright © 2020.supernatant.cn All rights reserved
                    </p>
                </footer>
            </div>
        )
    }
}

const FormLogin = Form.create()(Login)
export default connect(
    state => ({user:state.user}),
    {login,emailLogin}
)(FormLogin)