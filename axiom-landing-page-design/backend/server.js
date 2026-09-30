const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');

const app = express();
const prisma = new PrismaClient();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

// ====== COMPLAINTS API ======
app.post('/api/complaints', async (req, res) => {
  try {
    const body = req.body;
    const count = await prisma.complaint.count();
    const complaintId = `LRD-${new Date().getFullYear()}-${(count + 1).toString().padStart(6, '0')}`;

    const newComplaint = await prisma.complaint.create({
      data: {
        complaintId,
        complainantName: body.complainantName,
        mobileNumber: body.mobileNumber,
        district: body.district,
        tehsil: body.tehsil,
        village: body.village,
        khasraGataNumber: body.khasraGataNumber,
        khataNumber: body.khataNumber,
        disputeType: body.disputeType,
        description: body.description,
        oppositePartyName: body.oppositePartyName,
        evidenceUrl: body.evidenceUrl,
      },
    });

    res.json({ success: true, complaint: newComplaint });
  } catch (error) {
    console.error('Error creating complaint:', error);
    res.status(500).json({ success: false, error: 'Failed to create complaint' });
  }
});

app.get('/api/complaints', async (req, res) => {
  try {
    const complaintId = req.query.complaintId;

    if (complaintId) {
      const complaint = await prisma.complaint.findUnique({
        where: { complaintId },
      });
      return res.json({ success: true, complaint });
    }

    const complaints = await prisma.complaint.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, complaints });
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch complaints' });
  }
});

app.patch('/api/complaints/:id/status', async (req, res) => {
  try {
    const { status, assignedOfficer } = req.body;
    const updateData = {};
    if (status) updateData.status = status;
    if (assignedOfficer) updateData.assignedOfficer = assignedOfficer;

    const updatedComplaint = await prisma.complaint.update({
      where: { id: req.params.id },
      data: updateData,
    });

    res.json({ success: true, complaint: updatedComplaint });
  } catch (error) {
    console.error('Error updating complaint status:', error);
    res.status(500).json({ success: false, error: 'Failed to update complaint' });
  }
});

// ====== LAND RECORDS API ======
app.post('/api/records', async (req, res) => {
  try {
    const newRecord = await prisma.landRecord.create({
      data: {
        ownerName: req.body.ownerName,
        fatherHusbandName: req.body.fatherHusbandName,
        khasraGataNumber: req.body.khasraGataNumber,
        khataNumber: req.body.khataNumber,
        village: req.body.village,
        tehsil: req.body.tehsil,
        district: req.body.district,
        landArea: req.body.landArea,
        landType: req.body.landType,
        mutationNumber: req.body.mutationNumber,
        surveyNumber: req.body.surveyNumber,
        documentNumber: req.body.documentNumber,
        registrationDate: req.body.registrationDate,
        registrationNumber: req.body.registrationNumber,
        ulpin: req.body.ulpin,
        ocrConfidence: req.body.ocrConfidence ? parseFloat(req.body.ocrConfidence) : null,
        status: req.body.status || 'Requires Review',
      },
    });

    res.json({ success: true, record: newRecord });
  } catch (error) {
    console.error('Error saving land record:', error);
    res.status(500).json({ success: false, error: 'Failed to save record' });
  }
});

app.get('/api/records', async (req, res) => {
  try {
    const { district, tehsil, village, khasraGataNumber, khataNumber, ownerName, status } = req.query;
    
    let whereClause = {};
    if (district) whereClause.district = { contains: district };
    if (tehsil) whereClause.tehsil = { contains: tehsil };
    if (village) whereClause.village = { contains: village };
    if (khasraGataNumber) whereClause.khasraGataNumber = { contains: khasraGataNumber };
    if (khataNumber) whereClause.khataNumber = { contains: khataNumber };
    if (ownerName) whereClause.ownerName = { contains: ownerName };
    if (status) whereClause.status = status;

    const records = await prisma.landRecord.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, records });
  } catch (error) {
    console.error('Error fetching land records:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch records' });
  }
});

app.get('/api/records/:id', async (req, res) => {
  try {
    const record = await prisma.landRecord.findUnique({
      where: { id: req.params.id },
      include: { mutations: true, documents: true, conflicts: true },
    });
    if (!record) return res.status(404).json({ success: false, error: 'Record not found' });
    res.json({ success: true, record });
  } catch (error) {
    console.error('Error fetching record by ID:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch record' });
  }
});

app.post('/api/records/validate', async (req, res) => {
  try {
    const { khasraGataNumber, khataNumber, village, ownerName, landArea } = req.body;
    const conflicts = [];
    let status = 'Verified';

    if (khasraGataNumber && village) {
      const existingRecords = await prisma.landRecord.findMany({
        where: { khasraGataNumber, village },
      });

      if (existingRecords.length > 0) {
        for (const record of existingRecords) {
          if (record.ownerName && ownerName && record.ownerName.trim().toLowerCase() !== ownerName.trim().toLowerCase()) {
            conflicts.push(`POTENTIAL OWNERSHIP CONFLICT: Khasra ${khasraGataNumber} is also registered under ${record.ownerName}`);
            status = 'Conflict Detected';
          }
          if (record.landArea && landArea && record.landArea !== landArea) {
            conflicts.push(`AREA MISMATCH: Existing record shows ${record.landArea}, new record shows ${landArea}`);
            status = 'Conflict Detected';
          }
        }
      }
    }

    if (!ownerName || !khasraGataNumber) {
      conflicts.push(`MISSING FIELDS: Owner Name and Khasra/Gata Number are required.`);
      status = 'Requires Review';
    }

    res.json({ success: true, status, conflicts, message: conflicts.length > 0 ? 'Conflicts detected' : 'Record is valid' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to validate record' });
  }
});

// ====== MUTATIONS API ======
app.get('/api/mutations', async (req, res) => {
  try {
    const { landRecordId } = req.query;
    const where = landRecordId ? { landRecordId } : {};
    const mutations = await prisma.mutation.findMany({ where, orderBy: { date: 'desc' } });
    res.json({ success: true, mutations });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch mutations' });
  }
});

// ====== DOCUMENTS API ======
app.get('/api/documents', async (req, res) => {
  try {
    const { landRecordId } = req.query;
    const where = landRecordId ? { landRecordId } : {};
    const documents = await prisma.document.findMany({
      where,
      include: { landRecord: { select: { khasraGataNumber: true, village: true, ownerName: true } } },
      orderBy: { uploadDate: 'desc' },
    });
    res.json({ success: true, documents });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch documents' });
  }
});

// ====== CONFLICTS API ======
app.get('/api/conflicts', async (req, res) => {
  try {
    const { severity, type, status, district } = req.query;
    let where = {};
    if (severity) where.severity = severity;
    if (type) where.type = type;
    if (status) where.status = status;

    const conflicts = await prisma.conflict.findMany({
      where,
      include: { landRecord: { select: { khasraGataNumber: true, khataNumber: true, village: true, district: true, ownerName: true } } },
      orderBy: { detectedAt: 'desc' },
    });
    res.json({ success: true, conflicts });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch conflicts' });
  }
});

app.patch('/api/conflicts/:id', async (req, res) => {
  try {
    const conflict = await prisma.conflict.update({
      where: { id: req.params.id },
      data: { status: req.body.status },
    });
    res.json({ success: true, conflict });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update conflict' });
  }
});

// ====== NOTIFICATIONS API ======
app.get('/api/notifications', async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({ orderBy: { createdAt: 'desc' } });
    const unreadCount = await prisma.notification.count({ where: { read: false } });
    res.json({ success: true, notifications, unreadCount });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch notifications' });
  }
});

app.patch('/api/notifications/:id/read', async (req, res) => {
  try {
    await prisma.notification.update({ where: { id: req.params.id }, data: { read: true } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to mark notification as read' });
  }
});

// ====== OFFICERS API ======
app.get('/api/officers', async (req, res) => {
  try {
    const officers = await prisma.officer.findMany({ orderBy: { name: 'asc' } });
    res.json({ success: true, officers });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch officers' });
  }
});

// ====== AUDIT LOGS API ======
app.get('/api/audit-logs', async (req, res) => {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { timestamp: 'desc' },
    });
    res.json({ success: true, logs });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch audit logs' });
  }
});

// ====== ANALYTICS API ======
app.get('/api/analytics/disputes', async (req, res) => {
  try {
    const complaints = await prisma.complaint.findMany();
    const byDistrict = {};
    const byType = {};
    let pending = 0, resolved = 0;
    complaints.forEach(c => {
      byDistrict[c.district] = (byDistrict[c.district] || 0) + 1;
      byType[c.disputeType] = (byType[c.disputeType] || 0) + 1;
      if (c.status === 'Resolved') resolved++;
      else pending++;
    });
    res.json({ success: true, analytics: { byDistrict, byType, pending, resolved, total: complaints.length } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch analytics' });
  }
});

app.get('/api/analytics/conflicts', async (req, res) => {
  try {
    const conflicts = await prisma.conflict.findMany();
    const byType = {};
    const bySeverity = {};
    conflicts.forEach(c => {
      byType[c.type] = (byType[c.type] || 0) + 1;
      bySeverity[c.severity] = (bySeverity[c.severity] || 0) + 1;
    });
    res.json({ success: true, analytics: { byType, bySeverity, total: conflicts.length } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch conflict analytics' });
  }
});

// ====== SYSTEM HEALTH API ======
app.get('/api/system-health', async (req, res) => {
  try {
    // Check database connectivity
    await prisma.$queryRaw`SELECT 1`;
    const dbStatus = 'ONLINE';

    // Check OCR service
    let ocrStatus = 'OFFLINE';
    try {
      const ocrCheck = await fetch('http://localhost:8000/docs');
      if (ocrCheck.ok) ocrStatus = 'ONLINE';
    } catch (e) { ocrStatus = 'OFFLINE'; }

    res.json({
      success: true,
      services: {
        database: { status: dbStatus, name: 'SQLite Database' },
        ocr: { status: ocrStatus, name: 'AI OCR Engine (FastAPI)' },
        gis: { status: 'ONLINE', name: 'GIS / Cadastral Service' },
        complaintApi: { status: 'ONLINE', name: 'Complaint Management API' },
        governmentApi: { status: 'DEMO MODE', name: 'Government Data Provider' },
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Health check failed' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend Server running on port ${PORT}`);
});