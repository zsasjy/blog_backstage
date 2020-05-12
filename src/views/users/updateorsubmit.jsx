import React,{Component} from 'react'
import { Form,Modal,Input,Radio,Upload,Button, Icon, Popover,Switch,Select } from 'antd'
import { reqRoleStatusFind } from '../../api'

const {Option} = Select
class UpdateOrSubmit extends Component{
    constructor(){
        super();
        this.state = {
            title:"",
            updateImgUrl:"",
            email:"",
            roles:[],
        }
    }
    handleOk = (_id) => {
        this.setState({updateImgUrl:""})
        let type = !!_id?"update":"add";
        this.props.handleOk(this.props.form,type);
    }
    async initRole(){
        const result = await reqRoleStatusFind();
        if(result && result.status === 10014){
            this.setState({roles:result.data})
        }
    }
    uploadImg = (file) => {
        const result = file.file.response;
        if(result && result.status === 1001){
            this.setState({updateImgUrl:"/"+result.data.url});
            this.props.form.setFieldsValue({"headImg":this.state.updateImgUrl});
        }
    }
    componentDidMount(){
        this.initRole();
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 4 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 20 },
                sm: { span: 20 },
            },
        };
        const {updateImgUrl,roles} = this.state;
        return (
            <Modal
                title={this.props.user._id?"用户修改":"用户添加"}
                visible={this.props.visible}
                onOk={()=>{this.handleOk(this.props.user._id)}}
                okText = "提交"
                confirmLoading={this.props.confirmLoading}
                onCancel={()=>{this.props.handleCancel(this.props.form)}}
                >
                <Form {...formItemLayout}>
                    <Form.Item label="用户名" >
                        {getFieldDecorator('username', {
                            initialValue:`${!!this.props.user.username?this.props.user.username:""}`,
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
                            initialValue:`${!!this.props.user.password?this.props.user.password:""}`,
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
                            initialValue:`${!!this.props.user.name?this.props.user.name:""}`,
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
                            initialValue:`${!!this.props.user.email?this.props.user.email:""}`,
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
                            initialValue:`${!!this.props.user.phone?this.props.user.phone:""}`,
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
                            initialValue:`${!!this.props.user.sex?this.props.user.sex:"男"}`,
                        })(
                            <Radio.Group>
                                <Radio value="男">男</Radio>
                                <Radio value="女">女</Radio>
                            </Radio.Group>
                        )}
                    </Form.Item>
                    <Form.Item label="头像">
                        {getFieldDecorator('headImg', {
                            initialValue:`${!!this.props.user.headImg?this.props.user.headImg:""}`,
                        })(
                            <Input allowClear style={{width:"70%"}} addonAfter={
                                <Popover content={(<img style={{maxWidth:300}} src={this.state.updateImgUrl===""?this.props.user.headImg:this.state.updateImgUrl} alt="无效的图片连接"/>)} title="头像">
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
                    <Form.Item label="状态" style={{display:this.props.user._id===undefined?"none":"block"}}>
                        {getFieldDecorator('status', { 
                            valuePropName: 'checked', 
                            initialValue:!!this.props.user.status
                    })(<Switch />)}
                    </Form.Item>
                    <Form.Item label="角色">
                        {getFieldDecorator('role', { 
                            initialValue:`${!!this.props.user.role?this.props.user.role:""}`
                    })(<Select >
                        {
                            roles.map((item)=>{
                                return <Option key={item._id} value={item._id}>{item.name}</Option>
                            })
                        }
                    </Select>)}
                    </Form.Item>
                </Form>
            </Modal>
        )
    }
}
export default Form.create()(UpdateOrSubmit);