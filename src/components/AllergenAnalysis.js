import React from 'react';
import axios from 'axios';

import { BASE_URL, TOKEN_KEY } from '../constants/constants';

class AllergenAnalysis extends React.Component {
    state = {
        allergenAnalysis: null
    }

    fetchAllergenAnalysis = () => {
        const optReactionNames = {
            method: "get",
            url: `${BASE_URL}/getallergens`,
            headers: {
                Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
            }
        };
        axios(optReactionNames).then(
            res => {
                if (res.status === 200) {
                    this.setState({ allergenAnalysis: res.data })
                }
            }
        )
    };

    componentDidMount() {
        this.fetchAllergenAnalysis();
    }

    render() {
        const { allergenAnalysis } = this.state;
        return (
            <div>
                <h1 className='allergen-analysis-title page-title'>Allergen Analysis</h1>
                {
                    allergenAnalysis ? (
                        <>
                            <p>Based on our analysis, Coco might have allergy or intolerance to the ingredients below: </p>
                            <div>
                            {
                                allergenAnalysis.join(", ")
                            }
                            </div> 
                        </>
                    ) : (
                        <>
                            <p>Oops! You don't have enough data to perform an allergen analysis. Please add more food and come back later!</p>
                        </>
                    )
                }
            </div>
        );
    } 
}

export default AllergenAnalysis;