import '@brightspace-ui/core/components/button/button.js';
import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/dialog/dialog.js';
import '@brightspace-ui/core/components/inputs/input-search.js';
import '@brightspace-ui/core/components/list/list-item.js';
import '@brightspace-ui/core/components/list/list.js';

import { bodyCompactStyles, heading3Styles } from '@brightspace-ui/core/components/typography/styles.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { asyncStates } from '@brightspace-ui/core/mixins/async-container/async-container-mixin.js';
import { contentSearchMixin } from '../mixins/content-search-mixin';
import { DependencyRequester } from '../mixins/dependency-requester-mixin.js';
import { InternalLocalizeMixin } from '../mixins/internal-localize-mixin.js';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin.js';
import { sharedManageStyles } from '../style/shared-styles.js';

class D2lCaptureAddVideosDialog extends contentSearchMixin(DependencyRequester(InternalLocalizeMixin(RtlMixin(LitElement)))) {
	static get properties() {
		return {
			_numSelectedVideos: { type: Number },
			_selectedVideos: { type: Array },
		};
	}
	static get styles() {
		return [ bodyCompactStyles, heading3Styles, sharedManageStyles, css`
			.d2l-capture-central-video-list {
				height: 460px;
				overflow-y: scroll;
			}
			.d2l-capture-central-manage-options {
				align-items: center;
			}
			.d2l-capture-central-manage-options .d2l-capture-central-manage-num-selected {
				margin: 10px 0;
			}

			.d2l-capture-central-video-no-results {
				align-items: center;
				display: flex;
				height: 460px;
				justify-content: center;
			}
			.d2l-capture-central-load-more-button[hidden] {
				display: none;
			}

			.d2l-capture-central-load-more-button {
				display: flex;
				margin: 10px 0;
				margin-left: auto;
				margin-right: auto;
				width: 250px;
			}

			.d2l-capture-central-video-thumbnail {
				height: 120px;
				object-fit: cover;
				width: 200px;
			}
			.d2l-capture-central-video-list-item [slot=illustration] {
				position: relative;
			}
			.d2l-capture-central-video-list-content .d2l-heading-3 {
				margin-top: 0;
				margin-bottom: 0;
			}
			.d2l-capture-central-video-thumbnail-duration-overlay {
				background: rgba(0, 0, 0, 0.5); /* Black see-through */
				border-radius: 2px;
				bottom: 0;
				color: white;
				display: flex;
				display: inline-flex;
				height: 26px;
				margin: 4px;
				padding: 3px 4px;
				position: absolute;
				right: 0;
				letter-spacing: 0.5px;
				font-size: 16px;
			}
		`];
	}

	constructor() {
		super();
		this._numSelectedVideos = 0;
		this._selectedVideos = [];
	}

	async open() {
		this._moreResultsAvailable = false;
		this._query = '';
		this._start = 0;
		this._videos = [];
		this.shadowRoot.querySelector('d2l-dialog').open();
		this.apiClient = this.requestDependency('content-service-client');
		await this._handleVideoSearch();

		this.shadowRoot.querySelector('d2l-dialog').asyncState = asyncStates.complete;
	}

	async _addCourseVideos(event) {
		console.log(event);
	}

	_addToSelection({ detail: { selected, key } }) {
		this._numSelectedVideos += selected ? 1 : -1;
		if (selected) {
			this._selectedVideos.push(key);
		} else {
			this._selectedVideos = this._selectedVideos.filter(e => e !== key);
		}
		return;
	}

	_renderVideos() {
		if (this._videos.length === 0) {
			return html`
				<div class="d2l-capture-central-video-no-results">
					${this.localize('noResults')}
				</div>
			`;
		}
		const videos = this._videos.map(({ thumbnail, title, uploadDate, duration, views }) => {
			return html`
				<d2l-list-item class="d2l-capture-central-video-list-item" selectable label="${title}" key="${views}">
					<div slot="illustration">
						<img alt="" class="d2l-capture-central-video-thumbnail" src="${thumbnail}" slot="illustration"></img>
						<div class="d2l-capture-central-video-thumbnail-duration-overlay">
							${duration}
						</div>
					</div>
					<d2l-list-item-content class="d2l-capture-central-video-list-content">
						<h3 class="d2l-heading-3">${title}</h3>
						<div class="d2l-body-compact">${uploadDate} - ${this.localize('numViews', { count: views })}</div>
					</d2l-list-item-content>
				</d2l-list-item>
			`;
		});

		return html`
			<d2l-list
				@d2l-list-selection-change=${this._addToSelection}
				class="d2l-capture-central-video-list"
				separators="between"
			>
				${videos}
				<d2l-button
					?hidden="${!this._moreResultsAvailable}"
					@click=${this._handleLoadMoreVideos}
					class="d2l-capture-central-load-more-button"
				>${this.localize('loadMore')}
				</d2l-button>
			</d2l-list>
		`;
	}

	render() {
		return html`
			<d2l-dialog async title-text="${this.localize('addToCourseVideos')}" width="900">
				<div class="d2l-capture-central-manage-options">
					<div class="d2l-capture-central-manage-num-selected">
						${this.localize('numPresentationsSelected', { count: this._numSelectedVideos })}
					</div>
					<d2l-input-search
						@d2l-input-search-searched=${this._handleInputVideoSearch}
						label="${this.localize('searchCourseVideos')}"
						placeholder="${this.localize('searchCourseVideos')}"
					></d2l-input-search>
				</div>
				${this._renderVideos()}
				<d2l-button
					?disabled="${this._numSelectedVideos === 0}"
					slot="footer"
					@click=${this._addCourseVideos}
					primary data-dialog-action="${this._selectedVideos}"
				>${this.localize('add')}
				</d2l-button>
				<d2l-button slot="footer" data-dialog-action>${this.localize('cancel')}</d2l-button>
			</d2l-dialog>
		`;
	}
}

window.customElements.define('d2l-capture-central-add-videos-dialog', D2lCaptureAddVideosDialog);
