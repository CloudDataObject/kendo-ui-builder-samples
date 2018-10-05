///////////////////
// Auto-generated
// Do not edit!!!
///////////////////
function routing($stateProvider) {
    $stateProvider
        .state('module.default.inventory.itemsGrid', {
            url: '/items-grid',
            templateProvider: [() => require.ensure([], (require) => require('./template.html'))],
            controller: 'InventoryItemsGridCtrl',
            controllerAs: 'vm',
            authorization: {
                allowedRoles: []
            },
            data: {
                providers: ["Sports"]
            },
            resolve: {
                stateData: ['$ocLazyLoad', '$injector', '$stateParams', ($ocLazyLoad, $injector, $stateParams) => {
                    return require.ensure([], (require) => {
                            let module = require('./index.js');

                            return $ocLazyLoad.load({
                                name: 'views.inventory.items-grid'
                            });
                        })
                        .then((module) => $injector.get('inventoryItemsGrid')['onInit']($stateParams));
                }]
            },
            onExit: ['$injector', 'stateData', function($injector, stateData) {
                $injector.get('inventoryItemsGrid')['onHide'](stateData);
            }]
        });
}

export default routing;