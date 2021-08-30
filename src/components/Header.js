import React from 'react';
import { Button } from 'antd';
import { withRouter } from 'react-router';

import pawcareLogo from '../assets/images/pawcare_logo.png';
import * as urlPaths from '../constants/paths';

function Header(props) {
    const { signedIn, history, signedOutSuccess } = props;
    return (
        <header className='navbar'>
            <img className='navbar-logo' src={pawcareLogo} alt='PawCare Logo' />
            {
                signedIn && 
                <>
                    <Button className='navbar-nav' type="text" onClick={()=> history.push(urlPaths.FOOD_TRACKER_PATH)}>Food Tracker</Button>
                    <Button className='navbar-nav' type="text" onClick={()=> history.push(urlPaths.REACTION_TRACKER_PATH)}>Reaction Tracker</Button>
                    <Button className='navbar-nav' type="text" onClick={()=> history.push(urlPaths.ALLERGEN_ANALYSIS_PATH)}>Allergen Analysis</Button>
                    <Button className='navbar-nav' type="text" onClick={()=> history.push(urlPaths.MY_PROFILE_PATH)}>My Profile</Button>
                    <Button className='navbar-nav' type="text" onClick={signedOutSuccess}>Log Out</Button>
                </>
            }
        </header>
    );
}

export default withRouter(Header);