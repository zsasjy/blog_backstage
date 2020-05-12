import React,{Component} from 'react'
import { Form, Modal, Input, Select,Popover,Icon,Upload,Button } from 'antd'
import { reqTypeFind } from '../../api'
import Editor from 'for-editor'
const { TextArea } = Input;
const { Option } = Select;
class UpdateOrAdd extends Component{
    constructor(){
        super();
        this.state={
            typeList:[],
            updateImgUrl:""
        }
    }
    async getTypeList(){
        const result = await reqTypeFind();
        if(result && result.status === 10014){
            this.setState({typeList:result.data})
        }
    }
    componentDidMount(){
        this.getTypeList();
    }
    uploadImg = (file) => {
        const result = file.file.response;
        if(result && result.status === 1001){
            this.setState({updateImgUrl:"/"+result.data.url});
            this.props.form.setFieldsValue({"imgs":this.state.updateImgUrl});
        }
    }
    handleOk(value){
        let type = !!value?"update":"add";
        this.props.form.validateFields((err,values)=>{
            if(values.name&&values.content&&values.author&&values.typeId&&values.desc&&values.imgs){
                this.props.handleOk(this.props.form,values,type);
            }
        })
    }
    render(){
        const { typeList,updateImgUrl } = this.state
        const { getFieldDecorator } = this.props.form;
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
        return (
            <Modal
                width={1000}
                title={this.props.article._id?"文章修改":"文章添加"}
                visible={this.props.visible}
                onOk={()=>{this.handleOk(this.props.article._id)}}
                okText = "提交"
                confirmLoading={this.props.confirmLoading}
                onCancel={()=>{this.props.handleCancel(this.props.form)}}
            >
                <Form {...formItemLayout}>
                    <Form.Item label="文章标题" >
                        {getFieldDecorator('name', {
                            initialValue:`${!!this.props.article.name?this.props.article.name:""}`,
                            rules: [
                                {
                                    required: true,
                                    message: '请输入文章标题',
                                }
                            ],
                        })(<Input allowClear autoComplete="off"/>)}
                    </Form.Item>
                    <Form.Item label="文章描述" >
                        {getFieldDecorator('desc', {
                            initialValue:`${!!this.props.article.desc?this.props.article.desc:""}`,
                            rules: [
                                {
                                    required: true,
                                    message: '请输入文章描述',
                                }
                            ],
                        })(<TextArea rows={4} allowClear autoComplete="off"/>)}
                    </Form.Item>
                    <Form.Item  label="文章类型">
                        {getFieldDecorator("typeId", {
                            initialValue:`${!!this.props.article.typeId?this.props.article.typeId:""}`,
                            rules: [
                                {
                                    required: true,
                                    message: '请选择文章类型',
                                }
                            ],
                        })(
                            <Select placeholder="请选择文章类型"  allowClear >
                                {
                                    typeList.map((item)=>{
                                        return  <Option key={item._id} value={item._id}>{item.name}</Option>
                                    })
                                }
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label="作者" >
                        {getFieldDecorator('author', {
                            initialValue:`${!!this.props.article.author?this.props.article.author:""}`,
                            rules: [
                                {
                                    required: true,
                                    message: '请输入作者',
                                }
                            ],
                        })(<Input allowClear autoComplete="off"/>)}
                    </Form.Item>
                    <Form.Item label="头像">
                        {getFieldDecorator('imgs', {
                            initialValue:`${!!this.props.article.imgs?this.props.article.imgs:""}`,
                        })(
                            <Input allowClear style={{width:"70%"}} addonAfter={
                                <Popover content={(<img style={{maxWidth:300}} src={this.state.updateImgUrl===""?this.props.article.imgs:this.state.updateImgUrl} alt="无效的图片连接"/>)} title="头像">
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
                    <Form.Item label="文章内容">
                        {getFieldDecorator('content', {
                            initialValue:`${!!this.props.article.content?this.props.article.content:""}`,
                            rules: [
                                {
                                    required: true,
                                    message: '请输入作者',
                                }
                            ],
                        })(<Editor lineNum='true' style={{width:'100%',height:'600px'}}/>)}
                        

                    </Form.Item>
                </Form>
            </Modal>
        )
    }
}

export default Form.create()(UpdateOrAdd)