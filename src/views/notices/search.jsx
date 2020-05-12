import React,{Component} from 'react'
import { Form, Row, Col, Input, Button, DatePicker, Select } from 'antd';
const { Option } = Select;

const { RangePicker } = DatePicker;
class Search extends Component{
    // 查询
    handleSearch = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!values.createTime){
                values.createTime = []
            }
            this.props.OpenSearch(values);
        });
    };
    // 清空
    handleReset = () => {
        this.props.form.resetFields();
    };
    render(){
        const { getFieldDecorator } = this.props.form;
        return (
            <div style = {{display:this.props.showSearch?"block":"none"}}>
                <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
                    <Row gutter={24}>
                        <Col span={4}>
                            <Form.Item label="标题">
                                {getFieldDecorator("name", {
                                    initialValue:"",
                                })(<Input allowClear placeholder="请输入标题" autoComplete='off' />)}
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label="作者">
                                {getFieldDecorator("author", {
                                    initialValue:"",
                                })(<Input allowClear placeholder="请输入作者" autoComplete='off' />)}
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item  label="类型">
                                {getFieldDecorator("type", {
                                })(
                                    <Select
                                        placeholder="请选择类型" 
                                        allowClear
                                    >
                                        <Option value="true">通知</Option>
                                        <Option value="false">公告</Option>
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={6}>
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
                        </Col>
                    </Row>
                </Form>
            </div>
        )
    }
}
export default Form.create()(Search);