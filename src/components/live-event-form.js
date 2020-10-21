import '@brightspace-ui/core/components/alert/alert.js';
import '@brightspace-ui/core/components/breadcrumbs/breadcrumb.js';
import '@brightspace-ui/core/components/breadcrumbs/breadcrumb-current-page.js';
import '@brightspace-ui/core/components/breadcrumbs/breadcrumbs.js';
import '@brightspace-ui/core/components/button/button.js';
import '@brightspace-ui/core/components/button/button-icon.js';
import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/inputs/input-checkbox.js';
import '@brightspace-ui/core/components/inputs/input-text.js';
import '@brightspace-ui/core/components/inputs/input-date-time-range.js';
import '@brightspace-ui-labs/accordion/accordion-collapse.js';

import { css, html, LitElement } from 'lit-element/lit-element.js';
import { heading2Styles, labelStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { layoutNames, streamingStatus } from '../util/constants.js';
import { inputLabelStyles } from '@brightspace-ui/core/components/inputs/input-label-styles';
import { inputStyles } from '@brightspace-ui/core/components/inputs/input-styles.js';
import { InternalLocalizeMixin } from '../mixins/internal-localize-mixin.js';
import { MobxReactionUpdate } from '@adobe/lit-mobx';
import { NavigationMixin } from '../mixins/navigation-mixin.js';
import { radioStyles } from '@brightspace-ui/core/components/inputs/input-radio-styles.js';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin.js';
import { selectStyles } from '@brightspace-ui/core/components/inputs/input-select-styles.js';
import { sharedEditStyles } from './shared-styles.js';

class LiveEventForm extends MobxReactionUpdate(NavigationMixin(RtlMixin(InternalLocalizeMixin(LitElement)))) {

	static get properties() {
		return {
			isEdit: { type: Boolean, attribute: 'is-edit' },
			_alertMessage: { type: String, attribute: false }
		};
	}
	static get styles() {
		return [inputStyles,
			heading2Styles,
			labelStyles,
			selectStyles,
			inputLabelStyles,
			radioStyles,
			sharedEditStyles, css`
			.d2l-capture-central-edit-live-events-start-end-times {
				margin-bottom: 25px;
				width: 750px;
			}

			.d2l-capture-central-live-event-form-critical-alert {
				display: none;
				margin-bottom: 1rem;
			}

			.d2l-capture-central-live-event-form-streaming-status-select {
				width: 40%;
			}

			.d2l-capture-central-live-event-form-input-container {
				display: flex;
				flex-direction: column;
			}

			.d2l-capture-central-live-event-form-settings-container {
				display: flex;
				flex-direction: column;
			}

			.d2l-capture-central-live-event-form-enable-chat-container {
				margin-top: 1rem;
			}
		`];
	}

	constructor() {
		super();
		this._descriptionTextAreaRows = 5;
		this._descriptionMaxCharacters = 500;
		this._alertMessage = '';
		this._liveEvent = {};
	}

	firstUpdated() {
		super.firstUpdated();
		this.reload();
	}

	reload() {
		const titleInputElement = this.shadowRoot.querySelector('#title-input');
		if (titleInputElement) {
			titleInputElement.value = '';
			titleInputElement.focus();
		}

		const presenterInputElement = this.shadowRoot.querySelector('#presenter-input');
		if (presenterInputElement) {
			presenterInputElement.value = '';
		}

		const descriptionInputElement = this.shadowRoot.querySelector('#description-input');
		if (descriptionInputElement) {
			descriptionInputElement.value = '';
		}

		const dateTimeRangeInputElement = this.shadowRoot.querySelector('#date-time-range-input');
		if (dateTimeRangeInputElement) {
			const startTime = new Date();
			const endTime = new Date();
			startTime.setMinutes(0, 0, 0);
			endTime.setHours(endTime.getHours() + 1);
			endTime.setMinutes(0, 0, 0);

			dateTimeRangeInputElement.setAttribute('start-value', startTime.toISOString());
			dateTimeRangeInputElement.setAttribute('end-value', endTime.toISOString());
		}

		const enableChatElement = this.shadowRoot.querySelector('#enable-chat-checkbox');
		if (enableChatElement) {
			enableChatElement.checked = true;
		}

		const streamingStatusInputElement = this.shadowRoot.querySelector('#streaming-status-select');
		if (streamingStatusInputElement) {
			streamingStatusInputElement.value = streamingStatus.default;
		}

		this.setPresentationLayoutSelection({ layoutName: layoutNames.default });
		this.hideAccordions();
		this.hideFailureAlert();
	}

	setLiveEvent(liveEvent) {
		this._liveEvent = liveEvent;

		const titleInputElement = this.shadowRoot.querySelector('#title-input');
		if (titleInputElement) {
			titleInputElement.value = (liveEvent && liveEvent.title) || '';
			titleInputElement.focus();
		}

		const presenterInputElement = this.shadowRoot.querySelector('#presenter-input');
		if (presenterInputElement) {
			presenterInputElement.value = (liveEvent && liveEvent.presenter) || '';
		}

		const descriptionInputElement = this.shadowRoot.querySelector('#description-input');
		if (descriptionInputElement) {
			descriptionInputElement.value = (liveEvent && liveEvent.description) || '';
		}

		const dateTimeRangeInputElement = this.shadowRoot.querySelector('#date-time-range-input');
		if (dateTimeRangeInputElement) {
			dateTimeRangeInputElement.setAttribute('start-value', liveEvent.startTime);
			dateTimeRangeInputElement.setAttribute('end-value', liveEvent.endTime);
		}

		const streamingStatusInputElement = this.shadowRoot.querySelector('#streaming-status-select');
		if (streamingStatusInputElement) {
			streamingStatusInputElement.value = liveEvent.status;
		}

		const enableChatElement = this.shadowRoot.querySelector('#enable-chat-checkbox');
		if (enableChatElement) {
			enableChatElement.checked  = liveEvent.enableChat;
		}

		this.setPresentationLayoutSelection({ layoutName: liveEvent.layoutName });
		this.hideAccordions();
		this.hideFailureAlert();
	}

	_getInputs() {
		const titleInputElement = this.shadowRoot.querySelector('#title-input');
		const title = titleInputElement && titleInputElement.value;

		const presenterInputElement = this.shadowRoot.querySelector('#presenter-input');
		const presenter = (presenterInputElement && presenterInputElement.value) || '';

		const descriptionInputElement = this.shadowRoot.querySelector('#description-input');
		const description = (descriptionInputElement && descriptionInputElement.value) || '';

		const dateTimeRangeInputElement = this.shadowRoot.querySelector('#date-time-range-input');
		const startTime = dateTimeRangeInputElement && dateTimeRangeInputElement.getAttribute('start-value');
		const endTime = dateTimeRangeInputElement && dateTimeRangeInputElement.getAttribute('end-value');

		const streamingStatusInputElement = this.shadowRoot.querySelector('#streaming-status-select');
		const status = streamingStatusInputElement.value;

		const enableChatElement = this.shadowRoot.querySelector('#enable-chat-checkbox');
		const enableChat = enableChatElement.checked;

		const layoutName = this.getPresentationLayoutSelection();

		return {
			title,
			presenter,
			description,
			startTime: startTime === 'undefined' ? '' : startTime,
			endTime: endTime === 'undefined' ? '' : endTime,
			status,
			enableChat,
			layoutName: layoutName
		};
	}

	setFocus() {
		const titleInputElement = this.shadowRoot.querySelector('#title-input');
		if (titleInputElement) {
			titleInputElement.focus();
		}
	}

	async _createEvent() {
		this.hideFailureAlert();

		const inputs = this._getInputs();
		if (!inputs.title) {
			const titleInputElement = this.shadowRoot.querySelector('#title-input');
			titleInputElement.focus();
			return;
		}

		const event = new CustomEvent('create-live-event', {
			detail: { ...inputs },
			bubbles: true,
			composed: true
		});

		this.dispatchEvent(event);
	}

	async _editEvent() {
		this.hideFailureAlert();

		const inputs = this._getInputs();
		if (!inputs.title) {
			const titleInputElement = this.shadowRoot.querySelector('#title-input');
			titleInputElement.focus();
			return;
		}

		const event = new CustomEvent('edit-live-event', {
			detail: {
				id: this._liveEvent.id,
				...inputs
			},
			bubbles: true,
			composed: true
		});

		this.dispatchEvent(event);
	}

	renderFailureAlert({ message, hideInputs = false}) {
		const criticalAlert = this.shadowRoot.querySelector('#live-event-form-critical-alert');
		if (criticalAlert) {
			this._alertMessage = message;
			criticalAlert.style.display = 'block';
			this.scrollToTop();

			const inputContainerElement = this.shadowRoot.querySelector('#input-container');
			if (hideInputs && inputContainerElement) {
				inputContainerElement.style.display = 'none';
				this.requestUpdate();
			}
		}
	}

	scrollToTop() {
		document.body.scrollTop = 0; // For Safari
		document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
	}

	hideFailureAlert() {
		const criticalAlert = this.shadowRoot.querySelector('#live-event-form-critical-alert');
		if (criticalAlert) {
			criticalAlert.style.display = 'none';
			const inputContainerElement = this.shadowRoot.querySelector('#input-container');
			if (inputContainerElement) {
				inputContainerElement.style.display = 'flex';
			}
		}
	}

	hideAccordions() {
		const accessControlAccordionElement = this.shadowRoot.querySelector('#access-control-accordion');
		if (accessControlAccordionElement) {
			accessControlAccordionElement.removeAttribute('opened');
		}
	}

	getCurrentPageLabel() {
		if (this.isEdit) {
			return this.localize('editEvent');
		} else {
			return this.localize('createLiveEvent');
		}
	}

	getPresentationLayoutSelection() {
		const layoutCameraInputElement = this.shadowRoot.querySelector('#presentation-layout-camera');
		const layoutScreenInputElement = this.shadowRoot.querySelector('#presentation-layout-screen');
		const layoutCameraAndScreenInputElement = this.shadowRoot.querySelector('#presentation-layout-camera-and-screen');

		if (layoutCameraInputElement && layoutCameraInputElement.checked) {
			return layoutNames.camera;
		}

		if (layoutScreenInputElement && layoutScreenInputElement.checked) {
			return layoutNames.screen;
		}

		if (layoutCameraAndScreenInputElement && layoutCameraAndScreenInputElement.checked) {
			return layoutNames.cameraAndScreen;
		}

		return layoutNames.default;
	}

	setPresentationLayoutSelection({ layoutName }) {
		const layoutCameraInputElement = this.shadowRoot.querySelector('#presentation-layout-camera');
		const layoutScreenInputElement = this.shadowRoot.querySelector('#presentation-layout-screen');
		const layoutCameraAndScreenInputElement = this.shadowRoot.querySelector('#presentation-layout-camera-and-screen');

		if (layoutCameraInputElement && layoutName === layoutNames.camera) {
			layoutCameraInputElement.checked = true;
		} else if (layoutScreenInputElement && layoutName === layoutNames.screen) {
			layoutScreenInputElement.checked = true;
		} else if (layoutCameraAndScreenInputElement) {
			layoutCameraAndScreenInputElement.checked = true;
		}
	}

	_renderSubmitButton() {
		if (this.isEdit) {
			return html`
				<d2l-button
					class="d2l-capture-central-edit-save-changes-button"
					primary
					@click=${this._editEvent}
				>${this.localize('saveChanges')}
				</d2l-button>`;
		} else {
			return html`
				<d2l-button
					class="d2l-capture-central-edit-save-changes-button"
					primary
					@click=${this._createEvent}
				>${this.localize('create')}
				</d2l-button>`;
		}
	}

	_renderSettings() {
		return html`
			<div class="d2l-capture-central-live-event-form-settings-container">
				<div>
					<label
						for="streaming-status-select"
						class="d2l-input-label">
						${this.localize('streamingStatus')}
					</label>
					<select
						id="streaming-status-select"
						class="d2l-input-select d2l-capture-central-live-event-form-streaming-status-select">
						<option value="${streamingStatus.current}">${this.localize('current')}</option>
						<option value="${streamingStatus.upcoming}">${this.localize('upcoming')}</option>
					</select>
				</div>
					<label
						for="presentation-layout-radio-input"
						class="d2l-input-label">
						${this.localize('presentationLayout')}
					</label>
					<div id="presentation-layout-radio-input">
						<label class="d2l-input-radio-label">
							<input
								type="radio"
								name="presentationLayout"
								id="presentation-layout-camera-and-screen">
							${this.localize('cameraAndScreen')}
						</label>
						<label class="d2l-input-radio-label">
							<input type="radio" name="presentationLayout" id="presentation-layout-camera">
							${this.localize('camera')}
						</label>
						<label class="d2l-input-radio-label">
							<input type="radio" name="presentationLayout" id="presentation-layout-screen">
							${this.localize('screen')}
						</label>
					</div>
				</div>
				<div class="d2l-capture-central-live-event-form-enable-chat-container">
					<d2l-input-checkbox
						id="enable-chat-checkbox">
						${this.localize('enableChat')}
					</d2l-input-checkbox>
				</div>
			</div>
		`;
	}

	render() {
		return html`
			<div class="d2l-capture-central-edit-container">
				<d2l-breadcrumbs>
					<d2l-breadcrumb @click=${this._goTo('/')} href="#" text="${this.localize('captureCentral')}"></d2l-breadcrumb>
					<d2l-breadcrumb-current-page text="${this.getCurrentPageLabel()}"></d2l-breadcrumb-current-page>
				</d2l-breadcrumbs>
				<div class="d2l-heading-2">${this.getCurrentPageLabel()}</div>
				<div>
					<d2l-alert
						id="live-event-form-critical-alert"
						class="d2l-capture-central-live-event-form-critical-alert"
						type="critical">
						${this._alertMessage}
					</d2l-alert>
				</div>
				<div id="input-container" class="d2l-capture-central-live-event-form-input-container">
					<d2l-input-text
						id="title-input"
						label="${this.localize('title')}"
						placeholder="${this.localize('title')}"
						required
					></d2l-input-text>
					<d2l-input-text
						id="presenter-input"
						label="${this.localize('presenter')}"
						placeholder="${this.localize('presenter')}"
					></d2l-input-text>
					<div class="d2l-capture-central-edit-textarea-container">
						<div class="d2l-label-text">${this.localize('description')}</div>
						<textarea
							id="description-input"
							class="d2l-input"
							rows="${this._descriptionTextAreaRows}"
							maxlength=${this._descriptionMaxCharacters}
						></textarea
					></div>
					<div class="d2l-capture-central-edit-live-events-start-end-times">
						<d2l-input-date-time-range
							id="date-time-range-input"
							label-hidden
							label="${this.localize('startEndDates')}"
							required
						></d2l-input-date-time-range>
					</div>
					${this._renderSettings()}
					${this._renderSubmitButton()}
				</div>
			</div>
		`;
	}
}

window.customElements.define('live-event-form', LiveEventForm);
