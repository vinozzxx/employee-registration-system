/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // New feature
        'fix', // Bug fix
        'docs', // Documentation changes
        'style', // Formatting, no code change
        'refactor', // Code refactor, no feature/fix
        'perf', // Performance improvement
        'test', // Adding or fixing tests
        'chore', // Build process, tooling, deps
        'revert', // Revert previous commit
        'ci', // CI/CD changes
        'build', // Build system changes
      ],
    ],
    'subject-case': [2, 'never', ['start-case', 'pascal-case', 'upper-case']],
    'subject-max-length': [2, 'always', 100],
    'body-max-line-length': [2, 'always', 200],
  },
};
