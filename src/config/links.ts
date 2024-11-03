import {
  IconAdjustmentsCog,
  IconBuildingPavilion,
  IconBuildingSkyscraper,
  IconBuildingStore,
  IconHomeCog,
  IconLayoutDashboard,
  IconMap2,
  IconPinnedFilled,
  IconSettings,
  IconTools,
  IconToolsKitchen,
  IconUsers,
  IconProps,
} from '@tabler/icons-react';

interface ILink {
  name: string;
  url: string;
  Icon?: React.ComponentType<IconProps>;
  isEnabled?: boolean;
  isAdminPage?: boolean;
  links?: ILink[];
}

export const links: ILink[] = [
  {
    name: 'Dashboard',
    url: '/root/dashboard',
    isEnabled: true,
    Icon: IconLayoutDashboard,
  },
  // TENNAT ADMIN
  {
    name: 'Town Admin',
    url: '#Tenant',
    Icon: IconBuildingPavilion,
    links: [
      {
        name: 'Places',
        url: '/places',
        Icon: IconMap2,
      },
      {
        name: 'Hotels',
        url: '/hotels',
        Icon: IconBuildingSkyscraper,
      },
      {
        name: 'Shops',
        url: '/shops',
        Icon: IconBuildingStore,
      },
      {
        name: 'Restaurants',
        url: '/restaurants',
        Icon: IconToolsKitchen,
      },
      {
        name: 'Town Info',
        url: '/town-info',
        Icon: IconHomeCog,
      },
    ],
  },
  // PLATFORM ADMIN
  {
    name: 'Platform Admin',
    url: '#Admin',
    Icon: IconAdjustmentsCog,
    links: [
      {
        name: 'Users',
        url: '/admin/users',
        Icon: IconUsers,
      },
      {
        name: 'Tenants',
        url: '/admin/tenants',
        Icon: IconHomeCog,
        isEnabled: true,
        isAdminPage: true,
      },
      {
        name: 'Categories',
        url: '/admin/categories',
        Icon: IconSettings,
      },
    ],
  },
  {
    name: 'Maestros',
    url: '/masters',
    Icon: IconPinnedFilled,
    links: [
      {
        name: 'Materiales',
        url: '/masters/materials',
        isEnabled: true,
        Icon: IconTools,
      },
      {
        name: 'Herramientas',
        url: '/masters/tools',
        Icon: IconTools,
      },
    ],
  },
];
