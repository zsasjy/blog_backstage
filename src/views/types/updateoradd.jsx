import React,{Component} from 'react'
import { Modal, Form, Input } from 'antd'

class UpdateOrAdd extends Component{
    handleOk = (_id) => {
        let type = !!_id?"update":"add";
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
                title={this.props.type._id?"文章类型修改":"文章类型添加"}
                visible={this.props.visible}
                onOk={()=>{this.handleOk(this.props.type._id)}}
                okText = "提交"
                confirmLoading={this.props.confirmLoading}
                onCancel={()=>{this.props.handleCancel(this.props.form)}}
            >
                <Form {...formItemLayout}>
                    <Form.Item label="名称" >
                        {getFieldDecorator('name', {
                            initialValue:`${!!this.props.type.name?this.props.type.name:""}`,
                            rules: [
                                {
                                    required: true,
                                    message: '请输入请输入文章类型名称',
                                }
                            ],
                        })(<Input allowClear autoComplete="off"/>)}
                    </Form.Item>
                    <Form.Item label="备注">
                        {getFieldDecorator('remarks', {
                            initialValue:`${!!this.props.type.remarks?this.props.type.remarks:""}`,
                        })(<Input allowClear autoComplete="off"/>)}
                    </Form.Item>
                </Form>

            </Modal>
        )
    }
}
export default Form.create()(UpdateOrAdd);