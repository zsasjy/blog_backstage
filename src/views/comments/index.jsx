import React,{Component} from 'react'
import { Row, Col, Button, Alert, message,Modal,Table} from 'antd'
import "./index.less"
import Search from './search'
import moment from 'moment'
import {reqCommentDel,reqCommentDelMany,reqCommentQuery,reqCommentList} from '../../api'

const {confirm} = Modal;
class Comments extends Component{
    constructor(){
        super();
        this.state = {
            commentList:[],
            showAlert:true,
            selectedRowKeys:[],
            tableLoading:false,
            defaultPage:10,
        }
    }
    closeAlert(e){
        let btnText = this.state.showAlert === true ? "开启提示": "关闭提示"
        e.target.innerText = btnText;
        this.setState({ showAlert : !this.state.showAlert });
    }
    commentsDel(text,comment){
        confirm({
            title: "确认删除",
            confirmLoading:true,
            content: `您确认要删除该条评论?`,
            onOk : async() => {
                const result = await reqCommentDel({_id:comment._id});
                if(result && result.status === 10012){
                    message.success("该评论已成功删除");
                    this.initCommentList();
                }
            },
            onCancel() {
                return false;
            },
        });
    }
    async initCommentList(){
        const result = await reqCommentList();
        if(result && result.status === 10014){
            for(let i in result.data){
                result.data[i].createTime = moment(result.data[i].createTime).format('YYYY-MM-DD HH:mm:ss');
            }
            this.setState({commentList:result.data})
        }
    }
    async manyDel(){
        let { selectedRowKeys}= this.state;
        if(selectedRowKeys.length === 0){
            message.warning("请选择要删除的数据")
        }else{
            const result = await reqCommentDelMany({_id:selectedRowKeys});
            if(result.status === 10012){
                message.success(result.msg);
                this.initCommentList();
                this.setState({selectedRowKeys:[]});
            }
        }
    }
    OpenSearch = async (value) =>{
        this.setState({tableLoading:true});
        if(value.createTime.length === 2) value.createTime = [new Date(value.createTime[0]._d),new Date(value.createTime[1]._d)];
        const result = await reqCommentQuery(value);
        if(result && result.data){
            for(let i in result.data){
                result.data[i].createTime = moment(result.data[i].createTime).format('YYYY-MM-DD HH:mm:ss');
            }
            this.setState({commentList:result.data,tableLoading:false})
        }
    }
    columns(){
        return [
            {title: '#', dataIndex: 'id',align:'center',key:'id',ellipsis:true, width:50,render:(text,user,index) => index+1},
            {title: '昵称',align:'center',dataIndex: 'name',ellipsis:true,width:100,key:'name',},
            {title: '评论内容',dataIndex: 'content', align:'center',ellipsis:true, key:'content',width:500},
            {title: '邮箱地址',dataIndex: 'email', align:'center',ellipsis:true, key:'email',width:200},
            {title: '父评论ID',dataIndex: 'parentId', align:'center',ellipsis:true,key:'parentId',width:200},
            {title: '创建时间',dataIndex: 'createTime',align:'center',ellipsis:true,key: 'createTime',width:200,},
            {title: '操作', align:'center',width:250,
                render: (text,comment) => (
                    <div>
                        <Button size="small" type="danger" onClick={()=>{this.commentsDel(text,comment)}}>删除</Button>
                    </div>
                )
            }
        ]
    }
    componentDidMount(){
        this.initCommentList();
    }
    render(){
        const columns = this.columns();
        const {showAlert,selectedRowKeys,commentList,tableLoading,defaultPage} = this.state;
        const rowSelection = {
            onChange: (selectedRowKeys) => {
                this.setState({selectedRowKeys:selectedRowKeys})
            },
            selectedRowKeys
        };
        return (
            <div className="comments">
                <Search  OpenSearch={this.OpenSearch}/>
                <Row gutter={24} style={{margin: "5px 0 16px 0"}}>
                    <Col>
                        <Button type="danger" icon="rest"style={{marginLeft:10}} onClick={()=>{this.manyDel()}}>批量删除</Button>
                        <Button type="dashed" icon="reload" style={{marginLeft:10}} onClick={()=>{this.initCommentList()}}>刷新</Button>
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
                        total:commentList.length,
                        onShowSizeChange:(current, size) => this.setState({defaultPage:size})
                    }} columns={columns} dataSource={commentList} />
            </div>
        )
    }
}

export default Comments;
