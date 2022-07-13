import http from '../libs/http';
// import fetch from './fetch.js';
// const platform = flatType == 0 ? 'activity' : 'content';

export type TemplateItem = {
  id: number;
  name: string;
  address: string;
  url: string;
  time: string;
  type: string;
  state: boolean;
  recordList: string;
};
export type saveCompetition = {
  id: number;
  activityName: string;
  activityStart: Date;
  activityEnd: Date;
  reward_rule: string;
  share_title: string;
  share_copywriting: string;
  background_pic_url: string;
  share_pic_url: string;
  traceId: string;
};
export type uploadImg = {};

const compDomain = import.meta.env.VITE_APP_COMP_DOMAIN;
// const uploadUrl = import.meta.env.VITE_APP_UPLOAD_URL;
// const baseUrl = import.meta.env.VITE_APP_COMP_DOMAIN;

export const getTableList = (params = {}) => {
  return http.get<{ list: TemplateItem[] }>('http://127.0.0.1:4523/mock/836228/tableList', params);
};

// 赛事管理-- 赛事列表
export const getCompetitionTableList = (params = {}) => {
  return http.get<{ list: TemplateItem[] }>(`${compDomain}/content/match/list.jsp`, params);
};

// 赛事第一步保存
export const activitySaveActivity = (params = {}) => {
  return http.post<{ list: saveCompetition[] }>(`${compDomain}/onepage/activity/save.jsp`, params);
};

// 回显详情接口
export const activityDetail = (params = {}) => {
  return http.get(`${compDomain}/onepage/activity/detail.jsp`, params);
};

// 图片上传接口
export const imageUpload = (data = {}) => {
  return http.upload(`${compDomain}/upload/imageUpload`, data);
};
