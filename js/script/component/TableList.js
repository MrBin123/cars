import React from 'react'

import { Table, Input, Icon, Button, Popconfirm,Modal,InputNumber,Select,Tooltip,notification  } from 'antd';

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
     let self = this
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
         
           <Button type="primary" onClick={() => this.setModalVisible(true,0)}>添加</Button>
         
            
          ) : null
        );
      },
    }
    
    ];
    this.state = {
      dataSource: [],
      count: 0,

      modalVisible: false,
      goodsCount : 0,
      goodsPrice : 0,
      type :"1"
    };
  }

  onChangePrice(value) {
    //商品价格回调
    this.state.goodsPrice = value
    console.log('商品价格'+ value);
}
  onChangeCount(value){
      //商品库存回调
     console.log('商品库存'+ value);
     this.state.goodsCount = value
  }

 handleChange(value) {
  //商品分类回调
  console.log('商品分类'+ value);
    this.state.type = value
}
  setModalVisible(modalVisible,index) {
    // console.log(modalVisible+"----"+index)
    let self = this
    let addData ={}
    //index 0:初次点击添加按钮 1：添加 2：取消
      if (index ==0 || index ==2) {
        this.setState({ modalVisible });
      }

    if (index == 1) {
      //  console.log( goodsName + goodsCount +goodsPrice +goodsSrc +type)
       if (self.refs.goodsName.refs.input.value == '') {
            notification['error']({
              message: '提示',
              description: '商品名称不能为空',
              duration : 1
            });
       }else{
          // console.log(self.refs.goodsName.refs.input.value + this.state.goodsCount +this.state.goodsPrice +self.refs.goodsSrc.refs.input.value+this.state.type)
          addData.goodsName = self.refs.goodsName.refs.input.value
          addData.goodsCount = this.state.goodsCount
          addData.goodsPrice = this.state.goodsPrice
          addData.goodsSrc = self.refs.goodsSrc.refs.input.value
          addData.type = this.state.type
          // console.log(addData)
          console.log(JSON.stringify(addData))
             fetch('/api/add',{
                method:'POST',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                 },
                body:JSON.stringify(addData)
              }).then(function (response) {
                    return response.json()
              }).then(function (result) {
                    // console.log("收到的结果"+JSON.stringify(result))
                    switch (result.code) {
                      case '0':
                           notification['error']({
                              message: '提示',
                              description: '商品添加失败!',
                              duration : 1
                            });
                         break;
                      case '1':
                         notification['success']({
                              message: '提示',
                              description: '商品添加成功!',
                              duration : 1
                            });
                        //  self.setState({ modalVisible });
                        // fetch('/api/all').then(function (response) {
                        //     return response.json()
                        // }).then(function (result) {
                        //     console.log(result)
                        //     var data = [];
                         
                        //     for (var i = 0; i < result.length; i++) {
                        //         data.push({
                        //             key:i,
                        //             goodsId:result[i]._id,
                        //             goodsIndex: i+1,
                        //             goodsName: result[i].goodsName,
                        //             goodsCount:result[i].goodsCount,
                        //             goodsPrice:result[i].goodsPrice,
                        //             goodsSrc: <img src= {result[i].goodsSrc}/>
                        //           })
                            
                        //         }
                        //       console.log(data)
                            self.refs.goodsName.refs.input.value = ''
                            self.refs.goodsSrc.refs.input.value =''
                            // console.log(self)
                            self.setState({ 
                              goodsCount :0,
                              goodsPrice :0,
                              type: "1",
                              modalVisible :false});
                              window.location.reload()
                        // })
                        break;
                      case '2':
                          notification['warning']({
                              message: '提示',
                              description: '商品已经存在!',
                              duration : 1
                            });
                        break;
                    }
              },function (error) {
                  console.log(error)
              })

       }

    }
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
        <Table bordered dataSource={dataSource} columns={columns} loading={false}  />
          <Modal
          title="新商品添加"
          wrapClassName="vertical-center-modal"
          visible={this.state.modalVisible}
          okText = '添加'
          cancelText= '取消'
          onOk={() => this.setModalVisible(false,1)}
          onCancel={() => this.setModalVisible(false,2)}
        >
    
         <p style={{ textAlign: 'center'}}><Tooltip placement="right" title='请输入商品名称' >商品名称:<Input placeholder='请输入商品名称' ref ='goodsName' style={{ width :240,marginLeft:20,marginTop:10}}/></Tooltip></p>
          <p style={{ textAlign: 'center'}}><Tooltip placement="right" title='请输入商品价格' >商品价格:<InputNumber onChange={this.onChangePrice.bind(this)} min={0}  defaultValue={0} style={{ width :240,marginLeft:20,marginTop:10}}/></Tooltip></p>
           <p style={{ textAlign: 'center'}}><Tooltip placement="right" title='请输入商品库存' >商品库存:<InputNumber onChange={this.onChangeCount.bind(this)} min={0}  defaultValue={0} style={{ width :240,marginLeft:20,marginTop:10}}/></Tooltip></p>
           <p style={{ textAlign: 'center'}}><Tooltip placement="right" title='请输入商品链接' >商品链接:<Input ref ='goodsSrc' style={{ width :240,marginLeft:20,marginTop:10}}/></Tooltip></p>
            <p style={{ textAlign: 'center'}}>商品分类:<Select defaultValue="1" onChange={this.handleChange.bind(this)} style={{ width :240,marginLeft:20,marginTop:10}} >
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
    // console.log(this)
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

