import cron from 'node-cron';
import nodemailer from 'nodemailer';
import Submission from '../models/submissionModel.js';
import Question from '../models/questionsModel.js';
import User from '../models/userModel.js';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
});

const evaluateAndSendEmails = async () => {
    try {
        const submissions = await Submission.find({ isDeleted: false })
        .populate('testId userId selections.questionId');

      for (const submission of submissions) {
        const test = submission.testId;

        const questions = await Question.find({ _id: { $in: test.questions } });

        let score = 0;

        console.log(`Evaluating submission for user ${submission.userId._id}:`);

        // Iterating through selections to calculate score
        for (const selection of submission.selections) {
          const question = questions.find(q => q._id.toString() === selection.questionId._id.toString());

          if (question) {
            console.log(`Checking question ${question._id} with correct option "${question.correctOption}" against selected option "${selection.option}"`);
            if (question.correctOption.trim().toLowerCase() === selection.option.trim().toLowerCase()) {
              console.log(`Correct answer for question ${question._id}. Adding ${question.marks} marks.`);
              score += question.marks;
            } else {
              console.log(`Incorrect answer for question ${question._id}.`);
            }
          } else {
            console.log(`Question with ID ${selection.questionId._id} not found in the test.`);
          }
        }

        // Preparing email content
        const user = await User.findById(submission.userId).exec();
        if (!user) {
          console.log(`User with ID ${submission.userId} not found.`);
          continue;
        }

        const mailOptions = {
          from: process.env.EMAIL,
          to: user.email,
          subject: 'Your Test Score',
          html: `
                <div class="container">
                    <div class="header">
                        <h1>Test Evaluation Results</h1>
                    </div>
                    <p>Dear ${user.name},</p>
                    <p>Thank you for completing the test. Here are your results:</p>
                    <ul>
                        <li><strong>Score:</strong> ${test.name}</li>
                        <li><strong>Score:</strong> ${score}</li>
                    </ul>
                    <p>We hope you are satisfied with your performance. If you have any questions or need further clarification, feel free to reach out.</p>
                    <p class="footer">Best Regards,<br/>CIPHER SCHOOLS ASSIGNMENT</p>
                </div>
          `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Score email sent to ${user.email}`);
      }
    } catch (error) {
      console.error('Error evaluating scores or sending emails:', error);
    }
  };

cron.schedule('0 * * * *', evaluateAndSendEmails);

evaluateAndSendEmails();
