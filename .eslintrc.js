module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    // Удалены расширения, связанные с Prettier
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    // Оставлены правила, не связанные с форматированием
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',

    // Удалено правило 'prettier/prettier'

    // Правила, связанные с качеством кода и потенциальными ошибками
    'no-unused-expressions': 'error',

    // Запрет использования var
    'no-var': 'error',

    // Запрет использования eval()
    'no-eval': 'error',

    // Запрет "проваливания" в case операторах switch
    'no-fallthrough': 'error',

    // Запрет использования new Function()
    'no-new-func': 'error',

    // Запрет создания новых экземпляров примитивных типов
    'no-new-wrappers': 'error',

    // Запрет избыточного использования return await
    'no-return-await': 'error',

    // Запрет самоприсваивания
    'no-self-assign': [
      'error',
      {
        props: true,
      },
    ],

    // Запрет сравнения переменной с самой собой
    'no-self-compare': 'error',

    // Запрет использования операторов запятой
    'no-sequences': 'error',

    // Ограничение того, что может быть выброшено как исключение
    'no-throw-literal': 'error',

    // Запрет ненужных блоков catch
    'no-useless-catch': 'error',

    // Запрет ненужной конкатенации строк
    'no-useless-concat': 'error',

    // Запрет ненужных экранирований в строках
    'no-useless-escape': 'error',

    // Запрет ненужных операторов return
    'no-useless-return': 'error',

    // Запрет использования оператора void
    'no-void': 'error',

    // Требование или запрет "йода"-условий
    yoda: 'error',

    /* NODEJS */

    // Запрет использования конструктора Buffer()
    'no-buffer-constructor': 'error',

    // Запрет использования process.env
    'no-process-env': 'off',

    // Запрет использования process.exit()
    'no-process-exit': 'off',

    /* ERRORS */

    // Обеспечение правильного направления обновления в циклах for
    'for-direction': 'error',

    // Запрет использования console
    'no-console': 'error',

    // Запрет пустых блоков
    'no-empty': 'error',

    // Запрет двойных отрицаний в булевых контекстах
    'no-extra-boolean-cast': 'error',

    // Запрет недостижимого кода после управляющих операторов
    'no-unreachable': 'error',
  },
};
