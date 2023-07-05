import axios from 'axios';
import NProgress from 'nprogress';

import dayjs from 'dayjs';
import 'dayjs/locale/es-do';
import relativeTime from 'dayjs/plugin/relativeTime';
import isLeapYear from 'dayjs/plugin/isLeapYear';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';

import ChartJS from 'chart.js/auto';

export function rootConfig() {
  axios.defaults.baseURL = process.env.NEXT_PUBLIC_URL_API;
  NProgress.configure({ showSpinner: false });

  dayjs.locale('es-do');
  dayjs.extend(relativeTime);
  dayjs.extend(isLeapYear);
  dayjs.extend(isToday);
  dayjs.extend(isYesterday);

  ChartJS.register();
}
