import React,{Component} from 'react'
import { Row, Col, Button, Alert, Table, Switch, Modal, message } from 'antd'
import { reqTypeFind,reqTypeUpdate,reqTypeDelMany,reqTypeDel,reqTypeAdd } from '../../api'
import moment from 'moment'
import './index.less'
import UpdateOrAdd from './updateoradd'

const { confirm } = Modal
class Types extends Component{
    constructor(){
        super();
        this.state = {
            showAlert:true,
            selectedRowKeys:[],
            tableLoading:false,
            dataList:[],
            defaultPage:10,
            visible: false,
            confirmLoading:false,
            type:{}
        }
        this.initTypeList = this.initTypeList.bind(this);
        this.manyDel = this.manyDel.bind(this);
        this.handleOk = this.handleOk.bind(this);
    }
    async initTypeList(){
        this.setState({tableLoading:true});
        const result = await reqTypeFind();
        if(result && result.status === 10014){
            for(let i in result.data){
                result.data[i].createTime = moment(result.data[i].createTime).format('YYYY-MM-DD HH:mm:ss');
            }
            this.setState({tableLoading:false,dataList:result.data})
        }
    }
    async manyDel(){
        let { selectedRowKeys }= this.state;
        if(selectedRowKeys.length === 0){
            message.warning("请选择要删除的数据！！！")
        }else{
            const result = await reqTypeDelMany({_id:selectedRowKeys});
            if(result && result.status === 10012){
                message.success(result.msg);
                this.initTypeList();
                this.setState({selectedRowKeys:[]});
            }
        }
    }
    async TypeDel(text,type){
        let { dataList }= this.state;
        const that = this;
        confirm({
            title: "确认删除",
            confirmLoading:true,
            content: `您确认要删除文章类型 ${type.name} ?`,
            async onOk (){
                const result = await reqTypeDel(type._id);
                if(result && result.status === 10012){
                    message.success("该文章类型已删除");
                    for(let i in dataList){
                        if(dataList[i]._id === type._id){
                            dataList.splice(i,1);
                        }
                    }
                    that.setState({dataList});
                }
            },
            onCancel() {},
        });
    }
    changeState(type){
        const that = this;
        confirm({
            title: `确认${type.status?"禁用":"开启"}`,
            content: `您确认要${type.status?"禁用":"开启"}文章类型 ${type.name} ?`,
            async onOk(){
                const result = await reqTypeUpdate({_id:type._id,status:!type.status})
                if(result && result.status === 10013){
                    message.success(`${result.msg}`);
                    that.initTypeList();
                }
            },
            onCancel() {
                return false;
            },
        });
    }
    closeAlert(e){
        let btnText = this.state.showAlert === true ? "开启提示": "关闭提示"
        e.target.innerText = btnText;
        this.setState({ showAlert : !this.state.showAlert });
    }
    showModal = (value) => {
        this.setState({
            visible: true,
            type:value
        });
    };
    // 隐藏模态框(添加/更新)
    handleCancel = (form) => {
        this.setState({
            visible: false,
            confirmLoading:false,
        });
        form.resetFields();
    };
    handleOk(form,type){
        this.setState({confirmLoading:true})
        form.validateFields(async(err, values) => {
            if(values.name){
                this.setState({confirmLoading: true});
                if(type==="update"){
                    values._id = this.state.type._id;
                    const result = await reqTypeUpdate(values);
                    if(result && result.status === 10013){
                        this.setState({visible: false,confirmLoading: false});
                        message.success(result.msg);
                        this.initTypeList();
                        form.resetFields();
                    }
                }else if(type==="add"){
                    const result = await reqTypeAdd(values);
                    if(result && result.status === 10011){
                        this.setState({visible: false,confirmLoading: false});
                        message.success(result.msg);
                        this.initTypeList();
                        form.resetFields();
                    }
                }
            }else{
                message.warning("请输入完整信息")
            }
        })
        setTimeout(()=>{
            this.setState({confirmLoading:false,visible:false})
        },2000)
    }
    componentDidMount(){
        this.initTypeList();
    }
    
    columns(){
        return [
            {title: '#', dataIndex: 'id',align:'center',key:'id',ellipsis:true, width:50,render:(text,notes,index) => index+1},
            {title: '文章类型',align:'center',dataIndex: 'name',ellipsis:true,width:150,key:'name',},
            {title: '备注',dataIndex: 'remarks', align:'center',ellipsis:true,key:'remarks',width:300,},
            {title: '文章个数',dataIndex: 'count',key:'count',align:'center',width:100,},
            {title: '状态',dataIndex: 'status',align:'center',width:100,key: 'status',
                render:(text,type,index) => (
                    <Switch defaultChecked={text} checked={this.state.dataList[index].status} onClick={()=>{this.changeState(type)}}/>
                )
            },
            {title: '创建时间',dataIndex: 'createTime',align:'center',ellipsis:true,key: 'createTime',width:200,},
            {title: '操作', align:'center',width:150,
                render: (text,type,index) => (
                    <div>
                        <Button style={{marginRight:5}} onClick={()=>{this.showModal(type)}} type="primary" size="small">编辑</Button>
                        <Button size="small" type="danger" onClick={()=>{this.TypeDel(text,type)}}>删除</Button>
                    </div>
                )
            }
        ]
    }
    render(){
        const {showAlert,selectedRowKeys,tableLoading,defaultPage,dataList,visible,confirmLoading,type} = this.state;
        const columns = this.columns();
        const rowSelection = {
            onChange: (selectedRowKeys) => {
                this.setState({selectedRowKeys:selectedRowKeys})
            },
            selectedRowKeys
        };
        return (
            <div className="types">
                <Row gutter={24} style={{margin: "5px 0 16px 0"}}>
                    <Col>
                        <Button type="primary" icon="plus" onClick={()=>{this.showModal({})}} style={{marginLeft:10}}>添加文章类型</Button>
                        <Button type="danger" icon="rest"style={{marginLeft:10}} onClick={()=>{this.manyDel()}}>批量删除</Button>
                        <Button type="dashed" icon="reload" style={{marginLeft:10}} onClick={()=>{this.initTypeList()}}>刷新</Button>
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
                <UpdateOrAdd visible={visible} confirmLoading={confirmLoading} type={type} handleCancel={this.handleCancel} handleOk={this.handleOk}/>
            </div>
        )
    }
}
export default Types;