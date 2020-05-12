import React,{Component} from 'react';
import { Modal,Tree } from 'antd'
import menuList from '../../config/menuConfig'
const { TreeNode } = Tree;

class Menus extends Component{
    constructor(props){
        super(props);
        this.state={checkedKeys:this.props.role.menus}
    }
    handleOk(){
        if(!this.state.checkedKeys){
            this.props.handleOk(this.props.role.menus); 
            this.setState({checkedKeys:null});
        }else{
            this.props.handleOk(this.state.checkedKeys); 
            this.setState({checkedKeys:null});
        }
    }
    onCheck = (checkedKeys) => {
        this.setState({checkedKeys})
    }
    UNSAFE_componentWillMount(){
        this.NodeTree = this.initTreeNode(menuList)
    }
    //  通过递归的方式渲染 TreeNode 组件
    initTreeNode = (menuList) =>{
        return menuList.reduce((pre,item) => {
            pre.push(
              <TreeNode title={item.title} key= {item.key}>
                  {item.children ? this.initTreeNode(item.children):null}
              </TreeNode>
            )
            return pre
        },[])
    }
    render(){
        const {role} = this.props;
        let {checkedKeys} = this.state;
        return(
            <Modal
                title={`分配的  ${role.name}  菜单权限`}
                visible={this.props.visible}
                onOk={()=>{this.handleOk()}}
                okText = "提交"
                confirmLoading={this.props.confirmLoading}
                onCancel={()=>{
                    this.props.handleCancel()
                    this.setState({checkedKeys:null})
                }}>
                <Tree
                    checkable
                    defaultExpandAll={true}
                    onCheck={this.onCheck}
                    checkedKeys={checkedKeys?checkedKeys:role.menus}
                >
                    <TreeNode title='角色权限' key="">
                        {this.NodeTree}
                    </TreeNode>
                </Tree>
            </Modal>
        )
    }
}
export default Menus;