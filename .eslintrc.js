module.exports = {
    root: true,
    extends: ['plugin:@wordpress/eslint-plugin/recommended'],
    ignorePatterns: ['**/vendor/*.js'],
    rules: {
        // Use spaces.
        indent: ['error', 4],
    },
};
