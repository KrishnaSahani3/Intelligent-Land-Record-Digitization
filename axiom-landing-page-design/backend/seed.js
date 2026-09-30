const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const districts = ['Lucknow', 'Agra', 'Kanpur Nagar', 'Prayagraj', 'Varanasi', 'Ayodhya', 'Gorakhpur', 'Barabanki', 'Unnao', 'Sitapur'];
const tehsils = { 'Lucknow': ['Sadar', 'Mohanlalganj', 'Bakshi Ka Talab'], 'Agra': ['Sadar', 'Kheragarh', 'Fatehabad'], 'Kanpur Nagar': ['Sadar', 'Bilhaur', 'Ghatampur'], 'Prayagraj': ['Sadar', 'Soraon', 'Phulpur'], 'Varanasi': ['Sadar', 'Pindra', 'Rajatalab'], 'Ayodhya': ['Sadar', 'Bikapur', 'Sohawal'], 'Gorakhpur': ['Sadar', 'Khajni', 'Campierganj'], 'Barabanki': ['Nawabganj', 'Fatehpur', 'Ram Sanehi Ghat'], 'Unnao': ['Sadar', 'Hasanganj', 'Purwa'], 'Sitapur': ['Sadar', 'Misrikh', 'Biswan'] };
const villages = ['Kakori', 'Malihabad', 'Chinhat', 'Mohanlalganj', 'Bakshi Ka Talab', 'Alambagh', 'Amausi', 'Gomti Nagar', 'Indira Nagar', 'Rajajipuram', 'Sarojini Nagar', 'Hazratganj', 'Chowk', 'Aminabad', 'Daliganj', 'Aliganj', 'Vikas Nagar', 'Madiaon', 'Itaunja', 'Gosainganj'];
const firstNames = ['Ramesh', 'Suresh', 'Mahesh', 'Rajesh', 'Dinesh', 'Mukesh', 'Rakesh', 'Girish', 'Manish', 'Satish', 'Priya', 'Sunita', 'Kavita', 'Anita', 'Meena', 'Geeta', 'Sita', 'Laxmi', 'Parvati', 'Durga'];
const lastNames = ['Kumar', 'Singh', 'Sharma', 'Verma', 'Gupta', 'Yadav', 'Mishra', 'Pandey', 'Tiwari', 'Dubey', 'Srivastava', 'Chauhan', 'Patel', 'Rawat', 'Jaiswal'];
const landTypes = ['Agricultural', 'Residential', 'Commercial', 'Industrial', 'Barren', 'Forest', 'Grazing'];
const statuses = ['Verified', 'Requires Review', 'Conflict Detected'];
const disputeTypes = ['Ownership Dispute', 'Boundary Dispute', 'Encroachment', 'Mutation Issue', 'Area Mismatch', 'Duplicate Ownership', 'Incorrect Record', 'Missing Record'];
const complaintStatuses = ['Submitted', 'Document Verification', 'Assigned', 'Under Investigation', 'Field Verification', 'Resolution Proposed', 'Resolved', 'Rejected'];
const docTypes = ['Khatauni', 'Sale Deed', 'Registry', 'Mutation Document', 'Survey Document', 'Identity Document'];
const conflictTypes = ['Owner Mismatch', 'Area Mismatch', 'Khasra Mismatch', 'Khata Mismatch', 'Village Mismatch', 'ULPIN Mismatch', 'Mutation Inconsistency', 'Registration Inconsistency', 'Duplicate Record'];
const severities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const conflictStatuses = ['Open', 'Under Review', 'Resolved', 'Dismissed'];
const officerNames = ['Amit Verma', 'Priya Sharma', 'Ravi Kumar', 'Sneha Gupta', 'Vikram Singh', 'Anjali Mishra', 'Deepak Pandey', 'Neha Tiwari', 'Sunil Yadav', 'Pooja Srivastava'];
const officerRoles = ['Revenue Officer', 'Sub-Registrar', 'Admin', 'Auditor', 'Lekhpal'];

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randNum(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randFloat(min, max) { return (Math.random() * (max - min) + min).toFixed(2); }
function genULPIN() { return `UP-${randNum(100,999)}-${randNum(1000,9999)}-${randNum(10000,99999)}`; }
function genComplaintId(i) { return `LRD-2026-${String(i).padStart(5,'0')}`; }

async function main() {
  console.log('Clearing existing data...');
  await prisma.notification.deleteMany();
  await prisma.conflict.deleteMany();
  await prisma.document.deleteMany();
  await prisma.mutation.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.complaint.deleteMany();
  await prisma.officer.deleteMany();
  await prisma.landRecord.deleteMany();

  console.log('Seeding Officers...');
  const officers = [];
  for (let i = 0; i < 10; i++) {
    const o = await prisma.officer.create({ data: {
      name: officerNames[i],
      role: rand(officerRoles),
      district: districts[i],
      status: i < 8 ? 'Active' : 'Inactive',
      lastLogin: new Date(Date.now() - randNum(0, 7) * 86400000),
    }});
    officers.push(o);
  }

  console.log('Seeding 150 Land Records...');
  const records = [];
  for (let i = 0; i < 150; i++) {
    const dist = rand(districts);
    const teh = rand(tehsils[dist]);
    const st = i < 90 ? 'Verified' : (i < 120 ? 'Requires Review' : 'Conflict Detected');
    const conf = st === 'Verified' ? randFloat(82, 99) : (st === 'Requires Review' ? randFloat(55, 81) : randFloat(40, 75));
    const r = await prisma.landRecord.create({ data: {
      ownerName: `${rand(firstNames)} ${rand(lastNames)}`,
      fatherHusbandName: `${rand(firstNames)} ${rand(lastNames)}`,
      khasraGataNumber: String(randNum(1, 999)),
      khataNumber: String(randNum(1, 500)),
      village: rand(villages),
      tehsil: teh,
      district: dist,
      landArea: `${randFloat(0.1, 25)} Hectares`,
      landType: rand(landTypes),
      mutationNumber: `MUT-${randNum(1000, 9999)}`,
      surveyNumber: `SRV-${randNum(100, 999)}`,
      documentNumber: `DOC-${randNum(1000, 9999)}`,
      registrationDate: `${randNum(1, 28)}/${randNum(1,12)}/${randNum(2018, 2026)}`,
      ulpin: genULPIN(),
      registrationNumber: `REG-${dist.substring(0,3).toUpperCase()}-${randNum(10000, 99999)}`,
      status: st,
      ocrConfidence: parseFloat(conf),
      createdAt: new Date(Date.now() - randNum(0, 365) * 86400000),
    }});
    records.push(r);
  }

  console.log('Seeding 75 Documents...');
  for (let i = 0; i < 75; i++) {
    const rec = records[i % records.length];
    const conf = randFloat(50, 99);
    await prisma.document.create({ data: {
      landRecordId: rec.id,
      type: rand(docTypes),
      ocrStatus: parseFloat(conf) > 80 ? 'Completed' : 'Needs Review',
      confidence: parseFloat(conf),
      verificationStatus: parseFloat(conf) > 80 ? 'Auto-Verified' : 'Pending Human Review',
      uploadDate: new Date(Date.now() - randNum(0, 180) * 86400000),
    }});
  }

  console.log('Seeding 20 Mutation Histories...');
  for (let i = 0; i < 20; i++) {
    const rec = records[i];
    const mutStatuses = ['Pending', 'Under Verification', 'Approved', 'Rejected'];
    await prisma.mutation.create({ data: {
      landRecordId: rec.id,
      previousOwner: `${rand(firstNames)} ${rand(lastNames)}`,
      newOwner: rec.ownerName,
      reason: rand(['Inheritance', 'Sale', 'Gift', 'Court Order', 'Government Acquisition']),
      status: rand(mutStatuses),
      verifiedBy: rand(officerNames),
      date: new Date(Date.now() - randNum(30, 730) * 86400000),
    }});
  }

  console.log('Seeding 30 Conflicts...');
  for (let i = 0; i < 30; i++) {
    const rec = records[120 + (i % 30)];
    const ctype = rand(conflictTypes);
    let digitalVal = '', uploadVal = '';
    if (ctype === 'Area Mismatch') { digitalVal = `${randFloat(1,10)} Hectares`; uploadVal = `${randFloat(1,10)} Hectares`; }
    else if (ctype === 'Owner Mismatch') { digitalVal = rec.ownerName; uploadVal = `${rand(firstNames)} ${rand(lastNames)}`; }
    else { digitalVal = `Value-A-${randNum(100,999)}`; uploadVal = `Value-B-${randNum(100,999)}`; }

    await prisma.conflict.create({ data: {
      landRecordId: rec.id,
      type: ctype,
      severity: rand(severities),
      description: `${ctype} detected between uploaded document and database record for Khasra ${rec.khasraGataNumber}, ${rec.village}.`,
      digitalValue: digitalVal,
      uploadedValue: uploadVal,
      status: rand(conflictStatuses),
      detectedAt: new Date(Date.now() - randNum(0, 90) * 86400000),
    }});
  }

  console.log('Seeding 30 Complaints...');
  for (let i = 0; i < 30; i++) {
    const rec = records[randNum(0, 149)];
    await prisma.complaint.create({ data: {
      complaintId: genComplaintId(i + 1),
      complainantName: `${rand(firstNames)} ${rand(lastNames)}`,
      mobileNumber: `98${randNum(10000000, 99999999)}`,
      district: rec.district,
      tehsil: rec.tehsil,
      village: rec.village,
      khasraGataNumber: rec.khasraGataNumber,
      khataNumber: rec.khataNumber,
      disputeType: rand(disputeTypes),
      description: `Dispute regarding land record Khasra ${rec.khasraGataNumber} in ${rec.village}. The complainant alleges discrepancies in the official records.`,
      oppositePartyName: `${rand(firstNames)} ${rand(lastNames)}`,
      status: rand(complaintStatuses),
      priority: rand(['Low', 'Medium', 'High', 'Critical']),
      assignedOfficer: rand(officerNames),
      createdAt: new Date(Date.now() - randNum(0, 120) * 86400000),
    }});
  }

  console.log('Seeding 30 Notifications...');
  const notifTypes = [
    { title: 'OCR Below Threshold', message: 'OCR confidence 63.2% for document DOC-XXXX. Human verification required.', type: 'warning' },
    { title: 'New Complaint Assigned', message: 'Complaint LRD-2026-00012 has been assigned to you for investigation.', type: 'info' },
    { title: 'Conflict Detected', message: 'Area mismatch detected for Khasra 145, Kakori, Lucknow.', type: 'alert' },
    { title: 'Field Verification Scheduled', message: 'Field verification for Case LRD-2026-00008 scheduled for 05 Oct 2026.', type: 'info' },
    { title: 'Document Uploaded', message: 'New sale deed uploaded for Khasra 278, Chinhat.', type: 'info' },
    { title: 'Complaint Status Changed', message: 'Complaint LRD-2026-00003 moved to Under Investigation.', type: 'info' },
    { title: 'Resolution Submitted', message: 'Resolution for Case LRD-2026-00005 submitted by Officer Amit Verma.', type: 'success' },
    { title: 'Human Verification Required', message: 'Record Khasra 512 needs manual review. OCR confidence: 48.7%.', type: 'warning' },
  ];
  for (let i = 0; i < 30; i++) {
    const n = notifTypes[i % notifTypes.length];
    await prisma.notification.create({ data: {
      title: n.title,
      message: n.message,
      type: n.type,
      read: i > 15,
      createdAt: new Date(Date.now() - randNum(0, 30) * 86400000),
    }});
  }

  console.log('Seeding 30 Audit Logs...');
  const auditActions = ['Record Created', 'Record Updated', 'Status Changed', 'OCR Processed', 'Conflict Detected', 'Complaint Filed', 'Field Verification', 'Resolution Submitted', 'Document Uploaded', 'Mutation Approved'];
  for (let i = 0; i < 30; i++) {
    const rec = records[i % records.length];
    const action = rand(auditActions);
    await prisma.auditLog.create({ data: {
      action: action,
      user: rand(officerNames),
      recordId: rec.id.substring(0, 8),
      details: `${action} for Khasra ${rec.khasraGataNumber}, ${rec.village}, ${rec.district}.`,
      oldValue: action === 'Status Changed' ? 'Requires Review' : null,
      newValue: action === 'Status Changed' ? 'Verified' : null,
      timestamp: new Date(Date.now() - randNum(0, 60) * 86400000),
    }});
  }

  console.log('Seeding complete! Summary:');
  console.log(`  Land Records: ${await prisma.landRecord.count()}`);
  console.log(`  Documents: ${await prisma.document.count()}`);
  console.log(`  Mutations: ${await prisma.mutation.count()}`);
  console.log(`  Conflicts: ${await prisma.conflict.count()}`);
  console.log(`  Complaints: ${await prisma.complaint.count()}`);
  console.log(`  Officers: ${await prisma.officer.count()}`);
  console.log(`  Notifications: ${await prisma.notification.count()}`);
  console.log(`  Audit Logs: ${await prisma.auditLog.count()}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
