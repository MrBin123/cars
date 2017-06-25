import React from 'react'
import { InputNumber } from 'antd';

function onChange(value) {
  console.log('changed', value);
}

export default class TableAdd extends React.Component {
    render(){

        return (
         <InputNumber min={1} max={10} defaultValue={3} onChange={onChange} />
        )

    }
 
}