import React,{Component} from 'react'
import { Form, Row, Col, Input, Button, Icon, DatePicker } from 'antd';

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
            if(!values.createTime){
                values.createTime = []
            }
            this.props.OpenSearch(values,this.props.type);
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
                        <Col span={5}>
                            <Form.Item label="操作人员">
                                {getFieldDecorator("user", {
                                    initialValue:"",
                                })(<Input allowClear placeholder="请输入操作人员" autoComplete='off' />)}
                            </Form.Item>
                        </Col>
                        <Col span={5}>
                            <Form.Item label="请求类型">
                                {getFieldDecorator("request", {
                                    initialValue:"",
                                })(<Input allowClear placeholder="请输入请求类型" autoComplete='off' />)}
                            </Form.Item>
                        </Col>
                        <Col span={5} style={{ display: expand=== false?'none':'block' }}>
                            <Form.Item label="IP">
                                {getFieldDecorator("ip", {
                                    initialValue:"",
                                })(<Input allowClear placeholder="请输入IP" autoComplete='off' />)}
                            </Form.Item>
                        </Col>
                        <Col span={6} style={{ display: expand=== false?'none':'block' }}>
                            <Form.Item label="操作地点">
                                {getFieldDecorator("ipAddress", {
                                    initialValue:"",
                                })(<Input allowClear placeholder="请输入操作地点" autoComplete='off' />)}
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