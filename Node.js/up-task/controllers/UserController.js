import bcrypt from "bcrypt";
import { v4 as uuid }from "uuid";
import JsonWebToken from "jsonwebtoken";

import User from "../models/User.js";

import confirmAccountEmail from "../helpers/mailer/confirmAccountEmail.js";
import recoverAccountEmail from "../helpers/mailer/recoverAccountEmail.js";
import {
    registerUserValidation,
    emailValidation,
    passwordValidation,
    loginValidation,
    editProfileValidation,
    editProfileChangePasswordValidation
} from "../helpers/validations/usersValidations.js";


const register = async (req, res) => {
    let errors = { firstName: null, lastName: null, userName: null, email: null, password: null };
    const { firstName, lastName, email, userName, password } = req.body;

    const user = new User(req.body);
    registerUserValidation(user, errors);
    if(errors.firstName !== null || errors.lastName !== null || errors.email !== null || errors.password !== null) {
        return res.status(400).json({data: user, errors, message: "Failed validation"});
    }

    try {
        const userExist = await User.findOne({ where: { userName: userName.trim() } });
        if(userExist) {
            errors.userName = "The user name is already registered";
            return res.status(400).json({data: req.body, errors, message: "Failed validation"});
        }

        const emailExist = await User.findOne({ where: { email: email.trim() } });
        if(emailExist) {
            errors.email = "The email is already registered";
            return res.status(400).json({data: req.body, errors, message: "Failed validation"});
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        user.token = uuid();
        const userSaved = await user.save();
        await confirmAccountEmail(userSaved.userId, userSaved.email, userSaved.userName, userSaved.token);
        return res.status(201).json({data: userSaved, errors: null, message: "User created successfully"});

    } catch (e) {
        return res.status(500).json({data: null, errors: "Internal server error", message: e.message});
    }
}

const confirm = async (req, res) => {

    const { token, userId } = req.params;

    if([token, userId].includes(undefined) || [token, userId].includes(null) || [token.trim(), userId.trim()].includes("") || isNaN(userId)) {
        return res.status(400).json({data: null, errors: "Bad request", message: "Url parameters not implemented correctly"})
    }

    try {
        const userToConfirm = await User.findByPk(userId);

        if(!userToConfirm) {
            return res.status(404).json({data: null, errors: "Not found", message: `Not found the user with id: ${userId}`});
        }

        if(userToConfirm.token === null || !userToConfirm.token === token) {
            return res.status(400).json({data: null, errors: "Invalid token", message: "The token is not valid or expired"})
        }

        userToConfirm.token = null;
        userToConfirm.confirm = true;
        await userToConfirm.save();
        return res.status(200).json({data: null, errors: null, message: "User confirmed successfully"})

    } catch (e) {
        return res.status(500).json({data: null, errors: "Internal server error", message: e.message});
    }
}

const recoverAccount = async (req, res) => {
    let errors = { email: null };
    const data = { email: req.body.email }

    emailValidation(data, errors);
    if(errors.email !== null) {
        return res.status(400).json({data, errors, message: "Failed validation"});
    }

    try {
        const existEmail = await User.findOne({where : {email: data.email}})

        if(!existEmail || !existEmail.confirm) {
            return res.status(400).json({data, errors: {"email": "The email isn't register or not confirmed"}, message: "Failed validation"})
        }

        existEmail.token = uuid();
        await existEmail.save();
        await recoverAccountEmail(existEmail.userId, existEmail.email, existEmail.userName, existEmail.token);
        return res.status(200).json({data: null, errors: null, message: "An email has been sent to recover your account"})

    } catch (e) {
        return res.status(500).json({data: null, errors: "Internal server error", message: e.message});
    }
}

const recoverAccountTokenVerify = async (req, res) => {
    const { token, userId } = req.params;

    if([token, userId].includes(undefined) || [token, userId].includes(null) || [token.trim(), userId.trim()].includes("") || isNaN(userId)) {
        return res.status(400).json({data: null, errors: "Bad request", message: "Url parameters not implemented correctly"})
    }

    try {
        const userWithToken = await User.findByPk(userId);

        if(!userWithToken) {
            return res.status(404).json({data: null, errors: "Not found", message: `Not found the user with id: ${userId}`});
        }

        if(!userWithToken.confirm || userWithToken.token === null || userWithToken.token !== token) {
            return res.status(400).json({data: null, errors: "Invalid token", message: "The token is not valid or expired"})
        }

        return res.status(200).json({data: {"isValid": true}, errors: null, message: "Token valid"});

    } catch (e) {
        return res.status(500).json({data: null, errors: "Internal server error", message: e.message});
    }
}

const recoverAccountChangePassword = async (req, res) => {
    const { token, userId } = req.params;
    const data = { password: req.body.password }
    let errors = { password: null };

    if([token, userId].includes(undefined) || [token, userId].includes(null) || [token.trim(), userId.trim()].includes("") || isNaN(userId)) {
        return res.status(400).json({data: null, errors: "Bad request", message: "Url parameters not implemented correctly"})
    }

    passwordValidation(data, errors);
    if(errors.password !== null) {
        return res.status(400).json({data, errors, message: "Failed validation"});
    }

    try {
        const userToValidate = await User.findByPk(userId);

        if(!userToValidate) {
            return res.status(404).json({data: null, errors: "Not found", message: `Not found the user with id: ${userId}`});
        }

        if(!userToValidate.confirm || userToValidate.token === null || userToValidate.token !== token) {
            return res.status(401).json({data: null, errors: "Invalid token", message: "The token is not valid or expired"})
        }

        const salt = await bcrypt.genSalt(10);
        userToValidate.password = await bcrypt.hash(data.password, salt);
        userToValidate.token = null;
        await userToValidate.save();

        return res.status(200).json({data: null, errors: null, message: "Recover account successfully"})

    } catch (e) {
        return res.status(500).json({data: null, errors: "Internal server error", message: e.message});
    }
}

const authenticate = async (req, res) => {
    const data = { email: req.body.email, password: req.body.password }
    let errors = { email: null, password: null };

    loginValidation(data, errors);
    if(errors.email !== null || errors.password !== null) {
        return res.status(400).json({data, errors, message: "Failed validation"});
    }

    try {
        const userToAuth = await User.findOne({ where: { email: data.email } })

        if(!userToAuth || !userToAuth.confirm) {
            return res.status(400).json({data, errors: {"email": "The email isn't register or not confirmed"}, message: "Failed validation"})
        }

        const passwordVerifyResult = await bcrypt.compare(data.password, userToAuth.password);
        if(!passwordVerifyResult) {
            return res.status(400).json({data, errors: {"password": "Invalid password"}, message: "Failed validation"})
        }

        console.log(userToAuth);
        const jwt = JsonWebToken.sign({userId: userToAuth.userId, email: userToAuth.email}, process.env.JWT_SECRET, {
            expiresIn: "1d"
        });

        return res.status(200).json({data: {authenticate: true, jwt} , errors: null, message: "Authenticate successfully"})


    } catch (e) {
        return res.status(500).json({data: null, errors: "Internal server error", message: e.message});
    }
}

const getProfile = async (req, res) => {
    const { user } = req;
    return res.status(200).json({data: user, errors: null, message: "Get profile success"})
}

const editProfile = async (req, res) => {
    const data = { firstName: req.body.firstName, lastName: req.body.lastName, userName: req.body.userName, email: req.body.email };
    const errors = { firstName: null, lastName: null, userName: null, email: null };
    const userProfile = req.user;
    const { userId } = userProfile;
    let isUpdate = false;

    editProfileValidation(data, errors);
    if(errors.firstName !== null || errors.lastName !== null || errors.userName !== null || errors.email !== null) {
        return res.status(400).json({data: data, errors, message: "Failed validation"});
    }

    try {
        const userForUpdate = await User.findByPk(userId);
        if(!userForUpdate) {
            return res.status(404).json({data: null, errors: "Not found", message: `Not found the user with id: ${userId}`});
        }

        const existUserName = await User.findOne({ where: { userName: data.userName } });
        if(userForUpdate.userName !== data.userName && existUserName) {
            errors.userName = "The user name is already registered";
            return res.status(400).json({data: data, errors, message: "Failed validation"});
        }

        const existEmail = await User.findOne({ where: { email: data.email } });
        if(userForUpdate.email !== data.email && existEmail) {
            errors.email = "The email is already registered";
            return res.status(400).json({data: data, errors, message: "Failed validation"});
        }

        if(userForUpdate.firstName !== data.firstName) {
            userForUpdate.firstName = data.firstName;
            isUpdate = true;
        }

        if(userForUpdate.lastName !== data.lastName) {
            userForUpdate.lastName = data.lastName;
            isUpdate = true;
        }

        if(userForUpdate.userName !== data.userName) {
            userForUpdate.userName = data.userName;
            isUpdate = true;
        }

        if(userForUpdate.email !== data.email) {
            userForUpdate.email = data.email;
            isUpdate = true;
        }

        if(!isUpdate) {
            return res.status(200).json({data: userProfile, errors: null, message: "Updated profile success xd"});
        }

        const userSaved = await userForUpdate.save();
        userProfile.firstName = userSaved.firstName;
        userProfile.lastName = userSaved.lastName;
        userProfile.userName = userSaved.userName;
        userProfile.email = userSaved.email;
        req.user = userProfile;

        return res.status(200).json({data: userProfile, errors: null, message: "Updated profile success"});

    } catch (e) {
        return res.status(500).json({data: null, errors: "Internal server error", message: e.message});
    }
}

const editProfileChangePassword = async (req, res) => {
    const data = { currentPassword: req.body.currentPassword, newPassword: req.body.newPassword };
    const errors = { currentPassword: null, newPassword: null };
    const userProfile = req.user;

    editProfileChangePasswordValidation(data, errors);
    if(errors.currentPassword !== null || errors.newPassword !== null) {
        return res.status(400).json({data, errors, message: "Failed validation"});
    }

    try {
        const userForUpdate = await User.findByPk(userProfile.userId);
        if(!userForUpdate) {
            return res.status(404).json({data: null, errors: "Not found", message: `Not found the user with id: ${userProfile.userId}`});
        }

        let passwordVerifyResult = await bcrypt.compare(data.currentPassword, userForUpdate.password);
        if(!passwordVerifyResult) {
            errors.currentPassword = "Incorrect current password";
            return res.status(400).json({data: data, errors, message: "Failed validation"});
        }

        passwordVerifyResult = await bcrypt.compare(data.newPassword, userForUpdate.password);
        if(passwordVerifyResult) {
            errors.newPassword = "The new password cannot be the same as the current one";
            return res.status(400).json({data: data, errors, message: "Failed validation"});
        }

        const salt = await bcrypt.genSalt(10);
        userForUpdate.password = await bcrypt.hash(data.newPassword, salt)
        await userForUpdate.save();
        return res.status(200).json({data: null, errors: null, message: "Change password successfully"});

    } catch (e) {
        return res.status(500).json({data: null, errors: "Internal server error", message: e.message});
    }
}

export {
    register,
    confirm,
    recoverAccount,
    recoverAccountTokenVerify,
    recoverAccountChangePassword,
    authenticate,
    getProfile,
    editProfile,
    editProfileChangePassword
}
