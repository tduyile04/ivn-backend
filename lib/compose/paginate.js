export default (data, page, limit) => {
  const offset = Number(page - 1) * Number(limit)
  const metadata = {
    total: data.length,
    perPage: limit,
    totalPage: Math.ceil(data.length / limit),
    page
  }
  return { data: data.slice(offset, offset + limit), metadata }
}
