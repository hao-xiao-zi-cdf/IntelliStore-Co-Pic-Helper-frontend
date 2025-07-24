// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 创建空间 POST /api/space */
export async function updateSpaceUsingPost(
  body: API.SpaceCreateDTO,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseSpaceVO_>('/api/space', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 查询空间 GET /api/space/${param0} */
export async function getSpaceByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getSpaceByIdUsingGETParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params
  return request<API.BaseResponseSpaceVO_>(`/api/space/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 删除空间（创建人和管理员） DELETE /api/space/${param0} */
export async function spaceDeleteUsingDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.spaceDeleteUsingDELETEParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params
  return request<API.BaseResponseBoolean_>(`/api/space/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 编辑空间（仅限本人） POST /api/space/edit */
export async function editSpaceUsingPost(body: API.SpaceEditDTO, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean_>('/api/space/edit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 查询空间列表（管理员） GET /api/space/list */
export async function listSpaceUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listSpaceUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageResult_>('/api/space/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** listSpaceLevel GET /api/space/list/level */
export async function listSpaceLevelUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseListSpaceLevel_>('/api/space/list/level', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 查询我的空间（普通用户） GET /api/space/my */
export async function getMySpaceUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMySpaceUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseSpaceVO_>('/api/space/my', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 更新空间（管理员） POST /api/space/update */
export async function updateSpaceUsingPost1(
  body: API.SpaceUpdateDTO,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/space/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
