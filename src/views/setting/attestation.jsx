import React,{Component} from 'react'
import { Modal, Icon, Form, Input,  Col, Row } from 'antd'
import './index.less'
class Attestation extends Component{
    handleOk = () => {
        this.props.handleOk(this.props.form);
    };
    render(){
        const { getFieldDecorator } = this.props.form;
        return (
            <Modal
                title="身份验证"
                visible={this.props.visible}
                onOk={this.handleOk}
                onCancel={()=>{this.props.handleCancel(this.props.form)}}
            >
                <Row span={24}>
                    <Col span={24}>
                        <div className="checking">
                            <Icon type="lock" theme="filled" />
                            <div className="title">密码验证</div>
                            <div className="label">请输入您的密码</div>
                            <Form>
                                <Form.Item className="input">
                                    {getFieldDecorator('password', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入您的密码',
                                            }
                                        ],
                                    })(<Input.Password allowClear autoComplete="off"/>)}
                                </Form.Item>
                            </Form>
                        </div>
                    </Col>
                </Row>

            </Modal>
        )
    }
}
export default Form.create()(Attestation);
// 密码验证功能弹出框