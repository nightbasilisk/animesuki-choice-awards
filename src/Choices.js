import React from 'react';
import findIndex from 'lodash/findIndex';
import filter from 'lodash/filter';
import Button from 'antd/lib/button'
import Tooltip from 'antd/lib/tooltip'
import { Picker } from './Picker';
import { UpCircleIcon } from './icons/up'
import { DownCircleIcon } from './icons/down'
import { CloseCircleIcon } from './icons/close'
const uuid = require('uuid/v4');

export function Choices(props) {
    let { contest, state } = props;
    
    let categoryNodes = [];
    for (let cat of contest.categories) {
        function addNewChoice() {
            let picks = state.post.picks[cat.code];

            // find last order
            let maxIdx = 0;
            for (let pick of picks) {
                if (pick.idx >= maxIdx) {
                    maxIdx = pick.idx;
                }
            }

            picks.push({
                id: uuid(),
                idx: maxIdx + 1,
                value: null
            });

            state.updatePost(state.post);
        }

        let picks = state.post.picks[cat.code];
        picks.sort((a, b) => a.idx - b.idx);

        let pickNodes = [];
        for (let pick of picks) {

            function updatePick(value) {
                pick.value = value;
                state.updatePost(state.post);
            }

            function movePickUp() {
                let picks = state.post.picks[cat.code];
                let i = findIndex(picks, { id: pick.id });
                if (i != 0) {
                    let savedIdx = picks[i - 1].idx;
                    picks[i - 1].idx = picks[i].idx;
                    picks[i].idx = savedIdx;
                    state.updatePost(state.post);
                }
            }

            function movePickDown() {
                let picks = state.post.picks[cat.code];
                let i = findIndex(picks, { id: pick.id });
                if (i != picks.length - 1) {
                    let savedIdx = picks[i + 1].idx;
                    picks[i + 1].idx = picks[i].idx;
                    picks[i].idx = savedIdx;
                    state.updatePost(state.post);
                }
            }

            function removePick() {
                let picks = state.post.picks[cat.code];
                picks = filter(picks, item => item.id != pick.id);
                state.post.picks[cat.code] = picks;
                state.updatePost(state.post);
            }

            pickNodes.push (
                <div key={pick.id} style={{ display: 'flex', paddingBottom: 5 }}>
                    <Picker contest={contest} code={cat.code} 
                        value={pick.value} onChange={updatePick}/>&nbsp;
                    <div style={{ fontSize: 17, padding: '0 12px' }}>
                        <span onClick={movePickUp} style={{ cursor: 'pointer' }}><Tooltip title="Move Up" placement="right"><UpCircleIcon width={16} height={16}/></Tooltip></span><br/>
                        <span onClick={movePickDown} style={{ cursor: 'pointer' }}><Tooltip title="Move Down" placement="right"><DownCircleIcon width={16} height={16}/></Tooltip></span><br/>
                        <span onClick={removePick} style={{ cursor: 'pointer' }}><Tooltip title="Remove" placement="right"><CloseCircleIcon width={16} height={16}/></Tooltip></span>
                    </div>
                </div>
            );
        }

        categoryNodes.push (
            <div key={cat.code} style={{ marginBottom: 24 }}>
                <h2><code>-{`{${cat.code}}`}- [{cat.name}]</code></h2>
                <div style={{ padding: 16 }}>
                    {pickNodes}
                    <Button onClick={addNewChoice} type={ picks.length > 0 ? 'default' : 'primary' }>
                        Add&nbsp;{ picks.length > 0 ? 'Backup' : <b>Primary</b> }&nbsp;Choice
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div>
            {categoryNodes}
        </div>
    );
}