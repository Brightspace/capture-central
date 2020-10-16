import * as querystring from '@chaitin/querystring';
import auth from 'd2l-fetch-auth/src/unframed/index.js';
import { d2lfetch } from 'd2l-fetch/src/index.js';
import { rootStore } from '../state/root-store.js';

d2lfetch.use({ name: 'auth', fn: auth });

export default class UserBrightspaceClient {
	constructor() {
		this.endpoint = window.location.origin;
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
		headers = new Headers()
	}) {
		if (body) {
			headers.append('Content-Type', 'application/json');
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

	getPermissions() {
		const headers = new Headers();
		headers.append('pragma', 'no-cache');
		headers.append('cache-control', 'no-cache');

		return this._fetch({
			path: `/d2l/api/le/1.48/wcs/permissions/${this.getOrgUnitId()}`,
			headers
		});
	}
}
