import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui-labs/pagination/pagination.js';

import { css, html } from 'lit-element/lit-element.js';
import { heading2Styles, labelStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { sharedManageStyles, sharedTableStyles } from '../../style/shared-styles.js';
import { DependencyRequester } from '../../mixins/dependency-requester-mixin.js';
import { inputStyles } from '@brightspace-ui/core/components/inputs/input-styles.js';
import { PageViewElement } from '../../components/page-view-element.js';
import { tableStyles } from '@brightspace-ui/core/components/table/table-wrapper.js';

class D2LCaptureVisits extends DependencyRequester(PageViewElement) {

	static get properties() {
		return {
			_visitLogs: { type: Array }
		};
	}
	static get styles() {
		return [inputStyles, heading2Styles, labelStyles, sharedManageStyles, sharedTableStyles, tableStyles, css`
			.d2l-capture-central-manage-header {
				border-bottom: none;
			}
		`];
	}

	constructor() {
		super();
		this._visitLogs = [{
			type: 'Recording',
			title: 'Recording 1',
			ip: '10.67.5.162',
			dateTime: '8/28/2020 1:15:22 PM',
			user: 'Bridget Chabot (Valence_CCQA_172)',
			duration: '00:11:38',
		}, {
			type: 'Recording',
			title: 'Recording 1',
			ip: '10.67.5.162',
			dateTime: '8/28/2020 1:15:22 PM',
			user: 'Bridget Chabot (Valence_CCQA_172)',
			duration: '00:11:38',
		}, {
			type: 'Recording',
			title: 'Recording 1',
			ip: '10.67.5.162',
			dateTime: '8/28/2020 1:15:22 PM',
			user: 'Bridget Chabot (Valence_CCQA_172)',
			duration: '00:11:38',
		}, {
			type: 'Recording',
			title: 'Recording 1',
			ip: '10.67.5.162',
			dateTime: '8/28/2020 1:15:22 PM',
			user: 'Bridget Chabot (Valence_CCQA_172)',
			duration: '00:11:38',
		}, {
			type: 'Recording',
			title: 'Recording 1',
			ip: '10.67.5.162',
			dateTime: '8/28/2020 1:15:22 PM',
			user: 'Bridget Chabot (Valence_CCQA_172)',
			duration: '00:11:38',
		}, {
			type: 'Recording',
			title: 'Recording 1',
			ip: '10.67.5.162',
			dateTime: '8/28/2020 1:15:22 PM',
			user: 'Bridget Chabot (Valence_CCQA_172)',
			duration: '00:11:38',
		}];
	}

	_renderAuditLogsReporting() {
		return this._visitLogs.map(row => html`
			<tr>
				<td>${row.type}</td>
				<td>${row.title}</td>
				<td>${row.ip}</td>
				<td>${row.dateTime}</td>
				<td>${row.user}</td>
				<td>${row.duration}</td>
			</tr>
		`);
	}

	render() {
		return html`
			<div class="d2l-capture-central-manage-container">
				<div class="d2l-capture-central-manage-header">
					<h2 class="d2l-heading-2">${this.localize('visits')}</h2>
				</div>
				<d2l-table-wrapper sticky-headers>
					<p class="d2l-capture-central-table-caption" id="d2l-capture-central-table-caption">
						${this.localize('visits')}
					</p>
					<table class="d2l-table" aria-describedby="d2l-capture-central-table-caption">
						<thead>
							<tr>
								<th></th>
								<th>
									<div class="d2l-capture-central-th-container">
										${this.localize('title')}
									</div>
								</th>
								<th>
									<div class="d2l-capture-central-th-container">
										${this.localize('ip')}
									</div>
								</th>
								<th>
									<div class="d2l-capture-central-th-container">
										${this.localize('dateTime')}
									</div>
								</th>
								<th>
									<div class="d2l-capture-central-th-container">
										${this.localize('user')}
									</div>
								</th>
								<th>
									<div class="d2l-capture-central-th-container">
										${this.localize('duration')}
									</div>
								</th>
							</tr>
						</thead>
						<tbody>
							${this._renderAuditLogsReporting()}
						</tbody>
					</table>
				</d2l-table-wrapper>
				<d2l-labs-pagination page-number="1" max-page-number="5"></d2l-labs-pagination>
			</div>
		`;
	}
}

window.customElements.define('d2l-capture-central-visits', D2LCaptureVisits);
