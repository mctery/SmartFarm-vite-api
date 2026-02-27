/**
 * Parse pagination params from query string.
 * Returns { page, limit, skip } or null if pagination is not requested.
 */
function parsePagination(query, defaultLimit = 20) {
  const page = parseInt(query?.page, 10) || 0;
  const limit = parseInt(query?.limit, 10) || defaultLimit;

  if (page > 0 && limit > 0) {
    return { page, limit, skip: (page - 1) * limit };
  }
  return null;
}

/**
 * Build standard pagination response object.
 */
function paginationMeta(page, limit, total) {
  return { page, limit, total, totalPages: Math.ceil(total / limit) };
}

module.exports = { parsePagination, paginationMeta };
