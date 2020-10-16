import { html } from 'lit-element/lit-element.js';
import { PageViewElement } from '../../components/page-view-element.js';

class D2lCaptureCentral404 extends PageViewElement {
	render() {
		return html`
			<p>${this.localize('pageNotFound')}</p>
			<a href="" @click=${this.navigateToHome}>${this.localize('goBackToHomePage')}</a>
		`;
	}

	navigateToHome() {
		this._navigate('/');
	}
}

window.customElements.define('d2l-capture-central-404', D2lCaptureCentral404);
