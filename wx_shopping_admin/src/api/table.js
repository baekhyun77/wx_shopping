import request from '@/utils/request'
//存放各种请求接口
export function getList(params) {
  return request({
    url: '/table/list',
    method: 'get',
    params
  })
}
