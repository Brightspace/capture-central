import '@brightspace-ui/core/components/breadcrumbs/breadcrumb.js';
import '@brightspace-ui/core/components/breadcrumbs/breadcrumb-current-page.js';
import '@brightspace-ui/core/components/breadcrumbs/breadcrumbs.js';
import '@brightspace-ui/core/components/button/button.js';
import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/inputs/input-checkbox.js';
import '@brightspace-ui/core/components/inputs/input-search.js';
import '@brightspace-ui-labs/pagination/pagination.js';

import { css, html } from 'lit-element/lit-element.js';
import { sharedManageStyles, sharedTableStyles } from '../../style/shared-styles.js';
import { DependencyRequester } from '../../mixins/dependency-requester-mixin.js';
import { heading2Styles } from '@brightspace-ui/core/components/typography/styles.js';
import { PageViewElement } from '../../components/page-view-element.js';
import { tableStyles } from '@brightspace-ui/core/components/table/table-wrapper.js';

class D2lCaptureFolders extends DependencyRequester(PageViewElement) {

	static get properties() {
		return {
			_numSelectedFolders: { type: Number },
			_folders: { type: Array }
		};
	}
	static get styles() {
		return [ tableStyles, heading2Styles, sharedManageStyles, sharedTableStyles, css`
		`];
	}

	constructor() {
		super();
		this._numSelectedFolders = 0;
		this._folders = [{
			id: 1,
			name: 'Folder 1',
		}, {
			id: 2,
			name: 'Folder 2',
		}, {
			id: 3,
			name: 'Folder 3',
		}, {
			id: 4,
			name: 'Folder 4',
		}, {
			id: 5,
			name: 'Folder 5',
		}, {
			id: 6,
			name: 'Folder 6',
		}];
	}

	_addAllToSelection(e) {
		const checkboxes = this.shadowRoot.querySelectorAll('tbody d2l-input-checkbox');
		let numAddedToSelection = 0;
		checkboxes.forEach(checkbox => {
			if (checkbox.checked !== e.target.checked) {
				numAddedToSelection += 1;
			}
			checkbox.checked = e.target.checked;
		});
		this._numSelectedFolders += numAddedToSelection * (e.target.checked ? 1 : -1);
	}

	_addToSelection(e) {
		this._numSelectedFolders += e.target.checked ? 1 : -1;
	}

	_renderFolders() {
		return this._folders.map(row => html`
			<tr>
				<td><d2l-input-checkbox aria-label=${this.localize('selectOption', { option: row.name })} @change=${this._addToSelection}></d2l-input-checkbox></td>
				<td><d2l-link @click=${this._goTo('/folders/edit', { id: row.id })}>${row.name}</d2l-link></td>
			</tr>
		`);
	}

	render() {
		return html`
			<div class="d2l-capture-central-manage-container">
				<d2l-breadcrumbs>
					<d2l-breadcrumb href="#" text="${this.localize('captureCentral')}"></d2l-breadcrumb>
					<d2l-breadcrumb-current-page text="${this.localize('folders')}"></d2l-breadcrumb-current-page>
				</d2l-breadcrumbs>
				<div class="d2l-capture-central-manage-header">
					<h2 class="d2l-heading-2">${this.localize('manageFolders')}</h2>
					<d2l-button primary>
						${this.localize('newFolder')}
					</d2l-button>
				</div>
				<div class="d2l-capture-central-manage-num-selected">
					${this.localize('numFoldersSelected', { count: this._numSelectedFolders })}
				</div>
				<div class="d2l-capture-central-manage-options">
					<d2l-button>${this.localize('delete')}</d2l-button>
					<d2l-button>${this.localize('moveContents')}</d2l-button>
					<d2l-button>${this.localize('copyContents')}</d2l-button>
					<d2l-button>${this.localize('settings')}</d2l-button>
					<d2l-input-search
						label="${this.localize('searchFolders')}"
						placeholder="${this.localize('searchFolders')}"
					></d2l-input-search>
				</div>
				<d2l-table-wrapper sticky-headers>
					<p class="d2l-capture-central-table-caption" id="d2l-capture-central-table-caption">
						${this.localize('manageFolders')}
					</p>
					<table class="d2l-table" aria-describedby="d2l-capture-central-table-caption">
						<thead>
							<tr>
								<th class="d2l-capture-central-th-checkbox-container">
									<d2l-input-checkbox aria-label=${this.localize('selectAllFolders')} @change=${this._addAllToSelection}></d2l-input-checkbox>
								</th>
								<th>
									<div class="d2l-capture-central-th-container">
										${this.localize('name')}
									</div>
								</th>
							</tr>
						</thead>
						<tbody>
							${this._renderFolders()}
						</tbody>
					</table>
				</d2l-table-wrapper>
				<d2l-labs-pagination page-number="1" max-page-number="5"></d2l-labs-pagination>
			</div>
		`;
	}
}

window.customElements.define('d2l-capture-central-folders', D2lCaptureFolders);
