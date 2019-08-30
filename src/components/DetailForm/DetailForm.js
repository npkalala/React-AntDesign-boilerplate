import React from 'react';
import { inject, observer } from 'mobx-react';
//import { upStreams } from 'services/API';
import { Form , Modal, Divider, Tag, Button, Badge, Icon, Card, Spin, Input, Select, Table, Row, Col  } from 'antd';
//import * as moment from 'moment';
import _ from 'lodash';
//import { map, tail, times, uniq } from 'lodash';

//@inject('translateStore')
@observer
class DetailForm extends React.Component{
//export default class DetailForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //data : [],
            open : props.open,
            columns: _.cloneDeep(props.columns),
            title : props.title,
            editform: null,
            status : props.status,
            loading : false
       }
       this.handleOK = this.handleOK.bind(this);
       this.handleClose = this.handleClose.bind(this);
    }
    componentDidMount = () => {
      
    }

    componentWillReceiveProps(nextProps) {
      // if(nextProps.data != this.setState.editform){
      //     this.setState({ editform : nextProps.data });
      // }
      if(nextProps.columns!= this.state.columns){
          let cols=  _.cloneDeep(nextProps.columns);
          cols.map(r=> {
            if(!r['field']){
              r['field'] = r.key
            }
          });
          this.setState({columns : cols});
      }
      if(nextProps.open != this.state.open){
          this.setState({open : nextProps.open});
          if(nextProps.open){
            let dt = nextProps.data;
            nextProps.columns.map(r=>{
              if(r.default && !dt[r.key]){
                dt[r.key] = r.default;
              }
            });
            this.setState({ editform : dt });
          }
      }
      if(nextProps.status != this.setState.status){
        this.setState({ status : nextProps.status });
      }
    }

    
  handleClick = () => {
    this.setState(state => ({open: !state.open}));
  }

  handleClose = () => {
    this.state.open = false;
    if(this.props.handleClose){
      this.props.handleClose();
    }
    setTimeout(() => {
      this.setState({ open: this.state.open, status: null, loading: false });
    }, 3000);
    this.clearForm();
  };

  handleOK = () => {
    this.setState({ loading: true });
    let isValidate = this.isAllColumnValidate();
    if (isValidate != null) {
      //alert('請填入[' + isValidate + ']!');
      this.setState({ loading: false });
      return;
    }
    if (typeof this.props.handleOK === 'function' && this.state.status !== "read") {
      this.props.handleOK(_.cloneDeep(this.state.editform));
    }
    this.handleClose();
  };

  clearForm = () => {
    this.props.form.resetFields();
  };

  newRow = () => {
    var ob = {};
    if (this.state.columns == null || this.state.columns === undefined) {
      return ob;
    }
    _.forEach(this.state.columns, function (row) {
      ob[row.field] = null;
    });
    return ob;
  };

  addrow = () => {
    //this.resetValidate();
    this.setState({
      open: true,
      status: 'add'
    });
  };

  updaterow = (row) => {
    //this.resetValidate();
    this.state.editform = _.cloneDeep(row);
    this.setState({
      editform: this.state.editform, 
      open: true,
      status: 'update'
    })
  };

  handleInputEvent = name => event => {
    //validate
    //var res = this.validate(name, event.target.value);
    //update
    var frm = this.state.editform;
    frm[name] = event.target ?event.target.value : event;
    this.setState({
      editform: frm
    });
  };

  isAllColumnValidate = () => {
    let ob = null;
    this.props.form.validateFields((err, values) => {
      if (err) {
        ob = err;
        console.log('Received values of form: ', values);
      }
    });
    return ob;
  }

createInput = (getFieldDecorator) => {
  return _.filter(this.state.columns,function(o) { return o.key!="id" && o.field!=null && o.field.indexOf('_XX') ==-1 && o.title!=='' && !o.hidden }
  ).map((row, i) => this.getInputType(row, i , getFieldDecorator));
}

getType = (row) => {
  let t = row.type;
  if(row.dataset && row.dataset.length > 0){
    return "select";
  }
  if(!t){
    return 'string';
  }
  let ret='text';
  switch (t) {
    case 'numeric':
      ret= 'number';
      break;
    case 'date':
    case 'datetime':
    case 'time':
      ret='date';
      break;
    default:
     ret = t;
  }
  return ret;
};

isRequired = (attrs) =>{
  if( attrs && attrs["required"]){
    return true;
  }
  return false;
}

setInput = (getFieldDecorator, row, editform, isRequired, index, ob ) =>{
  if(isRequired){
    return(
      <Form.Item label={row.title} hasFeedback key={'item-'+index}>
        {getFieldDecorator(row.field, { initialValue : editform[row.field],
          rules: [{ ...row.validate , message: 'Please input your '+ row.title +'!' }],
        })(ob)}
      </Form.Item>
    )
  }
  else{
    return(
      <Form.Item label={row.title} key={'item-'+index}>
        {getFieldDecorator(row.field, { initialValue : editform[row.field],
          rules: [{ ...row.validate , message: 'Please input your '+ row.title +'!' }],
        })(ob)}
      </Form.Item>
    )
  }
}

setRequired = (row) =>{
  if(!row.hasOwnProperty('validate')){
    row['validate'] = {"required" : false};
  }
  else if(!row.validate.hasOwnProperty('required')){ //select 必定要設定required屬性，不論true or false (ref 6. http://superxu.xyz/2017/02/09/react/%E4%BD%BF%E7%94%A8react%E9%81%87%E5%88%B0%E7%9A%84%E5%87%A0%E4%B8%AA%E9%97%AE%E9%A2%98/)
    row.validate["required"] = false;
  }
  return row;
}

setValidator = (row) =>{
  if(!row.hasOwnProperty('validate')){
    row['validate'] = {"validator": this.validator};
  }
  else if(!row.validate.hasOwnProperty('validator')){
    row.validate["validator"] = this.validator;
  }
  return row;
}

getInputType = (row , i, getFieldDecorator) =>{
  let customAttr = {disabled: this.state.status === "read"};
  if(row.attributes){
    customAttr = Object.assign({}, customAttr, row.attributes);
  }
  let type = this.getType(row);
  //set validator/ custom
  //row = this.setValidator(row);
  switch(type){
    case "select":
      row = this.setRequired(row);
      if(row.editRender){
        let ob = row.editRender(this.state.editform, this.handleInputEvent(row.field), customAttr);
        return this.setInput(getFieldDecorator, row, this.state.editform, this.isRequired(row.validate), i, ob)
      }
      else{
        return this.setInput(getFieldDecorator, row, this.state.editform, this.isRequired(row.validate), i, 
        (
          <Select onChange={this.handleInputEvent(row.field)} {...customAttr} key={'select-'+i}>
          {
            row.dataset!==null && row.dataset.map(r=>(
              <Select.Option value={r.key}>{r.value}</Select.Option>
            ))
          }
          </Select>
        ))
      }
    case "switch":
      if(row.editRender){
        let ob = row.editRender(this.state.editform, this.handleInputEvent(row.field), customAttr);
        return this.setInput(getFieldDecorator, row, this.state.editform, this.isRequired(row.validate), i, ob)
      }
      else{
        return this.setInput(getFieldDecorator, row, this.state.editform, this.isRequired(row.validate), i, 
        (<Switch checked = {this.state.editform[row.field]} onChange={this.handleInputEvent(row.field)} {...customAttr} key={'switch-'+i}/>))
      }
    case "date":
      return(
        <div>
          Not Implemented yet!!!
        </div>
      )
    default :
      if(row.editRender){
        let ob = row.editRender(this.state.editform, this.handleInputEvent(row.field), customAttr);
        return this.setInput(getFieldDecorator, row, this.state.editform, this.isRequired(row.validate), i, ob)
      }
      else{
        return this.setInput(getFieldDecorator, row, this.state.editform, this.isRequired(row.validate), i, 
        (<Input placeholder = {row.title} onChange={this.handleInputEvent(row.field)} {...customAttr} key={'input-'+i} />))
      }
      //#region 
      // if(this.isRequired(row.validate)){
      //   return(
      //     <Form.Item label={row.title} hasFeedback>
      //       {getFieldDecorator(row.field, { initialValue : this.state.editform[row.field],
      //         rules: [{ ...row.validate , message: 'Please input your '+ row.title +'!' }],
      //       })(
      //         <Input
      //           //prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
      //           placeholder = {row.title}
      //           //defaultValue = "" //{this.state.editform[row.field] == null ? '' : this.state.editform[row.field]}
      //           onChange={this.handleInputEvent(row.field)} {...customAttr} key={'input-'+i}
      //         />
      //       )}
      //     </Form.Item>
      //   )
      // }
      // else{
      //   return(
      //     <Form.Item label={row.title}>
      //       {getFieldDecorator(row.field, { initialValue : this.state.editform[row.field],
      //         rules: [{ ...row.validate , message: 'Please input your '+ row.title +'!' }],
      //       })(
      //         <Input
      //           //prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
      //           placeholder = {row.title}
      //           //defaultValue = "" //{this.state.editform[row.field] == null ? '' : this.state.editform[row.field]}
      //           onChange={this.handleInputEvent(row.field)} {...customAttr} key={'input-'+i}
      //         />
      //       )}
      //     </Form.Item>
      //   )
      // }
      //#endregion
  }
}

validator = (rule, value, callback) => {
  try {
    throw new Error('Something wrong!');
  } catch (err) {
    callback(err);
  }
}

getFooter = () =>{
  let btns = null;
  if(this.state.status === "read"){
    btns = (
      [
        <Button key="btn-Cancel" onClick={this.handleClose}>
          Cancel
        </Button>,
      ]);
  }
  else{
    btns = 
      ([
        <Button key="back" onClick={()=>this.handleClose()}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" loading={this.state.loading} onClick={()=>this.handleOK()}>
          OK
        </Button>,
      ]);
  }
  return btns;
}
    
render() {
  const { getFieldDecorator } = this.props.form;
  return (
      <div>
        <Modal
          title= {this.state.title}
          visible={this.state.open}
          onOk={this.handleOK}
          onCancel={this.handleClose}
          footer={this.getFooter()}
          >
          <Form onSubmit={this.handleOK}>
            {this.state.editform!=null && this.createInput(getFieldDecorator)} 
          </Form> 
        </Modal>
      </div>
    );
  }
}

export default Form.create()(DetailForm)
