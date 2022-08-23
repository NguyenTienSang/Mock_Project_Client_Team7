import { CoreMenu } from '@core/types';

let currentUser = JSON.parse(localStorage.getItem("currentUser"));
// const currentUser = JSON.parse(localStorage.getItem("currentUser")).user.role;

if(currentUser != null)
{
  currentUser = currentUser.user.role;
}


export const menu: CoreMenu[] = currentUser == 'User' ? [
  // Apps & Pages
  {
    id: 'apps',
    type: 'section',
    title: 'Apps & Pages',
    translate: 'MENU.APPS.SECTION',
    icon: 'package',
    children:
    [
      {
        id: 'e-commerce',
        title: 'E-commerce',
        translate: 'MENU.APPS.ECOMMERCE.COLLAPSIBLE',
        type: 'collapsible',
        icon: 'shopping-cart',
        children:  [
          {
            id: 'shop',
            title: 'Shop',
            translate: 'MENU.APPS.ECOMMERCE.SHOP',
            type: 'item',
            icon: 'circle',
            url: 'apps/e-commerce/shop'
          },

          {
            id: 'wishList',
            title: 'WishList',
            translate: 'MENU.APPS.ECOMMERCE.WISHLIST',
            type: 'item',
            icon: 'circle',
            url: 'apps/e-commerce/wishlist'
          },
        ]
      }
    ]
  },
]
 : [
  {
    id: 'apps',
    type: 'section',
    title: 'Apps & Pages',
    translate: 'MENU.APPS.SECTION',
    icon: 'package',
    children: currentUser == 'Mod' ?
    [
      {
        id: 'e-commerce',
        title: 'E-commerce',
        translate: 'MENU.APPS.ECOMMERCE.COLLAPSIBLE',
        type: 'collapsible',
        icon: 'shopping-cart',
        children: [
          {
            id: 'shop',
            title: 'Shop',
            translate: 'MENU.APPS.ECOMMERCE.SHOP',
            type: 'item',
            icon: 'circle',
            url: 'apps/e-commerce/shop'
          },
          {
            id: 'wishList',
            title: 'WishList',
            translate: 'MENU.APPS.ECOMMERCE.WISHLIST',
            type: 'item',
            icon: 'circle',
            url: 'apps/e-commerce/wishlist'
          },
          {
            id: 'Manager',
            title: 'Manager',
            translate: 'MENU.APPS.ECOMMERCE.MANAGER',
            type: 'item',
            icon: 'circle',
            url: 'apps/e-commerce/manager'
          },
          {
            id: 'delete',
            title: 'List Product Deleted',
            translate: 'MENU.APPS.ECOMMERCE.DELETE',
            type: 'item',
            icon: 'circle',
            url: 'apps/e-commerce/product-delete'
          }
        ]
      },
      {
        id: 'category',
        title: 'Category',
        translate: 'MENU.APPS.ECOMMERCE.COLLAPSIBLE',
        type: 'collapsible',
        icon: 'shopping-cart',
        children: [
          {
            id: 'list',
            title: 'List',
            translate: 'MENU.APPS.ECOMMERCE.SHOP',
            type: 'item',
            icon: 'circle',
            url: 'apps/category/manager'
          },
        ]
      },
      {
        id:'voucher',
        title: 'Voucher',
        translate: 'MENU.APPS.ECOMMERCE.COLLAPSIBLE',
        type: 'collapsible',
        icon: 'shopping-cart',
        children: [
          {
            id: 'list',
            title: 'List',
            translate: 'MENU.APPS.ECOMMERCE.SHOP',
            type: 'item',
            icon: 'circle',
            url: 'apps/voucher/manager'
          },
        ]
      },
      {
        id: 'brand',
        title: 'Brand',
        translate: 'MENU.APPS.ECOMMERCE.COLLAPSIBLE',
        type: 'collapsible',
        icon: 'shopping-cart',
        children: [
          {
            id: 'list',
            title: 'List',
            translate: 'MENU.APPS.ECOMMERCE.SHOP',
            type: 'item',
            icon: 'circle',
            url: 'apps/brand/manager'
          },
        ]
      },
      {
        id: 'order',
        title: 'Order',
        translate: 'MENU.APPS.ECOMMERCE.COLLAPSIBLE',
        type: 'collapsible',
        icon: 'truck',
        children: [
          {
            id: 'list',
            title: 'Manage Order',
            translate: 'MENU.APPS.ECOMMERCE.SHOP',
            type: 'item',
            icon: 'circle',
            url: '/apps/order-management/manager'
          },
        ]
      },
    ]
    :
    [
      {
        id: 'e-commerce',
        title: 'E-commerce',
        translate: 'MENU.APPS.ECOMMERCE.COLLAPSIBLE',
        type: 'collapsible',
        icon: 'shopping-cart',
        children: [
          {
            id: 'shop',
            title: 'Shop',
            translate: 'MENU.APPS.ECOMMERCE.SHOP',
            type: 'item',
            icon: 'circle',
            url: 'apps/e-commerce/shop'
          },

          {
            id: 'wishList',
            title: 'WishList',
            translate: 'MENU.APPS.ECOMMERCE.WISHLIST',
            type: 'item',
            icon: 'circle',
            url: 'apps/e-commerce/wishlist'
          },
          {
            id: 'Manager',
            title: 'Manager',
            translate: 'MENU.APPS.ECOMMERCE.MANAGER',
            type: 'item',
            icon: 'circle',
            url: 'apps/e-commerce/manager'
          },
          {
            id: 'delete',
            title: 'List Product Deleted',
            translate: 'MENU.APPS.ECOMMERCE.DELETE',
            type: 'item',
            icon: 'circle',
            url: 'apps/e-commerce/product-delete'
          }
        ]
      },
      {
        id: 'users',
        title: 'User',
        translate: 'MENU.APPS.USER.COLLAPSIBLE',
        type: 'collapsible',
        icon: 'user',
        children: [
          {
            id: 'list',
            title: 'List',
            translate: 'MENU.APPS.USER.LIST',
            type: 'item',
            icon: 'circle',
            url: 'apps/user/user-list'
          },
          {
            id: 'delete',
            title: 'List User Deleted',
            translate: 'MENU.APPS.USER.DELETE',
            type: 'item',
            icon: 'circle',
            url: 'apps/user/user-delete'
          }
        ]
      },
      {
        id: 'category',
        title: 'Category',
        translate: 'MENU.APPS.ECOMMERCE.COLLAPSIBLE',
        type: 'collapsible',
        icon: 'shopping-cart',
        children: [
          {
            id: 'list',
            title: 'List',
            translate: 'MENU.APPS.ECOMMERCE.SHOP',
            type: 'item',
            icon: 'circle',
            url: 'apps/category/manager'
          },
        ]
      },
      {
        id: 'brand',
        title: 'Brand',
        translate: 'MENU.APPS.ECOMMERCE.COLLAPSIBLE',
        type: 'collapsible',
        icon: 'shopping-cart',
        children: [
          {
            id: 'list',
            title: 'List',
            translate: 'MENU.APPS.ECOMMERCE.SHOP',
            type: 'item',
            icon: 'circle',
            url: 'apps/brand/manager'
          },
        ]
      },
      {
        id: 'order',
        title: 'Order',
        translate: 'MENU.APPS.ECOMMERCE.COLLAPSIBLE',
        type: 'collapsible',
        icon: 'truck',
        children: [
          {
            id: 'list',
            title: 'Manage Order',
            translate: 'MENU.APPS.ECOMMERCE.SHOP',
            type: 'item',
            icon: 'circle',
            url: '/apps/order-management/manager'
          },
        ]
      },
      {
        id:'voucher',
        title: 'Voucher',
        translate: 'MENU.APPS.ECOMMERCE.COLLAPSIBLE',
        type: 'collapsible',
        icon: 'shopping-cart',
        children: [
          {
            id: 'manager',
            title: 'Manager',
            translate: 'MENU.APPS.ECOMMERCE.SHOP',
            type: 'item',
            icon: 'circle',
            url: 'apps/voucher/manager'
          },
        ]
      },
    ]
  },
];
