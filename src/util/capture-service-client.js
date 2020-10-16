import * as querystring from '@chaitin/querystring';
import auth from 'd2l-fetch-auth/src/unframed/index.js';
import { d2lfetch } from 'd2l-fetch/src/index.js';
import { rootStore } from '../state/root-store.js';

d2lfetch.use({ name: 'auth', fn: auth });

export default class CaptureServiceClient {
	constructor({
		endpoint
	}) {
		this.endpoint = endpoint;
	}

	_url(path, query) {
		const qs = query ? `?${querystring.stringify(query)}` : '';
		return `${this.endpoint}${path}${qs}`;
	}

	async _fetch({
		path,
		method = 'GET',
		query,
		body,
		extractJsonBody = true,
		headers = new Headers(),
		doNotUseCache = false,
	}) {
		if (body) {
			headers.append('Content-Type', 'application/json');
		}

		if (doNotUseCache) {
			headers.append('pragma', 'no-cache');
			headers.append('cache-control', 'no-cache');
		}

		const requestInit = {
			method,
			...body && {
				body: JSON.stringify(body)
			},
			headers
		};
		const request = new Request(this._url(path, query), requestInit);

		const response = await d2lfetch.fetch(request);
		if (!response.ok) {
			throw new Error(response.statusText);
		}

		if (extractJsonBody) {
			return response.json();
		}

		return response;
	}

	getOrgUnitId() {
		return rootStore.routingStore.orgUnitId;
	}

	listEvents({ title = '' } = {}) {
		const query = { orgUnitId: this.getOrgUnitId() };

		if (title) {
			query.title = title;
		}

		return this._fetch({
			path: '/events',
			query,
			doNotUseCache: true
		});
	}

	createEvent({
		title,
		presenter,
		description,
		startTime,
		endTime,
		status,
		enableChat,
		layoutName
	}) {
		const body = {
			title,
			presenter,
			description,
			startTime,
			endTime,
			status: status.toLowerCase(),
			enableChat,
			layoutName
		};
		return this._fetch({
			path: '/events',
			method: 'POST',
			query: {
				orgUnitId: this.getOrgUnitId()
			},
			body
		});
	}

	updateEvent({
		id,
		title,
		presenter,
		description,
		startTime,
		endTime,
		status,
		enableChat,
		layoutName
	}) {
		const body = {
			title,
			presenter,
			description,
			startTime,
			endTime,
			status: status.toLowerCase(),
			enableChat,
			layoutName
		};
		return this._fetch({
			path: `/events/${id}`,
			method: 'PUT',
			query: {
				orgUnitId: this.getOrgUnitId()
			},
			body
		});
	}

	getEvent({ id }) {
		return this._fetch({
			path: `/events/${id}`,
			query: {
				orgUnitId: this.getOrgUnitId()
			},
			doNotUseCache: true
		});
	}

	deleteEvent({ id }) {
		return this._fetch({
			path: `/events/${id}`,
			method: 'DELETE',
			query: {
				orgUnitId: this.getOrgUnitId()
			},
			extractJsonBody: false
		});
	}
}
