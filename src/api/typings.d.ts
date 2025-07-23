declare namespace API {
  type BaseResponseBoolean_ = {
    code?: number
    data?: boolean
    message?: string
  }

  type BaseResponseCreateoutPaintingTaskResponse_ = {
    code?: number
    data?: CreateoutPaintingTaskResponse
    message?: string
  }

  type BaseResponseGetoutPaintingTaskResponse_ = {
    code?: number
    data?: GetoutPaintingTaskResponse
    message?: string
  }

  type BaseResponseInt_ = {
    code?: number
    data?: number
    message?: string
  }

  type BaseResponseListImageSearchResult_ = {
    code?: number
    data?: ImageSearchResult[]
    message?: string
  }

  type BaseResponseListPictureVO_ = {
    code?: number
    data?: PictureVO[]
    message?: string
  }

  type BaseResponseListSpace_ = {
    code?: number
    data?: Space[]
    message?: string
  }

  type BaseResponseListSpaceCategoryAnalyzeVO_ = {
    code?: number
    data?: SpaceCategoryAnalyzeVO[]
    message?: string
  }

  type BaseResponseListSpaceLevel_ = {
    code?: number
    data?: SpaceLevel[]
    message?: string
  }

  type BaseResponseListSpaceSizeAnalyzeVO_ = {
    code?: number
    data?: SpaceSizeAnalyzeVO[]
    message?: string
  }

  type BaseResponseListSpaceTagAnalyzeVO_ = {
    code?: number
    data?: SpaceTagAnalyzeVO[]
    message?: string
  }

  type BaseResponseListSpaceUserAnalyzeVO_ = {
    code?: number
    data?: SpaceUserAnalyzeVO[]
    message?: string
  }

  type BaseResponseListSpaceUserVO_ = {
    code?: number
    data?: SpaceUserVO[]
    message?: string
  }

  type BaseResponseLong_ = {
    code?: number
    data?: number
    message?: string
  }

  type BaseResponsePageResult_ = {
    code?: number
    data?: PageResult
    message?: string
  }

  type BaseResponsePicture_ = {
    code?: number
    data?: Picture
    message?: string
  }

  type BaseResponsePictureTagCategory_ = {
    code?: number
    data?: PictureTagCategory
    message?: string
  }

  type BaseResponsePictureVO_ = {
    code?: number
    data?: PictureVO
    message?: string
  }

  type BaseResponseSpaceUsageAnalyzeVO_ = {
    code?: number
    data?: SpaceUsageAnalyzeVO
    message?: string
  }

  type BaseResponseSpaceUser_ = {
    code?: number
    data?: SpaceUser
    message?: string
  }

  type BaseResponseSpaceVO_ = {
    code?: number
    data?: SpaceVO
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

  type CreateoutPaintingTaskResponse = {
    code?: string
    message?: string
    output?: Output
    requestId?: string
  }

  type CreatePictureOutPaintingTaskDTO = {
    id?: number
    parameters?: Parameters
  }

  type DeleteRequest = {
    id?: number
  }

  type deleteUserUsingDELETEParams = {
    /** id */
    id: number
  }

  type getMySpaceUsingGETParams = {
    spaceType?: number
    userId?: number
  }

  type GetoutPaintingTaskResponse = {
    output?: Output1
    requestId?: string
  }

  type getPictureByIdUsingGETParams = {
    /** id */
    id: number
  }

  type getPictureOutPaintingTaskUsingGETParams = {
    /** taskId */
    taskId?: string
  }

  type getPictureVoByIdUsingGETParams = {
    /** id */
    id: number
  }

  type getSpaceByIdUsingGETParams = {
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

  type ImageSearchResult = {
    fromUrl?: string
    thumbUrl?: string
  }

  type listSpaceUsingGETParams = {
    current?: number
    id?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
    spaceLevel?: number
    spaceName?: string
    spaceType?: number
    userId?: number
  }

  type Output = {
    taskId?: string
    taskStatus?: string
  }

  type Output1 = {
    code?: string
    endTime?: string
    message?: string
    outputImageUrl?: string
    scheduledTime?: string
    submitTime?: string
    taskId?: string
    taskMetrics?: TaskMetrics
    taskStatus?: string
  }

  type PageResult = {
    records?: Record<string, any>[]
    total?: number
  }

  type Parameters = {
    addWatermark?: boolean
    angle?: number
    bestQuality?: boolean
    bottomOffset?: number
    leftOffset?: number
    limitImageSize?: boolean
    outputRatio?: string
    rightOffset?: number
    topOffset?: number
    xScale?: number
    yScale?: number
  }

  type PictrueUpdateDTO = {
    category?: string
    id?: number
    introduction?: string
    name?: string
    tags?: string[]
    url?: string
  }

  type Picture = {
    category?: string
    createTime?: string
    editTime?: string
    id?: number
    introduction?: string
    isDelete?: number
    name?: string
    picColor?: string
    picFormat?: string
    picHeight?: number
    picScale?: number
    picSize?: number
    picWidth?: number
    reviewMessage?: string
    reviewStatus?: number
    reviewTime?: string
    reviewerId?: number
    spaceId?: number
    tags?: string
    thumbnailUrl?: string
    updateTime?: string
    url?: string
    userId?: number
  }

  type pictureDeleteUsingDELETEParams = {
    /** id */
    id: number
  }

  type PictureEditByBatchDTO = {
    category?: string
    idList?: number[]
    nameRule?: string
    spaceId?: number
    tag?: string[]
  }

  type PictureQueryDTO = {
    category?: string
    current?: number
    endEditTime?: string
    id?: number
    introduction?: string
    name?: string
    nullSpaceId?: boolean
    pageSize?: number
    picFormat?: string
    picHeight?: number
    picScale?: number
    picSize?: number
    picWidth?: number
    reviewMessage?: string
    reviewStatus?: number
    reviewerId?: number
    searchText?: string
    sortField?: string
    sortOrder?: string
    spaceId?: number
    startEditTime?: string
    tags?: string[]
    userId?: number
  }

  type PictureReviewDTO = {
    id?: number
    reviewMessage?: string
    reviewStatus?: number
  }

  type PictureTagCategory = {
    categoryList?: string[]
    tagList?: string[]
  }

  type PictureUploadByBatchDTO = {
    count?: number
    namePrefix?: string
    searchText?: string
  }

  type PictureUploadDTO = {
    fileUrl?: string
    id?: number
    spaceId?: number
  }

  type PictureVO = {
    category?: string
    createTime?: string
    editTime?: string
    id?: number
    introduction?: string
    name?: string
    picColor?: string
    picFormat?: string
    picHeight?: number
    picScale?: number
    picSize?: number
    picWidth?: number
    spaceId?: number
    tags?: string[]
    thumbnailUrl?: string
    updateTime?: string
    url?: string
    user?: UserVO
    userId?: number
  }

  type SearchPictureByColorDTO = {
    color?: string
    spaceId?: number
  }

  type SearchPictureByPictureDTO = {
    pictureId?: number
  }

  type Space = {
    createTime?: string
    editTime?: string
    id?: number
    isDelete?: number
    maxCount?: number
    maxSize?: number
    spaceLevel?: number
    spaceName?: string
    spaceType?: number
    totalCount?: number
    totalSize?: number
    updateTime?: string
    userId?: number
  }

  type SpaceCategoryAnalyzeDTO = {
    queryAll?: boolean
    queryPublic?: boolean
    spaceId?: number
  }

  type SpaceCategoryAnalyzeVO = {
    category?: string
    count?: number
    totalSize?: number
  }

  type SpaceCreateDTO = {
    spaceLevel?: number
    spaceName?: string
    spaceType?: number
  }

  type spaceDeleteUsingDELETEParams = {
    /** id */
    id: number
  }

  type SpaceEditDTO = {
    id?: number
    spaceName?: string
  }

  type SpaceLevel = {
    maxCount?: number
    maxSize?: number
    text?: string
    value?: number
  }

  type SpaceRankAnalyzeDTO = {
    topN?: number
  }

  type SpaceSizeAnalyzeDTO = {
    queryAll?: boolean
    queryPublic?: boolean
    spaceId?: number
  }

  type SpaceSizeAnalyzeVO = {
    count?: number
    sizeRange?: string
  }

  type SpaceTagAnalyzeDTO = {
    queryAll?: boolean
    queryPublic?: boolean
    spaceId?: number
  }

  type SpaceTagAnalyzeVO = {
    count?: number
    tag?: string
  }

  type SpaceUpdateDTO = {
    id?: number
    maxCount?: number
    maxSize?: number
    spaceLevel?: number
    spaceName?: string
  }

  type SpaceUsageAnalyzeDTO = {
    queryAll?: boolean
    queryPublic?: boolean
    spaceId?: number
  }

  type SpaceUsageAnalyzeVO = {
    countUsageRatio?: number
    maxCount?: number
    maxSize?: number
    sizeUsageRatio?: number
    usedCount?: number
    usedSize?: number
  }

  type SpaceUser = {
    createTime?: string
    id?: number
    spaceId?: number
    spaceRole?: string
    updateTime?: string
    userId?: number
  }

  type SpaceUserAnalyzeDTO = {
    queryAll?: boolean
    queryPublic?: boolean
    spaceId?: number
    timeDimension?: string
    userId?: number
  }

  type SpaceUserAnalyzeVO = {
    count?: number
    period?: string
  }

  type SpaceUserCreateDTO = {
    spaceId?: number
    spaceRole?: string
    userId?: number
  }

  type SpaceUserEditDTO = {
    id?: number
    spaceRole?: string
  }

  type SpaceUserQueryDTO = {
    id?: number
    spaceId?: number
    spaceRole?: string
    userId?: number
  }

  type SpaceUserVO = {
    createTime?: string
    id?: number
    space?: SpaceVO
    spaceId?: number
    spaceRole?: string
    updateTime?: string
    user?: UserVO
    userId?: number
  }

  type SpaceVO = {
    createTime?: string
    editTime?: string
    id?: number
    maxCount?: number
    maxSize?: number
    spaceLevel?: number
    spaceName?: string
    spaceType?: number
    totalCount?: number
    totalSize?: number
    updateTime?: string
    user?: UserVO
    userId?: number
  }

  type TaskMetrics = {
    failed?: number
    succeeded?: number
    total?: number
  }

  type testDownloadFileUsingGETParams = {
    /** filepath */
    filepath?: string
  }

  type uploadPictureUsingPOST1Params = {
    fileUrl?: string
    id?: number
    spaceId?: number
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

  type UserEditDTO = {
    email?: string
    id?: string
    phone?: string
    userAccount?: string
    userAvatar?: string
    userName?: string
    userPassword?: string
    userProfile?: string
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
    email?: string
    id?: number
    phone?: string
    userAccount?: string
    userAvatar?: string
    userName?: string
    userProfile?: string
    userRole?: string
  }
}
