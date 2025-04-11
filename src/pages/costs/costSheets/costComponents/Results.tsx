import { Box, Typography } from '@mui/material';

type Props = {
  title: string;
  content1: any;
  content2: any;
  content3: any;
  colorBox: string;
};

export const Results = ({ title, content1, content2, content3, colorBox }: Props) => {
  return (
    <Box display="flex" flexDirection="column" width="100%" textAlign="center">
      <Typography variant="h6" bgcolor={colorBox} color="white" fontWeight="bold">
        {title}
      </Typography>
      <Box display="flex" flexDirection="row" flexGrow={3}>
        <Box display="flex" flexDirection="column" flexGrow={1}>
          <Typography color="white" fontWeight="bold" bgcolor={colorBox}>
            Unitário
          </Typography>
          <Box border={1}>
            <Typography variant="h6">{content1}</Typography>
          </Box>
        </Box>

        <Box display="flex" flexDirection="column" flexGrow={1}>
          <Typography color="white" fontWeight="bold" bgcolor={colorBox}>
            Embalagem
          </Typography>
          <Box border={1}>
            <Typography variant="h6">{content2}</Typography>
          </Box>
        </Box>

        <Box display="flex" flexDirection="column" flexGrow={1}>
          <Typography color="white" fontWeight="bold" bgcolor={colorBox}>
            Margem
          </Typography>
          <Box border={1}>
            <Typography variant="h6">{content3}%</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
