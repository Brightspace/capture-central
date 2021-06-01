import '@brightspace-ui/core/components/breadcrumbs/breadcrumb.js';
import '@brightspace-ui/core/components/breadcrumbs/breadcrumb-current-page.js';
import '@brightspace-ui/core/components/breadcrumbs/breadcrumbs.js';
import '@brightspace-ui/core/components/button/button-icon.js';
import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui-labs/pagination/pagination.js';

import { css, html } from 'lit-element/lit-element.js';
import { heading2Styles, labelStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { sharedManageStyles, sharedTableStyles } from '../../style/shared-styles.js';
import { DependencyRequester } from '../../mixins/dependency-requester-mixin.js';
import { inputStyles } from '@brightspace-ui/core/components/inputs/input-styles.js';
import { PageViewElement } from '../../components/page-view-element.js';
import { tableStyles } from '@brightspace-ui/core/components/table/table-wrapper.js';

class D2LCaptureLiveEventsReporting extends DependencyRequester(PageViewElement) {

	static get properties() {
		return {
			_liveEventLogs: { type: Array }
		};
	}
	static get styles() {
		return [inputStyles, heading2Styles, labelStyles, sharedManageStyles, sharedTableStyles, tableStyles, css`
			.d2l-capture-central-manage-header {
				border-bottom: none;
			}
			.d2l-capture-central-live-events-reporting-td-button {
				width: 50px;
			}
		`];
	}

	constructor() {
		super();
		this._liveEventLogs = [{
			id: 1,
			name: 'Recording: Basic Accounting - 8/1/2020',
			time: 'Thursday, August 1, 2020, 7:57PM',
		}, {
			id: 2,
			name: 'Recording: Basic Accounting - 8/2/2020',
			time: 'Thursday, August 2, 2020, 7:57PM',
		}, {
			id: 3,
			name: 'Recording: Basic Accounting - 8/3/2020',
			time: 'Thursday, August 2, 2020, 7:57PM',
		}, {
			id: 4,
			name: 'Recording: Basic Accounting - 8/4/2020',
			time: 'Thursday, August 2, 2020, 7:57PM',
		}, {
			id: 5,
			name: 'Recording: Basic Accounting - 8/5/2020',
			time: 'Thursday, August 2, 2020, 7:57PM',
		}, {
			id: 6,
			name: 'Recording: Basic Accounting - 8/6/2020',
			time: 'Thursday, August 2, 2020, 7:57PM',
		}];
	}

	_renderAuditLogsReporting() {
		return this._liveEventLogs.map(row => html`
			<tr>
				<td>${row.id}</td>
				<td>${row.name}</td>
				<td>${row.time}</td>
				<td class="d2l-capture-central-live-events-reporting-td-button">
					<d2l-button-icon
						text=${this.localize('exportAsCsv')}
						icon="tier1:file-document"
					></d2l-button-icon>
				</td>
			</tr>
		`);
	}

	render() {
		return html`
			<div class="d2l-capture-central-manage-container">
				<d2l-breadcrumbs>
					<d2l-breadcrumb-current-page text="${this.localize('liveEvents')}"></d2l-breadcrumb-current-page>
				</d2l-breadcrumbs>
				<div class="d2l-capture-central-manage-header">
					<h2 class="d2l-heading-2">${this.localize('liveEvents')}</h2>
				</div>
				<d2l-table-wrapper sticky-headers>
					<p class="d2l-capture-central-table-caption" id="d2l-capture-central-table-caption">
						${this.localize('liveEvents')}
					</p>
					<table class="d2l-table" aria-describedby="d2l-capture-central-table-caption">
						<thead>
							<tr>
								<th>
									<div class="d2l-capture-central-th-container">
										${this.localize('id')}
									</div>
								</th>
								<th>
									<div class="d2l-capture-central-th-container">
										${this.localize('name')}
									</div>
								</th>
								<th>
									<div class="d2l-capture-central-th-container">
										${this.localize('dateTime')}
									</div>
								</th>
								<th>
									<div class="d2l-capture-central-th-container">
										${this.localize('chatLog')}
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

window.customElements.define('d2l-capture-central-live-events-reporting', D2LCaptureLiveEventsReporting);
