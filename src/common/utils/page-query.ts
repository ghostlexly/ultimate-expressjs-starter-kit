/**
 * Get pagination values from request query.
 * @example ?page=1&first=10
 * @param req
 * @returns
 */
const getPagination = ({
  query,
}: {
  query: { page?: string | number; first?: string | number };
}) => {
  const page = query.page;
  const first = query.first;

  const validPage = !page || Number(page) < 1 ? 1 : Number(page);
  const validFirst = !first || Number(first) > 100 ? 50 : Number(first);

  const take = Number(validFirst);
  const skip = (Number(validPage) - 1) * take;

  return {
    take,
    skip,
  };
};

/**
 * Get sorting values from request query.
 * @example ?sort=example_col_name:asc
 * @param req
 * @returns
 */
const getSorting = ({ query }: { query: { sort?: string } }) => {
  const sort = query.sort;
  if (!sort) return undefined;

  const [column, direction] = sort.toString().split(":");

  let validDirection = direction.toLowerCase() as "asc" | "desc";
  if (validDirection !== "asc" && validDirection !== "desc") {
    validDirection = "desc";
  }

  return {
    column,
    direction: validDirection,
  };
};

/**
 * Get transformed data with pagination values.
 * @param data - Data array
 * @param totalItems - Total number of items
 * @param first - Number of items per page
 * @param page - Current page number
 * @returns Transformed data with pagination info
 */
const getTransformed = ({
  data,
  itemsCount,
  query,
}: {
  data: any;
  itemsCount: number;
  query: { page?: string | number; first?: string | number };
}) => {
  const page = query.page;
  const first = query.first;
  const currentPage = page ? Number(page) : 1;
  const itemsPerPage = first ? Number(first) : 50;
  const pagesCount = Math.ceil(itemsCount / itemsPerPage);

  return {
    nodes: data,
    pagination: {
      currentPage,
      itemsPerPage,
      pagesCount,
      itemsCount,
    },
  };
};

const getIncludes = ({ query }: { query: { include?: string[] | string } }) => {
  const includes = new Set<string>();

  if (Array.isArray(query.include)) {
    query.include.forEach((include) => includes.add(include));
  } else if (typeof query.include === "string") {
    includes.add(query.include);
  }

  return includes;
};

/**
 * Get both pagination and sorting parameters from request query.
 * @param query - Request query object containing optional pagination and sorting parameters
 * @returns Object with pagination and sorting properties
 */
const getQueryParams = ({
  query,
}: {
  query: {
    page?: string | number;
    first?: string | number;
    sort?: string;
    include?: string[] | string;
  };
}) => {
  return {
    pagination: getPagination({ query }),
    sorting: getSorting({ query }),
    includes: getIncludes({ query }),
  };
};

/**
 * Page query helper used for pagination, sorting and transforming data.
 */
export const pageQuery = {
  getQueryParams,
  getTransformed,
};
