import React from 'react';
import filter from 'lodash/filter';
import { Img } from './Img';
import Checkbox from 'antd/lib/checkbox'

export function Eligible(props) {
    const { contest, state } = props;

    let selected = state.post.selected;

    const groupNodes = [];
    for (let type of [ 'TV', 'OVA', 'Movie' ]) {
        const entryNodes = [];

        let cat = filter(contest.series, { type });
        cat.sort((a, b) => b.rating - a.rating);

        for (let entry of cat) {

            if (selected.hide) {
                if ( ! selected.list.includes(entry.id)) {
                    continue;
                }
            }

            function toggleEntry() {
                if (selected.list.includes(entry.id)) {
                    selected.list = filter(selected.list, item => item != entry.id);
                    state.updatePost(state.post);
                }
                else { // not selected
                    selected.list.push(entry.id);
                    state.updatePost(state.post);
                }
            }

            let entryStyle = { 
                display: 'flex', 
                marginBottom: 5, 
                cursor: 'pointer', 
                padding: '2px 0',
                background: selected.list.includes(entry.id) && ! selected.hide ? '#eee' : '#fff'
            };

            entryNodes.push (
                <div key={entry.id} onClick={toggleEntry} style={entryStyle}>
                    <div style={{ width: 50 }}><Img id={entry.id} height={50}/></div> 
                    <div>{entry.title}</div>
                </div>
            )
        }

        groupNodes.push (
            <div key={type}>
                <h2>{type}</h2>
                {entryNodes}
            </div>
        )
    }

    function updateChange(event) {
        let value = event.target.checked;
        selected.hide = value;
        state.updatePost(state.post);
    }

    return (
        <>
            <p><small>You can select entries you've watched to make it easier to remember. Then hide all unselected ones.</small></p>
            <p>
                <Checkbox value={selected.value} onChange={updateChange}>
                    Only Show Selected
                </Checkbox>
            </p>
            {groupNodes}
        </>
    );
}