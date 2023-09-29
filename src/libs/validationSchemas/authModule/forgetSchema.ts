export const forgetSchema: object = {
    email: {
        in: 'body',
        notEmpty: true,
        isEmail: {
            errorMessage: 'Invalid Email',
        },
    },
    pass: {
        in: 'body',
        notEmpty: true,
        isLength: {
            options: [{ min: 6, max: 20 }],
            errorMessage: 'Password must be between 6 and 20 characters long',
        },
    },
};