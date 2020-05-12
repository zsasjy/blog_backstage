import React,{Component} from 'react'
import {Modal,Form,Input} from 'antd'

class UpdateOrAdd extends Component{
    handleOk(value){
        let type = !!value?"update":"add";
        this.props.handleOk(this.props.form,type);
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
        return (
            <Modal
                title={this.props.role._id?"角色修改":"角色添加"}
                visible={this.props.visible}
                onOk={()=>{this.handleOk(this.props.role._id)}}
                okText = "提交"
                confirmLoading={this.props.confirmLoading}
                onCancel={()=>{this.props.handleCancel(this.props.form)}}>
                <Form {...formItemLayout}>
                    <Form.Item label="角色名称" >
                        {getFieldDecorator('name', {
                            initialValue:`${!!this.props.role.name?this.props.role.name:""}`,
                            rules: [
                                {
                                    required: true,
                                    message: '请输入你的用户名',
                                }
                            ],
                        })(<Input allowClear autoComplete="off"/>)}
                    </Form.Item>
                    <Form.Item label="权限字符" >
                        {getFieldDecorator('power', {
                            initialValue:`${!!this.props.role.power?this.props.role.power:""}`,
                            rules: [
                                {
                                    required: true,
                                    message: '请输入你的用户名',
                                }
                            ],
                        })(<Input allowClear autoComplete="off"/>)}
                    </Form.Item>
                    <Form.Item label="备注" >
                        {getFieldDecorator('remarks', {
                            initialValue:`${!!this.props.role.remarks?this.props.role.remarks:""}`,
                            rules: [
                                {
                                    required: true,
                                    message: '请输入你的用户名',
                                }
                            ],
                        })(<Input allowClear autoComplete="off"/>)}
                    </Form.Item>
                </Form>
            </Modal>
        )
    }
}
export default Form.create()(UpdateOrAdd);