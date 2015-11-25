var _ = require('underscore');
var angular = require('angular');
var $ = require('jquery');

var CaptureCentralController, Folder, Presentation, PresentationService, captureCentral;

window.CaptureCentral || (window.CaptureCentral = {});

PresentationService = CaptureCentral.PresentationService;

Folder = CaptureCentral.Folder;

Presentation = CaptureCentral.Presentation;

window.CaptureCentral.CaptureCentralController = CaptureCentralController = (function () {
    function CaptureCentralController(isManager1, singleSelection, currentPresentation1, contextId1, resourceLinkId1, siteRoot1, showingPortalFilter, disallowAllFoldersSearch1) {
        this.isManager = isManager1;
        this.singleSelection = singleSelection;
        this.currentPresentation = currentPresentation1;
        this.contextId = contextId1;
        this.resourceLinkId = resourceLinkId1;
        this.siteRoot = siteRoot1;
        this.showingPortalFilter = showingPortalFilter;
        this.disallowAllFoldersSearch = disallowAllFoldersSearch1;
        this.app = angular.module('captureCentralApp', ['ui', 'ui.bootstrap', 'ngSanitize', 'd2l.filters', 'd2l.capturecentral.directives']);
        this.app.constant('CONTEXT_SETTINGS', {
            siteRoot: this.siteRoot,
            resourceLinkId: this.resourceLinkId,
            showingPortalFilter: this.showingPortalFilter,
            singleSelection: this.singleSelection
        });
        this.app.constant('ENUM_CONSTANTS', enumConstant);
        this.app.factory('Presentations', [
          '$http', 'CONTEXT_SETTINGS', function ($http, contextSettings) {
              return new PresentationService(contextSettings.siteRoot + "/1/capturecentral", contextSettings.resourceLinkId, $http);
          }
        ]);
        this.app.controller("CaptureCentralController", [
          '$scope', '$http', 'Presentations', 'CONTEXT_SETTINGS', 'ENUM_CONSTANTS', (function (_this) {
              return function ($scope, $http, Presentations, contextSettings, constants) {
                  $scope.loadingSearch = true;
                  $scope.singleSelection = _this.singleSelection;
                  $scope.filterContextId = _this.isManager ? -1 : _this.contextId;
                  $scope.isManager = _this.isManager;
                  $scope.currentPresentation = {
                      presentation: _this.singleSelection && _this.currentPresentation ? new Presentation(_this.currentPresentation) : null
                  };
                  $scope.embedCode = "";
                  $scope.previewing = _this.currentPresentation === null;
                  $scope.totalResults = 0;
                  $scope.pageSize = 10;
                  $scope.selectedFolder = 0;
                  $scope.selectedPresentationType = enumConstant.PresentationType.Archive;
                  $scope.selectedPortal = _this.singleSelection ? void 0 : 0;
                  $scope.numPages = 0;
                  $scope.currentPage = 1;
                  $scope.presentations = [];
                  $scope.lastSearchQuery = null;
                  $scope.contextId = _this.contextId;
                  $scope.currentEmbedUrl = "";
                  $scope.contextSettings = contextSettings;
                  $scope.sortBy = 'DateBegin';
                  $scope.sortOrder = enumConstant.SortOrder.Descending;
                  $scope.constant = enumConstant;
                  $scope.sortOptions = {
                      'DateBegin': {
                          'type': 'date',
                          'displayName': 'Date'
                      },
                      'Name': {
                          'type': 'alphabetical',
                          'displayName': 'Title'
                      }
                  };
                  $scope.$watch('selectedPresentationType + filterContextId + sortBy + sortOrder', function () {
                      return $scope.newSearch();
                  });
                  $scope.$watch('currentPage', function () {
                      return $scope.search();
                  });
                  $scope.$watch('selectedFolder', function () {
                      return $scope.folderPasswordIncorrect = false;
                  });
                  $scope.$watch('currentPresentation.presentation', function () {
                      var currentPresentation;
                      currentPresentation = $scope.currentPresentation;
                      if (currentPresentation && currentPresentation.presentation) {
                          return currentPresentation.presentation.getEmbedUrl(Presentations).success(function (data) {
                              return $scope.currentEmbedUrl = data;
                          });
                      } else {
                          return $scope.currentEmbedUrl = "";
                      }
                  });
                  $scope.populateFolders = function () {
                      return Presentations.getFolders($scope.selectedPortal).success(function (data) {
                          var folders;
                          folders = _.map(data, function (folderData) {
                              return new Folder(folderData);
                          });
                          if (!this.disallowAllFoldersSearch) {
                              folders.unshift(Folder.all());
                              $scope.selectedFolder = 0;
                          } else {
                              $scope.selectedFolder = folders[0].data.Id;
                          }
                          $scope.folders = folders;
                          return $scope.newSearch();
                      });
                  };
                  $scope.changePortal = function () {
                      if ($scope.selectedPresentationType === enumConstant.PresentationType.Live) {
                          return $scope.newSearch();
                      } else {
                          return $scope.populateFolders();
                      }
                  };
                  $scope.newSearch = function () {
                      $scope.resetPaging();
                      return $scope.search();
                  };
                  $scope.setContextOptions = function (contextId, inclusive) {
                      $scope.filterContextId = contextId;
                      return $scope.inclusiveContext = inclusive;
                  };
                  $scope.addToContext = function (presentation, contextId) {
                      if (this.singleSelection) {
                          $scope.currentPresentation.presentation = presentation;
                          $scope.previewing = false;
                      }
                      return presentation.addToContext(Presentations, contextId);
                  };
                  $scope.removeFromContext = function (presentation, contextId) {
                      if (this.singleSelection) {
                          $scope.currentPresentation.presentation = null;
                      }
                      return presentation.removeFromContext(Presentations, contextId);
                  };
                  $scope.resetSearch = function () {
                      $scope.searchQuery = "";
                      return $scope.search();
                  };
                  $scope.backToList = function () {
                      if (this.singleSelection) {
                          $scope.removeFromContext($scope.currentPresentation.presentation, contextId);
                      } else {
                          $scope.currentPresentation.presentation = null;
                      }
                      return $scope.previewing = true;
                  };
                  $scope.getFolder = function (id) {
                      return _.find($scope.folders, function (folder) {
                          return folder.data.Id === id;
                      });
                  };
                  $scope.resetPaging = function () {
                      $scope.numPages = 0;
                      return $scope.currentPage = 1;
                  };
                  $scope.setSorting = function (sortBy, order) {
                      $scope.sortBy = sortBy;
                      return $scope.sortOrder = order;
                  };
                  $scope.getSortLabel = function (sortBy) {
                      switch (sortBy) {
                          case "DateBegin":
                              return localizationStrings.Date;
                          case "Name":
                              return localizationStrings.Title;
                      }
                  };
                  $scope.getSortOrderLabel = function (sortBy, order) {
                      if (sortBy === 'DateBegin') {
                          if (order === enumConstant.SortOrder.Ascending) {
                              return localizationStrings.OldToRecent;
                          } else {
                              return localizationStrings.RecentToOld;
                          }
                      } else {
                          if (order === enumConstant.SortOrder.Ascending) {
                              return localizationStrings.AToZ;
                          } else {
                              return localizationStrings.ZToA;
                          }
                      }
                  };
                  $scope.submitFolderPassword = function () {
                      var folder;
                      $scope.checkingFolderPassword = true;
                      folder = $scope.getFolder($scope.selectedFolder);
                      folder.authenticate(Presentations, $scope.folderPassword).success(function (data) {
                          if (data === "true") {
                              $scope.newSearch();
                          }
                          $scope.folderPasswordIncorrect = data === "false";
                          return $scope.checkingFolderPassword = false;
                      });
                      return $scope.folderPassword = "";
                  };
                  $scope.search = function () {
                      $scope.loadingSearch = true;
                      return Presentations.search($scope.searchQuery, $scope.selectedPortal, $scope.selectedPresentationType, $scope.selectedFolder, $scope.filterContextId, $scope.sortBy, $scope.sortOrder, ($scope.currentPage - 1) * $scope.pageSize, $scope.pageSize).success(function (data) {
                          $scope.lastSearchQuery = $scope.searchQuery;
                          $scope.searchResults = _.map(data.Presentations, function (presentationData) {
                              return new Presentation(presentationData);
                          });
                          if ($scope.searchResults.length > 0) {
                              $scope.embedUrl = _.first(data.Presentations).EmbedUrl;
                          }
                          $scope.totalResults = data.TotalResults;
                          $scope.numPages = Math.ceil($scope.totalResults / $scope.pageSize);
                          return $scope.loadingSearch = false;
                      });
                  };
                  return $scope.populateFolders();
              };
          })(this)
        ]);
        angular.bootstrap($("#the-capture-central"), ['captureCentralApp']);
    }

    return CaptureCentralController;

})();

captureCentral = new CaptureCentral.CaptureCentralController(isManager, contextEntryPoint === enumConstant.ContextEntryPoint.Presentation, firstPresentation, contextId, resourceLinkId, siteRoot, numPortals > 1, disallowAllFoldersSearch);
