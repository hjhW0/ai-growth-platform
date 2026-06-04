/**
 * 日期格式化工具
 */

/**
 * 格式化日期为 YYYY-MM-DD
 * @param {Date} date
 * @returns {string}
 */
export const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * 获取今天的日期字符串
 * @returns {string}
 */
export const getToday = () => {
  return formatDate(new Date());
};

/**
 * 格式化日期为中文显示
 * @param {string} dateString
 * @returns {string}
 */
export const formatDateChinese = (dateString) => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}月${day}日`;
};

/**
 * 获取星期几
 * @param {string} dateString
 * @returns {string}
 */
export const getWeekday = (dateString) => {
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const date = new Date(dateString);
  return weekdays[date.getDay()];
};

/**
 * 获取相对日期描述
 * @param {string} dateString
 * @returns {string}
 */
export const getRelativeDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  const diffDays = Math.floor((today - date) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return '今天';
  if (diffDays === 1) return '昨天';
  if (diffDays === -1) return '明天';
  if (diffDays > 0) return `${diffDays}天前`;
  return `${Math.abs(diffDays)}天后`;
};
