export interface CrisisResource {
  name: string;
  number: string;
  description: string;
  available: string;
}

/** South Africa focused – expand later by country */
export const CRISIS_RESOURCES: CrisisResource[] = [
  {
    name: 'SADAG Suicide Crisis Line',
    number: '0800 567 567',
    description: '24-hour helpline for anyone in emotional distress or crisis.',
    available: '24/7',
  },
  {
    name: 'SADAG Mental Health Line',
    number: '011 234 4837',
    description: 'Support, information and referrals for mental health.',
    available: '8am–8pm daily',
  },
  {
    name: 'Lifeline South Africa',
    number: '0861 322 322',
    description: 'Emotional support and crisis intervention.',
    available: '24/7',
  },
  {
    name: 'Cipla Mental Health Helpline',
    number: '0800 456 789',
    description: 'Free, confidential mental health support.',
    available: '24/7',
  },
  {
    name: 'Emergency Services',
    number: '10111',
    description: 'Police / emergency services.',
    available: '24/7',
  },
];

export const CRISIS_MESSAGE =
  'If you are in immediate danger or thinking of harming yourself, please reach out to one of these numbers now. You matter.';
