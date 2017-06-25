import React from 'react'

import { Table, Input, Icon, Button, Popconfirm,Modal,InputNumber,Select,Tooltip } from 'antd';
function onChange(value) {
  console.log( value);
}
class EditableCell extends React.Component {
  state = {
    value: this.props.value,
    editable: false,
  }
  handleChange = (e) => {
    const value = e.target.value;
    this.setState({ value });
  }
  check = () => {
    this.setState({ editable: false });
    if (this.props.onChange) {
      this.props.onChange(this.state.value);
    }
  }
  edit = () => {
    this.setState({ editable: true });
  }
  render() {
    const { value, editable } = this.state;
    return (
      <div className="editable-cell">
        {
          editable ?
            <div className="editable-cell-input-wrapper">
              <Input
                value={value}
                onChange={this.handleChange}
                onPressEnter={this.check}
           
              />

              <Icon
                type="check"
                className="editable-cell-icon-check"
                onClick={this.check}
              />
            </div>
            :
            <div className="editable-cell-text-wrapper">
              {value || ' '}
              <Icon
                type="edit"
                className="editable-cell-icon"
                onClick={this.edit}
              />
            </div>
        }
      </div>
    );
  }
}
export default class TableList extends React.Component {

  constructor(props) {
    super(props);
    this.columns = [{
      title: '序号',
      dataIndex: 'goodsIndex',
      width: '10%',
      sorter: (a, b) => a.goodsIndex - b.goodsIndex,
    }, {
      title: '商品名称',
      dataIndex: 'goodsName',
      width: '30%',
       render: (text, record, index) => (
        <EditableCell
          value={text}
          onChange={this.onCellChange(index, 'goodsName')}
        />
      )
    }, {
      title: '商品价格(￥)',
      dataIndex: 'goodsPrice',
      width: '10%',
      sorter: (a, b) => a.goodsPrice - b.goodsPrice,
      render: (text, record, index) => (
        <EditableCell
          value={text}
          onChange={this.onCellChange(index, 'goodsPrice')}
        />
      )
    }, {
      title: '商品库存(件)',
      dataIndex: 'goodsCount',
      sorter: (a, b) => a.goodsCount - b.goodsCount,
      width: '10%',
      render: (text, record, index) => (
        <EditableCell
          value={text}
          onChange={this.onCellChange(index, 'goodsCount')}
        />
      )
    }
    , {
      title: '商品图片',
      dataIndex: 'goodsSrc',
      }
    
    , {
      title: '商品删除',
      dataIndex: 'goodsOperation',
      render: (text, record, index) => {
        return (
          this.state.dataSource.length > 1 ?
          (
            <Popconfirm title="确定删除?" onConfirm={() => this.onDelete(index)}>
              <a href="#">删除</a>
            </Popconfirm>
            
          ) : null
        );
      },
    }, {
      title: '商品添加',
      dataIndex: 'goodsAdd',
      render: (text, record, index) => {
        return (
          this.state.dataSource.length > 1 ?
          (
         
           <Button type="primary" onClick={() => this.setModalVisible(true)}>添加</Button>
         
            
          ) : null
        );
      },
    }
    
    ];
    this.state = {
      dataSource: [],
      count: 0,
      modal1Visible: false,
      modal2Visible: false,
    };
  }


  setModalVisible(modalVisible) {
    this.setState({ modalVisible });
    // console.log(this.props.te.props.defaultValue)
  }
  onCellChange = (index, key) => {
    var self = this
    var select = -1;//0：修改商品名称 1：修改商品价格 2：修改商品库存
    return (value) => {
          const dataSource = [...this.state.dataSource];
        // console.log(index,key,value,dataSource[index].goodsId)
  
      // dataSource[index][key] = value;
      // this.setState({ dataSource });
      switch (key) {
         case 'goodsName':
        //商品名称
          select=0;

          break;
         case 'goodsPrice':
        //商品价格
          select = 1;
          break;
        case 'goodsCount':
        //商品库存
          select =2;
          break;
       
      }
      fetch('/api/update',{
        method:'POST',
        headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body:JSON.stringify({
          optionValue:value,
          optionNum :select,
          optionId: dataSource[index].goodsId
        })
      }).then(function (response) {
         return response.json()
      }).then(function(results){
          // console.log("更新后的结果"+JSON.stringify(results))
          if (results.n>0) {
              dataSource[index][key] = value;
              self.setState({ dataSource });
          }

      })



    };
  }
     
  onDelete = (index) => {
     var self = this;
    const dataSource = [...this.state.dataSource];
    fetch('/api/delete',{
      method:'POST',
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
     },
      body:JSON.stringify({
        goodsName : dataSource[index].goodsName
      })
    }).then(function (response) {
   
          return response.json()
    }).then(function (result) {
          dataSource.splice(index, 1);
          for (var i = 0; i < dataSource.length; i++) {
              dataSource[i].goodsIndex= i+1;
                }
          self.setState({ dataSource });
    },function (error) {
        console.log(error)
    })

  }


  render() {
    const { dataSource,count,modalVisible} = this.state;
    const columns = this.columns;
    return (
      <div>
        <Table bordered dataSource={dataSource} columns={columns} loading={false}/>
          <Modal
          title="商品添加"
          wrapClassName="vertical-center-modal"
          visible={this.state.modalVisible}
          okText = '添加'
          cancelText= '取消'
          onOk={() => this.setModalVisible(false)}
          onCancel={() => this.setModalVisible(false)}
        >
    
         <p style={{ textAlign: 'center'}}><Tooltip placement="right" title='请输入商品名称' >商品名称:<Input placeholder='请输入商品名称'  style={{ width :240,marginLeft:20,marginTop:10}}/></Tooltip></p>
          <p style={{ textAlign: 'center'}}><Tooltip placement="right" title='请输入商品价格' >商品价格:<InputNumber ref = 'te' min={0} onChange={onChange} defaultValue={0} style={{ width :240,marginLeft:20,marginTop:10}}/></Tooltip></p>
           <p style={{ textAlign: 'center'}}><Tooltip placement="right" title='请输入商品库存' >商品库存:<InputNumber min={0}  defaultValue={0} style={{ width :240,marginLeft:20,marginTop:10}}/></Tooltip></p>
            <p style={{ textAlign: 'center'}}>商品分类:<Select defaultValue="1" style={{ width :240,marginLeft:20,marginTop:10}} >
              <Select.Option value="1">油品</Select.Option>
              <Select.Option value="2">蓄电池</Select.Option>
              <Select.Option value="3" >过滤器</Select.Option>
              <Select.Option value="4">制动器</Select.Option>
               <Select.Option value="5">轮胎</Select.Option>
          </Select></p>
        </Modal>
      </div>
    );
  }

  componentDidMount(){
    console.log(this)
    var self = this;
    const data = []
    fetch('/api/all')
    .then(function (response) {
      return response.json();
    }).then(function (result) {
      // console.log(result)
      for (var i = 0; i < result.length; i++) {
            // console.log(result[i]._id)
        data.push({
          key:i,
          goodsId:result[i]._id,
          goodsIndex: i+1,
          goodsName: result[i].goodsName,
          goodsCount:result[i].goodsCount,
          goodsPrice:result[i].goodsPrice,
          goodsSrc: <img src= {result[i].goodsSrc}/>
     
        })
      }
      // console.log(this)
      
      // console.log(data)
      self.setState({
        dataSource : data,
        count :data.length
       
      })
     
    },function (error) {
      console.log(error)
    })
   
  }
}

