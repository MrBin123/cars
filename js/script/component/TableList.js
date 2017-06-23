import React from 'react'
import { Table, Input, Icon, Button, Popconfirm } from 'antd';

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
      title: '商品序号',
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
          onChange={this.onCellChange(index, 'name')}
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
          onChange={this.onCellChange(index, 'name')}
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
          onChange={this.onCellChange(index, 'name')}
        />
      )
    }
    , {
      title: '商品图片',
      dataIndex: 'goodsSrc',
      }
    
    , {
      title: '商品操作',
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
    }];

    this.state = {
      dataSource: [{
        key: '0',
        goodsIndex: '1',
        goodsName: '博世空frwerferf气滤清器1',
        goodsPrice: '100',
        goodsCount:'1001',
        goodsSrc:<img src="http://image.autozi.com/goods/6114/672/1309051537583735/thumb_960/thumb_960_96095744585-cbe9-4723-845c-c4cd97e333eb.jpg"/>

      },{ key: '1',
        goodsIndex: '2',
        goodsName: '博世空rrrrrrrrrrrrrrrrrrrrrr气滤清器2',
        goodsPrice: '200',
        goodsCount:'1002',
        goodsSrc:<img  src="https://image.autozi.com/goodsImage/170/1700000970/150_960_1.jpg"/>

      },{ key: '2',
        goodsIndex: '3',
        goodsName: '博世滤清器2',
        goodsPrice: '50',
        goodsCount:'1003',
        goodsSrc:<img  src="http://image.autozi.com/goods/6114/672/1309051537583735/thumb_960/thumb_960_96095744585-cbe9-4723-845c-c4cd97e333eb.jpg"/>

      },{ key: '3',
        goodsIndex: '4',
        goodsName: '博世空气165454646滤清器2',
        goodsPrice: '200',
        goodsCount:'100',
        goodsSrc:<img  src="https://image.autozi.com/goodsImage/170/1700000970/150_960_1.jpg"/>

      }
      ],
      count: 2,
    };
  }
  onCellChange = (index, key) => {
    return (value) => {
      const dataSource = [...this.state.dataSource];
      dataSource[index][key] = value;
      this.setState({ dataSource });
    };
  }
  onDelete = (index) => {
    const dataSource = [...this.state.dataSource];
    dataSource.splice(index, 1);
    this.setState({ dataSource });
  }
  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      key: count,
      name: `Edward King ${count}`,
      age: 32,
      address: `London, Park Lane no. ${count}`,
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  }
  render() {
    const { dataSource } = this.state;
    const columns = this.columns;
    return (
      <div>
        <Button className="editable-add-btn" onClick={this.handleAdd}>Add</Button>
        <Table bordered dataSource={dataSource} columns={columns} loading={false}/>
      </div>
    );
  }
}

