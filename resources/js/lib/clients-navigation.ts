import { index as clients } from '@/routes/clients';
import { FileText } from 'lucide-react';

export const clientsNavItems = [
    {
        title: 'Clients',
        href: clients(),
        icon: FileText,
    },
];
