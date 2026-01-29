const Clinic = require("../models/Clinic");
const Doctor = require("../models/Doctor");
const Slot = require("../models/Slot");
const { v4: uuid } = require("uuid");

async function seedEhrDataIfNeeded() {
  console.log("🧠 Checking EHR seed data...");

  /* ======================
     Clinics
  ====================== */
  const clinics = [
    { id: "clinic-1", name: "عيادة الأسنان" },
    { id: "clinic-2", name: "عيادة الجلدية" },
    { id: "clinic-3", name: "عيادة الباطنية" },
    { id: "clinic-4", name: "عيادة القلب" },
    { id: "clinic-5", name: "عيادة الأطفال" },
    { id: "clinic-6", name: "عيادة العيون" },
  ];

  for (const clinic of clinics) {
    await Clinic.findOrCreate({
      where: { id: clinic.id },
      defaults: clinic,
    });
  }

  console.log("✅ Clinics ensured");

  /* ======================
     Doctors
  ====================== */
  const doctors = [
    { id: "doc-1", clinic_id: "clinic-1", name: "الدكتورة سارة", specialty: "تنظيف وحشوات الأسنان" },
    { id: "doc-2", clinic_id: "clinic-1", name: "الدكتور محمد", specialty: "تقويم الأسنان" },

    { id: "doc-3", clinic_id: "clinic-2", name: "الدكتور أحمد", specialty: "جلدية" },
    { id: "doc-4", clinic_id: "clinic-2", name: "الدكتورة ريم", specialty: "ليزر وتصبغات" },

    { id: "doc-5", clinic_id: "clinic-3", name: "الدكتور خالد", specialty: "باطنية" },
    { id: "doc-6", clinic_id: "clinic-3", name: "الدكتورة نوف", specialty: "سكري وضغط" },

    { id: "doc-7", clinic_id: "clinic-4", name: "الدكتور عبدالله", specialty: "قلب" },
    { id: "doc-8", clinic_id: "clinic-4", name: "الدكتورة نورة", specialty: "قلب" },

    { id: "doc-9", clinic_id: "clinic-5", name: "الدكتور صالح", specialty: "أطفال" },
    { id: "doc-10", clinic_id: "clinic-5", name: "الدكتورة فاطمة", specialty: "أطفال" },

    { id: "doc-11", clinic_id: "clinic-6", name: "الدكتور سالم", specialty: "عيون" },
    { id: "doc-12", clinic_id: "clinic-6", name: "الدكتورة هالة", specialty: "عيون" },
  ];

  for (const doctor of doctors) {
    await Doctor.findOrCreate({
      where: { id: doctor.id },
      defaults: doctor,
    });
  }

  console.log("✅ Doctors ensured");

  /* ======================
     Slots (AUTO)
  ====================== */
  const allDoctors = await Doctor.findAll();

  for (const doctor of allDoctors) {
    const existingSlots = await Slot.count({
      where: { doctor_id: doctor.id },
    });

    if (existingSlots > 0) {
     // console.log(`⏭️ Slots already exist for ${doctor.name}`);
      continue;
    }

    const slots = [];
    const date = "2026-01-20"; // تاريخ افتراضي للـ MVP

    for (let hour = 9; hour <= 13; hour++) {
      slots.push({
        id: uuid(),
        doctor_id: doctor.id,
        clinic_id: doctor.clinic_id,
        date,
        time: `${hour}:00`,
        end_time: `${hour}:20`,
        status: "Available",
      });
    }

    await Slot.bulkCreate(slots);
    console.log(`🗓️ Slots created for ${doctor.name}`);
  }

  console.log("🎉 EHR seed completed successfully");
}

module.exports = seedEhrDataIfNeeded;




// const Clinic = require("../models/Clinic");
// const Doctor = require("../models/Doctor");
// const Slot = require("../models/Slot");
// const sequelize = require("../config/database");

// module.exports = async () => {
//   const transaction = await sequelize.transaction();
  
//   try {
//     console.log("📝 Seeding clinics and doctors (keeping existing data)...");

//     //  Clinics - Use findOrCreate to ensure all clinics are added
//     console.log("📝 Seeding clinics...");
//     const clinicData = [
//       { id: "clinic-1", name: "عيادة الأسنان" },
//       { id: "clinic-2", name: "عيادة الجلدية" },
//       { id: "clinic-3", name: "عيادة الباطنية" },
//       { id: "clinic-4", name: "عيادة القلب" },
//       { id: "clinic-5", name: "عيادة الأطفال" },
//       { id: "clinic-6", name: "عيادة العيون" },
//     ];

//     let createdClinics = 0;
//     let existingClinics = 0;
//     for (const clinic of clinicData) {
//       const [clinicInstance, created] = await Clinic.findOrCreate({
//         where: { id: clinic.id },
//         defaults: clinic,
//         transaction
//       });
//       if (created) {
//         createdClinics++;
//         console.log(`  ✅ Created clinic: ${clinic.id} - ${clinic.name}`);
//       } else {
//         existingClinics++;
//         console.log(`  ⏭️  Clinic already exists: ${clinic.id} - ${clinic.name}`);
//       }
//     }
//     console.log(`✅ Clinics: ${createdClinics} created, ${existingClinics} already existed`);

//     // Doctors - Use findOrCreate to ensure all doctors are added
//     console.log("📝 Seeding doctors...");
//     const doctorData = [
//       // عيادة الأسنان
//       { id: "doc-1", clinic_id: "clinic-1", name: "الدكتورة سارة", specialty: "تنظيف وحشوات الأسنان" },
//       { id: "doc-2", clinic_id: "clinic-1", name: "الدكتور محمد", specialty: "تقويم الأسنان" },

//       // عيادة الجلدية
//       { id: "doc-3", clinic_id: "clinic-2", name: "الدكتور أحمد", specialty: "علاج الأكزيما وحب الشباب" },
//       { id: "doc-4", clinic_id: "clinic-2", name: "الدكتورة ريم", specialty: "الليزر التجميلي وعلاج التصبغات" },

//       // عيادة الباطنية
//       { id: "doc-5", clinic_id: "clinic-3", name: "الدكتور خالد", specialty: "أمراض الجهاز الهضمي" },
//       { id: "doc-6", clinic_id: "clinic-3", name: "الدكتورة نوف", specialty: "السكري وارتفاع ضغط الدم" },
//       // عيادة القلب
//       { id: "doc-7", clinic_id: "clinic-4", name: "الدكتور عبدالله", specialty:"أمراض قلب" },
//       { id: "doc-8", clinic_id: "clinic-4", name: "الدكتورة نورة", specialty: "أمراض قلب"},
//       // عيادة الأطفال
//       { id: "doc-9", clinic_id: "clinic-5", name: "الدكتور صالح", specialty: "أمراض الجهاز الهضمي" },
//       { id: "doc-10", clinic_id: "clinic-5", name: "الدكتورة فاطمة", specialty: "السكري وارتفاع ضغط الدم" },
//      // عيادة العيون
//       { id: "doc-11", clinic_id: "clinic-6", name: "الدكتور سالم", specialty: "العين والشبكية"},
//       { id: "doc-12", clinic_id: "clinic-6", name: "الدكتورة هالة", specialty: "العين والشبكية" },
//     ];

//     let createdDoctors = 0;
//     let existingDoctors = 0;
//     for (const doctor of doctorData) {
//       const [doctorInstance, created] = await Doctor.findOrCreate({
//         where: { id: doctor.id },
//         defaults: doctor,
//         transaction
//       });
//       if (created) {
//         createdDoctors++;
//         console.log(`  ✅ Created doctor: ${doctor.id} - ${doctor.name}`);
//       } else {
//         existingDoctors++;
//         console.log(`  ⏭️  Doctor already exists: ${doctor.id} - ${doctor.name}`);
//       }
//     }
//     console.log(`✅ Doctors: ${createdDoctors} created, ${existingDoctors} already existed`);

//     // Commit transaction
//     await transaction.commit();
//     console.log("✅ Transaction committed - New clinics and doctors added successfully (existing data preserved)");
    
//     // Verify data
//     console.log("🔍 Verifying data...");
//     const verifyClinics = await Clinic.findAll();
//     const verifyDoctors = await Doctor.findAll();
//     const verifySlots = await Slot.findAll();
//     console.log(`✅ Verification: ${verifyClinics.length} clinics, ${verifyDoctors.length} doctors, ${verifySlots.length} slots in database`);
    
//   } catch (error) {
//     // Rollback on error
//     await transaction.rollback();
//     console.error("❌ Error seeding data:", error.message);
//     console.error("Full error:", error);
//     throw error;
//   }
// };




















// const Clinic = require("../models/Clinic");
// const Doctor = require("../models/Doctor");
// const Slot = require("../models/Slot");

// module.exports = async () => {

//   //  Clinics 
//   await Clinic.bulkCreate(
//     [
//       { id: "clinic-1", name: "عيادة الأسنان" },
//       { id: "clinic-2", name: "عيادة الجلدية" },
//       { id: "clinic-3", name: "عيادة الباطنية" },
    
//     ],
//     { ignoreDuplicates: true }
//   );

//   //  Doctors 
//   await Doctor.bulkCreate(
//     [
//       // عيادة الأسنان
//       { id: "doc-1", clinic_id: "clinic-1", name: "الدكتورة سارة", specialty: "تنظيف وحشوات الأسنان" },
//       { id: "doc-2", clinic_id: "clinic-1", name: "الدكتور محمد", specialty: "تقويم الأسنان" },

//       // عيادة الجلدية
//       { id: "doc-3", clinic_id: "clinic-2", name: "الدكتور أحمد", specialty: "علاج الأكزيما وحب الشباب" },
//       { id: "doc-4", clinic_id: "clinic-2", name: "الدكتورة ريم", specialty: "الليزر التجميلي وعلاج التصبغات" },

//       // عيادة الباطنية
//       { id: "doc-5", clinic_id: "clinic-3", name: "الدكتور خالد", specialty: "أمراض الجهاز الهضمي" },
//       { id: "doc-6", clinic_id: "clinic-3", name: "الدكتورة نوف", specialty: "السكري وارتفاع ضغط الدم" },
//     ],
//     { ignoreDuplicates: true }
//   );

//   //  Slots 
//   await Slot.bulkCreate(
//     [
//       {
//         id: "slot-1",
//         doctor_id: "doc-1",
//         clinic_id: "clinic-1",
//         date: "2025-11-25",
//         time: "10:00",
//         end_time: "10:20",
//         status: "متاح",
//       },
//       {
//         id: "slot-2",
//         doctor_id: "doc-2",
//         clinic_id: "clinic-1",
//         date: "2025-11-25",
//         time: "11:00",
//         end_time: "11:20",
//         status: "متاح",
//       },
//       {
//         id: "slot-3",
//         doctor_id: "doc-3",
//         clinic_id: "clinic-2",
//         date: "2025-11-25",
//         time: "12:00",
//         end_time: "12:20",
//         status: "متاح",
//       },
//       {
//         id: "slot-4",
//         doctor_id: "doc-4",
//         clinic_id: "clinic-2",
//         date: "2025-11-25",
//         time: "13:00",
//         end_time: "13:20",
//         status: "متاح",
//       },
//     ],
//     { ignoreDuplicates: true }
//   );
// };
 

