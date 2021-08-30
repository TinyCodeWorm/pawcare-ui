import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import * as urlPaths from '../constants/paths';

import SignUp from './SignUp';
import SignIn from './SignIn';
import MyProfile from "./MyProfile";
import AllergenAnalysis from './AllergenAnalysis';
import ReactionTracker from './ReactionTracker';
import FoodTracker from "./FoodTracker";

function Main(props) {
    const { signedIn, signedInSuccess } = props;

    const showSignIn = () => {
        return signedIn ? <Redirect to={urlPaths.MY_PROFILE_PATH}/> : <SignIn signedInSuccess={signedInSuccess}/>;
    };

    const showMyProfile = () => {
        return signedIn ? <MyProfile /> : <Redirect to={urlPaths.SIGN_IN_PATH} />;
    };

    const showReactionTracker = () => {
        return signedIn ? <ReactionTracker /> : <Redirect to={urlPaths.SIGN_IN_PATH} />;
    };

    const showAllergenAnalysis = () => {
        return signedIn ? <AllergenAnalysis /> : <Redirect to={urlPaths.SIGN_IN_PATH} />;
    };

    const showFoodTracker = () => {
        return signedIn ? <FoodTracker /> : <Redirect to={urlPaths.SIGN_IN_PATH} />;
    };

    return (
        <div class="main">
            <Switch>
                <Route path={urlPaths.START_PATH} exact render={showSignIn} />
                <Route path={urlPaths.SIGN_IN_PATH} render={showSignIn} />
                <Route path={urlPaths.SIGN_UP_PATH} component={SignUp}/>

                <Route path={urlPaths.FOOD_TRACKER_PATH} render={showFoodTracker}/>
                <Route path={urlPaths.REACTION_TRACKER_PATH} render={showReactionTracker} />
                <Route path={urlPaths.ALLERGEN_ANALYSIS_PATH} render={showAllergenAnalysis} />
                <Route path={urlPaths.MY_PROFILE_PATH} render={showMyProfile} />
            </Switch>
        </div>
    );
}

export default Main;