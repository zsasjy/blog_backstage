import React,{Component} from 'react'
import { Modal, Form, Input, Row, Col, Button, message } from 'antd'
import { reqSendEmail } from '../../api'

class Update extends Component{
    constructor(){
        super();
        this.state = {
            code:-11111122331561894154841531518153156456132,
            codeShow:false,
        }
    }
    handleOk = () => {
        this.props.form.validateFields((err,values)=>{
            let reg = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9])+.)+([a-zA-Z0-9]{2,4})+$/;
            if(values.newemail && reg.test(values.newemail)){
                if(values.email!== values.newemail){
                    if(parseInt(values.code) === this.state.code){
                        this.props.handleOk({email:values.newemail});
                        this.props.form.resetFields();
                    }else{
                        message.error("错误: 验证码不正确,请核对后填写")
                    }
                }else{
                    message.warning("警告: 该邮箱已绑定用户");
                }
            }else{
                message.error("错误: 新邮箱填写格式错误");
            }
        })
    };
    getCode = async (e,type) => {
        if(type==="phone"){
            Modal.info({
                title: '提示: 该功能尚未完成,暂不支持该操作',
                content: (
                <div>
                    <p>该功能尚未开发,待完善....</p>
                </div>
                ),
                onOk:()=>{
                    this.props.handleCancel();
                },
            });
        }else if(type==="email"){
            let time = 60;
            let timer = null;
            let target = e.target;
            let email = this.props.form.getFieldValue("email");
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
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        };
        const {codeShow} = this.state
        return(
            <Modal 
                title={`修改${this.props.type==="phone"?"手机号":"邮箱"}`}
                confirmLoading={this.props.confirmLoading}
                visible={this.props.visible}
                onOk={this.handleOk}
                onCancel={this.props.handleCancel}
            >
                <Form {...formItemLayout}>
                    {
                        this.props.type==="phone"?
                        <div>
                            <Form.Item label="手机号">
                                {
                                    getFieldDecorator("phone",{
                                        initialValue:this.props.user.phone,
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入您的手机号',
                                            }
                                        ],
                                    })(<Input allowClear placeholder="请输入新的手机号" autoComplete="off"/>)
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
                                        })(<Input placeholder="点击获取手机验证码" allowClear autoComplete="off"/>)
                                    }
                                    </Col>
                                    <Col span={8} style={{marginLeft:15}}>
                                        <Button onClick={(e)=>{this.getCode(e,"phone")}}>获取验证码</Button>
                                    </Col>
                                </Row>
                            </Form.Item>
                        </div>:
                        <div>
                            <Form.Item label="邮箱">
                            {
                                getFieldDecorator("email",{
                                    initialValue:this.props.user.email,
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
                                })(<Input allowClear placeholder="请输入旧的邮箱地址" autoComplete="off"/>)
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
                                        <Button disabled={codeShow} onClick={(e)=>{this.getCode(e,"email")}}>获取验证码</Button>
                                    </Col>
                                </Row>
                            </Form.Item>
                            <Form.Item label="新邮箱">
                            {
                                getFieldDecorator("newemail",{
                                    rules: [
                                        {
                                            type: 'email',
                                            message: '请输入正确的邮箱地址',
                                        },
                                        {
                                            required: true,
                                            message: '请输入您的新邮箱地址',
                                        }
                                    ],
                                })(<Input allowClear placeholder="请输入新的邮箱地址" autoComplete="off"/>)
                            }
                            </Form.Item>
                        </div>
                        
                    }
                    
                </Form>
            </Modal>
        )
    }
}
export default Form.create()(Update);
// 邮箱和手机号更改验证