import React, { useState } from 'react';
import { Eligible } from './Eligible';
import { Choices } from './Choices';
import { PostPreview } from './PostPreview'
const store = require('store2');

function emptyCatState(contest) {
    let res = {};

    for (let cat of contest.categories) {
        res[cat.code] = [];
    }

    return res;
}

export function ChoiceAwards(props) {
    const { contest } = props;
    const seriesCache = store.namespace(`${contest.year}`);

    let [ post, update ] = useState({ 
        picks: emptyCatState(contest),
        selected: {
            list: seriesCache('selected.list') || [],
            hide: false
        }
    });

    let [ refreshId, refresh ] = useState(0);

    let state = { 
        post, 
        updatePost: post => {
            update(post);
            refresh(refreshId + 1);
            seriesCache('selected.list', post.selected.list);
        }
    };

    // console.log('post', post);

    return (
        <div className="awards">

            { contest.phase == 'main' ? 
                <div className="eligible">
                    <h2>Eligible Entries</h2>
                    <Eligible contest={contest} state={state}/>
                </div>
                : null }

            <div className="choices">
                <h1>Choice Awards</h1>
                <p><a href="https://www.youtube.com/watch?v=3Y3jE3B8HsE" target="_blank">Instant-Runoff Voting rules</a> apply. Your first choice applies so long as it's not the least popular, in which case your next choice is applied, et cetera. Repeats until 50%+1 concensus is achieved or nobody has any backup options left.</p>
                <Choices contest={contest} state={state}/>
            </div>

            <div className="preview">
                <h2>Post Preview</h2>
                <PostPreview contest={contest} state={state}/>
            </div>
        
        </div>
    )
}