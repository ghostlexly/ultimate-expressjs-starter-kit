/**
 * Get pagination values from request query.
 * @example ?page=1&first=10
 * @param req
 * @returns
 */
const getPagination = ({ first, page }: { first?: number; page?: number }) => {
  const validPage = !page || page < 1 ? 1 : page;

  const take = !first || first > 100 ? 50 : first;
  const skip = (validPage - 1) * take;

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
const getSorting = ({ sort }: { sort?: string }) => {
  if (!sort) return undefined;

  const [column, direction] = sort.toString().split(":");

  const validDirection = direction?.toLowerCase();
  if (validDirection !== "asc" && validDirection !== "desc") {
    return undefined;
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
  first,
  page,
}: {
  data: any;
  itemsCount: number;
  first?: number;
  page?: number;
}) => {
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

/**
   * Page query helper.
   * @example
   * ```typescript
   const getMunicipalities = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const query  = await validate({ data: req.query, schema: municipalitiesGetSchema });
      const pagination = pageQuery.getPagination({
        page: query.page,
        first: query.first,
      });
  
      const wAND: Prisma.MunicipalityWhereInput[] = [];
      const sorting = pageQuery.getSorting({ sort: query.sort });
      let include: Prisma.MunicipalityInclude = {};
      let orderBy: Prisma.MunicipalityOrderByWithRelationInput = {
        population: "desc",
      };
  
      // --------------------------------------
      // Filters
      // --------------------------------------
      if (query.id) {
        wAND.push({
          id: query.id,
        });
      }
  
      if (query.fullName) {
        // Split the string by spaces and filter out empty strings
        const terms = query.fullName.split(" ").filter((term) => term.length > 0);
  
        terms.flatMap((term) => {
          wAND.push({
            OR: [
              {
                firstName: {
                  contains: term,
                },
              },
  
              {
                lastName: {
                  contains: term,
                },
              },
            ],
          });
        });
      }
  
      // ---------------------
      // Includes
      // ---------------------
      if (query.include) {
        const includeOptions = query.include.split(",");
  
        if (includeOptions.includes("informations")) {
          include = {
            ...include,
            informations = {
              select: {
                firstName: true,
                lastName: true,
                phoneNumber: true,
                companyName: true,
              },
            },
          };
        }
      }
  
      // ---------------------
      // Sorting
      // ---------------------
      if (sorting?.column === "createdAt") {
        orderBy = {
          createdAt: sorting.direction,
        };
      }
  
      // --------------------------------------
      // Query
      // --------------------------------------
      const { data: postalCodes, count } =
        await prisma.municipality.findManyAndCount({
          include: include,
  
          where: {
            AND: wAND,
            city: {
              contains: "MARIGNANE",
            },
          },
  
          orderBy,
          ...pagination,
        });
  
      return res.json(
        pageQuery.getTransformed({
          data: postalCodes,
          first: query.first,
          page: query.page,
          itemsCount: count,
        })
      );
    } catch (error) {
      next(error);
    }
  };
   * ```
   */
export const pageQuery = {
  getPagination,
  getSorting,
  getTransformed,
};
