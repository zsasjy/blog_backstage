import React, { Component } from 'react';
import {Form, Steps, Button, Tabs, Card,Input,Popover,message,Radio, Upload, Icon, Result, Row, Col } from 'antd'
import './index.less'
import { reqRoleStatusFind,reqSendEmail,reqSignup} from '../../api'
import { Link } from 'react-router-dom';
const { Step } = Steps;
const { TabPane } = Tabs;
class SignUp extends Component{
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            updateImgUrl:"",
            roles:[],
            codeShow:false,
            code:-16516004561,
            result:true,
            loading:false
        };
    }
    testing = () => {
        const { validateFields } = this.props.form;
        validateFields(['username','password','name','phone','email','sex'],(err,values)=>{
            let reg = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9])+.)+([a-zA-Z0-9]{2,4})+$/;
            if(values.email && reg.test(values.email) && values.username && values.password && values.name && values.phone){
                this.next();
                this.props.form.setFieldsValue({testEmail:values.email})
            }
        })
    }
    signup = () => {
        this.setState({loading:true})
        this.props.form.validateFields( async (err,values)=>{
            if(parseInt(values.code) === this.state.code){
                if(values.email && values.username && values.password && values.name && values.phone){
                    const roles = await reqRoleStatusFind();
                    if(roles && roles.status === 10014){
                        for(let i in roles.data){
                            if((roles.data[i].power === 'ROLE_USER' || roles.data[i].power === 'ROLE_COMMON') && roles.data[i].name === '普通用户'){
                                let role = roles.data[i]._id;
                                values.role = role;
                                const result = await reqSignup({...values});
                                if(result && result.status === 10011){
                                    this.setState({result:true,loading:false})
                                    this.next();
                                    this.props.form.resetFields()
                                    return;
                                }
                            }
                        }
                    }
                }
            }else{
                message.error("错误: 验证码不正确,请核对后填写")
            }
        })
    }
    uploadImg = (file) => {
        const result = file.file.response;
        if(result && result.status === 1001){
            this.setState({updateImgUrl:"/"+result.data.url});
            this.props.form.setFieldsValue({"headImg":this.state.updateImgUrl});
        }
    }
    async initRole(){
        const result = await reqRoleStatusFind();
        if(result && result.status === 10014){
            this.setState({roles:result.data})
        }
    }
    getEmailCode = async(e) => {
        let time = 60;
        let timer = null;
        let target = e.target;
        let email = this.props.form.getFieldValue("testEmail");
        this.setState({codeShow:true});
        if(email){
            clearInterval(timer);
            timer = setInterval(()=>{
                target.innerText = time +'s后获取';
                if(time <= 0){
                    target.innerText = '获取验证码';
                    this.setState({codeShow:false});
                    clearInterval(timer);
                }
                time--;
            },1000)
            const result = await reqSendEmail(email);
            if(result && result.status===1001){
                clearInterval(timer);
                message.success(result.msg);
                this.setState({code:result.code,codeShow:false})
                target.innerText = '获取验证码'
            }
        }else{
            message.error("错误: 请完善邮箱地址");
        }
    }
    componentDidMount(){
        this.initRole();
    }
    next() {
        const current = this.state.current + 1;
        this.setState({ current });
    }
    prev() {
        const current = this.state.current - 1;
        this.setState({ current });
    }
    render(){
        const { current,updateImgUrl,codeShow,loading} = this.state;
        const steps = ["注册账户","验证邮箱","完成"];
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 3 },
                sm: { span: 3 },
            },
            wrapperCol: {
                xs: { span: 21 },
                sm: { span: 21 },
            },
        };
        return(
            <div className="signup">
                <div className="container">
                    <h2>注册用户</h2> 
                    <Steps className="steps" current={current}>
                        {steps.map(item => (
                            <Step key={item} title={item} />
                        ))}
                    </Steps>
                    <div className="content">
                    <Tabs style={{marginTop:20}} tabBarStyle={{display:"none"}} defaultActiveKey="0" activeKey={`${current}`}>
                        <TabPane tab="注册账户" key="0">
                            <Card className="card">
                                <Form {...formItemLayout}>
                                    <Form.Item label="用户名" >
                                        {getFieldDecorator('username', {
                                            initialValue:"",
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入你的用户名',
                                                }
                                            ],
                                        })(<Input allowClear autoComplete="off"/>)}
                                    </Form.Item>
                                    <Form.Item label="密码">
                                        {getFieldDecorator('password', {
                                            initialValue:"",
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入你的密码',
                                                }
                                            ],
                                        })(<Input.Password allowClear autoComplete="off"/>)}
                                    </Form.Item>
                                    <Form.Item label="昵称">
                                        {getFieldDecorator('name', {
                                            initialValue:"",
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入你的昵称',
                                                }
                                            ],
                                        })(<Input allowClear autoComplete="off"/>)}
                                    </Form.Item>
                                    <Form.Item label="邮箱">
                                        {getFieldDecorator('email', {
                                            initialValue:"",
                                            rules: [
                                            {
                                                type: 'email',
                                                message: '输入的邮件地址无效！！!',
                                            },
                                            {
                                                required: true,
                                                message: '请输入你的邮箱地址',
                                            },
                                            ],
                                        })(<Input allowClear autoComplete="off"/>)}
                                    </Form.Item>
                                    <Form.Item label="手机号">
                                        {getFieldDecorator('phone', {
                                            initialValue:"",
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入你的手机号',
                                                },
                                            ],
                                        })(<Input allowClear type="tel" autoComplete="off"/>)}
                                    </Form.Item>
                                    <Form.Item label="性别">
                                        {getFieldDecorator('sex',{
                                            initialValue:"",
                                            rules: [
                                                {
                                                    required: true,
                                                }
                                            ],
                                        })(
                                            <Radio.Group>
                                                <Radio value="男">男</Radio>
                                                <Radio value="女">女</Radio>
                                            </Radio.Group>
                                        )}
                                    </Form.Item>
                                    <Form.Item label="头像">
                                        {getFieldDecorator('headImg', {
                                            initialValue:"",
                                        })(
                                            <Input allowClear style={{width:"70%"}} addonAfter={
                                                <Popover content={(<img style={{maxWidth:300}} src={this.state.updateImgUrl} alt="无效的图片连接"/>)} title="头像">
                                                    <Icon type="eye" theme="filled" />
                                                </Popover>
                                            } autoComplete="off"/>
                                        )}
                                        <Upload 
                                            key = {Math.random()}
                                            action="/api/upload/file" // 上传图片的地址
                                            accept="image/*" // 允许 image图片的任何类型
                                            name='file'
                                            method="post"
                                            disabled = {updateImgUrl===""?false:true}
                                            onChange = {this.uploadImg}
                                        >
                                            <Button disabled = {updateImgUrl===""?false:true} style={{marginLeft:5}}>
                                                <Icon type="upload" /> 上传图片
                                            </Button>
                                        </Upload>
                                    </Form.Item>
                                </Form>
                            </Card>
                        </TabPane>
                        <TabPane tab="验证邮箱" key="1">
                            <Card style={{width:"55%"}} className="card">
                                <Form {...formItemLayout}>
                                    <Form.Item label="邮箱">
                                        {
                                            getFieldDecorator("testEmail",{
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
                                    <Form.Item label="验证码">
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
                                            <Col span={8} style={{marginLeft:15}}>
                                                <Button disabled={codeShow} onClick={(e)=>{this.getEmailCode(e)}}>获取验证码</Button>
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                </Form>
                            </Card>
                        </TabPane>
                        <TabPane tab="完成" key="2">
                            <Card className="card">
                            <Result
                                status="success"
                                title="注册成功"
                                subTitle="注册成功，返回登录页面进行登录"
                                extra={[
                                <Button type="primary" key="console">
                                    <Link to='/login'>返回登录</Link>
                                </Button>
                                ]}
                            />
                            </Card>
                        </TabPane>
                    </Tabs>
                    </div>
                    <div className="steps-action">
                        {current < steps.length - 2 && (
                            <Button type="primary" onClick={() => this.testing()}>
                                下一步
                            </Button>
                        )}
                        {current === steps.length - 2 && (
                            <Button loading={loading} type="primary" onClick={() => this.signup()}>
                                注册
                            </Button>
                        )}
                        {current > 0 && current < steps.length - 1 && (
                            <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                                上一步
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        )
    }
}

export default Form.create()(SignUp)