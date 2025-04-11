import { useMemo } from 'react';
import { IMarkUp } from '../MarkUpsService';

export function UseMarkUpCoef(markUp: IMarkUp): number {
  const coef = useMemo(() => {
    const encargos =
      markUp.taxes +
      markUp.admin +
      markUp.commission +
      markUp.freight +
      markUp.financial +
      markUp.marketing +
      markUp.promoters +
      markUp.bonus +
      markUp.profit;

    return 100 / (100 - encargos);
  }, [markUp]);

  return coef;
}
