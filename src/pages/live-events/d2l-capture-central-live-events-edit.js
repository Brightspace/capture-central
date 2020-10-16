import '@brightspace-ui/core/components/breadcrumbs/breadcrumb.js';
import '@brightspace-ui/core/components/breadcrumbs/breadcrumb-current-page.js';
import '@brightspace-ui/core/components/breadcrumbs/breadcrumbs.js';
import '@brightspace-ui/core/components/button/button.js';
import '@brightspace-ui/core/components/button/button-icon.js';
import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/inputs/input-text.js';
import '@brightspace-ui/core/components/inputs/input-date-time-range.js';
import '@brightspace-ui/core/components/loading-spinner/loading-spinner.js';
import '@brightspace-ui-labs/accordion/accordion-collapse.js';
import '../../components/live-event-form.js';

import { css, html } from 'lit-element/lit-element.js';
import { heading2Styles, labelStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { DependencyRequester } from '../../mixins/dependency-requester-mixin.js';
import { inputStyles } from '@brightspace-ui/core/components/inputs/input-styles.js';
import { observe } from 'mobx';
import { pageNames } from '../../util/constants.js';
import { PageViewElement } from '../../components/page-view-element.js';
import { rootStore } from '../../state/root-store.js';
import { sharedEditStyles } from '../../components/shared-styles.js';

class D2LCaptureLiveEventsEdit extends DependencyRequester(PageViewElement) {

	static get properties() {
		return {
			_loading: { type: Boolean, attribute: false },
		};
	}
	static get styles() {
		return [inputStyles, heading2Styles, labelStyles, sharedEditStyles, css`
			d2l-loading-spinner {
				display: flex;
				margin-top: 10%;
			}

			.hidden {
				display: none;
			}

			.visible {
				display: block;
			}
		`];
	}

	constructor() {
		super();
		this._liveEvent = {};
		this.captureApiClient = this.requestDependency('capture-service-client');
		this._loading = true;
		this.observeQueryParams();
	}

	firstUpdated() {
		super.firstUpdated();
		this.reloadPage();
		const editLiveEventForm = this.shadowRoot.querySelector('#edit-live-event-form');
		if (editLiveEventForm) {
			editLiveEventForm.addEventListener('edit-live-event', this.handleEditEvent.bind(this));
		}
	}

	observeQueryParams() {
		observe(
			rootStore.routingStore,
			'queryParams',
			async() => {
				if (this.loading) {
					return;
				}

				if (rootStore.routingStore.page === pageNames.manageLiveEvents &&
					rootStore.routingStore.subView === pageNames.manageLiveEventsEdit) {
					this.reloadPage();
				}
			}
		);
	}

	async reloadPage() {
		const editLiveEventForm = this.shadowRoot.querySelector('#edit-live-event-form');
		const loadSpinner = this.shadowRoot.querySelector('#loading-spinner');

		this._loading = true;
		loadSpinner.className = 'visible';
		editLiveEventForm.className = 'hidden';

		let liveEventResponse;
		try {
			liveEventResponse = await this.captureApiClient.getEvent({
				id: rootStore.routingStore.getQueryParams().id
			});
			this._liveEvent = liveEventResponse.item;
			editLiveEventForm.updateFields(this._liveEvent);
			editLiveEventForm.setFocus();
		} catch (error) {
			editLiveEventForm.renderFailureAlert({ message: this.localize('getLiveEventError'), hideInputs: true });
		}

		loadSpinner.className = 'hidden';
		editLiveEventForm.className = 'visible';
		this._loading = false;
	}

	async handleEditEvent(event) {
		if (event && event.detail) {
			const {
				id,
				title,
				presenter,
				description,
				startTime,
				endTime,
				status,
				enableChat,
				layoutName
			}  = event.detail;
			const editLiveEventForm = this.shadowRoot.querySelector('#edit-live-event-form');

			try {
				await this.captureApiClient.updateEvent({
					id,
					title,
					presenter,
					description,
					startTime,
					endTime,
					status,
					enableChat,
					layoutName
				});
			} catch (error) {
				editLiveEventForm.renderFailureAlert({ message: this.localize('updateLiveEventError') });
				return;
			}

			editLiveEventForm.renderEditSuccessAlert();
		}
	}

	render() {
		return html`
			<d2l-loading-spinner id="loading-spinner" class="hidden" size=150></d2l-loading-spinner>
			<live-event-form
				class="hidden"
				id="edit-live-event-form"
				live-event="${JSON.stringify(this._liveEvent)}"
				is-edit>
			</live-event-form>
		`;
	}
}

window.customElements.define('d2l-capture-central-live-events-edit', D2LCaptureLiveEventsEdit);
