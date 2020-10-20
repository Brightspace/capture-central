import { action, decorate, observable } from 'mobx';

export class PermissionStore {
	constructor(rootStore) {
		this.rootStore = rootStore;

		this.permissions = {};
	}

	setPermissions(permissions) {
		this.permissions = permissions;
	}

	getPermissions() {
		return this.permissions;
	}

	getCanViewLiveEvents() {
		return this.permissions.canAccessCaptureCentral === 'true' &&
			this.permissions.canViewLiveEvents === 'true';
	}

	getCanManageLiveEvents() {
		return this.permissions.canAccessCaptureCentral === 'true' &&
			this.permissions.canManageLiveEvents === 'true';
	}
}

decorate(PermissionStore, {
	// props
	permissions: observable,
	// actions
	setPermissions: action,
});
