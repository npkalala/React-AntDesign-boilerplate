import React from 'react';
import { inject, observer } from 'mobx-react';
import { queryService } from 'services/API';
import { Tag, Button, Icon, Card, Input, Row, Col, Radio, Select } from 'antd';
import * as moment from 'moment';
import MasterForm from 'components/DetailForm/MasterForm';
//import styles from './Service.less'
import * as styles from './style';
//import './Service.less'
let data = [];

@inject('translateStore')
@observer
export default class Service extends MasterForm { 
    constructor(props) {
        super(props);
        this.columns = [
          {
            title: '',
            key:'id',
            dataIndex: 'id',
            render: (text, record) =><Icon type="eye" onClick={()=> this.readRow(record)}/>
          },
          {
            title: 'NAME',
            dataIndex: 'name',
            key: 'name',
            validate : {required : true , max : 20},
            render: (text, record) => <a onClick={()=> this.updateRow(record)}>{text}</a>,
          },
          {
            title: 'HOST',
            dataIndex: 'host',
            key: 'host',
            //type : 'switch',
            render: (text, record) => <div>{record["host"]!==undefined ? record["host"].toString() : ""}</div>
          },
          {
            title: 'TAGS',
            dataIndex: 'tags',
            key: 'tags',
            dataset : [{value:"A", key:"10000"},{value:"B", key:"20000"}],
            //type : "select",
            //default : "A",
            //validate : {required : true}
            // editRender : (record, handleInputEvent, customAttr) =>{
            //   return(
            //   <Radio.Group className={styles.customRadio} onChange={handleInputEvent} {...customAttr} key={"Tag-"+record.name}>
            //       <Radio.Button value={"A"}>10000</Radio.Button>
            //       <Radio.Button value={"B"}>20000</Radio.Button>
            //   </Radio.Group>
            //   )
            // }
            editRender : (record, handleInputEvent, customAttr) =>{
              console.log(styles);
              console.log(styles.customDropDown);
              return(
              <styles.MySelect onChange={handleInputEvent} {...customAttr}
                mode="multiple"
                style={{ width: 300 }}
              >
                <Select.Option value={"A"}>10000</Select.Option>
                <Select.Option value={"B"}>20000</Select.Option>              
              </styles.MySelect>
              )
            }
          },
          {
            title: 'CREATED',
            dataIndex: 'created_at',
            key: 'created_at',
            type : "date",
            default: moment(Date.now()),
            render: (text , record, index) => <div key={"Created-"+ index}>{moment(record.created_at).format('YYYY/MM/DD HH:mm:ss')}</div>
            //attributes : {disabled : true}
          },
          {
            title: '',
            key: 'action',
            render: (text, record) => (
              <span>
                  <Tag color="red" onClick = {()=>this.deleteRow(record)}>
                  <Icon type="delete"/> DELETE
                  </Tag>
              </span>
            ),
          }
        ];
        
        this.state = {
            data : [],
       }
    }

    componentDidMount = async () => {
        let dtAll = await queryService();
        dtAll.data.data.map((row)=>{
            row.created_at = moment(row.create_at);//.toISOString(true);
        });
        data = dtAll.data.data;
        this.setState({data : data});
        this.setState({isloading : false});
    }

    queryData = (value) =>{
        let dt = data.filter(r=> r.name.indexOf(value) > -1);
        this.setState({data : dt});
    }

    handleOK = (row) =>{
       if(this.state.status === "add"){
         //Call Add(http POST) API
       }
       else{ //Update
         //Call Update(http PUT) API 
       }
    }

    render() {
    //const { translateObj } = this.props.translateStore;
    const { Search } = Input;
    return (
      <div>
        <Card bordered={false} bodyStyle={{backgroundColor: 'rgba(228, 233, 237, 1)', border: 0 }}>
            <h1>Services</h1>
            <p>This is services</p>
            <p>Show the services infomation</p>
        </Card>
        <br/>
        <div>
          <Row>
            <Col span={16}>
              <Button type="primary" icon='plus' onClick={this.addRow}>ADD NEW SERVICE</Button>
            </Col>
            <Col span={8}>
              <Search placeholder="Search NAME" onSearch={value => this.queryData(value)} enterButton />      
            </Col>
          </Row>
        </div>
        {/* <Table columns={this.columns} dataSource={this.state.data} /> */}
        {this.renderUI()}
      </div>
    );
  }
}
