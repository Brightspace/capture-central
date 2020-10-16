import '@brightspace-ui/core/components/breadcrumbs/breadcrumb.js';
import '@brightspace-ui/core/components/breadcrumbs/breadcrumb-current-page.js';
import '@brightspace-ui/core/components/breadcrumbs/breadcrumbs.js';
import '@brightspace-ui/core/components/button/button.js';
import '@brightspace-ui/core/components/button/button-icon.js';
import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/inputs/input-text.js';
import '@brightspace-ui/core/components/inputs/input-date-time-range.js';
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

class D2LCaptureLiveEventsCreate extends DependencyRequester(PageViewElement) {

	static get properties() {
		return {
		};
	}
	static get styles() {
		return [inputStyles, heading2Styles, labelStyles, sharedEditStyles, css`
		`];
	}

	constructor() {
		super();
		this.captureApiClient = this.requestDependency('capture-service-client');
		this.observeSubView();
	}

	firstUpdated() {
		super.firstUpdated();
		this.reloadPage();
		const createLiveEventForm = this.shadowRoot.querySelector('#create-live-event-form');
		if (createLiveEventForm) {
			createLiveEventForm.addEventListener('create-live-event', this.handleCreateEvent.bind(this));
		}
	}

	observeSubView() {
		observe(
			rootStore.routingStore,
			'subView',
			async change => {
				if (!change.oldValue &&
					change.newValue === pageNames.manageLiveEventsCreate) {
					this.reloadPage();
				}
			}
		);
	}

	async reloadPage() {
		const createLiveEventForm = this.shadowRoot.querySelector('#create-live-event-form');
		createLiveEventForm.reload();
	}

	async handleCreateEvent(event) {
		if (event && event.detail) {
			const {
				title,
				presenter,
				description,
				startTime,
				endTime,
				status,
				enableChat,
				layoutName
			}  = event.detail;
			const createLiveEventForm = this.shadowRoot.querySelector('#create-live-event-form');

			let createdEvent;
			try {
				createdEvent = await this.captureApiClient.createEvent({
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
				createLiveEventForm.renderFailureAlert({ message: this.localize('createLiveEventError') });
				return;
			}

			createLiveEventForm.renderCreateSuccessAlert(createdEvent.item.id);
		}
	}

	render() {
		return html`
			<live-event-form id="create-live-event-form"></live-event-form>
		`;
	}
}

window.customElements.define('d2l-capture-central-live-events-create', D2LCaptureLiveEventsCreate);
