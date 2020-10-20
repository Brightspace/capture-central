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
import '../../components/unauthorized-message.js';

import { css, html } from 'lit-element/lit-element.js';
import { heading2Styles, labelStyles } from '@brightspace-ui/core/components/typography/styles.js';
import { DependencyRequester } from '../../mixins/dependency-requester-mixin.js';
import { inputStyles } from '@brightspace-ui/core/components/inputs/input-styles.js';
import { PageViewElement } from '../../components/page-view-element.js';
import { rootStore } from '../../state/root-store.js';
import { sharedEditStyles } from '../../components/shared-styles.js';

class D2LCaptureLiveEventsView extends DependencyRequester(PageViewElement) {

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
		`];
	}

	render() {
		if (!rootStore.permissionStore.getCanViewLiveEvents()) {
			return html`
				<unauthorized-message></unauthorized-message>
			`;
		}

		return html`
			<div>...</div>
		`;
	}
}

window.customElements.define('d2l-capture-central-live-events-view', D2LCaptureLiveEventsView);
