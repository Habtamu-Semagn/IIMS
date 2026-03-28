-- CreateTable
CREATE TABLE "School" (
    "school_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "it_coordinator" TEXT NOT NULL,

    CONSTRAINT "School_pkey" PRIMARY KEY ("school_id")
);

-- CreateTable
CREATE TABLE "Asset" (
    "asset_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "purchase_date" TIMESTAMP(3) NOT NULL,
    "warranty_expiry" TIMESTAMP(3) NOT NULL,
    "school_id" TEXT NOT NULL,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("asset_id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "ticket_id" TEXT NOT NULL,
    "issue_description" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMP(3),
    "asset_id" TEXT NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("ticket_id")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "teacher_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("teacher_id")
);

-- CreateTable
CREATE TABLE "Training" (
    "training_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Training_pkey" PRIMARY KEY ("training_id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "attendance_id" TEXT NOT NULL,
    "teacher_id" TEXT NOT NULL,
    "training_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("attendance_id")
);

-- CreateTable
CREATE TABLE "Certificate" (
    "certificate_id" TEXT NOT NULL,
    "issue_date" TIMESTAMP(3) NOT NULL,
    "sha256_hash" TEXT NOT NULL,
    "qr_code" TEXT NOT NULL,
    "teacher_id" TEXT NOT NULL,
    "training_id" TEXT NOT NULL,

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("certificate_id")
);

-- CreateTable
CREATE TABLE "Curriculum" (
    "curriculum_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "approved_by" TEXT NOT NULL,
    "approved_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Curriculum_pkey" PRIMARY KEY ("curriculum_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_email_key" ON "Teacher"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_teacher_id_training_id_key" ON "Attendance"("teacher_id", "training_id");

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "School"("school_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "Asset"("asset_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "School"("school_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "Teacher"("teacher_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_training_id_fkey" FOREIGN KEY ("training_id") REFERENCES "Training"("training_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "Teacher"("teacher_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_training_id_fkey" FOREIGN KEY ("training_id") REFERENCES "Training"("training_id") ON DELETE RESTRICT ON UPDATE CASCADE;
