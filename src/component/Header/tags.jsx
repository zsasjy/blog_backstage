import React,{Component} from 'react'
import { withRouter,Link } from 'react-router-dom';
import './index.less'
import { Tag } from 'antd';
import {connect} from 'react-redux'
import {delTags} from '../../store/action'

class Tags extends Component{
    handleClose = (removedTag,index) => {
        let tags = this.props.tags;
        if(index === (tags.length-1) ||  `${removedTag.keys}` === `${this.props.location.pathname}`){
            tags.splice(index,1);
            delTags(tags);
            return this.props.history.replace(tags[index-1].keys);
        }
        tags.splice(index,1);
        delTags(tags);
        return this.props.history.replace(this.props.location.pathname);
    };
    UNSAFE_componentWillMount(){
        this.setState({tags:this.props.tags});
    }
    initTags(){
        let tagsList = [];
        let tags = this.props.tags;
        tagsList = tags;
        return tagsList;
    }
    render(){
        const path = this.props.location.pathname;
        let tagsList = this.initTags();
        
        return (
            <div className='tags_list'>
                {tagsList.map((tag, index) => {
                    return (
                        <Tag key={index} closable={index!==0} className={tag.keys===path?'active':''} onClose={() => this.handleClose(tag,index)}>
                            <Link to={tag.keys} key={index}>
                                {tag.name}
                            </Link>
                        </Tag>
                    );
                })}
            </div>
        )
    }
}
export default connect(
    state => ({tags:state.tags}),{delTags}
)(withRouter(Tags))