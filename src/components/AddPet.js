import React, {Component} from 'react';
import { Form, Input, InputNumber, Modal, Button, Radio, Upload, Select, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

import dogIcon from '../assets/images/dog_icon.png';
import catIcon from '../assets/images/cat_icon.png';
import { BASE_URL, TOKEN_KEY } from '../constants/constants';

const { Option } = Select;

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

class AddPet extends Component {
    state = {
        displayModal: false,
        imageUrl: "",
        resetForm: 1,
        petInfo: {
            name: "",
            photo: "",
            type: "Dog",
            weight: "",
            ageyear: "",
            agemonth: "",
            sex: "",
            breed: ""
        },
        breeds: {
            dog: [],
            cat: []
        }
    }

    fetchBreeds = (type) => {
        const optGetProfile = {
            method: "post", // need to change back to `get`, after backend fix their bug
            url: `${BASE_URL}/getbreeds`,
            headers: {
                'Authorization': `Bearer ${ localStorage.getItem(TOKEN_KEY) }`,
                'content-type': 'application/json'
            },
            data: { animal_specie: type }
        };
        return axios(optGetProfile)
            .then((res) => {
                if (res.status === 200) {
                    return res.data ? res.data.map(obj => obj.breed_name) : [];
                }
            })
    }

    componentDidMount() {
        this.fetchBreeds("Dog").then(res => 
            this.setState((prevState, _) => {
                const newBreeds = { ...prevState.breeds, dog: res, };
                return { breeds: newBreeds };
            })
        );
        this.fetchBreeds("Cat").then(res => 
            this.setState((prevState, _) => {
                const newBreeds = { ...prevState.breeds, cat: res, };
                return { breeds: newBreeds };
            })
        );
    }

    handlePetTypeChange = e => {
        this.setState((prevState, _) => {
            const newPetInfo = {...prevState.petInfo, type: e.target.value};
            return {
                petInfo: newPetInfo
            }
        });
    }

    handlePetSexChange = e => {
        this.setState((prevState, _) => {
            const newPetInfo = {...prevState.petInfo, sex: e.target.value};
            return {
                petInfo: newPetInfo
            }
        });
    }

    handleNameChange = e => {
        this.setState((prevState, _) => {
            const newPetInfo = {...prevState.petInfo, name: e.target.value};
            return {
                petInfo: newPetInfo
            }
        });
    }

    handleWeightChange = value => {
        this.setState((prevState, _) => {
            const newPetInfo = {...prevState.petInfo, weight: value};
            return {
                petInfo: newPetInfo
            }
        });
    }

    handleAgeYearChange = value => {
        this.setState((prevState, _) => {
            const newPetInfo = {...prevState.petInfo, ageyear: value};
            return {
                petInfo: newPetInfo
            }
        });
    }

    handleAgeMonthChange = value => {
        this.setState((prevState, _) => {
            const newPetInfo = {...prevState.petInfo, agemonth: value};
            return {
                petInfo: newPetInfo
            }
        });
    }

    handleBreedChange = value => {
        this.setState((prevState, _) => {
            const newPetInfo = {...prevState.petInfo, breed: value};
            return {
                petInfo: newPetInfo
            }
        });
    }

    handleUploadChange = ({ fileList }) => {
        if (fileList && fileList.length > 0) {
            this.setState((prevState, _) => {
                const newPetInfo = {...prevState.petInfo, photo: fileList[fileList.length - 1].originFileObj };
                return {
                    petInfo: newPetInfo
                }
            });

            getBase64(fileList[fileList.length - 1].originFileObj, imageUrl =>
                this.setState({imageUrl}),
            );
        }
    };

    addPetClick = () => {
        this.setState({displayModal: true})
    }

    handleCancel = () => {
        this.setState({displayModal: false})
    };

    handleSubmit = e => {
        e.preventDefault();
        const { petInfo } = this.state;
        let formData = new FormData();
        formData.append("name", petInfo.name);
        formData.append("photo", petInfo.photo);
        formData.append("type", petInfo.type);
        formData.append("weight", petInfo.weight);
        formData.append("ageyear", petInfo.ageyear);
        formData.append("agemonth", petInfo.agemonth);
        formData.append("sex", petInfo.sex);
        formData.append("breed", petInfo.breed);

        const optGetProfile = {
            method: "POST",
            url: `${BASE_URL}/uploadpet`,
            headers: {
                'Authorization': `Bearer ${ localStorage.getItem(TOKEN_KEY) }`
            },
            data: formData
        };
        axios(optGetProfile)
            .then(res => {
                if (res.status === 200) {
                    setTimeout(() => {
                        message.success(`Added ${petInfo.name} successfully!`);
                        this.setState({
                            displayModal: false,
                            petInfo: {
                                name: "",
                                photo: "",
                                type: "",
                                weight: "",
                                ageyear: "",
                                agemonth: "",
                                sex: "",
                                breed: ""
                            },
                            imageUrl: "",
                            resetForm: this.state === 0 ? 1 : 0
                        });
                        this.props.fetchPets();
                    }, 1500);
                }
            })
            .catch(err => {
                    message.error(`Failed to add ${petInfo.name}, please try again!`);
                }
            )
    };

    render() {
        const { displayModal, imageUrl, resetForm, breeds, petInfo } = this.state;
        const uploadButton = (
            <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
            </div>
        );
        return (
            <div key={resetForm}>
                <Button className="add-pet-btn" type="primary" onClick={this.addPetClick}>
                    Add Pet
                </Button>
                <Modal title="Add Pet"
                       visible={displayModal}
                       onCancel={this.handleCancel}
                       footer={null}
                       distroyOnclose={true}
                >

                    <div className='upload-photo'>
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            beforeUpload={() => false}
                            onChange={this.handleUploadChange}
                        >
                            {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                        </Upload>
                    </div>

                    <Form name="pet_information"
                          onSubmit={this.handleSubmit}
                    >
                        <Form.Item
                            name="pet_type"
                            label="Pet type">
                            <Radio.Group defaultValue="Dog" buttonStyle="solid" onChange={this.handlePetTypeChange}>
                                <Radio.Button value="Dog" className='pet-button'>
                                    <img className='pet-icon' src={dogIcon} alt='dog Icon' />
                                    Dog
                                </Radio.Button>
                                <Radio.Button value="Cat" className='pet-button'>
                                    <img className='pet-icon' src={catIcon} alt='cat Icon' />
                                    Cat
                                </Radio.Button>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item
                            name="pet_name"
                            label="Name"
                        >
                            <Input className='name-input' onChange={this.handleNameChange}/>
                        </Form.Item>

                        <Form.Item
                            label="Weight(lbs)"
                            rules={[
                                {
                                    type: 'number',
                                    min: 0,
                                    max: 99,
                                },
                            ]}
                        >
                            <InputNumber onChange={this.handleWeightChange}/>
                        </Form.Item>

                        <Form.Item
                            name="pet_year_age"
                            className="age"
                            label="Age(Yr.)"
                            rules={[
                                {
                                    type: 'number',
                                    min: 0,
                                    max: 99,
                                },
                            ]}
                        >
                            <InputNumber onChange={this.handleAgeYearChange}/>
                        </Form.Item>

                        <Form.Item
                            name="pet_month_age"
                            className="age"
                            label="Age(Mo.)"
                            rules={[
                                {
                                    type: 'number',
                                    min: 1,
                                    max: 12,
                                },
                            ]}
                        >
                            <InputNumber onChange={this.handleAgeMonthChange}/>
                        </Form.Item>

                        <Form.Item
                            name="pet_sex"
                            label="Sex">
                            <Radio.Group buttonStyle="solid" onChange={this.handlePetSexChange}>
                                <Radio.Button value="Male">Male</Radio.Button>
                                <Radio.Button value="Female">Female</Radio.Button>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item
                            name="pet_breed"
                            label="Breed"
                        >
                            <Select defaultValue="" onChange={this.handleBreedChange}>
                                {
                                    breeds && breeds[petInfo.type.toLocaleLowerCase()] && breeds[petInfo.type.toLocaleLowerCase()].map((breed, index) => 
                                        <Option key={breed} value={breed}>{breed}</Option>
                                    ) // need to change back to `key={breed} value={index}`, after backend fix their bug
                                }
                            </Select>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Save Pet
                            </Button>
                        </Form.Item>

                    </Form>
                </Modal>
            </div>
        );
    }
}

export default AddPet;