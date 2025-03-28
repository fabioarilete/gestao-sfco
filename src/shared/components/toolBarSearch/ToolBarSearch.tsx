import { Box, Button, Icon, Paper, TextField, useTheme } from '@mui/material';
import { Environment } from '../../environments';

interface IToolBarSearchProps {
  searchText?: string;
  showInput?: boolean;
  changingText?: (novoTexto: string) => void;
  textNewButton?: string;
  showNewButton?: boolean;
  clickingNewButton?: () => void;
}

export const ToolBarSearch: React.FC<IToolBarSearchProps> = ({
  searchText = '',
  showInput = false,
  changingText,
  textNewButton = 'Novo',
  showNewButton = true,
  clickingNewButton,
}) => {
  const theme = useTheme();

  return (
    <Box
      gap={1}
      marginX={1}
      padding={1}
      paddingX={2}
      display="flex"
      alignItems="center"
      height={theme.spacing(5)}
      component={Paper}
    >
      {showInput && (
        <TextField
          size="small"
          value={searchText}
          onChange={e => changingText?.(e.target.value)}
          placeholder={Environment.INPUT_DE_BUSCA}
        />
      )}

      <Box flex={1} display="flex" justifyContent="end">
        {showNewButton && (
          <Button
            onClick={clickingNewButton}
            variant="contained"
            color="primary"
            disableElevation
            endIcon={<Icon>add</Icon>}
          >
            {textNewButton}
          </Button>
        )}
      </Box>
    </Box>
  );
};
