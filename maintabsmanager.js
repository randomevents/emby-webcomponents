﻿define(['emby-tabs', 'emby-button', 'emby-linkbutton'], function () {
    'use strict';

    var tabOwnerView;
    var queryScope = document.querySelector('.skinHeader');
    var footerTabsContainer;
    var headerTabsContainer;
    var tabsElem;

    function enableTabsInFooter() {
        return false;
    }

    function getTabsContainerElem() {
    }

    function ensureElements(enableInFooter) {

        if (enableInFooter) {
            if (!footerTabsContainer) {
                footerTabsContainer = document.createElement('div');
                footerTabsContainer.classList.add('footerTabs');
                footerTabsContainer.classList.add('sectionTabs');
                footerTabsContainer.classList.add('hide');
                //appFooter.add(footerTabsContainer);
            }
        }

        if (!headerTabsContainer) {
            headerTabsContainer = queryScope.querySelector('.headerTabs');
        }
    }

    function onViewTabsReady() {
        this.triggerBeforeTabChange();
    }

    function setTabs(view, selectedIndex, getTabsFn, getTabContainersFn, onBeforeTabChange, onTabChange) {

        var enableInFooter = enableTabsInFooter();

        if (!view) {
            if (tabOwnerView) {

                if (!headerTabsContainer) {
                    headerTabsContainer = queryScope.querySelector('.headerTabs');
                }

                ensureElements(enableInFooter);

                document.body.classList.remove('withSectionTabs');

                headerTabsContainer.innerHTML = '';
                headerTabsContainer.classList.add('hide');

                if (footerTabsContainer) {
                    footerTabsContainer.innerHTML = '';
                    footerTabsContainer.classList.add('hide');
                }

                tabOwnerView = null;
            }
            return {
                tabsContainer: headerTabsContainer,
                replaced: false
            };
        }

        ensureElements(enableInFooter);

        var tabsContainerElem = enableInFooter ? footerTabsContainer : headerTabsContainer;

        if (!tabOwnerView) {
            tabsContainerElem.classList.remove('hide');
        }

        if (tabOwnerView !== view) {

            var index = 0;

            var indexAttribute = selectedIndex == null ? '' : (' data-index="' + selectedIndex + '"');
            var tabsHtml = '<div is="emby-tabs"' + indexAttribute + ' class="tabs-viewmenubar"><div class="emby-tabs-slider" style="white-space:nowrap;">' + getTabsFn().map(function (t) {

                var tabClass = 'emby-tab-button';

                if (t.enabled === false) {
                    tabClass += ' hide';
                }

                var tabHtml;

                if (t.href) {
                    tabHtml = '<a href="' + t.href + '" is="emby-linkbutton" class="' + tabClass + '" data-index="' + index + '"><div class="emby-button-foreground">' + t.name + '</div></a>';
                } else {
                    tabHtml = '<button type="button" is="emby-button" class="' + tabClass + '" data-index="' + index + '"><div class="emby-button-foreground">' + t.name + '</div></button>';
                }

                index++;
                return tabHtml;

            }).join('') + '</div></div>';

            tabsContainerElem.innerHTML = tabsHtml;

            document.body.classList.add('withSectionTabs');
            tabOwnerView = view;

            tabsElem = tabsContainerElem.querySelector('[is="emby-tabs"]');

            tabsElem.addEventListener('beforetabchange', function (e) {

                var tabContainers = getTabContainersFn();
                if (e.detail.previousIndex != null) {
                    tabContainers[e.detail.previousIndex].classList.remove('is-active');
                }

                var newPanel = tabContainers[e.detail.selectedTabIndex];

                //if (e.detail.previousIndex != null && e.detail.previousIndex != e.detail.selectedTabIndex) {
                //    if (newPanel.animate && (animateTabs || []).indexOf(e.detail.selectedTabIndex) != -1) {
                //        fadeInRight(newPanel);
                //    }
                //}

                newPanel.classList.add('is-active');
            });

            if (onBeforeTabChange) {
                tabsElem.addEventListener('beforetabchange', onBeforeTabChange);
            }
            if (onTabChange) {
                tabsElem.addEventListener('tabchange', onTabChange);
            }

            if (!tabsElem.triggerBeforeTabChange) {
                //tabsElem.addEventListener('ready', onViewTabsReady);
            }

            //if (enableSwipe !== false) {
            //    libraryBrowser.configureSwipeTabs(ownerpage, tabs);
            //}

            return {
                tabsContainer: tabsContainerElem,
                tabs: tabsContainerElem.querySelector('[is="emby-tabs"]'),
                replaced: true
            };
        }

        if (!tabsElem) {
            tabsElem = tabsContainerElem.querySelector('[is="emby-tabs"]');
        }

        tabsElem.selectedIndex(selectedIndex);

        tabOwnerView = view;
        return {
            tabsContainer: tabsContainerElem,
            tabs: tabsElem,
            replaced: false
        };
    }

    function selectedTabIndex(index) {

        var tabsContainerElem = headerTabsContainer;

        if (!tabsElem) {
            tabsElem = tabsContainerElem.querySelector('[is="emby-tabs"]');
        }

        if (index != null) {
            tabsElem.selectedIndex(index);
        } else {
            tabsElem.triggerTabChange();
        }
    }

    function getTabsElement() {
        return document.querySelector('.tabs-viewmenubar');
    }

    return {
        setTabs: setTabs,
        getTabsElement: getTabsElement,
        selectedTabIndex: selectedTabIndex
    };
});