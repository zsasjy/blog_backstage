import React,{Component} from 'react'
import {Modal,Form,Input,Select} from 'antd'

const {TextArea} = Input;
const {Option} = Select;

class UpdateOrAdd extends Component{
    handleOk(value){
        let type = !!value?"update":"add";
        this.props.form.validateFields((err,values)=>{
            if(values.name&&values.content&&values.author&&values.type){
                this.props.handleOk(this.props.form,values,type);
                
            }
        })
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
                title={this.props.notice._id?"公告修改":"公告添加"}
                visible={this.props.visible}
                onOk={()=>{this.handleOk(this.props.notice._id)}}
                okText = "提交"
                confirmLoading={this.props.confirmLoading}
                onCancel={()=>{this.props.handleCancel(this.props.form)}}>
                <Form {...formItemLayout}>
                    <Form.Item label="公告标题" >
                        {getFieldDecorator('name', {
                            initialValue:`${!!this.props.notice.name?this.props.notice.name:""}`,
                            rules: [
                                {
                                    required: true,
                                    message: '请输入公告标题',
                                }
                            ],
                        })(<Input allowClear autoComplete="off"/>)}
                    </Form.Item>
                    <Form.Item label="公告内容" >
                        {getFieldDecorator('content', {
                            initialValue:`${!!this.props.notice.content?this.props.notice.content:""}`,
                            rules: [
                                {
                                    required: true,
                                    message: '请输入公告内容',
                                }
                            ],
                        })(<TextArea style={{resize:"none"}} rows={4} allowClear />)}
                    </Form.Item>
                    <Form.Item label="作者" >
                        {getFieldDecorator('author', {
                            initialValue:`${!!this.props.notice.author?this.props.notice.author:""}`,
                            rules: [
                                {
                                    required: true,
                                    message: '请输入作者',
                                }
                            ],
                        })(<Input allowClear autoComplete="off"/>)}
                    </Form.Item>
                    <Form.Item label="类型">
                        {getFieldDecorator('type', {
                            initialValue:`${!!this.props.notice.type?this.props.notice.type:""}`,
                            rules: [
                                {
                                    required: true,
                                    message: '请设置公告类型',
                                },
                            ],
                        })(
                            <Select allowClear>
                                <Option value="通知">通知</Option>
                                <Option value="公告">公告</Option>
                            </Select>
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        )
    }
}
export default Form.create()(UpdateOrAdd);