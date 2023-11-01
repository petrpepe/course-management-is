import * as loc from "date-fns/locale"

export const getLocale = () => {
    const locale = navigator.language.replace("-", "");
    const rootLocale = locale.substring(0, 2);
  
    return loc[locale] || loc[rootLocale] || loc.enUS;
};