import { Link, usePage } from '@inertiajs/react';
import {
    Briefcase,
    Building2,
    ChartNoAxesCombined,
    FolderOpen,
    LayoutDashboard,
    Plus,
    ReceiptText,
    Settings2,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { dashboard } from '@/routes';
import { index as categoriesIndex } from '@/routes/categories';
import { edit as financeSettings } from '@/routes/finance-settings';
import { index as organizationsIndex } from '@/routes/organizations';
import { index as statisticsIndex } from '@/routes/statistics';
import {
    create as createTransaction,
    index as transactionsIndex,
} from '@/routes/transactions';
import type { NavItem } from '@/types';

const personalNavItems: NavItem[] = [
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

type SharedOrg = { id: number; name: string; slug: string };

export function AppSidebar() {
    const { isCurrentUrl } = useCurrentUrl();
    const page = usePage();
    const organizations =
        (page.props.organizations as SharedOrg[] | undefined) || [];

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
                {/* 1. PERSONAL SECTION - Fully separated */}
                <NavMain items={personalNavItems} label="Personal Finance" />

                {/* 2. ORGANIZATIONS SECTION */}
                <SidebarGroup className="mt-3 px-2 py-0">
                    <SidebarGroupLabel className="flex items-center justify-between">
                        <span>Organizations</span>
                        <Link
                            href={organizationsIndex()}
                            className="text-[11px] font-normal text-muted-foreground hover:text-foreground"
                        >
                            View All
                        </Link>
                    </SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                isActive={isCurrentUrl(organizationsIndex())}
                                tooltip={{ children: 'Organizations Hub' }}
                            >
                                <Link href={organizationsIndex()} prefetch>
                                    <Building2 />
                                    <span>Organizations Hub</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        {/* Listed Joined Orgs */}
                        {organizations.map((org) => {
                            const orgUrl = `/organizations/${org.slug}`;
                            const isOrgActive = isCurrentUrl(orgUrl);

                            return (
                                <SidebarMenuItem key={org.id}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isOrgActive}
                                        tooltip={{ children: org.name }}
                                    >
                                        <Link href={orgUrl} prefetch>
                                            <Briefcase />
                                            <span className="truncate">
                                                {org.name}
                                            </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
