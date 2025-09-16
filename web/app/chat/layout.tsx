import { ChatSidebar } from '@/components/ChatSidebar';
import SidebarHeader from '@/components/SidebarHeader';
import { SidebarInset } from '@/components/ui/sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <ChatSidebar />
      <SidebarInset>
        <SidebarHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
