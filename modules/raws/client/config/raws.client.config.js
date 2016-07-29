(function () {
  'use strict';

  angular
    .module('raws')
    .run(menuConfig)
    .constant('appInformation', {
      view: '/home'
    });

  menuConfig.$inject = ['sideNavs'];

  function menuConfig(sideNavs, appStore) {
    /****************************
     * Globals vars
     */
    var _app = {
      name: 'Soos',
      version: '1.0.0',
      view : 'home', // app view, tiers, tiersWallet, home
      state: 'soos', //link route
      icon: 'fa-first-order', //https://fortawesome.github.io/Font-Awesome/
      color: '#d35400', //https://flatuicolors.com/ (sideNav)
      fontColor: '#fff', //https://flatuicolors.com/ (sideNav)
      position: 1, //default 1
      roles: ['*']
    };
    /**
     * Side Bar left
    */
    sideNavs.addSideNavItem('sidebar', {
      title: _app.name,
      icon: _app.icon,
      color: _app.color,
      fontColor: _app.fontColor,
      state: _app.state,
      view: _app.view,
      roles: _app.roles,
      position: _app.position
    });
  }
}());
