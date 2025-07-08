/*
  Warnings:

  - You are about to drop the `project` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `project_status` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `task` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `task_status` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_project` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_task` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "project" DROP CONSTRAINT "project_created_by_id_fkey";

-- DropForeignKey
ALTER TABLE "project" DROP CONSTRAINT "project_p_status_id_fkey";

-- DropForeignKey
ALTER TABLE "task" DROP CONSTRAINT "task_added_by_id_fkey";

-- DropForeignKey
ALTER TABLE "task" DROP CONSTRAINT "task_p_id_fkey";

-- DropForeignKey
ALTER TABLE "task" DROP CONSTRAINT "task_task_status_id_fkey";

-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_role_id_fkey";

-- DropForeignKey
ALTER TABLE "user_project" DROP CONSTRAINT "user_project_assigned_to_id_fkey";

-- DropForeignKey
ALTER TABLE "user_project" DROP CONSTRAINT "user_project_project_id_fkey";

-- DropForeignKey
ALTER TABLE "user_task" DROP CONSTRAINT "user_task_assigned_to_id_fkey";

-- DropForeignKey
ALTER TABLE "user_task" DROP CONSTRAINT "user_task_related_to_id_fkey";

-- DropTable
DROP TABLE "project";

-- DropTable
DROP TABLE "project_status";

-- DropTable
DROP TABLE "role";

-- DropTable
DROP TABLE "task";

-- DropTable
DROP TABLE "task_status";

-- DropTable
DROP TABLE "user";

-- DropTable
DROP TABLE "user_project";

-- DropTable
DROP TABLE "user_task";

-- CreateTable
CREATE TABLE "User" (
    "u_id" TEXT NOT NULL,
    "u_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,
    "hash_pwd" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("u_id")
);

-- CreateTable
CREATE TABLE "Project" (
    "p_id" TEXT NOT NULL,
    "p_name" TEXT NOT NULL,
    "p_title" TEXT NOT NULL,
    "p_description" TEXT NOT NULL,
    "p_status_id" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("p_id")
);

-- CreateTable
CREATE TABLE "Task" (
    "t_id" TEXT NOT NULL,
    "t_description" TEXT NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "priority" INTEGER NOT NULL,
    "task_status_id" TEXT NOT NULL,
    "p_id" TEXT NOT NULL,
    "added_by_id" TEXT NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("t_id")
);

-- CreateTable
CREATE TABLE "User_task" (
    "ud_id" TEXT NOT NULL,
    "assigned" TIMESTAMP(3) NOT NULL,
    "related_to_id" TEXT NOT NULL,
    "assigned_to_id" TEXT NOT NULL,

    CONSTRAINT "User_task_pkey" PRIMARY KEY ("ud_id")
);

-- CreateTable
CREATE TABLE "User_project" (
    "up_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "assigned_to_id" TEXT NOT NULL,

    CONSTRAINT "User_project_pkey" PRIMARY KEY ("up_id")
);

-- CreateTable
CREATE TABLE "Role" (
    "r_id" TEXT NOT NULL,
    "role_name" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("r_id")
);

-- CreateTable
CREATE TABLE "Task_status" (
    "t_status_id" TEXT NOT NULL,
    "t_status_name" TEXT NOT NULL,

    CONSTRAINT "Task_status_pkey" PRIMARY KEY ("t_status_id")
);

-- CreateTable
CREATE TABLE "Project_status" (
    "p_status_id" TEXT NOT NULL,
    "p_status_name" TEXT NOT NULL,

    CONSTRAINT "Project_status_pkey" PRIMARY KEY ("p_status_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("r_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_p_status_id_fkey" FOREIGN KEY ("p_status_id") REFERENCES "Project_status"("p_status_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "User"("u_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_task_status_id_fkey" FOREIGN KEY ("task_status_id") REFERENCES "Task_status"("t_status_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_p_id_fkey" FOREIGN KEY ("p_id") REFERENCES "Project"("p_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_added_by_id_fkey" FOREIGN KEY ("added_by_id") REFERENCES "User"("u_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_task" ADD CONSTRAINT "User_task_related_to_id_fkey" FOREIGN KEY ("related_to_id") REFERENCES "Task"("t_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_task" ADD CONSTRAINT "User_task_assigned_to_id_fkey" FOREIGN KEY ("assigned_to_id") REFERENCES "User"("u_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_project" ADD CONSTRAINT "User_project_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("p_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_project" ADD CONSTRAINT "User_project_assigned_to_id_fkey" FOREIGN KEY ("assigned_to_id") REFERENCES "User"("u_id") ON DELETE RESTRICT ON UPDATE CASCADE;
