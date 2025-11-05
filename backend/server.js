const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sql = require('mssql');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// SQL Server configuration - HARDCODED
const config = {
    server: 'VINOD',
    database: 'FAREQuestionnaire',
    options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true,
        trustedConnection: true
    }
};

// Connect to database
console.log('Attempting to connect to SQL Server...');
sql.connect(config)
    .then(pool => {
        console.log('✅ SUCCESS! Connected to SQL Server');
        return pool;
    })
    .catch(err => {
        console.error('❌ FAILED to connect to SQL Server');
        console.error('Error details:', err.message);
    });

// Test endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Backend API is working!',
        timestamp: new Date().toISOString()
    });
});

// Save questionnaire endpoint
app.post('/api/questionnaires', async (req, res) => {
    console.log('📥 Received questionnaire data');
    
    try {
        const { questionnaire, responses } = req.body;
        
        console.log('Questionnaire ID:', questionnaire.questionnaire_id);
        console.log('Number of responses:', responses.length);
        
        const pool = await sql.connect(config);
        const transaction = new sql.Transaction(pool);
        
        await transaction.begin();
        
        try {
            // Insert questionnaire
            console.log('Inserting questionnaire...');
            const questionnaireRequest = new sql.Request(transaction);
            
            await questionnaireRequest
                .input('questionnaire_id', sql.UniqueIdentifier, questionnaire.questionnaire_id)
                .input('interviewer_id', sql.NVarChar(50), questionnaire.interviewer_id || null)
                .input('youth_id', sql.NVarChar(50), questionnaire.youth_id || null)
                .input('effective_date', sql.DateTime2, new Date(questionnaire.effective_date))
                .input('completed_date', sql.DateTime2, new Date(questionnaire.completed_date))
                .input('status', sql.NVarChar(20), questionnaire.status)
                .query(`
                    INSERT INTO Questionnaires 
                    (questionnaire_id, interviewer_id, youth_id, effective_date, completed_date, status, created_at, updated_at)
                    VALUES 
                    (@questionnaire_id, @interviewer_id, @youth_id, @effective_date, @completed_date, @status, GETDATE(), GETDATE())
                `);
            
            console.log('✅ Questionnaire inserted');
            
            // Insert responses
            console.log('Inserting responses...');
            let responseCount = 0;
            
            for (const response of responses) {
                const responseRequest = new sql.Request(transaction);
                
                await responseRequest
                    .input('response_id', sql.UniqueIdentifier, response.response_id)
                    .input('questionnaire_id', sql.UniqueIdentifier, response.questionnaire_id)
                    .input('question_id', sql.NVarChar(50), response.question_id)
                    .input('question_section', sql.Int, response.question_section)
                    .input('question_text', sql.NVarChar(sql.MAX), response.question_text)
                    .input('question_category', sql.NVarChar(100), response.question_category)
                    .input('response_value', sql.NVarChar(200), response.response_value)
                    .input('youth_comment', sql.NVarChar(sql.MAX), response.youth_comment || null)
                    .input('interviewer_comment', sql.NVarChar(sql.MAX), response.interviewer_comment || null)
                    .input('general_text_box', sql.NVarChar(sql.MAX), response.general_text_box || null)
                    .input('end_interview', sql.Bit, response.end_interview ? 1 : 0)
                    .input('potential_violation', sql.Bit, response.potential_violation ? 1 : 0)
                    .query(`
                        INSERT INTO QuestionResponses 
                        (response_id, questionnaire_id, question_id, question_section, question_text, 
                         question_category, response_value, youth_comment, interviewer_comment, 
                         general_text_box, end_interview, potential_violation, created_at)
                        VALUES 
                        (@response_id, @questionnaire_id, @question_id, @question_section, @question_text, 
                         @question_category, @response_value, @youth_comment, @interviewer_comment, 
                         @general_text_box, @end_interview, @potential_violation, GETDATE())
                    `);
                
                responseCount++;
            }
            
            console.log(`✅ Inserted ${responseCount} responses`);
            
            await transaction.commit();
            console.log('✅ Transaction committed successfully');
            
            res.status(201).json({
                success: true,
                message: 'Questionnaire saved successfully!',
                questionnaire_id: questionnaire.questionnaire_id,
                responses_count: responseCount
            });
            
        } catch (err) {
            console.error('❌ Error during transaction:', err.message);
            await transaction.rollback();
            throw err;
        }
        
    } catch (err) {
        console.error('❌ Error saving questionnaire:', err.message);
        res.status(500).json({ 
            success: false,
            error: err.message 
        });
    }
});

// Get all questionnaires
app.get('/api/questionnaires', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query(`
            SELECT * FROM Questionnaires 
            ORDER BY created_at DESC
        `);
        res.json(result.recordset);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Get interviewers
app.get('/api/interviewers', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT * FROM Interviewers WHERE active = 1');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get youths
app.get('/api/youths', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT * FROM Youths WHERE active = 1');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log('================================');
    console.log('🚀 BACKEND SERVER IS RUNNING!');
    console.log('================================');
    console.log(`Server: http://localhost:${PORT}`);
    console.log(`Health: http://localhost:${PORT}/api/health`);
    console.log('================================');
});