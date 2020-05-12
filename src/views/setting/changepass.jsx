import React,{Component} from 'react'
import { Form, Modal, Input, message } from "antd"
import md5 from 'blueimp-md5'

class ChangePass extends Component{
    handleOk = () =>{
        this.props.form.validateFields((err,values)=>{
            if(md5(values.oldpassword) === this.props.user.password){
                if(values.newpass === values.newpassok){
                    this.props.handleOk({password:values.newpass},this.props.form);
                }else{
                    message.error("错误: 两次密码输入不同")
                }
            }else{
                message.error("错误: 原密码不正确")
            }
        })
    }
    render(){
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 5 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 19 },
            },
        };
        return(
            <Modal 
                title="修改密码"
                confirmLoading={this.props.confirmLoading}
                visible={this.props.visible}
                onOk={this.handleOk}
                onCancel={this.props.handleCancel}
            >
                <Form {...formItemLayout}>
                    <Form.Item label="旧密码">
                    {
                        getFieldDecorator("oldpassword",{
                            rules: [
                                {
                                    required: true,
                                    message: '请输入新的密码',
                                }
                            ],
                        })(<Input.Password allowClear placeholder="请输入原密码" autoComplete="off"/>)
                    }
                    </Form.Item>
                    <Form.Item label="新密码">
                    {
                        getFieldDecorator("newpass",{
                            rules: [
                                {
                                    required: true,
                                    message: '请输入新的密码',
                                }
                            ],
                        })(<Input.Password allowClear placeholder="请输入新的密码" autoComplete="off"/>)
                    }
                    </Form.Item>
                    <Form.Item label="确认新密码">
                    {
                        getFieldDecorator("newpassok",{
                            rules: [
                                {
                                    required: true,
                                    message: '请再一次输入新的密码',
                                }
                            ],
                        })(<Input.Password allowClear placeholder="请再一次输入新的密码" autoComplete="off"/>)
                    }
                    </Form.Item>
                </Form>
            </Modal>
        )
    }
}
export default Form.create()(ChangePass);