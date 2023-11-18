import dayjs from 'dayjs';
import 'dayjs/locale/es-do';
import relativeTime from 'dayjs/plugin/relativeTime';
import isLeapYear from 'dayjs/plugin/isLeapYear';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

import { setDefaultLocale, registerLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';

registerLocale('es', es);
setDefaultLocale('es');

dayjs.locale('es-do');
dayjs.extend(relativeTime);
dayjs.extend(isLeapYear);
dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
