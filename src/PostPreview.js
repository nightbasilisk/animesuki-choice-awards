import React from 'react';
import filter from 'lodash/filter'
import copy from 'copy-to-clipboard';
import Button from 'antd/lib/button';
import { ClipboardIcon } from './icons/clipboard';

export function PostPreview(props) {
    let { contest, state } = props;

    let preview = '';
    for (let cat of contest.categories) {
        let picks = filter(state.post.picks[cat.code], entry => {
            return entry.value != null && entry.value.preview != null;
        });

        picks.sort((a, b) => a.idx - b.idx);

        if (picks.length > 0) {
            preview += `-{${cat.code}}- [[b]${cat.name}[/b]]\n`;
            preview += `[list=1]\n`;
            let first = true;
            for (let pick of picks) {
                if (first) {
                    preview += `  [*] [color=blue]${pick.value.preview}[/color]\n`
                }
                else {
                    preview += `  [*] ${pick.value.preview}\n`
                }
                first = false;
            }
            preview += `[/list]\n\n`;
        }
    }

    function copyToClipbloard() {
        copy(preview);
    }

    let previewStyle = {
        width: '100%',
        fontFamily: 'monospace',
        fontSize: 14
    };

    return (
        <div>
            <textarea rows={24} style={previewStyle} value={preview} onChange={() => {}}></textarea>
            <Button onClick={copyToClipbloard}><ClipboardIcon width={16} height={16}/> Copy to Clipboard</Button>
        </div>
    );
}