import React, { Component } from 'react';
import axios from "axios";
import { Button, DatePicker, Select, Table, Tag, message } from 'antd';

import {BASE_URL, TOKEN_KEY} from "../constants/constants";

const { Option } = Select;
const columns = [
    {
      title: 'Reaction Date',
      dataIndex: 'reaction_date',
      key: 'reaction_date',
    },
    {
      title: 'Food Name',
      dataIndex: 'food_name',
      key: 'food_name',
    },
    {
      title: 'Reaction Name',
      dataIndex: 'reaction_name',
      key: 'reaction_name',
      render: name => {
            let color = name.length > 5 ? 'geekblue' : 'green';
            if (name === 'loser') {
                color = 'volcano';
            }
            return (
                <Tag color={color} key={name}>
                {typeof(name) === "object" ? name.join(', ') : name}
                </Tag>
            );
        },
    }
];
class ReactionTracker extends Component {
    constructor() {
        super();
        this.state = {
            foodNames: [],
            reactionNames: [],
            newRaction: {
                reaction_date:"",
                food_name: "",
                reaction_name:[]            
            },
            reactions: []
        }
    }

    fetchFoodReactionNames = () => {
        const optFoodNames = {
            method: "get",
            url: `${BASE_URL}/getfoods`,
            headers: {
                Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
            }
        };
        axios(optFoodNames).then(
            res => {
                if (res.status === 200) {
                    this.setState({ foodNames: res.data ? res.data : []})
                }
            }
        )
        const optReactionNames = {
            method: "get",
            url: `${BASE_URL}/getreactions`,
            headers: {
                Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
            }
        };
        axios(optReactionNames).then(
            res => {
                if (res.status === 200) {
                    this.setState({ reactionNames: res.data ? res.data : []})
                }
            }
        )
    };

    fetchReactions = () => {
        const optReactionNames = {
            method: "get",
            url: `${BASE_URL}/getpetreactions`,
            headers: {
                Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
            }
        };
        axios(optReactionNames).then(
            res => {
                if (res.status === 200) {
                    this.setState({ reactions: res.data ? res.data : [] })
                }
            }
        )
    };

    uploadReaction = () => {
        const opt = {
            method: "post",
            url: `${BASE_URL}/uploadpetreaction`,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
                'content-type': 'application/json'
            },
            data: this.state.newRaction
        };
        axios(opt).then(
            res => {
                if (res.status === 200) {
                    message.success('Upload new reaction successfully!')
                    // send another request to get state.reactions
                    // or update state.reactions
                    this.setState((prevState, _) => ({ // update state.reactions
                        reactions: prevState.reactions.length === 0 ? [prevState.newRaction] : [...prevState.reactions, prevState.newRaction]
                    }))
                }
            }
        ).catch(() => {
            message.error("Failed to save, please try again!")
        })
    };

    componentDidMount() {
        // send request to get food names and reaction names
        this.fetchFoodReactionNames();
        // send request to get reactions to generate table
        this.fetchReactions();
    }

    handleSelectedDateChange = (_, dateString) => {
        this.setState((prevState, _) => ({
            newRaction: {
                ...prevState.newRaction,
                reaction_date: dateString         
            }
        }))
    }

    handleSelectedFoodChange = value => {
        this.setState((prevState, _) => ({
            newRaction: {
                ...prevState.newRaction,
                food_name: value         
            }
        }))
    }

    handleSelectedReactionChange = value => {
        this.setState((prevState, _) => ({
            newRaction: {
                ...prevState.newRaction,
                reaction_name: value         
            }
        }))
    }

    handleSaveReactionClick = () => {
        this.uploadReaction();
    }

    render() {
        const { foodNames, reactionNames, reactions } = this.state;
        return (
            // use state.foodNames and state.reactionNames generate selectors
            // when user select selector(time, food, reactions), update state newReaction
            // when user click save, send request to upload state.newReaction and, and send another request to get state.reactions
            <div>
                <h1 className='myProfile-title page-title'>Reaction Tracker</h1>
                <div className="save-reaction">
                    <DatePicker 
                        className="save-reaction-selector" 
                        style={{ width: '40%' }}
                        onChange={this.handleSelectedDateChange} 
                    />
                    <Select 
                        className="save-reaction-selector"
                        style={{ width: '40%' }}
                        placeholder="Select a food" 
                        onChange={this.handleSelectedFoodChange}
                    >
                        {
                            foodNames.map(food => 
                                <Option key={food.name} value={food.name}>
                                    {food.name}
                                </Option>
                            )
                        }
                    </Select>
                    <Select mode="multiple"
                        className="save-reaction-selector"
                        style={{ width: '40%' }}
                        placeholder="Select a reaction" 
                        onChange={this.handleSelectedReactionChange}
                    >
                        {
                            reactionNames.map(reaction => 
                                <Option key={reaction.reaction_name} value={reaction.reaction_name}>
                                    {reaction.reaction_name}
                                </Option>
                            )
                        }
                    </Select>
                    <Button 
                        className="save-reaction-selector"
                        style={{ width: '20%' }}
                        type="primary" 
                        onClick={this.handleSaveReactionClick}
                    >   
                        Save
                    </Button>
                </div>
                <div className="reaction-table">
                    <Table columns={columns} dataSource={reactions} />
                </div>
            </div>
        );
    }
}

export default ReactionTracker;