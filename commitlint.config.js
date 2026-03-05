module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // Nova funcionalidade
        'fix',      // Correção de bug
        'docs',     // Apenas documentação
        'style',    // Formatação, sem mudança de lógica
        'refactor', // Refatoração sem mudança de comportamento
        'perf',     // Melhoria de performance
        'test',     // Adição ou correção de testes
        'chore',    // Manutenção (deps, config)
        'ci',       // CI/CD
        'build',    // Build system
        'revert',   // Reverter commit anterior
      ],
    ],
    'scope-enum': [
      2,
      'always',
      [
        // Apps
        'storefront',
        'medusa',
        
        // Módulos
        'subscription',
        'access-control',
        'course',
        'digital-delivery',
        
        // Packages
        'types',
        'utils',
        
        // Outros
        'deps',
        'config',
        'docs',
        'release',
      ],
    ],
    'scope-empty': [1, 'never'], // Warn se scope estiver vazio
    'subject-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 72],
    'body-leading-blank': [1, 'always'],
    'body-max-line-length': [2, 'always', 100],
    'footer-leading-blank': [1, 'always'],
    'footer-max-line-length': [2, 'always', 100],
  },
};
