import React, {Component} from 'react';
import {Input, Button, Table, Popconfirm, Form, message} from "antd";

import {BASE_URL, TOKEN_KEY} from "../constants/constants";
import axios from "axios";

const { Search } = Input;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);


class EditableCell extends React.Component {
    state = {
        editing: false,
    };


    toggleEdit = () => {
        const editing = !this.state.editing;
        this.setState({ editing }, () => {
            if (editing) {
                this.input.focus();
            }
        });
    };

    save = e => {
        console.log(e.target.value);
        const { record, handleSave } = this.props;
        this.form.validateFields((error, values) => {
            if (error && error[e.currentTarget.id]) {
                return;
            }
            // this.toggleEdit();
            handleSave({ ...record, ...values });
        });
    };

    renderCell = form => {
        this.form = form;
        const { children, dataIndex, record, title } = this.props;
        const { editing } = this.state;

        return editing ? (
            <Form.Item style={{ margin: 0 }}>
                {form.getFieldDecorator(dataIndex, {
                    rules: [
                        {
                            required: true,
                            message: `${title} is required.`,
                        },
                    ],
                    initialValue: record[dataIndex],
                })(<Input ref={node => (this.input = node)}
                          onPressEnter={this.save}
                          onBlur={this.save}
                          onChange={this.save}
                />)}
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{ paddingRight: 2 }}
                onClick={this.toggleEdit}
            >
                {children}
            </div>
        );
    };




    render() {
        const {
            editable,
            dataIndex,
            title,
            record,
            index,
            handleSave,
            children,
            ...restProps
        } = this.props;
        return (
            <td {...restProps}>
                {editable ? (
                    <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
                ) : (
                    children
                )}
            </td>
        );
    }
}

class FoodTracker extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: 'Food Name',
                dataIndex: 'name',
                width: '30%',
                editable: true,
                className: "food-tracker-table-column",
                key: "name"
            },
            {
                title: 'Brand',
                dataIndex: 'brand',
                width: '15%',
                editable: true,
                className: "food-tracker-table-column",
                key: "brand"
            },
            {
                title: 'Ingredient 1',
                dataIndex: 'ingredient1',
                editable: true,
                className: "food-tracker-table-column",
                key: "ingredient1"
            },
            {
                title: 'Ingredient 2',
                dataIndex: 'ingredient2',
                editable: true,
                className: "food-tracker-table-column",
                key: "ingredient2"
            },
            {
                title: 'Ingredient 3',
                dataIndex: 'ingredient3',
                editable: true,
                className: "food-tracker-table-column",
                key: "ingredient3"
            },
            {
                title: 'Ingredient 4',
                dataIndex: 'ingredient4',
                editable: true,
                className: "food-tracker-table-column",
                key: "ingredient4"
            },
            {
                title: 'Ingredient 5',
                dataIndex: 'ingredient5',
                editable: true,
                className: "food-tracker-table-column",
                key: "ingredient5"
            },
            {
                title: 'Ingredient 6',
                dataIndex: 'ingredient6',
                editable: true,
                className: "food-tracker-table-column",
                key: "ingredient6"
            },
        ];

        this.state = {
            foods: [{

            }
            ],
            count: 0,
            testEditing: false,
            editingKey: '',
        };
    }

    handleDelete = key => {
        const dataSource = [...this.state.dataSource];
        this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
    };

    handleAdd = () => {
        const { count, foods } = this.state;
        const newData = {
            name: [],
            brand: [],
            ingredient1: [],
            ingredient2: [],
            ingredient3: [],
            ingredient4: [],
            ingredient5: [],
            ingredient6: []
        };
        this.setState({
            foods: [...foods, newData],
            // count: count + 1,
        });
    };

    handleSave = row => {
        const newData = [...this.state.foods];
        const index = newData.length - 1;
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        this.setState({ foods: newData });
        // console.log(this.state.foods);
    };

    uploadFood = () => {
        const {foods, count} = this.state;
        const optUploadFood = {
            url: `${BASE_URL}/uploadfood`,
            method: "POST",
            headers:
                {
                    Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
                },
            data:
                {
                    "name": `${foods[this.state.count].name}`,
                    "brand": `${foods[this.state.count].brand}`,
                    "ingredient1": `${foods[this.state.count].ingredient1}`,
                    "ingredient2": `${foods[this.state.count].ingredient2}`,
                    "ingredient3": `${foods[this.state.count].ingredient3}`,
                    "ingredient4": `${foods[this.state.count].ingredient4}`,
                    "ingredient5": `${foods[this.state.count].ingredient5}`,
                    "ingredient6": `${foods[this.state.count].ingredient6}`
                }
        };
        axios(optUploadFood)
            .then((res) => {
                if (res.status === 200) {
                    message.success("Save succeeded")
                }
            })
            .catch((err) =>
            {
                message.error("Upload to server failed!")
                // console.log("Upload to server failed: ", err.message)
            });
        this.setState(
            {
                count: count + 1
            }
        )
    }


    componentDidMount() {
        const optGetFoods = {
            method: "GET",
            url: `${BASE_URL}/getfoods`,
            headers: {
                Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
            }
        }
        axios(optGetFoods)
            .then((res) => {
                if (res.status === 200) {
                    this.setState({
                        foods: res.data ? res.data : [],
                        count: res.data ? res.data.length : 0
                    })
                    for (var i = 0; i < this.state.count - 1; i++) {
                        this.setState({
                        })
                    }
                }
            })
    }

    render() {
        const { foods } = this.state;
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };
        const columns = this.columns.map(col => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: (record, rowIndex) => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: this.handleSave,
                }),
            };
        });


        const addOrSave = () => {
            const {count, foods}=this.state;

            if (foods.length === count) {
                return (
                    <Button onClick={this.handleAdd} style={{marginBottom: 16}} size='large'>
                        Add Food
                    </Button>
                )
            } else {
                return (
                    <Button onClick={this.uploadFood} type="primary" style={{marginBottom: 16}} size='large'>
                        Save New-added Food
                    </Button>
                )

            }
        }

        return (
            <div className="food-tracker">
                <h1 className="food-tracker-title">Food Tracker</h1>
                <div className="add-food-bar">
                    <Search
                        className='add-food-bar-input-box'
                        placeholder="Please input URL (function is developing)"
                        disabled={true}
                        enterButton="Confirm"
                        size="large"
                    />
                </div>
                <div>
                    <Table
                        className="food-tracker-table"
                        rowKey="foodRowId"
                        components={components}
                        rowClassName={() => 'editable-row'}
                        bordered
                        dataSource={ foods }
                        columns={columns}
                        pagination={false}
                    />
                </div>

                <div className="add-save-btn">{addOrSave()}</div>

            </div>
        );
    }
}

export default FoodTracker;