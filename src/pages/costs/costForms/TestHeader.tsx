import { Box, Grid, Typography } from '@mui/material';
import logo from '../../../shared/img/logosf.png';
import { useNavigate, useParams } from 'react-router-dom';
import { Dispatch, SetStateAction, useState } from 'react';
import { ICost } from '../CostService';
import { Input, SelectUnit, SelectYesOrNot } from '../../../shared/components';

interface IProductForm {
  cost: ICost;
  setCost: Dispatch<SetStateAction<ICost>>;
}

export const TestHeader = ({ cost, setCost }: IProductForm) => {
  const { id = 'novo' } = useParams<'id'>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');

  return (
    <Box>
      <Grid container direction="column" padding={1} spacing="2px">
        <Grid container direction="row">
          <Grid
            size={3}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <img style={{ width: '200px' }} src={logo} />
            <Typography variant="h6">Planilha de Custo</Typography>
          </Grid>
          <Grid
            size={7}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          ></Grid>
          <Grid
            container
            size={2}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Grid margin={0} size={12} display="flex" justifyContent="end" alignItems="center">
              <Typography>Data: </Typography>
              <span>30/01/2025</span>
            </Grid>
            <Grid
              container
              margin={0}
              size={12}
              flexDirection="row"
              display="flex"
              justifyContent="end"
              alignItems="center"
            >
              <SelectYesOrNot
                label="Produzido?"
                name="type"
                value={cost.type}
                onChange={e =>
                  setCost({
                    ...cost,
                    type: e.currentTarget.value,
                  })
                }
              />
            </Grid>

            <Grid
              container
              margin={0}
              size={12}
              flexDirection="row"
              display="flex"
              justifyContent="end"
              alignItems="center"
            >
              <SelectYesOrNot
                label="Tem Subst.Trib?"
                name="st"
                value={cost.st}
                onChange={e =>
                  setCost({
                    ...cost,
                    st: e.currentTarget.value,
                  })
                }
              />
            </Grid>

            <Grid
              container
              margin={0}
              size={12}
              flexDirection="row"
              display="flex"
              justifyContent="end"
              alignItems="center"
            >
              <SelectYesOrNot
                label="Sfco -> Stza?"
                name="sf_st"
                value={cost.sf_st}
                onChange={e =>
                  setCost({
                    ...cost,
                    sf_st: e.currentTarget.value,
                  })
                }
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid container display="flex" flexDirection="row" padding={1} spacing={1}>
          <Grid size={2} display="flex" marginX={1}>
            <Input
              type="text"
              value={cost.cod}
              label="Código"
              name="cod"
              placeholder="Código"
              onChange={e =>
                setCost({
                  ...cost,
                  cod: e.currentTarget.value.toLocaleUpperCase(),
                })
              }
            />
          </Grid>

          <Grid size={5} marginX={1}>
            <Input
              type="text"
              value={cost.name}
              label="Descrição do Produto"
              name="name"
              placeholder="Descreva o nome do produto..."
              onChange={e =>
                setCost({
                  ...cost,
                  name: e.currentTarget.value.toLocaleUpperCase(),
                })
              }
            />
          </Grid>

          <Grid size={2} marginX={1}>
            <SelectUnit
              label="Unidade"
              name="unit"
              value={cost.unit}
              onChange={e =>
                setCost({
                  ...cost,
                  unit: e.currentTarget.value,
                })
              }
            />
          </Grid>

          <Grid size={2}>
            <Input
              type="number"
              value={cost.qt}
              label="Quantidade"
              name="qt"
              placeholder="Informe a quantidade"
              onChange={e =>
                setCost({
                  ...cost,
                  qt: Number(e.currentTarget.value),
                })
              }
            />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
