import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: {
    group: 'Settings',
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'site_name', type: 'text', required: true, defaultValue: 'BizBridge Ethiopia' },
    { name: 'tagline', type: 'text' },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'social_links',
      type: 'group',
      fields: [
        { name: 'twitter', type: 'text' },
        { name: 'linkedin', type: 'text' },
        { name: 'telegram', type: 'text' },
        { name: 'whatsapp', type: 'text' },
      ],
    },
    {
      name: 'support_email',
      type: 'email',
      defaultValue: 'support@bizbridge.et',
    },
  ],
}
