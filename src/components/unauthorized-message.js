import '@brightspace-ui/core/components/button/button.js';
import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/dialog/dialog.js';
import '@brightspace-ui/core/components/inputs/input-search.js';
import '@brightspace-ui/core/components/list/list-item.js';
import '@brightspace-ui/core/components/list/list.js';

import { html, LitElement } from 'lit-element/lit-element.js';
import { InternalLocalizeMixin } from '../mixins/internal-localize-mixin.js';
import { NavigationMixin } from '../mixins/navigation-mixin.js';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin.js';

class UnauthorizedMessage extends NavigationMixin(InternalLocalizeMixin(RtlMixin(LitElement))) {

	render() {
		return html`
			<p>${this.localize('unauthorized')}</p>
			<a href="" @click=${this.navigateToHome}>${this.localize('goBackToHomePage')}</a>
		`;
	}

	navigateToHome() {
		this._navigate('/');
	}
}

window.customElements.define('unauthorized-message', UnauthorizedMessage);
