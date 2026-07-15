import type { GlobalConfig } from 'payload'

export const HomepageContent: GlobalConfig = {
  slug: 'homepage-content',
  admin: {
    group: 'Settings',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text' },
        { name: 'headline', type: 'text', required: true },
        { name: 'subhead', type: 'textarea' },
        { name: 'primary_cta_label', type: 'text', defaultValue: 'Explore sectors' },
        { name: 'primary_cta_href', type: 'text', defaultValue: '/sectors' },
        { name: 'secondary_cta_label', type: 'text', defaultValue: 'See pricing' },
        { name: 'secondary_cta_href', type: 'text', defaultValue: '/pricing' },
      ],
    },
    {
      name: 'stats',
      type: 'array',
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
      ],
    },
    {
      name: 'testimonials',
      type: 'array',
      fields: [
        { name: 'quote', type: 'textarea', required: true },
        { name: 'author', type: 'text', required: true },
        { name: 'role', type: 'text' },
      ],
    },
  ],
}
