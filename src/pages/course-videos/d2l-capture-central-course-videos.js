import '@brightspace-ui/core/components/button/button-icon.js';
import '@brightspace-ui/core/components/button/button.js';
import '@brightspace-ui/core/components/card/card.js';
import '@brightspace-ui/core/components/dialog/dialog.js';
import '@brightspace-ui/core/components/dropdown/dropdown-button.js';
import '@brightspace-ui/core/components/dropdown/dropdown-menu.js';
import '@brightspace-ui/core/components/icons/icon.js';
import '@brightspace-ui/core/components/inputs/input-search.js';
import '@brightspace-ui/core/components/menu/menu-item.js';
import '@brightspace-ui/core/components/menu/menu.js';

import { css, html } from 'lit-element/lit-element.js';
import { DependencyRequester } from '../../mixins/dependency-requester-mixin.js';
import { formatDate } from '@brightspace-ui/intl/lib/dateTime.js';
import { PageViewElement } from '../../components/page-view-element';

class D2LCaptureCentralCourseVideos extends DependencyRequester(PageViewElement) {

	static get properties() {
		return {
			_videos: { type: Array }
		};
	}

	static get styles() {
		return css`

			:host([hidden]) {
				display: none;
			}

			.d2l-capture-central-course-videos {
				display: grid;
				grid-row-gap: 50px;
				grid-column-gap: 25px;
				grid-template-columns: repeat(3, 1fr);
				justify-content: center;
			}

			.d2l-capture-central-course-videos-header {
				align-self: center;
				grid-column: 1 / 2;
			}
			.d2l-capture-central-filter-folders {
				align-self: center;
				grid-column: 3 / 4;
				justify-self: end;
			}
			.d2l-capture-central-search-videos {
				align-self: center;
				grid-column: 4 / 5;
				justify-self: end;
				width: 300px;
			}

			.d2l-capture-central-video {
				display: flex;
				flex-direction: column;
				height: 300px;
				margin: auto;
				width: 300px;
			}
			.d2l-capture-central-thumbnail {
				height: 180px;
				object-fit: cover;
				width: 300px;
			}

			.d2l-capture-central-play-icon-overlay {
				background: rgb(0, 0, 0);
				background: rgba(0, 0, 0, 0.5); /* Black see-through */
				border-top-left-radius: 5px;
				border-top-right-radius: 5px;
				border: 1px transparent;
				display: flex;
				height: 180px;
				opacity: 0;
				padding: 0;
				position: absolute;
				top: 0;
				transition: .5s ease;
				width: 100%;
			}
			d2l-card:hover .d2l-capture-central-play-icon-overlay {
				opacity: 1;
			}
			.d2l-capture-central-play-icon {
				align-self: center;
				color: white;
				height: 40px;
				margin-left: auto;
				margin-right: auto;
				width: 40px;
			}

			.d2l-capture-central-video-info {
				margin-top: -25px;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				overflow: hidden;
				text-overflow: ellipsis;
			}

			.d2l-capture-central-upload-date, .d2l-capture-central-views {
				display: inline-block;
			}
			.d2l-capture-central-card-footer {
				margin-top: -25px;
				border-top: 1px solid var(--d2l-color-mica);
				display: flex;
				font-size: 14px;
				justify-content: space-between;
			}

			.d2l-capture-central-load-more-button {
				align-self: center;
				grid-column: 1 / 5;
				justify-self: center;
				margin-bottom: 20px;
			}
		`;
	}

	constructor() {
		super();
		this._videos = [];
		this.apiClient = this.requestDependency('content-service-client');
	}

	async connectedCallback() {
		super.connectedCallback();
		const { hits: { hits } } = await this.apiClient.searchContent({
			contentType: 'video',
			includeThumbnails: true
		});
		this._updateVideoList(hits);
	}

	_updateVideoList(hits) {
		function getRandomInt(min, max) {
			min = Math.ceil(min);
			max = Math.floor(max);
			return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
		}
		const content = hits.map(hit => hit._source);
		console.log(content);
		this._videos = content.map(({ thumbnail, lastRevTitle, createdAt }) => {
			const randomSeconds = getRandomInt(1, 60);
			return {
				thumbnail,
				title: lastRevTitle,
				duration: `${getRandomInt(0, 20)}:${randomSeconds < 10 ? '0' : ''}${randomSeconds}`,
				uploadDate: formatDate(new Date(createdAt)),
				views: getRandomInt(0, 100000)
			};
		});
	}

	async _handleVideoSearch({ detail: { value: query } }) {
		const { hits: { hits } } = await this.apiClient.searchContent({
			query,
			contentType: 'video',
			includeThumbnails: true
		});
		this._updateVideoList(hits);
	}

	_renderVideos() {
		if (this._videos.length === 0) {
			return html`<div>${this.localize('noResults')}</div>`;
		}
		return this._videos.map(video => html`
			<d2l-card class="d2l-capture-central-video" href="#">
				<div slot="header">
					<img alt="" class="d2l-capture-central-thumbnail" src="${video.thumbnail}" />
					<div class="d2l-capture-central-play-icon-overlay">
						<d2l-icon class="d2l-capture-central-play-icon" icon="tier3:play"></d2l-icon>
					</div>
				</div>
				<div class="d2l-capture-central-video-info" slot="content">
					${video.title}
				</div>
				<div class="d2l-capture-central-card-footer" slot="footer">
					<div class="d2l-capture-central-upload-date">${video.uploadDate}</div>
					<div class="d2l-capture-central-views">${this.localize('numViews', { count: video.views })}</div>
				</div>
			</d2l-card>
		`);
	}

	render() {
		return html`
			<div class="d2l-capture-central-course-videos">
				<h2 class="d2l-capture-central-course-videos-header">${this.localize('videoLibrary')}</h2>
				<d2l-dropdown-button class="d2l-capture-central-filter-folders" text="${this.localize('folders')}">
					<d2l-dropdown-menu>
						<d2l-menu label="Folders">
							<d2l-menu-item @click=${this._goTo('/admin')} text="Placeholder text ..."></d2l-menu-item>
							<d2l-menu-item text="Placeholder text ..."></d2l-menu-item>
						</d2l-menu>
					</d2l-dropdown-menu>
				</d2l-dropdown-button>
				<d2l-input-search
					@d2l-input-search-searched=${this._handleVideoSearch}
					class="d2l-capture-central-search-videos"
					label="${this.localize('searchLabel')}"
					placeholder="${this.localize('searchPlaceholder')}"
				></d2l-input-search>
				${this._renderVideos()}
				<d2l-button class="d2l-capture-central-load-more-button">
					${this.localize('loadMore')}
				</d2l-button>
			</div>
		`;
	}

}
customElements.define('d2l-capture-central-course-videos', D2LCaptureCentralCourseVideos);