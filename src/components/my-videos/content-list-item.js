import '@brightspace-ui/core/components/button/button-icon.js';
import '@brightspace-ui/core/components/icons/icon.js';
import '@brightspace-ui/core/components/list/list-item.js';
import '@brightspace-ui/core/components/dropdown/dropdown-more.js';
import '@brightspace-ui/core/components/dropdown/dropdown-menu.js';
import '@brightspace-ui/core/components/menu/menu.js';
import '@brightspace-ui/core/components/menu/menu-item.js';
import '@brightspace-ui/core/components/dialog/dialog.js';
import '@brightspace-ui/core/components/inputs/input-text.js';
import './content-list-columns.js';

import {
	bodyCompactStyles,
	bodySmallStyles
} from '@brightspace-ui/core/components/typography/styles.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { DependencyRequester } from '../../mixins/dependency-requester-mixin.js';
import { InternalLocalizeMixin } from '../../mixins/internal-localize-mixin.js';
import { navigationMixin } from '../../mixins/navigation-mixin.js';
import { pageNames } from '../../util/constants.js';
import { rootStore } from '../../state/root-store.js';
const actionsDefaultZIndex = 2;
const actionsActiveZIndex = 5;
const dialogConfirmAction = 'confirm';

class ContentListItem extends DependencyRequester(navigationMixin(InternalLocalizeMixin(LitElement))) {
	static get properties() {
		return {
			confirmDisabled: { type: Boolean, attribute: false },
			disabled: { type: Boolean },
			dropdownBoundary: { type: Object, attribute: false },
			id: { type: String },
			revisionId: { type: String, attribute: 'revision-id' },
			selectable: { type: Boolean },
			title: { type: String },
		};
	}

	static get styles() {
		return [bodyCompactStyles, bodySmallStyles, css`
			.actions {
				position: relative;
			}
			content-list-columns div {
				margin-right: 5px;
			}
		`];
	}

	constructor() {
		super();
		this.selectable = true;
		this.dropdownBoundary = {};
		this.revision = null;
		this.confirmDisabled = false;
	}

	connectedCallback() {
		super.connectedCallback();
		this.apiClient = this.requestDependency('content-service-client');
	}

	firstUpdated() {
		super.firstUpdated();
		this.addEventListener('d2l-dropdown-close', this.dropdownClosed);
		this.addEventListener('d2l-dropdown-open', this.adjustDropdownBoundary);
	}

	render() {
		return html`
			<d2l-list-item class="d2l-body-compact"
				?disabled=${this.disabled}
				label="${this.title}"
				?selectable=${this.selectable}
				key=${this.id}
			>
				<div slot="illustration">
					<slot name="icon"></slot>
				</div>

				<content-list-columns>
					<div slot="detail">
						<slot name="title"></slot>
						<slot name="type" class="d2l-body-small"></slot>
					</div>
					<div slot="date">
						<slot name="date"></slot>
					</div>
				</content-list-columns>

				<div slot="actions" id="actions" class="actions">
					<d2l-button-icon
						@click=${this._goTo(`/${pageNames.courseVideos}/${this.id}`)}
						text="${this.localize('preview')}"
						icon="tier1:preview"
						?disabled=${this.disabled}
					></d2l-button-icon>
					<d2l-dropdown-more text="${this.localize('moreActions')}" @click=${this.dropdownClicked} ?disabled=${this.disabled}>
						<d2l-dropdown-menu id="actions-dropdown-menu" align="end" boundary=${JSON.stringify(this.dropdownBoundary)}>
							<d2l-menu label="${this.localize('moreActions')}">
								<d2l-menu-item text="${this.localize('download')}" @click="${this.download}"></d2l-menu-item>
								<d2l-menu-item text="${this.localize('edit')}" @click=${this._goTo(`/${pageNames.producer}/${this.id}`)}></d2l-menu-item>
								<d2l-menu-item id="rename-initiator" text="${this.localize('rename')}" @click="${this.openDialog()}"></d2l-menu-item>
								<d2l-menu-item text="${this.localize('delete')}" @click="${this.delete()}"></d2l-menu-item>
							</d2l-menu>
						</d2l-dropdown-menu>
					</d2l-dropdown-more>
				</div>
			</d2l-list-item>

			<d2l-dialog id="rename-dialog" title-text="${this.localize('rename')}">
				<d2l-input-text
					id="rename-input"
					label="${this.localize('title')}"
					label-hidden
					placeholder="${this.localize('titlePlaceholder')}"
					value="${this.title}"
					novalidate
					@input="${this.titleInputChangedHandler}"
					maxlength=100></d2l-input-text>
				<d2l-button slot="footer" ?disabled=${this.confirmDisabled} id="rename-dialog-confirm" primary dialog-action="${dialogConfirmAction}">${this.localize('save')}</d2l-button>
				<d2l-button slot="footer" id="rename-dialog-cancel" dialog-action>${this.localize('cancel')}</d2l-button>
			</d2l-dialog>
		`;
	}

	download() {
		// Safari blocks calls to window.open within an async call
		const downloadWindow = window.open('', '_blank');
		this.apiClient.getSignedUrlForRevision({
			contentId: this.id,
			revisionId: this.revisionId
		})
			.then(res => {
				if (res && res.value) {
					downloadWindow.location.replace(res.value);
				} else {
					downloadWindow.close();
				}
			})
			.catch(() => downloadWindow.close());
	}

	// The class "actions" and methods dropdownClicked and dropdownClosed
	// are used to work around an issue with dropdown menus inside a list item: https://github.com/BrightspaceUI/core/issues/399
	dropdownClicked(e) {
		if (e && e.target && e.target.parentNode) {
			const actionsDropdownMenu = this.shadowRoot.querySelector('#actions-dropdown-menu');
			const opened = actionsDropdownMenu && actionsDropdownMenu.opened;
			e.target.focus();
			if (opened) {
				e.target.parentNode.style.zIndex = actionsActiveZIndex;
			} else {
				e.target.parentNode.style.zIndex = actionsDefaultZIndex;
			}
		}
	}

	dropdownClosed() {
		const actionsElement = this.shadowRoot.querySelector('#actions');
		if (actionsElement) {
			actionsElement.style.zIndex = actionsDefaultZIndex;
		}
	}

	adjustDropdownBoundary() {
		const target = this.shadowRoot.querySelector('d2l-dropdown-more');
		const topOffsetForDropdownMenu = 25;
		const minimumBoundingTop = 70;

		if (target) {
			const distanceToTop = target.getBoundingClientRect().top;
			const finalBoundingTop = distanceToTop - rootStore.appTop - topOffsetForDropdownMenu;

			this.dropdownBoundary = {
				above: Math.max(finalBoundingTop, minimumBoundingTop)
			};
		}
	}

	openDialog() {
		return async() => {
			const action = await this.shadowRoot.querySelector('#rename-dialog').open();
			const titleInputElement = this.shadowRoot.querySelector('#rename-input');
			if (action === dialogConfirmAction && titleInputElement && titleInputElement.value) {
				await this.rename(titleInputElement.value);
			} else {
				titleInputElement.value = this.title;
			}
		};
	}

	async rename(newTitle) {
		if (this.title !== newTitle) {
			this.dispatchRenameEvent(newTitle);
			if (!this.revision) {
				this.revision = await this.apiClient.getRevision({
					contentId: this.id,
					revisionId: this.revisionId
				});
			}

			const updatedRevision = Object.assign({}, this.revision, { title: newTitle });
			await this.apiClient.updateRevision({
				contentId: this.id,
				revisionId: this.revisionId,
				revision: updatedRevision
			});
		}
	}

	dispatchRenameEvent(title) {
		this.dispatchEvent(new CustomEvent('content-list-item-renamed', {
			bubbles: true,
			composed: true,
			detail: {
				id: this.id,
				title
			}
		}));
	}

	titleInputChangedHandler() {
		const titleInputElement = this.shadowRoot.querySelector('#rename-input');
		const titleInputValue = titleInputElement && titleInputElement.value;
		this.confirmDisabled = !titleInputValue || titleInputValue.trim().length === 0;
	}

	delete() {
		return async() => {
			await this.apiClient.deleteContent({
				contentId: this.id
			});
			this.dispatchDeletedEvent();
		};
	}

	dispatchDeletedEvent() {
		this.dispatchEvent(new CustomEvent('content-list-item-deleted', {
			bubbles: true,
			composed: true,
			detail: {
				id: this.id
			}
		}));
	}
}

window.customElements.define('content-list-item', ContentListItem);
