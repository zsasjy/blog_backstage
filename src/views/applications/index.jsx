import React,{Component} from 'react'
import { Row, Col, Card,  Icon, Button, Tooltip, Form, Input, DatePicker, Spin, Modal, message, Upload, Drawer, Descriptions, Badge } from 'antd'
import './index.less'
import {reqAppFind, reqAppQuery, reqAppDel,reqAppAdd,reqFileDel } from '../../api'
import moment from 'moment'
const { RangePicker } = DatePicker;
const { confirm } = Modal;
const { Dragger } = Upload;
class Applications extends Component{
    constructor(){
        super();
        this.state = {
            appList : [],
            isLoading:false,
            visible: false,
            confirmLoading: false,
            previewVisible: false,
            previewImage: '',
            previewShow:true,
            updateImgUrl:'',
            file:{},
            DrawerVisible:false,
            appInfo:{},

        }
    }
    appDel(item,index){
        confirm({
            title: '确认删除?',
            content: `您确认要删除应用 ${item.name}`,
            okType: 'danger',
            onOk : async() => {
                let {appList} = this.state
                let img = item.img.split("/");
                img = img[img.length-2]+"/"+img[img.length - 1];
                const delimg = await reqFileDel(img);
                if(delimg && delimg.status === 10014){
                    let address = item.address.split("/");
                    address = address[address.length-2]+"/"+address[address.length - 1];
                    const deladdress = await reqFileDel(address);
                    if(deladdress && deladdress.status === 10014){
                        const result = await reqAppDel(item._id);
                        if(result && result.status===10012){
                            message.success(result.msg);
                            appList.splice(index,1);
                            this.setState({appList})
                        }
                    }
                }
            },
            onCancel() {},
        });
    }
    handleSearch = () => {
        this.setState({isLoading:true})
        this.props.form.validateFields( async(err,values)=>{
            if(!values.createTime)values.createTime = [];
            values.name = values.sname;
            delete values.sname;
            const result = await reqAppQuery({...values});
            if(result&&result.status===10014){
                for(let i in result.data){
                    result.data[i].createTime = moment(result.data[i].createTime).format('YYYY-MM-DD HH:mm:ss');
                }
                this.setState({appList:result.data,isLoading:false})
            }
        })
    }
    showDrawer = (item) => {
        this.setState({
            DrawerVisible: true,
            appInfo:item
        });
    };
    
    onClose = () => {
        this.setState({
            DrawerVisible: false,
            appInfo:{}
        });
    };
    handleReset = () => {
        this.props.form.resetFields();
    }
    async initAppList(){
        this.setState({isLoading:true})
        const result = await reqAppFind();
        if(result && result.status === 10014){
            for(let i in result.data){
                result.data[i].createTime = moment(result.data[i].createTime).format('YYYY-MM-DD HH:mm:ss');
            }
            this.setState({appList:result.data,isLoading:false})
        }
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    };
    
    handleOk = () => {
        let {updateImgUrl,file} = this.state
        this.props.form.validateFields( async (err,values)=>{
            if(values.name&&values.author&&values.desc){
                if(updateImgUrl){
                    if(file.name !== undefined){
                        this.setState({
                            confirmLoading: true,
                        });
                        values.img = updateImgUrl;
                        values.size = file.size;
                        values.address = `/${file.url}`
                        const result = await reqAppAdd(values);
                        if(result && result.status === 10011){
                            message.success("应用添加成功");
                            this.setState({
                                visible: false,
                                confirmLoading: false,
                                previewVisible: false,
                                previewImage: '',
                                previewShow:true,
                                file:{}
                            });
                            this.props.form.resetFields();
                            this.initAppList();
                        }
                    }else{
                        message.error("请上传文件")
                    }
                }else{
                    message.error("请上传图片")
                }
            }else{
                message.error("请输入完整信息")
            }
        })
        
    };
    uploadImg = (file) => {
        const result = file.file.response;
        if(result && result.status === 1001){
            this.setState({updateImgUrl:"/"+result.data.url,previewShow:false});
        }
    }
    uploadFild = (file) =>{
        const result = file.file.response;
        if(result && result.status === 1001){
            this.setState({file:result.data});
        }
    }
    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await this.getBase64(file.originFileObj);
        }
        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };
    getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
    handleCancel = () => {
        this.setState({visible: false});
    };
    componentDidMount(){
        this.initAppList();
    }
    render(){
        let {appList,isLoading,visible,confirmLoading, previewVisible, previewImage,previewShow,file,DrawerVisible,appInfo} = this.state
        const {getFieldDecorator} = this.props.form;
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
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">上传文件</div>
            </div>
        );
        return (
            <div className="application">
                <div className="appHandle" style={{backgroundColor:"#FFFFFF",padding:"24px 24px 10px 24px",marginBottom:10,borderRadius:5}}>
                    <Form className="ant-advanced-search-form">
                        <Row gutter={24}>
                            <Col span={5}>
                                <Form.Item label="文件名">
                                    {getFieldDecorator("sname", {
                                        initialValue:"",
                                    })(<Input allowClear placeholder="请输入文件名称" autoComplete='off' />)}
                                </Form.Item>
                            </Col>
                            <Col span={5}>
                                <Form.Item label="创建日期">
                                    {getFieldDecorator("createTime", {
                                        initialValue:"",
                                    })(
                                        <RangePicker placeholder={['开始时间', '结束时间']}/>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={5} style={{marginTop:4.5}}>
                                <Button type="primary" onClick={this.handleSearch}>
                                    <Icon type="search"/>
                                查询
                                </Button>
                                <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                                清空
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                    <Row gutter={24} style={{margin: "5px 0 5px 0"}}>
                        <Col style={{padding:0}}>
                            <Button type="primary" icon="plus" onClick={this.showModal}>上传文件</Button>
                            <Button type="dashed" icon="reload" style={{marginLeft:10}} onClick={()=>{this.initAppList()}}>刷新</Button>
                        </Col>
                    </Row>
                </div>
                <Spin spinning={isLoading} delay={500} indicator={<Icon type="loading" style={{ fontSize: 50 }} spin />}>
                    <Row span={24}>
                        {
                            appList.map((item,index)=>{
                                return (
                                    <Col className="app" key={item._id} span={6}>
                                        <Card
                                            hoverable
                                            actions={[
                                                <Tooltip placement="top" title="查看详情">
                                                    <Icon type="search" key="search" onClick={()=>{this.showDrawer(item)}}/>
                                                </Tooltip>,
                                                <Tooltip placement="top" title="下载">
                                                    <a href={item.address} target="view_window"><Icon type="download" key="download" /></a>
                                                </Tooltip>,
                                                <Tooltip placement="top" title="删除">
                                                    <Icon type="delete" key="delete" onClick={()=>{this.appDel(item,index)}}/>
                                                </Tooltip>,
                                            ]}
                                            cover={<img style={{width:"100%",height:240}} alt="图片" src={item.img} />}
                                        >
                                            <div className="app-wrap">
                                            <div className="app-item-title"><strong>{item.name}</strong></div>
                                                <div className="app-item-desc">
                                                    {item.desc}
                                                </div>
                                                <div className="app-item-time">
                                                    <span className="time">{item.createTime}</span>
                                                    <span className="author">{`作者: ${item.author}`}</span>
                                                </div>
                                            </div>
                                        </Card>
                                    </Col>
                                )
                            })
                        }
                    </Row>
                </Spin>
                <Modal
                    destroyOnClose={true}
                    title="上传文件"
                    visible={visible}
                    onOk={this.handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="名称" >
                            {getFieldDecorator('name', {
                                initialValue:"",
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入应用名称',
                                    }
                                ],
                            })(<Input allowClear autoComplete="off"/>)}
                        </Form.Item>
                        <Form.Item label="描述" >
                            {getFieldDecorator('desc', {
                                initialValue:"",
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入应用描述',
                                    }
                                ],
                            })(<Input allowClear autoComplete="off"/>)}
                        </Form.Item>
                        <Form.Item label="作者" >
                            {getFieldDecorator('author', {
                                initialValue:"",
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入上传作者',
                                    }
                                ],
                            })(<Input allowClear autoComplete="off"/>)}
                        </Form.Item>
                        <Form.Item label="文件显示图" >
                            <div className="clearfix">
                                 <Upload
                                    action="/api/upload/file"
                                    accept="image/*" // 允许 image图片的任何类型
                                    name='file'
                                    method="post"
                                    listType="picture-card"
                                    onPreview={this.handlePreview}
                                    onChange={this.uploadImg}
                                    >
                                        {previewShow?uploadButton:""}
                                    </Upload>
                                <Modal visible={previewVisible} footer={null} onCancel={()=>{this.setState({previewVisible:false})}}>
                                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                </Modal>
                            </div>
                        </Form.Item>
                        <Form.Item label="文件" >
                            <Dragger 
                                action="/api/upload/file"
                                name='file'
                                method="post"
                                onChange={this.uploadFild}
                                style={{display:file.name === undefined?"block":"none"}}
                            >
                                <p className="ant-upload-drag-icon">
                                <Icon type="inbox" />
                                </p>
                                <p className="ant-upload-text">单击或拖动文件到此区域以上载</p>
                                <p className="ant-upload-hint">
                                    一次仅能上传一个文件，禁止批量上传
                                </p> 
                            </Dragger>
                        </Form.Item>
                    </Form>
                </Modal>
                <Drawer
                    title="应用详情"
                    placement="right"
                    width={640}
                    closable={false}
                    onClose={this.onClose}
                    visible={DrawerVisible}
                >
                    <Descriptions column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}>
                        <Descriptions.Item label="应用名称">{appInfo.name}</Descriptions.Item>
                        <Descriptions.Item label="应用描述">{appInfo.desc}</Descriptions.Item>
                        <Descriptions.Item label="作者">{appInfo.author}</Descriptions.Item>
                        <Descriptions.Item label="创建日期">{appInfo.createTime}</Descriptions.Item>
                        <Descriptions.Item label="应用图片"><img style={{width:"70%",height:240,marginRight:20}} src={appInfo.img} alt="图片地址"/></Descriptions.Item>
                        <Descriptions.Item label="使用状态">{appInfo.status?<Badge color="#59F30D" text="正常使用" />:<Badge color="#ABB5A7" text="暂停使用" />}</Descriptions.Item>
                    </Descriptions>
                </Drawer>
            </div>
        )
    }
}
export default Form.create()(Applications);