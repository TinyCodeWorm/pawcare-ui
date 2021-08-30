import React from 'react';
import { Spin } from 'antd';

function Spinner(props) {
    return (
        <div>
            <Spin tip="Loading..." size="large"/>
        </div>
    );
}

export default Spinner;