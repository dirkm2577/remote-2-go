"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const placeSubmissionsService_1 = require("../services/placeSubmissionsService");
const router = (0, express_1.Router)();
const placeSubmissionsService = new placeSubmissionsService_1.PlaceSubmissionsService();
// POST /api/place-submissions - Create a new place submission
router.post('/', async (req, res) => {
    try {
        const submissionData = req.body;
        // Basic validation
        if (!submissionData.name || !submissionData.address || !submissionData.city) {
            return res.status(400).json({
                success: false,
                error: 'Name, address, and city are required'
            });
        }
        const submission = await placeSubmissionsService.createSubmission(submissionData);
        res.status(201).json({
            success: true,
            data: submission,
            message: 'Place submission created successfully'
        });
    }
    catch (error) {
        console.error('Error creating place submission:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
// GET /api/place-submissions - Get all place submissions (for admin)
router.get('/', async (req, res) => {
    try {
        const submissions = await placeSubmissionsService.getAllSubmissions();
        res.json({
            success: true,
            data: submissions,
            count: submissions.length
        });
    }
    catch (error) {
        console.error('Error fetching place submissions:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
// PUT /api/place-submissions/:id/status - Update submission status (for admin)
router.put('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminNotes } = req.body;
        if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'Valid status is required (pending, approved, rejected)'
            });
        }
        const updatedSubmission = await placeSubmissionsService.updateSubmissionStatus(id, status, adminNotes);
        res.json({
            success: true,
            data: updatedSubmission,
            message: `Submission ${status} successfully`
        });
    }
    catch (error) {
        console.error('Error updating submission status:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
exports.default = router;
//# sourceMappingURL=placeSubmissions.js.map