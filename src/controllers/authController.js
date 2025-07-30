const AuthUser = require('../models/authUser');
const Student = require("../models/student")
const Teacher = require("../models/teacher")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

exports.login = async(req, res) => {
    const { email, password } = req.body;
    try {
        console.log(email);
              const user = await AuthUser.findOne({ login_email: email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });

        const token = jwt.sign({ auth_id: user.auth_id, login_email: user.login_email },
            process.env.JWT_SECRET, { expiresIn: '1d' }
        );

        user.jwt_token = token;
        await user.save();

        res.status(200).json({
            message: 'Login successful',
            token,
            user: user
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.register = async(req, res) => {
    const { email, password, role } = req.body;

    try {
        // Check for existing user
        const existingUser = await AuthUser.findOne({ login_email: email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new AuthUser({
            auth_id: new mongoose.Types.ObjectId().toString(),
            login_email: email,
            password: hashedPassword,
            is_verified: false,
            jwt_token: '',
            role: role // initially empty, filled on login
        });
        await newUser.save();
        await create_auth_user_profiles(newUser);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const create_auth_user_profiles = async(authUser) => {
    let role = authUser.role;
    let _id = authUser._id
    let email = authUser.login_email

    if (role === 'student') {
        const newStudent = new Student({
            authUser: _id,
            rollNo: generateStudentRollNo(), // example roll number
            email: email,
            firstName: '', // replace with actual input
            lastName: '',
            gender: '',
            mobile: '',
            fatherName: '',
            motherName: '',
            address: '',
            picture: '',
            courses: [],
            department: '',
        });

        await newStudent.save();
        console.log('🎓 Student profile created');
    } else if (role === 'teacher') {
        const newTeacher = new Teacher({
            authUser: _id,
            email: email,
            name: '', // replace with actual input
            phone: '',
            gender: '',
            teacherId: generateTeacherId(), // example teacher ID
            department: '',
            qualification: '',
        });

        await newTeacher.save();
        console.log('👨‍🏫 Teacher profile created');
    } else {
        throw new Error(`Unsupported role: ${role}`);
    }
}

const generateStudentRollNo = () => {
    const year = new Date().getFullYear();
    const randomDigits = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
    return `S-${year}-${randomDigits}`;
};


const generateTeacherId = () => {
    const deptCode = "TCH"; // You can make this dynamic based on department
    const timestamp = Date.now().toString().slice(-5); // last 5 digits for brevity
    const randomChar = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // A-Z
    return `${deptCode}-${timestamp}${randomChar}`;
};