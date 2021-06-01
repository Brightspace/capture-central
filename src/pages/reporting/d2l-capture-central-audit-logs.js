import '@brightspace-ui/core/components/breadcrumbs/breadcrumb.js';
import '@brightspace-ui/core/components/breadcrumbs/breadcrumb-current-page.js';
import '@brightspace-ui/core/components/breadcrumbs/breadcrumbs.js';
import '@brightspace-ui/core/components/button/button.js';
import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/dropdown/dropdown-button.js';
import '@brightspace-ui/core/components/dropdown/dropdown-menu.js';
import '@brightspace-ui/core/components/inputs/input-search.js';
import '@brightspace-ui-labs/pagination/pagination.js';

import { css, html } from 'lit-element/lit-element.js';
import { heading2Styles, labelStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { sharedManageStyles, sharedTableStyles } from '../../style/shared-styles.js';
import { DependencyRequester } from '../../mixins/dependency-requester-mixin.js';
import { inputStyles } from '@brightspace-ui/core/components/inputs/input-styles.js';
import { PageViewElement } from '../../components/page-view-element.js';
import { tableStyles } from '@brightspace-ui/core/components/table/table-wrapper.js';

class D2LCaptureAuditLogs extends DependencyRequester(PageViewElement) {

	static get properties() {
		return {
			_auditLogs: { type: Array }
		};
	}
	static get styles() {
		return [inputStyles, heading2Styles, labelStyles, sharedManageStyles, sharedTableStyles, tableStyles, css`
			.d2l-capture-central-manage-header {
				border-bottom: none;
			}
			.d2l-capture-central-manage-header-button-group d2l-button {
				margin-right: 20px;
			}

			label {
				margin: 20px 0;
			}

			d2l-input-text {
				width: 100%;
			}
		`];
	}

	constructor() {
		super();
		this._auditLogs = [{
			action: 'Create',
			type: 'User',
			name: 'Presentation 1',
			user: 'Admin',
			dateTime: 'August 7, 2020, 2:31 PM',
		}];
	}

	_renderAuditLogs() {
		if (!this._auditLogs.length) {
			return html`
				<tr>
					<td
						class="d2l-capture-central-table-no-results"
						colspan=5
					>${this.localize('noResults')}
					</td>
				</tr>`;
		}
		return this._auditLogs.map(row => html`
			<tr>
				<td>${row.action}</td>
				<td>${row.type}</td>
				<td>${row.name}</td>
				<td>${row.user}</td>
				<td>${row.dateTime}</td>
			</tr>
		`);
	}

	render() {
		return html`
			<div class="d2l-capture-central-manage-container">
				<d2l-breadcrumbs>
					<d2l-breadcrumb-current-page text="${this.localize('auditLogs')}"></d2l-breadcrumb-current-page>
				</d2l-breadcrumbs>
				<div class="d2l-capture-central-manage-header">
					<h2 class="d2l-heading-2">${this.localize('auditLogs')}</h2>
					<div class="d2l-capture-central-manage-header-button-group">
						<d2l-button>
							${this.localize('showAdvancedSearch')}
						</d2l-button>
						<d2l-dropdown-button class="d2l-capture-central-audit-logs-export" text="${this.localize('export')}">
							<d2l-dropdown-menu>
								<d2l-menu label="${this.localize('export')}">
									<d2l-menu-item text="${this.localize('csv')}"></d2l-menu-item>
								</d2l-menu>
							</d2l-dropdown-menu>
						</d2l-dropdown-button>
					</div>
				</div>
				<label class="d2l-label-text">${this.localize('searchByName')}</label>
				<d2l-input-search
					label="${this.localize('searchByName')}"
					placeholder="${this.localize('enterAnItemName')}"
				></d2l-input-search>
				<d2l-table-wrapper sticky-headers>
					<p class="d2l-capture-central-table-caption" id="d2l-capture-central-table-caption">
						${this.localize('livePresentations')}
					</p>
					<table class="d2l-table" aria-describedby="d2l-capture-central-table-caption">
						<thead>
							<tr>
								<th>
									<div class="d2l-capture-central-th-container">
										${this.localize('action')}
									</div>
								</th>
								<th>
									<div class="d2l-capture-central-th-container">
										${this.localize('type')}
									</div>
								</th>
								<th>
									<div class="d2l-capture-central-th-container">
										${this.localize('name')}
									</div>
								</th>
								<th>
									<div class="d2l-capture-central-th-container">
										${this.localize('user')}
									</div>
								</th>
								<th>
									<div class="d2l-capture-central-th-container">
										${this.localize('dateTime')}
									</div>
								</th>
							</tr>
						</thead>
						<tbody>
							${this._renderAuditLogs()}
						</tbody>
					</table>
				</d2l-table-wrapper>
				<d2l-labs-pagination page-number="1" max-page-number="5"></d2l-labs-pagination>
			</div>
		`;
	}
}

window.customElements.define('d2l-capture-central-audit-logs', D2LCaptureAuditLogs);
