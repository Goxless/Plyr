const signUpSchema: object = {
    email: {
        in: 'body',
        notEmpty: true,
        isEmail: {
            errorMessage: 'Invalid Email',
        },
    },
    name: {
        in: 'body',
        notEmpty: true,
        isLength: {
            options: [{ min: 3, max: 20 }],
            errorMessage: 'Name must be between 3 and 20 characters long',
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

export default signUpSchema;
