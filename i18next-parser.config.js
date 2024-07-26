export default {
  defaultNamespace: 'translation',
  lexers: {
    js: ['JsxLexer'], // we're writing jsx inside .js files
    default: ['JavascriptLexer'],
  },
  locales: ['en', 'ru'],
  output: 'public/locales/$LOCALE/$NAMESPACE.json',
  input: ['src/*.jsx'],
};
