import { Box, Typography } from '@mui/material';

type Props = {
  title: string;
  content: string;
};

const ItemInformationCost = ({ title, content }: Props) => {
  return (
    <Box display="flex" width="100%" alignItems="center" justifyContent="end">
      <Typography ml="10px">
        {title}
      </Typography>
      <Typography fontSize="20px" fontWeight="bold" ml="20px">
        {content}
      </Typography>
    </Box>
  );
};

export default ItemInformationCost;
