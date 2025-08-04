// author: Ibrahim Azaan Mauroof
// socials: https://linktr.ee/angzhen

const PatientFeedback = require("../models/patientFeedbackModel");
const {
    snsClient
} = require("../../shared/aws-config");
const {
    PublishCommand
} = require("@aws-sdk/client-sns");

// handles patient feedback submission
const submitFeedback = async (req, res) => {
    const {
        feedbackType,
        message
    } = req.body;
    const patientId = req.user.sub;

    if (!patientId || !feedbackType || !message) {
        return res.status(400).json({
            message: "All fields are required."
        });
    }

    try {
        // save feedback to db
        const newFeedback = new PatientFeedback({
            patientId,
            feedbackType,
            message,
        });
        await newFeedback.save();

        // publish message to topic
        const params = {
            Message: `New feedback submitted by Patient ID: ${patientId}. Feedback Type: ${feedbackType}.`,
            Subject: "New Patient Feedback",
            TopicArn: process.env.SNS_TOPIC_ARN,
        };

        const command = new PublishCommand(params);
        const data = await snsClient.send(command);

        console.log("SNS Message published successfully:", data.MessageId);

        res.status(201).json({
            message: "Feedback submitted successfully.",
            snsMessageId: data.MessageId,
            feedback: newFeedback
        });

    } catch (error) {
        console.error("Error submitting feedback or publishing to SNS:", error);
        res.status(500).json({
            message: "Server error.",
            error: error.message
        });
    }
};

// handles retrieving patient feedback
const getFeedback = async (req, res) => {
    try {
        const patientId = req.user.sub;
        const feedback = await PatientFeedback.find({
            patientId
        }).sort({
            createdAt: -1
        });

        if (!feedback.length) {
            return res.status(200).json({
                message: 'No feedback found for this patient.',
                feedback: [],
            });
        }

        res.status(200).json({
            message: 'Feedback retrieved successfully.',
            feedback,
        });
    } catch (err) {
        console.error('Feedback fetch error:', err);
        res.status(500).json({
            error: 'Failed to retrieve feedback.'
        });
    }
};

module.exports = {
    submitFeedback,
    getFeedback
};