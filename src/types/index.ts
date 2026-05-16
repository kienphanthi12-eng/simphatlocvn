import { Prisma, Sim, Order } from '@prisma/client';

export type SimWithOrderCount = Sim & {
  _count: {
    orders: number;
  };
};

export type OrderWithSim = Order & {
  sim: Sim;
};

export interface FilterParams {
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface ApiResponse<T> {
  data: T;
  total?: number;
  page?: number;
  totalPages?: number;
}
