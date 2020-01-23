import React from 'react';
import Select from 'antd/lib/select';
import Input from 'antd/lib/input';
import InputNumber from 'antd/lib/input-number';
const InputGroup = Input.Group;
import find from 'lodash/find'
import filter from 'lodash/filter'
const { Option } = Select;

export function Picker(props) {
    const { contest, code, value, onChange } = props;
    const category = find(contest.categories, { code });

    if (category.type == 'pick') {
        const selectProps = {
            value: value != null ? value.id : null,
            showSearch: true,
            className: 'picker simple',
            style: { width: '100%', maxWidth: 700 },
            placeholder: 'Select or Search...',
            onChange: value => {
                let entry = value;
                onChange({
                    type: 'pick',
                    id: value,
                    preview: value
                });
            },
            filterOption: (input, option) => {
                let entry = option.props.value;

                if (entry == null) {
                    return true;
                }

                if (entry.toLowerCase().indexOf(input.toLowerCase()) >= 0) {
                    return true;
                }

                return false;
            }
        };

        let optionNodes = [];
        const entries = category.presetValues;

        for (let option of entries) {
            optionNodes.push (
                <Option key={option.entry} value={option.entry}>
                    <div className="preset-pick">
                        <img className="series-title-img" src={option.image == "" ? 'https://i.vgy.me/el2was.jpg' : option.image}/>&nbsp;
                        <span className="series-title">{option.entry}</span>
                    </div>
                </Option>
            );
        }
        

        return (
            <Select {...selectProps}>
                {optionNodes}
            </Select>
        );
    }
    else if (category.type == 'series') {
        const selectProps = {
            value: value != null ? value.id : null,
            showSearch: true,
            className: 'picker',
            style: { width: 500 },
            placeholder: 'Select or Search...',
            onChange: value => {
                let entry = find(contest.series, { id: parseInt(value) });
                onChange({
                    type: 'series',
                    id: entry.id,
                    preview: entry.title
                });
            },
            filterOption: (input, option) => {
                let id = option.props.value;

                if (id == null) {
                    return true;
                }

                let entry = find(contest.series, { id: parseInt(id) });
                
                for (let alias of entry.alias) {
                    if (alias.toLowerCase().indexOf(input.toLowerCase()) >= 0) {
                        return true;
                    }
                }

                return false;
            }
        };

        let optionNodes = [];
        for (let type of category.allowedTypes) {
            const entries = filter(contest.series, { type });

            for (let entry of entries) {
                optionNodes.push (
                    <Option key={entry.id} value={entry.id}>
                        <img height={50} src={`images/${entry.id}.jpg`} />&nbsp;
                        <span className="series-title">{entry.title}</span>
                    </Option>
                );
            }
        }

        return (
            <Select {...selectProps}>
                {optionNodes}
            </Select>
        );
    }
    else if (category.type == 'character') {
        let choice;
        if (value == null) {
            choice = {
                type: 'character',
                id: null,
                char: null,
                series: null,
                preview: null
            };
        }
        else {
            choice = value;
        }

        const selectProps = {
            value: value != null ? value.id : null,
            showSearch: true,
            className: 'picker',
            style: { width: 500 },
            placeholder: 'Select or Search...',
            onChange: value => {
                let entry = find(contest.series, { id: parseInt(value) });
                choice.id = entry.id;
                choice.series = entry.title.replace('/', ' ');

                if (choice.char != null) {
                    choice.preview = `${choice.char} / ${choice.series}`
                }

                onChange(choice);
            },
            filterOption: (input, option) => {
                let id = option.props.value;

                if (id == null) {
                    return true;
                }

                let entry = find(contest.series, { id: parseInt(id) });
                
                for (let alias of entry.alias) {
                    if (alias.toLowerCase().indexOf(input.toLowerCase()) >= 0) {
                        return true;
                    }
                }

                return false;
            }
        };

        let optionNodes = [];
        for (let type of category.allowedTypes) {
            const entries = filter(contest.series, { type });

            for (let entry of entries) {
                optionNodes.push (
                    <Option key={entry.id} value={entry.id}>
                        <img height={50} src={`images/${entry.id}.jpg`} />&nbsp;
                        <span className="series-title">{entry.title}</span>
                    </Option>
                );
            }
        }

        function updateCharName(event) {
            choice.char = event.target.value;
            if (choice.series != null) {
                choice.preview = `${choice.char} / ${choice.series}`;
            }

            onChange(choice);
        }

        return (
            <div style={{ width: 500 }}>
                <Select {...selectProps}>
                    {optionNodes}
                </Select>
                <Input onChange={updateCharName} value={choice.char} addonBefore="Character Name" style={{ width: 500, marginTop: 3 }} />
            </div>
        );
    }
    else if (category.type == 'credits-song') {
        let choice;
        if (value == null) {
            choice = {
                type: 'credits-song',
                id: null,
                series: null,
                credits: null,
                creditsNr: null,
                preview: null
            };
        }
        else {
            choice = value;
        }

        const selectProps = {
            value: value != null ? value.id : null,
            showSearch: true,
            className: 'picker',
            style: { width: 500 },
            placeholder: 'Select or Search...',
            onChange: value => {
                let entry = find(contest.series, { id: parseInt(value) });
                choice.id = entry.id;
                choice.series = entry.title.replace('/', ' ');

                if (choice.credits != null && choice.creditsNr != null) {
                    choice.preview = `${choice.series} ${choice.credits}${choice.creditsNr}`
                }

                onChange(choice);
            },
            filterOption: (input, option) => {
                let id = option.props.value;

                if (id == null) {
                    return true;
                }

                let entry = find(contest.series, { id: parseInt(id) });
                
                for (let alias of entry.alias) {
                    if (alias.toLowerCase().indexOf(input.toLowerCase()) >= 0) {
                        return true;
                    }
                }

                return false;
            }
        };

        let optionNodes = [];
        for (let type of category.allowedTypes) {
            const entries = filter(contest.series, { type });

            for (let entry of entries) {
                optionNodes.push (
                    <Option key={entry.id} value={entry.id}>
                        <img height={50} src={`images/${entry.id}.jpg`} />&nbsp;
                        <span className="series-title">{entry.title}</span>
                    </Option>
                );
            }
        }

        function updateCreditsNr(value) {
            choice.creditsNr = value;
            if (choice.series != null && choice.credits != null) {
                choice.preview = `${choice.series} ${choice.credits}${choice.creditsNr}`;
            }

            onChange(choice);
        }

        function updateCredits(value) {
            choice.credits = value;
            if (choice.series != null && choice.creditsNr != null) {
                choice.preview = `${choice.series} ${choice.credits}${choice.creditsNr}`;
            }

            onChange(choice);
        }

        return (
            <div style={{ width: 500 }}>
                <Select {...selectProps}>
                    {optionNodes}
                </Select>
                <InputGroup style={{ marginTop: 3 }} compact>
                    <Select value={choice.credits} onChange={updateCredits} style={{ width: 300 }}>
                        <Option value="OP">Opening Song</Option>
                        <Option value="ED">Ending Song</Option>
                    </Select>
                    <InputNumber onChange={updateCreditsNr} value={choice.creditsNr}  style={{ width: 200 }}/>
                </InputGroup>
            </div>
        );
    }
    else if (category.type == 'freeform') {
        let choice;
        if (value == null) {
            choice = {
                type: 'freeform',
                preview: null
            };
        }
        else {
            choice = value;
        }

        function updatePreview(event) {
            choice.preview = event.target.value;
            onChange(choice);
        }

        return (
            <div style={{ width: 500 }}>
                <Input onChange={updatePreview} value={choice.preview} style={{ height: 50, marginTop: 10 }}/>
            </div>
        );
    }
    else { // unknown
        console.error(`unknown category type ${category.type} for ${code}`);
    }
}