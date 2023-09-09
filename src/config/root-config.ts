import axios from 'axios';
import NProgress from 'nprogress';

import ChartJS from 'chart.js/auto';

export function rootConfig() {
  axios.defaults.baseURL = process.env.NEXT_PUBLIC_URL_API;
  NProgress.configure({ showSpinner: false });
  ChartJS.register();
}
