import typeToReducer from 'type-to-reducer';

import locales from './locales';

const NAME = 'i18n';

const RETRIEVE_LOCALE_NAME = `${NAME}/RETRIEVE_LOCALE_NAME`;
export const retrieveLocaleName = () => ({
  type: RETRIEVE_LOCALE_NAME,
  payload: new Promise((resolve, reject) => {
    navigator.globalization.getLocaleName(
      locale => resolve(locale.value),
      reject
    );
  }),
});

const initialState = {
  locale: 'en',
  messages: locales.en,
};

const getMessages = locale => {
  let lang = locale;
  let messages = locales[lang];

  if (messages == undefined) {
    lang = locale.split('-')[0];
    messages = locales[lang];
  }

  if (messages == undefined) {
    // Defaulting to 'en'
    return {
      locale: 'en',
      messages: locales.en,
    };
  }

  return {
    locale,
    messages,
  };
};

export default typeToReducer({
  [RETRIEVE_LOCALE_NAME]: {
    PENDING: state => state,
    SUCCESS: (state, action) => ({
      ...state,
      ...getMessages(action.payload),
    }),
    FAILURE: state => ({
      ...state,
      ...getMessages('en'),
    }),
  },
}, initialState);
