import React,{Component} from 'react'
import { Form, Row, Col, Button, Alert, Table, Switch, Tooltip, Modal, message } from 'antd';
import Search from './search'
import UpdateOrSubmit from './updateorsubmit'
import './index.less'
import { reqUserFind,reqUserDelMany,reqUserDel,reqUserQuery,reqUserUpdate,reqSignup } from '../../api'
import moment from 'moment'
const { confirm } = Modal;

class Users extends Component{
    constructor(){
        super();
        this.state = {
            showAlert:true,
            dataList:[],
            tableLoading:true,
            selectedRowKeys:[],
            defaultPage:10,
            visible: false,
            confirmLoading:false,
            user:{}, // 被传递的user
        }
        this.closeAlert.bind(this);
        this.getUserData.bind(this); // 
        this.OpenSearch.bind(this); //打开搜索
        this.manyDel.bind(this);
        this.userDel.bind(this);
    }
    // 查询
    OpenSearch = async (value) =>{
        this.setState({tableLoading:true});
        if(value.createTime) value.createTime = [new Date(value.createTime[0]._d),new Date(value.createTime[1]._d)];
        if(!value.status) value.status = "";
        if(!value.sex) value.sex = "";
        value.password = "";
        const result = await reqUserQuery(value);
        if(result && result.data){
            for(let i in result.data){
                result.data[i].createTime = moment(result.data[i].createTime).format('YYYY-MM-DD HH:mm:ss');
            }
            this.setState({dataList:result.data,tableLoading:false})
        }
    }
    // 修改状态
    changeState(user){
        const that = this;
        confirm({
            title: `确认${user.status?"禁用":"开启"}`,
            content: `您确认要${user.status?"禁用":"开启"}用户 ${user.name} ?`,
            async onOk(){
                const result = await reqUserUpdate({_id:user._id,status:!user.status})
                if(result.status === 10013){
                    message.success(`${result.msg}`);
                    that.getUserData();
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
            user:value
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
    // 添加或更新
    handleOk = (form,type) => {
        form.validateFields(async(err, values) => {
            console.log(values);
            console.log(values);
            if(values.username&&values.password&&values.name&&values.email&&values.phone&&values.role){
                this.setState({confirmLoading: true});
                if(type==="update"){
                    values._id = this.state.user._id;
                    const result = await reqUserUpdate(values);
                    if(result && result.status === 10013){
                        this.setState({visible: false,confirmLoading: false});
                        message.success(result.msg);
                        this.getUserData();
                        form.resetFields();
                    }
                }else if(type==="add"){
                    delete values.status;
                    const result = await reqSignup(values);
                    if(result && result.status === 10011){
                        this.setState({visible: false,confirmLoading: false});
                        message.success(result.msg);
                        this.getUserData();
                        form.resetFields();
                    }
                }
            }else{
                message.warning("请输入完整信息")
            }
        })
    };
    // 批量删除
    async manyDel(){
        let { selectedRowKeys }= this.state;
        if(selectedRowKeys.length === 0){
            message.warning("请选择要删除的数据！！！")
        }else{
            const result = await reqUserDelMany({_id:selectedRowKeys});
            if(result && result.status === 10012){
                message.success(result.msg);
                this.getUserData();
                this.setState({selectedRowKeys:[]});
            }
        }
    }
    // 指定删除
    async userDel(text,user){
        let { dataList }= this.state;
        const that = this;
        confirm({
            title: "确认删除",
            confirmLoading:true,
            content: `您确认要删除用户 ${user.name} ?`,
            async onOk (){
                const result = await reqUserDel(user._id);
                if(result && result.status === 10012){
                    message.success("该用户已成功删除!!!");
                    for(let i in dataList){
                        if(dataList[i]._id === user._id){
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
    closeAlert(e){
        let btnText = this.state.showAlert === true ? "开启提示": "关闭提示"
        e.target.innerText = btnText;
        this.setState({ showAlert : !this.state.showAlert });
    }
    async getUserData(){
        this.setState({tableLoading:true});
        const result = await reqUserFind();
        if(result&&result.data){
            for(let i in result.data){
                result.data[i].createTime = moment(result.data[i].createTime).format('YYYY-MM-DD HH:mm:ss');
            }
            this.setState({dataList:result.data,tableLoading:false})
        }
    }
    componentDidMount(){
        this.getUserData();
    }
    columns(){
        return [
            {title: '#', dataIndex: 'id',align:'center',key:'id',ellipsis:true, width:50,render:(text,user,index) => index+1},
            {title: '用户名',align:'center',dataIndex: 'username',ellipsis:true,width:150,key:'username',},
            {title: '密码',dataIndex: 'password', align:'center',ellipsis:true, key:'password',width:150,
                render: (text) => (<Tooltip placement="bottom" title={text}>{text}</Tooltip>)
            },
            {title: '昵称',dataIndex: 'name', align:'center',ellipsis:true,key:'name',width:150,},
            {title: '头像',dataIndex: 'headImg',key:'headImg',align:'center',width:100,
                render: (text) => (<img style={{width:40,height:40,borderRadius:"50%"}} src={text} alt="头像"/>)
            },
            {title: '手机号',dataIndex: 'phone',align:'center',key:'phone',ellipsis:true,width:150,},
            {title: '邮箱',dataIndex: 'email',align:'center',key:'email',ellipsis:true,width:200,},
            {title: "性别",dataIndex: 'sex', align:'center',width:100,ellipsis:true,key: 'sex',},
            {title: '状态',dataIndex: 'status',align:'center',width:100,key: 'status',
                render:(text,user,index) => (
                    <Switch defaultChecked={text} checked={this.state.dataList[index].status} onClick={()=>{this.changeState(user)}}/>
                )
            },
            {title: '创建时间',dataIndex: 'createTime',align:'center',ellipsis:true,key: 'createTime',width:250,},
            {title: '操作',fixed: 'right', align:'center',width:200,
                render: (text,user) => (
                    <div>
                        <Button style={{marginRight:5}} onClick={()=>{this.showModal(user)}} type="primary" size="small">编辑</Button>
                        <Button size="small" type="danger" onClick={()=>{this.userDel(text,user)}}>删除</Button>
                    </div>
                )
            }
        ]
    }
    
    render(){
        const columns = this.columns();
        const {showAlert,dataList,tableLoading,selectedRowKeys,defaultPage, visible, confirmLoading, user} = this.state
        const rowSelection = {
            onChange: (selectedRowKeys) => {
                this.setState({selectedRowKeys:selectedRowKeys})
            },
            selectedRowKeys
        };
        return (
            <div className='users'>
                <Search OpenSearch={this.OpenSearch}/>
                <Row gutter={24} style={{margin: "5px 0 16px 0"}}>
                    <Col>
                        <Button type="primary" icon="plus" onClick={()=>{this.showModal({})}} style={{marginLeft:10}}>添加用户</Button>
                        <Button type="danger" icon="rest"style={{marginLeft:10}} onClick={()=>{this.manyDel()}}>批量删除</Button>
                        <Button type="dashed" icon="reload" style={{marginLeft:10}} onClick={()=>{this.getUserData()}}>刷新</Button>
                        <Button type="dashed" style={{marginLeft:10}} onClick={(e)=>{this.closeAlert(e)}}>关闭提示</Button>
                    </Col>
                </Row>
                <Alert style={{display:showAlert?"block":"none"}} className="infoTable" message={(<span>已选择 <span style={{fontWeight: 600,color:"#40a9ff"}}>{selectedRowKeys.length}</span> 项 <span className="clear" onClick={()=>{this.setState({selectedRowKeys:[]})}}>清空</span></span>)} type="info" showIcon />
                <Table rowSelection={rowSelection} bordered size="small" rowKey='_id' scroll={{ x: 1500 }} loading={tableLoading} pagination={{
                        showSizeChanger:true,
                        showQuickJumper:true,
                        showTotal:(total) => `共 ${total} 条`,
                        pageSize:defaultPage,
                        size:"midder",
                        total:dataList.length,
                        onShowSizeChange:(current, size) => this.setState({defaultPage:size})
                    }} columns={columns} dataSource={dataList} />
                <UpdateOrSubmit visible={visible} confirmLoading={confirmLoading} user={user} handleCancel={this.handleCancel} handleOk={this.handleOk}/>
            </div>
        )
    }
}
export default Form.create()(Users);