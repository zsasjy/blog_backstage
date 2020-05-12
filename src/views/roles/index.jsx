import React,{Component} from 'react'
import {Row,Col,Button,Alert,Table,Switch,Modal,message} from 'antd'
import {reqRoleFind,reqRoleUpdate,reqRoleDelMany,reqRoleDel,reqRoleAdd} from '../../api'
import moment from 'moment'
import './index.less'
import UpdateOrAdd from './updateoradd'
import Menus from './menus'
const {confirm} = Modal
class Roles extends Component{
    constructor(){
        super();
        this.state = {
            showAlert:true,
            selectedRowKeys:[],
            dataList:[],
            tableLoading:false,
            defaultPage:10,
            role:{},
            visible:false,
            visibleMenu:false,
            confirmLoading:false,
            confirmLoadingMenu:false,
        }
    }
    async manyDel(){
        let { selectedRowKeys}= this.state;
        if(selectedRowKeys.length === 0){
            message.warning("请选择要删除的数据")
        }else{
            const result = await reqRoleDelMany({_id:selectedRowKeys});
            if(result && result.status === 10012){
                message.success(result.msg);
                this.getRoleData();
                this.setState({selectedRowKeys:[]});
            }
        }
    }
    async roleDel(text,role){
        let { dataList }= this.state;
        const that = this;
        confirm({
            title: "确认删除",
            confirmLoading:true,
            content: `您确认要删除角色 ${role.name} ?`,
            async onOk (){
                const result = await reqRoleDel(role._id);
                if(result && result.status === 10012){
                    message.success("该角色已成功删除");
                    for(let i in dataList){
                        if(dataList[i]._id === role._id){
                            dataList.splice(i,1);
                        }
                    }
                    that.setState({dataList});
                }
            },
            onCancel() {
                return false;
            },
        });
    }
    // 显示模态框(添加/更新)
    showModal = (value) => {
        this.setState({
            visible: true,
            role:value
        });
    };
    // 隐藏模态框(添加/更新)
    handleCancel = (form) => {
        this.setState({
            visible: false,
        });
        form.resetFields();
    };
    TreeShowModal = (value) => {
        this.setState({visibleMenu:true,role:value});
    }
    TreeHandleCancel = () => {
        this.setState({visibleMenu: false});
    }
    TreeHandleOk = async (value) => {
        this.setState({confirmLoadingMenu: true});
        const result = await reqRoleUpdate({_id:this.state.role._id,menus:value});
        if(result && result.status === 10013){
            this.setState({visibleMenu: false,confirmLoadingMenu: false});
            message.success(`${result.msg}`);
            this.getRoleData();
            return true;
        }
    }
    // 添加或更新
    handleOk = (form,type) => {
        form.validateFields(async(err, values) => {
            this.setState({confirmLoading: true});
            if(type === "add"){
                values.menus = [];
                const result = await reqRoleAdd(values);
                if(result && result.status === 10011){
                    this.setState({visible: false,confirmLoading: false});
                    message.success(result.msg);
                    this.getRoleData();
                    form.resetFields();
                }
            }else if(type === "update"){
                values._id = this.state.role._id;
                const result = await reqRoleUpdate(values);
                if(result && result.status === 10013){
                    this.setState({visible: false,confirmLoading: false});
                    message.success(result.msg);
                    this.getRoleData();
                    form.resetFields();
                }
            }
        })
    };
    UNSAFE_componentWillMount(){
        this.columns = this.columns();
    }
    componentDidMount(){
        this.getRoleData();
    }
    changeState(role){
        const that = this;
        confirm({
            title: `确认${role.status?"禁用":"开启"}`,
            content: `您确认要${role.status?"禁用":"开启"}角色 ${role.name} ?`,
            async onOk (){
                const result = await reqRoleUpdate({_id:role._id,status:!role.status})
                if(result && result.status === 10013){
                    message.success(`${result.msg}`);
                    that.getRoleData();
                    return true;
                }
            },
            onCancel() {
                return false;
            },
        });
    }
    columns(){
        return [
            {title: '#', dataIndex: 'id',align:'center',key:'id', width:50,render:(text,role,index) => index+1},
            {title: '用户名称',align:'center',dataIndex: 'name',width:200,key:'name',},
            {title: '权限字符',dataIndex: 'power', align:'center', key:'power',width:200},
            {title: "备注",dataIndex: 'remarks', align:'center',width:450,key: 'remarks',},
            {title: '状态',dataIndex: 'status',align:'center',width:150,key: 'status',
                render:(text,role,index) => (
                    <Switch defaultChecked={text} checked={this.state.dataList[index].status} onClick={()=>{this.changeState(role)}}/>
                )
            },
            {title: '创建时间',dataIndex: 'createTime',align:'center',key: 'createTime',width:250,},
            {title: '操作',fixed: 'right', align:'center',width:300,className:"table_item",
                render: (text,role) => (
                    <div>
                        <Button style={{marginRight:5}} type="primary" size="small" onClick={()=>{this.TreeShowModal(role)}}>菜单权限</Button>
                        <Button style={{marginRight:5}} size="small" onClick={()=>{this.showModal(role)}}>编辑</Button>
                        <Button size="small" type="danger" onClick={()=>{this.roleDel(text,role)}}>删除</Button>
                    </div>
                ),
            }
        ]
    }
    async getRoleData(){
        this.setState({tableLoading:true});
        const result = await reqRoleFind();
        if(result&&result.data){
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
    render(){
        const {showAlert,dataList,tableLoading,defaultPage,selectedRowKeys,confirmLoading,role,visible,visibleMenu,confirmLoadingMenu} = this.state;
        const rowSelection = {
            onChange: (selectedRowKeys) => {
                this.setState({selectedRowKeys:selectedRowKeys})
            },
            selectedRowKeys
        };
        return(
            <div className="roles">
                <Row gutter={24} style={{margin: "5px 0 16px 0"}}>
                    <Col style={{padding:0}}>
                        <Button type="primary" icon="plus" onClick={()=>{this.showModal({})}}>添加角色</Button>
                        <Button type="danger" icon="rest" style={{marginLeft:10}} onClick={()=>{this.manyDel()}}>批量删除</Button>
                        <Button type="dashed" icon="reload" style={{marginLeft:10}} onClick={()=>{this.getRoleData()}}>刷新</Button>
                        <Button type="dashed" style={{marginLeft:10}} onClick={(e)=>{this.closeAlert(e)}}>关闭提示</Button>
                    </Col>
                </Row>
                <Alert style={{display:showAlert?"block":"none"}} className="infoTable" message={(<span>已选择 <span style={{fontWeight: 600,color:"#40a9ff"}}>{selectedRowKeys.length}</span> 项 <span className="clear" onClick={()=>{this.setState({selectedRowKeys:[]})}}>清空</span></span>)} type="info" showIcon />
                <Table rowSelection={rowSelection} bordered size="small" scroll={{x:800}} rowKey='_id' loading={tableLoading} pagination={{
                        showSizeChanger:true,
                        showQuickJumper:true,
                        showTotal:(total) => `共 ${total} 条`,
                        pageSize:defaultPage,
                        size:"default",
                        total:dataList.length,
                        onShowSizeChange:(current, size) => this.setState({defaultPage:size})
                    }} columns={this.columns} dataSource={dataList} />
                <UpdateOrAdd visible={visible} confirmLoading={confirmLoading} role={role} handleCancel={this.handleCancel} handleOk={this.handleOk}/>
                <Menus visible={visibleMenu} confirmLoading={confirmLoadingMenu} role={role} handleCancel={this.TreeHandleCancel} handleOk={this.TreeHandleOk}/>
            </div>
        )
    }
}
export default Roles;  