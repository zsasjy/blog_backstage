import React,{Component} from 'react'
import { Row, Col, Button, Alert, Table, Modal, message, Form, Input, Upload, Icon, Popover} from 'antd'
import moment from 'moment'
import { reqNotesFind,reqNotesDel,reqNotesDelMany,reqNotesAdd} from '../../api'

import './index.less'

const { TextArea } = Input;
const {confirm} = Modal;
class Notes extends Component{
    constructor(){
        super()
        this.state = {
            showAlert:true,
            selectedRowKeys:[],
            dataList:[],
            defaultPage:10,
            tableLoading:false,
            visible:false,
            confirmLoading:false,
            updateImgUrl:""
        }
    }
    closeAlert(e){
        let btnText = this.state.showAlert === true ? "开启提示": "关闭提示"
        e.target.innerText = btnText;
        this.setState({ showAlert : !this.state.showAlert });
    }
    async initNoteList(){
        this.setState({tableLoading:true})
        const result = await reqNotesFind();
        if(result && result.status === 10014){
            for(let i in result.data){
                result.data[i].createTime = moment(result.data[i].createTime).format('YYYY-MM-DD HH:mm:ss');
            }
            this.setState({dataList:result.data,tableLoading:false})
        }
    }
    notesDel = (text,note,index) =>{
        confirm({
            title: '确定删除',
            okType: 'danger',
            content: '你确定要删除该条数据吗',
            onOk:async () => {
                const result = await reqNotesDel(note._id);
                if(result && result.status === 10012){
                    message.success(result.msg);
                    this.initNoteList();
                }
            },
            onCancel() {},
        });
    }
    manyDel = async () => {
        let { selectedRowKeys }= this.state;
        if(selectedRowKeys.length === 0){
            message.warning("请选择要删除的数据！！！")
        }else{
            const result = await reqNotesDelMany({_id:selectedRowKeys});
            if(result && result.status === 10012){
                message.success(result.msg);
                this.initNoteList();
            }
        }
    }
    showModal = () => {
        this.setState({visible:true})
    }
    addNotes = () => {
        this.props.form.validateFields( async (err,values) => {
            if(values.author && values.content){
                this.setState({confirmLoading:true})
                const result = await reqNotesAdd(values);
                if(result && result.status === 10011){
                    message.success(result.msg);
                    this.initNoteList();
                    this.props.form.resetFields();
                    this.setState({visible:false,confirmLoading:false})
                }
            }
        })
    }
    handleCancel = ()=>{
        this.props.form.resetFields();
        this.setState({visible:false})
    }
    componentDidMount(){
        this.initNoteList()
    }
    uploadImg = (file) => {
        const result = file.file.response;
        if(result && result.status === 1001){
            this.setState({updateImgUrl:"/"+result.data.url});
            this.props.form.setFieldsValue({"imgs":this.state.updateImgUrl});
        }
    }
    columns(){
        return [
            {title: '#', dataIndex: 'id',align:'center',key:'id',ellipsis:true, width:50,render:(text,notes,index) => index+1},
            {title: '内容',align:'center',dataIndex: 'content',ellipsis:true,width:300,key:'content',},
            {title: '作者',dataIndex: 'author', align:'center',ellipsis:true,key:'author',width:100,},
            {title: '图片',dataIndex: 'imgs',key:'imgs',align:'center',width:100,
                render: (text) => (<img style={{width:40,height:40,borderRadius:"50%"}} src={text} alt="头像"/>)
            },
            {title: '创建时间',dataIndex: 'createTime',align:'center',ellipsis:true,key: 'createTime',width:250,},
            {title: '操作', align:'center',width:100,
                render: (text,note,index) => (
                    <div>
                        <Button size="small" type="danger" onClick={()=>{this.notesDel(text,note)}}>删除</Button>
                    </div>
                )
            }
        ]
    }

    render(){
        let {showAlert,selectedRowKeys,dataList,defaultPage,tableLoading,visible,confirmLoading,updateImgUrl} = this.state 
        const columns = this.columns();
        const rowSelection = {
            onChange: (selectedRowKeys) => {
                this.setState({selectedRowKeys:selectedRowKeys})
            },
            selectedRowKeys
        };
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
        const {getFieldDecorator} = this.props.form;
        return (
            <div className="notes">
                <Row gutter={24} style={{margin: "5px 0 16px 0"}}>
                    <Col>
                        <Button type="primary" icon="plus" onClick={()=>{this.showModal()}} style={{marginLeft:10}}>添加笔记</Button>
                        <Button type="danger" icon="rest"style={{marginLeft:10}} onClick={()=>{this.manyDel()}}>批量删除</Button>
                        <Button type="dashed" icon="reload" style={{marginLeft:10}} onClick={()=>{this.initNoteList()}}>刷新</Button>
                        <Button type="dashed" style={{marginLeft:10}} onClick={(e)=>{this.closeAlert(e)}}>关闭提示</Button>
                    </Col>
                </Row>
                <Alert style={{display:showAlert?"block":"none"}} className="infoTable" message={(<span>已选择 <span style={{fontWeight: 600,color:"#40a9ff"}}>{selectedRowKeys.length}</span> 项 <span className="clear" onClick={()=>{this.setState({selectedRowKeys:[]})}}>清空</span></span>)} type="info" showIcon />
                <Table rowSelection={rowSelection} bordered size="small" rowKey='_id' loading={tableLoading} pagination={{
                        showSizeChanger:true,
                        showQuickJumper:true,
                        showTotal:(total) => `共 ${total} 条`,
                        pageSize:defaultPage,
                        size:"midder",
                        total:dataList.length,
                        onShowSizeChange:(current, size) => this.setState({defaultPage:size})
                    }} columns={columns} dataSource={dataList} />

                <Modal
                    title="笔记添加"
                    visible = {visible} 
                    onOk={this.addNotes}
                    onCancel = {this.handleCancel}  
                    okText = "提交"
                    confirmLoading={confirmLoading}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="作者" >
                            {getFieldDecorator('author', {
                                initialValue:"",
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入作者',
                                    }
                                ],
                            })(<Input allowClear autoComplete="off"/>)}
                        </Form.Item>
                        <Form.Item label="内容">
                            {getFieldDecorator('content', {
                                initialValue:"",
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入随笔内容',
                                    }
                                ],
                            })(<TextArea allowClear rows={4}/>)}
                        </Form.Item>
                        <Form.Item label="随笔图片">
                            {getFieldDecorator('imgs', {
                                initialValue:"",
                            })(
                                <Input style={{width:"70%"}} addonAfter={
                                    <Popover content={(<img style={{maxWidth:300}} src={updateImgUrl} alt="无效的图片连接"/>)} title="头像">
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
                    </Form>
                </Modal>
            </div>
        )
    }
}
export default Form.create()(Notes);