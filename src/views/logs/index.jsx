import React,{Component} from 'react'
import { Tabs,Row,Col,Button,Alert,Table, message, Modal, Tag } from 'antd'
import Search from './search' 
import {reqLogEmpty,reqLogQuery,reqLogFind, reqLogDel, reqLogDelMany} from '../../api'
import './index.less'
import moment from 'moment'

const { confirm } = Modal;

const {TabPane} = Tabs;
class Loginlog extends Component{
    constructor(){
        super();
        this.state = {
            selectedRowKeys:[],
            selectedRowKeysHandle:[],
            dataList:[],
            dataListHandle:[],
            defaultPage:10,
            tableLoadingLogin:false,
            tableLoadingHandle:false,
        }
    }
    async getLoginLogs(){
        this.setState({tableLoadingLogin:true});
        const loginLog = await reqLogFind("登录日志");
        if(loginLog && loginLog.status === 10014){
            for(let i in loginLog.data){
                loginLog.data[i].createTime = moment(loginLog.data[i].createTime).format('YYYY-MM-DD HH:mm:ss');
            }
            this.setState({dataList:loginLog.data,tableLoadingLogin:false})
        }
    }
    OpenSearch = async (value,type) => {
        if(type === "登录日志"){
            this.setState({tableLoadingLogin:true});
            if(value.createTime.length === 2) value.createTime = [new Date(value.createTime[0]._d),new Date(value.createTime[1]._d)];
            if(!value.type) value.type = type;
            const result = await reqLogQuery(value);
            if(result && result.data){
                for(let i in result.data){
                    result.data[i].createTime = moment(result.data[i].createTime).format('YYYY-MM-DD HH:mm:ss');
                }
                this.setState({dataList:result.data,tableLoadingLogin:false})
            }
        }else if(type === "操作日志"){
            this.setState({tableLoadingHandle:true});
            if(value.createTime.length === 2) value.createTime = [new Date(value.createTime[0]._d),new Date(value.createTime[1]._d)];
            if(!value.type) value.type = type;
            const result = await reqLogQuery(value);
            if(result && result.data){
                for(let i in result.data){
                    result.data[i].createTime = moment(result.data[i].createTime).format('YYYY-MM-DD HH:mm:ss');
                }
                this.setState({dataListHandle:result.data,tableLoadingHandle:false})
            }
        }
    }
    async getHandleLogs(){
        this.setState({tableLoadingHandle:true});
        const handleLog = await reqLogFind("操作日志");
        if(handleLog && handleLog.status === 10014){
            for(let i in handleLog.data){
                handleLog.data[i].createTime = moment(handleLog.data[i].createTime).format('YYYY-MM-DD HH:mm:ss');
            }
            this.setState({dataListHandle:handleLog.data,tableLoadingHandle:false})
        }
    }
    async manyDel(type){
        if(type==="handle"){
            let { selectedRowKeysHandle }= this.state;
            if(selectedRowKeysHandle.length === 0){
                message.warning("请选择要删除的数据")
            }else{
                confirm({
                    title: '确认删除',
                    content: `您确认要删除所选的 ${selectedRowKeysHandle.length} 条数据 ?`,
                    okType: 'danger',
                    onOk:async () => {
                        const result = await reqLogDelMany({_id:selectedRowKeysHandle});
                        if(result&&result.status === 10012){
                            message.success(result.msg);
                            this.getHandleLogs();
                            this.setState({selectedRowKeysHandle:[]});
                        }
                    },
                    onCancel() {},
                });
            }
        }else if(type==="login"){
            let { selectedRowKeys }= this.state;
            if(selectedRowKeys.length === 0){
                message.warning("请选择要删除的数据")
            }else{
                confirm({
                    title: '确认删除',
                    content: `您确认要删除所选的 ${selectedRowKeys.length} 条数据 ?`,
                    okType: 'danger',
                    onOk:async () => {
                        const result = await reqLogDelMany({_id:selectedRowKeys});
                        if(result&&result.status === 10012){
                            message.success(result.msg);
                            this.getLoginLogs();
                            this.setState({selectedRowKeys:[]});
                        }
                    },
                    onCancel() {},
                });
            }
        }
    }

    async LogDel(text,log,index){
        confirm({
            title: '确认删除',
            content: '您确认要删除该条数据吗?',
            okType: 'danger',
            onOk:async () => {
                const result = await reqLogDel(log._id);
                let {dataList,dataListHandle} = this.state;
                if(result && result.status === 10012){
                    message.success(result.msg);
                    if(log.type==="登录日志"){
                        dataList.splice(index,1);
                        this.setState({dataList});
                    }else if(log.type === "操作日志"){
                        dataListHandle.splice(index,1);
                        this.setState({dataListHandle});
                    }
                }
            },
            onCancel() {},
        });
        
    }
    LogEmpty(){
        confirm({
            title: '请谨慎进行此操作！',
            content: '您确认要彻底清空删除所有数据?',
            okType: 'danger',
            onOk:async () => {
                const result = await reqLogEmpty()
                if(result && result.status===10014){
                    message.success("系统日志已全部清除");
                    this.setState({dataList:[],dataListHandle:[]})
                }
            },
            onCancel() {},
        });
    }
    componentDidMount(){
        this.getLoginLogs();
    }
    changeTabs = (activeKey) => {
        if(activeKey === "1"){
            this.getLoginLogs();
        }else if(activeKey === "2"){
            this.getHandleLogs();
        }
    }
    

    columns(){
        return [
            {title: '#', dataIndex: 'id',align:'center',key:'id',ellipsis:true, width:50,render:(text,user,index) => index+1},
            {title: '操作名称',align:'center',dataIndex: 'name',ellipsis:true,width:150,key:'name'},
            {title: '请求类型',dataIndex: 'request', align:'center',ellipsis:true, key:'request',width:100},
            {title: '请求路径',dataIndex: 'requrl', align:'center',ellipsis:true,key:'requrl',width:200,},
            {title: '请求参数',dataIndex: 'param',key:'param',ellipsis:true,align:'center',width:200 },
            {title: '操作用户',dataIndex: 'user',align:'center',key:'user',ellipsis:true,width:100,},
            {title: 'IP',dataIndex: 'ip',align:'center',key:'ip',ellipsis:true,width:200,},
            {title: "IP地址",dataIndex: 'ipAddress', align:'center',width:250,ellipsis:true,key: 'ipAddress',},
            {title: '日志类型', ellipsis:true, align:'center',width:100,dataIndex:"type",key:"type",
                render: (text) => (
                    <Tag color="lime">{text}</Tag>
                )
            },
            {title: '创建时间',dataIndex: 'createTime',align:'center',ellipsis:true,key: 'createTime',width:250,},
            {title: '操作',fixed: 'right', align:'center',width:100,
                render: (text,log,index) => (
                    <div>
                        <Button size="small" type="danger" onClick={()=>{this.LogDel(text,log,index)}}>删除</Button>
                    </div>
                )
            }
        ]
    }
    render(){
        const {selectedRowKeys,selectedRowKeysHandle,tableLoadingLogin,tableLoadingHandle,defaultPage,dataList,dataListHandle} = this.state;
        const columns = this.columns();
        const rowSelection = {
            onChange: (selectedRowKeys) => {
                this.setState({selectedRowKeys:selectedRowKeys})
            },
            selectedRowKeys
        };
        const rowSelectionHandle = {
            onChange: (selectedRowKeys) => {
                this.setState({selectedRowKeysHandle:selectedRowKeys})
            },
            selectedRowKeysHandle
        };
        return (
            <div className="logs">
                <Tabs defaultActiveKey="1" onChange={this.changeTabs}>
                    <TabPane tab="登录日志" key="1">
                        <Search type="登录日志" OpenSearch={this.OpenSearch}/>
                        <Row gutter={24} style={{margin: "5px 0 16px 0"}}>
                            <Col>
                                <Button type="danger" icon="rest" onClick={()=>{this.LogEmpty()}} style={{marginLeft:10}}>全部删除</Button>
                                <Button type="dashed" icon="rest"style={{marginLeft:10}} onClick={()=>{this.manyDel("login")}}>批量删除</Button>
                                <Button type="dashed" icon="reload" style={{marginLeft:10}} onClick={()=>{this.getLoginLogs()}}>刷新</Button>
                            </Col>
                        </Row>
                        <Alert className="infoTable" message={(<span>已选择 <span style={{fontWeight: 600,color:"#40a9ff"}}>{selectedRowKeys.length}</span> 项 <span className="clear" onClick={()=>{this.setState({selectedRowKeys:[]})}}>清空</span></span>)} type="info" showIcon />
                        <Table rowSelection={rowSelection} bordered size="small" rowKey='_id' scroll={{ x: 1500 }} loading={tableLoadingLogin} pagination={{
                            showSizeChanger:true,
                            showQuickJumper:true,
                            showTotal:(total) => `共 ${total} 条`,
                            pageSize:defaultPage,
                            size:"midder",
                            total:dataList.length,
                            onShowSizeChange:(current, size) => this.setState({defaultPage:size})
                        }} columns={columns} dataSource={dataList} />
                    </TabPane>
                    <TabPane tab="操作日志" key="2">
                        <Search type="操作日志" OpenSearch={this.OpenSearch}/>
                        <Row gutter={24} style={{margin: "5px 0 16px 0"}}>
                            <Col>
                                <Button type="danger" icon="rest" onClick={()=>{this.showModal({})}} style={{marginLeft:10}}>全部删除</Button>
                                <Button type="dashed" icon="rest" style={{marginLeft:10}} onClick={()=>{this.manyDel("handle")}}>批量删除</Button>
                                <Button type="dashed" icon="reload" style={{marginLeft:10}} onClick={()=>{this.getHandleLogs()}}>刷新</Button>
                            </Col>
                        </Row>
                        <Alert className="infoTable" message={(<span>已选择 <span style={{fontWeight: 600,color:"#40a9ff"}}>{selectedRowKeysHandle.length}</span> 项 <span className="clear" onClick={()=>{this.setState({selectedRowKeysHandle:[]})}}>清空</span></span>)} type="info" showIcon />
                        <Table rowSelection={rowSelectionHandle} bordered size="small" rowKey='_id' scroll={{ x: 1500 }} loading={tableLoadingHandle} pagination={{
                            showSizeChanger:true,
                            showQuickJumper:true,
                            showTotal:(total) => `共 ${total} 条`,
                            pageSize:defaultPage,
                            size:"midder",
                            total:dataListHandle.length,
                            onShowSizeChange:(current, size) => this.setState({defaultPage:size})
                        }} columns={columns} dataSource={dataListHandle} />
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}
export default Loginlog;