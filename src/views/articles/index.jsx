import React,{Component} from 'react'
import {Row,Col,Button,Alert,Table,Tooltip,Switch,message,Modal} from 'antd'
import {reqArticleFind,reqArticleDel,reqArticleUpdate,reqArticleQuery,reqArticleAdd} from '../../api'
import moment from 'moment'
import './index.less'
import Search from './search'
import UpdateOrAdd from './updateoradd'
const {confirm} = Modal;
class Articles extends Component{
    constructor(){
        super()
        this.state = {
            showAlert:true,
            dataList:[],
            tableLoading:false,
            selectedRowKeys:[],
            defaultPage:10,
            visible:false,
            confirmLoading:false,
            article:{}
        }
    }
    closeAlert(e){
        let btnText = this.state.showAlert === true ? "开启提示": "关闭提示"
        e.target.innerText = btnText;
        this.setState({ showAlert : !this.state.showAlert });
    }
    async initArticleList(){
        this.setState({tableLoading:true})
        const result = await reqArticleFind();
        if(result && result.status === 10014){
            for(let i in result.data){
                result.data[i].createTime = moment(result.data[i].createTime).format('YYYY-MM-DD HH:mm:ss');
            }
            this.setState({dataList:result.data,tableLoading:false})
        }
    }
    componentDidMount(){
        this.initArticleList();
    }
    // 修改状态
    changeState(article){
        const that = this;
        confirm({
            title: `确认${article.status?"禁用":"开启"}`,
            content: `您确认要${article.status?"禁用":"开启"}文章 ${article.name} ?`,
            async onOk(){
                const result = await reqArticleUpdate({_id:article._id,status:!article.status})
                if(result && result.status === 10013){
                    message.success(`${result.msg}`);
                    that.initArticleList();
                }
            },
            onCancel() {},
        });
    }
    // 指定删除
    async ArticleDel(text,article){
        let { dataList }= this.state;
        const that = this;
        confirm({
            title: "确认删除",
            confirmLoading:true,
            content: `您确认要删除文章 ${article.name} ?`,
            async onOk (){
                const result = await reqArticleDel(article._id,article.typeId);
                if(result&&result.status === 10012){
                    message.success(result.msg);
                    for(let i in dataList){
                        if(dataList[i]._id === article._id){
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
    OpenSearch = async (values)=>{
        this.setState({tableLoading:true});
        const result = await reqArticleQuery(values);
        if(result && result.status === 10014){
            for(let i in result.data){
                result.data[i].createTime = moment(result.data[i].createTime).format('YYYY-MM-DD HH:mm:ss');
            }
            this.setState({dataList:result.data,tableLoading:false})
        }
    }
    showModal = (value) => {
        this.setState({
            visible: true,
            article:value
        });
    };
    // 隐藏模态框(添加/更新)
    handleCancel = (form) => { 
        this.setState({visible: false}) 
        form.resetFields();
    };
    handleOk = async (form,values,type) => {
        if(type==="update"){
            this.setState({confirmLoading:true})
            values._id = this.state.article._id;
            const result = await reqArticleUpdate(values);
            if(result && result.status === 10013){
                this.setState({visible: false,confirmLoading: false});
                message.success(result.msg);
                this.initArticleList();
                form.resetFields();
            }
        }else if(type==="add"){
            this.setState({confirmLoading:true})
            const result = await reqArticleAdd(values);
            if(result && result.status === 10011){
                this.setState({visible: false,confirmLoading: false});
                message.success(result.msg);
                this.initArticleList();
                form.resetFields();
            }
        }
    }
    columns(){
        return [
            {title: '#', dataIndex: 'id',align:'center',key:'id',ellipsis:true, width:50,render:(text,user,index) => index+1},
            {title: '名称',align:'center',dataIndex: 'name',ellipsis:true,width:150,key:'name',},
            {title: '描述',dataIndex: 'desc', align:'center',ellipsis:true, key:'desc',width:250,
                render: (text) => (<Tooltip placement="bottom" title={text}>{text}</Tooltip>)
            },
            {title: '类型',dataIndex: 'typeId', align:'center',ellipsis:true,key:'typeId',width:150,},
            {title: '图片',dataIndex: 'imgs',key:'imgs',align:'center',width:150,
                render: (text) => (<img style={{width:40,height:40,borderRadius:"50%"}} src={text} alt="头像"/>)
            },
            {title: '作者',dataIndex: 'author',align:'center',key:'author',ellipsis:true,width:100,},
            {title: '内容',dataIndex: 'content',align:'center',key:'content',ellipsis:true,width:300,},
            {title: '状态',dataIndex: 'status',align:'center',width:100,key: 'status',
                render:(text,article,index) => (
                    <Switch defaultChecked={text} checked={this.state.dataList[index].status} onClick={()=>{this.changeState(article)}}/>
                )
            },
            {title: '创建时间',dataIndex: 'createTime',align:'center',ellipsis:true,key: 'createTime',width:250,},
            {title: '操作',fixed: 'right', align:'center',width:200,
                render: (text,article) => (
                    <div>
                        <Button style={{marginRight:5}} onClick={()=>{this.showModal(article)}} type="primary" size="small">编辑</Button>
                        <Button size="small" type="danger" onClick={()=>{this.ArticleDel(text,article)}}>删除</Button>
                    </div>
                )
            }
        ]
    }
    render(){
        const columns = this.columns();
        const {showAlert,dataList,tableLoading,selectedRowKeys,defaultPage, visible, confirmLoading, article} = this.state
        const rowSelection = {
            onChange: (selectedRowKeys) => {
                this.setState({selectedRowKeys:selectedRowKeys})
            },
            selectedRowKeys
        };
        return (
            <div className="articles">
                <Search OpenSearch={this.OpenSearch}/>
                <Row gutter={24} style={{margin: "5px 0 16px 0"}}>
                    <Col>
                        <Button type="primary" icon="plus" onClick={()=>{this.showModal({})}} style={{marginLeft:10}}>新增文章</Button>
                        <Button type="dashed" icon="reload" style={{marginLeft:10}} onClick={()=>{this.initArticleList()}}>刷新</Button>
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
                <UpdateOrAdd visible={visible} confirmLoading={confirmLoading} article={article}  handleCancel={this.handleCancel} handleOk={this.handleOk}/>
            </div>
        )
    }
}
export default Articles;