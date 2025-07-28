// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 更新图片（管理员） POST /api/picture */
export async function updatePictureUsingPost(
  body: API.PictrueUpdateDTO,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/picture', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 查询图片信息（管理员） GET /api/picture/${param0} */
export async function getPictureByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPictureByIdUsingGETParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params
  return request<API.BaseResponsePicture_>(`/api/picture/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 删除图片（本人和管理员） DELETE /api/picture/${param0}/${param1} */
export async function pictureDeleteUsingDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.pictureDeleteUsingDELETEParams,
  options?: { [key: string]: any }
) {
  const { id: param0, spaceId: param1, ...queryParams } = params
  return request<API.BaseResponseBoolean_>(`/api/picture/${param0}/${param1}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 编辑图片（仅限本人） POST /api/picture/edit */
export async function editPictureUsingPost(
  body: API.PictrueUpdateDTO,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/picture/edit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 批量编辑图片信息 POST /api/picture/edit/batch */
export async function pictureEditByBatchUsingPost(
  body: API.PictureEditByBatchDTO,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/picture/edit/batch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 批量抓取图片（管理员） POST /api/picture/fetch */
export async function pictureUploadByBatchUsingPost(
  body: API.PictureUploadByBatchDTO,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseInt_>('/api/picture/fetch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 查询图片列表（管理员） POST /api/picture/list */
export async function getPictureListUsingPost(
  body: API.PictureQueryDTO,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageResult_>('/api/picture/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 创建 AI 扩图任务 POST /api/picture/out_painting/create_task */
export async function createPictureOutPaintingTaskUsingPost(
  body: API.CreatePictureOutPaintingTaskDTO,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseCreateoutPaintingTaskResponse_>(
    '/api/picture/out_painting/create_task',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    }
  )
}

/** getPictureOutPaintingTask GET /api/picture/out_painting/get_task */
export async function getPictureOutPaintingTaskUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPictureOutPaintingTaskUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseGetoutPaintingTaskResponse_>(
    '/api/picture/out_painting/get_task',
    {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    }
  )
}

/** 审核图片（管理员） POST /api/picture/review */
export async function pictureReviewUsingPost(
  body: API.PictureReviewDTO,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/picture/review', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 颜色搜图 POST /api/picture/search/color */
export async function searchPicTureByColorUsingPost(
  body: API.SearchPictureByColorDTO,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListPictureVO_>('/api/picture/search/color', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** searchPictureByPicture POST /api/picture/search/picture */
export async function searchPictureByPictureUsingPost(
  body: API.SearchPictureByPictureDTO,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListImageSearchResult_>('/api/picture/search/picture', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** listPictureTagCategory GET /api/picture/tag_category */
export async function listPictureTagCategoryUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponsePictureTagCategory_>('/api/picture/tag_category', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 本地图片上传 POST /api/picture/upload/local */
export async function uploadPictureUsingPost1(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.uploadPictureUsingPOST1Params,
  body: {},
  multipartFile?: File,
  options?: { [key: string]: any }
) {
  const formData = new FormData()

  if (multipartFile) {
    formData.append('multipartFile', multipartFile)
  }

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele]

    if (item !== undefined && item !== null) {
      if (typeof item === 'object' && !(item instanceof File)) {
        if (item instanceof Array) {
          item.forEach((f) => formData.append(ele, f || ''))
        } else {
          formData.append(ele, JSON.stringify(item))
        }
      } else {
        formData.append(ele, item)
      }
    }
  })

  return request<API.BaseResponsePictureVO_>('/api/picture/upload/local', {
    method: 'POST',
    params: {
      ...params,
    },
    data: formData,
    requestType: 'form',
    ...(options || {}),
  })
}

/** URL图片上传 POST /api/picture/upload/url */
export async function uploadPictureUsingPost(
  body: API.PictureUploadDTO,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePictureVO_>('/api/picture/upload/url', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 查询图片信息（普通用户） GET /api/picture/vo/${param0}/${param1} */
export async function getPictureVoByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPictureVoByIdUsingGETParams,
  options?: { [key: string]: any }
) {
  const { id: param0, spaceId: param1, ...queryParams } = params
  return request<API.BaseResponsePictureVO_>(`/api/picture/vo/${param0}/${param1}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 查询图片列表（普通用户） POST /api/picture/vo/list/ */
export async function getPictureVoListByCacheUsingPost(
  body: API.PictureQueryDTO,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageResult_>('/api/picture/vo/list/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
