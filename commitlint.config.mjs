/**
 * Conventional Commits enforcement on the commit-msg hook (see
 * `.husky/commit-msg`).
 *
 * @see https://www.conventionalcommits.org/
 * @see https://commitlint.js.org/
 */
export default {
  extends: ['@commitlint/config-conventional'],
};
