export type ListQuery = {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
};

export function getPagination(query: ListQuery) {
  const page = Math.max(1, query.page ?? 1);
  const limit = Math.min(100, Math.max(1, query.limit ?? 10));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

export function parseSort(sort?: string, allowed = ['createdAt', 'updatedAt', 'id', 'title', 'name']) {
  const raw = sort ?? 'createdAt:desc';
  const [field, direction] = raw.split(':');
  const orderField = allowed.includes(field) ? field : 'createdAt';
  const orderDirection = direction?.toLowerCase() === 'asc' ? 'ASC' : 'DESC';
  return [[orderField, orderDirection]] as [string, string][];
}

export function buildMeta(page: number, limit: number, total: number) {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 0,
  };
}
