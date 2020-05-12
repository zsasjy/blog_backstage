import React,{Component} from 'react'
import { Row, Col, Button, Alert, Table, message, Modal } from 'antd'
import { reqNoticesQuery,reqNoticesFind,reqNoticesDel,reqNoticesDelMany,reqNoticesAdd,reqNoticesUpdate } from "../../api"
import './index.less'
import Search from './search'
import UpdateOrAdd from './updateoradd'
import moment from 'moment'


const {confirm} = Modal
class Notices extends Component{
    constructor(){
        super();
        this.state = {
            showSearch:true,
            showAlert:true,
            dataList:[],
            tableLoading:true,
            selectedRowKeys:[],
            defaultPage:10,
            visible: false,
            confirmLoading:false,
            notice:{},
        }
    }
    OpenSearch = async (value) =>{
        this.setState({tableLoading:true});
        if(value.createTime.length === 2) value.createTime = [new Date(value.createTime[0]._d),new Date(value.createTime[1]._d)];
        if(!value.type) value.type = "";
        const result = await reqNoticesQuery(value);
        if(result && result.data){
            for(let i in result.data){
                result.data[i].createTime = moment(result.data[i].createTime).format('YYYY-MM-DD HH:mm:ss');
            }
            this.setState({dataList:result.data,tableLoading:false})
        }
    }

    closeAlert(e){
        let btnText = this.state.showAlert === true ? "开启提示": "关闭提示"
        e.target.innerText = btnText;
        this.setState({ showAlert : !this.state.showAlert });
    }
    closeSearch(e){
        let btnText = this.state.showSearch === true ? "开启搜索": "关闭搜索"
        e.target.innerText = btnText;
        this.setState({ showSearch : !this.state.showSearch });
    }
    async manyDel(){
        let { selectedRowKeys}= this.state;
        if(selectedRowKeys.length === 0){
            message.warning("请选择要删除的数据")
        }else{
            const result = await reqNoticesDelMany({_id:selectedRowKeys});
            if(result.status === 10012){
                message.success(result.msg);
                this.getNoticesData();
                this.setState({selectedRowKeys:[]});
            }
        }
    }
    showModal = (value) => {
        this.setState({
            visible: true,
            notice:value
        });
    };
    // 隐藏模态框(添加/更新)
    handleCancel = (form) => { 
        this.setState({visible: false}) 
        form.resetFields();
    };

    handleOk = async (form,values,type) => {
        this.setState({confirmLoading: true});
        if(type === "add"){
            const result = await reqNoticesAdd(values);
            if(result && result.status === 10011){
                this.setState({visible: false,confirmLoading: false});
                message.success(result.msg);
                this.getNoticesData();
                form.resetFields();
            }
        }else if(type === "update"){
            values._id = this.state.notice._id;
            const result = await reqNoticesUpdate(values);
            if(result && result.status === 10013){
                this.setState({visible: false,confirmLoading: false});
                message.success(result.msg);
                this.getNoticesData();
                form.resetFields();
            }
        }
    }

    noticesDel(text,notice){
        let { dataList }= this.state;
        confirm({
            title: "确认删除",
            confirmLoading:true,
            content: `您确认要删除公告 ${notice.name} ?`,
            onOk : async() => {
                const result = await reqNoticesDel(notice._id);
                if(result && result.status === 10012){
                    message.success("该公告已成功删除");
                    for(let i in dataList){
                        if(dataList[i]._id === notice._id){
                            dataList.splice(i,1);
                        }
                    }
                    this.setState({dataList});
                }
            },
            onCancel() {
                return false;
            },
        });
    }
    async getNoticesData(){
        this.setState({tableLoading:true});
        const result = await reqNoticesFind();
        if(result&&result.status === 10014){
            for(let i in result.data){
                result.data[i].createTime = moment(result.data[i].createTime).format('YYYY-MM-DD HH:mm:ss');
            }
            this.setState({dataList:result.data,tableLoading:false})
        }
    }
    componentDidMount(){
        this.getNoticesData();
    }
    columns(){
        return [
            {title: '#', dataIndex: 'id',align:'center',key:'id',ellipsis:true, width:50,render:(text,user,index) => index+1},
            {title: '公告标题',align:'center',dataIndex: 'name',ellipsis:true,width:250,key:'name',},
            {title: '公告内容',dataIndex: 'content', align:'center',ellipsis:true, key:'content',width:500},
            {title: '公告类型',dataIndex: 'type', align:'center',ellipsis:true, key:'type',width:100},
            {title: '创建者',dataIndex: 'author', align:'center',ellipsis:true,key:'author',width:100,},
            {title: '创建时间',dataIndex: 'createTime',align:'center',ellipsis:true,key: 'createTime',width:265,},
            {title: '操作', align:'center',width:250,
                render: (text,notice) => (
                    <div>
                        <Button style={{marginRight:5}} onClick={()=>{this.showModal(notice)}} type="primary" size="small">编辑</Button>
                        <Button size="small" type="danger" onClick={()=>{this.noticesDel(text,notice)}}>删除</Button>
                    </div>
                )
            }
        ]
    }

    render(){
        const columns = this.columns();
        const {showAlert,dataList,tableLoading,selectedRowKeys,defaultPage,visible, confirmLoading,notice,showSearch } = this.state
        const rowSelection = {
            onChange: (selectedRowKeys) => {
                this.setState({selectedRowKeys:selectedRowKeys})
            },
            selectedRowKeys
        };
        return (
            <div className="notices">
                <Search OpenSearch={this.OpenSearch} showSearch={showSearch}/>
                <Row gutter={24} style={{margin: "5px 0 16px 0"}}>
                    <Col>
                        <Button type="primary" icon="plus" onClick={()=>{this.showModal({})}} style={{marginLeft:10}}>添加新增</Button>
                        <Button type="danger" icon="rest"style={{marginLeft:10}} onClick={()=>{this.manyDel()}}>批量删除</Button>
                        <Button type="dashed" icon="reload" style={{marginLeft:10}} onClick={()=>{this.getNoticesData()}}>刷新</Button>
                        <Button type="dashed" style={{marginLeft:10}} onClick={(e)=>{this.closeSearch(e)}}>关闭搜索</Button>
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
                <UpdateOrAdd visible={visible} confirmLoading={confirmLoading} notice={notice} handleCancel={this.handleCancel} handleOk={this.handleOk}></UpdateOrAdd>
            </div>
        )
    }
}
export default Notices;