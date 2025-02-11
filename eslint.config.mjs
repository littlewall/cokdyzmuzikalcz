import eslintConfig from '@dvdevcz/eslint';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default [
    ...eslintConfig.configs.base,
    ...eslintConfig.configs.react,
    {
        plugins: {
            'simple-import-sort': simpleImportSort,
        },
        rules: {
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',
        },
    },
];
