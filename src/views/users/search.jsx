import React,{Component} from 'react'
import { Form, Row, Col, Input, Button, Icon, DatePicker, Select } from 'antd';
const { Option } = Select;

const { RangePicker } = DatePicker;
class Search extends Component{
    constructor(){
        super();
        this.state = {
            expand: false,
        };
    }
    // 查询
    handleSearch = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(values);
            this.props.OpenSearch(values);
        });
    };
    // 清空
    handleReset = () => {
        this.props.form.resetFields();
    };
    // 切换 收起与展开
    toggle = () => {
        const { expand } = this.state;
        this.setState({ expand: !expand });
    };
    render(){
        const { getFieldDecorator } = this.props.form;
        let { expand } = this.state;
        return (
            <div>
                <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
                    <Row gutter={24}>
                        <Col span={4}>
                            <Form.Item label="用户名">
                            {getFieldDecorator("username", {
                                initialValue:"",
                            })(<Input allowClear placeholder="请输入用户名" autoComplete='off' />)}
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label="昵称">
                            {getFieldDecorator("name", {
                                initialValue:"",
                            })(<Input allowClear placeholder="请输入昵称" autoComplete='off' />)}
                            </Form.Item>
                        </Col>
                        <Col span={4} style={{ display: expand=== false?'none':'block' }}>
                            <Form.Item label="手机号">
                                {getFieldDecorator("phone", {
                                    initialValue:"",
                                })(<Input allowClear placeholder="请输入手机号" autoComplete='off' />)}
                            </Form.Item>
                        </Col>
                        <Col span={4} style={{ display: expand=== false?'none':'block' }}>
                            <Form.Item label="邮箱">
                                {getFieldDecorator("email", {
                                    initialValue:"",
                                })(<Input allowClear placeholder="请输入邮箱" autoComplete='off' />)}
                            </Form.Item>
                        </Col>
                        <Col span={4} style={{ display: expand=== false?'none':'block' }}>
                            <Form.Item label="状态">
                                {getFieldDecorator("status", {
                                })(
                                    <Select allowClear placeholder="请选择" >
                                        <Option value="true">开启</Option>
                                        <Option value="false">禁用</Option>
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={4} style={{ display: expand=== false?'none':'block' }}>
                            <Form.Item label="性别">
                                {getFieldDecorator("sex", {
                                })(
                                    <Select allowClear placeholder="请选择" >
                                        <Option value="男">男</Option>
                                        <Option value="女">女</Option>
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={6} style={{ display: expand=== false?'none':'block' }}>
                            <Form.Item label="创建日期">
                                {getFieldDecorator("createTime", {
                                    initialValue:"",
                                })(
                                    <RangePicker placeholder={['开始时间', '结束时间']}/>
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={5} style={{marginTop:4.5}}>
                            <Button type="primary" htmlType="submit">
                            查询
                            </Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                            清空
                            </Button>
                            <Button type="link" style={{ marginLeft: 8, fontSize: 12, padding: 0}} onClick={this.toggle}>
                                {this.state.expand ? '收起' : '展开'} <Icon type={this.state.expand ? 'up' : 'down'} />
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        )
    }
}
export default Form.create()(Search);