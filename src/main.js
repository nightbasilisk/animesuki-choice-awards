import ReactDOM from 'react-dom';
import React from 'react';
import { ChoiceAwards } from './ChoiceAwards';
import filter from 'lodash/filter';
const uuid = require('uuid/v4');
const el = el => document.querySelector(el);
const store = require('store2');

(async () => {

    const contestRes = await fetch('contest.json');
    const contest = await contestRes.json();

    // console.log('contest', contest);

    let sessionId = uuid();
    const sessionsCache = store.namespace(`sessions-${contest.year}-${contest.phase}`);

    let sessions = sessionsCache('list') || [];
    
    function picksLength(picks) {
        if (picks == null) {
            return 0;
        }
        
        let count = 0;
        for (let cat of Object.keys(picks)) {
            count += picks[cat].length;
        }

        return count;
    }

    let relevantSessions = [];
    for (let session of sessions) {
        const picksCache = store.namespace(session.sessionId);
        let picks = picksCache('post.picks');
        if (picksLength(picks) > 0) {
            relevantSessions.push(session)
        }
    }

    relevantSessions.push({
        time: Date.now(),
        sessionId
    });

    relevantSessions.sort((a, b) => b.time - a.time);

    sessionsCache('list', relevantSessions);

    sessions = filter(relevantSessions, entry => entry.sessionId != sessionId);
    
    ReactDOM.render (
        <ChoiceAwards contest={contest} sessionId={sessionId} sessions={sessions}/>, 
        el('#root')
    );
})();