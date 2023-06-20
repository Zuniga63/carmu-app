import axios from 'axios';
import { emCache } from 'src/utils/emotionCache';
import NProgress from 'nprogress';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/es-do';
import isLeapYear from 'dayjs/plugin/isLeapYear';

import ChartJS from 'chart.js/auto';

export function rootConfig() {
  emCache();
  axios.defaults.baseURL = process.env.NEXT_PUBLIC_URL_API;
  NProgress.configure({ showSpinner: false });

  dayjs.locale('es-do');
  dayjs.extend(relativeTime);
  dayjs.extend(isLeapYear);

  ChartJS.register();
}
