import {
  Box,
  Button,
  Divider,
  Icon,
  Paper,
  Skeleton,
  Theme,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

interface IToolBarButtonsProps {
  textNewButton?: string;

  showNewButton?: boolean;
  showBackButton?: boolean;
  showDeleteButton?: boolean;
  showSaveButton?: boolean;

  showNewButtonLoading?: boolean;
  showBackButtonLoading?: boolean;
  showDeleteButtonLoading?: boolean;
  showSaveButtonLoading?: boolean;

  clickingInNew?: () => void;
  clickingInBack?: () => void;
  clickingInDelete?: () => void;
  clickingInSave?: () => void;
}

export const ToolBarButtons: React.FC<IToolBarButtonsProps> = ({
  textNewButton = 'Novo',

  showNewButton = true,
  showBackButton = true,
  showDeleteButton = true,
  showSaveButton = true,

  showNewButtonLoading = false,
  showBackButtonLoading = false,
  showDeleteButtonLoading = false,
  showSaveButtonLoading = false,

  clickingInNew,
  clickingInBack,
  clickingInDelete,
  clickingInSave,
}) => {
  const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const mdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
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
      {showSaveButton && !showSaveButtonLoading && (
        <Button
          onClick={clickingInSave}
          variant="contained"
          color="primary"
          disableElevation
          startIcon={<Icon>save</Icon>}
        >
          <Typography
            variant="button"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
            overflow="hidden"
          >
            Salvar
          </Typography>
        </Button>
      )}
      {showSaveButtonLoading && <Skeleton width={110} height={64} />}

      {showDeleteButton && !showDeleteButtonLoading && (
        <Button
          onClick={clickingInDelete}
          variant="outlined"
          color="primary"
          disableElevation
          startIcon={<Icon>delete</Icon>}
        >
          <Typography
            variant="button"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
            overflow="hidden"
          >
            Apagar
          </Typography>
        </Button>
      )}
      {showDeleteButtonLoading && <Skeleton width={110} height={64} />}

      {showNewButton && !showNewButtonLoading && !smDown && (
        <Button
          onClick={clickingInNew}
          variant="outlined"
          color="primary"
          disableElevation
          startIcon={<Icon>add</Icon>}
        >
          <Typography
            variant="button"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
            overflow="hidden"
          >
            {textNewButton}
          </Typography>
        </Button>
      )}
      {showNewButtonLoading && !smDown && <Skeleton width={110} height={64} />}

      {showBackButton && (showNewButton || showDeleteButton || showSaveButton) && (
        <Divider variant="middle" orientation="vertical" />
      )}

      {showBackButton && !showBackButtonLoading && (
        <Button
          onClick={clickingInBack}
          variant="outlined"
          color="primary"
          disableElevation
          startIcon={<Icon>arrow_back</Icon>}
        >
          <Typography
            variant="button"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
            overflow="hidden"
          >
            Voltar
          </Typography>
        </Button>
      )}
      {showBackButtonLoading && <Skeleton width={110} height={64} />}
    </Box>
  );
};
