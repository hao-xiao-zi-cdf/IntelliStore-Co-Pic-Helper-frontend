declare namespace API {
  type BaseResponseBoolean_ = {
    code?: number
    data?: boolean
    message?: string
  }

  type BaseResponsePageResult_ = {
    code?: number
    data?: PageResult
    message?: string
  }

  type BaseResponseString_ = {
    code?: number
    data?: string
    message?: string
  }

  type BaseResponseUser_ = {
    code?: number
    data?: User
    message?: string
  }

  type BaseResponseUserVO_ = {
    code?: number
    data?: UserVO
    message?: string
  }

  type deleteUserUsingDELETEParams = {
    /** id */
    id: number
  }

  type getUserUsingGETParams = {
    /** id */
    id: number
  }

  type getUserVOUsingGETParams = {
    /** id */
    id: number
  }

  type PageResult = {
    records?: Record<string, any>[]
    total?: number
  }

  type User = {
    createTime?: string
    editTime?: string
    email?: string
    id?: number
    inviteUser?: number
    isDelete?: number
    phone?: string
    shareCode?: string
    updateTime?: string
    userAccount?: string
    userAvatar?: string
    userName?: string
    userPassword?: string
    userProfile?: string
    userRole?: string
    vipCode?: string
    vipExpireTime?: string
    vipNumber?: number
  }

  type UserLoginDTO = {
    userAccount?: string
    userPassword?: string
  }

  type UserQueryDTO = {
    current?: number
    id?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
    userAccount?: string
    userName?: string
    userRole?: string
  }

  type UserRegisterDTO = {
    checkPassword?: string
    userAccount?: string
    userPassword?: string
  }

  type UserUpdateDTO = {
    id?: number
    userAccount?: string
    userAvatar?: string
    userName?: string
    userRole?: string
  }

  type UserVO = {
    createTime?: string
    id?: number
    userAccount?: string
    userAvatar?: string
    userName?: string
    userProfile?: string
    userRole?: string
  }
}
