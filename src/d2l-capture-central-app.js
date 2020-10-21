import { css, html, LitElement } from 'lit-element/lit-element.js';
import { BASE_PATH } from './state/routing-store.js';

import { DependencyRequester } from './mixins/dependency-requester-mixin.js';
import { InternalLocalizeMixin } from './mixins/internal-localize-mixin.js';
import { MobxReactionUpdate } from '@adobe/lit-mobx';
import { NavigationMixin } from './mixins/navigation-mixin.js';
import page from 'page/page.mjs';

import { pageNames } from './util/constants.js';
import { ResizeObserver } from 'd2l-resize-aware/resize-observer-module.js';
import { rootStore } from './state/root-store.js';

class D2lCaptureCentralApp extends DependencyRequester(NavigationMixin(InternalLocalizeMixin(MobxReactionUpdate(LitElement)))) {
	static get properties() {
		return {
			_permissionError: { type: Boolean, attribute: false }
		};
	}

	static get styles() {
		return [css`
			main {
				display: block;
				height: 100%;
				margin: 0 auto;
				max-width: 1175px;
			}

			.page {
				display: none;
			}

			.page[active] {
				display: block;
			}
		`];
	}

	constructor() {
		super();
		const documentObserver = new ResizeObserver(this._resized.bind(this));
		documentObserver.observe(document.body, { attributes: true });

		this.loading = true;
		this._setupPageNavigation();
		this._permissionError = false;
	}

	async connectedCallback() {
		await super.connectedCallback();
		this.userBrightspaceClient = this.requestDependency('user-brightspace-client');

		try {
			const permissions = await this.userBrightspaceClient.getPermissions();
			rootStore.permissionStore.setPermissions(permissions);
		} catch (error) {
			this._permissionError = true;
		}
	}

	_resized() {
		rootStore.appTop = this.offsetTop;
	}

	_setupPageNavigation() {
		page.base(BASE_PATH);

		const routes = [
			`/:orgUnitId/${pageNames.page404}`,
			`/:orgUnitId/${pageNames.admin}`,
			`/:orgUnitId/${pageNames.auditLogs}`,
			`/:orgUnitId/${pageNames.clips}`,
			`/:orgUnitId/${pageNames.courseVideos}`,
			`/:orgUnitId/${pageNames.courseVideos}/:id`,
			`/:orgUnitId/${pageNames.folders}`,
			`/:orgUnitId/${pageNames.viewLiveEvent}`,
			`/:orgUnitId/${pageNames.manageLiveEvents}/create`,
			`/:orgUnitId/${pageNames.manageLiveEvents}/edit`,
			`/:orgUnitId/${pageNames.liveEventsReporting}`,
			`/:orgUnitId/${pageNames.presentations}`,
			`/:orgUnitId/${pageNames.presentations}/edit`,
			`/:orgUnitId/${pageNames.settings}`,
			`/:orgUnitId/${pageNames.uploadVideo}`,
			`/:orgUnitId/${pageNames.visits}`,
			'/:orgUnitId/',
			'/*',
		];
		routes.forEach(route => page(route, this.setupPage.bind(this)));
		page();
	}

	setupPage(ctx) {
		rootStore.routingStore.setRouteCtx(ctx);
		const { page, subView } = rootStore.routingStore;

		switch (page) {
			case '':
				import('./pages/d2l-capture-central-landing.js');
				return;
			case pageNames.admin:
				import('./pages/admin/d2l-capture-central-admin.js');
				return;
			case pageNames.auditLogs:
				import('./pages/reporting/d2l-capture-central-audit-logs.js');
				return;
			case pageNames.courseVideos:
				if (subView) {
					import('./pages/course-videos/d2l-capture-central-course-video-player.js');
					return;
				}
				import('./pages/course-videos/d2l-capture-central-course-videos.js');
				return;
			case pageNames.clips:
				import('./pages/clips/d2l-capture-central-clips.js');
				return;
			case pageNames.folders:
				import('./pages/folders/d2l-capture-central-folders.js');
				return;
			case pageNames.groups:
				import('./pages/groups/d2l-capture-central-groups.js');
				return;
			case pageNames.manageLiveEvents:
				switch (subView) {
					case 'edit':
						import('./pages/live-events/d2l-capture-central-live-events-edit.js');
						return;
					case 'create':
						import('./pages/live-events/d2l-capture-central-live-events-create.js');
						return;
					default:
						rootStore.routingStore.setPage('404');
						import('./pages/404/d2l-capture-central-404.js');
						return;
				}
			case pageNames.viewLiveEvent:
				import('./pages/live-events/d2l-capture-central-live-events-view.js');
				return;
			case pageNames.liveEventsReporting:
				import('./pages/reporting/d2l-capture-central-live-events-reporting.js');
				return;
			case pageNames.presentations:
				if (subView === 'edit') {
					import('./pages/presentations/d2l-capture-central-presentations-edit.js');
					return;
				}
				import('./pages/presentations/d2l-capture-central-presentations.js');
				return;
			case pageNames.settings:
				import('./pages/settings/d2l-capture-central-settings.js');
				return;
			case pageNames.uploadVideo:
				import('./pages/upload-video/d2l-capture-central-upload-video.js');
				return;
			case pageNames.users:
				import('./pages/users/d2l-capture-central-users.js');
				return;
			case pageNames.visits:
				import('./pages/reporting/d2l-capture-central-visits.js');
				return;
			default:
				rootStore.routingStore.setPage('404');
				import('./pages/404/d2l-capture-central-404.js');
				break;
		}
	}

	render() {
		const { page: currentPage, subView } = rootStore.routingStore;

		if (this._permissionError) {
			return html `
				${this.localize('unableToGetPermissions')}
			`;
		}

		return html`
			<main id="main" role="main">
				<d2l-capture-central-landing class="page" ?active=${currentPage === pageNames.landing}></d2l-capture-central-landing>
				<d2l-capture-central-admin class="page" ?active=${currentPage === pageNames.admin}></d2l-capture-central-admin>
				<d2l-capture-central-audit-logs class="page" ?active=${currentPage === pageNames.auditLogs}></d2l-capture-central-audit-logs>
				<d2l-capture-central-course-videos class="page" ?active=${currentPage === pageNames.courseVideos && !subView}></d2l-capture-central-course-videos>
				<d2l-capture-central-course-video-player class="page" ?active=${currentPage === pageNames.courseVideos && subView}></d2l-capture-central-course-video-player>
				<d2l-capture-central-clips class="page" ?active=${currentPage === pageNames.clips}></d2l-capture-central-clips>
				<d2l-capture-central-folders class="page" ?active=${currentPage === pageNames.folders}></d2l-capture-central-folders>
				<d2l-capture-central-live-events-view class="page" ?active=${currentPage === pageNames.viewLiveEvent}></d2l-capture-central-live-events-view>
				<d2l-capture-central-live-events-edit class="page" ?active=${currentPage === pageNames.manageLiveEvents && subView === 'edit'}></d2l-capture-central-live-events-edit>
				<d2l-capture-central-live-events-create class="page" ?active=${currentPage === pageNames.manageLiveEvents && subView === 'create'}></d2l-capture-central-live-events-create>
				<d2l-capture-central-live-events-reporting class="page" ?active=${currentPage === pageNames.liveEventsReporting}></d2l-capture-central-live-events-reporting>
				<d2l-capture-central-presentations class="page" ?active=${currentPage === pageNames.presentations && !subView}></d2l-capture-central-presentations>
				<d2l-capture-central-presentations-edit class="page" ?active=${currentPage === pageNames.presentations && subView === 'edit'}></d2l-capture-central-presentations-edit>
				<d2l-capture-central-settings class="page" ?active=${currentPage === pageNames.settings}></d2l-capture-central-settings>
				<d2l-capture-central-upload-video class="page" ?active=${currentPage === pageNames.uploadVideo}></d2l-capture-central-upload-video>
				<d2l-capture-central-visits class="page" ?active=${currentPage === pageNames.visits}></d2l-capture-central-visits>
				<d2l-capture-central-404 class="page" ?active=${currentPage === pageNames.page404}></d2l-capture-central-404>
			</main>
		`;
	}
}

customElements.define('d2l-capture-central-app', D2lCaptureCentralApp);
