import { Link } from '@inertiajs/react';
import { ChartNoAxesCombined, FolderOpen, LayoutDashboard, Plus, ReceiptText, Settings2 } from 'lucide-react';
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
import { create as createTransaction, index as transactionsIndex } from '@/routes/transactions';
import { index as categoriesIndex } from '@/routes/categories';
import { index as statisticsIndex } from '@/routes/statistics';
import { edit as financeSettings } from '@/routes/finance-settings';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutDashboard,
    },
    {
        title: 'Add Transaction',
        href: createTransaction(),
        icon: Plus,
    },
    {
        title: 'Transaction History',
        href: transactionsIndex(),
        icon: ReceiptText,
    },
    {
        title: 'Categories',
        href: categoriesIndex(),
        icon: FolderOpen,
    },
    {
        title: 'Statistics',
        href: statisticsIndex(),
        icon: ChartNoAxesCombined,
    },
    {
        title: 'Settings',
        href: financeSettings(),
        icon: Settings2,
    },
];

const footerNavItems: NavItem[] = [];

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
