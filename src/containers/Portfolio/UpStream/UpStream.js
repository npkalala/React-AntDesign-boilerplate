import React from 'react';
import { inject, observer } from 'mobx-react';
import { QueryUpStreams } from 'services/API';
import { Table, Divider, Tag, Button, Badge, Icon, Card, Spin, Input, Row, Col, Tooltip, Radio } from 'antd';
import * as moment from 'moment';
import DetailForm from 'components/DetailForm/DetailForm';
//import { cloneDeep } from 'lodash';
import _ from 'lodash';

let data = [];
let idx = 0;
const dtSlots=[{value:"10000", key:"10000"},{value:"20000", key:"20000"}];

@inject('translateStore')
@observer
export default class UpStream extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [
          {
              title: '',
              key:'id',
              dataIndex: 'id',
              render: (text, record, index) =><Icon type="eye" key={'id-'+index} onClick={()=> this.readrow(record)}/>
          },
          {
            title: 'NAME',
            dataIndex: 'name',
            validate : { required : true, max : 20},
            key: 'name',
            render: text => <a>{text}</a>,
            default : 'Test',
            // editRender : (record, handleInputEvent, customAttr) =>{
            //   return(
            //     <Input {...customAttr}
            //       placeholder="Enter your name"
            //       prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            //       suffix={
            //         <Tooltip title="Extra information">
            //           <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
            //         </Tooltip>
            //       }
            //       onChange = {handleInputEvent}
            //     />
            //   )
            // }
          },
          {
            title: 'SLOTS',
            dataIndex: 'slots',
            key: 'slots',
            dataset : dtSlots,
            validate : { required : true},
            default : 10000,
            editRender : (record, handleInputEvent, customAttr) =>{
              return(
              <Radio.Group onChange={handleInputEvent} {...customAttr}>
                {
                  dtSlots!==null && dtSlots.map(r=>(
                    <Radio.Button value={r.key}>{r.value}</Radio.Button>
                  ))
                }
              </Radio.Group>
              )
            }
          },
          {
            title: 'CREATED',
            dataIndex: 'created_at',
            key: 'created_at',
            hidden : true
          },
          {
            title: '',
            key: 'action',
            render : this.renderAction
          }
        ];
        this.columns.map(r=> {
          r['field'] = r.key;
        });
        this.state = {
          data : [],
          isloading : true,
          columns: this.columns,
          open: false,
          editform: null,
          status: null
        }
       this.updaterow = this.updaterow.bind(this);
       this.deleterow = this.deleterow.bind(this);
       this.readrow = this.readrow.bind(this);
    }

    renderAction = (o, row, index) => {
      return (
        <span>
          <Tag color="geekblue" onClick={()=> this.updaterow(row)}>
            <Icon type="info-circle"/> Details
          </Tag>
          <Tag color="red" onClick={()=> this.deleterow(row)}>
            <Icon type="delete"/> DELETE
          </Tag>
        </span>
      );
    }

    componentDidMount = async () => {
        let dtUpstreams = await QueryUpStreams();
        //this.setState({data : dtUpstreams.data.data});
        dtUpstreams.data.data.map((row)=>{
            row.created_at = moment(row.create_at).toISOString(true);
        });
        data = dtUpstreams.data.data;
        this.setState({data : data});
        this.setState({isloading : false});
    }

    queryData = (value) =>{
       let dt = data.filter(r=> r.name.indexOf(value) > -1);
       this.setState({data : dt});
    }
    
    newRow = (columns) =>{
      var ob = {};
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
      //this.clearForm();
    };
    handleOK = (row) => {
        var data = this.state.data;
        if (this.state.status === 'add') {
          row["id"] = (idx++).toString();
          row["created_at"] = moment(Date.now()).toISOString(true);
          data.push(row);
        }
        else {
          data = [...this.state.data];
          let index = data.findIndex(el => el.id == row.id);
          data[index] = _.cloneDeep(row);
        }
        this.setState({ data });
    };
    
    render() {
    const { translateObj } = this.props.translateStore;
    const { Search } = Input;
    return (
      <div>
        {/* <Spin tip="Loading..." className = {this.state.isloading ? "show": "hide"}></Spin> */}
        <Card bordered={false} bodyStyle={{backgroundColor: 'rgba(228, 233, 237, 1)', border: 0 }}>
            <h1>UpStream</h1>
            <p>This is upstream</p>
            <p>Show the upstream infomation</p>
        </Card>
        <br/>
        <div>
          <Row>
            <Col span={16}>
              <Button type="primary" icon='plus' onClick={this.addrow}>CREATE UPSTREAM</Button>
              <Button type="link" icon='alert'>ALERT TRIGGERS</Button>
              <Badge count={25} />
            </Col>
            <Col span={8}>
              <Search placeholder="Search NAME" onSearch={value => this.queryData(value)} enterButton />      
            </Col>
          </Row>
        </div>
        <Table columns={this.columns} dataSource={this.state.data} />
        <DetailForm title={this.state.status == "add" ? "Create Upstream" : "Update Upstream"} columns={this.columns} status={this.state.status} open={this.state.open}
            data={this.state.editform} handleOK={this.handleOK} handleClose={this.handleClose}/> 
      </div>
    );
  }
}
