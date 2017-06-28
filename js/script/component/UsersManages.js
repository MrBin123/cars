import React from 'react'
import { Table, Input, Icon, Button, Popconfirm,Modal,InputNumber,Select,Tooltip,notification  } from 'antd';
export default class UsersManages extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: '序号',
      dataIndex: 'usersIndex',
    
      sorter: (a, b) => a.usersIndex - b.usersIndex,
    },
     {
      title: '用户ID',
      dataIndex: 'usersId',
   
    }, {
      title: '用户名称',
      dataIndex: 'usersName',
        width: '10%'
    }, {
      title: '用户密码',
      dataIndex: 'usersPassword',
      width: '10%'

    }, {
      title: '联系方式',
      dataIndex: 'usersTelephone',
    
      width: '10%'
    }
    , {
      title: '用户邮箱',
      dataIndex: 'usersEmail',
        width: '14%'
      }
    
    , {
      title: '用户操作',
      dataIndex: 'usersDel',
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
    }
    ];
    this.state = {
      dataSource: [],
      count: 0
    };
  }


  onDelete = (index) => {
     var self = this;
    const dataSource = [...this.state.dataSource];
    fetch('/dpi/delete',{
      method:'POST',
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
     },
      body:JSON.stringify({
        username : dataSource[index].usersName
      })
    }).then(function (response) {
          return response.json()
    }).then(function (result) {
           notification['success']({
              message: '提示:',
              description: '成功删除用户:'+ dataSource[index].usersName,
              duration : 2
            });
          dataSource.splice(index, 1);
          for (var i = 0; i < dataSource.length; i++) {
              dataSource[i].usersIndex= i+1;
                }
          self.setState({ dataSource });
    },function (error) {
        console.log(error)
    })
       
  }


  render() {
    const { dataSource,count} = this.state;
    const columns = this.columns;
    return (
      <div>
        <Table bordered dataSource={dataSource} columns={columns} loading={false}/>
      </div>
    );
  }

  componentDidMount(){
    // console.log(this)
    var self = this;
    const data = []
    
    fetch('/dpi/all')
    .then(function (response) {
      return response.json();
    }).then(function (result) {
      // console.log(result)
      for (var i = 0; i < result.length; i++) {
            // console.log(result[i]._id)
        data.push({
          key:i,
          usersId:result[i]._id,
          usersIndex: i+1,
          usersName: result[i].username,
          usersPassword:result[i].password,
          usersTelephone:result[i].telephone,
          usersEmail:result[i].email
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

