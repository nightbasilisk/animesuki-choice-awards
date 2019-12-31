import React, { useState } from 'react';
import Button from 'antd/lib/button';
import Modal from 'antd/lib/modal';
import Table from 'antd/lib/table';
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
    const { contest, sessionId, sessions } = props;
    const seriesCache = store.namespace(`${contest.year}`);
    const picksCache = store.namespace(sessionId);

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
            picksCache('post.picks', post.picks);
        }
    };

    // console.log('post', post);

    let [ showSessionsModal, updateSessionsModal ] = useState(false);

    function loadPicks(sessionId) {
        let otherCache = store.namespace(sessionId);
        let picks = otherCache('post.picks');
        post.picks = picks;
        state.updatePost(post);
    }

    const columns =[{
        key: 'time',
        title: 'Session Time',
        dataIndex: 'time',
        render: t => new Date(t).toString().replace(/\(.*\)/, '')
    }, {
        key: 'actions',
        dataIndex: 'sessionId',
        render: sessionId => {
            return (
                <Button size="small" onClick={() => loadPicks(sessionId)}>Load Picks</Button>
            );
        }
    }];

    let sessionsModal = (
        <Modal
          title="Previous Sessions"
          visible={showSessionsModal}
          onOk={() => updateSessionsModal(false)}
          onCancel={() => updateSessionsModal(false)}
        >
            <p>A new session is created every time you open this page. They are saved localy (not on a server), so they're not there if you changed browsers, computers or user profiles. Some sessions may be empty. Only sessions for the current contest phase are displayed.</p>
            <Table rowKey={row => row.sessionId} columns={columns} dataSource={sessions}/>
        </Modal>
    );

    return (
        <div className="awards">

            {sessionsModal}

            { contest.phase == 'main' ? 
                <div className="eligible">
                    <h2>Eligible Entries</h2>
                    <Eligible contest={contest} state={state}/>
                </div>
                : null }

            <div className="choices">
                <div style={{ float: 'right' }}>
                    <Button onClick={() => updateSessionsModal(true)} disabled={sessions.length == 0}>Load Previous Session</Button>
                </div>
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