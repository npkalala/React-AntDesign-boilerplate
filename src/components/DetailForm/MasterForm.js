import React from 'react';
import { Table, Input } from 'antd';
import DetailForm from 'components/DetailForm/DetailForm';
import _ from 'lodash';
//import * as moment from 'moment';

let idx = 1;
export default class MasterForm extends React.Component {
    constructor(props) {
       super(props);
       this.updaterow = this.updaterow.bind(this);
       this.deleterow = this.deleterow.bind(this);
       this.readrow = this.readrow.bind(this);
       this.columns = [];
    }

    componentDidMount = async () => {
      
    }
    
    // componentWillReceiveProps = (nextProps) => {
    //   if(nextProps.columns!= this.state.columns){
    //     let cols=  _.cloneDeep(nextProps.columns);
    //     cols.map(r=> {
    //       if(!r['field']){
    //         r['field'] = r.key
    //       }
    //     });
    //     this.setState({columns : cols});
    // }
    // if(nextProps.open != this.state.open){
    //     this.setState({open : nextProps.open});
    //     if(nextProps.open){
    //       let dt = nextProps.data;
    //       nextProps.columns.map(r=>{
    //         if(r.default && !dt[r.key]){
    //           dt[r.key] = r.default;
    //         }
    //       });
    //       this.setState({ editform : dt });
    //     }
    // }
    // if(nextProps.status != this.setState.status){
    //   this.setState({ status : nextProps.status });
    // }
    // }

    newRow = (columns) =>{
      let ob = {};
      if(columns ==null || columns === undefined){
        return ob;
      }
      _.forEach(columns, function(row) {
          ob[row.key] = '';
      });
      return ob;
    }

    addrow = () => {
      this.state.editform = this.newRow(this.state.columns);
      this.setState({ open: true, status: 'add', editform: this.state.editform });
    };

    updaterow = (row) => {
      this.state.editform = _.cloneDeep(row);
      this.setState({ open: true, status: 'update', editform: this.state.editform })
    };

    readrow = (row) => {
      this.state.editform = row; //_.cloneDeep(row);
      this.setState({ open: true, status: 'read', editform: this.state.editform })
    };

    deleterow = (row) =>{
      let data = this.state.data;
      const index = data.indexOf(row);
      data.splice(index, 1);
      this.setState({ data });
    }

    handleClose = () => {
      this.setState({ open: false, status: null });
    }

    handleOK = (row) => {
        var data = this.state.data;
        if (this.state.status === 'add') {
          row["id"] = (idx++).toString();
          //row["created_at"] = moment(Date.now()).toISOString(true);
          data.push(row);
        }
        else {
          data = [...this.state.data];
          let index = data.findIndex(el => el.id == row.id);
          data[index] = _.cloneDeep(row);
        }
        this.setState({ data });
        //console.log('parent node');
    }

    renderUI = (self) =>{
      return(
        // <div>
        // <Table columns={self.columns} dataSource={self.state.data} />
        // <DetailForm title={self.state.title} columns={self.columns} status={self.state.status} open={self.state.open}
        //     data={self.state.editform} handleOK={this.handleOK} handleClose={this.handleClose} /> 
        // </div>
        <div>
        <Table columns={this.columns} dataSource={this.state.data} />
        <DetailForm title={this.state.title} columns={this.columns} status={this.state.status} open={this.state.open}
            data={this.state.editform} handleOK={this.handleOK} handleClose={this.handleClose} /> 
        </div>
      )
    }
    
    // render() {
    // return (
    //   <div>
    //     <Table columns={this.columns} dataSource={this.state.data} />
    //     <DetailForm title={this.state.title} columns={this.columns} status={this.state.status} open={this.state.open}
    //         data={this.state.editform} handleOK={this.handleOK} handleClose={this.handleClose}/> 
    //   </div>
    // );
  //}
}
