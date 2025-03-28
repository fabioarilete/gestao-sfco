import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';
import { AppThemeProvider, SidebarProvider } from './shared/contexts';
import { Sidebar } from './shared/components';

export const App = () => {
  return (
    <AppThemeProvider>
      <SidebarProvider>
        <BrowserRouter>
          <Sidebar>
            <AppRoutes />
          </Sidebar>
        </BrowserRouter>
      </SidebarProvider>
    </AppThemeProvider>
  );
};
