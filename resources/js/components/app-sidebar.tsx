import { Link } from '@inertiajs/react';
import {
    BookOpen,
    BriefcaseBusiness,
    ClipboardList,
    Scale,
    CalendarClock,
    FileText,
    FolderGit2,
    LayoutGrid,
    Handshake,
} from 'lucide-react';
import { index as abogados } from '@/routes/abogados';
import { index as clients } from '@/routes/clients';
import { index as servicios } from '@/routes/servicios';
import { index as causas } from '@/routes/causas';
import { index as audiencias } from '@/routes/audiencias';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Panel de control',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Clientes',
        href: clients(),
        icon: Handshake,
    },
    {
        title: 'Abogados',
        href: abogados(),
        icon: BriefcaseBusiness,
    },
    {
        title: 'Servicios',
        href: servicios(),
        icon: ClipboardList,
    },
    {
        title: 'Causas',
        href: causas(),
        icon: Scale,
    },
    {
        title: 'Audiencias',
        href: audiencias(),
        icon: CalendarClock,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
