import Question from "../models/questionsModel.js";
import Submission from "../models/submissionModel.js";
import Test from "../models/testModel.js";

export const createTest = async (req, res) => {
    const { title, description } = req.body;

    // validateing inputs
    if (!title || !description) {
        return res.status(400).json({ message: "All fields are required" });
    }
     const testTitle = await Test.findOne( { title: title });

    //  checking if title already exists
     if(testTitle){
        return res.status(400).json({ message: "Test with the same title already exists" });
     }

    //  creating new test and saving it to the database
     const newTest = new Test({
        title,
        description,
     })

     await newTest.save();
     res.status(201).json(newTest);
};

export const createQuestion = async (req, res) => {
    try {
        const { questions } = req.body;

        // validateing questions array
        if (!questions || !Array.isArray(questions)) {
            return res.status(400).json({ message: "Questions field must be an array" });
        }

        // inserting questions in the database
        const insertedQuestions = await Question.insertMany(questions);

        // Geting the inserted question IDs and the test ID
        const questionIds = insertedQuestions.map((question) => question._id);
        const testId = questions[0].testId;

        // updating the test questions
        await Test.findByIdAndUpdate(testId, {
            $push: { questions: { $each: questionIds } }
        });

        res.status(201).json({ message: 'Questions added successfully', questions: insertedQuestions });
    } catch (error) {
        console.error('Error inserting questions:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getTest = async (req, res) => {
    const id = req.params.id;

    try {
        // finding the test by its Id and populating the questions array
        const test = await Test.findById(id).populate({
                path: 'questions',
                select: '-correctOption' // removing the 'correctOption' field
        });
         if(!test){
             return res.status(404).json({ message: 'Test not found' });
         }
         res.status(200).json({ message: 'Test successfully downloaded', questions: test.questions });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error"})
        console.log(error);
    }

}

export const submitTest = async (req, res) => {
    const { testId, userId, selections } = req.body;

    try {
        // Validate request body
        if (!testId || !userId || !Array.isArray(selections)) {
            return res.status(400).json({ message: 'Invalid input data' });
        }

        // Create a new submission document
        const newSubmission = new Submission({
            testId,
            userId,
            selections,
            endedAt: new Date() // Set the end time as now
        });

        // Save the submission to the database
        await newSubmission.save();

        // Respond with success
        res.status(201).json({ message: 'Test submitted successfully', submission: newSubmission });
    } catch (error) {
        console.error('Error saving submission:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
