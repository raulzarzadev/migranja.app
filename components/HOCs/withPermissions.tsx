export type PermissionType = 'ADMIN' | 'ACTIVE_TEAM_MEMBER'
const withPermissions = (Component: any, permissions: PermissionType[]) => {
  const Permissions = (props) => {
    console.log(permissions)
    return <Component {...props} />
  }
  return Permissions
}
export default withPermissions
