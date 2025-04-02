export async function paginateWithData(
  model: any,
  page?: number,
  pageSize?: number,
  options: any = {},
  dataKey: string = 'data',
) {
  let result;
  if (!page || !pageSize) {
    result = await model.findAndCountAll(options);
  } else {
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
    const queryOptions = {
      ...options,
      offset,
      limit,
    };

    result = await model.findAndCountAll(queryOptions);
  }

  return {
    [dataKey]: result.rows,
    totalItems: result.count,
    totalPages: Math.ceil(result.count / (pageSize as number)) || 1,
    currentPage: page,
    pageSize: pageSize,
    numberOfRows: result.rows.length,
  };
}

export function sorting(sortKey: string, sortValue: string) {
  let sortQuery: [string, string][] = [];

  if (sortKey && sortValue) {
    if (sortValue === 'asc' || sortValue === 'desc') {
      sortQuery.push([sortKey, sortValue.toUpperCase()]);
    }
  } else {
    sortQuery.push(['id', 'DESC']);
  }

  return sortQuery;
}
