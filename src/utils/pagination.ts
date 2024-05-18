export const paginationResponse = ({
  total,
  page = 1,
  take = 10,
}: {
  total: number;
  page?: number;
  take?: number;
}) => {
  return {
    take,
    page,
    total,
    totalPages: Math.ceil(total / take),
  };
};
