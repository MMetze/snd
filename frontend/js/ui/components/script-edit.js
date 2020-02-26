import m from 'mithril';

import Input from './input';
import TextArea from './textarea';
import Editor from './editor';

import map from 'lodash-es/map';
import binder from '../binder';
import api from '../../core/api';

export default () => {
	let state = {
		target: null,
		selected_tab: 'Information'
	};

	let breadcrumbs = [
		{
			name: 'Scripts',
			link: '/scripts'
		},
		{
			name: 'New'
		}
	];

	let tabs = {
		Information: () => {
			return (
				<div className="ph3 pv2 flex justify-between">
					<Input label="Name" value={state.target.name} oninput={binder.inputString(state.target, 'name')} />
					<div className="w2" />
					<TextArea label="Description" value={state.target.description} oninput={binder.inputString(state.target, 'description')} />
				</div>
			);
		},
		Code: () => {
			return (
				<Editor
					className="h-100 flex-grow-1 overflow-auto"
					content={state.target.source}
					language="go"
					onchange={code => (state.target.source = code)}
					error_provider={s => {
						return new Promise((resolve, reject) => {
							api.verifyScript(s).then(err => {
								if (!err) {
									resolve([]);
								}
								resolve(err);
							});
						});
					}}
				/>
			);
		}
	};

	let body = () => {
		return tabs[state.selected_tab]();
	};

	return {
		oninit(vnode) {
			state.target = vnode.attrs.target;
		},
		view(vnode) {
			return (
				<div className="w-100 h-100 overflow-auto flex flex-column">
					<div className="flex-shrink-0">
						<ul className="tab tab-block tab-m0">
							{map(tabs, (v, k) => {
								return (
									<li className={`tab-item ${k === state.selected_tab ? 'active' : ''} pointer`}>
										<a onclick={() => (state.selected_tab = k)}>{k}</a>
									</li>
								);
							})}
						</ul>
					</div>
					{body()}
				</div>
			);
		}
	};
};
