import {
  Avatar,
  Box,
  Divider,
  Drawer,
  Icon,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import foto from '../../img/madruga.png';
import { UseAppThemeContext, useSidebarContext } from '../../contexts';
import { useMatch, useNavigate, useResolvedPath } from 'react-router-dom';

interface ISidebarProps {
  children: React.ReactNode;
}

interface IListItemLinkProps {
  label: string;
  icon: string;
  to: string;
  onClick: (() => void) | undefined;
}

const ListItemLink: React.FC<IListItemLinkProps> = ({ to, label, icon, onClick }) => {
  const navigate = useNavigate();

  const resolvePath = useResolvedPath(to);
  const match = useMatch({ path: resolvePath.pathname, end: false });

  const handleClick = () => {
    navigate(to);
    onClick?.();
  };

  return (
    <ListItemButton selected={!!match} onClick={handleClick}>
      <ListItemIcon>
        <Icon>{icon}</Icon>
      </ListItemIcon>
      <ListItemText primary={label} />
    </ListItemButton>
  );
};

export const Sidebar: React.FC<ISidebarProps> = ({ children }) => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  const { isSidebarOpen, toggleSidebarOpen, sidebarOptions } = useSidebarContext();

  const { toggleTheme } = UseAppThemeContext();

  return (
    <>
      <Drawer
        open={isSidebarOpen}
        onClose={toggleSidebarOpen}
        variant={smDown ? 'temporary' : 'permanent'}
      >
        <Box width={theme.spacing(28)} height="100%" display="flex" flexDirection="column">
          <Box
            width="100%"
            height={theme.spacing(20)}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Avatar sx={{ width: theme.spacing(12), height: theme.spacing(12) }} src={foto} />
          </Box>
          <Divider />
          <Box flex={1}>
            <List component="nav">
              {sidebarOptions.map(sidebarOption => (
                <ListItemLink
                  to={sidebarOption.path}
                  key={sidebarOption.path}
                  icon={sidebarOption.icon}
                  label={sidebarOption.label}
                  onClick={smDown ? toggleSidebarOpen : undefined}
                />
              ))}
            </List>
          </Box>
          <Box>
            <List component="nav">
              <ListItemButton onClick={toggleTheme}>
                <ListItemIcon>
                  <Icon>dark_mode</Icon>
                </ListItemIcon>
                <ListItemText primary="Alternar Tema" />
              </ListItemButton>
            </List>
          </Box>
        </Box>
      </Drawer>
      <Box height="100vh" marginLeft={smDown ? 0 : theme.spacing(28)}>
        {children}
      </Box>
    </>
  );
};
