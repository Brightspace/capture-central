var _ = require('underscore');
var $ = require('jquery');

var Folder, Presentation, PresentationService;

window.CaptureCentral || (window.CaptureCentral = {});

window.CaptureCentral.PresentationService = PresentationService = (function () {
    var HTTPMethod;

    HTTPMethod = {
        Post: "POST",
        Get: "GET"
    };

    function PresentationService(baseUrl, resourceLinkId, http) {
        this.baseUrl = baseUrl;
        this.resourceLinkId = resourceLinkId;
        this.http = http;
    }

    PresentationService.prototype.authenticateForFolder = function (folder, password) {
        return this.callHttp("authenticateForFolder", HTTPMethod.Post, {
            password: password,
            folderId: folder.data.Id,
            resourceLinkId: this.resourceLinkId
        });
    };

    PresentationService.prototype.getEmbedUrl = function (presentation) {
        return this.callHttp("getEmbedUrl", HTTPMethod.Post, {
            type: presentation.data.Type,
            eventId: presentation.data.Id,
            resourceLinkId: this.resourceLinkId
        });
    };

    PresentationService.prototype.search = function (query, communityId, presentationType, selectedFolder, contextId, sortBy, sortOrder, firstResult, maxResults) {
        return this.callHttp("search", HTTPMethod.Post, {
            query: query,
            communityId: communityId,
            resourceLinkId: this.resourceLinkId,
            type: presentationType,
            folderId: selectedFolder,
            contextId: contextId,
            sortBy: sortBy,
            sortOrder: sortOrder,
            firstResult: firstResult,
            maxResults: maxResults
        });
    };

    PresentationService.prototype.getFolders = function (communityId) {
        return this.callHttp("getFolders", HTTPMethod.Post, {
            communityId: communityId,
            resourceLinkId: this.resourceLinkId
        });
    };

    PresentationService.prototype.addToContext = function (presentation) {
        return this.callHttp("addToCurrentContext", HTTPMethod.Post, {
            type: presentation.data.Type,
            eventId: presentation.data.Id,
            resourceLinkId: this.resourceLinkId
        });
    };

    PresentationService.prototype.removeFromContext = function (presentation) {
        return this.callHttp("removeFromCurrentContext", HTTPMethod.Post, {
            type: presentation.data.Type,
            eventId: presentation.data.Id,
            resourceLinkId: this.resourceLinkId
        });
    };

    PresentationService.prototype.callHttp = function (action, method, params) {
        if (method === HTTPMethod.Post) {
            return this.http({
                url: this.baseUrl + "/" + action + ".aspx",
                method: method,
                data: $.param(params),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
        } else {
            return this.http.get(this.baseUrl + "/" + action + ".aspx", {
                params: params
            });
        }
    };

    return PresentationService;

})();

window.CaptureCentral.Folder = Folder = (function () {
    function Folder(data1) {
        this.data = data1;
    }

    Folder.prototype.getDisplayName = function (showPortalName) {
        var name;
        name = this.data.Name;
        if (showPortalName && this.data.CommunityName) {
            name = name + " (" + this.data.CommunityName + ")";
        }
        return name + (!this.data.AuthenticatedForLti ? " - " + localizationStrings.PasswordRequired : "");
    };

    Folder.prototype.isAuthenticated = function () {
        return this.data.AuthenticatedForLti;
    };

    Folder.prototype.authenticate = function (presentationService, password) {
        return presentationService.authenticateForFolder(this, password).success((function (_this) {
            return function (data) {
                if (data === "true") {
                    return _this.data.AuthenticatedForLti = true;
                }
            };
        })(this));
    };

    Folder.all = function () {
        return new Folder({
            Name: localizationStrings.AllFolders,
            Id: 0,
            AuthenticatedForLti: true
        });
    };

    return Folder;

})();

window.CaptureCentral.Presentation = Presentation = (function () {
    function Presentation(data1) {
        this.data = data1;
    }

    Presentation.prototype.inContext = function (contextId) {
        return _.contains(this.data.ExternalContextIds, contextId);
    };

    Presentation.prototype.getEmbedUrl = function (presentationService) {
        return presentationService.getEmbedUrl(this);
    };

    Presentation.prototype.hasAttachments = function () {
        return this.data.Attachments && this.data.Attachments.length > 0;
    };

    Presentation.prototype.addToContext = function (presentationService, contextId) {
        presentationService.addToContext(this);
        if (!this.inContext(contextId)) {
            return this.data.ExternalContextIds.push(contextId);
        }
    };

    Presentation.prototype.removeFromContext = function (presentationService, contextId) {
        presentationService.removeFromContext(this);
        if (this.inContext(contextId)) {
            return this.data.ExternalContextIds.splice(_.indexOf(this.data.ExternalContextIds, contextId), 1);
        }
    };

    Presentation.prototype.getDisplayStatus = function () {
        if (this.data.Status === enumConstant.Availability.Current) {
            return localizationStrings.Live;
        } else {
            return "";
        }
    };

    return Presentation;

})();
