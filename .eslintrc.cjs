module.exports = {
    "env": {
        "es2021": true,
        "node": true,
    },
    "extends": [
        "standard-with-typescript",
        "plugin:@typescript-eslint/recommended",
        "plugin:eslint-comments/recommended",
        "prettier"
    ],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "parser": "@typescript-eslint/parser",
    "plugins": ["@typescript-eslint","prettier"],
    "rules": {
        'import/extensions':"off",
        "prettier/prettier": "error",
        "no-use-before-define": [
            "error",
            {
                "functions": false,
                "classes": true,
                "variables": true
            }
        ],
        "@typescript-eslint/no-use-before-define": [
            "error",
            {
                "functions": false,
                "classes": true,
                "variables": true,
                "typedefs": true
            }
        ],
    },
    "settings": {
        "import/resolver": {
            "typescript": {
                "alwaysTryTypes": true,
                "project": "./tsconfig.json"
            }
        }
    }
}
