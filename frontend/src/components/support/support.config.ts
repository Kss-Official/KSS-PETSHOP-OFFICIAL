export interface QuickReplyChip {
  id: string;
  label: string;
  message: string;
  isEmergency?: boolean;
}

export const SUPPORT_CONFIG = {
  // International format, no + or spaces
  WHATSAPP_NUMBER: '919876543210',
  DEFAULT_MESSAGE: 'Hi Pawfectly! I need help with my pet.',
  SUPPORT_HOURS: 'Replies in a few mins • 9 AM - 9 PM',
  SUPPORT_EMAIL: 'support@pawfectly.com',
  EMERGENCY_NUMBER: '+911800123456',
  
  // Routes where the support floating button is hidden (e.g. checkout, login)
  HIDDEN_ROUTES: ['/checkout', '/login', '/signup', '/admin'],
  
  QUICK_REPLIES: [
    {
      id: 'vet',
      label: 'Book a vet',
      message: 'Hi Pawfectly! I would like to book a veterinarian appointment for my pet.',
    },
    {
      id: 'order',
      label: 'Track my order',
      message: 'Hi Pawfectly! I would like to check the status of my order.',
    },
    {
      id: 'product',
      label: 'Product help',
      message: 'Hi Pawfectly! I need guidance on choosing pet food & essentials.',
    },
    {
      id: 'emergency',
      label: 'Emergency',
      message: 'URGENT: I need emergency medical assistance for my pet right away.',
      isEmergency: true,
    },
  ] as QuickReplyChip[],
};
