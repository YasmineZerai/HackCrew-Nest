import { Query } from '@nestjs/common';
import { FilterPipe } from '../pipes/filter.pipe';

export const Filter = () => Query(new FilterPipe());
