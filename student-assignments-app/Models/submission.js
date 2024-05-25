const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');
const Assignment = require('./assignment');
const User = require('./user');

const Submission = sequelize.define('Submission', {
    assignmentId: {
        type: DataTypes.INTEGER,
        references: {
            model: Assignment,
            key: 'id'
        },
        allowNull: false
    },
    studentUsername: {
        type: DataTypes.STRING,
        references: {
            model: User,
            key: 'username'
        },
        allowNull: false
    },
    submissionContent: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    score: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
});

Assignment.hasMany(Submission, { foreignKey: 'assignmentId' });
User.hasMany(Submission, { foreignKey: 'username' });
Submission.belongsTo(Assignment, { foreignKey: 'assignmentId' });
Submission.belongsTo(User, { foreignKey: 'username' });

module.exports = Submission;
