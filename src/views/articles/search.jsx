import React,{Component} from 'react'
import { Form, Row, Col, Input, Button, Icon, DatePicker, Select } from 'antd';
import { reqTypeFind } from '../../api'

const { Option } = Select;
const { RangePicker } = DatePicker;
class Search extends Component{
    constructor(){
        super();
        this.state = {
            expand: false,
            typeList: [],
        };
    }
    // 查询
    handleSearch = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!values.createTime){
                values.createTime = []
            }
            if(!values.status) values.status = "";
            if(!values.typeId) values.typeId = "";
            this.props.OpenSearch(values);
        });
    };
    async getTypeList(){
        const result = await reqTypeFind();
        if(result && result.status === 10014){
            this.setState({typeList:result.data})
        }
    }
    componentDidMount(){
        this.getTypeList();
    }
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
        let { expand,typeList } = this.state;
        return (
            <div>
                <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
                    <Row gutter={24}>
                        <Col span={4}>
                            <Form.Item label="文章名称">
                                {getFieldDecorator("name", {
                                    initialValue:"",
                                })(<Input allowClear placeholder="请输入文章名称" autoComplete='off' />)}
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item label="描述">
                                {getFieldDecorator("desc", {
                                    initialValue:"",
                                })(<Input allowClear placeholder="请输入文章描述" autoComplete='off' />)}
                            </Form.Item>
                        </Col>
                        <Col span={4} style={{ display: expand=== false?'none':'block' }}>
                            <Form.Item label="作者">
                                {getFieldDecorator("author", {
                                    initialValue:"",
                                })(<Input allowClear placeholder="作者" autoComplete='off' />)}
                            </Form.Item>
                        </Col>
                        <Col span={4} style={{ display: expand=== false?'none':'block' }}>
                            <Form.Item  label="状态">
                                {getFieldDecorator("status", {
                                })(
                                    <Select
                                        placeholder="请选择状态" 
                                        allowClear
                                    >
                                        <Option value="true">正常</Option>
                                        <Option value="false">禁用</Option>
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={4} style={{ display: expand=== false?'none':'block' }}>
                            <Form.Item  label="类型">
                                {getFieldDecorator("typeId", {
                                })(
                                    <Select placeholder="请选择状态"  allowClear >
                                        {
                                            typeList.map((item)=>{
                                                return  <Option key={item._id} value={item._id}>{item.name}</Option>
                                            })
                                        }
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