export const isAdmin = roles => {
  const filtered = roles.filter(r => r.name === 'admin' || r.name === 'super admin')
  return filtered.length > 0
}
