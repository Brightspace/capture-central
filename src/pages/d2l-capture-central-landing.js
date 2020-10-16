import '../components/capture-central-live-events.js';

import { css, html } from 'lit-element/lit-element.js';
import { heading3Styles, heading4Styles } from '@brightspace-ui/core/components/typography/styles.js';
import { DependencyRequester } from '../mixins/dependency-requester-mixin.js';
import { PageViewElement } from '../components/page-view-element.js';

class D2lCaptureCentralLanding extends DependencyRequester(PageViewElement) {

	static get styles() {
		return [heading3Styles, heading4Styles, css`
		`];
	}

	render() {
		return html`
			<capture-central-live-events></capture-central-live-events>
		`;
	}
}

window.customElements.define('d2l-capture-central-landing', D2lCaptureCentralLanding);
