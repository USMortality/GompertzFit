module.exports = {
    "env": {
        "es2022": true
    },
    "extends": [
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:@typescript-eslint/strict"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": "tsconfig.json",
        "sourceType": "module"
    },
    "rules": {
        "quotes": ["warn", "single"],
        "semi": ["warn", "never"],
        "indent": ["error", 2, {
            "SwitchCase": 1
        }],
        "keyword-spacing": ["error", { "before": true }],
        "space-before-function-paren": ["error", {
            "anonymous": "never",
            "named": "never",
            "asyncArrow": "always"
        }],
        "no-shadow": "off",
        "@typescript-eslint/no-shadow": "error",
    }
}
