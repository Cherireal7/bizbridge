import type { GlobalConfig } from 'payload'

export const PricingConfig: GlobalConfig = {
  slug: 'pricing-config',
  admin: {
    group: 'Settings',
    description: 'One-time tier prices and FX rate. Editable without redeploy.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'one_time',
      type: 'group',
      label: 'One-time tier prices',
      fields: [
        {
          name: 'standard',
          type: 'group',
          fields: [
            { name: 'usd', type: 'number', required: true, defaultValue: 29 },
            { name: 'etb', type: 'number', required: true, defaultValue: 1600 },
            { name: 'label', type: 'text', defaultValue: 'Standard' },
          ],
        },
        {
          name: 'pro',
          type: 'group',
          fields: [
            { name: 'usd', type: 'number', required: true, defaultValue: 149 },
            { name: 'etb', type: 'number', required: true, defaultValue: 8400 },
            { name: 'label', type: 'text', defaultValue: 'Pro' },
          ],
        },
      ],
    },
    {
      name: 'reports_default',
      type: 'group',
      fields: [
        { name: 'min_usd', type: 'number', defaultValue: 15 },
        { name: 'max_usd', type: 'number', defaultValue: 99 },
      ],
    },
    {
      name: 'fx_rate_birr_per_usd',
      type: 'number',
      defaultValue: 56,
      admin: { description: 'Used by cost calculator and price conversions.' },
    },
    {
      name: 'payment_methods',
      type: 'group',
      label: 'Payment methods (display on checkout)',
      fields: [
        { name: 'chapa_enabled', type: 'checkbox', defaultValue: true, label: 'Chapa (ETB)' },
        { name: 'telebirr_enabled', type: 'checkbox', defaultValue: true, label: 'TeleBirr (ETB)' },
        { name: 'bank_transfer_enabled', type: 'checkbox', defaultValue: true, label: 'Bank transfer / Remitly (USD)' },
        {
          name: 'bank_details',
          type: 'group',
          fields: [
            { name: 'bank_name', type: 'text' },
            { name: 'account_name', type: 'text' },
            { name: 'account_number', type: 'text' },
            { name: 'swift', type: 'text' },
            { name: 'instructions', type: 'textarea' },
          ],
        },
      ],
    },
  ],
}
