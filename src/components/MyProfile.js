import React, {Component} from 'react';
import { Card, List, Descriptions, Avatar } from 'antd';
import axios from "axios";
import AddPet from "./AddPet";

import {BASE_URL, TOKEN_KEY} from "../constants/constants";
import Spinner from '../commons/Spinner';
import EditPet from "./EditPet"

class MyProfile extends Component {

    constructor() {
        super();
        this.state = {
            userProfile: {},
            pets: [],
        }
    }

    fetchProfile = () => {
        const optGetProfile = {
            method: "GET",
            url: `${BASE_URL}/getprofile`,
            headers: {
                'Authorization': `Bearer ${ localStorage.getItem(TOKEN_KEY) }`
            }
        };
        axios(optGetProfile)
            .then((res) => {
                console.log(res)
                if (res.status === 200) {
                    this.setState({
                        userProfile: res.data
                    })
                }
            })
    };

    fetchPets = () => {
        const optGetPets = {
            method: "GET",
            url: `${BASE_URL}/getpets`,
            headers: {
                Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
            }
        }
        axios(optGetPets)
            .then((res) => {
                console.log(res.data)
                if (res.status === 200) {
                    this.setState({
                        pets: res.data ? res.data : [],
                    })
                    if (this.state.pets[0]) {
                        this.hadPets = true;
                    }
                }
            })
    };

    handleRerender = () => {
        setTimeout(() => {
                this.fetchPets();
            },
            800
        )
    }

    componentDidMount() {
        this.fetchProfile();
        this.fetchPets();
    }

    render() {
        const { pets, userProfile, isLoading } = this.state;
        return (
            <>
                <div>
                    <h1 className='myProfile-title page-title'>My Profile</h1>
                    <Descriptions
                        column={1}
                    >
                        <Descriptions.Item label="Email Address">{ userProfile.email }</Descriptions.Item>
                        <Descriptions.Item label="Full Name">{ userProfile.firstname } { userProfile.lastname }</Descriptions.Item>
                    </Descriptions>
                    <hr />

                    <div>
                        <h3 style={{ marginBottom: 16 }}>My Pets:</h3>
                        <List
                            grid={{ gutter: 16,
                                xs: 1,
                                sm: 2,
                                md: 4,
                                lg: 4,
                                xl: 6,
                                xxl: 3, }}
                            dataSource={pets}
                            renderItem={pet => (
                                <div>
                                    <List.Item>
                                        <Card title={pet.name} bordered={true} extra={<EditPet fetchPets={this.fetchPets} pet={pet} handleRerender={this.handleRerender}/>}>
                                            <Card.Meta className="PetPhoto"
                                                       avatar={<Avatar src={pet.photo} size={150} />}

                                            />
                                            <p className="main-text" style={{"color": "lightsteelblue", "font-size": "16px"}}>{pet.type}</p>
                                            <p className="main-text">{pet.weight} lbs</p>
                                            <p className="main-text">{pet.ageyear} years {pet.agemonth} months old</p>
                                            <p className="main-text">Sex: {pet.sex}</p>
                                            <p className="main-text">Breed: {pet.breed}</p>
                                        </Card>
                                    </List.Item>
                                </div>
                            )}
                        />
                    </div>
                    <AddPet fetchPets={this.fetchPets}/>
                </div>

            </>
        );
    }
}

export default MyProfile;



