import ReactDOM from 'react-dom';
import React from 'react';
import { ChoiceAwards } from './ChoiceAwards';
const el = el => document.querySelector(el);

(async () => {

    const contestRes = await fetch('contest.json');
    const contest = await contestRes.json();

    // console.log('contest', contest);
    
    ReactDOM.render (
        <ChoiceAwards contest={contest}/>, 
        el('#root')
    );
})();