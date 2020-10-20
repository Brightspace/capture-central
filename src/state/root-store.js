import { PermissionStore } from './permission-store.js';
import { RoutingStore } from './routing-store.js';
import { Uploader } from './uploader.js';

export class RootStore {
	constructor() {
		this.routingStore = new RoutingStore(this);
		this.uploader = new Uploader({ apiClient: {} });
		this.permissionStore = new PermissionStore(this);
		this.orgUnitId = 0;
		this.appTop = 0;
	}
}

export const rootStore = new RootStore();
