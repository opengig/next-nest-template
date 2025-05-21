import * as React from 'react';
import { LogOut, LucideProps } from 'lucide-react';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarRail,
	SidebarTrigger,
	useSidebar,
} from '@/components/ui/sidebar';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { NavUser } from './NavUser';

export type SidebarRoute = {
	name: string;
	url: string;
	isAdmin: boolean;
	icon: React.ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>>;
};

export default function AppSidebar({ children, pages }: { children: React.ReactNode; pages: SidebarRoute[] }) {
	const [isOpen, setIsOpen] = React.useState(false);
	return (
		<SidebarProvider open={isOpen} onOpenChange={setIsOpen}>
			<SidebarComponent pages={pages}>{children}</SidebarComponent>
		</SidebarProvider>
	);
}

function SidebarComponent({ children, pages }: { children: React.ReactNode; pages: SidebarRoute[] }) {
	const { setOpenMobile } = useSidebar();
	const { data: session } = useSession();
	const user = session?.user;

	return (
		<>
			<Sidebar collapsible='icon'>
				<SidebarHeader>
					<NavUser
						user={{
							avatar: user?.avatarUrl ?? '',
							name: user?.name ?? '',
							email: user?.email ?? '',
						}}
					/>
				</SidebarHeader>
				<SidebarContent>
					<SidebarMenu>
						<SidebarGroup className='gap-3'>
							{pages.map((item) => (
								<SidebarMenuItem key={item.name}>
									<SidebarMenuButton asChild>
										<Link href={item.url} onClick={() => setOpenMobile(false)} className='gap-3'>
											<item.icon className='h-6!' />
											<span>{item.name}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarGroup>
					</SidebarMenu>
				</SidebarContent>
				<SidebarFooter>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton
								onClick={async () => {
									signOut();
								}}
							>
								<LogOut size={25} />
								<span>Logout</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarFooter>
				<SidebarRail />
			</Sidebar>
			<SidebarInset className='h-dvh overflow-hidden'>
				<header className='sticky top-0 flex h-12 w-full shrink-0 items-center justify-between gap-2 pr-6 transition-[width,height] ease-linear'>
					<div className='flex items-center gap-2 px-4'>
						<SidebarTrigger className='-ml-1' />
					</div>
					<ThemeToggle />
				</header>
				<div className='bg-background h-[calc(100dvh-48px)] w-full overflow-auto px-3 py-0'>{children}</div>
			</SidebarInset>
		</>
	);
}
